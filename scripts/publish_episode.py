#!/usr/bin/env python3
"""
End-to-end render, audio loudness verification, Google Drive upload, Google Sheet sync,
and continuous GitHub commit/push pipeline for Hidden Margin episodes.
"""

import json
import os
import re
import subprocess
import sys

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SHEET_ID = "1XuEdAb-hchvJ1egNnzM9EeGEMO8kNJD1xZSHxkYiMXQ"

EPISODE_CATALOG = {
    "EP04": {
        "row": 5,
        "composition": "Ep04-AirlineBanks",
        "mp4": "out/ep04-airline-banks.mp4",
        "driveName": "EP04 - Airlines Are Frequent-Flyer Banks (1080x1920 60fps).mp4",
        "title": "Airlines Are Frequent-Flyer Banks",
        "timings": "src/episodes/ep04-airline-banks/timings.json",
    },
    "EP05": {
        "row": 6,
        "composition": "Ep05-DoorDashArbitrage",
        "mp4": "out/ep05-doordash-arbitrage.mp4",
        "driveName": "EP05 - The DoorDash Pizza Arbitrage Glitch (1080x1920 60fps).mp4",
        "title": "The DoorDash Pizza Arbitrage Glitch",
        "timings": "src/episodes/ep05-doordash-arbitrage/timings.json",
    },
    "EP06": {
        "row": 7,
        "composition": "Ep06-MenuDollarSign",
        "mp4": "out/ep06-menu-dollar-sign.mp4",
        "driveName": "EP06 - Why Fancy Menus Deleted the Dollar Sign (1080x1920 60fps).mp4",
        "title": "Why Fancy Menus Deleted the '$' Sign",
        "timings": "src/episodes/ep06-menu-dollar-sign/timings.json",
    },
    "EP07": {
        "row": 8,
        "composition": "Ep07-CostcoHotDog",
        "mp4": "out/ep07-costco-hotdog.mp4",
        "driveName": "EP07 - Costcos 1.50 Hot Dog and Membership Float (1080x1920 60fps).mp4",
        "title": "Costco's $1.50 Hot Dog & Membership Float",
        "timings": "src/episodes/ep07-costco-hotdog/timings.json",
    },
    "EP08": {
        "row": 9,
        "composition": "Ep08-LotteryRolldown",
        "mp4": "out/ep08-lottery-rolldown.mp4",
        "driveName": "EP08 - How a Retiree Solved Two State Lotteries (1080x1920 60fps).mp4",
        "title": "How a Retiree Solved Two State Lotteries",
        "timings": "src/episodes/ep08-lottery-rolldown/timings.json",
    },
    "EP09": {
        "row": 10,
        "composition": "Ep09-IkeaMaze",
        "mp4": "out/ep09-ikea-maze.mp4",
        "driveName": "EP09 - IKEAs One-Way Maze Gruen Transfer (1080x1920 60fps).mp4",
        "title": "IKEA's One-Way Maze (The Gruen Transfer)",
        "timings": "src/episodes/ep09-ikea-maze/timings.json",
    },
    "EP10": {
        "row": 11,
        "composition": "Ep10-McDonaldsRealEstate",
        "mp4": "out/ep10-mcdonalds-realestate.mp4",
        "driveName": "EP10 - McDonalds 40B Real Estate Empire (1080x1920 60fps).mp4",
        "title": "McDonald's $40B Real Estate Empire",
        "timings": "src/episodes/ep10-mcdonalds-realestate/timings.json",
    },
}


def run_cmd(cmd: list[str], capture: bool = False) -> str:
    print(f"+ {' '.join(cmd)}", flush=True)
    res = subprocess.run(
        cmd,
        cwd=REPO_ROOT,
        text=True,
        capture_output=capture,
        check=True,
    )
    return (res.stdout or "") + (res.stderr or "")


