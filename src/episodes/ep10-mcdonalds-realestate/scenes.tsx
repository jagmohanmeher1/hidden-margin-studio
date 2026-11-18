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
 * Beat 1: Burger Silhouette -> $42B Commercial Real Estate Portfolio
 */
export const McdHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const morph = spring({
    frame: Math.max(0, frame - 24),
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
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 24,
              backgroundColor: COLORS.surface2,
              border: `1px solid ${COLORS.borderHighlight}`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Burger Icon Fading Out */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 64 64"
              fill="none"
              style={{
                position: 'absolute',
                opacity: interpolate(morph, [0, 0.65], [1, 0], {extrapolateRight: 'clamp'}),
                transform: `scale(${interpolate(morph, [0, 1], [1, 0.72])})`,
              }}
            >
              <path d="M12 28C12 18 21 12 32 12C43 12 52 18 52 28H12Z" stroke={COLORS.amber} strokeWidth="2.8" />
              <line x1="10" y1="36" x2="54" y2="36" stroke={COLORS.crimson} strokeWidth="3.5" strokeLinecap="round" />
              <rect x="12" y="43" width="40" height="9" rx="4.5" stroke={COLORS.amber} strokeWidth="2.8" />
            </svg>

            {/* Commercial Property Tower Morphing In */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 64 64"
              fill="none"
              style={{
                position: 'absolute',
                opacity: interpolate(morph, [0.25, 0.9], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                transform: `scale(${interpolate(morph, [0, 1], [0.72, 1])})`,
              }}
            >
              <rect x="18" y="10" width="28" height="44" rx="3" fill={COLORS.emeraldSoft} stroke={COLORS.emerald} strokeWidth="2.8" />
              <line x1="25" y1="20" x2="39" y2="20" stroke={COLORS.emerald} strokeWidth="2.5" />
              <line x1="25" y1="29" x2="39" y2="29" stroke={COLORS.emerald} strokeWidth="2.5" />
              <line x1="25" y1="38" x2="39" y2="38" stroke={COLORS.emerald} strokeWidth="2.5" />
              <line x1="10" y1="54" x2="54" y2="54" stroke={COLORS.amber} strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            <span style={{fontFamily: FONTS.mono, fontSize: 18, fontWeight: 600, letterSpacing: '0.14em', color: COLORS.amber}}>
              SEC 10-K // PROPERTY &amp; LAND ASSETS
            </span>
            <span style={{fontFamily: FONTS.display, fontSize: 35, fontWeight: 800, letterSpacing: '-0.025em', color: COLORS.inkPrimary}}>
              The Golden Arches Landlord
            </span>
          </div>
        </div>

        <AnimatedMoneyTicker
          from={0}
          to={42}
          startFrame={12}
          durationInFrames={95}
          prefix="$"
          suffix="B LAND"
          eyebrow="GROSS COMMERCIAL REAL ESTATE PORTFOLIO"
          sublabel="McDonald's owns the prime corner dirt and leases it to franchisees."
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
              FRANCHISED STORES
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.amber}}>
              95% SHARE
            </div>
          </div>

          <div style={{padding: '18px 22px', borderRadius: 16, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.12em', color: COLORS.inkMuted}}>
              LEASE GROSS MARGIN
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.emerald}}>
              82% MARGIN
            </div>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 2: Harry Sonneborn's 1956 Real Estate Pivot
 */
export const SonnebornPivotScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="1956 FINANCIAL PIVOT // HARRY SONNEBORN"
        title="Stop Selling Burgers, Buy the Dirt"
        presetLabel="REVENUE ENGINE TRANSFORMATION"
        selectedPresetFrame={40}
        presets={[
          {label: '1.9% Royalty'},
          {label: 'Milkshakes'},
          {label: 'Land Lease', selected: true},
        ]}
        lineItems={[
          {
            label: 'Ray Kroc Early Fee (1.9% Burger Cut)',
            amount: 'NEAR BROKE',
            tone: 'highlight-crimson',
            revealDelayFrames: 26,
          },
          {
            label: 'Franchise Realty Corp (Buy Corners)',
            amount: 'OWN THE DIRT',
            tone: 'highlight-amber',
            revealDelayFrames: 78,
          },
          {
            label: 'Lease Markup Charged to Operator',
            amount: '40%+ SPREAD',
            tone: 'highlight-emerald',
            revealDelayFrames: 128,
          },
        ]}
        calloutTitle="ANNUAL FRANCHISE RENT STREAM"
        calloutValue="$9.8B / YR"
        calloutTone="emerald"
        calloutRevealFrame={170}
      />
    </StageShell>
  );
};

/**
 * Beat 3: Margin Split (16% Company Burger Ops vs 82% Corporate Rent & Royalties)
 */
export const FranchiseRiskScene: React.FC = () => {
  return (
    <StageShell>
      <ComparisonBarChart
        eyebrow="OPERATING MARGIN REALITY // WHO BEARS THE COST"
        title="Tenants Eat Cost, Corporate Takes Rent"
        maxValue={100}
        startFrame={4}
        staggerFrames={24}
        bars={[
          {
            id: 'burger-ops',
            label: 'Flipping Burgers (Store Ops)',
            sublabel: 'BEEF + WAGES + FRYERS',
            value: 16,
            formattedValue: '16%',
            isHighlight: false,
          },
          {
            id: 'landlord-stream',
            label: 'Franchise Rent & Royalties',
            sublabel: 'SKIMMED OFF GROSS SALES',
            value: 82,
            formattedValue: '82% MARGIN',
            isHighlight: true,
            accentColor: COLORS.emerald,
          },
        ]}
        footnote="Corporate gets paid off top-line sales before the franchisee pays a dollar of wages."
      />
    </StageShell>
  );
};

