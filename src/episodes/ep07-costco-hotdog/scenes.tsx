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
 * Beat 1: $1.50 Price-Lock Shackle + $4.8B Membership Club Reveal
 */
export const CostcoHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lockDrop = spring({
    frame: Math.max(0, frame - 12),
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
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Top Emblem + Price Lock Badge */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 22,
                backgroundColor: COLORS.amberSoft,
                border: '1.5px solid rgba(245, 166, 35, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Steel Padlock SVG */}
              <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                <path
                  d="M20 28V20C20 13.37 25.37 8 32 8C38.63 8 44 13.37 44 20V28"
                  stroke={COLORS.amber}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={{
                    transform: `translateY(${interpolate(lockDrop, [0, 1], [-8, 0])}px)`,
                  }}
                />
                <rect
                  x="14"
                  y="28"
                  width="36"
                  height="28"
                  rx="6"
                  fill="rgba(245, 166, 35, 0.18)"
                  stroke={COLORS.amber}
                  strokeWidth="3"
                />
                <circle cx="32" cy="42" r="4" fill={COLORS.amber} />
              </svg>
            </div>

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
                UNCHANGED SINCE 1985
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
                The $1.50 Loss Leader
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              backgroundColor: COLORS.emeraldSoft,
              border: '1px solid rgba(16, 217, 136, 0.48)',
              fontFamily: FONTS.mono,
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.emerald,
            }}
          >
            $1.50
          </div>
        </div>

        {/* Hero Membership Fee Engine Ticker */}
        <AnimatedMoneyTicker
          from={0}
          to={4.8}
          decimals={1}
          startFrame={14}
          durationInFrames={95}
          prefix="$"
          suffix="B / YR"
          eyebrow="ANNUAL MEMBERSHIP FEE ENGINE"
          sublabel="Costco sells groceries near cost to protect a $4.8B subscription float."
          accentColor={COLORS.emerald}
          size="lg"
        />

        {/* Bottom 2-Stat Strip */}
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
            <span style={{fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.12em', color: COLORS.inkMuted}}>
              MEAT PLANTS BUILT
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.amber}}>
              2 FACTORIES
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
            <span style={{fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.12em', color: COLORS.inkMuted}}>
              PROFIT FROM FEES
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.emerald}}>
              72% SHARE
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 2: 1985 $1.50 vs $4.55 Inflation Reality + Founder Ultimatum
 */
export const InflationLockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const quoteSpring = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <StageShell>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        <ComparisonBarChart
          eyebrow="40 YEARS OF CPI INFLATION"
          title="Frozen at $1.50 While Food Tripled"
          maxValue={5}
          startFrame={4}
          staggerFrames={22}
          bars={[
            {
              id: 'cpi-price',
              label: 'CPI Inflation Price Today',
              sublabel: '+203% FOOD CPI',
              value: 4.55,
              formattedValue: '$4.55',
              isHighlight: false,
            },
            {
              id: 'costco-locked',
              label: 'Costco Food Court Combo',
              sublabel: 'LOCKED SINCE 1985',
              value: 1.5,
              formattedValue: '$1.50',
              isHighlight: true,
              accentColor: COLORS.emerald,
            },
          ]}
          footnote="1/4-lb all-beef hot dog + 20oz refillable soda — zero price hikes in 4 decades."
        />

        <div
          style={{
            padding: '22px 28px',
            borderRadius: 18,
            backgroundColor: COLORS.crimsonSoft,
            border: '1.5px solid rgba(242, 63, 93, 0.48)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: quoteSpring,
            transform: `scale(${interpolate(quoteSpring, [0, 1], [0.95, 1])})`,
          }}
        >
          <span style={{fontFamily: FONTS.display, fontSize: 23, fontWeight: 700, color: '#FFE4E8'}}>
            Sinegal: &ldquo;Raise the hot dog, I&rsquo;ll kill you.&rdquo;
          </span>
          <span style={{fontFamily: FONTS.mono, fontSize: 19, fontWeight: 700, color: COLORS.crimson}}>
            SACRED RULE
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 3: Kirkland Vertical Integration (Tracy, CA & Morris, IL Meat Plants)
 */
export const VerticalFactoriesScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="VERTICAL SUPPLY CHAIN // KIRKLAND SIGNATURE"
        title="Own the Factories, Control the Cost"
        presetLabel="HOT DOG SUPPLY EVOLUTION"
        selectedPresetFrame={40}
        presets={[
          {label: 'Vendor Markup'},
          {label: 'Plant #1 CA'},
          {label: 'Plant #2 IL', selected: true},
        ]}
        lineItems={[
          {
            label: 'Outside Brand Supplier (Pre-2008)',
            amount: 'RISING COST',
            tone: 'muted',
            revealDelayFrames: 26,
          },
          {
            label: 'Tracy, CA + Morris, IL Meat Plants',
            amount: '100% OWNED',
            tone: 'highlight-amber',
            revealDelayFrames: 78,
          },
          {
            label: 'Annual Quarter-Pound Franks Output',
            amount: '200M+ / YR',
            tone: 'highlight-emerald',
            revealDelayFrames: 128,
          },
        ]}
        calloutTitle="FOOD COURT PRICE TAG"
        calloutValue="STILL $1.50"
        calloutTone="amber"
        calloutRevealFrame={170}
      />
    </StageShell>
  );
};

