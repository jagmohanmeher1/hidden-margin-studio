#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo corporate-thriller soundtrack (119 BPM, C#-minor) + frame-synced SFX
locked to src/episodes/ep10-mcdonalds-realestate/timings.json.
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
        repo_root, "src", "episodes", "ep10-mcdonalds-realestate", "timings.json"
    )

    duration_sec = 55.0
    scene_starts = {
        "mcd-hero": 0.0,
        "sonneborn-pivot": 8.0,
        "franchise-risk": 18.0,
        "rent-ratchet": 28.0,
        "land-monopoly": 37.8,
        "mcd-loop-outro": 47.0,
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
    out_path = os.path.join(out_dir, "ep10-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Corporate Empire Pulse (119 BPM, C#-minor: C#2=69.30Hz, E2=82.41Hz, G#2=103.83Hz)
    bpm = 119.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE
        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > duration_sec - 0.14:
            master_env = max(0.0, (duration_sec - t) / 0.14)

        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-5.8 * step_pos)
        bar_step = int(t / eighth_sec) % 16
        if bar_step in (8, 9, 10, 11):
            bass_freq = 82.41
        elif bar_step in (12, 13, 14, 15):
            bass_freq = 103.83
        else:
            bass_freq = 69.30

        bass = (
            0.75 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.25 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.20 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 138.59 * t) * 0.023
            + math.sin(2.0 * math.pi * 207.65 * t) * 0.016
            + math.sin(2.0 * math.pi * 329.63 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 138.59 * t) * 0.023
            + math.sin(2.0 * math.pi * 207.95 * t) * 0.016
            + math.sin(2.0 * math.pi * 329.30 * t) * 0.009
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
            freq = 92.0 * ((34.0 / 92.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.8 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1440.0, amp: float = 0.08) -> None:
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
            thud = math.sin(2.0 * math.pi * 56.0 * dt) * 0.76
            clang = math.sin(2.0 * math.pi * 415.30 * dt) * math.exp(-28.0 * dt) * 0.35
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    t1 = scene_starts["mcd-hero"]
    add_sub_drop(t1 + 0.01, dur=0.75, amp=0.33)
    for step in range(8):
        add_tick(t1 + 0.40 + step * 0.10, freq=1300.0 + step * 40.0, amp=0.065)

    t2 = scene_starts["sonneborn-pivot"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_chime(t2 + 0.50, (554.37, 830.61), dur=0.42, amp=0.12)
    add_stamp(t2 + 2.35, amp=0.24)

    t3 = scene_starts["franchise-risk"]
    add_sub_drop(t3, dur=0.44, amp=0.21)
    add_tick(t3 + 0.25, freq=680.0, amp=0.10)
    add_chime(t3 + 0.65, (659.25, 987.77), dur=0.45, amp=0.12)

    t4 = scene_starts["rent-ratchet"]
    add_sub_drop(t4, dur=0.44, amp=0.22)
    add_chime(t4 + 0.45, (554.37, 830.61, 1108.73), dur=0.52, amp=0.12)

    t5 = scene_starts["land-monopoly"]
    add_chime(t5 + 0.10, (554.37, 659.25), dur=0.28, amp=0.10)
    add_chime(t5 + 0.80, (659.25, 830.61), dur=0.28, amp=0.10)
    add_chime(t5 + 1.50, (830.61, 1108.73), dur=0.34, amp=0.11)
    add_stamp(t5 + 2.55, amp=0.31)

    t6 = scene_starts["mcd-loop-outro"]
    add_chime(t6 + 0.18, (830.61, 1108.73), dur=0.45, amp=0.12)
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
