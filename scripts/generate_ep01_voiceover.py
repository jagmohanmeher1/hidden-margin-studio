#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #1 ("Starbucks' $2B Shadow Bank")
using Kokoro-82M ONNX, writes public/audio/ep01-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep01-starbucks-bank/timings.json.
"""

import json
import os
import urllib.request
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx"
VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin"

CACHE_DIR = os.path.expanduser("~/.cache/kokoro")
MODEL_PATH = os.path.join(CACHE_DIR, "kokoro-v1.0.int8.onnx")
VOICES_PATH = os.path.join(CACHE_DIR, "voices-v1.0.bin")

# 6 Scenes x 2 Phrases = 12 Tight Editorial Phrases
SCRIPT_SCENES = [
    {
        "id": "hero-morph",
        "sectionLabel": "01 / SHADOW LEDGER",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "Starbucks isn't a coffee company anymore.",
                "words": [
                    {"text": "Starbucks"},
                    {"text": "isn't"},
                    {"text": "a"},
                    {"text": "coffee"},
                    {"text": "company"},
                    {"text": "anymore—"},
                ],
            },
            {
                "tts": "It's an unregulated bank holding nearly two billion dollars of your cash.",
                "words": [
                    {"text": "it's"},
                    {"text": "an"},
                    {"text": "unregulated", "tone": "amber"},
                    {"text": "bank", "tone": "emerald"},
                    {"text": "holding"},
                    {"text": "nearly"},
                    {"text": "$2B", "tone": "emerald"},
                    {"text": "of"},
                    {"text": "your"},
                    {"text": "cash."},
                ],
            },
        ],
    },
    {
        "id": "bank-comparison",
        "sectionLabel": "02 / DEPOSIT SCALE",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "Right now, customers keep more money inside the Starbucks app,",
                "words": [
                    {"text": "Right"},
                    {"text": "now,"},
                    {"text": "customers"},
                    {"text": "keep"},
                    {"text": "more"},
                    {"text": "money", "tone": "emerald"},
                    {"text": "inside"},
                    {"text": "the"},
                    {"text": "Starbucks"},
                    {"text": "app"},
                ],
            },
            {
                "tts": "than eighty-five percent of American regional banks hold in total deposits.",
                "words": [
                    {"text": "than"},
                    {"text": "85%", "tone": "emerald"},
                    {"text": "of"},
                    {"text": "American"},
                    {"text": "regional"},
                    {"text": "banks"},
                    {"text": "hold"},
                    {"text": "in"},
                    {"text": "total"},
                    {"text": "deposits."},
                ],
            },
        ],
    },
    {
        "id": "reload-trap",
        "sectionLabel": "03 / RELOAD FRICTION",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Here's the genius trap: the app nudges preset reloads of ten, twenty-five, or fifty dollars,",
                "words": [
                    {"text": "Here's"},
                    {"text": "the"},
                    {"text": "genius"},
                    {"text": "trap:", "tone": "amber"},
                    {"text": "preset"},
                    {"text": "reloads"},
                    {"text": "of"},
                    {"text": "$10, $25, or $50—", "tone": "emerald"},
                ],
            },
            {
                "tts": "never the exact price of a latte, permanently trapping your leftover change.",
                "words": [
                    {"text": "never"},
                    {"text": "the"},
                    {"text": "exact"},
                    {"text": "latte"},
                    {"text": "price,"},
                    {"text": "trapping", "tone": "amber"},
                    {"text": "your"},
                    {"text": "leftover"},
                    {"text": "change."},
                ],
            },
        ],
    },
    {
        "id": "system-flow",
        "sectionLabel": "04 / LEGAL LOOPHOLE",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Because that balance can only buy coffee, banking laws don't apply.",
                "words": [
                    {"text": "Because"},
                    {"text": "that"},
                    {"text": "balance"},
                    {"text": "only"},
                    {"text": "buys"},
                    {"text": "coffee,"},
                    {"text": "banking", "tone": "crimson"},
                    {"text": "laws", "tone": "crimson"},
                    {"text": "don't"},
                    {"text": "apply."},
                ],
            },
            {
                "tts": "You can't withdraw it, and Starbucks pays you zero percent interest, funding new stores for free.",
                "words": [
                    {"text": "Zero", "tone": "crimson"},
                    {"text": "withdrawals."},
                    {"text": "0.00%", "tone": "crimson"},
                    {"text": "interest—"},
                    {"text": "funding"},
                    {"text": "new"},
                    {"text": "stores"},
                    {"text": "for"},
                    {"text": "free.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "breakage-profit",
        "sectionLabel": "05 / PURE BREAKAGE",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Even wilder? Every single year, roughly two hundred million dollars on forgotten cards,",
                "words": [
                    {"text": "Even"},
                    {"text": "wilder?"},
                    {"text": "Every"},
                    {"text": "year,"},
                    {"text": "roughly"},
                    {"text": "$200M", "tone": "crimson"},
                    {"text": "on"},
                    {"text": "forgotten"},
                    {"text": "cards"},
                ],
            },
            {
                "tts": "is never spent at all, turning straight into pure corporate profit.",
                "words": [
                    {"text": "is"},
                    {"text": "never"},
                    {"text": "spent—"},
                    {"text": "turning"},
                    {"text": "straight"},
                    {"text": "into"},
                    {"text": "pure", "tone": "emerald"},
                    {"text": "corporate"},
                    {"text": "profit.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "loop-outro",
        "sectionLabel": "06 / FREE FLOAT",
        "mood": "amber",
        "phrases": [
            {
                "tts": "You think you're collecting gold stars for a free drink,",
                "words": [
                    {"text": "You"},
                    {"text": "think"},
                    {"text": "you're"},
                    {"text": "collecting"},
                    {"text": "gold", "tone": "amber"},
                    {"text": "stars", "tone": "amber"},
                    {"text": "for"},
                    {"text": "a"},
                    {"text": "free"},
                    {"text": "drink,"},
                ],
            },
            {
                "tts": "when in reality, you're handing Wall Street an interest-free loan, which is why...",
                "words": [
                    {"text": "when"},
                    {"text": "you're"},
                    {"text": "handing"},
                    {"text": "Wall"},
                    {"text": "Street"},
                    {"text": "a"},
                    {"text": "free", "tone": "amber"},
                    {"text": "loan—", "tone": "amber"},
                    {"text": "which"},
                    {"text": "is"},
                    {"text": "why..."},
                ],
            },
        ],
    },
]


def ensure_models() -> None:
    os.makedirs(CACHE_DIR, exist_ok=True)
    if not os.path.exists(MODEL_PATH):
        print(f"Downloading Kokoro model to {MODEL_PATH}...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    if not os.path.exists(VOICES_PATH):
        print(f"Downloading Kokoro voices to {VOICES_PATH}...")
        urllib.request.urlretrieve(VOICES_URL, VOICES_PATH)


def main() -> None:
    ensure_models()
    kokoro = Kokoro(MODEL_PATH, VOICES_PATH)

    # Custom "Hidden Margin Insider Thriller" voice blend (never a stock preset)
    v_michael = kokoro.get_voice_style("am_michael")
    v_onyx = kokoro.get_voice_style("am_onyx")
    v_daniel = kokoro.get_voice_style("bm_daniel")
    custom_voice = 0.55 * v_michael + 0.30 * v_onyx + 0.15 * v_daniel

    sample_rate = 24000
    audio_chunks: list[np.ndarray] = []
    current_sec = 0.08  # Tiny crisp pre-roll

    # Lead-in silence
    audio_chunks.append(np.zeros(int(current_sec * sample_rate), dtype=np.float32))

    scenes_out = []
    captions_out = []

    intra_phrase_pause = 0.14
    inter_scene_pause = 0.32

    for s_idx, scene in enumerate(SCRIPT_SCENES):
        scene_start = round(current_sec, 3) if s_idx > 0 else 0.0

        for p_idx, phrase in enumerate(scene["phrases"]):
            samples, sr = kokoro.create(
                phrase["tts"],
                voice=custom_voice,
                speed=1.10,
                lang="en-us",
                trim=True,
            )
            sample_rate = sr
            dur = len(samples) / sample_rate

            p_start = round(current_sec, 3)
            pause_after = (
                intra_phrase_pause
                if p_idx < len(scene["phrases"]) - 1
                else (inter_scene_pause if s_idx < len(SCRIPT_SCENES) - 1 else 0.42)
            )
            p_end = round(current_sec + dur + pause_after, 3)

            captions_out.append(
                {
                    "startSec": p_start,
                    "endSec": p_end,
                    "words": phrase["words"],
                }
            )

            audio_chunks.append(samples.astype(np.float32))
            audio_chunks.append(np.zeros(int(pause_after * sample_rate), dtype=np.float32))
            current_sec += dur + pause_after

        scene_end = round(current_sec, 3)
        scenes_out.append(
            {
                "id": scene["id"],
                "startSec": scene_start,
                "endSec": scene_end,
                "sectionLabel": scene["sectionLabel"],
                "mood": scene["mood"],
            }
        )

    # Concatenate and apply gentle broadcast soft-knee compression + peak normalization (-1.2 dBFS)
    full_mono = np.concatenate(audio_chunks)
    # Subtle soft saturation for warm broadcast voice presence
    driven = np.tanh(full_mono * 1.35)
    peak = float(np.max(np.abs(driven))) or 1.0
    normalized = (driven / peak) * 0.87

    # Stereo output for clean AAC encoding
    stereo = np.column_stack([normalized, normalized])

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_audio_dir = os.path.join(repo_root, "public", "audio")
    os.makedirs(out_audio_dir, exist_ok=True)
    wav_path = os.path.join(out_audio_dir, "ep01-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    # Snap final scene endSec cleanly to total_duration_sec
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    timings_path = os.path.join(
        repo_root, "src", "episodes", "ep01-starbucks-bank", "timings.json"
    )
    with open(timings_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "totalDurationSec": total_duration_sec,
                "scenes": scenes_out,
                "captions": captions_out,
            },
            f,
            indent=2,
        )

    print(
        f"Synthesized {wav_path} ({total_duration_sec:.2f}s @ {sample_rate}Hz) and wrote {timings_path}"
    )
    for sc in scenes_out:
        print(f"  Scene {sc['id']}: {sc['startSec']:.2f}s -> {sc['endSec']:.2f}s")


if __name__ == "__main__":
    main()
