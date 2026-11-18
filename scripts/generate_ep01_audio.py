#!/usr/bin/env python3
"""
Generates a 52.0-second 44.1kHz stereo dark-thriller soundtrack + frame-synced UI SFX
for Episode #1 ("Starbucks' $2B Shadow Bank") at public/audio/ep01-soundtrack.wav.
"""

import math
import os
import struct
import wave

SAMPLE_RATE = 44100
DURATION_SEC = 52.0
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION_SEC)


def clamp(val: float) -> int:
    return max(-32767, min(32767, int(val * 32767.0)))


def main() -> None:
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "ep01-soundtrack.wav")

    left = [0.0] * TOTAL_SAMPLES
    right = [0.0] * TOTAL_SAMPLES

    # 1. Dark Insider-Thriller Minimal Pulse Bed (118 BPM, D-minor: D1=36.71Hz, D2=73.42Hz, A2=110Hz, F3=174.61Hz)
    bpm = 118.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(TOTAL_SAMPLES):
        t = i / SAMPLE_RATE

        # Smooth fade-in (0.08s) and clean loop tail fade (last 0.12s)
        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > DURATION_SEC - 0.12:
            master_env = max(0.0, (DURATION_SEC - t) / 0.12)

        # Eighth-note analog bass pulse
        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-5.8 * step_pos)
        step_idx = int(t / eighth_sec)
        # Subtle root alternation (D2 -> D2 -> F2 -> A1)
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
        ) * pulse_env * 0.11

        # Atmospheric dark stereo pad (D3 + A3 + F4 subtle detune)
        lfo = 0.65 + 0.35 * math.sin(2.0 * math.pi * 0.18 * t)
        pad_l = (
            math.sin(2.0 * math.pi * 146.83 * t) * 0.025
            + math.sin(2.0 * math.pi * 220.2 * t) * 0.018
            + math.sin(2.0 * math.pi * 349.23 * t) * 0.010
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 146.83 * t) * 0.025
            + math.sin(2.0 * math.pi * 219.8 * t) * 0.018
            + math.sin(2.0 * math.pi * 349.6 * t) * 0.010
        ) * lfo

        left[i] += (bass + pad_l) * master_env
        right[i] += (bass + pad_r) * master_env

    def add_sub_drop(start_t: float, dur: float = 0.75, amp: float = 0.34) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        phase = 0.0
        for k in range(n):
            idx = s0 + k
            if idx >= TOTAL_SAMPLES:
                break
            p = k / n
            freq = 92.0 * ((34.0 / 92.0) ** p)
            phase += 2.0 * math.pi * freq / SAMPLE_RATE
            env = math.exp(-3.8 * p)
            sig = math.sin(phase) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_tick(start_t: float, freq: float = 1480.0, amp: float = 0.09) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.028 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= TOTAL_SAMPLES:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-135.0 * dt)
            sig = math.sin(2.0 * math.pi * freq * dt) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_chime(start_t: float, freqs: tuple[float, ...], dur: float = 0.55, amp: float = 0.12) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= TOTAL_SAMPLES:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-5.5 * dt)
            sig = sum(math.sin(2.0 * math.pi * f * dt) for f in freqs) / len(freqs)
            left[idx] += sig * env * amp
            right[idx] += sig * env * amp * 0.94

    def add_stamp_impact(start_t: float, amp: float = 0.32) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.38 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= TOTAL_SAMPLES:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-14.0 * dt)
            thud = math.sin(2.0 * math.pi * 58.0 * dt) * 0.75
            clang = math.sin(2.0 * math.pi * 412.0 * dt) * math.exp(-28.0 * dt) * 0.35
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Scene 1 (0.0s): Opening sub-drop + rapid ledger ticks
    add_sub_drop(0.01, dur=0.8, amp=0.35)
    for step in range(16):
        add_tick(0.14 + step * 0.085, freq=1250.0 + step * 32.0, amp=0.07)

    # Scene 2 (3.2s): Bar chart slams + $1.84B emerald reveal chord
    add_sub_drop(3.20, dur=0.45, amp=0.22)
    add_tick(3.36, freq=620.0, amp=0.11)
    add_tick(3.59, freq=740.0, amp=0.11)
    add_tick(3.82, freq=880.0, amp=0.12)
    add_chime(4.06, (587.33, 880.0, 1174.66), dur=0.75, amp=0.14)

    # Scene 3 (11.2s): Preset reload tap + trapped float snap
    add_sub_drop(11.20, dur=0.4, amp=0.20)
    add_chime(11.63, (1046.5, 1318.5), dur=0.30, amp=0.12)
    add_stamp_impact(13.66, amp=0.22)

    # Scene 4 (20.2s): 3 mechanism nodes + BANKING LAWS: EXEMPT stamp
    add_chime(20.25, (440.0, 659.25), dur=0.28, amp=0.10)
    add_chime(20.95, (440.0, 587.33), dur=0.28, amp=0.10)
    add_chime(21.65, (587.33, 880.0), dur=0.35, amp=0.11)
    add_stamp_impact(22.95, amp=0.34)

    # Scene 5 (31.2s): Gift card flips + $212M breakage counter ticks
    add_sub_drop(31.20, dur=0.5, amp=0.24)
    for c_idx in (1, 4, 7, 10):
        add_tick(31.76 + c_idx * 0.15, freq=980.0, amp=0.11)
    for step in range(14):
        add_tick(32.20 + step * 0.11, freq=1320.0 + step * 25.0, amp=0.065)

    # Scene 6 (44.0s): 5 gold loyalty stars + vault bars + 51.25s lock click
    for star_idx in range(5):
        add_chime(44.02 + star_idx * 0.15, (880.0 + star_idx * 110.0,), dur=0.25, amp=0.10)
    add_sub_drop(45.58, dur=0.65, amp=0.26)
    add_stamp_impact(51.25, amp=0.28)

    # Write 16-bit PCM stereo WAV
    with wave.open(out_path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        frames = bytearray(TOTAL_SAMPLES * 4)
        for i in range(TOTAL_SAMPLES):
            struct.pack_into("<hh", frames, i * 4, clamp(left[i]), clamp(right[i]))
        wf.writeframes(frames)

    print(f"Generated {out_path} ({os.path.getsize(out_path) / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
