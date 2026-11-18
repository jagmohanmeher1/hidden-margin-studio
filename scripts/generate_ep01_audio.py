#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo dark-thriller soundtrack + frame-synced UI SFX
matching the exact voiceover scene boundaries in src/episodes/ep01-starbucks-bank/timings.json.
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
        repo_root, "src", "episodes", "ep01-starbucks-bank", "timings.json"
    )

    duration_sec = 54.46
    scene_starts = {
        "hero-morph": 0.0,
        "bank-comparison": 7.37,
        "reload-trap": 16.21,
        "system-flow": 26.82,
        "breakage-profit": 36.84,
        "loop-outro": 46.52,
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
    out_path = os.path.join(out_dir, "ep01-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Dark Insider-Thriller Minimal Pulse Bed (118 BPM, D-minor)
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
        pulse_env = math.exp(-5.8 * step_pos)
        step_idx = int(t / eighth_sec)
        bar_step = step_idx % 16
        if bar_step in (12, 13):
            bass_freq = 87.31  # F2
        elif bar_step in (14, 15):
            bass_freq = 55.00  # A1
        else:
            bass_freq = 73.42  # D2

        bass = (
            0.72 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.28 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.10

        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.18 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 146.83 * t) * 0.024
            + math.sin(2.0 * math.pi * 220.2 * t) * 0.017
            + math.sin(2.0 * math.pi * 349.23 * t) * 0.009
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 146.83 * t) * 0.024
            + math.sin(2.0 * math.pi * 219.8 * t) * 0.017
            + math.sin(2.0 * math.pi * 349.6 * t) * 0.009
        ) * lfo

        left[i] += (bass + pad_l) * master_env
        right[i] += (bass + pad_r) * master_env

    def add_sub_drop(start_t: float, dur: float = 0.75, amp: float = 0.32) -> None:
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

    def add_tick(start_t: float, freq: float = 1480.0, amp: float = 0.08) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.028 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-135.0 * dt)
            sig = math.sin(2.0 * math.pi * freq * dt) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_chime(start_t: float, freqs: tuple[float, ...], dur: float = 0.55, amp: float = 0.11) -> None:
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
            thud = math.sin(2.0 * math.pi * 58.0 * dt) * 0.75
            clang = math.sin(2.0 * math.pi * 412.0 * dt) * math.exp(-28.0 * dt) * 0.35
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Scene 1: Opening sub-drop + rapid ledger ticks
    t1 = scene_starts["hero-morph"]
    add_sub_drop(t1 + 0.01, dur=0.8, amp=0.34)
    for step in range(16):
        add_tick(t1 + 0.14 + step * 0.085, freq=1250.0 + step * 32.0, amp=0.065)

    # Scene 2: Bar chart slams + $1.84B emerald reveal chord
    t2 = scene_starts["bank-comparison"]
    add_sub_drop(t2, dur=0.45, amp=0.22)
    add_tick(t2 + 0.16, freq=620.0, amp=0.10)
    add_tick(t2 + 0.39, freq=740.0, amp=0.10)
    add_tick(t2 + 0.62, freq=880.0, amp=0.11)
    add_chime(t2 + 0.86, (587.33, 880.0, 1174.66), dur=0.75, amp=0.13)

    # Scene 3: Preset reload tap + trapped float snap
    t3 = scene_starts["reload-trap"]
    add_sub_drop(t3, dur=0.4, amp=0.20)
    add_chime(t3 + 0.43, (1046.5, 1318.5), dur=0.30, amp=0.12)
    add_stamp_impact(t3 + 2.46, amp=0.22)

    # Scene 4: 3 mechanism nodes + BANKING LAWS: EXEMPT stamp
    t4 = scene_starts["system-flow"]
    add_chime(t4 + 0.05, (440.0, 659.25), dur=0.28, amp=0.10)
    add_chime(t4 + 0.75, (440.0, 587.33), dur=0.28, amp=0.10)
    add_chime(t4 + 1.45, (587.33, 880.0), dur=0.35, amp=0.11)
    add_stamp_impact(t4 + 2.75, amp=0.32)

    # Scene 5: Gift card flips + $212M breakage counter ticks
    t5 = scene_starts["breakage-profit"]
    add_sub_drop(t5, dur=0.5, amp=0.24)
    for c_idx in (1, 4, 7, 10):
        add_tick(t5 + 0.56 + c_idx * 0.15, freq=980.0, amp=0.10)
    for step in range(14):
        add_tick(t5 + 1.00 + step * 0.11, freq=1320.0 + step * 25.0, amp=0.06)

    # Scene 6: 5 gold loyalty stars + vault bars + lock click right before end
    t6 = scene_starts["loop-outro"]
    for star_idx in range(5):
        add_chime(t6 + 0.02 + star_idx * 0.15, (880.0 + star_idx * 110.0,), dur=0.25, amp=0.10)
    add_sub_drop(t6 + 1.58, dur=0.65, amp=0.25)
    add_stamp_impact(max(t6 + 2.0, duration_sec - 0.75), amp=0.28)

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
