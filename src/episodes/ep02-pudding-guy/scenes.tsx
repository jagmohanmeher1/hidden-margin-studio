import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SAFE_ZONE, SPRINGS} from '../../theme/tokens';
import {FONTS} from '../../theme/fonts';
import {AnimatedMoneyTicker} from '../../components/primitives/AnimatedMoneyTicker';
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
 * Beat 1: Barcode Scanner Sweep -> 1,253,000 Free Airline Miles Ledger
 */
export const PuddingHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const morphProgress = spring({
    frame: Math.max(0, frame - 26),
    fps,
    config: SPRINGS.heavy,
  });

  // Laser scanline sweeping down across barcode in opening frames
  const laserY = interpolate(frame, [2, 34], [14, 52], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <StageShell>
      <div
        style={{
          padding: '44px 44px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 34,
        }}
      >
        {/* Top Emblem Row: Barcode + Laser -> Jet Silhouette */}
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: 24,
              backgroundColor: COLORS.surface2,
              border: `1px solid ${COLORS.borderHighlight}`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* UPC Barcode + Laser Sweep */}
            <svg
              width="66"
              height="66"
              viewBox="0 0 64 64"
              fill="none"
              style={{
                position: 'absolute',
                opacity: interpolate(morphProgress, [0, 0.65], [1, 0], {
                  extrapolateRight: 'clamp',
                }),
                transform: `scale(${interpolate(morphProgress, [0, 1], [1, 0.72])})`,
              }}
            >
              {[10, 16, 20, 27, 31, 37, 43, 47, 53].map((x, idx) => (
                <line
                  key={x}
                  x1={x}
                  y1="14"
                  x2={x}
                  y2="50"
                  stroke={COLORS.inkPrimary}
                  strokeWidth={idx % 3 === 0 ? '3.5' : '2'}
                />
              ))}
              <line
                x1="6"
                y1={laserY}
                x2="58"
                y2={laserY}
                stroke={COLORS.crimson}
                strokeWidth="3"
              />
            </svg>

            {/* Sleek Commercial Jet Icon Morphing In */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              style={{
                position: 'absolute',
                opacity: interpolate(morphProgress, [0.25, 0.9], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                transform: `scale(${interpolate(morphProgress, [0, 1], [0.7, 1])})`,
              }}
            >
              <path
                d="M32 10L36 26L54 34V39L36 34L35 48L42 53V56L32 53L22 56V53L29 48L28 34L10 39V34L28 26L32 10Z"
                fill={COLORS.emeraldSoft}
                stroke={COLORS.emerald}
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: COLORS.inkMuted,
              }}
            >
              CASE FILE // DAVID PHILLIPS (1999)
            </span>
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: COLORS.inkPrimary,
              }}
            >
              The Pudding Arbitrage
            </span>
          </div>
        </div>

        {/* Hero Frequent-Flyer Miles Ticker */}
        <AnimatedMoneyTicker
          from={0}
          to={1_253_000}
          startFrame={8}
          durationInFrames={115}
          prefix=""
          suffix=" MI"
          eyebrow="LIFETIME FREQUENT-FLYER MILES UNLOCKED"
          sublabel="Extracted legally from 12,150 cups of $0.25 chocolate pudding."
          accentColor={COLORS.emerald}
          size="lg"
        />

        {/* Bottom 2-Stat Reality Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
            paddingTop: 26,
            borderTop: `1px solid ${COLORS.borderSubtle}`,
          }}
        >
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 16,
              backgroundColor: COLORS.surface2,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 17,
                letterSpacing: '0.12em',
                color: COLORS.inkMuted,
              }}
            >
              GROCERY CHECKOUT COST
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                fontWeight: 700,
                color: COLORS.amber,
              }}
            >
              $3,140
            </span>
          </div>

          <div
            style={{
              padding: '20px 24px',
              borderRadius: 16,
              backgroundColor: COLORS.surface2,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 17,
                letterSpacing: '0.12em',
                color: COLORS.inkMuted,
              }}
            >
              COST PER AIR MILE
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                fontWeight: 700,
                color: COLORS.emerald,
              }}
            >
              $0.0025
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 2: Healthy Choice Promo Unit-Price Loophole
 */
export const PromoMathScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="HEALTHY CHOICE EARLY-BIRD PROMO"
        title="The Unit-Price Blind Spot"
        presetLabel="EVERY 10 BARCODES = 1,000 MILES (ANY PRODUCT)"
        selectedPresetFrame={36}
        presets={[
          {label: '$3.00 Meal'},
          {label: '$1.89 Soup'},
          {label: '$0.25 Cup', selected: true},
        ]}
        lineItems={[
          {
            label: '10 Frozen Dinners (What Brand Expected)',
            amount: '$30.00 / 1K MI',
            tone: 'muted',
            revealDelayFrames: 30,
          },
          {
            label: '10 Individual Pudding Cups (Found)',
            amount: '$2.50 / 1K MI',
            tone: 'highlight-emerald',
            revealDelayFrames: 72,
          },
          {
            label: 'Maximum Miles Cap in Fine Print',
            amount: 'NONE LISTED',
            tone: 'highlight-amber',
            revealDelayFrames: 112,
          },
        ]}
        calloutTitle="LOOPHOLE COST ADVANTAGE"
        calloutValue="12x CHEAPER"
        calloutTone="emerald"
        calloutRevealFrame={145}
      />
    </StageShell>
  );
};

