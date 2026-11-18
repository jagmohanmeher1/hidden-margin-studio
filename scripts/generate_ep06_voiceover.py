#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #6 ("Why Fancy Menus Deleted the '$' Sign")
using Kokoro-82M ONNX, writes public/audio/ep06-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep06-menu-dollar-sign/timings.json.
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
        "id": "menu-hero",
        "sectionLabel": "01 / MENU SURGERY",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Next time you're at a nice restaurant, look closely at the prices, there's a psychological reason the dollar sign is missing.",
                "words": [
                    {"text": "At"},
                    {"text": "nice"},
                    {"text": "restaurants,"},
                    {"text": "there's"},
                    {"text": "a"},
                    {"text": "reason"},
                    {"text": "the"},
                    {"text": '"$"', "tone": "crimson"},
                    {"text": "sign", "tone": "crimson"},
                    {"text": "is"},
                    {"text": "missing—"},
                ],
            },
            {
                "tts": "Deleting that single symbol quietly tricks your table into spending eight percent more.",
                "words": [
                    {"text": "deleting"},
                    {"text": "that"},
                    {"text": "symbol"},
                    {"text": "quietly", "tone": "amber"},
                    {"text": "tricks"},
                    {"text": "you"},
                    {"text": "into"},
                    {"text": "spending"},
                    {"text": "8%", "tone": "emerald"},
                    {"text": "more.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "cornell-study",
        "sectionLabel": "02 / CORNELL STUDY",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "Cornell University researchers handed diners three identical menus:",
                "words": [
                    {"text": "Cornell", "tone": "amber"},
                    {"text": "researchers"},
                    {"text": "handed"},
                    {"text": "diners"},
                    {"text": "three"},
                    {"text": "identical"},
                    {"text": "restaurant"},
                    {"text": "menus:"},
                ],
            },
            {
                "tts": "one with dollar signs, one spelling out dollars, and one with naked numbers like twenty-eight.",
                "words": [
                    {"text": '"$28.00,"', "tone": "crimson"},
                    {"text": "the"},
                    {"text": "word"},
                    {"text": '"dollars,"'},
                    {"text": "or"},
                    {"text": "naked", "tone": "emerald"},
                    {"text": "numerals", "tone": "emerald"},
                    {"text": "like"},
                    {"text": '"28."', "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "pain-of-paying",
        "sectionLabel": "03 / PAIN OF PAYING",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Economists call it the pain of paying: a currency symbol reminds your brain you're losing money,",
                "words": [
                    {"text": "It's"},
                    {"text": "the"},
                    {"text": '"pain', "tone": "crimson"},
                    {"text": "of"},
                    {"text": 'paying"—', "tone": "crimson"},
                    {"text": "currency"},
                    {"text": "symbols"},
                    {"text": "trigger"},
                    {"text": "loss", "tone": "crimson"},
                    {"text": "alarms,"},
                ],
            },
            {
                "tts": "while a naked twenty-eight reads like a harmless recipe weight or page number.",
                "words": [
                    {"text": "while"},
                    {"text": "a"},
                    {"text": "naked"},
                    {"text": '"28"', "tone": "emerald"},
                    {"text": "reads"},
                    {"text": "like"},
                    {"text": "a"},
                    {"text": "harmless", "tone": "amber"},
                    {"text": "page"},
                    {"text": "number."},
                ],
            },
        ],
    },
    {
        "id": "golden-triangle",
        "sectionLabel": "04 / $95 ANCHOR BAIT",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Restaurants stack that with eye-tracking geometry, planting a ninety-five-dollar ribeye in the top-right corner,",
                "words": [
                    {"text": "Next,"},
                    {"text": "they"},
                    {"text": "plant"},
                    {"text": "an"},
                    {"text": "overpriced"},
                    {"text": "$95", "tone": "crimson"},
                    {"text": "ribeye", "tone": "amber"},
                    {"text": "in"},
                    {"text": "the"},
                    {"text": "top-right—"},
                ],
            },
            {
                "tts": "not to sell, just making the thirty-eight-dollar pasta below it feel cheap.",
                "words": [
                    {"text": "not"},
                    {"text": "to"},
                    {"text": "sell,"},
                    {"text": "just"},
                    {"text": "so"},
                    {"text": "the"},
                    {"text": "$38", "tone": "emerald"},
                    {"text": "pasta"},
                    {"text": "below"},
                    {"text": "feels"},
                    {"text": "cheap.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "menu-stack",
        "sectionLabel": "05 / FULL MENU PLAYBOOK",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Add shaded boxes and lush sensory adjectives like wood-fired heirloom,",
                "words": [
                    {"text": "Add"},
                    {"text": "shaded", "tone": "amber"},
                    {"text": "boxes"},
                    {"text": "and"},
                    {"text": "sensory"},
                    {"text": "words"},
                    {"text": "like"},
                    {"text": '"wood-fired', "tone": "amber"},
                    {"text": 'heirloom,"', "tone": "amber"},
                ],
            },
            {
                "tts": "and every square inch of the page is steering your wallet.",
                "words": [
                    {"text": "and"},
                    {"text": "every"},
                    {"text": "inch"},
                    {"text": "of"},
                    {"text": "the"},
                    {"text": "page"},
                    {"text": "is"},
                    {"text": "steering", "tone": "crimson"},
                    {"text": "your"},
                    {"text": "wallet.", "tone": "crimson"},
                ],
            },
        ],
    },
    {
        "id": "menu-loop-outro",
        "sectionLabel": "06 / CHECK PLEASE",
        "mood": "amber",
        "phrases": [
            {
                "tts": "You thought it was minimalist graphic design,",
                "words": [
                    {"text": "You"},
                    {"text": "thought"},
                    {"text": "it"},
                    {"text": "was"},
                    {"text": "minimalist", "tone": "amber"},
                    {"text": "graphic"},
                    {"text": "design,"},
                ],
            },
            {
                "tts": "when it was behavioral math engineered to pad your check, which is why...",
                "words": [
                    {"text": "when"},
                    {"text": "it"},
                    {"text": "was"},
                    {"text": "behavioral", "tone": "crimson"},
                    {"text": "math"},
                    {"text": "padding"},
                    {"text": "your"},
                    {"text": "check—", "tone": "crimson"},
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
    wav_path = os.path.join(out_audio_dir, "ep06-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep06_dir = os.path.join(repo_root, "src", "episodes", "ep06-menu-dollar-sign")
    os.makedirs(ep06_dir, exist_ok=True)
    timings_path = os.path.join(ep06_dir, "timings.json")
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
