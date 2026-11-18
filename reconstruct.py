# ============================================================
# KRETZ STIC RECONSTRUCTION TOOL
# Automatically installs missing Python dependencies.
# Supports only validated D600,0001 packed raw uint8 STIC frame data.
# Usage: python reconstruct.py input_file.vol
# ============================================================

import argparse
import importlib.util
import os
import subprocess
import sys

REQUIRED_PACKAGES = {
    "numpy": "numpy",
    "scipy": "scipy",
    "lz4": "lz4",
}


def install_dependencies():
    print("\n=== Checking Python dependencies ===")
    missing = [
        package
        for module, package in REQUIRED_PACKAGES.items()
        if importlib.util.find_spec(module) is None
    ]

    if not missing:
        print("All dependencies are already installed.")
        return

    print("Missing dependencies: " + ", ".join(missing))
    print("Installing automatically...\n")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", *missing
        ])
    except subprocess.CalledProcessError as exc:
        print("\nERROR: Dependency installation failed.")
        print("Check your internet connection and Python environment.")
        raise SystemExit(1) from exc

    print("\nDependencies installed successfully.")


install_dependencies()

import struct
import zlib
import io
import bz2
import gzip
import numpy as np
from scipy.ndimage import map_coordinates
from collections import defaultdict

def reconstruction_exception_handler(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    print("\n========================================")
    print("RECONSTRUCTION FAILED")
    print("========================================")
    print(str(exc_value))
    print("\nNo successful reconstruction is being reported.")
    sys.__excepthook__(exc_type, exc_value, exc_traceback)


sys.excepthook = reconstruction_exception_handler


def parse_args():
    parser = argparse.ArgumentParser(
        description="Reconstruct supported Kretz STIC VOL files into NRRD frames."
    )
    parser.add_argument(
        "vol_file",
        nargs="?",
        default="I0000050.vol",
        help="Input Kretz VOL file (default: I0000050.vol)",
    )
    parser.add_argument(
        "--output",
        default="stic_output",
        help="Output directory (default: stic_output)",
    )
    return parser.parse_args()


ARGS = parse_args()
VOL = ARGS.vol_file
OUT = ARGS.output

if not os.path.isfile(VOL):
    print(f"\nERROR: Input VOL file not found: {VOL}")
    print("Usage: python reconstruct.py path\\to\\file.vol")
    raise SystemExit(1)


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Load file ─────────────────────────────────────────────────────────────────
with open(VOL, 'rb') as f:
    raw = f.read()
print(f"File: {VOL}  ({len(raw):,} bytes)")
if raw[:13] != b"KRETZFILE 1.0":
    raise RuntimeError(
        "UNSUPPORTED FILE: The file does not have the expected KRETZFILE 1.0 header."
    )

# ── Walk tags ─────────────────────────────────────────────────────────────────
def walk_tags(raw, start_offset, max_tags=5000):
    tags, offset = [], start_offset
    while offset + 8 <= len(raw) and len(tags) < max_tags:
        grp  = struct.unpack('<H', raw[offset:offset+2])[0]
        elem = struct.unpack('<H', raw[offset+2:offset+4])[0]
        size = struct.unpack('<I', raw[offset+4:offset+8])[0]
        if size > len(raw) - offset - 8:
            break
        tags.append((offset, grp, elem, size, offset+8))
        if grp == 0xFFFF and elem == 0xFFFF:
            break
        offset += 8 + size
    return tags

# ── Find tag stream ───────────────────────────────────────────────────────────
# Most Type-1 STIC files start immediately after the KRETZFILE header.
# If this fails on a future file, restore the old auto-search logic.

tag_stream_start = 16
print(f"Tag stream at offset {tag_stream_start}")

all_tags = walk_tags(raw, tag_stream_start)
print(f"Parsed {len(all_tags)} tags")

tag_dict = {}
for (offset, grp, elem, size, data_off) in all_tags:
    tag_dict[(grp, elem)] = (size, data_off, offset)

def get_tag(grp, elem):
    k = (grp, elem)
    if k not in tag_dict: return None, None
    sz, d, _ = tag_dict[k]; return sz, d

def u16(g,e):
    _,d=get_tag(g,e); return struct.unpack('<H',raw[d:d+2])[0] if d else None
def f64(g,e):
    _,d=get_tag(g,e); return struct.unpack('<d',raw[d:d+8])[0] if d else None
def f64arr(g,e):
    sz,d=get_tag(g,e)
    return np.frombuffer(raw[d:d+sz],dtype='<f8') if d is not None else None

# ── Geometry ──────────────────────────────────────────────────────────────────
print("\n=== Geometry ===")
dimI = u16(0xC000,0x0001); dimJ = u16(0xC000,0x0002); dimK = u16(0xC000,0x0003)
res  = f64(0xC100,0x0001); off1 = f64(0xC200,0x0001)

print(f"dimI={dimI}  dimJ={dimJ}  dimK={dimK}  res={res}  off1={off1}")
if any(v is None for v in [dimI, dimJ, dimK, res, off1]):
    raise RuntimeError(
        "UNSUPPORTED VOL FORMAT: Required geometry tags are missing."
    )

if any(v <= 0 for v in [dimI, dimJ, dimK]) or max(dimI, dimJ, dimK) > 10000:
    raise RuntimeError("UNSUPPORTED VOL FORMAT: Invalid volume dimensions.")

if not np.isfinite(res) or res <= 0 or not np.isfinite(off1):
    raise RuntimeError("UNSUPPORTED VOL FORMAT: Invalid resolution or radial offset.")

# Read angle arrays with fallback tag IDs.
def safe_f64arr(g1,e1,g2,e2):
    a = f64arr(g1,e1)
    if a is not None: return a
    return f64arr(g2,e2)
phi_arr   = safe_f64arr(0xC300,0x0001, 0xC300,0x0401)
theta_arr = safe_f64arr(0xC300,0x0002, 0xC300,0x0402)

if phi_arr is None or theta_arr is None:
    raise RuntimeError("UNSUPPORTED VOL FORMAT: Required phi/theta angle arrays are missing.")

if len(phi_arr) != dimK:
    raise RuntimeError(
        f"UNSUPPORTED VOL FORMAT: phi array has {len(phi_arr)} values, expected dimK={dimK}."
    )
if len(theta_arr) != dimJ:
    raise RuntimeError(
        f"UNSUPPORTED VOL FORMAT: theta array has {len(theta_arr)} values, expected dimJ={dimJ}."
    )
if not np.all(np.isfinite(phi_arr)) or not np.all(np.isfinite(theta_arr)):
    raise RuntimeError("UNSUPPORTED VOL FORMAT: Angle arrays contain invalid values.")

print(f"phi  : {len(phi_arr)} values [{phi_arr[0]:.4f}..{phi_arr[-1]:.4f}] rad")
print(f"theta: {len(theta_arr)} values [{theta_arr[0]:.4f}..{theta_arr[-1]:.4f}] rad")

voxels_per_frame = dimI * dimJ * dimK
print(f"Voxels/frame: {voxels_per_frame:,}")

print(
    f"Expected D600 size for one cine cycle: "
    f"{voxels_per_frame:,} bytes/frame"
)

# ── Supported data format detection ────────────────────────────────────────────
# IMPORTANT:
# This version intentionally supports ONLY the validated format observed in:
#   - I0000025.vol: D600,0001 packed raw uint8 data, 9 frames
#   - I0000050.vol: D600,0001 packed raw uint8 data, 40 frames
#
# Other groups/layouts (including D700 per-frame BZIP2/uint16 data) are rejected.
# They must not be reconstructed until separately decoded and validated.

print("\n=== Data format validation ===")
voxels_per_frame = int(dimI) * int(dimJ) * int(dimK)
data_size, data_offset = get_tag(0xD600, 0x0001)

if data_size is None or data_offset is None:
    detected_groups = sorted({
        f"{grp:04X}"
        for (_, grp, _, size, _) in all_tags
        if 0xD000 <= grp <= 0xDFFF and size > 10_000
    })
    groups_text = ", ".join(detected_groups) if detected_groups else "none"
    raise RuntimeError(
        "UNSUPPORTED VOL FORMAT: No validated D600,0001 packed frame-data tag "
        "was found.\n"
        f"Detected large data groups: {groups_text}\n"
        "This tool currently supports only packed, raw 8-bit STIC frame data "
        "stored in tag D600,0001. Per-frame D700/D100 tags and other layouts "
        "are not supported."
    )

ratio = data_size / voxels_per_frame
n_frames = round(ratio)

print(f"Candidate data tag: D600,0001")
print(f"Data size: {data_size:,} bytes")
print(f"Bytes per frame: {voxels_per_frame:,}")
print(f"Frame ratio: {ratio:.4f}")

if not (1 <= n_frames <= 100) or abs(ratio - n_frames) > 1e-9:
    raise RuntimeError(
        "UNSUPPORTED VOL FORMAT: D600,0001 does not contain an exact integer "
        "number of supported 8-bit frames.\n"
        f"Data size: {data_size:,} bytes; expected a whole-number multiple "
        f"of {voxels_per_frame:,} bytes per frame."
    )

expected_total = n_frames * voxels_per_frame
if data_size != expected_total:
    raise RuntimeError(
        "UNSUPPORTED VOL FORMAT: Packed frame-data size is inconsistent. "
        f"Found {data_size:,} bytes; expected {expected_total:,}."
    )

# This validated layout stores each voxel as one raw uint8 byte.
# Do not attempt decompression, uint16 conversion, or per-frame-tag fallback.
print(
    f"[SUPPORTED] Layout A: D600,0001, {n_frames} packed raw uint8 frame(s)."
)

d_raw = raw[data_offset:data_offset + data_size]
if len(d_raw) != expected_total:
    raise RuntimeError(
        "UNSUPPORTED VOL FORMAT: Could not read the complete D600,0001 data block."
    )

print(f"\n=== Extracting {n_frames} validated frames ===")
frames_raw = []

for fi in range(n_frames):
    frame_start = fi * voxels_per_frame
    frame_bytes = d_raw[frame_start:frame_start + voxels_per_frame]

    if len(frame_bytes) != voxels_per_frame:
        raise RuntimeError(
            f"UNSUPPORTED VOL FORMAT: Frame {fi:02d} has an unexpected byte count."
        )

    vol = np.frombuffer(frame_bytes, dtype=np.uint8)
    frames_raw.append(vol.reshape((dimK, dimJ, dimI)))
    print(f"  Frame {fi:02d}: raw uint8, min={vol.min()} max={vol.max()}")

print(f"Loaded {len(frames_raw)} validated frames")

# ── Spherical -> Cartesian ────────────────────────────────────────────────────
res_m          = res
radial_start_m = off1 * res_m
r_arr          = radial_start_m + np.arange(dimI) * res_m
r_min, r_max   = r_arr[0], r_arr[-1]
theta_c = theta_arr - theta_arr.mean()
phi_c   = phi_arr   - phi_arr.mean()

print(f"\nRadial : {r_min*1000:.2f} - {r_max*1000:.2f} mm")
print(f"Theta  : {np.degrees(theta_c[0]):.2f} to {np.degrees(theta_c[-1]):.2f} deg")
print(f"Phi    : {np.degrees(phi_c[0]):.2f} to {np.degrees(phi_c[-1]):.2f} deg")

sp    = res_m
out_x = min(int(2 * r_max * max(abs(np.sin(theta_c[0])), abs(np.sin(theta_c[-1]))) / sp) + 4, 512)
out_z = min(int(2 * r_max * max(abs(np.sin(phi_c[0])),   abs(np.sin(phi_c[-1])))   / sp) + 4, 256)
out_y = min(int((r_max - r_min * np.cos(max(abs(theta_c[0]), abs(theta_c[-1])))) / sp) + 4, 512)
print(f"Output : {out_x} x {out_y} x {out_z}  ({out_x*sp*1000:.1f} x {out_y*sp*1000:.1f} x {out_z*sp*1000:.1f} mm)")

gx = (np.arange(out_x) - out_x/2) * sp
gy =  np.arange(out_y)             * sp + r_min
gz = (np.arange(out_z) - out_z/2) * sp
GX, GY, GZ = np.meshgrid(gx, gy, gz, indexing='ij')
GR     = np.sqrt(GX**2 + GY**2 + GZ**2)
GTHETA = np.arctan2(GX, GY)
GPHI   = np.arctan2(GZ, np.sqrt(GX**2 + GY**2))
ir = (GR     - r_arr[0])   / (r_arr[-1]   - r_arr[0])   * (dimI - 1)
ij = (GTHETA - theta_c[0]) / (theta_c[-1] - theta_c[0]) * (dimJ - 1)
ik = (GPHI   - phi_c[0])   / (phi_c[-1]   - phi_c[0])   * (dimK - 1)
inside = (ir>=0)&(ir<=dimI-1)&(ij>=0)&(ij<=dimJ-1)&(ik>=0)&(ik<=dimK-1)
coords_r = ir[inside].ravel(); coords_j = ij[inside].ravel(); coords_k = ik[inside].ravel()
print(f"Cone fill: {100*inside.sum()/inside.size:.1f}%")

os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(OUT, "previews"), exist_ok=True)

