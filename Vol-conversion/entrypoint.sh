#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] Starting volume conversion"
echo "[entrypoint] VOLUME_ID=${VOLUME_ID:-}"
echo "[entrypoint] S3_INPUT_KEY=${S3_INPUT_KEY:-${SUPABASE_INPUT_PATH:-}}"
echo "[entrypoint] VOLUME_NAME=${VOLUME_NAME:-}"

exec timeout 7200 xvfb-run -a /opt/Slicer/Slicer \
  --no-main-window \
  --disable-cli-modules \
  --python-code "exec(open('/app/run_conversion.py', encoding='utf-8').read())"
