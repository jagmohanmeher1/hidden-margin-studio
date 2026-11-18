#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #4 ("Airlines Are Frequent-Flyer Banks")
using Kokoro-82M ONNX, writes public/audio/ep04-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep04-airline-banks/timings.json.
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
        "id": "airline-hero",
        "sectionLabel": "01 / WALL STREET SECRET",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "If Delta stopped flying tomorrow, their real profit engine wouldn't even flinch.",
                "words": [
                    {"text": "If"},
                    {"text": "Delta"},
                    {"text": "stopped"},
                    {"text": "flying,"},
                    {"text": "their"},
                    {"text": "profit", "tone": "emerald"},
                    {"text": "engine", "tone": "emerald"},
                    {"text": "wouldn't"},
                    {"text": "flinch."},
                ],
            },
            {
                "tts": "Major airlines aren't travel companies anymore—they're credit-card banks that own planes.",
                "words": [
                    {"text": "Airlines"},
                    {"text": "aren't"},
                    {"text": "travel"},
                    {"text": "companies—"},
                    {"text": "they're"},
                    {"text": "credit-card", "tone": "emerald"},
                    {"text": "banks", "tone": "emerald"},
                    {"text": "with"},
                    {"text": "planes.", "tone": "amber"},
                ],
            },
        ],
    },
    {
        "id": "margin-contrast",
        "sectionLabel": "02 / BRUTAL FLIGHT MATH",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Flying planes is brutal: fuel spikes, union crews, delays, and pricey jets",
                "words": [
                    {"text": "Flying"},
                    {"text": "is"},
                    {"text": "brutal:", "tone": "crimson"},
                    {"text": "fuel"},
                    {"text": "spikes,"},
                    {"text": "delays,"},
                    {"text": "and"},
                    {"text": "$150M", "tone": "amber"},
                    {"text": "jets—"},
                ],
            },
            {
                "tts": "leave passenger tickets with razor-thin two percent margins, or outright losses.",
                "words": [
                    {"text": "leaving"},
                    {"text": "passenger"},
                    {"text": "tickets"},
                    {"text": "at"},
                    {"text": "razor-thin"},
                    {"text": "2%", "tone": "crimson"},
                    {"text": "margins—"},
                    {"text": "or"},
                    {"text": "losses.", "tone": "crimson"},
                ],
            },
        ],
    },
    {
        "id": "bank-arbitrage",
        "sectionLabel": "03 / THE AMEX ENGINE",
        "mood": "amber",
        "phrases": [
            {
                "tts": "The real money machine is pre-selling billions of miles in bulk to Amex and Chase,",
                "words": [
                    {"text": "The"},
                    {"text": "real"},
                    {"text": "money", "tone": "emerald"},
                    {"text": "machine:"},
                    {"text": "selling"},
                    {"text": "billions"},
                    {"text": "of"},
                    {"text": "miles"},
                    {"text": "to"},
                    {"text": "Amex—", "tone": "amber"},
                ],
            },
            {
                "tts": "who hand them out every time you swipe for groceries or taxes.",
                "words": [
                    {"text": "who"},
                    {"text": "hand"},
                    {"text": "them"},
                    {"text": "out"},
                    {"text": "every"},
                    {"text": "time"},
                    {"text": "you"},
                    {"text": "swipe", "tone": "amber"},
                    {"text": "for"},
                    {"text": "groceries."},
                ],
            },
        ],
    },
    {
        "id": "collateral-reveal",
        "sectionLabel": "04 / 2020 SEC LEAK",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "When airlines mortgaged loyalty in twenty-twenty, SEC filings leaked the math:",
                "words": [
                    {"text": "When"},
                    {"text": "airlines"},
                    {"text": "mortgaged"},
                    {"text": "loyalty"},
                    {"text": "in"},
                    {"text": "2020,", "tone": "amber"},
                    {"text": "SEC"},
                    {"text": "filings"},
                    {"text": "leaked"},
                    {"text": "it:"},
                ],
            },
            {
                "tts": "United's miles hit twenty-two billion and Delta's twenty-six billion—beating their stock caps.",
                "words": [
                    {"text": "United"},
                    {"text": "hit"},
                    {"text": "$22B", "tone": "emerald"},
                    {"text": "and"},
                    {"text": "Delta"},
                    {"text": "$25.6B—", "tone": "emerald"},
                    {"text": "beating"},
                    {"text": "their"},
                    {"text": "stock"},
                    {"text": "caps!"},
                ],
            },
        ],
    },
    {
        "id": "devaluation-power",
        "sectionLabel": "05 / CENTRAL BANK POWER",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Better yet, airlines act like unregulated central banks: they print miles for zero cost,",
                "words": [
                    {"text": "Better"},
                    {"text": "yet,"},
                    {"text": "airlines"},
                    {"text": "act"},
                    {"text": "like"},
                    {"text": "central", "tone": "crimson"},
                    {"text": "banks—", "tone": "crimson"},
                    {"text": "printing"},
                    {"text": "at"},
                    {"text": "$0,", "tone": "emerald"},
                ],
            },
            {
                "tts": "and whenever too many pile up, they quietly hike award prices overnight.",
                "words": [
                    {"text": "and"},
                    {"text": "when"},
                    {"text": "miles"},
                    {"text": "pile"},
                    {"text": "up,"},
                    {"text": "they"},
                    {"text": "hike", "tone": "crimson"},
                    {"text": "award"},
                    {"text": "prices"},
                    {"text": "overnight.", "tone": "crimson"},
                ],
            },
        ],
    },
    {
        "id": "airline-loop-outro",
        "sectionLabel": "06 / FLYING BILLBOARDS",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Those aluminum tubes at thirty-five thousand feet exist mostly to keep you swiping on the ground, which is why...",
                "words": [
                    {"text": "Those"},
                    {"text": "35,000-ft"},
                    {"text": "jets"},
                    {"text": "exist"},
                    {"text": "to"},
                    {"text": "keep"},
                    {"text": "you"},
                    {"text": "swiping—", "tone": "amber"},
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
    wav_path = os.path.join(out_audio_dir, "ep04-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep04_dir = os.path.join(repo_root, "src", "episodes", "ep04-airline-banks")
    os.makedirs(ep04_dir, exist_ok=True)
    timings_path = os.path.join(ep04_dir, "timings.json")
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
