# Hidden Margin — Programmatic 60fps Video Studio

Dark-mode **"Insider Thriller"** motion-graphics video engine built with **Remotion 4 + React 19 + TypeScript** (`1080x1920`, `60fps`) and **Kokoro-82M Neural Voiceover** for cross-platform publishing on **YouTube Shorts, Instagram Reels, TikTok, and Facebook Reels**.

- **Viral Strategy, 18-Episode Vetted Backlog & Retention Playbook:** [`docs/viral-video-blueprint.md`](docs/viral-video-blueprint.md)
- **Google Drive & Publishing Sheet Manifest:** [`config/publishing.json`](config/publishing.json)

## Quick Commands

```bash
# 1. Synthesize custom-blended Kokoro neural voiceover + millisecond timings.json
npm run voice:ep01

# 2. Synthesize frame-synced dark-thriller score & UI SFX
npm run audio:ep01

# 3. Launch interactive Remotion Studio (port 3000)
npm run studio

# 4. Render voiced 1080x1920 @ 60fps master MP4
npm run render:ep01

# 5. Upload final MP4 into the "Hidden Margin — Final Videos" Google Drive folder
npm run upload:ep01

# Typecheck all scenes and primitives
npm run typecheck
```

## Architecture

- `scripts/generate_ep01_voiceover.py` — Synthesizes a bespoke documentary thriller voice blend (`0.55 am_michael + 0.30 am_onyx + 0.15 bm_daniel`) via `kokoro-onnx`, writes `public/audio/ep01-voiceover.wav`, and outputs exact phrase/scene timestamps to `src/episodes/ep01-starbucks-bank/timings.json`.
- `scripts/generate_ep01_audio.py` — Generates `public/audio/ep01-soundtrack.wav` dynamically locked to the voiceover scene boundaries in `timings.json`.
- `scripts/upload_to_drive.sh` — Uploads rendered final MP4 exports directly to the project's Google Drive folder (`Hidden Margin — Final Videos`).
- `src/theme/tokens.ts` & `src/theme/fonts.ts` — Dark-mode color tokens, spring physics presets, bundled local `@fontsource` fonts, and cross-platform safe-zone margins.
- `src/components/layout/SafeZoneFrame.tsx` — Tonal atmospheric backdrop, subtle SVG film grain, editorial masthead + timeline progress hairline, and toggleable TikTok/Reels/Shorts unsafe-zone overlay.
- `src/components/primitives/` — Reusable 60fps editorial primitives (`AnimatedMoneyTicker`, `ComparisonBarChart`, `ReceiptAndUiCard`, `FlowNodeGraph`, `KineticCaptions`).
- `src/episodes/ep01-starbucks-bank/` — Complete voiced pilot episode (*"Starbucks' $2B Shadow Bank"*).
