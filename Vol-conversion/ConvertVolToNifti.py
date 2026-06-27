import json
import os
import posixpath
import re
import shutil
import sys
import time
import traceback
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlparse

import slicer
from supabase import Client, create_client


DEFAULT_BUCKET = "projectanu"
INPUT_DIR = Path(os.environ.get("VOL_INPUT_DIR", "/tmp/vol-input"))
OUTPUT_DIR = Path(os.environ.get("NIFTI_OUTPUT_DIR", "/tmp/nifti-output"))


def log_message(message):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}", flush=True)


def emit_result(result):
    print(f"CONVERSION_RESULT:{json.dumps(result, separators=(',', ':'))}", flush=True)


def require_env(name):
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def get_supabase_client():
    return create_client(require_env("SUPABASE_URL"), require_env("SUPABASE_KEY"))


def get_bucket_name():
    return os.environ.get("SUPABASE_BUCKET") or os.environ.get("BUCKET_NAME") or DEFAULT_BUCKET


def normalize_storage_path(value, bucket_name):
    parsed = urlparse(value)
    if parsed.scheme and parsed.netloc:
        marker = f"/storage/v1/object/public/{bucket_name}/"
        if marker in parsed.path:
            return unquote(parsed.path.split(marker, 1)[1])

        signed_marker = f"/storage/v1/object/sign/{bucket_name}/"
        if signed_marker in parsed.path:
            return unquote(parsed.path.split(signed_marker, 1)[1])

        raise RuntimeError("Input URL is not a Supabase Storage URL for the configured bucket")

    return value.lstrip("/")


def safe_filename(storage_path):
    name = posixpath.basename(storage_path.rstrip("/"))
    name = unquote(name) or "volume.vol"
    return re.sub(r"[^A-Za-z0-9._ -]+", "_", name)


def download_input(supabase: Client, bucket_name, storage_path, volume_id):
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    local_path = INPUT_DIR / f"{volume_id}_{safe_filename(storage_path)}"

    log_message(f"Downloading input from Supabase: {bucket_name}/{storage_path}")
    response = supabase.storage.from_(bucket_name).download(storage_path)

    if isinstance(response, str):
        file_bytes = response.encode("utf-8")
    else:
        file_bytes = bytes(response)

    local_path.write_bytes(file_bytes)
    log_message(f"Downloaded {local_path.stat().st_size} bytes to {local_path}")
    return local_path


def upload_output(supabase: Client, bucket_name, local_path, volume_id):
    file_bytes = local_path.read_bytes()
    storage_path = f"converted_vol_files/{local_path.name}"

    log_message(f"Uploading output to Supabase: {bucket_name}/{storage_path}")
    supabase.storage.from_(bucket_name).upload(
        path=storage_path,
        file=file_bytes,
        file_options={
            "content-type": "application/octet-stream",
            "upsert": "true",
        },
    )

    public_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
    file_size_bytes = len(file_bytes)
    file_size_kb = round(file_size_bytes / 1024, 2)
    file_size_mb = round(file_size_kb / 1024, 2)

    return {
        "success": True,
        "volume_id": volume_id,
        "storage_path": storage_path,
        "public_url": public_url,
        "file_size_bytes": file_size_bytes,
        "file_size_kb": file_size_kb,
        "file_size_mb": file_size_mb,
    }


def update_conversion_success(supabase: Client, volume_id, result):
    log_message("Updating conversion status: success")
    completed_at = datetime.now(timezone.utc).isoformat()
    supabase.table("volume_conv_logs").update(
        {
            "conversion_completion": True,
            "completed_at": completed_at,
            "error_message": None,
            "output_file": result["storage_path"],
            "output_size": result["file_size_bytes"],
            "output_size_kb": result["file_size_kb"],
            "output_size_mb": result["file_size_mb"],
            "public_url": result["public_url"],
        }
    ).eq("volume_id", volume_id).execute()

    supabase.table("volumes").update(
        {
            "conversion_process_status": False,
            "converted_file_path": result["storage_path"],
        }
    ).eq("volume_id", volume_id).execute()


def update_conversion_failure(supabase: Client, volume_id, error_message):
    log_message("Updating conversion status: failure")
    completed_at = datetime.now(timezone.utc).isoformat()
    supabase.table("volume_conv_logs").update(
        {
            "conversion_completion": False,
            "completed_at": completed_at,
            "error_message": error_message[:1000],
        }
    ).eq("volume_id", volume_id).execute()

    supabase.table("volumes").update(
        {"conversion_process_status": False}
    ).eq("volume_id", volume_id).execute()


