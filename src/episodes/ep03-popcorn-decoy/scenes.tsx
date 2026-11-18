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

interface PopcornTubSvgProps {
  scaleHeight: number;
  strokeColor: string;
  fillColor: string;
  dashed?: boolean;
}

const PopcornTubSvg: React.FC<PopcornTubSvgProps> = ({
  scaleHeight,
  strokeColor,
  fillColor,
  dashed = false,
}) => {
  return (
    <svg
      width={Math.round(scaleHeight * 0.78)}
      height={scaleHeight}
      viewBox="0 0 64 82"
      fill="none"
    >
      {/* Popped Kernels Crown */}
      <path
        d="M14 26C12 20 17 14 23 16C25 10 33 9 37 14C43 11 51 16 49 24"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      {/* Tapered Cinema Tub */}
      <path
        d="M12 26H52L46 74H18L12 26Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.8"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      {/* Classic Concession Stripes */}
      <line
        x1="25"
        y1="27"
        x2="27"
        y2="73"
        stroke={strokeColor}
        strokeWidth="2"
        strokeOpacity={dashed ? 0.45 : 0.7}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <line
        x1="39"
        y1="27"
        x2="37"
        y2="73"
        stroke={strokeColor}
        strokeWidth="2"
        strokeOpacity={dashed ? 0.45 : 0.7}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
    </svg>
  );
};

/**
 * Beat 1: 3 Minimalist Popcorn Tub Silhouettes ($6 / $8.50 Decoy / $9 Target) + +40% Large Spike
 */
