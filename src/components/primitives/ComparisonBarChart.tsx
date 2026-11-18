import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SPRINGS} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';

export interface BarDatum {
  id: string;
  label: string;
  sublabel?: string;
  value: number;
  formattedValue: string;
  isHighlight?: boolean;
  accentColor?: string;
}

export interface ComparisonBarChartProps {
  title: string;
  eyebrow?: string;
  maxValue: number;
  bars: BarDatum[];
  startFrame?: number;
  staggerFrames?: number;
  footnote?: string;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  title,
  eyebrow,
  maxValue,
  bars,
  startFrame = 0,
  staggerFrames = 11,
  footnote,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headerSpring = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: SPRINGS.editorial,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '40px 42px',
        borderRadius: 24,
        backgroundColor: COLORS.surface1,
        border: `1px solid ${COLORS.borderSubtle}`,
        boxShadow: '0 28px 60px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [16, 0])}px)`,
          marginBottom: 34,
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: COLORS.inkMuted,
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: COLORS.inkPrimary,
          }}
        >
          {title}
        </div>
      </div>

      {/* Bars */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
        {bars.map((bar, index) => {
          const itemDelay = startFrame + 8 + index * staggerFrames;
          const barProgress = spring({
            frame: Math.max(0, frame - itemDelay),
            fps,
            config: bar.isHighlight ? SPRINGS.heavy : SPRINGS.editorial,
          });

          const widthPct = Math.min(100, (bar.value / maxValue) * 100) * barProgress;
          const fill = bar.isHighlight ? bar.accentColor || COLORS.emerald : '#303E56';

          return (
            <div
              key={bar.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                opacity: interpolate(barProgress, [0, 0.35], [0, 1], {
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
                  <span
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: bar.isHighlight ? 30 : 25,
                      fontWeight: bar.isHighlight ? 800 : 600,
                      letterSpacing: '-0.02em',
                      color: bar.isHighlight ? COLORS.inkPrimary : COLORS.inkSecondary,
                    }}
                  >
                    {bar.label}
                  </span>
                  {bar.sublabel && (
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 18,
                        color: COLORS.inkMuted,
                      }}
                    >
                      {bar.sublabel}
                    </span>
                  )}
                </div>

                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: bar.isHighlight ? 32 : 25,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: bar.isHighlight ? fill : COLORS.inkSecondary,
                  }}
                >
                  {bar.formattedValue}
                </span>
              </div>

              {/* Bar Track */}
              <div
                style={{
                  width: '100%',
                  height: bar.isHighlight ? 36 : 24,
                  borderRadius: 8,
                  backgroundColor: COLORS.surface2,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    borderRadius: 8,
                    backgroundColor: fill,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {footnote && (
        <div
          style={{
            marginTop: 30,
            paddingTop: 20,
            borderTop: `1px solid ${COLORS.borderSubtle}`,
            fontFamily: FONTS.mono,
            fontSize: 18,
            color: COLORS.inkMuted,
            letterSpacing: '0.04em',
          }}
        >
          {footnote}
        </div>
      )}
    </div>
  );
};
