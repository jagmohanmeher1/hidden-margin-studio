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
 * Minimalist Pizza-Box + Circular Cash-Loop SVG Emblem
 */
const PizzaCashLoopSvg: React.FC<{frame: number}> = ({frame}) => {
  const loopAngle = (frame * 1.15) % 360;

  return (
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none">
      {/* Rotating Circular Cash-Loop Arrows */}
      <g
        style={{
          transformOrigin: '37px 37px',
          transform: `rotate(${loopAngle}deg)`,
        }}
      >
        <path
          d="M37 7C51.8 7 64.1 17.7 66.5 31.8"
          stroke={COLORS.emerald}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M61.5 28.5L66.8 33.2L70.2 27.0"
          stroke={COLORS.emerald}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M37 67C22.2 67 9.9 56.3 7.5 42.2"
          stroke={COLORS.amber}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M12.5 45.5L7.2 40.8L3.8 47.0"
          stroke={COLORS.amber}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Minimalist Isometric Pizza Box Lid */}
      <rect
        x="20"
        y="20"
        width="34"
        height="34"
        rx="6"
        fill="rgba(16, 217, 136, 0.14)"
        stroke={COLORS.inkPrimary}
        strokeWidth="2.4"
      />
      {/* Slice Emblem Inside Box */}
      <path
        d="M37 26L46 45H28L37 26Z"
        fill="rgba(245, 166, 35, 0.24)"
        stroke={COLORS.amber}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="37" cy="38" r="2" fill={COLORS.emerald} />
    </svg>
  );
};

/**
 * Scene 1: Minimalist Pizza-Box + Cash-Loop Emblem, +$8.00 / BOX Ticker, and $16 vs $24 Strip
 */
