import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SAFE_ZONE, SPRINGS} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';
import {AnimatedMoneyTicker} from '../../components/primitives/AnimatedMoneyTicker';
import {ComparisonBarChart} from '../../components/primitives/ComparisonBarChart';
import {ReceiptAndUiCard} from '../../components/primitives/ReceiptAndUiCard';
import {FlowNodeGraph} from '../../components/primitives/FlowNodeGraph';

const StageShell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: SPRINGS.editorial,
  });

  const exitOpacity = interpolate(
    frame,
    [Math.max(0, durationInFrames - 10), durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.stageTop,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.rightLower,
        height: SAFE_ZONE.stageHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: Math.min(enter, exitOpacity),
        transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Beat 1: Minimalist Fine-Dining Menu Card Surgery ($28.00 -> Clean Floating 28) + +8.2% Spend Ticker
 */
export const MenuHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardReveal = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: SPRINGS.snappy,
  });

  // Surgical strike & fade of '$' and '.00' into a clean floating '28'
  const strikeProgress = interpolate(frame, [20, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOutProgress = interpolate(frame, [38, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const floatSpring = spring({
    frame: Math.max(0, frame - 46),
    fps,
    config: SPRINGS.heavy,
  });

  const strippedSymbolOpacity = interpolate(fadeOutProgress, [0, 1], [1, 0.16]);
  const strippedSymbolScale = interpolate(fadeOutProgress, [0, 1], [1, 0.88]);

  return (
    <StageShell>
      <div
        style={{
          padding: '36px 40px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Header */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: COLORS.amber,
            }}
          >
            MENU PSYCHOLOGY // CURRENCY ERASURE
          </span>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: COLORS.inkPrimary,
            }}
          >
            Why Fancy Menus Cut the &ldquo;$&rdquo;
          </span>
        </div>

        {/* Fine-Dining Menu Surgery Card */}
        <div
          style={{
            padding: '22px 26px',
            borderRadius: 20,
            backgroundColor: COLORS.surface2,
            border: `1.5px solid ${COLORS.borderHighlight}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            opacity: cardReveal,
            transform: `translateY(${interpolate(cardReveal, [0, 1], [14, 0])}px)`,
          }}
        >
          {/* Bistro Menu Eyebrow Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 12,
              borderBottom: `1px solid ${COLORS.borderSubtle}`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: COLORS.inkMuted,
              }}
            >
              ST. ANDREW&apos;S CAFÉ // ENTRÉES
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: fadeOutProgress > 0.5 ? COLORS.amberSoft : COLORS.crimsonSoft,
                color: fadeOutProgress > 0.5 ? COLORS.amber : COLORS.crimson,
              }}
            >
              {fadeOutProgress > 0.5 ? 'NAKED NUMERAL' : 'SYMBOL DELETED'}
            </span>
          </div>

          {/* Menu Line + Surgical Price Display */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 18,
            }}
          >
            {/* Dish Description */}
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 27,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: COLORS.inkPrimary,
                }}
              >
                Seared Diver Scallops
              </span>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 19,
                  fontWeight: 500,
                  color: COLORS.inkSecondary,
                }}
              >
                saffron risotto · Meyer lemon
              </span>
            </div>

            {/* Surgical Price Stage: $ [28] .00 -> Clean Floating 28 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  padding: '10px 16px',
                  borderRadius: 14,
                  backgroundColor: COLORS.bgCanvas,
                  border: `1px solid ${COLORS.borderSubtle}`,
                }}
              >
                {/* Crimson '$' struck & faded */}
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    fontFamily: FONTS.mono,
                    fontSize: 38,
                    fontWeight: 700,
                    color: COLORS.crimson,
                    opacity: strippedSymbolOpacity,
                    transform: `scale(${strippedSymbolScale})`,
                  }}
                >
                  $
                  <span
                    style={{
                      position: 'absolute',
                      left: -3,
                      right: -3,
                      top: '50%',
                      height: 3.5,
                      borderRadius: 2,
                      backgroundColor: COLORS.crimson,
                      transform: `scaleX(${strikeProgress}) rotate(-14deg)`,
                      transformOrigin: 'left center',
                    }}
                  />
                </span>

                {/* Clean Floating '28' */}
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: FONTS.mono,
                    fontSize: 46,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: COLORS.inkPrimary,
                    padding: '0 4px',
                    transform: `translateY(${interpolate(floatSpring, [0, 1], [0, -3])}px) scale(${interpolate(floatSpring, [0, 1], [1, 1.08])})`,
                  }}
                >
                  28
                </span>

                {/* Crimson '.00' struck & faded */}
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    fontFamily: FONTS.mono,
                    fontSize: 34,
                    fontWeight: 700,
                    color: COLORS.crimson,
                    opacity: strippedSymbolOpacity,
                    transform: `scale(${strippedSymbolScale})`,
                  }}
                >
                  .00
                  <span
                    style={{
                      position: 'absolute',
                      left: -3,
                      right: -3,
                      top: '52%',
                      height: 3.5,
                      borderRadius: 2,
                      backgroundColor: COLORS.crimson,
                      transform: `scaleX(${strikeProgress}) rotate(-10deg)`,
                      transformOrigin: 'left center',
                    }}
                  />
                </span>
              </div>

              {/* Clean Floating Result Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: floatSpring,
                  transform: `translateX(${interpolate(floatSpring, [0, 1], [-10, 0])}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.amber,
                  }}
                >
                  →
                </span>
                <div
                  style={{
                    padding: '10px 18px',
                    borderRadius: 14,
                    backgroundColor: COLORS.emeraldSoft,
                    border: '1.5px solid rgba(16, 217, 136, 0.52)',
                    fontFamily: FONTS.mono,
                    fontSize: 42,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: COLORS.emerald,
                  }}
                >
                  28
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* +8.2% Spend Ticker */}
        <AnimatedMoneyTicker
          from={0}
          to={8.2}
          decimals={1}
          startFrame={26}
          durationInFrames={95}
          prefix="+"
          suffix="% SPEND"
          eyebrow="AVERAGE DINER CHECK LIFT"
          sublabel="Stripping currency symbols disarms your brain's loss detector at the table."
          accentColor={COLORS.emerald}
          size="lg"
        />

        {/* Bottom 2-Stat Reality Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            paddingTop: 20,
            borderTop: `1px solid ${COLORS.borderSubtle}`,
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              backgroundColor: COLORS.surface2,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                letterSpacing: '0.11em',
                color: COLORS.inkMuted,
              }}
            >
              CORNELL STUDY SAMPLE
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.amber,
              }}
            >
              DINERS
            </span>
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              backgroundColor: COLORS.surface2,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                letterSpacing: '0.11em',
                color: COLORS.inkMuted,
              }}
            >
              PAIN OF PAYING
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.emerald,
              }}
            >
              MUTED
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 2: Cornell St. Andrew's Café Study (3 Identical Menus -> +8.15% Higher Bill on Naked Numerals)
 */
export const CornellStudyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const calloutSpring = spring({
    frame: Math.max(0, frame - 78),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <StageShell>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
        <ComparisonBarChart
          eyebrow="CORNELL HOSPITALITY // ST. ANDREW'S CAFÉ"
          title="Naked Numbers Spike the Bill"
          maxValue={100}
          startFrame={4}
          staggerFrames={22}
          bars={[
            {
              id: 'currency-symbol',
              label: '"$28.00" Currency Symbol',
              sublabel: 'CONTROL',
              value: 52,
              formattedValue: 'BASE',
              isHighlight: false,
            },
            {
              id: 'written-word',
              label: '"28 dollars" Written Word',
              sublabel: 'SPELLED',
              value: 50,
              formattedValue: 'FLAT',
              isHighlight: false,
            },
            {
              id: 'naked-numerals',
              label: '"28" Naked Numerals',
              sublabel: 'WINNER',
              value: 92,
              formattedValue: '+8.15%',
              isHighlight: true,
              accentColor: COLORS.emerald,
            },
          ]}
          footnote="Identical dishes & prices — only the price typography changed."
        />

        {/* Highlighted Emerald Lift Banner */}
        <div
          style={{
            padding: '20px 28px',
            borderRadius: 18,
            backgroundColor: COLORS.emeraldSoft,
            border: '1.5px solid rgba(16, 217, 136, 0.50)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: calloutSpring,
            transform: `scale(${interpolate(calloutSpring, [0, 1], [0.95, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: COLORS.inkPrimary,
            }}
          >
            NAKED NUMERAL MENU RESULT
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 26,
              fontWeight: 700,
              color: COLORS.emerald,
              letterSpacing: '0.04em',
            }}
          >
            +8.15% HIGHER BILL
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 3: Behavioral Economics "Pain of Paying" Brain Signal Contrast
 */
export const PainOfPayingScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="NEUROECONOMICS // THE PAIN OF PAYING"
        title="Currency Symbols Trigger Pain"
        presetLabel="BRAIN SCAN // MENU FORMAT TESTED"
        selectedPresetFrame={42}
        presets={[
          {label: '$34.00'},
          {label: 'DOLLARS'},
          {label: '34', selected: true},
        ]}
        lineItems={[
          {
            label: 'Format A: "$34.00"',
            amount: 'LOSS ALARM',
            tone: 'highlight-crimson',
            revealDelayFrames: 22,
          },
          {
            label: 'Format B: "thirty-four dollars"',
            amount: 'HIGH FRICTION',
            tone: 'highlight-amber',
            revealDelayFrames: 64,
          },
          {
            label: 'Format C: "34"',
            amount: 'ZERO FRICTION',
            tone: 'highlight-emerald',
            revealDelayFrames: 108,
          },
        ]}
        calloutTitle="BILL INFLATION PER TABLE"
        calloutValue="+8.2%"
        calloutTone="crimson"
        calloutRevealFrame={146}
      />
    </StageShell>
  );
};

/**
 * Beat 4: Bespoke 2x2 Architectural Menu Grid ($95 Top-Right Anchor -> 38 High-Margin Pasta Target)
 */
export const GoldenTriangleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const anchorPulse = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: SPRINGS.snappy,
  });

  const scanSweep = interpolate(frame, [46, 92], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const targetLock = spring({
    frame: Math.max(0, frame - 84),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <StageShell>
      <div
        style={{
          padding: '34px 38px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: COLORS.amber,
            }}
          >
            EYE-TRACKING GEOMETRY // MENU LAYOUT
          </span>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: COLORS.inkPrimary,
            }}
          >
            The $95 Top-Right Anchor Bait
          </span>
        </div>

        {/* 2x2 Architectural Menu Grid */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {/* Top Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.88fr 1.12fr',
              gap: 16,
              alignItems: 'stretch',
            }}
          >
            {/* Top-Left: Entry Scan Dish */}
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 18,
                backgroundColor: COLORS.surface2,
                border: `1px solid ${COLORS.borderSubtle}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                opacity: 0.78,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: COLORS.inkMuted,
                }}
              >
                TOP-LEFT // WARM-UP
              </span>
              <div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.inkSecondary,
                  }}
                >
                  Charred Octopus
                </div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 15,
                    color: COLORS.inkMuted,
                    marginTop: 2,
                  }}
                >
                  starter · moderate margin
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.inkSecondary,
                }}
              >
                24
              </div>
            </div>

            {/* Top-Right: $95 Wagyu Ribeye Anchor Bait */}
            <div
              style={{
                padding: '18px 22px',
                borderRadius: 18,
                backgroundColor: COLORS.crimsonSoft,
                border: '1.5px solid rgba(242, 63, 93, 0.56)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                opacity: anchorPulse,
                transform: `scale(${interpolate(anchorPulse, [0, 1], [0.95, 1])})`,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.09em',
                    color: COLORS.crimson,
                  }}
                >
                  TOP-RIGHT ANCHOR
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(242, 63, 93, 0.24)',
                    color: '#FFE4E8',
                    letterSpacing: '0.08em',
                  }}
                >
                  BAIT
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 25,
                    fontWeight: 800,
                    color: COLORS.inkPrimary,
                  }}
                >
                  $95 Wagyu Ribeye
                </div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 17,
                    color: '#FFD4DC',
                    marginTop: 2,
                  }}
                >
                  Sets an extreme price ceiling
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 36,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: COLORS.crimson,
                  }}
                >
                  95
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#FFD4DC',
                  }}
                >
                  EYE FIXATION #1
                </span>
              </div>
            </div>
          </div>

          {/* Animated Eye-Scan Sweep Corridor (Right Column Vector Arrow) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.88fr 1.12fr',
              gap: 16,
              alignItems: 'center',
              height: 48,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                letterSpacing: '0.08em',
                color: COLORS.inkMuted,
                paddingLeft: 6,
              }}
            >
              GAZE PATH → DOWNWARD
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                opacity: interpolate(scanSweep, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'}),
              }}
            >
              <svg width="34" height="44" viewBox="0 0 34 44" fill="none">
                <line
                  x1="17"
                  y1="3"
                  x2="17"
                  y2={3 + 31 * scanSweep}
                  stroke={COLORS.amber}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeDasharray="5 4"
                />
                {scanSweep > 0.65 && (
                  <path
                    d="M8 27L17 37L26 27"
                    stroke={COLORS.emerald}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.amber,
                  letterSpacing: '0.06em',
                }}
              >
                EYE SCAN: 95 → 38 (-$57 DROP)
              </span>
            </div>
          </div>

          {/* Bottom Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.88fr 1.12fr',
              gap: 16,
              alignItems: 'stretch',
            }}
          >
            {/* Bottom-Left: Low-Margin Filler */}
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 18,
                backgroundColor: COLORS.surface2,
                border: `1px solid ${COLORS.borderSubtle}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                opacity: 0.68,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: COLORS.inkMuted,
                }}
              >
                BOTTOM-LEFT // FILLER
              </span>
              <div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.inkSecondary,
                  }}
                >
                  Roast Half Chicken
                </div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 15,
                    color: COLORS.inkMuted,
                    marginTop: 2,
                  }}
                >
                  high food cost · unboxed
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.inkMuted,
                }}
              >
                32
              </div>
            </div>

            {/* Bottom-Right: Target High-Margin Pasta */}
            <div
              style={{
                padding: '18px 22px',
                borderRadius: 18,
                backgroundColor: COLORS.emeraldSoft,
                border: `2px solid ${
                  targetLock > 0.2 ? 'rgba(16, 217, 136, 0.72)' : COLORS.borderSubtle
                }`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                transform: `scale(${interpolate(targetLock, [0, 1], [0.97, 1.02])})`,
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    color: COLORS.emerald,
                  }}
                >
                  TARGET HIGH-MARGIN PASTA
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    backgroundColor: 'rgba(16, 217, 136, 0.22)',
                    color: COLORS.emerald,
                  }}
                >
                  78% MARGIN
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 25,
                    fontWeight: 800,
                    color: COLORS.inkPrimary,
                  }}
                >
                  Truffle Tagliatelle
                </div>
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 17,
                    color: COLORS.inkSecondary,
                    marginTop: 2,
                  }}
                >
                  Flour, egg &amp; butter — huge profit
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 38,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: COLORS.emerald,
                  }}
                >
                  38
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 15,
                    fontWeight: 700,
                    color: COLORS.emerald,
                    letterSpacing: '0.06em',
                  }}
                >
                  FEELS CHEAP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Summary Strip */}
        <div
          style={{
            padding: '16px 22px',
            borderRadius: 14,
            backgroundColor: COLORS.amberSoft,
            border: '1px solid rgba(245, 166, 35, 0.45)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: targetLock,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: COLORS.amber,
            }}
          >
            ANCHOR BAIT: $95 STEAK
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.inkPrimary,
            }}
          >
            STEERS ORDERS → 38 PASTA
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 5: Full Menu Engineering Playbook Stack + ENGINEERED MENU TRAP Stamp
 */
export const MenuStackScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={34}
        stampRevealFrame={147}
        nodes={[
          {
            id: 'menu-trick-1',
            stepCode: 'TRICK 01 // STRIP THE "$" SIGN',
            title: 'Delete Currency Symbols',
            detail: 'Naked numbers mute your brain’s pain-of-paying alarm',
            metric: '+8.2% BILL',
            accent: 'amber',
          },
          {
            id: 'menu-trick-2',
            stepCode: 'TRICK 02 // TOP-RIGHT $95 ANCHOR',
            title: 'Anchor Bait + Shaded Box',
            detail: 'Pricey decoy steak & borders push 78%-margin pasta',
            metric: '78% MARGIN',
            accent: 'amber',
          },
          {
            id: 'menu-trick-3',
            stepCode: 'TRICK 03 // SENSORY ADJECTIVES',
            title: '“Wood-Fired Heirloom” Copy',
            detail: 'Lush sensory labels boost dish orders by up to 27%',
            metric: '+27% SALES',
            accent: 'crimson',
          },
        ]}
        stampText="ENGINEERED MENU"
        stampSubtext="Every square inch of the page is steering your wallet"
        stampBadgeText="TRAP"
      />
    </StageShell>
  );
};

/**
 * Beat 6: Side-by-Side Check Comparison (HONEST MENU vs ENGINEERED MENU) + Loop Bridge
 */
export const MenuLoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const leftCard = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRINGS.snappy,
  });

  const rightCard = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: SPRINGS.heavy,
  });

  const revealPayoff = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: SPRINGS.editorial,
  });

  return (
    <StageShell>
      <div
        style={{
          padding: '38px 40px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 18,
            borderBottom: `1px dashed ${COLORS.borderHighlight}`,
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 17,
                letterSpacing: '0.14em',
                color: COLORS.inkMuted,
              }}
            >
              CHECK PLEASE // THE REAL TAB
            </span>
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 31,
                fontWeight: 800,
                color: COLORS.inkPrimary,
              }}
            >
              Minimalism Was the Disguise
            </span>
          </div>

          <div
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              backgroundColor: COLORS.crimsonSoft,
              border: '1px solid rgba(242, 63, 93, 0.45)',
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.crimson,
              letterSpacing: '0.08em',
            }}
          >
            +8% PADDED
          </div>
        </div>

        {/* Side-by-Side Check Comparison */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
            alignItems: 'stretch',
          }}
        >
          {/* Left: Honest Menu ($28.00) */}
          <div
            style={{
              padding: '22px 20px',
              borderRadius: 18,
              backgroundColor: COLORS.surface2,
              border: `1.5px solid ${COLORS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 14,
              opacity: leftCard,
              transform: `translateY(${interpolate(leftCard, [0, 1], [14, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: COLORS.inkMuted,
              }}
            >
              HONEST MENU ($28.00)
            </span>

            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 44,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: COLORS.inkSecondary,
              }}
            >
              $28.00
            </div>

            <div
              style={{
                paddingTop: 12,
                borderTop: `1px solid ${COLORS.borderSubtle}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLORS.emerald,
                  letterSpacing: '0.06em',
                }}
              >
                GUARD UP
              </span>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  color: COLORS.inkSecondary,
                }}
              >
                Symbol signals real cash spent
              </span>
            </div>
          </div>

          {/* Right: Engineered Menu (28) */}
          <div
            style={{
              padding: '22px 20px',
              borderRadius: 18,
              backgroundColor: COLORS.crimsonSoft,
              border: '1.5px solid rgba(242, 63, 93, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 14,
              opacity: rightCard,
              transform: `translateY(${interpolate(rightCard, [0, 1], [14, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: COLORS.crimson,
              }}
            >
              ENGINEERED MENU (28)
            </span>

            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 44,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: COLORS.inkPrimary,
              }}
            >
              28
            </div>

            <div
              style={{
                paddingTop: 12,
                borderTop: '1px solid rgba(242, 63, 93, 0.30)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#FFE4E8',
                  letterSpacing: '0.04em',
                }}
              >
                +8% EXTRA EXTRACTED
              </span>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  color: '#FFD4DC',
                }}
              >
                Muted pain pads your table bill
              </span>
            </div>
          </div>
        </div>

        {/* Final Payoff Headline + Seamless Loop Bridge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 12,
            opacity: revealPayoff,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: COLORS.inkPrimary,
            }}
          >
            Not Minimalist Graphic Design.
            <br />
            <span style={{color: COLORS.crimson}}>Behavioral Math on Your Check.</span>
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              color: COLORS.inkMuted,
              letterSpacing: '0.08em',
            }}
          >
            WHICH IS WHY... ↺
          </div>
        </div>
      </div>
    </StageShell>
  );
};
