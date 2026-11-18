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
 * Beat 1: Expected Value Flip ($0.40 -> $1.60) + $26M Gross Winnings Counter
 */
export const LotteryHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const flip = spring({
    frame: Math.max(0, frame - 22),
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
            CASE FILE // JERRY &amp; MARGE SELBEE (2003)
          </span>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: COLORS.inkPrimary,
            }}
          >
            The 3-Minute Lottery Solution
          </span>
        </div>

        {/* Expected Value Flip Card */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14, alignItems: 'center'}}>
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 16,
              backgroundColor: COLORS.surface2,
              border: `1px solid ${COLORS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              opacity: interpolate(flip, [0, 1], [1, 0.55]),
            }}
          >
            <span style={{fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMuted, letterSpacing: '0.08em'}}>
              NORMAL $1 TICKET EV
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 30, fontWeight: 700, color: COLORS.crimson}}>
              $0.40
            </span>
          </div>

          <span style={{fontFamily: FONTS.mono, fontSize: 28, fontWeight: 700, color: COLORS.amber}}>
            →
          </span>

          <div
            style={{
              padding: '18px 20px',
              borderRadius: 16,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              transform: `scale(${interpolate(flip, [0, 1], [0.92, 1])})`,
            }}
          >
            <span style={{fontFamily: FONTS.mono, fontSize: 14, color: COLORS.emerald, letterSpacing: '0.08em'}}>
              ROLLDOWN $1 TICKET EV
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 30, fontWeight: 700, color: COLORS.emerald}}>
              $1.60+
            </span>
          </div>
        </div>

        <AnimatedMoneyTicker
          from={0}
          to={26}
          startFrame={14}
          durationInFrames={95}
          prefix="$"
          suffix="M WON"
          eyebrow="TOTAL GROSS PAYOUTS ACROSS 2 STATES"
          sublabel="Extracted legally using grade-school expected-value arithmetic."
          accentColor={COLORS.emerald}
          size="lg"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            paddingTop: 22,
            borderTop: `1px solid ${COLORS.borderSubtle}`,
          }}
        >
          <div style={{padding: '18px 22px', borderRadius: 16, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.12em', color: COLORS.inkMuted}}>
              TIME TO SOLVE
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.amber}}>
              3 MINUTES
            </div>
          </div>

          <div style={{padding: '18px 22px', borderRadius: 16, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.12em', color: COLORS.inkMuted}}>
              NET FAMILY PROFIT
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.emerald}}>
              $7.75M
            </div>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 2: Michigan Winfall $5.0M Cap & Rolldown Rule
 */
export const RolldownQuirkScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="MICHIGAN WINFALL // PUBLIC BROCHURE RULES"
        title="The $5 Million Jackpot Spillover"
        presetLabel="PRIZE POOL WATERFALL TRIGGER"
        selectedPresetFrame={42}
        presets={[
          {label: '6/6 Jackpot'},
          {label: '5/6 Match'},
          {label: '4/6 Match', selected: true},
        ]}
        lineItems={[
          {
            label: 'Jackpot Ceiling Cap',
            amount: '$5.0M MAX',
            tone: 'muted',
            revealDelayFrames: 26,
          },
          {
            label: 'Nobody Hits 6-of-6 Numbers',
            amount: 'POOL ROLLS DOWN',
            tone: 'highlight-amber',
            revealDelayFrames: 78,
          },
          {
            label: '4-Number Match Payout Surge (1-in-54)',
            amount: '10x HIGHER',
            tone: 'highlight-emerald',
            revealDelayFrames: 128,
          },
        ]}
        calloutTitle="STATISTICAL EDGE PER $1 SPENT"
        calloutValue="+60% EV"
        calloutTone="emerald"
        calloutRevealFrame={170}
      />
    </StageShell>
  );
};

/**
 * Beat 3: Scaling G.S. Investment Strategies (Hometown Evart Syndicate)
 */
export const TownSyndicateScene: React.FC = () => {
  return (
    <StageShell>
      <ComparisonBarChart
        eyebrow="G.S. INVESTMENT STRATEGIES // EVART, MI"
        title="Turning Gambling Into Index Investing"
        maxValue={1150}
        startFrame={4}
        staggerFrames={24}
        bars={[
          {
            id: 'test-1',
            label: 'Solo Test #1 ($3.6K Spent)',
            sublabel: '+75% RETURN',
            value: 180,
            formattedValue: '$6,300',
            isHighlight: false,
          },
          {
            id: 'test-2',
            label: 'Solo Test #2 ($8.0K Spent)',
            sublabel: '+96% RETURN',
            value: 340,
            formattedValue: '$15,700',
            isHighlight: false,
          },
          {
            id: 'town-pool',
            label: 'Hometown Syndicate ($600K)',
            sublabel: '25 NEIGHBORS',
            value: 1100,
            formattedValue: '$1.1M+ DRAW',
            isHighlight: true,
            accentColor: COLORS.emerald,
          },
        ]}
        footnote="Law of Large Numbers smoothed variance across hundreds of thousands of plays."
      />
    </StageShell>
  );
};

/**
 * Beat 4: 900-Mile Drive to Massachusetts Cash WinFall vs MIT Syndicate
 */
export const MassachusettsShowdownScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const team1 = spring({frame: Math.max(0, frame - 14), fps, config: SPRINGS.snappy});
  const team2 = spring({frame: Math.max(0, frame - 48), fps, config: SPRINGS.snappy});

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
          gap: 24,
        }}
      >
        <div>
          <div style={{fontFamily: FONTS.mono, fontSize: 18, fontWeight: 600, letterSpacing: '0.14em', color: COLORS.amber, marginBottom: 8}}>
            MASSACHUSETTS CASH WINFALL (2005–2011)
          </div>
          <div style={{fontFamily: FONTS.display, fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: COLORS.inkPrimary}}>
            Retirees vs. MIT Math Syndicate
          </div>
        </div>

        {/* Two Rival Syndicates Exploiting Same Math */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div
            style={{
              padding: '22px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.amberSoft,
              border: '1.5px solid rgba(245, 166, 35, 0.48)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: team1,
            }}
          >
            <div>
              <div style={{fontFamily: FONTS.mono, fontSize: 15, color: COLORS.amber, letterSpacing: '0.1em'}}>
                SYNDICATE A // 900-MILE ROAD TRIP
              </div>
              <div style={{fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.inkPrimary}}>
                Jerry &amp; Marge Selbee
              </div>
              <div style={{fontFamily: FONTS.display, fontSize: 18, color: COLORS.inkSecondary}}>
                14 hrs/day at convenience store terminals
              </div>
            </div>
            <span style={{fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700, color: COLORS.amber}}>
              600K TIX
            </span>
          </div>

          <div
            style={{
              padding: '22px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.50)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: team2,
            }}
          >
            <div>
              <div style={{fontFamily: FONTS.mono, fontSize: 15, color: COLORS.emerald, letterSpacing: '0.1em'}}>
                SYNDICATE B // RANDOM STRATEGIES LLC
              </div>
              <div style={{fontFamily: FONTS.display, fontSize: 26, fontWeight: 800, color: COLORS.inkPrimary}}>
                MIT Computer Scientists
              </div>
              <div style={{fontFamily: FONTS.display, fontSize: 18, color: COLORS.inkSecondary}}>
                Spotted the exact same rolldown equation
              </div>
            </div>
            <span style={{fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700, color: COLORS.emerald}}>
              700K TIX
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '18px 24px',
            borderRadius: 14,
            backgroundColor: COLORS.surface2,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: FONTS.mono,
            fontSize: 19,
            fontWeight: 700,
          }}
        >
          <span style={{color: COLORS.inkSecondary}}>MOTEL SORTING LABOR</span>
          <span style={{color: COLORS.inkPrimary}}>10 HRS / DAY BY HAND</span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 5: Boston Globe Investigation & State Inspector General Audit
 */
export const StateAuditScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={38}
        stampRevealFrame={146}
        nodes={[
          {
            id: 'audit-1',
            stepCode: 'AUDIT 01 // 60 PLASTIC BINS SAVED',
            title: '18M+ Losing Tickets Archived',
            detail: 'Jerry kept every paper slip in a barn for IRS & state inspection',
            metric: '100% PROOF',
            accent: 'amber',
          },
          {
            id: 'audit-2',
            stepCode: 'AUDIT 02 // ZERO INSIDER ACCESS',
            title: 'Bought Over Public Counters',
            detail: 'Paid cash at regular stores without cutting a single customer line',
            metric: '0 VIOLATIONS',
            accent: 'emerald',
          },
          {
            id: 'audit-3',
            stepCode: 'AUDIT 03 // STATE STILL WON BIG',
            title: 'Massachusetts Pocketed $120M',
            detail: 'Lottery kept 40% off every dollar before distributing the pool',
            metric: '+$120M GOV',
            accent: 'emerald',
          },
        ]}
        stampText="CLEARED BY INSPECTOR GENERAL"
        stampSubtext="Official 2012 report confirmed zero laws or rules broken"
        stampBadgeText="LEGAL"
      />
    </StageShell>
  );
};

/**
 * Beat 6: $7.75M Net Profit Payoff & Seamless Loop Bridge
 */
export const LotteryLoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const payoff = spring({
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
              FINAL LEDGER // 9 YEARS OF PLAY
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 32, fontWeight: 800, color: COLORS.inkPrimary}}>
              G.S. Investment Strategies
            </div>
          </div>
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              backgroundColor: COLORS.emeraldSoft,
              border: '1px solid rgba(16, 217, 136, 0.45)',
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 700,
              color: COLORS.emerald,
            }}
          >
            AUDITED
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          <div style={{padding: '22px 24px', borderRadius: 18, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, color: COLORS.inkMuted, letterSpacing: '0.1em'}}>
              GROSS PRIZES CASHED
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, color: COLORS.inkPrimary}}>
              $26.0M
            </div>
          </div>

          <div
            style={{
              padding: '22px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.50)',
            }}
          >
            <div style={{fontFamily: FONTS.mono, fontSize: 16, color: COLORS.emerald, letterSpacing: '0.1em'}}>
              NET PROFIT AFTER TIX
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, color: COLORS.emerald}}>
              +$7.75M
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 12,
            opacity: payoff,
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
            Everyone Else Bought Luck.
            <br />
            <span style={{color: COLORS.emerald}}>Jerry Bought Expected Value.</span>
          </div>

          <div style={{fontFamily: FONTS.mono, fontSize: 20, color: COLORS.inkMuted, letterSpacing: '0.08em'}}>
            WHICH IS WHY... ↺
          </div>
        </div>
      </div>
    </StageShell>
  );
};
