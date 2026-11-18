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

interface JetSilhouetteSvgProps {
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  dashed?: boolean;
}

const JetSilhouetteSvg: React.FC<JetSilhouetteSvgProps> = ({
  size = 112,
  strokeColor = COLORS.inkSecondary,
  fillColor = 'rgba(163, 177, 198, 0.12)',
  dashed = false,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Swept Main Wings */}
      <path
        d="M60 36L108 72L108 80L66 64L54 64L12 80L12 72L60 36Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      {/* Twin Under-Wing Turbofan Nacelles */}
      <rect
        x="33"
        y="49"
        width="8"
        height="18"
        rx="4"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.2"
      />
      <rect
        x="79"
        y="49"
        width="8"
        height="18"
        rx="4"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.2"
      />
      {/* Rear Horizontal Stabilizer */}
      <path
        d="M60 84L84 99L84 104L63 96L57 96L36 104L36 99L60 84Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      {/* Commercial Fuselage */}
      <path
        d="M60 12C65 12 67 22 67 34V92C67 100 63 108 60 108C57 108 53 100 53 92V34C53 22 55 12 60 12Z"
        fill={COLORS.surface1}
        stroke={strokeColor}
        strokeWidth="2.8"
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      {/* Cockpit Windscreen Arc */}
      <path
        d="M56 23C58 20 62 20 64 23"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

interface VaultCardEmblemSvgProps {
  width?: number;
  height?: number;
  glowStrength?: number;
}

const VaultCardEmblemSvg: React.FC<VaultCardEmblemSvgProps> = ({
  width = 236,
  height = 144,
  glowStrength = 1,
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 236 144" fill="none">
      {/* Credit Card Titanium Frame */}
      <rect
        x="4"
        y="4"
        width="228"
        height="136"
        rx="18"
        fill="rgba(16, 217, 136, 0.13)"
        stroke={COLORS.emerald}
        strokeWidth="2.6"
      />
      {/* Subtle Diagonal Metallic Sheen */}
      <path
        d="M28 6H122L74 138H14C8 138 6 132 6 124V22C6 12 14 6 28 6Z"
        fill={`rgba(16, 217, 136, ${0.07 * glowStrength})`}
      />
      {/* Card Header Label */}
      <text
        x="22"
        y="32"
        fill={COLORS.emerald}
        fontFamily={FONTS.mono}
        fontSize="12"
        fontWeight="700"
        letterSpacing="1.6"
      >
        LOYALTY RESERVE
      </text>
      {/* Contactless Wave Signal */}
      <path
        d="M196 24C200 28 200 34 196 38M203 20C210 26 210 36 203 42"
        stroke={COLORS.emerald}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Gold EMV Microchip + Vault Lock Core */}
      <rect
        x="22"
        y="50"
        width="52"
        height="40"
        rx="8"
        fill="rgba(245, 166, 35, 0.20)"
        stroke={COLORS.amber}
        strokeWidth="2.4"
      />
      <line x1="22" y1="64" x2="38" y2="64" stroke={COLORS.amber} strokeWidth="1.8" />
      <line x1="22" y1="76" x2="38" y2="76" stroke={COLORS.amber} strokeWidth="1.8" />
      <line x1="58" y1="64" x2="74" y2="64" stroke={COLORS.amber} strokeWidth="1.8" />
      <line x1="58" y1="76" x2="74" y2="76" stroke={COLORS.amber} strokeWidth="1.8" />
      {/* Central Vault Wheel / Dial */}
      <circle
        cx="48"
        cy="70"
        r="10"
        fill={COLORS.surface1}
        stroke={COLORS.amber}
        strokeWidth="2.2"
      />
      <circle cx="48" cy="70" r="3" fill={COLORS.amber} />
      {/* Vault Badge Right Side */}
      <rect
        x="116"
        y="55"
        width="98"
        height="30"
        rx="8"
        fill="rgba(16, 24, 36, 0.82)"
        stroke="rgba(16, 217, 136, 0.42)"
        strokeWidth="1.4"
      />
      <text
        x="165"
        y="74"
        textAnchor="middle"
        fill="#E6FFF4"
        fontFamily={FONTS.mono}
        fontSize="12"
        fontWeight="700"
        letterSpacing="1.1"
      >
        VAULT ASSET
      </text>
      {/* Embossed Digits Row */}
      <text
        x="22"
        y="119"
        fill={COLORS.inkPrimary}
        fontFamily={FONTS.mono}
        fontSize="13"
        fontWeight="700"
        letterSpacing="1.6"
      >
        •••• 2560
      </text>
      <text
        x="212"
        y="119"
        textAnchor="end"
        fill={COLORS.emerald}
        fontFamily={FONTS.mono}
        fontSize="13"
        fontWeight="700"
      >
        53% NET
      </text>
    </svg>
  );
};