# ── Write outputs ─────────────────────────────────────────────────────────────
def pgm(arr2d, path):
    h,w = arr2d.shape
    with open(path,'wb') as f:
        f.write(f"P5\n{w} {h}\n255\n".encode())
        f.write(arr2d.astype(np.uint8).tobytes())

sp_mm = sp * 1000
for fi, sph_kji in enumerate(frames_raw):
    print(f"Frame {fi:02d}...", end=' ', flush=True)
    vals = map_coordinates(sph_kji.astype(np.float32),
                           [coords_k, coords_j, coords_r],
                           order=1, mode='constant', cval=0.0).astype(np.uint8)
    cart = np.zeros((out_x, out_y, out_z), dtype=np.uint8)
    cart[inside] = vals
    fill = 100 * np.count_nonzero(cart) / cart.size
    print(f"fill={fill:.1f}%  max={cart.max()}")

    header = (
        f"NRRD0004\ntype: uint8\ndimension: 3\n"
        f"space: left-posterior-superior\n"
        f"sizes: {out_x} {out_y} {out_z}\n"
        f"space directions: ({sp_mm:.6f},0,0) (0,{sp_mm:.6f},0) (0,0,{sp_mm:.6f})\n"
        f"kinds: domain domain domain\nendian: little\nencoding: raw\n"
        f"space origin: ({-out_x/2*sp_mm:.4f},{r_min*1000:.4f},{-out_z/2*sp_mm:.4f})\n"
        f"# STIC frame {fi}/{len(frames_raw)}  source={VOL}\n\n"
    )
    with open(f"{OUT}/frame_{fi:02d}.nrrd", 'wb') as f:
        f.write(header.encode('ascii'))
        f.write(cart.tobytes('F'))

    pgm(cart[:, out_y//2, :].T,  f"{OUT}/previews/f{fi:02d}_axial.pgm")
    pgm(cart[:, :, out_z//2].T,  f"{OUT}/previews/f{fi:02d}_sagittal.pgm")
    pgm(cart[out_x//2, :, :].T,  f"{OUT}/previews/f{fi:02d}_coronal.pgm")

print(f"\nDone. {len(frames_raw)} frames in {OUT}/")
print(f"Spacing: {sp*1000:.4f} mm isotropic")