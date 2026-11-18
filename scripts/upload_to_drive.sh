#!/usr/bin/env bash
set -euo pipefail

# Uploads a rendered final MP4 video into the "Hidden Margin — Final Videos" Google Drive folder.
# Usage: ./scripts/upload_to_drive.sh <local_mp4_path> [drive_filename]

LOCAL_FILE="${1:?Usage: ./scripts/upload_to_drive.sh <local_mp4_path> [drive_filename]}"
DRIVE_FOLDER_ID="12XNA0kVhccy1o_toWQNM9tQIvTFNDWNc"

if [[ ! -f "$LOCAL_FILE" ]]; then
  echo "Error: File not found: $LOCAL_FILE" >&2
  exit 1
fi

UPLOAD_PATH="$LOCAL_FILE"
TMP_DIR=""

if [[ -n "${2:-}" ]]; then
  TMP_DIR="$(mktemp -d)"
  UPLOAD_PATH="$TMP_DIR/$2"
  cp "$LOCAL_FILE" "$UPLOAD_PATH"
fi

cleanup() {
  if [[ -n "$TMP_DIR" && -d "$TMP_DIR" ]]; then
    rm -rf "$TMP_DIR"
  fi
}
trap cleanup EXIT

gdrive mutate upload "$UPLOAD_PATH" --mime-type "video/mp4" --parent "$DRIVE_FOLDER_ID"
