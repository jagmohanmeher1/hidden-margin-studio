#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo industrial-thriller soundtrack (118 BPM, A-minor) + frame-synced SFX
locked to src/episodes/ep07-costco-hotdog/timings.json.
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
        repo_root, "src", "episodes", "ep07-costco-hotdog", "timings.json"
    )

    duration_sec = 56.0
    scene_starts = {
        "costco-hero": 0.0,
        "inflation-lock": 8.5,
        "vertical-factories": 18.8,
        "markup-cap": 28.5,
        "membership-engine": 38.6,
        "costco-loop-outro": 48.2,
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
    out_path = os.path.join(out_dir, "ep07-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Industrial Insider Pulse Bed (118 BPM, A-minor: A1=55.00Hz, C2=65.41Hz, E2=82.41Hz)
    bpm = 118.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE

        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > duration_sec - 0.14:
            master_env = max(0.0, (duration_sec - t) / 0.14)

        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-5.7 * step_pos)
        bar_step = int(t / eighth_sec) % 16
        if bar_step in (8, 9, 10, 11):
            bass_freq = 65.41  # C2
        elif bar_step in (12, 13, 14, 15):
            bass_freq = 82.41  # E2
        else:
            bass_freq = 55.00  # A1

        bass = (
            0.76 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.24 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.66 + 0.34 * math.sin(2.0 * math.pi * 0.21 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 110.00 * t) * 0.024
            + math.sin(2.0 * math.pi * 164.81 * t) * 0.017
            + math.sin(2.0 * math.pi * 261.63 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 110.00 * t) * 0.024
            + math.sin(2.0 * math.pi * 165.10 * t) * 0.017
            + math.sin(2.0 * math.pi * 261.30 * t) * 0.009
        ) * lfo

        left[i] += (bass + pad_l) * master_env
        right[i] += (bass + pad_r) * master_env

    def add_sub_drop(start_t: float, dur: float = 0.70, amp: float = 0.32) -> None:
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
            env = math.exp(-3.9 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1420.0, amp: float = 0.08) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.025 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-145.0 * dt)
            sig = math.sin(2.0 * math.pi * freq * dt) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_chime(start_t: float, freqs: tuple[float, ...], dur: float = 0.50, amp: float = 0.12) -> None:
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

    def add_lock_impact(start_t: float, amp: float = 0.30) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.36 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-14.5 * dt)
            thud = math.sin(2.0 * math.pi * 58.0 * dt) * 0.75
            clang = math.sin(2.0 * math.pi * 440.0 * dt) * math.exp(-26.0 * dt) * 0.36
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Beat 1: Price-lock padlock clamp + $4.8B membership counter ticks
    t1 = scene_starts["costco-hero"]
    add_sub_drop(t1 + 0.01, dur=0.72, amp=0.33)
    add_lock_impact(t1 + 0.32, amp=0.25)
    for step in range(8):
        add_tick(t1 + 0.65 + step * 0.10, freq=1280.0 + step * 40.0, amp=0.06)

    # Beat 2: 1985 vs $4.55 inflation slam
    t2 = scene_starts["inflation-lock"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_chime(t2 + 0.35, (440.0, 659.25), dur=0.40, amp=0.11)
    add_lock_impact(t2 + 2.10, amp=0.26)

    # Beat 3: Dual meat factory nodes
    t3 = scene_starts["vertical-factories"]
    add_sub_drop(t3, dur=0.42, amp=0.21)
    add_chime(t3 + 0.30, (523.25, 783.99), dur=0.35, amp=0.11)
    add_chime(t3 + 0.95, (587.33, 880.00), dur=0.40, amp=0.12)

    # Beat 4: 14% markup cap vs 35% supermarket
    t4 = scene_starts["markup-cap"]
    add_sub_drop(t4, dur=0.44, amp=0.22)
    add_tick(t4 + 0.25, freq=740.0, amp=0.11)
    add_chime(t4 + 0.65, (659.25, 987.77), dur=0.48, amp=0.12)

    # Beat 5: $4.8B membership fee engine + 72% operating profit stamp
    t5 = scene_starts["membership-engine"]
    add_chime(t5 + 0.10, (523.25, 659.25), dur=0.30, amp=0.10)
    add_chime(t5 + 0.80, (659.25, 987.77), dur=0.32, amp=0.11)
    add_chime(t5 + 1.50, (783.99, 1174.66), dur=0.38, amp=0.12)
    add_lock_impact(t5 + 2.55, amp=0.30)

    # Beat 6: Card scanner beep + loop lock
    t6 = scene_starts["costco-loop-outro"]
    add_chime(t6 + 0.20, (880.0, 1318.51), dur=0.42, amp=0.12)
    add_lock_impact(max(t6 + 2.0, duration_sec - 0.72), amp=0.27)

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