/**
 * Beat 3: Clearing Out 10 California Discount Grocery Stores (12,150 Cups)
 */
export const StoreSweepScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const stores = Array.from({length: 10}, (_, idx) => ({
    code: `STORE ${String(idx + 1).padStart(2, '0')}`,
    cups: idx === 9 ? '1,215 CUPS' : '1,215 CUPS',
  }));

  return (
    <StageShell>
      <div
        style={{
          padding: '38px 40px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 28px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: COLORS.inkMuted,
              marginBottom: 8,
            }}
          >
            CALIFORNIA GROCERY OUTLET SWEEP
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
            10 Stores Wiped Clean
          </div>
        </div>

        {/* 5x2 Grid of Raided Grocery Stores */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 12,
          }}
        >
          {stores.map((st, idx) => {
            const sweepFrame = 14 + idx * 11;
            const active = frame >= sweepFrame;
            const pop = spring({
              frame: Math.max(0, frame - sweepFrame),
              fps,
              config: SPRINGS.snappy,
            });

            return (
              <div
                key={st.code}
                style={{
                  height: 104,
                  borderRadius: 14,
                  backgroundColor: active ? COLORS.emeraldSoft : COLORS.surface2,
                  border: `1px solid ${
                    active ? 'rgba(16, 217, 136, 0.45)' : COLORS.borderSubtle
                  }`,
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'center',
                  transform: `scale(${active ? interpolate(pop, [0, 0.5, 1], [1, 1.06, 1]) : 1})`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: active ? COLORS.emerald : COLORS.inkMuted,
                  }}
                >
                  {active ? 'CLEARED' : st.code}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 19,
                    fontWeight: 700,
                    color: active ? COLORS.inkPrimary : COLORS.inkSecondary,
                  }}
                >
                  1,215
                </span>
              </div>
            );
          })}
        </div>

        <div style={{height: 1, backgroundColor: COLORS.borderSubtle}} />

        <AnimatedMoneyTicker
          from={0}
          to={12_150}
          startFrame={14}
          durationInFrames={115}
          prefix=""
          suffix=" CUPS"
          eyebrow='CASHIER EXCUSE: "Y2K APOCALYPSE PREP"'
          sublabel="Pallets of chocolate pudding stacked floor-to-ceiling in his garage."
          accentColor={COLORS.amber}
          size="lg"
        />
      </div>
    </StageShell>
  );
};

/**
 * Beat 4: The May 31 Peeling Bottleneck Crisis
 */