/**
 * Scene 1: Commercial Jet Morphing/Splitting Into Credit-Card Vault Emblem + $25.6B SkyMiles Ticker
 */
export const AirlineHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const jetEnter = spring({frame: Math.max(0, frame - 4), fps, config: SPRINGS.snappy});
  const morphSplit = spring({frame: Math.max(0, frame - 18), fps, config: SPRINGS.editorial});
  const cardReveal = spring({frame: Math.max(0, frame - 26), fps, config: SPRINGS.heavy});
  const pulse = 0.75 + 0.25 * Math.sin(frame * 0.12);

  return (
    <StageShell>
      <div
        style={{
          padding: '34px 40px',
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
            CORPORATE ANATOMY // HIDDEN BALANCE SHEET
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
            Credit-Card Banks With Wings
          </span>
        </div>

        {/* Jet Silhouette -> Credit-Card Vault Split Stage */}
        <div
          style={{
            height: 198,
            padding: '18px 24px',
            borderRadius: 20,
            backgroundColor: COLORS.surface2,
            border: `1px solid ${COLORS.borderSubtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Left: Commercial Jet Fleet (Cost Center) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              opacity: jetEnter,
              transform: `translateX(${interpolate(morphSplit, [0, 1], [68, 0])}px) scale(${interpolate(
                morphSplit,
                [0, 1],
                [1.06, 0.96]
              )})`,
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
              COST CENTER
            </span>
            <JetSilhouetteSvg
              size={114}
              strokeColor={COLORS.inkSecondary}
              fillColor="rgba(163, 177, 198, 0.11)"
            />
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.crimson,
              }}
            >
              ALUMINUM FLEET
            </span>
          </div>

          {/* Center Morph Conduit */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              opacity: morphSplit,
              transform: `scale(${interpolate(morphSplit, [0, 1], [0.7, 1])})`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: COLORS.emerald,
              }}
            >
              REAL ENGINE
            </span>
            <div
              style={{
                width: 84,
                height: 40,
                borderRadius: 999,
                backgroundColor: COLORS.emeraldSoft,
                border: '1.5px solid rgba(16, 217, 136, 0.48)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTS.mono,
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.emerald,
              }}
            >
              →
            </div>
          </div>

          {/* Right: Glowing Credit-Card + Vault Chip Emblem */}
          <div
            style={{
              opacity: cardReveal,
              transform: `translateX(${interpolate(cardReveal, [0, 1], [26, 0])}px) scale(${interpolate(
                cardReveal,
                [0, 1],
                [0.9, 1]
              )})`,
              filter: `drop-shadow(0 12px 28px rgba(16, 217, 136, ${0.22 * pulse}))`,
            }}
          >
            <VaultCardEmblemSvg width={244} height={148} glowStrength={pulse} />
          </div>
        </div>

        {/* Delta SkyMiles Standalone Valuation Ticker */}
        <AnimatedMoneyTicker
          from={0}
          to={25.6}
          decimals={1}
          startFrame={18}
          durationInFrames={92}
          prefix="$"
          suffix="B VALUE"
          eyebrow="DELTA SKYMILES STANDALONE COLLATERAL"
          sublabel="Mortgaged loyalty unit — worth more than Delta's entire fleet."
          accentColor={COLORS.emerald}
          size="lg"
        />

        {/* 2-Stat Reality Strip */}
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
              backgroundColor: COLORS.crimsonSoft,
              border: '1px solid rgba(242, 63, 93, 0.38)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: COLORS.inkSecondary,
              }}
            >
              FLIGHT OPS MARGIN
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.crimson,
              }}
            >
              ~2%
            </span>
          </div>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              backgroundColor: COLORS.emeraldSoft,
              border: '1px solid rgba(16, 217, 136, 0.42)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: COLORS.inkSecondary,
              }}
            >
              LOYALTY MARGIN
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.emerald,
              }}
            >
              53%
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Scene 2: Brutal Flight Math (2% Passenger Ticket Ops vs 53% Frequent-Flyer Miles Engine)
 */
export const MarginContrastScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const calloutSpring = spring({
    frame: Math.max(0, frame - 82),
    fps,
    config: SPRINGS.heavy,
  });

  return (
    <StageShell>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        <ComparisonBarChart
          eyebrow="OPERATING MARGIN // SEATS VS MILES"
          title="Seats Lose. Miles Print Cash."
          maxValue={60}
          startFrame={4}
          staggerFrames={24}
          bars={[
            {
              id: 'flight-ticket-ops',
              label: 'Passenger Ticket Ops',
              sublabel: 'FUEL + CREWS',
              value: 2,
              formattedValue: '2%',
              isHighlight: false,
            },
            {
              id: 'frequent-flyer-engine',
              label: 'Frequent-Flyer Miles Engine',
              sublabel: 'BANK SWIPES',
              value: 53,
              formattedValue: '53%',
              isHighlight: true,
              accentColor: COLORS.emerald,
            },
          ]}
          footnote="Fuel spikes, weather delays & $150M jets crush seat margins to 1%–3%."
        />

        {/* Crimson Flight Cost Callout Banner */}
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
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: COLORS.crimson,
              }}
            >
              $150M JETS + UNION CREWS + FUEL SPIKES
            </span>
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 23,
                fontWeight: 700,
                color: '#FFE4E8',
              }}
            >
              Without Miles, Passenger Flights Often Lose Money
            </span>
          </div>

          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.crimson,
              letterSpacing: '0.08em',
              flexShrink: 0,
            }}
          >
            1%–3% CAP
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Scene 3: Bulk Mile Arbitrage (Amex & Chase Buying Billions of Miles Upfront)
 */
export const BankArbitrageScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="WHOLESALE MILE ARBITRAGE // BANK PARTNERS"
        title="Selling Billions of Miles in Bulk"
        presetLabel="EVERYDAY CARD SWIPE TRIGGERS"
        selectedPresetFrame={36}
        presets={[
          {label: 'GROCERY'},
          {label: 'TAX BILL'},
          {label: 'AMEX 3X', selected: true},
        ]}
        lineItems={[
          {
            label: 'Amex Bulk Mile Purchase',
            amount: '$1.8B+ / Quarter',
            tone: 'highlight-amber',
            revealDelayFrames: 24,
          },
          {
            label: 'Airline Cost to Issue Mile',
            amount: '~$0.004',
            tone: 'muted',
            revealDelayFrames: 68,
          },
          {
            label: 'Bank Pays Airline Per Mile',
            amount: '~$0.018',
            tone: 'highlight-emerald',
            revealDelayFrames: 112,
          },
        ]}
        calloutTitle="AMEX → DELTA PAYOUT"
        calloutValue="$6.8B / YR"
        calloutTone="amber"
        calloutRevealFrame={154}
      />
    </StageShell>
  );
};

/**
 * Scene 4: 2020 SEC Filing Leak (Delta & United Loyalty Worth More Than Entire Stock Market Caps)
 */
export const CollateralRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const carriers = [
    {
      id: 'delta',
      header: 'DELTA AIR LINES // 2020 SEC FILING',
      badge: '+$6.6B ABOVE CAP',
      capLabel: 'Airline Stock Market Cap (2020)',
      capValue: 19.0,
      capFormatted: '$19.0B',
      loyaltyLabel: 'SkyMiles Loyalty Valuation',
      loyaltyValue: 25.6,
      loyaltyFormatted: '$25.6B',
      delay: 12,
    },
    {
      id: 'united',
      header: 'UNITED AIRLINES // 2020 SEC FILING',
      badge: '2.4X MARKET CAP',
      capLabel: 'Airline Stock Market Cap (2020)',
      capValue: 9.0,
      capFormatted: '$9.0B',
      loyaltyLabel: 'MileagePlus Loyalty Valuation',
      loyaltyValue: 21.9,
      loyaltyFormatted: '$21.9B',
      delay: 48,
    },
  ];

  const maxScale = 28.0;

  return (
    <StageShell>
      <div
        style={{
          padding: '34px 40px',
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
            2020 PANDEMIC MORTGAGE // SEC DISCLOSURES
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
            Worth More Than the Entire Airline
          </span>
        </div>

        {/* 2-Row Carrier Comparison Cards */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {carriers.map((c) => {
            const cardSpring = spring({
              frame: Math.max(0, frame - c.delay),
              fps,
              config: SPRINGS.editorial,
            });
            const barSpring = spring({
              frame: Math.max(0, frame - (c.delay + 12)),
              fps,
              config: SPRINGS.heavy,
            });

            const capPct = (c.capValue / maxScale) * 100 * barSpring;
            const loyaltyPct = (c.loyaltyValue / maxScale) * 100 * barSpring;

            return (
              <div
                key={c.id}
                style={{
                  padding: '18px 22px',
                  borderRadius: 18,
                  backgroundColor: COLORS.surface2,
                  border: `1px solid ${COLORS.borderSubtle}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  opacity: cardSpring,
                  transform: `translateY(${interpolate(cardSpring, [0, 1], [16, 0])}px)`,
                }}
              >
                {/* Carrier Title + Valuation Delta Badge */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: COLORS.inkPrimary,
                    }}
                  >
                    {c.header}
                  </span>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 8,
                      backgroundColor: COLORS.emeraldSoft,
                      border: '1px solid rgba(16, 217, 136, 0.45)',
                      fontFamily: FONTS.mono,
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.emerald,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {c.badge}
                  </span>
                </div>

                {/* Stock Market Cap Bar */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span
                      style={{
                        fontFamily: FONTS.display,
                        fontSize: 19,
                        fontWeight: 600,
                        color: COLORS.inkSecondary,
                      }}
                    >
                      {c.capLabel}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 20,
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: COLORS.inkSecondary,
                      }}
                    >
                      {c.capFormatted}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 14,
                      borderRadius: 6,
                      backgroundColor: COLORS.surface1,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${capPct}%`,
                        height: '100%',
                        borderRadius: 6,
                        backgroundColor: '#303E56',
                      }}
                    />
                  </div>
                </div>

                {/* Loyalty Program Valuation Bar */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span
                      style={{
                        fontFamily: FONTS.display,
                        fontSize: 20,
                        fontWeight: 700,
                        color: COLORS.inkPrimary,
                      }}
                    >
                      {c.loyaltyLabel}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 23,
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: COLORS.emerald,
                      }}
                    >
                      {c.loyaltyFormatted}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 20,
                      borderRadius: 6,
                      backgroundColor: COLORS.surface1,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${loyaltyPct}%`,
                        height: '100%',
                        borderRadius: 6,
                        backgroundColor: COLORS.emerald,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{height: 1, backgroundColor: COLORS.borderSubtle}} />

        {/* Combined Collateral Valuation Counter */}
        <AnimatedMoneyTicker
          from={0}
          to={47.5}
          decimals={1}
          startFrame={86}
          durationInFrames={95}
          prefix="$"
          suffix="B COLLATERAL"
          eyebrow="COMBINED LOYALTY VALUE (DELTA + UNITED)"
          sublabel="Wall Street valued the miles higher than the airlines themselves."
          accentColor={COLORS.emerald}
          size="md"
        />
      </div>
    </StageShell>
  );
};

