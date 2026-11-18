# Hidden Margin — Programmatic 60fps Video Studio

Dark-mode **"Insider Thriller"** motion-graphics video engine built with **Remotion 4 + React 19 + TypeScript** (`1080x1920`, `60fps`) for cross-platform publishing on **YouTube Shorts, Instagram Reels, TikTok, and Facebook Reels**.

- **Viral Strategy, 18-Episode Vetted Backlog & Retention Playbook:** [`docs/viral-video-blueprint.md`](docs/viral-video-blueprint.md)

## Quick Commands

```bash
# Launch interactive Remotion Studio (port 3000)
npm run studio

# Typecheck all scenes and primitives
npm run typecheck

# Render clean 1080x1920 @ 60fps MP4 for Episode #1
npm run render:ep01

# Render Safe-Zone verification MP4 (shows TikTok/Reels/Shorts UI chrome bounds)
npm run render:ep01:preview

# Regenerate procedural dark-thriller soundtrack & synced UI SFX
python3 scripts/generate_ep01_audio.py
```

## Architecture

- `src/theme/tokens.ts` — Dark-mode color tokens (`#06080D` obsidian canvas, `#101622` elevated slate surface, `#10D988` profit emerald, `#F5A623` loophole amber, `#F23F5D` exemption crimson), spring physics presets, and cross-platform safe-zone margins.
- `src/theme/fonts.ts` — Bundled local `@fontsource/plus-jakarta-sans` and `@fontsource/jetbrains-mono` tabular numerals (zero external network font requests during headless rendering).
- `src/components/layout/SafeZoneFrame.tsx` — Tonal atmospheric backdrop, subtle SVG film grain, editorial masthead + timeline progress bar, and toggleable TikTok/Reels/Shorts unsafe-zone overlay.
- `src/components/primitives/` — Reusable 60fps editorial primitives:
  - `AnimatedMoneyTicker.tsx`
  - `ComparisonBarChart.tsx`
  - `ReceiptAndUiCard.tsx`
  - `FlowNodeGraph.tsx`
  - `KineticCaptions.tsx`
- `src/episodes/ep01-starbucks-bank/` — Complete 52-second pilot episode (*"Starbucks' $2B Shadow Bank"*).

## Adding Custom Voiceover Audio

1. Export your custom-cloned narration (`52s` script from `src/episodes/ep01-starbucks-bank/data.ts`) to `public/audio/ep01-voiceover.mp3`.
2. Pass `voiceoverPath: "audio/ep01-voiceover.mp3"` in `src/Root.tsx` (or live in the Remotion Studio right-hand Props panel).
3. Adjust phrase start/end timestamps in `EP01_CAPTIONS` (`data.ts`) if needed, then run `npm run render:ep01`.