export const PeelingBottleneckScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const barProgress = interpolate(frame, [10, 160], [0.18, 0.96], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const warningSpring = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <StageShell>
      <div
        style={{
          padding: '40px 42px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 68px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: COLORS.crimson,
              marginBottom: 8,
            }}
          >
            POSTMARK DEADLINE: MAY 31, 1999
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
            The 81-Hour Peeling Wall
          </div>
        </div>

        {/* Urgency Progress Meter */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            <span style={{color: COLORS.inkSecondary}}>EARLY-BIRD CLOCK RUNNING OUT</span>
            <span style={{color: COLORS.crimson}}>
              {Math.round(barProgress * 100)}% ELAPSED
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 28,
              borderRadius: 10,
              backgroundColor: COLORS.surface2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${barProgress * 100}%`,
                height: '100%',
                backgroundColor: COLORS.crimson,
              }}
            />
          </div>
        </div>

        {/* 2-Row Math Reality */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          <div
            style={{
              padding: '24px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.surface2,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 17,
                letterSpacing: '0.1em',
                color: COLORS.inkMuted,
              }}
            >
              FOIL TABS TO PEEL
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 38,
                fontWeight: 700,
                color: COLORS.inkPrimary,
              }}
            >
              12,150
            </span>
          </div>

          <div
            style={{
              padding: '24px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.surface2,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 17,
                letterSpacing: '0.1em',
                color: COLORS.inkMuted,
              }}
            >
              MANUAL LABOR TIME
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 38,
                fontWeight: 700,
                color: COLORS.crimson,
              }}
            >
              81 HOURS
            </span>
          </div>
        </div>

        {/* Warning Callout */}
        <div
          style={{
            padding: '22px 26px',
            borderRadius: 16,
            backgroundColor: COLORS.crimsonSoft,
            border: '1px solid rgba(242, 63, 93, 0.48)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: warningSpring,
            transform: `scale(${interpolate(warningSpring, [0, 1], [0.95, 1])})`,
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
            Miss May 31 → Lose 625,000 Bonus Miles
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 21,
              fontWeight: 700,
              color: COLORS.crimson,
            }}
          >
            CRISIS
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 5: The Charity Partnership + $815 IRS Tax Deduction
 */
export const CharityTwistScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={38}
        stampRevealFrame={148}
        nodes={[
          {
            id: 'charity-1',
            stepCode: 'GENIUS MOVE 01 // DONATE THE FOOD',
            title: 'Salvation Army & Food Banks',
            detail: 'Charity workers peel all 12,150 labels in exchange for free food',
            metric: '$0 LABOR',
            accent: 'amber',
          },
          {
            id: 'charity-2',
            stepCode: 'GENIUS MOVE 02 // BEAT THE CLOCK',
            title: 'Postmarked Before May 31',
            detail: '2x early-bird multiplier locked in on every single barcode',
            metric: '1.25M MI',
            accent: 'emerald',
          },
          {
            id: 'charity-3',
            stepCode: 'GENIUS MOVE 03 // IRS TAX RECEIPT',
            title: 'Charitable Food Write-Off',
            detail: 'Cut his $3,140 grocery bill down to $2,325 net out-of-pocket',
            metric: '-$815 TAX',
            accent: 'emerald',
          },
        ]}
        stampText="100% LEGAL ARBITRAGE"
        stampSubtext="Healthy Choice honored every barcode — zero rules broken"
      />
    </StageShell>
  );
};

/**
 * Beat 6: Lifetime AAdvantage Gold Boarding Pass & Seamless Loop
 */
export const BoardingLoopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const arcProgress = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: SPRINGS.editorial,
  });

  return (
    <StageShell>
      <div
        style={{
          padding: '42px 44px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0,0,0,0.54), inset 0 1px 0 rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
        }}
      >
        {/* Top Boarding Pass Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 22,
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
              PASSENGER // LIFETIME STATUS
            </span>
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 32,
                fontWeight: 800,
                color: COLORS.inkPrimary,
              }}
            >
              PHILLIPS / DAVID
            </span>
          </div>

          <div
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              backgroundColor: COLORS.amberSoft,
              border: '1px solid rgba(245, 166, 35, 0.42)',
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.amber,
              letterSpacing: '0.08em',
            }}
          >
            GOLD FOR LIFE
          </div>
        </div>

        {/* Airport Route Graphic */}
        <div
          style={{
            padding: '26px 30px',
            borderRadius: 20,
            backgroundColor: COLORS.surface2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{fontFamily: FONTS.mono, fontSize: 42, fontWeight: 700, color: COLORS.inkPrimary}}>
              SMF
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, color: COLORS.inkMuted}}>
              SACRAMENTO
            </div>
          </div>

          <div
            style={{
              flex: 1,
              margin: '0 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.emerald,
                opacity: arcProgress,
              }}
            >
              31x ROUND-TRIP FLIGHTS
            </span>
            <div
              style={{
                width: '100%',
                height: 3,
                backgroundColor: COLORS.borderHighlight,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${arcProgress * 100}%`,
                  height: '100%',
                  backgroundColor: COLORS.emerald,
                }}
              />
            </div>
          </div>

          <div style={{textAlign: 'right'}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 42, fontWeight: 700, color: COLORS.emerald}}>
              EUR
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, color: COLORS.inkMuted}}>
              EUROPE & WORLD
            </div>
          </div>
        </div>

        {/* Final ROI Payoff */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12}}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.18,
              color: COLORS.inkPrimary,
            }}
          >
            $2,325 Net Spent.
            <br />
            <span style={{color: COLORS.emerald}}>$150,000+ in Free Flights.</span>
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
