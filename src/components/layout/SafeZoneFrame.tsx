import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MoodTone, SAFE_ZONE} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';

export interface SafeZoneFrameProps {
  children: React.ReactNode;
  episodeCode?: string;
  sectionLabel?: string;
  mood?: MoodTone;
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
}

const MOOD_GLOW: Record<MoodTone, string> = {
  emerald: 'rgba(16, 217, 136, 0.13)',
  amber: 'rgba(245, 166, 35, 0.13)',
  crimson: 'rgba(242, 63, 93, 0.14)',
  neutral: 'rgba(56, 189, 248, 0.09)',
};

export const SafeZoneFrame: React.FC<SafeZoneFrameProps> = ({
  children,
  episodeCode = 'HM // 01',
  sectionLabel = 'SHADOW DEPOSITS',
  mood = 'emerald',
  showSafeZoneGuide = false,
  platformOverlay = 'none',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle ambient breathing drift for atmospheric depth
  const glowShiftX = Math.sin(frame / 55) * 32;
  const glowShiftY = Math.cos(frame / 70) * 24;
  const activeGlow = MOOD_GLOW[mood];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgDeep,
        fontFamily: FONTS.display,
        color: COLORS.inkPrimary,
        overflow: 'hidden',
      }}
    >
      {/* Layer 1: Tonal Atmospheric Studio Lighting (No grid lines) */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(680px 620px at ${540 + glowShiftX}px ${590 + glowShiftY}px, ${activeGlow} 0%, rgba(10, 14, 22, 0.0) 72%),
            radial-gradient(920px 1100px at 540px 760px, ${COLORS.bgCanvas} 0%, ${COLORS.bgDeep} 88%)
          `,
        }}
      />

      {/* Subtle SVG Film Grain Texture for tactile editorial depth */}
      <svg
        width="1080"
        height="1920"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.032,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      >
        <filter id="hm-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="1080" height="1920" filter="url(#hm-film-grain)" />
      </svg>

      {/* Bottom dark vignette so native platform captions remain crisp */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 520,
          background:
            'linear-gradient(180deg, rgba(6, 8, 13, 0) 0%, rgba(6, 8, 13, 0.78) 55%, rgba(6, 8, 13, 0.96) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Editorial Masthead anchored cleanly below top unsafe chrome (Y = 220px) */}
      <div
        style={{
          position: 'absolute',
          top: SAFE_ZONE.top,
          left: SAFE_ZONE.left,
          right: SAFE_ZONE.rightUpper,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: FONTS.mono,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.16em',
            color: COLORS.inkMuted,
            textTransform: 'uppercase',
          }}
        >
          <span style={{color: COLORS.inkSecondary}}>HIDDEN MARGIN</span>
          <span>
            {episodeCode} &nbsp;/&nbsp; {sectionLabel}
          </span>
        </div>

        {/* Hairline timeline progress bar */}
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: COLORS.borderSubtle,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor:
                mood === 'crimson'
                  ? COLORS.crimson
                  : mood === 'amber'
                    ? COLORS.amber
                    : COLORS.emerald,
            }}
          />
        </div>
      </div>

      {/* Main Content Children */}
      {children}

      {/* Optional Studio Safe-Zone & Platform Chrome Simulator */}
      {(showSafeZoneGuide || platformOverlay !== 'none') && (
        <AbsoluteFill style={{pointerEvents: 'none', zIndex: 90}}>
          {/* Top Unsafe Chrome */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: SAFE_ZONE.top,
              backgroundColor: 'rgba(242, 63, 93, 0.12)',
              borderBottom: '2px dashed rgba(242, 63, 93, 0.65)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 14,
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.12em',
              color: '#FDA4AF',
            }}
          >
            TOP UNSAFE CHROME ({SAFE_ZONE.top}PX — SEARCH / TABS / NOTCH)
          </div>

          {/* Bottom Unsafe Chrome */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: SAFE_ZONE.bottom,
              backgroundColor: 'rgba(242, 63, 93, 0.12)',
              borderTop: '2px dashed rgba(242, 63, 93, 0.65)',
              padding: '28px 78px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontFamily: FONTS.mono,
              color: '#FDA4AF',
            }}
          >
            <span style={{fontSize: 18, letterSpacing: '0.12em'}}>
              BOTTOM UNSAFE CHROME ({SAFE_ZONE.bottom}PX — HANDLE / CAPTION / AUDIO BAR)
            </span>
            {platformOverlay !== 'none' && (
              <div
                style={{
                  marginTop: 18,
                  padding: '18px 22px',
                  borderRadius: 14,
                  backgroundColor: 'rgba(6, 8, 13, 0.72)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: COLORS.inkSecondary,
                  fontFamily: FONTS.display,
                  fontSize: 24,
                  maxWidth: 740,
                }}
              >
                <strong style={{color: COLORS.inkPrimary}}>@hiddenmargin</strong> &nbsp;
                {platformOverlay.toUpperCase()} UI Preview — Starbucks holds nearly $2B in customer cash...
              </div>
            )}
          </div>

          {/* Right Action Icon Rail Unsafe Zone */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 860,
              bottom: SAFE_ZONE.bottom,
              width: SAFE_ZONE.rightLower,
              backgroundColor: 'rgba(245, 166, 35, 0.12)',
              borderLeft: '2px dashed rgba(245, 166, 35, 0.65)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '36px 0',
              fontFamily: FONTS.mono,
              fontSize: 16,
              color: '#FCD34D',
            }}
          >
            <span>LIKE</span>
            <span>CMT</span>
            <span>SAVE</span>
            <span>SHARE</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