def publish_one(ep_code: str) -> None:
    meta = EPISODE_CATALOG[ep_code]
    mp4_path = os.path.join(REPO_ROOT, meta["mp4"])
    timings_path = os.path.join(REPO_ROOT, meta["timings"])

    with open(timings_path, "r", encoding="utf-8") as f:
        duration_sec = float(json.load(f)["totalDurationSec"])

    print(f"\n==================== {ep_code}: {meta['title']} ({duration_sec:.2f}s) ====================", flush=True)

    # 1. Render 1080x1920 @ 60fps MP4
    run_cmd(
        [
            "npx",
            "remotion",
            "render",
            "src/index.ts",
            meta["composition"],
            meta["mp4"],
            "--concurrency=2",
            "--browser-executable=/usr/bin/chromium",
        ]
    )

    # 2. Verify audio stream & loudness
    vol_out = run_cmd(
        [
            "ffmpeg",
            "-hide_banner",
            "-i",
            mp4_path,
            "-af",
            "volumedetect",
            "-f",
            "null",
            "-",
        ],
        capture=True,
    )
    max_match = re.search(r"max_volume:\s*([-\d.]+)\s*dB", vol_out)
    mean_match = re.search(r"mean_volume:\s*([-\d.]+)\s*dB", vol_out)
    max_vol = float(max_match.group(1)) if max_match else -99.0
    mean_vol = float(mean_match.group(1)) if mean_match else -99.0
    print(f"Verified {ep_code} audio: mean_volume={mean_vol:.1f} dB, max_volume={max_vol:.1f} dB", flush=True)
    if max_vol < -8.0:
        raise RuntimeError(f"{ep_code} voiceover too quiet! max_volume={max_vol} dB")

    # 3. Upload to Google Drive folder
    up_out = run_cmd(
        ["bash", "scripts/upload_to_drive.sh", meta["mp4"], meta["driveName"]],
        capture=True,
    )
    print(up_out.strip(), flush=True)
    id_match = re.search(r"\(ID:\s*([A-Za-z0-9_-]+)\)", up_out)
    if not id_match:
        raise RuntimeError(f"Could not parse Drive File ID from output: {up_out}")
    drive_id = id_match.group(1)
    drive_url = f"https://drive.google.com/file/d/{drive_id}/view"

    # 4. Update Google Sheet (Publishing_Queue + Full_18_Backlog)
    row = meta["row"]
    zero_row = row - 1
    hyperlink_formula = f'=HYPERLINK("{drive_url}"\\, "Watch / Download {ep_code} MP4")'

    run_cmd(["gsheets", "mutate", "write", SHEET_ID, f"Publishing_Queue!B{row}", "READY TO PUBLISH"])
    run_cmd(["gsheets", "mutate", "write", SHEET_ID, f"Publishing_Queue!E{row}", hyperlink_formula])
    run_cmd(["gsheets", "mutate", "write", SHEET_ID, f"Full_18_Backlog!G{row}", "RENDERED & UPLOADED"])
    run_cmd(
        [
            "gsheets",
            "mutate",
            "format",
            SHEET_ID,
            "--sheet-id",
            "0",
            "--start-row",
            str(zero_row),
            "--end-row",
            str(row),
            "--start-col",
            "1",
            "--end-col",
            "2",
            "--bold",
            "--bg-color",
            "#DCFCE7",
            "--fg-color",
            "#065F46",
            "--wrap",
        ]
    )
    run_cmd(
        [
            "gsheets",
            "mutate",
            "format",
            SHEET_ID,
            "--sheet-id",
            "1068615299",
            "--start-row",
            str(zero_row),
            "--end-row",
            str(row),
            "--start-col",
            "6",
            "--end-col",
            "7",
            "--bold",
            "--bg-color",
            "#DCFCE7",
            "--fg-color",
            "#065F46",
            "--wrap",
        ]
    )

    # 5. Update config/publishing.json
    pub_json_path = os.path.join(REPO_ROOT, "config", "publishing.json")
    with open(pub_json_path, "r", encoding="utf-8") as f:
        pub_data = json.load(f)
    pub_data["episodes"][ep_code] = {
        "title": meta["title"],
        "durationSec": duration_sec,
        "driveFileId": drive_id,
        "driveFileUrl": drive_url,
    }
    with open(pub_json_path, "w", encoding="utf-8") as f:
        json.dump(pub_data, f, indent=2)
        f.write("\n")

    # 6. Continuous git commit & push
    run_cmd(["git", "add", "config/publishing.json"])
    run_cmd(
        [
            "git",
            "commit",
            "-m",
            f"chore(publishing): link uploaded {ep_code} 60fps MP4 in Google Drive manifest",
        ]
    )
    run_cmd(["git", "push", "origin", "main"])
    print(f"COMPLETED {ep_code} -> {drive_url}", flush=True)


def main() -> None:
    targets = sys.argv[1:] or list(EPISODE_CATALOG.keys())
    for ep in targets:
        publish_one(ep.upper())


if __name__ == "__main__":
    main()