def convert_to_nifti(input_path, volume_id, volume_name):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    log_message("Checking available Kretz modules")
    try:
        module_names = [name for name in dir(slicer.modules) if not name.startswith("_")]
        kretz_modules = [name for name in module_names if "kretz" in name.lower()]
        log_message(f"Available Kretz-related modules: {kretz_modules}")
    except Exception as exc:
        log_message(f"Could not inspect Slicer modules: {exc}")

    output_name = f"{volume_id}_{input_path.stem}.nii"
    output_path = OUTPUT_DIR / output_name

    properties = {
        "fileName": str(input_path),
        "name": volume_name,
        "scanConvert": True,
        "outputSpacing": 0.5,
    }

    volume_node = None
    try:
        log_message("Attempting KretzFile load")
        try:
            volume_node = slicer.util.loadNodeFromFile(str(input_path), "KretzFile", properties)
        except Exception as exc:
            log_message(f"Kretz loader failed or is unavailable: {exc}")

        if volume_node is None:
            log_message("Trying generic volume loader")
            volume_node = slicer.util.loadVolume(str(input_path))

        if volume_node is None:
            raise RuntimeError("Failed to load volume file")

        if not volume_node.GetImageData():
            raise RuntimeError("Loaded volume does not contain image data")

        dimensions = volume_node.GetImageData().GetDimensions()
        log_message(f"Image dimensions: {dimensions}")
        log_message(f"Saving NIFTI to {output_path}")

        saved = slicer.util.saveNode(volume_node, str(output_path), {"fileType": "NIFTI"})
        if not saved or not output_path.exists():
            raise RuntimeError("Failed to save NIFTI file")

        log_message(f"NIFTI saved locally: {output_path.stat().st_size} bytes")
        return output_path
    finally:
        if volume_node is not None:
            slicer.mrmlScene.RemoveNode(volume_node)
            log_message("Cleaned up Slicer volume node")


def cleanup():
    for folder in (INPUT_DIR, OUTPUT_DIR):
        try:
            shutil.rmtree(folder, ignore_errors=True)
        except Exception as exc:
            log_message(f"Cleanup warning for {folder}: {exc}")


def exit_slicer(exit_code):
    try:
        slicer.util.exit(exit_code)
    except Exception as exc:
        log_message(f"Slicer util exit warning: {exc}")

    try:
        slicer.app.exit(exit_code)
    except Exception as exc:
        log_message(f"Slicer app exit warning: {exc}")

    sys.exit(exit_code)


def get_job_inputs():
    volume_id = os.environ.get("VOLUME_ID")
    raw_input_path = os.environ.get("SUPABASE_INPUT_PATH") or os.environ.get("VOL_INPUT_PATH")
    volume_name = os.environ.get("VOLUME_NAME")

    if not volume_id and len(sys.argv) > 1:
        volume_id = sys.argv[1]
    if not raw_input_path and len(sys.argv) > 2:
        raw_input_path = sys.argv[2]
    if not volume_name and len(sys.argv) > 3:
        volume_name = sys.argv[3]

    missing = []
    if not volume_id:
        missing.append("VOLUME_ID")
    if not raw_input_path:
        missing.append("SUPABASE_INPUT_PATH")

    if missing:
        raise RuntimeError(f"Missing job input: {', '.join(missing)}")

    return volume_id, raw_input_path, volume_name or "volume"


def main():
    volume_id, raw_input_path, volume_name = get_job_inputs()

    log_message("=== Kretz VOL to NIFTI Conversion ===")
    log_message(f"Volume ID: {volume_id}")
    log_message(f"Input: {raw_input_path}")
    log_message(f"Volume name: {volume_name}")

    supabase = get_supabase_client()
    bucket_name = get_bucket_name()
    storage_path = normalize_storage_path(raw_input_path, bucket_name)

    local_input = download_input(supabase, bucket_name, storage_path, volume_id)
    local_output = convert_to_nifti(local_input, volume_id, volume_name)
    result = upload_output(supabase, bucket_name, local_output, volume_id)
    update_conversion_success(supabase, volume_id, result)
    emit_result(result)


if __name__ == "__main__":
    supabase_client = None
    current_volume_id = os.environ.get("VOLUME_ID") or (sys.argv[1] if len(sys.argv) > 1 else None)
    exit_code = 0

    try:
        log_message(f"Starting converter script. argv={sys.argv}")

        if os.environ.get("CONVERSION_DRY_RUN") == "1":
            log_message("Dry run requested; Slicer script launch is healthy")
            exit_slicer(0)

        supabase_client = get_supabase_client()
        main()
    except Exception as exc:
        exit_code = 1
        error_message = str(exc)
        log_message(f"ERROR: {error_message}")
        log_message(traceback.format_exc())

        if supabase_client is not None and current_volume_id:
            try:
                update_conversion_failure(supabase_client, current_volume_id, error_message)
            except Exception as status_exc:
                log_message(f"Failed to update conversion failure status: {status_exc}")

        emit_result({"success": False, "volume_id": current_volume_id, "error": error_message})
    finally:
        cleanup()

    exit_slicer(exit_code)
