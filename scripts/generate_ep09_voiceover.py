#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #9 ("IKEA's One-Way Maze — The Gruen Transfer")
using Kokoro-82M ONNX, writes public/audio/ep09-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep09-ikea-maze/timings.json.
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
        "id": "ikea-hero",
        "sectionLabel": "01 / ARCHITECTURAL TRAP",
        "mood": "amber",
        "phrases": [
            {
                "tts": "IKEA's curved floorplan blocks your view every fifty feet—and quietly empties your wallet.",
                "words": [
                    {"text": "IKEA's"},
                    {"text": "curved"},
                    {"text": "maze"},
                    {"text": "blocks"},
                    {"text": "your"},
                    {"text": "view"},
                    {"text": "every"},
                    {"text": "50", "tone": "amber"},
                    {"text": "feet—", "tone": "amber"},
                ],
            },
            {
                "tts": "Retail architects call this weapon the Gruen Transfer.",
                "words": [
                    {"text": "a"},
                    {"text": "retail"},
                    {"text": "weapon"},
                    {"text": "called"},
                    {"text": "the"},
                    {"text": "Gruen", "tone": "crimson"},
                    {"text": "Transfer.", "tone": "crimson"},
                ],
            },
        ],
    },
    {
        "id": "gruen-origin",
        "sectionLabel": "02 / THE GRUEN TRANSFER",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "With curving walls and zero windows, your brain quickly loses track of time—",
                "words": [
                    {"text": "Curving"},
                    {"text": "walls"},
                    {"text": "and"},
                    {"text": "zero", "tone": "crimson"},
                    {"text": "windows", "tone": "crimson"},
                    {"text": "erase"},
                    {"text": "your"},
                    {"text": "sense"},
                    {"text": "of"},
                    {"text": "time—"},
                ],
            },
            {
                "tts": "forgetting your list and making sixty percent of IKEA cart items pure impulse.",
                "words": [
                    {"text": "making"},
                    {"text": "60%", "tone": "amber"},
                    {"text": "of"},
                    {"text": "IKEA"},
                    {"text": "purchases"},
                    {"text": "unplanned", "tone": "crimson"},
                    {"text": "impulse."},
                ],
            },
        ],
    },
    {
        "id": "upstream-anxiety",
        "sectionLabel": "03 / ONE-WAY FOMO",
        "mood": "amber",
        "phrases": [
            {
                "tts": "On a one-way path, walking backward feels awkward—so passing a lamp triggers instant FOMO.",
                "words": [
                    {"text": "On"},
                    {"text": "a"},
                    {"text": "one-way", "tone": "amber"},
                    {"text": "path,"},
                    {"text": "passing"},
                    {"text": "items"},
                    {"text": "triggers"},
                    {"text": "instant"},
                    {"text": "FOMO—", "tone": "crimson"},
                ],
            },
            {
                "tts": "Meanwhile, overflowing bins of cheap candles and clips pad your yellow bag at every bend.",
                "words": [
                    {"text": "while"},
                    {"text": "cheap"},
                    {"text": "bargain", "tone": "amber"},
                    {"text": "bins", "tone": "amber"},
                    {"text": "pad"},
                    {"text": "your"},
                    {"text": "bag"},
                    {"text": "at"},
                    {"text": "every"},
                    {"text": "turn."},
                ],
            },
        ],
    },
    {
        "id": "ikea-effect",
        "sectionLabel": "04 / SWEAT EQUITY BIAS",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "Next comes Harvard's IKEA Effect: building furniture yourself spikes how much you value it by sixty-three percent,",
                "words": [
                    {"text": "Harvard's"},
                    {"text": "IKEA", "tone": "emerald"},
                    {"text": "Effect:"},
                    {"text": "DIY"},
                    {"text": "assembly"},
                    {"text": "spikes"},
                    {"text": "value"},
                    {"text": "63%—", "tone": "emerald"},
                ],
            },
            {
                "tts": "while letting IKEA ship six times more flat-packs per truck at zero labor cost.",
                "words": [
                    {"text": "while"},
                    {"text": "shipping"},
                    {"text": "6x", "tone": "amber"},
                    {"text": "more", "tone": "amber"},
                    {"text": "boxes"},
                    {"text": "at"},
                    {"text": "$0"},
                    {"text": "assembly"},
                    {"text": "labor."},
                ],
            },
        ],
    },
    {
        "id": "meatball-finale",
        "sectionLabel": "05 / PEAK-END REWARD",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Finally, right past a three-hundred-dollar checkout, they hit you with cheap meatballs and dollar cones—",
                "words": [
                    {"text": "Right"},
                    {"text": "past"},
                    {"text": "a"},
                    {"text": "$300", "tone": "crimson"},
                    {"text": "checkout,"},
                    {"text": "$1.00", "tone": "emerald"},
                    {"text": "cones"},
                    {"text": "and"},
                    {"text": "meatballs"},
                    {"text": "appear—"},
                ],
            },
            {
                "tts": "using Peak-End psychology to overwrite checkout pain with a bargain high.",
                "words": [
                    {"text": "overwriting"},
                    {"text": "checkout", "tone": "crimson"},
                    {"text": "pain"},
                    {"text": "with"},
                    {"text": "a"},
                    {"text": "bargain", "tone": "emerald"},
                    {"text": "high."},
                ],
            },
        ],
    },
    {
        "id": "ikea-loop-outro",
        "sectionLabel": "06 / ENGINEERED MAZE",
        "mood": "amber",
        "phrases": [
            {
                "tts": "You walked in for four-dollar candles and walked out down three hundred bucks,",
                "words": [
                    {"text": "You"},
                    {"text": "came"},
                    {"text": "for"},
                    {"text": "$4.00", "tone": "emerald"},
                    {"text": "candles"},
                    {"text": "and"},
                    {"text": "left"},
                    {"text": "down"},
                    {"text": "$300,", "tone": "crimson"},
                ],
            },
            {
                "tts": "because every bend in the floor steered your brain, which is why...",
                "words": [
                    {"text": "because"},
                    {"text": "every"},
                    {"text": "bend"},
                    {"text": "steered", "tone": "amber"},
                    {"text": "your"},
                    {"text": "brain—"},
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
    wav_path = os.path.join(out_audio_dir, "ep09-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep_dir = os.path.join(repo_root, "src", "episodes", "ep09-ikea-maze")
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
