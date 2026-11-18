# Hidden Margin — Programmatic 60fps Video Studio

Dark-mode **"Insider Thriller"** motion-graphics video engine built with **Remotion 4 + React 19 + TypeScript** (`1080x1920`, `60fps`) and **Kokoro-82M Neural Voiceover** for cross-platform publishing on **YouTube Shorts, Instagram Reels, TikTok, and Facebook Reels**.

- **Viral Strategy, 18-Episode Vetted Backlog & Retention Playbook:** [`docs/viral-video-blueprint.md`](docs/viral-video-blueprint.md)
- **Google Drive & Publishing Sheet Manifest:** [`config/publishing.json`](config/publishing.json)

## Quick Commands

```bash
# 1. Synthesize custom-blended Kokoro neural voiceover + millisecond timings.json
npm run voice:ep01
npm run voice:ep02
npm run voice:ep03

# 2. Synthesize frame-synced dark-thriller score & UI SFX
npm run audio:ep01
npm run audio:ep02
npm run audio:ep03

# 3. Launch interactive Remotion Studio (port 3000)
npm run studio

# 4. Render voiced 1080x1920 @ 60fps master MP4s
npm run render:ep01
npm run render:ep02
npm run render:ep03

# 5. Upload final MP4s into the "Hidden Margin — Final Videos" Google Drive folder
npm run upload:ep01
npm run upload:ep02
npm run upload:ep03

# Typecheck all scenes and primitives
npm run typecheck
```

## Architecture

- `scripts/generate_ep01_voiceover.py`, `scripts/generate_ep02_voiceover.py` & `scripts/generate_ep03_voiceover.py` — Synthesize the bespoke documentary thriller voice blend (`0.55 am_michael + 0.30 am_onyx + 0.15 bm_daniel`) via `kokoro-onnx` and output exact millisecond phrase/scene timestamps (`timings.json`).
- `scripts/generate_ep01_audio.py`, `scripts/generate_ep02_audio.py` & `scripts/generate_ep03_audio.py` — Generate episode-specific dark-thriller scores and synced SFX (vault locks, barcode scanners, airline cabin chimes, concession register locks) dynamically locked to `timings.json`.
- `scripts/upload_to_drive.sh` — Uploads rendered final MP4 exports directly to the project's Google Drive folder (`Hidden Margin — Final Videos`).
- `src/theme/tokens.ts` & `src/theme/fonts.ts` — Dark-mode color tokens, spring physics presets, bundled local `@fontsource` fonts, and cross-platform safe-zone margins.
- `src/components/layout/SafeZoneFrame.tsx` — Tonal atmospheric backdrop, subtle SVG film grain, editorial masthead + timeline progress hairline, and toggleable TikTok/Reels/Shorts unsafe-zone overlay.
- `src/components/primitives/` — Reusable 60fps editorial primitives (`AnimatedMoneyTicker`, `ComparisonBarChart`, `ReceiptAndUiCard`, `FlowNodeGraph`, `KineticCaptions`).
- `src/episodes/ep01-starbucks-bank/` — Episode #1 (*"Starbucks' $2B Shadow Bank"*, Bucket 1).
- `src/episodes/ep02-pudding-guy/` — Episode #2 (*"The Pudding Guy's 1.25M Air Miles"*, Bucket 2).
- `src/episodes/ep03-popcorn-decoy/` — Episode #3 (*"The Medium Popcorn Decoy Trap"*, Bucket 3).
