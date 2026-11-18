#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo math-heist thriller soundtrack (122 BPM, B-minor) + frame-synced SFX
locked to src/episodes/ep08-lottery-rolldown/timings.json.
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
        repo_root, "src", "episodes", "ep08-lottery-rolldown", "timings.json"
    )

    duration_sec = 57.0
    scene_starts = {
        "lottery-hero": 0.0,
        "rolldown-quirk": 9.2,
        "town-syndicate": 19.0,
        "massachusetts-showdown": 29.5,
        "state-audit": 39.2,
        "lottery-loop-outro": 48.8,
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
    out_path = os.path.join(out_dir, "ep08-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Math-Heist Pulse Bed (122 BPM, B-minor: B1=61.74Hz, D2=73.42Hz, F#2=92.50Hz)
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
        bar_step = int(t / eighth_sec) % 16
        if bar_step in (8, 9, 10, 11):
            bass_freq = 73.42
        elif bar_step in (12, 13, 14, 15):
            bass_freq = 92.50
        else:
            bass_freq = 61.74

        bass = (
            0.75 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.25 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.23 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 123.47 * t) * 0.023
            + math.sin(2.0 * math.pi * 185.00 * t) * 0.016
            + math.sin(2.0 * math.pi * 293.66 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 123.47 * t) * 0.023
            + math.sin(2.0 * math.pi * 185.30 * t) * 0.016
            + math.sin(2.0 * math.pi * 293.35 * t) * 0.009
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
            freq = 94.0 * ((35.0 / 94.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.8 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1520.0, amp: float = 0.075) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.022 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-150.0 * dt)
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
            env = math.exp(-5.5 * dt)
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
            thud = math.sin(2.0 * math.pi * 55.0 * dt) * 0.76
            clang = math.sin(2.0 * math.pi * 420.0 * dt) * math.exp(-28.0 * dt) * 0.34
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Beat 1: Sub drop + thermal lottery printer rapid ticks
    t1 = scene_starts["lottery-hero"]
    add_sub_drop(t1 + 0.01, dur=0.74, amp=0.33)
    for step in range(10):
        add_tick(t1 + 0.35 + step * 0.09, freq=1320.0 + step * 35.0, amp=0.065)
    add_chime(t1 + 1.35, (587.33, 880.00), dur=0.45, amp=0.12)

    # Beat 2: Rolldown trigger chime
    t2 = scene_starts["rolldown-quirk"]
    add_sub_drop(t2, dur=0.44, amp=0.22)
    add_chime(t2 + 0.55, (739.99, 1108.73), dur=0.40, amp=0.12)
    add_stamp(t2 + 2.30, amp=0.24)

    # Beat 3: Syndicate scale-up bars
    t3 = scene_starts["town-syndicate"]
    add_sub_drop(t3, dur=0.44, amp=0.21)
    add_tick(t3 + 0.25, freq=780.0, amp=0.10)
    add_tick(t3 + 0.55, freq=980.0, amp=0.11)
    add_chime(t3 + 0.85, (587.33, 880.00, 1174.66), dur=0.52, amp=0.12)

    # Beat 4: Terminal printing burst (14 hours straight)
    t4 = scene_starts["massachusetts-showdown"]
    add_sub_drop(t4, dur=0.42, amp=0.22)
    for step in range(12):
        add_tick(t4 + 0.30 + step * 0.08, freq=1480.0, amp=0.06)

    # Beat 5: Audit stamp
    t5 = scene_starts["state-audit"]
    add_chime(t5 + 0.12, (493.88, 739.99), dur=0.30, amp=0.10)
    add_chime(t5 + 0.82, (587.33, 880.00), dur=0.30, amp=0.11)
    add_stamp(t5 + 2.50, amp=0.31)

    # Beat 6: Outro chime + loop lock
    t6 = scene_starts["lottery-loop-outro"]
    add_chime(t6 + 0.18, (739.99, 1174.66), dur=0.45, amp=0.12)
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
