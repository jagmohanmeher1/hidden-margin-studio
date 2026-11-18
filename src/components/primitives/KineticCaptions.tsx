import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SAFE_ZONE, SPRINGS} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';

export interface CaptionPhrase {
  startSec: number;
  endSec: number;
  words: Array<{
    text: string;
    tone?: 'default' | 'emerald' | 'amber' | 'crimson';
  }>;
}

export interface KineticCaptionsProps {
  phrases: CaptionPhrase[];
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({phrases}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activePhrase = phrases.find(
    (p) => currentSec >= p.startSec && currentSec < p.endSec
  );

  if (!activePhrase) {
    return null;
  }

  const phraseStartFrame = Math.round(activePhrase.startSec * fps);
  const phraseDurationSec = Math.max(0.2, activePhrase.endSec - activePhrase.startSec);
  const elapsedInPhraseSec = Math.max(0, currentSec - activePhrase.startSec);

  // Smooth word progression across the phrase duration
  const activeWordIndex = Math.min(
    activePhrase.words.length - 1,
    Math.floor((elapsedInPhraseSec / phraseDurationSec) * activePhrase.words.length)
  );

  const entrance = spring({
    frame: Math.max(0, frame - phraseStartFrame),
    fps,
    config: SPRINGS.snappy,
  });

  const getWordColor = (
    tone: 'default' | 'emerald' | 'amber' | 'crimson' | undefined,
    isSpokenOrActive: boolean
  ) => {
    if (!isSpokenOrActive) {
      return 'rgba(163, 177, 198, 0.48)';
    }
    switch (tone) {
      case 'emerald':
        return COLORS.emerald;
      case 'amber':
        return COLORS.amber;
      case 'crimson':
        return COLORS.crimson;
      default:
        return COLORS.inkPrimary;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.captionTop,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.rightLower,
        height: SAFE_ZONE.captionHeight,
        display: 'flex',
        alignItems: 'center',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 14,
          rowGap: 8,
          padding: '22px 28px',
          borderRadius: 20,
          backgroundColor: 'rgba(10, 14, 22, 0.82)',
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
          transform: `translateY(${interpolate(entrance, [0, 1], [12, 0])}px)`,
          opacity: interpolate(entrance, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        {activePhrase.words.map((word, idx) => {
          const isCurrent = idx === activeWordIndex;
          const isSpokenOrActive = idx <= activeWordIndex;

          return (
            <span
              key={`${activePhrase.startSec}-${idx}-${word.text}`}
              style={{
                fontFamily: FONTS.display,
                fontSize: 42,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                color: getWordColor(word.tone, isSpokenOrActive),
                transform: isCurrent ? 'translateY(-2px)' : 'translateY(0px)',
                textDecoration:
                  isCurrent && word.tone && word.tone !== 'default'
                    ? 'underline'
                    : 'none',
                textDecorationThickness: '3px',
                textUnderlineOffset: '6px',
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