export const PizzaHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const badgeSpring = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SPRINGS.snappy,
  });

  const stripSpring = spring({
    frame: Math.max(0, frame - 32),
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
          gap: 30,
        }}
      >
        {/* Top Emblem + Case File Header */}
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: 24,
              backgroundColor: COLORS.surface2,
              border: `1px solid ${COLORS.borderHighlight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transform: `scale(${interpolate(badgeSpring, [0, 1], [0.84, 1])})`,
              opacity: badgeSpring,
            }}
          >
            <PizzaCashLoopSvg frame={frame} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: COLORS.emerald,
              }}
            >
              CASE FILE // DOORDASH GLITCH (2019)
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
              The Pizza Arbitrage Loop
            </span>
          </div>
        </div>

        {/* Hero Cash-Per-Box Ticker */}
        <AnimatedMoneyTicker
          from={0}
          to={8}
          decimals={2}
          startFrame={10}
          durationInFrames={95}
          prefix="+$"
          suffix=" / BOX"
          eyebrow="PAID TO ORDER YOUR OWN PIZZA"
          sublabel="Silicon Valley venture capital turned into a personal cash machine."
          accentColor={COLORS.emerald}
          size="lg"
        />

        {/* Bottom 2-Stat Reality Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
            paddingTop: 24,
            borderTop: `1px solid ${COLORS.borderSubtle}`,
            opacity: stripSpring,
            transform: `translateY(${interpolate(stripSpring, [0, 1], [14, 0])}px)`,
          }}
        >
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 16,
              backgroundColor: COLORS.surface2,
              border: '1px solid rgba(245, 166, 35, 0.28)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: COLORS.inkMuted,
              }}
            >
              PAID ON APP
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: COLORS.amber,
              }}
            >
              $16.00
            </span>
          </div>

          <div
            style={{
              padding: '20px 24px',
              borderRadius: 16,
              backgroundColor: COLORS.emeraldSoft,
              border: '1px solid rgba(16, 217, 136, 0.42)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: COLORS.inkSecondary,
              }}
            >
              PAID TO REGISTER
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: COLORS.emerald,
              }}
            >
              $24.00
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Scene 2: DoorDash's Unauthorized "Demand Test" Phantom Menu Scraping
 */
export const PhantomListingScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="UNAUTHORIZED GROWTH HACK // DEMAND TEST"
        title="Scraped Without Permission"
        presetLabel="SHADOW APP LISTING VS REAL MENU"
        selectedPresetFrame={36}
        presets={[
          {label: 'Menu $24'},
          {label: 'App $16', selected: true},
          {label: '0% Deal'},
        ]}
        lineItems={[
          {
            label: 'Restaurant Contract Signed',
            amount: 'ZERO',
            tone: 'muted',
            revealDelayFrames: 26,
          },
          {
            label: 'Menu Price Listed on App',
            amount: '$16.00 BAIT',
            tone: 'highlight-amber',
            revealDelayFrames: 70,
          },
          {
            label: 'Actual Restaurant Menu Price',
            amount: '$24.00 FULL',
            tone: 'highlight-emerald',
            revealDelayFrames: 114,
          },
        ]}
        calloutTitle="VC SUBSIDY BURNED"
        calloutValue="-$8.00 / PIZZA"
        calloutTone="crimson"
        calloutRevealFrame={152}
      />
    </StageShell>
  );
};

/**
 * Scene 3: Bespoke 3-Step Visual Ledger Card ($160 App -> $240 Register -> $70 Ingredients)
 */
export const ArbitrageLoopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ledgerSteps = [
    {
      step: '01',
      label: 'YOU PAY DOORDASH APP',
      sub: '10 × $16.00 subsidized pies',
      amount: '-$160.00',
      color: COLORS.amber,
      bg: COLORS.surface2,
      border: 'rgba(245, 166, 35, 0.34)',
      delay: 14,
    },
    {
      step: '02',
      label: 'COURIER PAYS YOUR REGISTER',
      sub: '10 × $24.00 Red Card swipe',
      amount: '+$240.00',
      color: COLORS.emerald,
      bg: COLORS.emeraldSoft,
      border: 'rgba(16, 217, 136, 0.48)',
      delay: 46,
    },
    {
      step: '03',
      label: 'INGREDIENTS (TOMATO & CHEESE)',
      sub: 'Kitchen food cost on 10 pies',
      amount: '-$70.00',
      color: COLORS.crimson,
      bg: COLORS.surface2,
      border: COLORS.borderSubtle,
      delay: 78,
    },
  ];

  return (
    <StageShell>
      <div
        style={{
          padding: '36px 42px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0, 0, 0, 0.54), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* Header */}
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
            ROUND 01 LEDGER // 10-PIZZA SELF-ORDER
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
            The $16 → $24 Cash Loop
          </div>
        </div>

        {/* 3-Step Visual Ledger Rows */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {ledgerSteps.map((row) => {
            const rowSpring = spring({
              frame: Math.max(0, frame - row.delay),
              fps,
              config: SPRINGS.editorial,
            });

            return (
              <div
                key={row.step}
                style={{
                  padding: '15px 22px',
                  borderRadius: 16,
                  backgroundColor: row.bg,
                  border: `1px solid ${row.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: rowSpring,
                  transform: `translateX(${interpolate(rowSpring, [0, 1], [-18, 0])}px)`,
                }}
              >
                <div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: COLORS.inkPrimary,
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: 19,
                      fontWeight: 500,
                      color: COLORS.inkSecondary,
                    }}
                  >
                    {row.sub}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 28,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color: row.color,
                  }}
                >
                  {row.amount}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{height: 1, backgroundColor: COLORS.borderSubtle}} />

        {/* Arbitrage Profit Ticker */}
        <AnimatedMoneyTicker
          from={0}
          to={75}
          startFrame={92}
          durationInFrames={100}
          prefix="+$"
          suffix=" PROFIT"
          eyebrow="ARBITRAGE UPSIDE UNLOCKED (10 BOXES)"
          sublabel="+$80 VC spread — +$10 cash & 10 free pies, or +$75 pure cash without cheese."
          accentColor={COLORS.emerald}
          size="lg"
        />
      </div>
    </StageShell>
  );
};

/**
 * Scene 4: Round 01 (Full Toppings) vs Round 02 (Plain Dough) Comparison Bar Chart
 */
