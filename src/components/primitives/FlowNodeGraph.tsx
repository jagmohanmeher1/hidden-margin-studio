import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SPRINGS} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';

export interface FlowStepNode {
  id: string;
  stepCode: string;
  title: string;
  metric: string;
  detail: string;
  accent?: 'emerald' | 'amber' | 'crimson' | 'steel';
}

export interface FlowNodeGraphProps {
  nodes: FlowStepNode[];
  startFrame?: number;
  stepIntervalFrames?: number;
  stampText?: string;
  stampSubtext?: string;
  stampBadgeText?: string;
  stampRevealFrame?: number;
}

export const FlowNodeGraph: React.FC<FlowNodeGraphProps> = ({
  nodes,
  startFrame = 0,
  stepIntervalFrames = 32,
  stampText,
  stampSubtext,
  stampBadgeText = 'LOOPHOLE',
  stampRevealFrame = 155,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  const getAccent = (accent?: FlowStepNode['accent']) => {
    switch (accent) {
      case 'amber':
        return COLORS.amber;
      case 'crimson':
        return COLORS.crimson;
      case 'steel':
        return COLORS.steelBlue;
      default:
        return COLORS.emerald;
    }
  };

  const stampSpring = spring({
    frame: Math.max(0, localFrame - stampRevealFrame),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {nodes.map((node, index) => {
        const nodeDelay = index * stepIntervalFrames;
        const nodeSpring = spring({
          frame: Math.max(0, localFrame - nodeDelay),
          fps,
          config: SPRINGS.editorial,
        });

        const arrowSpring = spring({
          frame: Math.max(0, localFrame - (nodeDelay + 16)),
          fps,
          config: SPRINGS.snappy,
        });

        const accent = getAccent(node.accent);

        return (
          <React.Fragment key={node.id}>
            <div
              style={{
                padding: '28px 34px',
                borderRadius: 20,
                backgroundColor: COLORS.surface1,
                border: `1px solid ${COLORS.borderSubtle}`,
                boxShadow: '0 20px 44px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                opacity: nodeSpring,
                transform: `translateY(${interpolate(nodeSpring, [0, 1], [22, 0])}px)`,
              }}
            >
              <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: COLORS.inkMuted,
                  }}
                >
                  {node.stepCode}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    color: COLORS.inkPrimary,
                  }}
                >
                  {node.title}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 22,
                    fontWeight: 500,
                    color: COLORS.inkSecondary,
                  }}
                >
                  {node.detail}
                </span>
              </div>

              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 34,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: accent,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {node.metric}
              </div>
            </div>

            {/* Connector Arrow between nodes */}
            {index < nodes.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 34,
                  opacity: arrowSpring,
                  transform: `scaleY(${arrowSpring})`,
                }}
              >
                <svg width="36" height="34" viewBox="0 0 36 34" fill="none">
                  <path
                    d="M18 2V28M18 28L9 19M18 28L27 19"
                    stroke={COLORS.inkMuted}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Authority Stamp Overlay */}
      {stampText && localFrame >= stampRevealFrame && (
        <div
          style={{
            marginTop: 14,
            padding: '20px 28px',
            borderRadius: 16,
            backgroundColor: COLORS.crimsonSoft,
            border: `1.5px solid rgba(242, 63, 93, 0.52)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: interpolate(stampSpring, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
            transform: `scale(${interpolate(stampSpring, [0, 1], [1.16, 1])})`,
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: COLORS.crimson,
              }}
            >
              {stampText}
            </span>
            {stampSubtext && (
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 21,
                  color: COLORS.inkSecondary,
                }}
              >
                {stampSubtext}
              </span>
            )}
          </div>

          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 22,
              fontWeight: 700,
              padding: '8px 16px',
              borderRadius: 8,
              backgroundColor: 'rgba(242, 63, 93, 0.22)',
              color: '#FFE4E8',
              letterSpacing: '0.1em',
            }}
          >
            {stampBadgeText}
          </span>
        </div>
      )}
    </div>
  );
};
