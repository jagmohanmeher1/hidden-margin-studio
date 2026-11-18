#!/usr/bin/env python3
"""
Synthesizes the custom-blended neural voiceover for Episode #7 ("Costco's $1.50 Hot Dog & Membership Float")
using Kokoro-82M ONNX, writes public/audio/ep07-voiceover.wav, and exports frame-accurate
scene & caption timestamps to src/episodes/ep07-costco-hotdog/timings.json.
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
        "id": "costco-hero",
        "sectionLabel": "01 / FROZEN IN 1985",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Costco built two massive meat plants just so this hot dog would never go up ten cents.",
                "words": [
                    {"text": "Costco"},
                    {"text": "built"},
                    {"text": "two"},
                    {"text": "meat", "tone": "amber"},
                    {"text": "plants", "tone": "amber"},
                    {"text": "just"},
                    {"text": "to"},
                    {"text": "keep"},
                    {"text": "$1.50—", "tone": "emerald"},
                ],
            },
            {
                "tts": "Because Costco isn't a grocery store—it's a five-billion-dollar membership club.",
                "words": [
                    {"text": "because"},
                    {"text": "it's"},
                    {"text": "not"},
                    {"text": "a"},
                    {"text": "store—"},
                    {"text": "it's"},
                    {"text": "a"},
                    {"text": "$4.8B", "tone": "emerald"},
                    {"text": "membership", "tone": "emerald"},
                    {"text": "club."},
                ],
            },
        ],
    },
    {
        "id": "inflation-lock",
        "sectionLabel": "02 / INFLATION DEFIANCE",
        "mood": "crimson",
        "phrases": [
            {
                "tts": "Launched at a dollar fifty in nineteen eighty-five, inflation says this combo should cost four fifty-five today.",
                "words": [
                    {"text": "Priced"},
                    {"text": "$1.50", "tone": "emerald"},
                    {"text": "in"},
                    {"text": "1985—"},
                    {"text": "inflation"},
                    {"text": "says"},
                    {"text": "it"},
                    {"text": "should"},
                    {"text": "cost"},
                    {"text": "$4.55.", "tone": "crimson"},
                ],
            },
            {
                "tts": "When Costco's CEO suggested raising it, founder Jim Sinegal warned: raise the hot dog, and I'll kill you.",
                "words": [
                    {"text": "Founder"},
                    {"text": "Jim"},
                    {"text": "Sinegal"},
                    {"text": "warned:"},
                    {"text": "\"Raise", "tone": "crimson"},
                    {"text": "the"},
                    {"text": "hot"},
                    {"text": "dog,"},
                    {"text": "I'll"},
                    {"text": "kill", "tone": "crimson"},
                    {"text": "you.\""},
                ],
            },
        ],
    },
    {
        "id": "vertical-factories",
        "sectionLabel": "03 / 2 MEAT PLANTS",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Instead of hiking prices, Costco ditched outside vendors and opened its own plants in California and Illinois,",
                "words": [
                    {"text": "So"},
                    {"text": "Costco"},
                    {"text": "opened"},
                    {"text": "its"},
                    {"text": "own"},
                    {"text": "Kirkland", "tone": "amber"},
                    {"text": "meat", "tone": "amber"},
                    {"text": "plants—"},
                ],
            },
            {
                "tts": "cranking out two hundred million beef franks a year to defend that dollar-fifty sign.",
                "words": [
                    {"text": "making"},
                    {"text": "200M+", "tone": "emerald"},
                    {"text": "franks"},
                    {"text": "a"},
                    {"text": "year"},
                    {"text": "to"},
                    {"text": "defend"},
                    {"text": "$1.50.", "tone": "amber"},
                ],
            },
        ],
    },
    {
        "id": "markup-cap",
        "sectionLabel": "04 / 14% MARKUP CAP",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "While normal supermarkets mark groceries up thirty-five percent, Costco strictly caps markups at fourteen percent.",
                "words": [
                    {"text": "Supermarkets"},
                    {"text": "mark"},
                    {"text": "up"},
                    {"text": "35%—", "tone": "crimson"},
                    {"text": "Costco"},
                    {"text": "caps"},
                    {"text": "markups"},
                    {"text": "at"},
                    {"text": "14%.", "tone": "emerald"},
                ],
            },
            {
                "tts": "After wages and overhead, two hundred fifty billion in retail sales barely breaks even.",
                "words": [
                    {"text": "After"},
                    {"text": "wages,"},
                    {"text": "$250B"},
                    {"text": "in"},
                    {"text": "merchandise"},
                    {"text": "barely", "tone": "amber"},
                    {"text": "breaks"},
                    {"text": "even."},
                ],
            },
        ],
    },
    {
        "id": "membership-engine",
        "sectionLabel": "05 / 72% OF ALL PROFIT",
        "mood": "emerald",
        "phrases": [
            {
                "tts": "The real profit engine is your plastic card: annual fees collect nearly five billion dollars,",
                "words": [
                    {"text": "Your"},
                    {"text": "plastic"},
                    {"text": "card"},
                    {"text": "collects"},
                    {"text": "$4.8B+", "tone": "emerald"},
                    {"text": "in"},
                    {"text": "annual"},
                    {"text": "fees—"},
                ],
            },
            {
                "tts": "renewing at ninety-three percent to generate seventy-two percent of Costco's operating profit.",
                "words": [
                    {"text": "renewing"},
                    {"text": "at"},
                    {"text": "93%", "tone": "emerald"},
                    {"text": "for"},
                    {"text": "72%", "tone": "emerald"},
                    {"text": "of"},
                    {"text": "operating"},
                    {"text": "profit."},
                ],
            },
        ],
    },
    {
        "id": "costco-loop-outro",
        "sectionLabel": "06 / RENEWAL PSYCHOLOGY",
        "mood": "amber",
        "phrases": [
            {
                "tts": "Every cheap hot dog at the exit convinces your brain the card pays for itself,",
                "words": [
                    {"text": "Every"},
                    {"text": "$1.50", "tone": "amber"},
                    {"text": "hot"},
                    {"text": "dog"},
                    {"text": "convinces"},
                    {"text": "you"},
                    {"text": "the"},
                    {"text": "card"},
                    {"text": "pays"},
                    {"text": "off—"},
                ],
            },
            {
                "tts": "locking in your annual renewal without hesitation, which is why...",
                "words": [
                    {"text": "locking"},
                    {"text": "in"},
                    {"text": "your"},
                    {"text": "renewal", "tone": "emerald"},
                    {"text": "fee—"},
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
    wav_path = os.path.join(out_audio_dir, "ep07-voiceover.wav")
    sf.write(wav_path, stereo, sample_rate, subtype="PCM_16")

    total_duration_sec = round(len(full_mono) / sample_rate, 2)
    scenes_out[-1]["endSec"] = total_duration_sec
    captions_out[-1]["endSec"] = total_duration_sec

    ep_dir = os.path.join(repo_root, "src", "episodes", "ep07-costco-hotdog")
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
