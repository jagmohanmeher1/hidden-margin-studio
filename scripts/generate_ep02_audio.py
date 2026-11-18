#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo heist-thriller soundtrack + frame-synced SFX (barcode scanner beeps,
clock ticks, legal stamp slam, and airline cabin chime) locked to src/episodes/ep02-pudding-guy/timings.json.
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
        repo_root, "src", "episodes", "ep02-pudding-guy", "timings.json"
    )

    duration_sec = 52.0
    scene_starts = {
        "pudding-hero": 0.0,
        "promo-math": 8.0,
        "store-sweep": 17.5,
        "peeling-bottleneck": 27.5,
        "charity-twist": 35.5,
        "boarding-loop": 45.0,
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
    out_path = os.path.join(out_dir, "ep02-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Heist-Thriller Minimal Pulse Bed (122 BPM, E-minor: E2=82.41Hz, G2=98.00Hz, B1=61.74Hz)
    bpm = 122.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE

        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > duration_sec - 0.14:
            master_env = max(0.0, (duration_sec - t) / 0.14)

        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-6.0 * step_pos)
        step_idx = int(t / eighth_sec)
        bar_step = step_idx % 16
        if bar_step in (10, 11, 12, 13):
            bass_freq = 98.00  # G2
        elif bar_step in (14, 15):
            bass_freq = 61.74  # B1
        else:
            bass_freq = 82.41  # E2

        bass = (
            0.74 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.26 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.21 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 164.81 * t) * 0.023
            + math.sin(2.0 * math.pi * 246.94 * t) * 0.016
            + math.sin(2.0 * math.pi * 392.00 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 164.81 * t) * 0.023
            + math.sin(2.0 * math.pi * 247.30 * t) * 0.016
            + math.sin(2.0 * math.pi * 391.60 * t) * 0.009
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
            freq = 96.0 * ((36.0 / 96.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.9 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_scanner_beep(start_t: float, freq: float = 2480.0, dur: float = 0.065, amp: float = 0.11) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            # Smooth attack/release envelope for supermarket laser beep
            env = min(1.0, k / 120.0) * min(1.0, (n - k) / 220.0)
            sig = (
                0.82 * math.sin(2.0 * math.pi * freq * dt)
                + 0.18 * math.sin(2.0 * math.pi * (freq * 2.0) * dt)
            ) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1420.0, amp: float = 0.08) -> None:
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

    def add_chime(start_t: float, freqs: tuple[float, ...], dur: float = 0.55, amp: float = 0.12) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-5.2 * dt)
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
            thud = math.sin(2.0 * math.pi * 58.0 * dt) * 0.75
            clang = math.sin(2.0 * math.pi * 418.0 * dt) * math.exp(-28.0 * dt) * 0.35
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Beat 1: Sub-drop + Supermarket barcode beep + rapid frequent-flyer mile ticks
    t1 = scene_starts["pudding-hero"]
    add_sub_drop(t1 + 0.01, dur=0.75, amp=0.33)
    add_scanner_beep(t1 + 0.22, freq=2480.0, dur=0.075, amp=0.12)
    for step in range(15):
        add_tick(t1 + 0.38 + step * 0.085, freq=1280.0 + step * 30.0, amp=0.065)

    # Beat 2: Promo fine-print card + $0.25 pudding loophole chime
    t2 = scene_starts["promo-math"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_chime(t2 + 0.55, (659.25, 987.77), dur=0.32, amp=0.11)
    add_chime(t2 + 2.35, (587.33, 880.0, 1174.66), dur=0.65, amp=0.13)

    # Beat 3: 10 grocery store scanner sweep beeps + register total slam
    t3 = scene_starts["store-sweep"]
    add_sub_drop(t3, dur=0.45, amp=0.22)
    for store_i in range(6):
        add_scanner_beep(t3 + 0.30 + store_i * 0.24, freq=2460.0 + (store_i % 2) * 40.0, dur=0.055, amp=0.085)
    add_stamp_impact(t3 + 2.40, amp=0.22)

    # Beat 4: Urgent deadline countdown clock ticks
    t4 = scene_starts["peeling-bottleneck"]
    add_sub_drop(t4, dur=0.5, amp=0.26)
    for tick_i in range(12):
        add_tick(t4 + 0.25 + tick_i * 0.25, freq=920.0 if tick_i % 2 == 0 else 760.0, amp=0.09)

    # Beat 5: Charity flow nodes + 100% LEGAL ARBITRAGE stamp
    t5 = scene_starts["charity-twist"]
    add_chime(t5 + 0.06, (493.88, 739.99), dur=0.28, amp=0.10)
    add_chime(t5 + 0.76, (587.33, 880.00), dur=0.28, amp=0.10)
    add_chime(t5 + 1.46, (659.25, 987.77), dur=0.35, amp=0.11)
    add_stamp_impact(t5 + 2.70, amp=0.32)

    # Beat 6: Classic two-tone airline cabin "ding-dong" chime + loop lock
    t6 = scene_starts["boarding-loop"]
    add_chime(t6 + 0.08, (659.25,), dur=0.48, amp=0.14)  # High E5 "Ding"
    add_chime(t6 + 0.48, (523.25,), dur=0.62, amp=0.14)  # Low C5 "Dong"
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