/**
 * Beat 4: Costco's Strict ~14% Retail Markup Cap vs 35% Traditional Supermarkets
 */
export const MarkupCapScene: React.FC = () => {
  return (
    <StageShell>
      <ComparisonBarChart
        eyebrow="RETAIL PRICING CEILING // BY COMPANY LAW"
        title="Why $250B in Groceries Breaks Even"
        maxValue={45}
        startFrame={4}
        staggerFrames={24}
        bars={[
          {
            id: 'dept-store',
            label: 'Department & Specialty Retail',
            sublabel: 'HIGH MARGIN',
            value: 42,
            formattedValue: '42%',
            isHighlight: false,
          },
          {
            id: 'supermarket',
            label: 'Traditional Supermarkets',
            sublabel: 'STANDARD GROCER',
            value: 32,
            formattedValue: '32%',
            isHighlight: false,
          },
          {
            id: 'costco-cap',
            label: 'Costco Hard Markup Cap',
            sublabel: 'NEAR BREAKEVEN',
            value: 14,
            formattedValue: '14% MAX',
            isHighlight: true,
            accentColor: COLORS.emerald,
          },
        ]}
        footnote="After wages & warehouse overhead, merchandise margins sit near ~1–2%."
      />
    </StageShell>
  );
};

/**
 * Beat 5: The Real Profit Engine (93% Renewal Rate -> 72% of Operating Profit)
 */
export const MembershipEngineScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={38}
        stampRevealFrame={146}
        nodes={[
          {
            id: 'club-1',
            stepCode: 'STEP 01 // ENTRY TOLLBOOTH',
            title: '$65 Gold Star & $130 Executive',
            detail: '136M+ cardholders pay upfront just to walk through the door',
            metric: '$4.8B FEES',
            accent: 'emerald',
          },
          {
            id: 'club-2',
            stepCode: 'STEP 02 // ZERO COGS SUBSCRIPTION',
            title: '93% US & Canada Renewal Rate',
            detail: 'Pure recurring fee income with virtually zero inventory cost',
            metric: '93% STAY',
            accent: 'amber',
          },
          {
            id: 'club-3',
            stepCode: 'STEP 03 // BOTTOM-LINE REALITY',
            title: '72% of Total Operating Profit',
            detail: 'Groceries are the bait — membership cards print the billions',
            metric: '72% PROFIT',
            accent: 'emerald',
          },
        ]}
        stampText="SUBSCRIPTION FLYWHEEL"
        stampSubtext="Every $1.50 hot dog protects a $65–$130 annual renewal"
        stampBadgeText="FLYWHEEL"
      />
    </StageShell>
  );
};

/**
 * Beat 6: Exit Food Court Psychology & Seamless Loop Bridge
 */
export const CostcoLoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardReveal = spring({
    frame: Math.max(0, frame - 28),
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
            borderBottom: `1px dashed ${COLORS.borderHighlight}`,
          }}
        >
          <div>
            <div style={{fontFamily: FONTS.mono, fontSize: 17, letterSpacing: '0.14em', color: COLORS.inkMuted}}>
              EXIT ARCHITECTURE // PEAK-END RULE
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 32, fontWeight: 800, color: COLORS.inkPrimary}}>
              Why the Food Court Sits After Checkout
            </div>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          <div
            style={{
              padding: '24px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.amberSoft,
              border: '1.5px solid rgba(245, 166, 35, 0.48)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span style={{fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.1em', color: COLORS.amber}}>
              LAST MEMORY AT EXIT
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, color: COLORS.inkPrimary}}>
              $1.50 COMBO
            </span>
            <span style={{fontFamily: FONTS.display, fontSize: 19, color: COLORS.inkSecondary}}>
              Erases the pain of a $300 cart
            </span>
          </div>

          <div
            style={{
              padding: '24px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.52)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span style={{fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.1em', color: COLORS.emerald}}>
              AUTOMATIC RESULT
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, color: COLORS.emerald}}>
              +$130 RENEW
            </span>
            <span style={{fontFamily: FONTS.display, fontSize: 19, color: COLORS.inkSecondary}}>
              93% renew without blinking
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 12,
            opacity: cardReveal,
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
            Lose Pennies on Beef Franks.
            <br />
            <span style={{color: COLORS.emerald}}>Print $4.8 Billion in Card Fees.</span>
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