export const PopcornHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const tub1 = spring({frame: Math.max(0, frame - 4), fps, config: SPRINGS.snappy});
  const tub2 = spring({frame: Math.max(0, frame - 14), fps, config: SPRINGS.snappy});
  const tub3 = spring({frame: Math.max(0, frame - 26), fps, config: SPRINGS.heavy});

  const tiers = [
    {
      id: 'small',
      sizeLabel: 'SMALL',
      roleTag: 'ANCHOR',
      price: '$6.00',
      svgH: 64,
      progress: tub1,
      bg: COLORS.surface2,
      border: COLORS.borderSubtle,
      stroke: COLORS.inkSecondary,
      fill: 'rgba(148, 163, 184, 0.10)',
      tagColor: COLORS.inkMuted,
      priceColor: COLORS.inkPrimary,
    },
    {
      id: 'medium',
      sizeLabel: 'MEDIUM',
      roleTag: 'DECOY BAIT',
      price: '$8.50',
      svgH: 80,
      progress: tub2,
      bg: COLORS.crimsonSoft,
      border: 'rgba(242, 63, 93, 0.52)',
      stroke: COLORS.crimson,
      fill: 'rgba(242, 63, 93, 0.16)',
      tagColor: COLORS.crimson,
      priceColor: '#FFE4E8',
    },
    {
      id: 'large',
      sizeLabel: 'LARGE',
      roleTag: 'TARGET',
      price: '$9.00',
      svgH: 96,
      progress: tub3,
      bg: COLORS.emeraldSoft,
      border: 'rgba(16, 217, 136, 0.55)',
      stroke: COLORS.emerald,
      fill: 'rgba(16, 217, 136, 0.18)',
      tagColor: COLORS.emerald,
      priceColor: COLORS.emerald,
    },
  ];

  return (
    <StageShell>
      <div
        style={{
          padding: '38px 42px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
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
            BEHAVIORAL PRICING // MENU ARCHITECTURE
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
            The Medium Popcorn Decoy
          </span>
        </div>

        {/* 3-Column Tub Silhouette Lineup */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                padding: '18px 16px',
                borderRadius: 18,
                backgroundColor: tier.bg,
                border: `1.5px solid ${tier.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                opacity: tier.progress,
                transform: `translateY(${interpolate(tier.progress, [0, 1], [16, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: tier.tagColor,
                }}
              >
                {tier.roleTag}
              </span>

              <div
                style={{
                  height: 100,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <PopcornTubSvg
                  scaleHeight={tier.svgH}
                  strokeColor={tier.stroke}
                  fillColor={tier.fill}
                />
              </div>

              <div style={{textAlign: 'center'}}>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: COLORS.inkSecondary,
                  }}
                >
                  {tier.sizeLabel}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 30,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: tier.priceColor,
                  }}
                >
                  {tier.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conversion Spike Ticker */}
        <AnimatedMoneyTicker
          from={0}
          to={40}
          startFrame={18}
          durationInFrames={95}
          prefix="+"
          suffix="% LARGE"
          eyebrow="ASYMMETRIC DOMINANCE CONVERSION SURGE"
          sublabel="The $8.50 medium exists solely to push your brain into the $9.00 tub."
          accentColor={COLORS.emerald}
          size="lg"
        />

        {/* Bottom 2-Stat Reality Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            paddingTop: 22,
            borderTop: `1px solid ${COLORS.borderSubtle}`,
          }}
        >
          <div
            style={{
              padding: '18px 22px',
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
                fontSize: 16,
                letterSpacing: '0.12em',
                color: COLORS.inkMuted,
              }}
            >
              RAW CORN COST
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.amber,
              }}
            >
              $0.65
            </span>
          </div>

          <div
            style={{
              padding: '18px 22px',
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
                fontSize: 16,
                letterSpacing: '0.12em',
                color: COLORS.inkMuted,
              }}
            >
              GROSS MARGIN
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.emerald,
              }}
            >
              93%
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 2: Two-Tier Baseline ($6 Small vs $9 Large -> 72% Pick Small Due to +$3 Sticker Shock)
 */
export const TwoTierBaselineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const calloutSpring = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <StageShell>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        <ComparisonBarChart
          eyebrow="CONTROL TEST // TWO-SIZE CONCESSION BOARD"
          title="Without a Decoy, $9 Feels Crazy"
          maxValue={100}
          startFrame={4}
          staggerFrames={24}
          bars={[
            {
              id: 'small-baseline',
              label: 'Small Tub ($6.00)',
              sublabel: 'SENSIBLE PICK',
              value: 72,
              formattedValue: '72%',
              isHighlight: true,
              accentColor: COLORS.emerald,
            },
            {
              id: 'large-baseline',
              label: 'Large Tub ($9.00)',
              sublabel: '+$3.00 STICKER SHOCK',
              value: 28,
              formattedValue: '28%',
              isHighlight: false,
            },
          ]}
          footnote="Direct $6.00 → $9.00 comparison triggers +50% markup resistance."
        />

        {/* Sticker-Shock Callout */}
        <div
          style={{
            padding: '22px 28px',
            borderRadius: 18,
            backgroundColor: COLORS.crimsonSoft,
            border: '1.5px solid rgba(242, 63, 93, 0.48)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: calloutSpring,
            transform: `scale(${interpolate(calloutSpring, [0, 1], [0.95, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 24,
              fontWeight: 700,
              color: '#FFE4E8',
            }}
          >
            Buyer Brain: &ldquo;+$3.00 for Corn? No Chance.&rdquo;
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.crimson,
              letterSpacing: '0.08em',
            }}
          >
            REJECTED
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 3: Dropping the $8.50 Decoy -> $9.00 Large Looks Like a +$0.50 Bargain
 */
export const DecoyPricingScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="ASYMMETRIC DOMINANCE // THE $8.50 BAIT"
        title="Drop a Decoy Right in the Middle"
        presetLabel="NEW 3-TIER CONCESSION BOARD"
        selectedPresetFrame={42}
        presets={[
          {label: 'S  $6.00'},
          {label: 'M  $8.50'},
          {label: 'L  $9.00', selected: true},
        ]}
        lineItems={[
          {
            label: 'Old Jump ($6.00 → $9.00)',
            amount: '+$3.00 PAIN',
            tone: 'muted',
            revealDelayFrames: 28,
          },
          {
            label: 'Middle Bait Tier Added',
            amount: '$8.50 DECOY',
            tone: 'highlight-amber',
            revealDelayFrames: 82,
          },
          {
            label: 'Perceived Upgrade ($8.50 → $9.00)',
            amount: '+$0.50 STEAL',
            tone: 'highlight-emerald',
            revealDelayFrames: 134,
          },
        ]}
        calloutTitle="LARGE CONVERSION SPIKE"
        calloutValue="+40% SURGE"
        calloutTone="emerald"
        calloutRevealFrame={178}
      />
    </StageShell>
  );
};

/**
 * Beat 4: $0.65 Raw Corn & Oil Cost Breakdown -> 93% Gross Profit Margin
 */
export const RawCornMarginScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const costParts = [
    {label: 'Raw Popping Corn Kernels', cost: '$0.22', delay: 16},
    {label: 'Coconut Oil & Butter Salt', cost: '$0.18', delay: 44},
    {label: 'Printed Paper Cinema Tub', cost: '$0.25', delay: 72},
  ];

  const totalSpring = spring({
    frame: Math.max(0, frame - 98),
    fps,
    config: SPRINGS.snappy,
  });

  return (
    <StageShell>
      <div
        style={{
          padding: '38px 42px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: COLORS.inkMuted,
              marginBottom: 8,
            }}
          >
            UNIT ECONOMICS // INSIDE A $9.00 TUB
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
            65 Cents of Ingredients
          </div>
        </div>

        {/* 3 Ingredient Rows */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {costParts.map((item) => {
            const rowSpring = spring({
              frame: Math.max(0, frame - item.delay),
              fps,
              config: SPRINGS.editorial,
            });
            return (
              <div
                key={item.label}
                style={{
                  padding: '15px 22px',
                  borderRadius: 14,
                  backgroundColor: COLORS.surface2,
                  border: `1px solid ${COLORS.borderSubtle}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: rowSpring,
                  transform: `translateX(${interpolate(rowSpring, [0, 1], [-18, 0])}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 23,
                    fontWeight: 600,
                    color: COLORS.inkSecondary,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 25,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: COLORS.inkPrimary,
                  }}
                >
                  {item.cost}
                </span>
              </div>
            );
          })}

          {/* Total COGS vs Menu Price Bar */}
          <div
            style={{
              padding: '16px 22px',
              borderRadius: 14,
              backgroundColor: COLORS.amberSoft,
              border: '1px solid rgba(245, 166, 35, 0.45)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: totalSpring,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: COLORS.amber,
              }}
            >
              TOTAL COGS: $0.65
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 21,
                fontWeight: 700,
                color: COLORS.inkPrimary,
              }}
            >
              SOLD FOR → $9.00
            </span>
          </div>
        </div>

        <div style={{height: 1, backgroundColor: COLORS.borderSubtle}} />

        {/* 93% Gross Margin Hero Counter */}
        <AnimatedMoneyTicker
          from={0}
          to={93}
          startFrame={88}
          durationInFrames={110}
          prefix=""
          suffix="% MARGIN"
          eyebrow="CINEMA GROSS PROFIT PER LARGE TUB"
          sublabel="$8.35 pure profit per bucket — where theaters actually make their money."
          accentColor={COLORS.emerald}
          size="lg"
        />
      </div>
    </StageShell>
  );
};

/**
 * Beat 5: Decoys Rigging Menus Everywhere (Coffee, Phone Storage, Subscriptions)
 */
export const EverywhereDecoysScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={38}
        stampRevealFrame={145}
        nodes={[
          {
            id: 'decoy-1',
            stepCode: 'TRAP 01 // COFFEE SHOP SIZES',
            title: 'Grande vs Venti Ladder',
            detail: 'Priced 50¢ below Venti so the largest cup feels automatic',
            metric: '+$0.50 BAIT',
            accent: 'amber',
          },
          {
            id: 'decoy-2',
            stepCode: 'TRAP 02 // SMARTPHONE STORAGE',
            title: 'Cramped Base Storage Tier',
            detail: 'Awkward middle tier nudges buyers up the +$200 Pro ladder',
            metric: '+$200 JUMP',
            accent: 'amber',
          },
          {
            id: 'decoy-3',
            stepCode: 'TRAP 03 // SUBSCRIPTION BUNDLES',
            title: 'MIT Economist Study',
            detail: 'Print-only decoy jumped combo selection from 32% → 84%',
            metric: '84% PICKED',
            accent: 'crimson',
          },
        ]}
        stampText="BEHAVIORAL PRICE TRAP"
        stampSubtext="You aren't choosing freely — you're following the decoy"
        stampBadgeText="TRAP"
      />
    </StageShell>
  );
};

/**
 * Beat 6: Ghost Decoy Fade ($8.50 Never Meant to Sell) + +$3.00 Extracted Loop Bridge
 */
export const DecoyLoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ghostFade = interpolate(frame, [16, 76], [1, 0.36], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
          padding: '40px 42px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
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
              THE ILLUSION OF WINNING
            </span>
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 32,
                fontWeight: 800,
                color: COLORS.inkPrimary,
              }}
            >
              How the Menu Played You
            </span>
          </div>

          <div
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              backgroundColor: COLORS.crimsonSoft,
              border: '1px solid rgba(242, 63, 93, 0.45)',
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 700,
              color: COLORS.crimson,
              letterSpacing: '0.08em',
            }}
          >
            +$3.00 UPSOLD
          </div>
        </div>

        {/* 3-Column Comparison with Fading Ghost Middle Tub */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {/* Small: What You Came For */}
          <div
            style={{
              padding: '18px 14px',
              borderRadius: 18,
              backgroundColor: COLORS.surface2,
              border: `1px solid ${COLORS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: COLORS.inkMuted,
              }}
            >
              NEEDED
            </span>
            <PopcornTubSvg
              scaleHeight={60}
              strokeColor={COLORS.inkSecondary}
              fillColor="rgba(148, 163, 184, 0.10)"
            />
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 26,
                fontWeight: 700,
                color: COLORS.inkSecondary,
              }}
            >
              $6.00
            </span>
          </div>

          {/* Medium: Ghost Decoy */}
          <div
            style={{
              padding: '18px 14px',
              borderRadius: 18,
              backgroundColor: 'rgba(242, 63, 93, 0.05)',
              border: '1.5px dashed rgba(242, 63, 93, 0.60)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              opacity: ghostFade,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: COLORS.crimson,
              }}
            >
              FAKE BAIT
            </span>
            <PopcornTubSvg
              scaleHeight={74}
              strokeColor={COLORS.crimson}
              fillColor="rgba(242, 63, 93, 0.06)"
              dashed
            />
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 26,
                fontWeight: 700,
                color: COLORS.crimson,
              }}
            >
              $8.50
            </span>
          </div>

          {/* Large: What You Paid */}
          <div
            style={{
              padding: '18px 14px',
              borderRadius: 18,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: COLORS.emerald,
              }}
            >
              YOU PAID
            </span>
            <PopcornTubSvg
              scaleHeight={88}
              strokeColor={COLORS.emerald}
              fillColor="rgba(16, 217, 136, 0.18)"
            />
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.emerald,
              }}
            >
              $9.00
            </span>
          </div>
        </div>

        {/* Final Payoff + Loop Bridge */}
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
              fontSize: 35,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: COLORS.inkPrimary,
            }}
          >
            You Felt Smart Paying +$0.50.
            <br />
            <span style={{color: COLORS.crimson}}>The Theater Extracted +$3.00.</span>
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