/**
 * Scene 5: Unregulated Central Bank Power (Print at $0 -> Lock In Swipes -> Inflate Award Chart)
 */
export const DevaluationPowerScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={36}
        stampRevealFrame={140}
        nodes={[
          {
            id: 'cb-print',
            stepCode: 'CENTRAL BANK 01 // PRINT AT $0',
            title: 'Mint Infinite Digital Miles',
            detail: 'Created out of thin air with zero reserve rules',
            metric: '$0 COST',
            accent: 'emerald',
          },
          {
            id: 'cb-swipes',
            stepCode: 'CENTRAL BANK 02 // LOCK IN SWIPES',
            title: 'Sell Billions for Hard USD',
            detail: 'Banks wire real cash upfront while flyers hoard miles',
            metric: '$6.8B / YR',
            accent: 'amber',
          },
          {
            id: 'cb-inflate',
            stepCode: 'CENTRAL BANK 03 // INFLATE THE CHART',
            title: 'Hike Award Prices Overnight',
            detail: 'Quietly raise a 25k-mile seat → 60k miles at will',
            metric: '+140% HIKE',
            accent: 'crimson',
          },
        ]}
        stampText="UNREGULATED CURRENCY"
        stampSubtext="Airlines print the money and control every price tag"
        stampBadgeText="MONOPOLY"
      />
    </StageShell>
  );
};

