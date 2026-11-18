import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
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
 * Scene 1 (0:00 - 0:03.2): Coffee Cup Morphs Into $1.8B Unregulated Bank Ledger
 */
export const HeroMorphScene: React.FC<{targetDepositBillions?: number}> = ({
  targetDepositBillions = 1.84,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const morphProgress = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: SPRINGS.heavy,
  });

  const vaultDialRotation = interpolate(frame, [12, 160], [0, 240], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const totalDollars = Math.round(targetDepositBillions * 1_000_000_000);

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
        {/* Top Morphing Emblem Row: Coffee Cup -> Bank Vault Dial */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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
              }}
            >
              {/* Minimalist Coffee Cup Silhouette fading out */}
              <svg
                width="62"
                height="62"
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
                <path
                  d="M16 14H48L44 54H20L16 14Z"
                  stroke={COLORS.inkPrimary}
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path d="M13 14H51" stroke={COLORS.emerald} strokeWidth="4" strokeLinecap="round" />
                <path
                  d="M18 28H46L45 39H19L18 28Z"
                  fill={COLORS.emeraldSoft}
                  stroke={COLORS.emerald}
                  strokeWidth="2.5"
                />
              </svg>

              {/* Precision Bank Vault Wheel morphing in */}
              <svg
                width="66"
                height="66"
                viewBox="0 0 64 64"
                fill="none"
                style={{
                  position: 'absolute',
                  opacity: interpolate(morphProgress, [0.25, 0.9], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                  transform: `scale(${interpolate(morphProgress, [0, 1], [0.7, 1])}) rotate(${vaultDialRotation}deg)`,
                }}
              >
                <circle cx="32" cy="32" r="24" stroke={COLORS.emerald} strokeWidth="3.5" />
                <circle cx="32" cy="32" r="9" fill={COLORS.emeraldSoft} stroke={COLORS.emerald} strokeWidth="3" />
                <path
                  d="M32 8V23M32 41V56M8 32H23M41 32H56M15 15L25.5 25.5M38.5 38.5L49 49M49 15L38.5 25.5M25.5 38.5L15 49"
                  stroke={COLORS.emerald}
                  strokeWidth="3"
                  strokeLinecap="round"
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
                SEC BALANCE SHEET REALITY
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
                Shadow Bank Ledger
              </span>
            </div>
          </div>
        </div>

        {/* Hero Animated Money Counter */}
        <AnimatedMoneyTicker
          from={120_000_000}
          to={totalDollars}
          startFrame={6}
          durationInFrames={92}
          prefix="$"
          eyebrow="STORED VALUE & APP DEPOSITS"
          sublabel="Customer cash sitting idle inside Starbucks cards & mobile wallets."
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
              INTEREST PAID TO YOU
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                fontWeight: 700,
                color: COLORS.amber,
              }}
            >
              0.00% APY
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
              CASH WITHDRAWALS
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                fontWeight: 700,
                color: COLORS.crimson,
              }}
            >
              LOCKED
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Scene 2 (0:03.2 - 0:11.2): Deposit Scale vs Real U.S. Regional Banks
 */
