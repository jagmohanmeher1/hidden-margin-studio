#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #3 ("The Medium Popcorn Decoy Trap")
using Kokoro-82M ONNX, writes public/audio/ep03-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep03-popcorn-decoy/timings.json.
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
        "id": "popcorn-hero",
        "sectionLabel": "01 / MENU MANIPULATION",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Nobody is actually supposed to buy the medium popcorn.",
                "words": [
                    {"text": "Nobody"},
                    {"text": "is"},
                    {"text": "supposed"},
                    {"text": "to"},
                    {"text": "buy"},
                    {"text": "the"},
                    {"text": "medium", "tone": "crimson"},
                    {"text": "popcorn—"},
                ],
            },
            {
                "tts": "Its entire job is to hack your brain into buying the large.",
                "words": [
                    {"text": "its"},
                    {"text": "entire"},
                    {"text": "job"},
                    {"text": "is"},
                    {"text": "hacking", "tone": "amber"},
                    {"text": "you"},
                    {"text": "into"},
                    {"text": "buying"},
                    {"text": "the"},
                    {"text": "large.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "two-tier-baseline",
        "sectionLabel": "02 / STICKER SHOCK",
        "mood": "neutral",
        "phrases": [
            {
                "tts": "When theaters tested selling just two sizes, a six-dollar small and a nine-dollar large,",
                "words": [
                    {"text": "With"},
                    {"text": "only"},
                    {"text": "two"},
                    {"text": "sizes—"},
                    {"text": "$6.00", "tone": "emerald"},
                    {"text": "small"},
                    {"text": "vs"},
                    {"text": "$9.00", "tone": "crimson"},
                    {"text": "large—"},
                ],
            },
            {
                "tts": "most moviegoers bought the small, because nine bucks felt like a total rip-off.",
                "words": [
                    {"text": "most"},
                    {"text": "people"},
                    {"text": "bought"},
                    {"text": "small,"},
                    {"text": "because"},
                    {"text": "$9.00", "tone": "crimson"},
                    {"text": "felt"},
                    {"text": "like"},
                    {"text": "a"},
                    {"text": "rip-off.", "tone": "crimson"},
                ],
            },
        ],
    },
    {
        "id": "decoy-pricing",
        "sectionLabel": "03 / THE $8.50 DECOY",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "So pricing psychologists dropped a decoy right in the middle: an eight-fifty medium.",
                "words": [
                    {"text": "So"},
                    {"text": "they"},
                    {"text": "dropped"},
                    {"text": "a"},
                    {"text": "decoy", "tone": "amber"},
                    {"text": "in"},
                    {"text": "the"},
                    {"text": "middle:"},
                    {"text": "$8.50", "tone": "amber"},
                    {"text": "medium."},
                ],
            },
            {
                "tts": "Suddenly you stop comparing six versus nine, and see a giant tub for just fifty cents more.",
                "words": [
                    {"text": "Now"},
                    {"text": "the"},
                    {"text": "large"},
                    {"text": "looks"},
                    {"text": "like"},
                    {"text": "a"},
                    {"text": "$0.50", "tone": "emerald"},
                    {"text": "bargain—", "tone": "emerald"},
                    {"text": "spiking"},
                    {"text": "sales"},
                    {"text": "40%.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "raw-corn-margin",
        "sectionLabel": "04 / 93% PROFIT MARGIN",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "And here's why theaters worship that upgrade: a nine-dollar tub holds just sixty-five cents of corn and oil,",
                "words": [
                    {"text": "Why"},
                    {"text": "theaters"},
                    {"text": "love"},
                    {"text": "it:"},
                    {"text": "a"},
                    {"text": "$9.00"},
                    {"text": "tub"},
                    {"text": "costs"},
                    {"text": "just"},
                    {"text": "$0.65", "tone": "amber"},
                    {"text": "to"},
                    {"text": "make—"},
                ],
            },
            {
                "tts": "handing the cinema a staggering ninety-three percent gross profit margin.",
                "words": [
                    {"text": "locking"},
                    {"text": "in"},
                    {"text": "a"},
                    {"text": "staggering"},
                    {"text": "93%", "tone": "emerald"},
                    {"text": "gross"},
                    {"text": "profit", "tone": "emerald"},
                    {"text": "margin."},
                ],
            },
        ],
    },
    {
        "id": "everywhere-decoys",
        "sectionLabel": "05 / HIDDEN EVERYWHERE",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Once you spot the decoy effect, you'll see it rigging menus everywhere you shop:",
                "words": [
                    {"text": "Once"},
                    {"text": "you"},
                    {"text": "spot"},
                    {"text": "the"},
                    {"text": "Decoy", "tone": "crimson"},
                    {"text": "Effect,", "tone": "crimson"},
                    {"text": "you'll"},
                    {"text": "see"},
                    {"text": "it"},
                    {"text": "everywhere:"},
                ],
            },
            {
                "tts": "from fifty-cent coffee size jumps, to awkward phone storage ladders, to streaming plans.",
                "words": [
                    {"text": "coffee"},
                    {"text": "upsizes,"},
                    {"text": "iPhone", "tone": "amber"},
                    {"text": "storage", "tone": "amber"},
                    {"text": "tiers,"},
                    {"text": "and"},
                    {"text": "subscription"},
                    {"text": "bundles."},
                ],
            },
        ],
    },
    {
        "id": "decoy-loop-outro",
        "sectionLabel": "06 / ILLUSION OF WINNING",
        "mood": "amber",
        "phrases": [
            {
                "tts": "You walk to your seat feeling clever for gaming the menu for fifty cents,",
                "words": [
                    {"text": "You"},
                    {"text": "walk"},
                    {"text": "away"},
                    {"text": "feeling"},
                    {"text": "clever", "tone": "amber"},
                    {"text": "for"},
                    {"text": "spending"},
                    {"text": "$0.50"},
                    {"text": "more,"},
                ],
            },
            {
                "tts": "when the menu quietly extracted three extra dollars from your wallet, which is why...",
                "words": [
                    {"text": "when"},
                    {"text": "the"},
                    {"text": "menu"},
                    {"text": "extracted"},
                    {"text": "$3.00", "tone": "crimson"},
                    {"text": "extra—"},
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

    # Signature "Hidden Margin Insider Thriller" custom voice blend
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

    intra_phrase_pause = 0.12
    inter_scene_pause = 0.26

    for s_idx, scene in enumerate(SCRIPT_SCENES):
        scene_start = round(current_sec, 3) if s_idx > 0 else 0.0

        for p_idx, phrase in enumerate(scene["phrases"]):
            samples, sr = kokoro.create(
                phrase["tts"],
                voice=custom_voice,
                speed=1.16,
                lang="en-us",
                trim=True,
            )
            sample_rate = sr
            dur = len(samples) / sample_rate

            p_start = round(current_sec, 3)
            pause_after = (
                intra_phrase_pause
                if p_idx < len(scene["phrases"]) - 1
                else (inter_scene_pause if s_idx < len(SCRIPT_SCENES) - 1 else 0.40)
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
    wav_path = os.path.join(out_audio_dir, "ep03-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep03_dir = os.path.join(repo_root, "src", "episodes", "ep03-popcorn-decoy")
    os.makedirs(ep03_dir, exist_ok=True)
    timings_path = os.path.join(ep03_dir, "timings.json")
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
