#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #10 ("McDonald's $40B Real Estate Empire")
using Kokoro-82M ONNX, writes public/audio/ep10-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep10-mcdonalds-realestate/timings.json.
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
        "id": "mcd-hero",
        "sectionLabel": "01 / THE LANDLORD",
        "mood": "amber",
        "phrases": [
            {
                "tts": "McDonald's doesn't get rich flipping burgers—because McDonald's is the landlord.",
                "words": [
                    {"text": "McDonald's"},
                    {"text": "doesn't"},
                    {"text": "win"},
                    {"text": "flipping"},
                    {"text": "burgers—"},
                    {"text": "McDonald's"},
                    {"text": "is"},
                    {"text": "the"},
                    {"text": "landlord.", "tone": "amber"},
                ],
            },
            {
                "tts": "Behind the Golden Arches sits a forty-two-billion-dollar real estate empire.",
                "words": [
                    {"text": "Behind"},
                    {"text": "the"},
                    {"text": "arches"},
                    {"text": "sits"},
                    {"text": "a"},
                    {"text": "$42B", "tone": "emerald"},
                    {"text": "real", "tone": "emerald"},
                    {"text": "estate", "tone": "emerald"},
                    {"text": "empire."},
                ],
            },
        ],
    },
    {
        "id": "sonneborn-pivot",
        "sectionLabel": "02 / SONNEBORN PIVOT",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "In the fifties, Ray Kroc was nearly broke on tiny burger fees—until executive Harry Sonneborn rewrote the model.",
                "words": [
                    {"text": "Ray"},
                    {"text": "Kroc"},
                    {"text": "was"},
                    {"text": "nearly"},
                    {"text": "broke", "tone": "crimson"},
                    {"text": "on"},
                    {"text": "tiny"},
                    {"text": "burger"},
                    {"text": "royalties—"},
                ],
            },
            {
                "tts": "Sonneborn said: buy the prime corner land under every store, and lease it to the franchisee.",
                "words": [
                    {"text": "until"},
                    {"text": "Sonneborn"},
                    {"text": "said:"},
                    {"text": "buy"},
                    {"text": "the"},
                    {"text": "dirt", "tone": "amber"},
                    {"text": "and"},
                    {"text": "collect"},
                    {"text": "rent.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "franchise-risk",
        "sectionLabel": "03 / RISK OFFSHORING",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Today, franchisees run ninety-five percent of stores—eating all the beef inflation, wages, and broken fryers.",
                "words": [
                    {"text": "Franchisees"},
                    {"text": "run"},
                    {"text": "95%", "tone": "amber"},
                    {"text": "of"},
                    {"text": "stores—"},
                    {"text": "eating"},
                    {"text": "beef", "tone": "crimson"},
                    {"text": "and"},
                    {"text": "labor"},
                    {"text": "costs."},
                ],
            },
            {
                "tts": "Meanwhile, corporate skims rent off gross sales at an eighty-two percent profit margin.",
                "words": [
                    {"text": "Corporate"},
                    {"text": "skims"},
                    {"text": "rent"},
                    {"text": "off"},
                    {"text": "gross"},
                    {"text": "sales"},
                    {"text": "at"},
                    {"text": "82%", "tone": "emerald"},
                    {"text": "margin.", "tone": "emerald"},
                ],
            },
        ],
    },
    {
        "id": "rent-ratchet",
        "sectionLabel": "04 / RENT RATCHET",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Owners pay monthly base rent or a percentage of every Big Mac sold—whichever is higher.",
                "words": [
                    {"text": "Owners"},
                    {"text": "pay"},
                    {"text": "base"},
                    {"text": "rent"},
                    {"text": "OR"},
                    {"text": "a"},
                    {"text": "%", "tone": "amber"},
                    {"text": "of"},
                    {"text": "sales—"},
                    {"text": "whichever", "tone": "amber"},
                    {"text": "is"},
                    {"text": "higher."},
                ],
            },
            {
                "tts": "So when menu prices climb with inflation, corporate's rent check rises automatically.",
                "words": [
                    {"text": "When"},
                    {"text": "menu"},
                    {"text": "prices"},
                    {"text": "rise,"},
                    {"text": "corporate"},
                    {"text": "rent", "tone": "emerald"},
                    {"text": "climbs"},
                    {"text": "for"},
                    {"text": "free."},
                ],
            },
        ],
    },
    {
        "id": "land-monopoly",
        "sectionLabel": "05 / $9.8B RENT MACHINE",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "That turned McDonald's into one of Earth's biggest commercial retail landlords—",
                "words": [
                    {"text": "Now"},
                    {"text": "McDonald's"},
                    {"text": "is"},
                    {"text": "one"},
                    {"text": "of"},
                    {"text": "Earth's"},
                    {"text": "biggest"},
                    {"text": "retail", "tone": "amber"},
                    {"text": "landlords—", "tone": "amber"},
                ],
            },
            {
                "tts": "collecting nearly ten billion dollars a year in rent while tenants pay off the buildings.",
                "words": [
                    {"text": "collecting"},
                    {"text": "$9.8B+", "tone": "emerald"},
                    {"text": "in"},
                    {"text": "annual"},
                    {"text": "rent"},
                    {"text": "from"},
                    {"text": "franchise"},
                    {"text": "tenants."},
                ],
            },
        ],
    },
    {
        "id": "mcd-loop-outro",
        "sectionLabel": "06 / RENT PAYS ALL",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Fries and burgers aren't the real business—they just pay the lease,",
                "words": [
                    {"text": "Fries"},
                    {"text": "and"},
                    {"text": "burgers"},
                    {"text": "aren't"},
                    {"text": "the"},
                    {"text": "business—"},
                    {"text": "they"},
                    {"text": "pay"},
                    {"text": "the"},
                    {"text": "lease,", "tone": "emerald"},
                ],
            },
            {
                "tts": "turning fast food into Wall Street's sharpest property play, which is why...",
                "words": [
                    {"text": "making"},
                    {"text": "fast"},
                    {"text": "food"},
                    {"text": "a"},
                    {"text": "$42B", "tone": "amber"},
                    {"text": "property"},
                    {"text": "play—"},
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
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    if not os.path.exists(VOICES_PATH):
        urllib.request.urlretrieve(VOICES_URL, VOICES_PATH)


def main() -> None:
    ensure_models()
    kokoro = Kokoro(MODEL_PATH, VOICES_PATH)

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
    wav_path = os.path.join(out_audio_dir, "ep10-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep_dir = os.path.join(repo_root, "src", "episodes", "ep10-mcdonalds-realestate")
    os.makedirs(ep_dir, exist_ok=True)
    timings_path = os.path.join(ep_dir, "timings.json")
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