/**
 * Beat 4: "Whichever Is Higher" Inflation Rent Ratchet
 */
export const RentRatchetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardA = spring({frame: Math.max(0, frame - 14), fps, config: SPRINGS.snappy});
  const cardB = spring({frame: Math.max(0, frame - 48), fps, config: SPRINGS.snappy});

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
            LEASE CONTRACT CLAUSE // HEADS I WIN, TAILS YOU PAY
          </div>
          <div style={{fontFamily: FONTS.display, fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: COLORS.inkPrimary}}>
            The Inflation Rent Ratchet
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14, alignItems: 'center'}}>
          <div
            style={{
              padding: '22px 20px',
              borderRadius: 18,
              backgroundColor: COLORS.surface2,
              border: `1px solid ${COLORS.borderSubtle}`,
              opacity: cardA,
            }}
          >
            <div style={{fontFamily: FONTS.mono, fontSize: 14, color: COLORS.inkMuted, letterSpacing: '0.08em'}}>
              SLOW MONTH FLOOR
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 28, fontWeight: 700, color: COLORS.inkPrimary, marginTop: 6}}>
              BASE RENT
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 17, color: COLORS.inkSecondary, marginTop: 6}}>
              Guaranteed minimum check
            </div>
          </div>

          <span style={{fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700, color: COLORS.amber}}>
            OR
          </span>

          <div
            style={{
              padding: '22px 20px',
              borderRadius: 18,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.52)',
              opacity: cardB,
            }}
          >
            <div style={{fontFamily: FONTS.mono, fontSize: 14, color: COLORS.emerald, letterSpacing: '0.08em'}}>
              BUSY / INFLATION CAP
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 28, fontWeight: 700, color: COLORS.emerald, marginTop: 6}}>
              % OF SALES
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 17, color: COLORS.inkSecondary, marginTop: 6}}>
              10%–18% of every Big Mac
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '20px 24px',
            borderRadius: 16,
            backgroundColor: COLORS.amberSoft,
            border: '1px solid rgba(245, 166, 35, 0.48)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: COLORS.inkPrimary}}>
            Menu Prices Rise → Landlord Rent Rises Free
          </span>
          <span style={{fontFamily: FONTS.mono, fontSize: 19, fontWeight: 700, color: COLORS.amber}}>
            HIGHER WINS
          </span>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 5: Global Corner Property Flywheel
 */
export const LandMonopolyScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={38}
        stampRevealFrame={145}
        nodes={[
          {
            id: 'mcd-1',
            stepCode: 'EMPIRE 01 // LOCK PRIME INTERSECTIONS',
            title: '40,000+ High-Traffic Corners',
            detail: 'Corporate acquires prime highway exits & urban corners globally',
            metric: '$42B DIRT',
            accent: 'amber',
          },
          {
            id: 'mcd-2',
            stepCode: 'EMPIRE 02 // TENANT FUNDS OPERATIONS',
            title: 'Franchisee Buys Kitchen & Labor',
            detail: 'Operators put up millions in capital and grind 18-hour store shifts',
            metric: '95% TENANTS',
            accent: 'emerald',
          },
          {
            id: 'mcd-3',
            stepCode: 'EMPIRE 03 // COMPOUNDING LANDLORD RENT',
            title: '$9.8B/Yr Rent + 4%–5% Royalty',
            detail: 'Tenants pay off the real estate while corporate keeps title forever',
            metric: '82% MARGIN',
            accent: 'emerald',
          },
        ]}
        stampText="COMMERCIAL LANDLORD EMPIRE"
        stampSubtext="Sonneborn: 'We are not in the food business — we are in real estate'"
        stampBadgeText="EMPIRE"
      />
    </StageShell>
  );
};

/**
 * Beat 6: Burgers Pay the Lease & Seamless Loop Bridge
 */
export const McdLoopOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const reveal = spring({
    frame: Math.max(0, frame - 26),
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
              THE HIDDEN MARGIN // SUMMARY
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 32, fontWeight: 800, color: COLORS.inkPrimary}}>
              What McDonald&rsquo;s Really Sells
            </div>
          </div>
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              backgroundColor: COLORS.emeraldSoft,
              border: '1px solid rgba(16, 217, 136, 0.48)',
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 700,
              color: COLORS.emerald,
            }}
          >
            $42B REIT
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          <div style={{padding: '22px 24px', borderRadius: 18, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, color: COLORS.inkMuted, letterSpacing: '0.1em'}}>
              SURFACE PRODUCT
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.amber}}>
              $5 BURGERS
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 18, color: COLORS.inkSecondary}}>
              Traffic magnet for the tenant
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
              REAL PROFIT ENGINE
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 32, fontWeight: 700, color: COLORS.emerald}}>
              $9.8B RENT
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 18, color: COLORS.inkSecondary}}>
              82% margin commercial leases
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
            opacity: reveal,
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
            Fries Just Keep the Lights On.
            <br />
            <span style={{color: COLORS.emerald}}>The Dirt Prints the Billions.</span>
          </div>

          <div style={{fontFamily: FONTS.mono, fontSize: 20, color: COLORS.inkMuted, letterSpacing: '0.08em'}}>
            WHICH IS WHY... ↺
          </div>
        </div>
      </div>
    </StageShell>
  );
};
