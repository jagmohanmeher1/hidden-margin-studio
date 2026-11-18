import type {SpringConfig} from 'remotion';

export const VIDEO_SPEC = {
  width: 1080,
  height: 1920,
  fps: 60,
} as const;

/**
 * Cross-platform 9:16 Safe Zone geometry (1080x1920)
 * Protects all editorial content from YouTube Shorts, Instagram Reels,
 * TikTok, and Facebook Reels native chrome overlays.
 */
export const SAFE_ZONE = {
  top: 220,
  bottom: 430, // Content stays above Y = 1490
  left: 92,
  rightUpper: 158,
  rightLower: 158, // Clears right-side Like / Comment / Share / Remix icon rail
  stageTop: 288,
  stageHeight: 900, // Y: 288 -> 1188
  captionTop: 1212,
  captionHeight: 256, // Y: 1212 -> 1468
} as const;

/**
 * "Insider Thriller" Dark-Mode Editorial Palette
 * Zero purple/violet accents, zero neon border gimmicks, rich tonal surface hierarchy.
 */
export const COLORS = {
  bgDeep: '#06080D',
  bgCanvas: '#0A0E16',
  surface1: '#101622',
  surface2: '#161E2E',
  surface3: '#1D273B',

  borderSubtle: 'rgba(255, 255, 255, 0.07)',
  borderHighlight: 'rgba(255, 255, 255, 0.13)',

  inkPrimary: '#F5F7FA',
  inkSecondary: '#A3B1C6',
  inkMuted: '#63728A',

  // Semantic financial accents
  emerald: '#10D988',
  emeraldSoft: 'rgba(16, 217, 136, 0.14)',
  emeraldDim: '#0A7E50',

  amber: '#F5A623',
  amberSoft: 'rgba(245, 166, 35, 0.14)',

  crimson: '#F23F5D',
  crimsonSoft: 'rgba(242, 63, 93, 0.14)',

  steelBlue: '#38BDF8',
  steelSoft: 'rgba(56, 189, 248, 0.12)',
} as const;

export type MoodTone = 'emerald' | 'amber' | 'crimson' | 'neutral';

export const SPRINGS: Record<'snappy' | 'editorial' | 'heavy' | 'gentle', SpringConfig> = {
  snappy: {
    damping: 18,
    mass: 0.7,
    stiffness: 220,
    overshootClamping: false,
  },
  editorial: {
    damping: 22,
    mass: 0.9,
    stiffness: 160,
    overshootClamping: false,
  },
  heavy: {
    damping: 16,
    mass: 1.25,
    stiffness: 210,
    overshootClamping: false,
  },
  gentle: {
    damping: 28,
    mass: 1.1,
    stiffness: 110,
    overshootClamping: true,
  },
};