export const BankComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const calloutSpring = spring({
    frame: Math.max(0, frame - 115),
    fps,
    config: SPRINGS.editorial,
  });

  return (
    <StageShell>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        <ComparisonBarChart
          eyebrow="TOTAL CUSTOMER DEPOSITS HELD"
          title="Larger Than 85% of U.S. Banks"
          maxValue={2.0}
          staggerFrames={14}
          bars={[
            {
              id: 'community',
              label: 'Typical Community Bank',
              sublabel: 'FDIC Insured',
              value: 0.42,
              formattedValue: '$420M',
            },
            {
              id: 'regional-a',
              label: 'Mid-Size Regional Bank',
              sublabel: 'FDIC Insured',
              value: 0.78,
              formattedValue: '$780M',
            },
            {
              id: 'regional-b',
              label: 'Metro Commercial Bank',
              sublabel: 'FDIC Insured',
              value: 1.15,
              formattedValue: '$1.15B',
            },
            {
              id: 'starbucks',
              label: 'Starbucks App Wallet',
              sublabel: 'Unregulated',
              value: 1.84,
              formattedValue: '$1.84B',
              isHighlight: true,
              accentColor: COLORS.emerald,
            },
          ]}
          footnote="SOURCE: SEC 10-K STORED VALUE CARD LIABILITIES VS. FDIC CALL REPORTS"
        />

        <div
          style={{
            padding: '22px 30px',
            borderRadius: 18,
            backgroundColor: COLORS.surface1,
            border: `1px solid ${COLORS.borderSubtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: calloutSpring,
            transform: `translateY(${interpolate(calloutSpring, [0, 1], [16, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 25,
              fontWeight: 600,
              color: COLORS.inkSecondary,
            }}
          >
            Reserve ratio required by banking regulators
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.emerald,
            }}
          >
            $0 REQUIRED
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Scene 3 (0:11.2 - 0:20.2): The Preset Reload Friction Trap
 */
export const ReloadTrapScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="BEHAVIORAL UI ARCHITECTURE"
        title="The Leftover Change Trap"
        presetLabel="APP NUDGES CHUNK RELOADS (NEVER EXACT PRICE)"
        selectedPresetFrame={26}
        presets={[
          {label: '+$10', selected: true},
          {label: '+$25'},
          {label: '+$50'},
        ]}
        lineItems={[
          {
            label: 'Minimum Preset Wallet Reload',
            amount: '+$10.00',
            tone: 'highlight-emerald',
            revealDelayFrames: 36,
          },
          {
            label: 'Iced Brown Sugar Oatmilk Latte',
            amount: '-$6.45',
            tone: 'default',
            revealDelayFrames: 68,
          },
          {
            label: 'Next Drink Costs $6.45 -> Forces Reload',
            amount: 'SHORT $2.90',
            tone: 'highlight-crimson',
            revealDelayFrames: 112,
          },
        ]}
        calloutTitle="PERMANENTLY TRAPPED FLOAT"
        calloutValue="$3.55 / USER"
        calloutTone="amber"
        calloutRevealFrame={148}
      />
    </StageShell>
  );
};

/**
 * Scene 4 (0:20.2 - 0:31.2): Closed-Loop Legal Loophole & Free Capital Engine
 */
export const SystemFlowScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={42}
        stampRevealFrame={165}
        nodes={[
          {
            id: 'step-1',
            stepCode: 'MECHANISM 01 // CLOSED-LOOP LOCK',
            title: 'Redeemable Only for Coffee',
            detail: 'Cannot be withdrawn back to your checking account',
            metric: 'LOCKED',
            accent: 'amber',
          },
          {
            id: 'step-2',
            stepCode: 'MECHANISM 02 // ZERO-COST CAPITAL',
            title: 'Starbucks Treasury Float',
            detail: 'Corporations pay ~5% on bonds; app users charge zero',
            metric: '0.00% APY',
            accent: 'crimson',
          },
          {
            id: 'step-3',
            stepCode: 'MECHANISM 03 // COMPOUND EXPANSION',
            title: 'Free Store & Equipment Buildout',
            detail: 'Deployed immediately as interest-free working capital',
            metric: '$1.84B FLOAT',
            accent: 'emerald',
          },
        ]}
        stampText="BANKING LAWS: EXEMPT"
        stampSubtext="Booked legally as 'Deferred Coffee Revenue' — zero FDIC oversight"
      />
    </StageShell>
  );
};

/**
 * Scene 5 (0:31.2 - 0:44.0): $200M/Yr Pure Breakage Profit
 */
