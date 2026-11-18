#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo psychological-thriller soundtrack (116 BPM, C-minor) + frame-synced SFX
locked to src/episodes/ep03-popcorn-decoy/timings.json.
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
        repo_root, "src", "episodes", "ep03-popcorn-decoy", "timings.json"
    )

    duration_sec = 55.0
    scene_starts = {
        "popcorn-hero": 0.0,
        "two-tier-baseline": 8.2,
        "decoy-pricing": 17.5,
        "raw-corn-margin": 27.8,
        "everywhere-decoys": 37.8,
        "decoy-loop-outro": 47.0,
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
    out_path = os.path.join(out_dir, "ep03-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Psychological-Thriller Minimal Pulse Bed (116 BPM, C-minor: C2=65.41Hz, Eb2=77.78Hz, G2=98.00Hz)
    bpm = 116.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE

        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > duration_sec - 0.14:
            master_env = max(0.0, (duration_sec - t) / 0.14)

        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-5.9 * step_pos)
        step_idx = int(t / eighth_sec)
        bar_step = step_idx % 16
        if bar_step in (10, 11, 12, 13):
            bass_freq = 77.78  # Eb2
        elif bar_step in (14, 15):
            bass_freq = 98.00  # G2
        else:
            bass_freq = 65.41  # C2

        bass = (
            0.75 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.25 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.19 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 130.81 * t) * 0.024
            + math.sin(2.0 * math.pi * 196.00 * t) * 0.017
            + math.sin(2.0 * math.pi * 311.13 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 130.81 * t) * 0.024
            + math.sin(2.0 * math.pi * 196.35 * t) * 0.017
            + math.sin(2.0 * math.pi * 310.80 * t) * 0.009
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
            freq = 90.0 * ((33.0 / 90.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.8 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1380.0, amp: float = 0.08) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.026 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-140.0 * dt)
            sig = math.sin(2.0 * math.pi * freq * dt) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_chime(start_t: float, freqs: tuple[float, ...], dur: float = 0.52, amp: float = 0.12) -> None:
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

    def add_stamp_impact(start_t: float, amp: float = 0.30) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.38 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-14.0 * dt)
            thud = math.sin(2.0 * math.pi * 56.0 * dt) * 0.75
            clang = math.sin(2.0 * math.pi * 405.0 * dt) * math.exp(-28.0 * dt) * 0.35
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Beat 1: Opening sub-drop + 3 popcorn size pops + ticker ticks
    t1 = scene_starts["popcorn-hero"]
    add_sub_drop(t1 + 0.01, dur=0.75, amp=0.33)
    add_tick(t1 + 0.18, freq=620.0, amp=0.11)
    add_tick(t1 + 0.34, freq=820.0, amp=0.12)
    add_chime(t1 + 0.50, (783.99, 1174.66), dur=0.45, amp=0.12)

    # Beat 2: Two-tier bar chart slams
    t2 = scene_starts["two-tier-baseline"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_tick(t2 + 0.22, freq=700.0, amp=0.11)
    add_tick(t2 + 0.48, freq=520.0, amp=0.11)

    # Beat 3: $8.50 Decoy drop + $9.00 Large checkout chime + +42% slam
    t3 = scene_starts["decoy-pricing"]
    add_sub_drop(t3, dur=0.42, amp=0.21)
    add_chime(t3 + 0.55, (1046.50, 1567.98), dur=0.35, amp=0.13)
    add_stamp_impact(t3 + 2.40, amp=0.24)

    # Beat 4: $0.65 raw cost breakdown ticks + 93% profit margin counter
    t4 = scene_starts["raw-corn-margin"]
    add_sub_drop(t4, dur=0.45, amp=0.22)
    for step in range(12):
        add_tick(t4 + 0.40 + step * 0.10, freq=1240.0 + step * 35.0, amp=0.065)
    add_chime(t4 + 1.80, (523.25, 783.99, 1046.50), dur=0.65, amp=0.13)

    # Beat 5: 3 retail decoy nodes + BEHAVIORAL PRICE TRAP stamp
    t5 = scene_starts["everywhere-decoys"]
    add_chime(t5 + 0.08, (523.25, 622.25), dur=0.28, amp=0.10)
    add_chime(t5 + 0.78, (587.33, 783.99), dur=0.28, amp=0.10)
    add_chime(t5 + 1.48, (622.25, 932.33), dur=0.35, amp=0.11)
    add_stamp_impact(t5 + 2.65, amp=0.31)

    # Beat 6: Ghost decoy fade + final cash-register lock before 0:00 loop
    t6 = scene_starts["decoy-loop-outro"]
    add_chime(t6 + 0.15, (783.99, 987.77), dur=0.45, amp=0.12)
    add_stamp_impact(max(t6 + 2.0, duration_sec - 0.72), amp=0.27)

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
