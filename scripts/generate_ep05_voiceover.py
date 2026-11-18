#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #5 ("The DoorDash Pizza Arbitrage Glitch")
using Kokoro-82M ONNX, writes public/audio/ep05-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep05-doordash-arbitrage/timings.json.
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
        "id": "pizza-hero",
        "sectionLabel": "01 / PIZZA GLITCH",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "In twenty nineteen, a pizzeria owner ordered his own pizzas on DoorDash, and got paid eight dollars a box to eat them.",
                "words": [
                    {"text": "In"},
                    {"text": "2019,", "tone": "amber"},
                    {"text": "a"},
                    {"text": "pizzeria"},
                    {"text": "got"},
                    {"text": "paid"},
                    {"text": "+$8.00", "tone": "emerald"},
                    {"text": "ordering"},
                    {"text": "its"},
                    {"text": "own"},
                    {"text": "pies—"},
                ],
            },
            {
                "tts": "It turned Silicon Valley venture capital into a personal cash machine.",
                "words": [
                    {"text": "turning"},
                    {"text": "Silicon"},
                    {"text": "Valley"},
                    {"text": "VC", "tone": "amber"},
                    {"text": "into"},
                    {"text": "a"},
                    {"text": "personal"},
                    {"text": "cash", "tone": "emerald"},
                    {"text": "machine.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "phantom-listing",
        "sectionLabel": "02 / PHANTOM SCRAPING",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "It started when angry callers complained to Ranjan Roy's friend about cold deliveries,",
                "words": [
                    {"text": "Angry"},
                    {"text": "diners"},
                    {"text": "called"},
                    {"text": "Ranjan"},
                    {"text": "Roy's"},
                    {"text": "friend"},
                    {"text": "over"},
                    {"text": "cold", "tone": "crimson"},
                    {"text": "deliveries—", "tone": "crimson"},
                ],
            },
            {
                "tts": "even though his pizzeria had never signed up for DoorDash.",
                "words": [
                    {"text": "even"},
                    {"text": "though"},
                    {"text": "his"},
                    {"text": "restaurant"},
                    {"text": "never", "tone": "crimson"},
                    {"text": "signed", "tone": "crimson"},
                    {"text": "up"},
                    {"text": "for"},
                    {"text": "DoorDash."},
                ],
            },
        ],
    },
    {
        "id": "arbitrage-loop",
        "sectionLabel": "03 / THE $16 \u2192 $24 LOOP",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "DoorDash scraped his menu, secretly subsidizing eight dollars per pie with venture capital.",
                "words": [
                    {"text": "DoorDash"},
                    {"text": "scraped"},
                    {"text": "menus—"},
                    {"text": "subsidizing"},
                    {"text": "$8.00", "tone": "crimson"},
                    {"text": "per"},
                    {"text": "pie"},
                    {"text": "with"},
                    {"text": "VC"},
                    {"text": "cash."},
                ],
            },
            {
                "tts": "So he tested the math: buying ten twenty-four-dollar pizzas on the app for one-sixty.",
                "words": [
                    {"text": "So"},
                    {"text": "he"},
                    {"text": "bought"},
                    {"text": "10"},
                    {"text": "$24.00", "tone": "emerald"},
                    {"text": "pizzas"},
                    {"text": "on"},
                    {"text": "the"},
                    {"text": "app"},
                    {"text": "for"},
                    {"text": "$160.", "tone": "amber"},
                ],
            },
        ],
    },
    {
        "id": "plain-dough-test",
        "sectionLabel": "04 / PLAIN DOUGH HACK",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Then came a wilder upgrade: why waste expensive cheese delivering to his own couch?",
                "words": [
                    {"text": "His"},
                    {"text": "next"},
                    {"text": "move:", "tone": "amber"},
                    {"text": "why"},
                    {"text": "waste"},
                    {"text": "expensive"},
                    {"text": "cheese", "tone": "crimson"},
                    {"text": "on"},
                    {"text": "himself?"},
                ],
            },
            {
                "tts": "On round two, his kitchen baked boxes of plain dough for pennies.",
                "words": [
                    {"text": "Round"},
                    {"text": "two:"},
                    {"text": "bake"},
                    {"text": "plain", "tone": "amber"},
                    {"text": "dough", "tone": "amber"},
                    {"text": "for"},
                    {"text": "pennies—"},
                    {"text": "netting"},
                    {"text": "+$75.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "vc-subsidy-trap",
        "sectionLabel": "05 / VC BLIND SPOT",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Why no fraud alert? Blitzscaling startups torch millions in investor subsidies,",
                "words": [
                    {"text": "Why"},
                    {"text": "no"},
                    {"text": "fraud"},
                    {"text": "alert?"},
                    {"text": "Blitzscaling", "tone": "crimson"},
                    {"text": "startups"},
                    {"text": "torch"},
                    {"text": "VC", "tone": "amber"},
                    {"text": "millions—"},
                ],
            },
            {
                "tts": "just to inflate order growth charts before an IPO.",
                "words": [
                    {"text": "just"},
                    {"text": "to"},
                    {"text": "inflate"},
                    {"text": "order"},
                    {"text": "growth", "tone": "emerald"},
                    {"text": "charts"},
                    {"text": "before"},
                    {"text": "an"},
                    {"text": "IPO.", "tone": "crimson"},
                ],
            },
        ],
    },
    {
        "id": "pizza-loop-outro",
        "sectionLabel": "06 / VC PAID DINNER",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "For once, a local owner beat a multi-billion-dollar algorithm at its own game,",
                "words": [
                    {"text": "For"},
                    {"text": "once,"},
                    {"text": "a"},
                    {"text": "local"},
                    {"text": "owner"},
                    {"text": "beat", "tone": "emerald"},
                    {"text": "a"},
                    {"text": "billion-dollar"},
                    {"text": "algorithm—"},
                ],
            },
            {
                "tts": "cashing seventy-five bucks per couch delivery, which is why...",
                "words": [
                    {"text": "cashing"},
                    {"text": "+$75", "tone": "emerald"},
                    {"text": "per"},
                    {"text": "couch"},
                    {"text": "delivery—"},
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

    intra_phrase_pause = 0.11
    inter_scene_pause = 0.24

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
    wav_path = os.path.join(out_audio_dir, "ep05-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep05_dir = os.path.join(repo_root, "src", "episodes", "ep05-doordash-arbitrage")
    os.makedirs(ep05_dir, exist_ok=True)
    timings_path = os.path.join(ep05_dir, "timings.json")
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