export const BreakageProfitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cards = [
    {amount: '$15', forgotten: false},
    {amount: '$25', forgotten: true},
    {amount: '$10', forgotten: false},
    {amount: '$50', forgotten: false},
    {amount: '$20', forgotten: true},
    {amount: '$15', forgotten: false},
    {amount: '$25', forgotten: false},
    {amount: '$10', forgotten: true},
    {amount: '$30', forgotten: false},
    {amount: '$15', forgotten: false},
    {amount: '$25', forgotten: true},
    {amount: '$10', forgotten: false},
  ];

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
              color: COLORS.inkMuted,
              marginBottom: 8,
            }}
          >
            ACCOUNTING TERM: &ldquo;BREAKAGE&rdquo;
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
            Forgotten Cards = 100% Pure Profit
          </div>
        </div>

        {/* 4x3 Gift Card Matrix showing forgotten cards flipping crimson */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}
        >
          {cards.map((card, idx) => {
            const flipStart = 34 + idx * 9;
            const flipSpring = spring({
              frame: Math.max(0, frame - flipStart),
              fps,
              config: SPRINGS.snappy,
            });

            const isMarkedForgotten = card.forgotten && frame >= flipStart;

            return (
              <div
                key={idx}
                style={{
                  height: 92,
                  borderRadius: 14,
                  backgroundColor: isMarkedForgotten ? COLORS.crimsonSoft : COLORS.surface2,
                  border: `1px solid ${
                    isMarkedForgotten ? 'rgba(242, 63, 93, 0.48)' : COLORS.borderSubtle
                  }`,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transform: `scale(${
                    isMarkedForgotten
                      ? interpolate(flipSpring, [0, 0.5, 1], [1, 1.06, 1])
                      : 1
                  })`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: isMarkedForgotten ? COLORS.crimson : COLORS.inkMuted,
                  }}
                >
                  {isMarkedForgotten ? 'UNSPENT' : 'GIFT CARD'}
                </span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 25,
                    fontWeight: 700,
                    color: isMarkedForgotten ? '#FFE4E8' : COLORS.inkSecondary,
                  }}
                >
                  {card.amount}
                </span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{height: 1, backgroundColor: COLORS.borderSubtle}} />

        {/* Annual Breakage Profit Counter */}
        <AnimatedMoneyTicker
          from={0}
          to={212_000_000}
          startFrame={55}
          durationInFrames={130}
          prefix="+$"
          suffix="/YR"
          eyebrow="ANNUAL UNREDEEMED BREAKAGE RECOGNIZED"
          sublabel="Zero beans roasted. Zero baristas paid. Straight to operating income."
          accentColor={COLORS.emerald}
          size="lg"
        />
      </div>
    </StageShell>
  );
};

/**
 * Scene 6 (0:44.0 - 0:52.0): Gold Loyalty Stars Morph Into Vault Bars -> Seamless Loop
 */
export const LoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const barMorph = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: SPRINGS.heavy,
  });

  // Snap vault lock right before frame end so loop into 0:00 feels razor-sharp
  const finalLock = spring({
    frame: Math.max(0, frame - (durationInFrames - 45)),
    fps,
    config: SPRINGS.snappy,
  });

  return (
    <StageShell>
      <div
        style={{
          padding: '46px 44px',
          borderRadius: 26,
          backgroundColor: COLORS.surface1,
          border: `1px solid ${COLORS.borderSubtle}`,
          boxShadow: '0 32px 72px rgba(0,0,0,0.54), inset 0 1px 0 rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 34,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.16em',
            color: COLORS.amber,
          }}
        >
          GAMIFIED LOYALTY ILLUSION
        </div>

        {/* 5 Gold Stars Extruding Into 5 Vault Lock Bars */}
        <div
          style={{
            width: '100%',
            height: 250,
            borderRadius: 20,
            backgroundColor: COLORS.surface2,
            border: `1px solid ${COLORS.borderSubtle}`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            padding: '0 36px',
            overflow: 'hidden',
          }}
        >
          {[0, 1, 2, 3, 4].map((idx) => {
            const starEnter = spring({
              frame: Math.max(0, frame - idx * 9),
              fps,
              config: SPRINGS.snappy,
            });

            const barHeight = interpolate(barMorph, [0, 1], [54, 214]);
            const barWidth = interpolate(barMorph, [0, 1], [54, 28]);
            const barRadius = interpolate(barMorph, [0, 1], [27, 8]);

            return (
              <div
                key={idx}
                style={{
                  width: barWidth,
                  height: barHeight,
                  borderRadius: barRadius,
                  backgroundColor: barMorph > 0.45 ? COLORS.emerald : COLORS.amber,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: starEnter,
                  transform: `scale(${starEnter})`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                }}
              >
                <span
                  style={{
                    fontSize: 30,
                    color: COLORS.bgDeep,
                    opacity: interpolate(barMorph, [0, 0.35], [1, 0], {
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  ★
                </span>
              </div>
            );
          })}

          {/* Horizontal Vault Crossbar snapping shut */}
          <div
            style={{
              position: 'absolute',
              left: 32,
              right: 32,
              height: 22,
              borderRadius: 6,
              backgroundColor: COLORS.inkPrimary,
              opacity: interpolate(barMorph, [0.5, 0.95], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              transform: `scaleX(${interpolate(barMorph, [0.4, 1], [0.2, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}) translateY(${interpolate(finalLock, [0, 1], [0, -2])}px)`,
            }}
          />
        </div>

        {/* Payoff Contrast */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.16,
              color: COLORS.inkPrimary,
            }}
          >
            You Collect Plastic Stars.
            <br />
            <span style={{color: COLORS.emerald}}>Wall Street Gets a $1.8B Free Loan.</span>
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
