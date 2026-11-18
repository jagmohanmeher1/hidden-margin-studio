#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo psychological-thriller soundtrack (114 BPM, G-minor) + frame-synced SFX
locked to src/episodes/ep06-menu-dollar-sign/timings.json.
"""

import json
import math
import os
import random
import struct
import wave

SAMPLE_RATE = 44100


def clamp(val: float) -> int:
    return max(-32767, min(32767, int(val * 32767.0)))


def main() -> None:
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    timings_path = os.path.join(
        repo_root, "src", "episodes", "ep06-menu-dollar-sign", "timings.json"
    )

    duration_sec = 55.0
    scene_starts = {
        "menu-hero": 0.0,
        "cornell-study": 9.8,
        "pain-of-paying": 19.2,
        "golden-triangle": 28.8,
        "menu-stack": 38.6,
        "menu-loop-outro": 47.0,
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
    out_path = os.path.join(out_dir, "ep06-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Psychological-Thriller Minimal Pulse Bed (114 BPM, G-minor: G2=98.00Hz, Eb2=77.78Hz, D2=73.42Hz)
    bpm = 114.0
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
        step_idx = int(t / eighth_sec)
        bar_step = step_idx % 16
        if bar_step in (10, 11, 12, 13):
            bass_freq = 77.78  # Eb2
        elif bar_step in (14, 15):
            bass_freq = 73.42  # D2
        else:
            bass_freq = 98.00  # G2

        bass = (
            0.55 * math.sin(2.0 * math.pi * (bass_freq * 0.5) * t)
            + 0.32 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.13 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.105

        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.17 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 196.00 * t) * 0.022
            + math.sin(2.0 * math.pi * 233.08 * t) * 0.016
            + math.sin(2.0 * math.pi * 293.66 * t) * 0.010
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 196.32 * t) * 0.022
            + math.sin(2.0 * math.pi * 232.78 * t) * 0.016
            + math.sin(2.0 * math.pi * 294.02 * t) * 0.010
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
            freq = 94.0 * ((34.0 / 94.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.8 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_erasure_whoosh(start_t: float, dur: float = 0.38, amp: float = 0.13) -> None:
        rng = random.Random(606)
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        phase = 0.0
        lp_state = 0.0
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            p = k / n
            bell = math.sin(math.pi * p) ** 1.4
            sweep_freq = 1480.0 * ((360.0 / 1480.0) ** p)
            phase += 2.0 * math.pi * sweep_freq / SAMPLE_RATE
            raw_noise = rng.uniform(-1.0, 1.0)
            lp_state = 0.82 * lp_state + 0.18 * raw_noise
            sig = (0.55 * math.sin(phase) + 0.45 * lp_state) * bell * amp
            pan = 0.35 + 0.30 * p
            left[idx] += sig * (1.0 - pan * 0.35)
            right[idx] += sig * (0.65 + pan * 0.35)

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

    def add_chime(
        start_t: float, freqs: tuple[float, ...], dur: float = 0.50, amp: float = 0.12
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
            right[idx] += sig * env * amp * 0.94

    def add_stamp_impact(start_t: float, amp: float = 0.30) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.38 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-14.0 * dt)
            thud = math.sin(2.0 * math.pi * 54.0 * dt) * 0.76
            clang = math.sin(2.0 * math.pi * 392.0 * dt) * math.exp(-28.0 * dt) * 0.34
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Beat 1: Opening sub-drop + crisp '$' & '.00' erasure whoosh/chime + +8.2% ticker ticks
    t1 = scene_starts["menu-hero"]
    add_sub_drop(t1 + 0.01, dur=0.74, amp=0.32)
    add_erasure_whoosh(t1 + 0.42, dur=0.38, amp=0.14)
    add_chime(t1 + 0.72, (783.99, 1174.66), dur=0.46, amp=0.12)
    for step in range(8):
        add_tick(t1 + 1.05 + step * 0.11, freq=1280.0 + step * 40.0, amp=0.06)

    # Beat 2: Cornell 3-menu bar chart reveals + emerald +8.15% chime
    t2 = scene_starts["cornell-study"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_tick(t2 + 0.20, freq=680.0, amp=0.10)
    add_tick(t2 + 0.56, freq=780.0, amp=0.10)
    add_chime(t2 + 0.96, (587.33, 880.00, 1174.66), dur=0.52, amp=0.13)

    # Beat 3: Pain of paying neural loss alarm vs muted naked numeral
    t3 = scene_starts["pain-of-paying"]
    add_sub_drop(t3, dur=0.44, amp=0.22)
    add_chime(t3 + 0.48, (466.16, 622.25), dur=0.36, amp=0.12)
    add_tick(t3 + 1.15, freq=920.0, amp=0.09)
    add_stamp_impact(t3 + 2.55, amp=0.23)

    # Beat 4: Golden Triangle eye-scanner ticks sweeping $95 Ribeye -> 38 Pasta target
    t4 = scene_starts["golden-triangle"]
    add_sub_drop(t4, dur=0.44, amp=0.21)
    for step in range(10):
        add_tick(t4 + 0.36 + step * 0.09, freq=1520.0 - step * 38.0, amp=0.075)
    add_erasure_whoosh(t4 + 1.28, dur=0.32, amp=0.11)
    add_chime(t4 + 1.62, (783.99, 1046.50, 1567.98), dur=0.55, amp=0.13)

    # Beat 5: 3 menu engineering nodes + ENGINEERED MENU TRAP stamp impact
    t5 = scene_starts["menu-stack"]
    add_chime(t5 + 0.08, (587.33, 698.46), dur=0.28, amp=0.10)
    add_chime(t5 + 0.72, (698.46, 880.00), dur=0.28, amp=0.10)
    add_chime(t5 + 1.36, (783.99, 1174.66), dur=0.34, amp=0.11)
    add_stamp_impact(t5 + 2.45, amp=0.31)

    # Beat 6: Check comparison chime + final register lock before 0:00 seamless loop
    t6 = scene_starts["menu-loop-outro"]
    add_chime(t6 + 0.16, (783.99, 987.77), dur=0.46, amp=0.12)
    add_stamp_impact(max(t6 + 1.9, duration_sec - 0.72), amp=0.27)

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
