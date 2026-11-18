import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SPRINGS} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';

export interface AnimatedMoneyTickerProps {
  from?: number;
  to: number;
  startFrame?: number;
  durationInFrames?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  eyebrow?: string;
  sublabel?: string;
  accentColor?: string;
  size?: 'md' | 'lg' | 'hero';
  align?: 'left' | 'center';
}

export const AnimatedMoneyTicker: React.FC<AnimatedMoneyTickerProps> = ({
  from = 0,
  to,
  startFrame = 0,
  durationInFrames = 75,
  prefix = '$',
  suffix = '',
  decimals = 0,
  eyebrow,
  sublabel,
  accentColor = COLORS.emerald,
  size = 'hero',
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  const entrance = spring({
    frame: localFrame,
    fps,
    config: SPRINGS.editorial,
  });

  const valueProgress = interpolate(localFrame, [0, durationInFrames], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentValue = from + (to - from) * valueProgress;

  const formattedNumber = currentValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const fontSize = size === 'hero' ? 92 : size === 'lg' ? 68 : 48;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        opacity: interpolate(entrance, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}),
        transform: `translateY(${interpolate(entrance, [0, 1], [22, 0])}px)`,
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.inkMuted,
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </div>
      )}

      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize,
          fontWeight: 700,
          lineHeight: 1.04,
          letterSpacing: '-0.035em',
          fontVariantNumeric: 'tabular-nums',
          color: accentColor,
        }}
      >
        {prefix}
        {formattedNumber}
        {suffix}
      </div>

      {sublabel && (
        <div
          style={{
            marginTop: 14,
            fontFamily: FONTS.display,
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1.35,
            color: COLORS.inkSecondary,
            maxWidth: 780,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
