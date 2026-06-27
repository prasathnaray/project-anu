import runpy
import traceback

import slicer

print("[runner] Loading conversion script", flush=True)

try:
    runpy.run_path("/app/ConvertVolToNifti.py", run_name="__main__")
except SystemExit as exc:
    code = exc.code if isinstance(exc.code, int) else 1
    print(f"[runner] Conversion script exited with {code}", flush=True)
    slicer.app.exit(code)
except BaseException:
    print("[runner] Conversion script failed before normal error handling", flush=True)
    print(traceback.format_exc(), flush=True)
    slicer.app.exit(1)
