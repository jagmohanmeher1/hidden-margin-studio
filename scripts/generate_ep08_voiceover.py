#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #8 ("How a Retiree Solved Two State Lotteries")
using Kokoro-82M ONNX, writes public/audio/ep08-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep08-lottery-rolldown/timings.json.
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
        "id": "lottery-hero",
        "sectionLabel": "01 / 3-MINUTE MATH",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "A retired store owner read a lottery brochure for three minutes—and realized every dollar ticket became worth a dollar sixty.",
                "words": [
                    {"text": "A"},
                    {"text": "retiree"},
                    {"text": "read"},
                    {"text": "a"},
                    {"text": "brochure"},
                    {"text": "for"},
                    {"text": "3", "tone": "amber"},
                    {"text": "minutes", "tone": "amber"},
                    {"text": "and"},
                    {"text": "spotted"},
                    {"text": "$1.60", "tone": "emerald"},
                    {"text": "value—"},
                ],
            },
            {
                "tts": "Using simple arithmetic, Jerry and Marge Selbee legally beat two state lotteries for twenty-six million dollars.",
                "words": [
                    {"text": "legally"},
                    {"text": "beating"},
                    {"text": "two"},
                    {"text": "state"},
                    {"text": "lotteries"},
                    {"text": "for"},
                    {"text": "$26M", "tone": "emerald"},
                    {"text": "gross."},
                ],
            },
        ],
    },
    {
        "id": "rolldown-quirk",
        "sectionLabel": "02 / THE ROLLDOWN QUIRK",
        "mood": "amber",
        "phrases": [
            {
                "tts": "In Michigan's Winfall game, the jackpot capped at five million dollars.",
                "words": [
                    {"text": "In"},
                    {"text": "Michigan's"},
                    {"text": "Winfall,"},
                    {"text": "the"},
                    {"text": "jackpot"},
                    {"text": "capped"},
                    {"text": "at"},
                    {"text": "$5.0M.", "tone": "amber"},
                ],
            },
            {
                "tts": "Whenever nobody matched all six numbers, the entire five-million-dollar pot rolled down to four- and five-number winners.",
                "words": [
                    {"text": "With"},
                    {"text": "no"},
                    {"text": "jackpot"},
                    {"text": "winner,"},
                    {"text": "all"},
                    {"text": "$5.0M", "tone": "emerald"},
                    {"text": "rolled", "tone": "amber"},
                    {"text": "down", "tone": "amber"},
                    {"text": "to"},
                    {"text": "smaller"},
                    {"text": "prizes."},
                ],
            },
        ],
    },
    {
        "id": "town-syndicate",
        "sectionLabel": "03 / HOMETOWN SYNDICATE",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "Buying in bulk flipped gambling into positive expected value—turning thirty-six hundred dollars into sixty-three hundred on test one.",
                "words": [
                    {"text": "Bulk"},
                    {"text": "buying"},
                    {"text": "flipped"},
                    {"text": "the"},
                    {"text": "math—"},
                    {"text": "turning"},
                    {"text": "$3,600"},
                    {"text": "into"},
                    {"text": "$6,300.", "tone": "emerald"},
                ],
            },
            {
                "tts": "So Jerry formed a hometown corporation, pooling neighbor cash to print hundreds of thousands of tickets.",
                "words": [
                    {"text": "His"},
                    {"text": "hometown", "tone": "amber"},
                    {"text": "syndicate", "tone": "amber"},
                    {"text": "pooled"},
                    {"text": "cash"},
                    {"text": "for"},
                    {"text": "600K+"},
                    {"text": "tickets."},
                ],
            },
        ],
    },
    {
        "id": "massachusetts-showdown",
        "sectionLabel": "04 / MIT CLASH",
        "mood": "amber",
        "phrases": [
            {
                "tts": "When Michigan closed Winfall, they drove nine hundred miles to play an identical game in Massachusetts,",
                "words": [
                    {"text": "Next,"},
                    {"text": "they"},
                    {"text": "drove"},
                    {"text": "900", "tone": "amber"},
                    {"text": "miles", "tone": "amber"},
                    {"text": "to"},
                    {"text": "play"},
                    {"text": "Massachusetts—"},
                ],
            },
            {
                "tts": "unknowingly battling a secret syndicate of M.I.T. math majors exploiting the exact same week.",
                "words": [
                    {"text": "going"},
                    {"text": "head-to-head"},
                    {"text": "with"},
                    {"text": "an"},
                    {"text": "MIT", "tone": "emerald"},
                    {"text": "math", "tone": "emerald"},
                    {"text": "syndicate."},
                ],
            },
        ],
    },
    {
        "id": "state-audit",
        "sectionLabel": "05 / AUDIT VERDICT",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "After reporters exposed the massive buys, state auditors inspected Jerry's sixty bins of losing tickets—",
                "words": [
                    {"text": "State"},
                    {"text": "auditors", "tone": "crimson"},
                    {"text": "inspected"},
                    {"text": "all"},
                    {"text": "60"},
                    {"text": "bins"},
                    {"text": "of"},
                    {"text": "tickets—"},
                ],
            },
            {
                "tts": "finding zero laws broken, while Massachusetts still pocketed a hundred and twenty million dollars.",
                "words": [
                    {"text": "finding"},
                    {"text": "zero", "tone": "emerald"},
                    {"text": "laws", "tone": "emerald"},
                    {"text": "broken"},
                    {"text": "and"},
                    {"text": "$120M", "tone": "amber"},
                    {"text": "state"},
                    {"text": "profit."},
                ],
            },
        ],
    },
    {
        "id": "lottery-loop-outro",
        "sectionLabel": "06 / PURE ARITHMETIC",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "The Selbees walked away with nearly eight million in net profit for their family,",
                "words": [
                    {"text": "They"},
                    {"text": "netted"},
                    {"text": "$7.75M", "tone": "emerald"},
                    {"text": "in"},
                    {"text": "pure"},
                    {"text": "family"},
                    {"text": "profit—"},
                ],
            },
            {
                "tts": "all because one retiree actually checked the math on a public brochure, which is why...",
                "words": [
                    {"text": "because"},
                    {"text": "one"},
                    {"text": "retiree"},
                    {"text": "checked"},
                    {"text": "the"},
                    {"text": "math,", "tone": "amber"},
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
    wav_path = os.path.join(out_audio_dir, "ep08-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep_dir = os.path.join(repo_root, "src", "episodes", "ep08-lottery-rolldown")
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
