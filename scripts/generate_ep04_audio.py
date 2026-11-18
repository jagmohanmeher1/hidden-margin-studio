#!/usr/bin/env python3
"""
Generates a 44.1kHz stereo insider-thriller soundtrack (120 BPM, D-minor) + frame-synced SFX
(jet turbine sub-drop, credit-card swipe chime, register ticks, and stamp impact)
locked to src/episodes/ep04-airline-banks/timings.json.
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
        repo_root, "src", "episodes", "ep04-airline-banks", "timings.json"
    )

    duration_sec = 55.0
    scene_starts = {
        "airline-hero": 0.0,
        "margin-contrast": 9.8,
        "bank-arbitrage": 20.5,
        "collateral-reveal": 30.2,
        "devaluation-power": 42.5,
        "airline-loop-outro": 51.8,
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
    out_path = os.path.join(out_dir, "ep04-soundtrack.wav")

    left = [0.0] * total_samples
    right = [0.0] * total_samples

    # Insider-Thriller Driving Pulse Bed (120 BPM, D-minor: D2=73.42Hz, F2=87.31Hz, Bb1=58.27Hz, A2=110.00Hz)
    bpm = 120.0
    eighth_sec = (60.0 / bpm) / 2.0

    for i in range(total_samples):
        t = i / SAMPLE_RATE

        master_env = 1.0
        if t < 0.08:
            master_env = t / 0.08
        elif t > duration_sec - 0.14:
            master_env = max(0.0, (duration_sec - t) / 0.14)

        step_pos = (t % eighth_sec) / eighth_sec
        pulse_env = math.exp(-6.2 * step_pos)
        step_idx = int(t / eighth_sec)
        bar_step = step_idx % 16
        if bar_step in (8, 9, 10, 11):
            bass_freq = 87.31  # F2
        elif bar_step in (12, 13):
            bass_freq = 58.27  # Bb1
        elif bar_step in (14, 15):
            bass_freq = 110.00  # A2
        else:
            bass_freq = 73.42  # D2

        bass = (
            0.76 * math.sin(2.0 * math.pi * bass_freq * t)
            + 0.24 * math.sin(2.0 * math.pi * (bass_freq * 2.0) * t)
        ) * pulse_env * 0.105

        lfo = 0.66 + 0.34 * math.sin(2.0 * math.pi * 0.21 * t)
        # Dm9 subtle atmospheric Wall Street synth bed (D3, A3, C4, F4)
        pad_l = (
            math.sin(2.0 * math.pi * 146.83 * t) * 0.023
            + math.sin(2.0 * math.pi * 220.00 * t) * 0.016
            + math.sin(2.0 * math.pi * 261.63 * t) * 0.010
            + math.sin(2.0 * math.pi * 349.23 * t) * 0.008
        ) * lfo
        pad_r = (
            math.sin(2.0 * math.pi * 146.83 * t) * 0.023
            + math.sin(2.0 * math.pi * 220.40 * t) * 0.016
            + math.sin(2.0 * math.pi * 261.25 * t) * 0.010
            + math.sin(2.0 * math.pi * 349.55 * t) * 0.008
        ) * lfo

        left[i] += (bass + pad_l) * master_env
        right[i] += (bass + pad_r) * master_env

    def add_turbine_sub_drop(
        start_t: float, dur: float = 0.80, amp: float = 0.33
    ) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        phase_sub = 0.0
        phase_whine = 0.0
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            p = k / n
            sub_freq = 108.0 * ((35.0 / 108.0) ** p)
            whine_freq = 640.0 * ((230.0 / 640.0) ** p)
            phase_sub += 2.0 * math.pi * sub_freq / SAMPLE_RATE
            phase_whine += 2.0 * math.pi * whine_freq / SAMPLE_RATE
            env = math.exp(-3.6 * p)
            turbine_env = math.sin(math.pi * min(1.0, p * 1.4)) * math.exp(-4.5 * p)
            sub_sig = math.sin(phase_sub) * env * amp
            whine_sig = math.sin(phase_whine) * turbine_env * (amp * 0.14)
            left[idx] += sub_sig + whine_sig * 1.05
            right[idx] += sub_sig + whine_sig * 0.92

    def add_register_tick(
        start_t: float, freq: float = 1450.0, amp: float = 0.078
    ) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.024 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-148.0 * dt)
            sig = (
                0.75 * math.sin(2.0 * math.pi * freq * dt)
                + 0.25 * math.sin(2.0 * math.pi * (freq * 1.62) * dt)
            ) * env * amp
            left[idx] += sig
            right[idx] += sig

    def add_card_swipe_chime(
        start_t: float,
        freqs: tuple[float, ...],
        dur: float = 0.50,
        amp: float = 0.125,
    ) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        swipe_n = int(0.048 * SAMPLE_RATE)
        swipe_phase = 0.0
        for k in range(swipe_n):
            idx = s0 + k
            if idx >= total_samples:
                break
            p = k / swipe_n
            f_glide = 880.0 + 660.0 * p
            swipe_phase += 2.0 * math.pi * f_glide / SAMPLE_RATE
            env = math.sin(math.pi * p) * 0.45
            sig = math.sin(swipe_phase) * env * amp
            left[idx] += sig * 0.90
            right[idx] += sig * 1.05

        chime_s0 = s0 + int(0.038 * SAMPLE_RATE)
        n = int(dur * SAMPLE_RATE)
        for k in range(n):
            idx = chime_s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-5.6 * dt)
            sig = sum(math.sin(2.0 * math.pi * f * dt) for f in freqs) / len(freqs)
            left[idx] += sig * env * amp
            right[idx] += sig * env * amp * 0.96

    def add_stamp_impact(start_t: float, amp: float = 0.30) -> None:
        s0 = int(start_t * SAMPLE_RATE)
        n = int(0.40 * SAMPLE_RATE)
        for k in range(n):
            idx = s0 + k
            if idx >= total_samples:
                break
            dt = k / SAMPLE_RATE
            env = math.exp(-13.5 * dt)
            thud = math.sin(2.0 * math.pi * 54.0 * dt) * 0.78
            clang = (
                math.sin(2.0 * math.pi * 440.0 * dt)
                * math.exp(-26.0 * dt)
                * 0.34
            )
            sig = (thud + clang) * env * amp
            left[idx] += sig
            right[idx] += sig

    # Beat 1: Opening jet turbine sub-drop + jet->card morph swipe chime + $25.6B ticker ticks
    t1 = scene_starts["airline-hero"]
    add_turbine_sub_drop(t1 + 0.01, dur=0.82, amp=0.34)
    add_card_swipe_chime(t1 + 0.52, (587.33, 880.00, 1174.66), dur=0.52, amp=0.13)
    for step in range(8):
        add_register_tick(t1 + 0.95 + step * 0.11, freq=1320.0 + step * 42.0, amp=0.068)

    # Beat 2: Brutal flight math 2% tick vs 53% loyalty bar slam
    t2 = scene_starts["margin-contrast"]
    add_turbine_sub_drop(t2, dur=0.48, amp=0.23)
    add_register_tick(t2 + 0.24, freq=540.0, amp=0.11)
    add_card_swipe_chime(t2 + 0.68, (880.00, 1174.66), dur=0.42, amp=0.12)
    add_stamp_impact(t2 + 1.62, amp=0.23)

    # Beat 3: Amex bulk mile arbitrage swipes + $6.8B/yr payout impact
    t3 = scene_starts["bank-arbitrage"]
    add_turbine_sub_drop(t3, dur=0.44, amp=0.21)
    add_card_swipe_chime(t3 + 0.55, (1174.66, 1760.00), dur=0.40, amp=0.13)
    add_register_tick(t3 + 1.15, freq=1480.0, amp=0.085)
    add_register_tick(t3 + 1.65, freq=1620.0, amp=0.085)
    add_stamp_impact(t3 + 2.55, amp=0.25)

    # Beat 4: 2020 SEC filing collateral reveal + valuation counter ticks
    t4 = scene_starts["collateral-reveal"]
    add_turbine_sub_drop(t4, dur=0.48, amp=0.22)
    for step in range(11):
        add_register_tick(t4 + 0.42 + step * 0.10, freq=1260.0 + step * 38.0, amp=0.065)
    add_card_swipe_chime(t4 + 1.75, (587.33, 880.00, 1396.91), dur=0.62, amp=0.13)

    # Beat 5: 3 central-bank nodes + UNREGULATED CURRENCY stamp impact
    t5 = scene_starts["devaluation-power"]
    add_card_swipe_chime(t5 + 0.08, (587.33, 698.46), dur=0.28, amp=0.10)
    add_card_swipe_chime(t5 + 0.72, (698.46, 880.00), dur=0.28, amp=0.10)
    add_card_swipe_chime(t5 + 1.36, (880.00, 1046.50), dur=0.34, amp=0.11)
    add_stamp_impact(t5 + 2.42, amp=0.31)

    # Beat 6: Flying billboards split + final vault lock right before 0:00 loop
    t6 = scene_starts["airline-loop-outro"]
    add_card_swipe_chime(t6 + 0.16, (880.00, 1174.66), dur=0.46, amp=0.12)
    add_stamp_impact(max(t6 + 1.8, duration_sec - 0.72), amp=0.27)

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
