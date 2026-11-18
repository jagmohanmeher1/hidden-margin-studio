#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo heist-thriller soundtrack (124 BPM, F-minor) + frame-synced SFX
(app-order double-chime, cash-register ka-ching ticks, and arbitrage stamp impact)
locked to src/episodes/ep05-doordash-arbitrage/timings.json.
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
        repo_root, "src", "episodes", "ep05-doordash-arbitrage", "timings.json"
    )

    duration_sec = 55.0
    scene_starts = {
        "pizza-hero": 0.0,
        "phantom-listing": 9.5,
        "arbitrage-loop": 18.5,
        "plain-dough-test": 29.0,
        "vc-subsidy-trap": 38.0,
        "pizza-loop-outro": 47.0,
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
    out_path = os.path.join(out_dir, "ep05-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Heist-Thriller Minimal Pulse Bed (124 BPM, F-minor: F2=87.31Hz, Ab2=103.83Hz, C2=65.41Hz)
    bpm = 124.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE

        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > duration_sec - 0.14:
            master_env = max(0.0, (duration_sec - t) / 0.14)

        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-6.1 * step_pos)
        step_idx = int(t / eighth_sec)
        bar_step = step_idx % 16
        if bar_step in (10, 11, 12, 13):
            bass_freq = 103.83  # Ab2
        elif bar_step in (14, 15):
            bass_freq = 65.41  # C2
        else:
            bass_freq = 87.31  # F2

        bass = (
            0.74 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.26 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.22 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 174.61 * t) * 0.023
            + math.sin(2.0 * math.pi * 261.63 * t) * 0.016
            + math.sin(2.0 * math.pi * 415.30 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 174.61 * t) * 0.023
            + math.sin(2.0 * math.pi * 262.02 * t) * 0.016
            + math.sin(2.0 * math.pi * 414.88 * t) * 0.009
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
            freq = 98.0 * ((36.0 / 98.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.9 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1440.0, amp: float = 0.08) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.026 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-145.0 * dt)
            sig = math.sin(2.0 * math.pi * freq * dt) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_chime(
        start_t: float, freqs: tuple[float, ...], dur: float = 0.52, amp: float = 0.12
    ) -> None:
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

    def add_app_double_chime(start_t: float, amp: float = 0.13) -> None:
        # Kitchen tablet incoming delivery-order two-tone alert (F5 -> C6)
        add_chime(start_t, (698.46, 1396.91), dur=0.24, amp=amp)
        add_chime(start_t + 0.14, (1046.50, 2093.00), dur=0.42, amp=amp * 1.05)

    def add_kaching(start_t: float, amp: float = 0.14) -> None:
        # Crisp mechanical latch click + shimmering cash-register bell
        add_tick(start_t, freq=980.0, amp=amp * 0.85)
        add_tick(start_t + 0.035, freq=1680.0, amp=amp * 0.75)
        add_chime(
            start_t + 0.065,
            (2093.00, 2637.02, 3135.96),
            dur=0.58,
            amp=amp,
        )

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
            clang = math.sin(2.0 * math.pi * 424.0 * dt) * math.exp(-28.0 * dt) * 0.35
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Beat 1: Opening sub-drop + tablet incoming-order double-chime + +$8.00/box ticker ticks
    t1 = scene_starts["pizza-hero"]
    add_sub_drop(t1 + 0.01, dur=0.75, amp=0.33)
    add_app_double_chime(t1 + 0.18, amp=0.13)
    for step in range(12):
        add_tick(t1 + 0.48 + step * 0.09, freq=1320.0 + step * 35.0, amp=0.065)

    # Beat 2: Phantom listing UI card + -$8.00 VC subsidy burn impact
    t2 = scene_starts["phantom-listing"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_chime(t2 + 0.55, (698.46, 830.61), dur=0.32, amp=0.11)
    add_stamp_impact(t2 + 2.55, amp=0.25)

    # Beat 3: $160 app order double-chime -> $240 register ka-ching + profit ticker
    t3 = scene_starts["arbitrage-loop"]
    add_sub_drop(t3, dur=0.45, amp=0.22)
    add_app_double_chime(t3 + 0.30, amp=0.12)
    add_kaching(t3 + 0.85, amp=0.14)
    for step in range(12):
        add_tick(t3 + 1.55 + step * 0.09, freq=1360.0 + step * 32.0, amp=0.062)

    # Beat 4: Full toppings vs Plain dough bar comparison + ka-ching
    t4 = scene_starts["plain-dough-test"]
    add_sub_drop(t4, dur=0.45, amp=0.22)
    add_tick(t4 + 0.24, freq=740.0, amp=0.10)
    add_kaching(t4 + 0.72, amp=0.15)

    # Beat 5: 3 Blitzscale flow nodes + 100% LEGAL ARBITRAGE stamp slam
    t5 = scene_starts["vc-subsidy-trap"]
    add_chime(t5 + 0.06, (523.25, 698.46), dur=0.28, amp=0.10)
    add_chime(t5 + 0.72, (622.25, 830.61), dur=0.28, amp=0.10)
    add_chime(t5 + 1.38, (698.46, 1046.50), dur=0.35, amp=0.11)
    add_stamp_impact(t5 + 2.40, amp=0.32)

    # Beat 6: Couch delivery app double-chime + register ka-ching + loop lock
    t6 = scene_starts["pizza-loop-outro"]
    add_app_double_chime(t6 + 0.12, amp=0.12)
    add_kaching(t6 + 0.68, amp=0.13)
    add_stamp_impact(max(t6 + 2.0, duration_sec - 0.72), amp=0.27)

    with wave.open(out_path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        frames = bytearray(total_samples * 4)
        for i in range(total_samples):
            struct.pack_into("<hh", frames, i * 4, clamp(left[i]), clamp(right[i]))
        wf.writeframes(frames)

    print(
        f"Generated {out_path} ({duration_sec:.2f}s, {os.path.getsize(out_path) / 1024:.1f} KB)"
    )


if __name__ == "__main__":
    main()
