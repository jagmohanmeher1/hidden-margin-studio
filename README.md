# Hidden Margin — Programmatic 60fps Video Studio

Dark-mode **"Insider Thriller"** motion-graphics video engine built with **Remotion 4 + React 19 + TypeScript** (`1080x1920`, `60fps`) and **Kokoro-82M Neural Voiceover** for cross-platform publishing on **YouTube Shorts, Instagram Reels, TikTok, and Facebook Reels**.

- **Viral Strategy, 18-Episode Vetted Backlog & Retention Playbook:** [`docs/viral-video-blueprint.md`](docs/viral-video-blueprint.md)
- **Google Drive & Publishing Sheet Manifest:** [`config/publishing.json`](config/publishing.json)

## Season 1 Episodes (`EP01` – `EP10`)

| Ep # | Bucket | Title | Composition ID |
| :--- | :--- | :--- | :--- |
| `EP01` | 1. Secret Business Models | *Starbucks' $2B Shadow Bank* | `Ep01-StarbucksBank` |
| `EP02` | 2. Genius Legal Exploits | *The Pudding Guy's 1.25M Air Miles* | `Ep02-PuddingGuy` |
| `EP03` | 3. Everyday Pricing Traps | *The Medium Popcorn Decoy Trap* | `Ep03-PopcornDecoy` |
| `EP04` | 1. Secret Business Models | *Airlines Are Frequent-Flyer Banks* | `Ep04-AirlineBanks` |
| `EP05` | 2. Genius Legal Exploits | *The DoorDash Pizza Arbitrage Glitch* | `Ep05-DoorDashArbitrage` |
| `EP06` | 3. Everyday Pricing Traps | *Why Fancy Menus Deleted the '$' Sign* | `Ep06-MenuDollarSign` |
| `EP07` | 1. Secret Business Models | *Costco's $1.50 Hot Dog & Membership Float* | `Ep07-CostcoHotDog` |
| `EP08` | 2. Genius Legal Exploits | *How a Retiree Solved Two State Lotteries* | `Ep08-LotteryRolldown` |
| `EP09` | 3. Everyday Pricing Traps | *IKEA's One-Way Maze (The Gruen Transfer)* | `Ep09-IkeaMaze` |
| `EP10` | 1. Secret Business Models | *McDonald's $40B Real Estate Empire* | `Ep10-McDonaldsRealEstate` |

## Quick Commands

```bash
# Synthesize custom-blended Kokoro neural voiceover + millisecond timings.json (ep01..ep10)
npm run voice:ep04 && npm run audio:ep04

# Launch interactive Remotion Studio (port 3000)
npm run studio

# Render voiced 1080x1920 @ 60fps master MP4 (ep01..ep10)
npm run render:ep04

# Upload final MP4 into the "Hidden Margin — Final Videos" Google Drive folder
npm run upload:ep04

# Typecheck all 10 episodes and shared primitives
npm run typecheck
```
