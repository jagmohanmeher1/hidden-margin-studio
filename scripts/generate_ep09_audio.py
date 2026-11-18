#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo hypnotic psychological-thriller soundtrack (115 BPM, F#-minor) + frame-synced SFX
locked to src/episodes/ep09-ikea-maze/timings.json.
"""

import json
import math
import os
import struct
import wave

SAMPLE_RATE = 44100


def clamp(val: float) -> int:
    return max(-32767, min(32767, int(val * 32767.0)))


def main() -> None:
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    timings_path = os.path.join(
        repo_root, "src", "episodes", "ep09-ikea-maze", "timings.json"
    )

    duration_sec = 55.0
    scene_starts = {
        "ikea-hero": 0.0,
        "gruen-origin": 8.0,
        "upstream-anxiety": 17.5,
        "ikea-effect": 27.8,
        "meatball-finale": 38.0,
        "ikea-loop-outro": 47.0,
    }

    if os.path.exists(timings_path):
        with open(timings_path, "r", encoding="utf-8") as f:
            timings = json.load(f)
        duration_sec = float(timings["totalDurationSec"])
        for sc in timings.get("scenes", []):
            scene_starts[sc["id"]] = float(sc["startSec"])

    total_samples = int(SAMPLE_RATE * duration_sec)
    out_dir = os.path.join(repo_root, "public", "audio")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "ep09-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Hypnotic Maze Pulse (115 BPM, F#-minor: F#1=46.25Hz, A1=55.00Hz, C#2=69.30Hz)
    bpm = 115.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE
        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > duration_sec - 0.14:
            master_env = max(0.0, (duration_sec - t) / 0.14)

        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-5.6 * step_pos)
        bar_step = int(t / eighth_sec) % 16
        if bar_step in (8, 9, 10, 11):
            bass_freq = 55.00
        elif bar_step in (12, 13, 14, 15):
            bass_freq = 69.30
        else:
            bass_freq = 46.25

        bass = (
            0.72 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.28 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.64 + 0.36 * math.sin(2.0 * math.pi * 0.17 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 185.00 * t) * 0.021
            + math.sin(2.0 * math.pi * 220.00 * t) * 0.016
            + math.sin(2.0 * math.pi * 277.18 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 185.00 * t) * 0.021
            + math.sin(2.0 * math.pi * 220.35 * t) * 0.016
            + math.sin(2.0 * math.pi * 276.85 * t) * 0.009
        ) * lfo

        left[i] += (bass + pad_l) * master_env
        right[i] += (bass + pad_r) * master_env

    def add_sub_drop(start_t: float, dur: float = 0.72, amp: float = 0.32) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        phase = 0.0
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            p = k / n
            freq = 88.0 * ((33.0 / 88.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.8 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1360.0, amp: float = 0.08) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.024 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-145.0 * dt)
            sig = math.sin(2.0 * math.pi * freq * dt) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_chime(start_t: float, freqs: tuple[float, ...], dur: float = 0.48, amp: float = 0.12) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-5.4 * dt)
            sig = sum(math.sin(2.0 * math.pi * f * dt) for f in freqs) / len(freqs)
            left[idx] += sig * env * amp
            right[idx] += sig * env * amp * 0.95

    def add_stamp(start_t: float, amp: float = 0.30) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.36 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-14.0 * dt)
            thud = math.sin(2.0 * math.pi * 54.0 * dt) * 0.76
            clang = math.sin(2.0 * math.pi * 395.0 * dt) * math.exp(-28.0 * dt) * 0.34
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    t1 = scene_starts["ikea-hero"]
    add_sub_drop(t1 + 0.01, dur=0.75, amp=0.33)
    for step in range(6):
        add_tick(t1 + 0.30 + step * 0.14, freq=920.0 + step * 80.0, amp=0.075)

    t2 = scene_starts["gruen-origin"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_tick(t2 + 0.25, freq=660.0, amp=0.10)
    add_chime(t2 + 0.65, (554.37, 830.61), dur=0.42, amp=0.11)

    t3 = scene_starts["upstream-anxiety"]
    add_sub_drop(t3, dur=0.42, amp=0.21)
    add_chime(t3 + 0.50, (739.99, 1108.73), dur=0.38, amp=0.12)
    add_stamp(t3 + 2.35, amp=0.24)

    t4 = scene_starts["ikea-effect"]
    add_sub_drop(t4, dur=0.44, amp=0.22)
    add_chime(t4 + 0.45, (554.37, 880.0, 1108.73), dur=0.52, amp=0.12)

    t5 = scene_starts["meatball-finale"]
    add_chime(t5 + 0.10, (440.0, 659.25), dur=0.28, amp=0.10)
    add_chime(t5 + 0.80, (554.37, 830.61), dur=0.28, amp=0.10)
    add_chime(t5 + 1.50, (659.25, 987.77), dur=0.34, amp=0.11)
    add_stamp(t5 + 2.55, amp=0.31)

    t6 = scene_starts["ikea-loop-outro"]
    add_chime(t6 + 0.18, (739.99, 1108.73), dur=0.45, amp=0.12)
    add_stamp(max(t6 + 2.0, duration_sec - 0.72), amp=0.27)

    with wave.open(out_path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        frames = bytearray(total_samples * 4)
        for i in range(total_samples):
            struct.pack_into("<hh", frames, i * 4, clamp(left[i]), clamp(right[i]))
        wf.writeframes(frames)

    print(f"Generated {out_path} ({duration_sec:.2f}s, {os.path.getsize(out_path) / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