export const PlainDoughTestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const badgeSpring = spring({
    frame: Math.max(0, frame - 88),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <StageShell>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        <ComparisonBarChart
          eyebrow="PER 10-PIZZA ORDER // NET ARBITRAGE PROFIT"
          title="Plain Dough = Pure VC Cash"
          maxValue={80}
          startFrame={4}
          staggerFrames={26}
          bars={[
            {
              id: 'round-1-toppings',
              label: 'Round 01: Full Toppings',
              sublabel: 'AFTER CHEESE',
              value: 20,
              formattedValue: '$10–$30',
              isHighlight: false,
            },
            {
              id: 'round-2-dough',
              label: 'Round 02: Plain Dough',
              sublabel: 'PENNIES COGS',
              value: 75,
              formattedValue: '+$75+',
              isHighlight: true,
              accentColor: COLORS.emerald,
            },
          ]}
          footnote="Why waste $70 of mozzarella delivering boxes to your own couch?"
        />

        {/* Optimization Callout Banner */}
        <div
          style={{
            padding: '22px 28px',
            borderRadius: 18,
            backgroundColor: COLORS.amberSoft,
            border: '1.5px solid rgba(245, 166, 35, 0.48)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: badgeSpring,
            transform: `scale(${interpolate(badgeSpring, [0, 1], [0.95, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.inkPrimary,
            }}
          >
            Kitchen Cost Slashed: $70.00 → $5.00 Dough
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.amber,
              letterSpacing: '0.08em',
            }}
          >
            OPTIMIZED
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Scene 5: Silicon Valley Blitzscaling Blind Spot FlowNodeGraph + 100% LEGAL ARBITRAGE Stamp
 */
export const VcSubsidyTrapScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={36}
        stampRevealFrame={132}
        nodes={[
          {
            id: 'blitz-1',
            stepCode: 'BLITZSCALE 01 // SCRAPE MENUS',
            title: 'Unauthorized App Listings',
            detail: 'Fake $16 pizza deals hook local diners onto DoorDash',
            metric: '-$8 / PIE',
            accent: 'amber',
          },
          {
            id: 'blitz-2',
            stepCode: 'BLITZSCALE 02 // BURN VC CASH',
            title: 'Pump Pre-IPO Order Charts',
            detail: 'Algorithms celebrate volume spikes — ignoring subsidy bleed',
            metric: 'IPO PUMP',
            accent: 'crimson',
          },
          {
            id: 'blitz-3',
            stepCode: 'BLITZSCALE 03 // MAIN STREET WINS',
            title: 'Pizzeria Drains the Spread',
            detail: 'Every self-order routed investor cash straight to register',
            metric: '+$75 NET',
            accent: 'emerald',
          },
        ]}
        stampText="100% LEGAL ARBITRAGE"
        stampSubtext="Zero contract signed — DoorDash created the loophole itself"
        stampBadgeText="GLITCH"
      />
    </StageShell>
  );
};

/**
 * Scene 6: Couch Dough-Box Receipt Summary Card + Seamless Loop Bridge
 */
export const PizzaLoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const row1Spring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: SPRINGS.editorial,
  });

  const row2Spring = spring({
    frame: Math.max(0, frame - 32),
    fps,
    config: SPRINGS.heavy,
  });

  const payoffSpring = spring({
    frame: Math.max(0, frame - 52),
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
        {/* Top Receipt Masthead */}
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
              FINAL SETTLEMENT // ARBITRAGE RECEIPT
            </span>
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 32,
                fontWeight: 800,
                color: COLORS.inkPrimary,
              }}
            >
              Wall Street Paid for Dinner
            </span>
          </div>

          <div
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              backgroundColor: COLORS.emeraldSoft,
              border: '1px solid rgba(16, 217, 136, 0.45)',
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 700,
              color: COLORS.emerald,
              letterSpacing: '0.08em',
            }}
          >
            ALGO BEATEN
          </div>
        </div>

        {/* Receipt Summary Rows */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 16,
              backgroundColor: COLORS.surface2,
              border: `1px solid ${COLORS.borderSubtle}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: row1Spring,
              transform: `translateY(${interpolate(row1Spring, [0, 1], [14, 0])}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: COLORS.inkPrimary,
              }}
            >
              10 BOXES OF DOUGH DELIVERED TO COUCH
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.amber,
                letterSpacing: '0.08em',
              }}
            >
              COMPLETE
            </span>
          </div>

          <div
            style={{
              padding: '22px 24px',
              borderRadius: 16,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.52)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: row2Spring,
              transform: `scale(${interpolate(row2Spring, [0, 1], [0.95, 1])})`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: COLORS.inkPrimary,
              }}
            >
              NET VC EXTRACTION
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: COLORS.emerald,
              }}
            >
              +$75 / ORDER
            </span>
          </div>
        </div>

        {/* Bold Payoff Headline + Seamless Loop Bridge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 12,
            opacity: payoffSpring,
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
            Billion-Dollar Algorithm Outsmarted.
            <br />
            <span style={{color: COLORS.emerald}}>Main Street Pocketed the Spread.</span>
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
