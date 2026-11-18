#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #2 ("The Pudding Guy's 1.25M Air Miles")
using Kokoro-82M ONNX, writes public/audio/ep02-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep02-pudding-guy/timings.json.
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

SCRIPT_SCENES = [
    {
        "id": "pudding-hero",
        "sectionLabel": "01 / BARCODE ARBITRAGE",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "In nineteen ninety-nine, one civil engineer bought twelve thousand cups of chocolate pudding,",
                "words": [
                    {"text": "In"},
                    {"text": "1999,", "tone": "amber"},
                    {"text": "one"},
                    {"text": "engineer"},
                    {"text": "bought"},
                    {"text": "12,150", "tone": "emerald"},
                    {"text": "pudding"},
                    {"text": "cups—"},
                ],
            },
            {
                "tts": "and legally unlocked over one point two million free airline miles.",
                "words": [
                    {"text": "and"},
                    {"text": "legally"},
                    {"text": "unlocked"},
                    {"text": "1,253,000", "tone": "emerald"},
                    {"text": "free"},
                    {"text": "airline", "tone": "emerald"},
                    {"text": "miles.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "promo-math",
        "sectionLabel": "02 / FINE PRINT GLITCH",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Healthy Choice ran an early-bird promo offering one thousand miles for every ten barcodes.",
                "words": [
                    {"text": "Healthy"},
                    {"text": "Choice"},
                    {"text": "offered"},
                    {"text": "1,000", "tone": "emerald"},
                    {"text": "miles", "tone": "emerald"},
                    {"text": "for"},
                    {"text": "every"},
                    {"text": "10"},
                    {"text": "barcodes."},
                ],
            },
            {
                "tts": "They expected shoppers to buy three-dollar frozen dinners, but David Phillips spotted twenty-five-cent pudding.",
                "words": [
                    {"text": "They"},
                    {"text": "expected"},
                    {"text": "$3.00", "tone": "crimson"},
                    {"text": "dinners—"},
                    {"text": "he"},
                    {"text": "spotted"},
                    {"text": "$0.25", "tone": "emerald"},
                    {"text": "pudding.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "store-sweep",
        "sectionLabel": "03 / GROCERY SWEEP",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "Phillips drove to ten discount grocery stores across California, clearing every shelf.",
                "words": [
                    {"text": "Phillips"},
                    {"text": "raided"},
                    {"text": "10", "tone": "amber"},
                    {"text": "grocery"},
                    {"text": "stores,"},
                    {"text": "clearing"},
                    {"text": "every"},
                    {"text": "single"},
                    {"text": "shelf."},
                ],
            },
            {
                "tts": "When cashiers asked why, he told them he was stockpiling for the Y2K apocalypse, spending thirty-one hundred dollars.",
                "words": [
                    {"text": "His"},
                    {"text": "cover"},
                    {"text": "story:"},
                    {"text": "Y2K", "tone": "amber"},
                    {"text": "prepping—"},
                    {"text": "spending"},
                    {"text": "just"},
                    {"text": "$3,140.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "peeling-bottleneck",
        "sectionLabel": "04 / DEADLINE CRISIS",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Then came the catch: the double-miles deadline was only days away.",
                "words": [
                    {"text": "Then"},
                    {"text": "came"},
                    {"text": "the"},
                    {"text": "catch:", "tone": "crimson"},
                    {"text": "the"},
                    {"text": "deadline", "tone": "crimson"},
                    {"text": "was"},
                    {"text": "days"},
                    {"text": "away."},
                ],
            },
            {
                "tts": "His family's fingers blistered trying to peel twelve thousand tiny barcodes in time.",
                "words": [
                    {"text": "Peeling"},
                    {"text": "12,150", "tone": "crimson"},
                    {"text": "foil"},
                    {"text": "labels"},
                    {"text": "by"},
                    {"text": "hand"},
                    {"text": "was"},
                    {"text": "impossible.", "tone": "crimson"},
                ],
            },
        ],
    },
    {
        "id": "charity-twist",
        "sectionLabel": "05 / TAX WRITE-OFF",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "So Phillips struck a genius deal: he donated all the pudding to local food banks,",
                "words": [
                    {"text": "His"},
                    {"text": "genius"},
                    {"text": "move:", "tone": "amber"},
                    {"text": "donate"},
                    {"text": "the"},
                    {"text": "pudding"},
                    {"text": "to"},
                    {"text": "food", "tone": "emerald"},
                    {"text": "banks,"},
                ],
            },
            {
                "tts": "in exchange for volunteers peeling the labels, earning an eight-hundred-dollar charity tax write-off.",
                "words": [
                    {"text": "volunteers"},
                    {"text": "peeled"},
                    {"text": "every"},
                    {"text": "label—"},
                    {"text": "plus"},
                    {"text": "an"},
                    {"text": "$815", "tone": "emerald"},
                    {"text": "tax", "tone": "emerald"},
                    {"text": "write-off."},
                ],
            },
        ],
    },
    {
        "id": "boarding-loop",
        "sectionLabel": "06 / LIFETIME GOLD",
        "mood": "amber",
        "phrases": [
            {
                "tts": "For twenty-three hundred dollars net, he scored thirty-one round-trip tickets to Europe and lifetime airline status,",
                "words": [
                    {"text": "For"},
                    {"text": "$2,325", "tone": "emerald"},
                    {"text": "net,"},
                    {"text": "he"},
                    {"text": "scored"},
                    {"text": "31", "tone": "amber"},
                    {"text": "European"},
                    {"text": "flights—"},
                ],
            },
            {
                "tts": "proving corporations hate when you read the fine print, which is why...",
                "words": [
                    {"text": "proving"},
                    {"text": "it"},
                    {"text": "pays"},
                    {"text": "to"},
                    {"text": "read"},
                    {"text": "the"},
                    {"text": "fine", "tone": "amber"},
                    {"text": "print—", "tone": "amber"},
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

    # Identical signature "Hidden Margin Insider Thriller" custom voice blend
    v_michael = kokoro.get_voice_style("am_michael")
    v_onyx = kokoro.get_voice_style("am_onyx")
    v_daniel = kokoro.get_voice_style("bm_daniel")
    custom_voice = 0.55 * v_michael + 0.30 * v_onyx + 0.15 * v_daniel

    sample_rate = 24000
    audio_chunks: list[np.ndarray] = []
    current_sec = 0.08

    audio_chunks.append(np.zeros(int(current_sec * sample_rate), dtype=np.float32))

    scenes_out = []
    captions_out = []

    intra_phrase_pause = 0.11
    inter_scene_pause = 0.24

    for s_idx, scene in enumerate(SCRIPT_SCENES):
        scene_start = round(current_sec, 3) if s_idx > 0 else 0.0

        for p_idx, phrase in enumerate(scene["phrases"]):
            samples, sr = kokoro.create(
                phrase["tts"],
                voice=custom_voice,
                speed=1.18,
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

    full_mono = np.concatenate(audio_chunks)
    driven = np.tanh(full_mono * 1.35)
    peak = float(np.max(np.abs(driven))) or 1.0
    normalized = (driven / peak) * 0.87

    stereo = np.column_stack([normalized, normalized])

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_audio_dir = os.path.join(repo_root, "public", "audio")
    os.makedirs(out_audio_dir, exist_ok=True)
    wav_path = os.path.join(out_audio_dir, "ep02-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep02_dir = os.path.join(repo_root, "src", "episodes", "ep02-pudding-guy")
    os.makedirs(ep02_dir, exist_ok=True)
    timings_path = os.path.join(ep02_dir, "timings.json")
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