/**
 * Scene 6: Flying Billboards Split Card + Seamless Loop Bridge Back to 0:00
 */
export const AirlineLoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const splitEnter = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRINGS.snappy,
  });

  const revealPayoff = spring({
    frame: Math.max(0, frame - 36),
    fps,
    config: SPRINGS.editorial,
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
              35,000-FOOT MARKETING FUNNEL
            </span>
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 32,
                fontWeight: 800,
                color: COLORS.inkPrimary,
              }}
            >
              Flying Billboards for Plastic
            </span>
          </div>

          <div
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              backgroundColor: COLORS.amberSoft,
              border: '1px solid rgba(245, 166, 35, 0.45)',
              fontFamily: FONTS.mono,
              fontSize: 17,
              fontWeight: 700,
              color: COLORS.amber,
              letterSpacing: '0.08em',
            }}
          >
            BANK MODEL
          </div>
        </div>

        {/* Sleek 2-Column Split Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
            opacity: splitEnter,
            transform: `translateY(${interpolate(splitEnter, [0, 1], [16, 0])}px)`,
          }}
        >
          {/* Left: Aluminum Jets */}
          <div
            style={{
              padding: '22px 20px',
              borderRadius: 20,
              backgroundColor: COLORS.surface2,
              border: '1.5px dashed rgba(242, 63, 93, 0.48)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: COLORS.crimson,
              }}
            >
              ALUMINUM JETS
            </span>

            <JetSilhouetteSvg
              size={88}
              strokeColor={COLORS.crimson}
              fillColor="rgba(242, 63, 93, 0.08)"
              dashed
            />

            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.inkPrimary,
                }}
              >
                BREAK-EVEN AD
              </span>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  color: COLORS.inkSecondary,
                }}
              >
                ~2% seat margin in the sky
              </span>
            </div>
          </div>

          {/* Right: Plastic Swipes */}
          <div
            style={{
              padding: '22px 20px',
              borderRadius: 20,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: COLORS.emerald,
              }}
            >
              PLASTIC SWIPES
            </span>

            <VaultCardEmblemSvg width={152} height={92} />

            <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.emerald,
                }}
              >
                $25B PROFIT ENGINE
              </span>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  color: COLORS.inkPrimary,
                }}
              >
                53% loyalty margin on Earth
              </span>
            </div>
          </div>
        </div>

        {/* Bold Payoff Headline + Loop Bridge */}
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
            The Planes Just Sell the Dream.
            <br />
            <span style={{color: COLORS.emerald}}>The Credit Card Makes the Billions.</span>
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
