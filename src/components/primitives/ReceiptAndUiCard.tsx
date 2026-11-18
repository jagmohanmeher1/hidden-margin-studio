import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SPRINGS} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';

export interface PresetChip {
  label: string;
  selected?: boolean;
}

export interface ReceiptLineItem {
  label: string;
  amount: string;
  tone?: 'default' | 'muted' | 'highlight-amber' | 'highlight-emerald' | 'highlight-crimson';
  revealDelayFrames?: number;
}

export interface ReceiptAndUiCardProps {
  eyebrow: string;
  title: string;
  presets?: PresetChip[];
  presetLabel?: string;
  selectedPresetFrame?: number;
  lineItems: ReceiptLineItem[];
  calloutTitle?: string;
  calloutValue?: string;
  calloutTone?: 'amber' | 'emerald' | 'crimson';
  calloutRevealFrame?: number;
  startFrame?: number;
}

export const ReceiptAndUiCard: React.FC<ReceiptAndUiCardProps> = ({
  eyebrow,
  title,
  presets,
  presetLabel = 'PRESET RELOAD OPTIONS',
  selectedPresetFrame = 28,
  lineItems,
  calloutTitle,
  calloutValue,
  calloutTone = 'amber',
  calloutRevealFrame = 70,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: SPRINGS.editorial,
  });

  const tapSpring = spring({
    frame: Math.max(0, localFrame - selectedPresetFrame),
    fps,
    config: SPRINGS.snappy,
  });

  const calloutSpring = spring({
    frame: Math.max(0, localFrame - calloutRevealFrame),
    fps,
    config: SPRINGS.heavy,
  });

  const toneColor =
    calloutTone === 'crimson'
      ? COLORS.crimson
      : calloutTone === 'emerald'
        ? COLORS.emerald
        : COLORS.amber;

  const toneBg =
    calloutTone === 'crimson'
      ? COLORS.crimsonSoft
      : calloutTone === 'emerald'
        ? COLORS.emeraldSoft
        : COLORS.amberSoft;

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 24,
        backgroundColor: COLORS.surface1,
        border: `1px solid ${COLORS.borderSubtle}`,
        boxShadow: '0 32px 68px rgba(0, 0, 0, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        padding: '38px 42px',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        opacity: cardSpring,
        transform: `translateY(${interpolate(cardSpring, [0, 1], [26, 0])}px)`,
      }}
    >
      {/* Card Header */}
      <div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.inkMuted,
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: COLORS.inkPrimary,
          }}
        >
          {title}
        </div>
      </div>

      {/* Optional App Reload / Pricing Tier Buttons */}
      {presets && presets.length > 0 && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: COLORS.inkMuted,
            }}
          >
            {presetLabel}
          </div>
          <div style={{display: 'flex', gap: 16}}>
            {presets.map((chip) => {
              const isSelected = Boolean(chip.selected) && localFrame >= selectedPresetFrame;
              const scale = chip.selected
                ? interpolate(tapSpring, [0, 0.4, 1], [1, 0.94, 1.03])
                : 1;

              return (
                <div
                  key={chip.label}
                  style={{
                    flex: 1,
                    height: 88,
                    borderRadius: 16,
                    backgroundColor: isSelected ? COLORS.emeraldSoft : COLORS.surface2,
                    border: `1px solid ${isSelected ? 'rgba(16, 217, 136, 0.42)' : COLORS.borderSubtle}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTS.mono,
                    fontSize: 34,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: isSelected ? COLORS.emerald : COLORS.inkSecondary,
                    transform: `scale(${scale})`,
                  }}
                >
                  {chip.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{height: 1, backgroundColor: COLORS.borderSubtle}} />

      {/* Line Items */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        {lineItems.map((item, idx) => {
          const delay = item.revealDelayFrames ?? 18 + idx * 14;
          const rowSpring = spring({
            frame: Math.max(0, localFrame - delay),
            fps,
            config: SPRINGS.editorial,
          });

          const valueColor =
            item.tone === 'highlight-amber'
              ? COLORS.amber
              : item.tone === 'highlight-emerald'
                ? COLORS.emerald
                : item.tone === 'highlight-crimson'
                  ? COLORS.crimson
                  : item.tone === 'muted'
                    ? COLORS.inkMuted
                    : COLORS.inkPrimary;

          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [-14, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 27,
                  fontWeight: 600,
                  color: item.tone === 'muted' ? COLORS.inkMuted : COLORS.inkSecondary,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 30,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: valueColor,
                }}
              >
                {item.amount}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Trapped Balance / Loophole Callout */}
      {calloutTitle && calloutValue && (
        <div
          style={{
            marginTop: 6,
            padding: '24px 28px',
            borderRadius: 18,
            backgroundColor: toneBg,
            border: `1px solid ${COLORS.borderHighlight}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: calloutSpring,
            transform: `scale(${interpolate(calloutSpring, [0, 1], [0.94, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: COLORS.inkPrimary,
            }}
          >
            {calloutTitle}
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 40,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              color: toneColor,
            }}
          >
            {calloutValue}
          </span>
        </div>
      )}
    </div>
  );
};
