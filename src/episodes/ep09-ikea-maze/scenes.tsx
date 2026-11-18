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
 * Beat 1: Curved 50-Ft Showroom Blueprint + Gruen Transfer Reveal
 */
export const IkeaHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pathDash = interpolate(frame, [0, 80], [820, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <span style={{fontFamily: FONTS.mono, fontSize: 18, fontWeight: 600, letterSpacing: '0.14em', color: COLORS.amber}}>
            RETAIL ARCHITECTURE // SHOWROOM BLUEPRINT
          </span>
          <span style={{fontFamily: FONTS.display, fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', color: COLORS.inkPrimary}}>
            The 50-Foot Sightline Trap
          </span>
        </div>

        {/* Architectural Curved Maze SVG */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: 20,
            backgroundColor: COLORS.surface2,
            border: `1px solid ${COLORS.borderHighlight}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <svg width="100%" height="132" viewBox="0 0 680 132" fill="none">
            {/* Partition Baffle Walls Blocking Line-of-Sight */}
            <line x1="175" y1="8" x2="175" y2="82" stroke={COLORS.inkMuted} strokeWidth="4" strokeLinecap="round" />
            <line x1="345" y1="50" x2="345" y2="124" stroke={COLORS.inkMuted} strokeWidth="4" strokeLinecap="round" />
            <line x1="515" y1="8" x2="515" y2="82" stroke={COLORS.inkMuted} strokeWidth="4" strokeLinecap="round" />

            {/* Winding One-Way Amber Foot-Traffic Path */}
            <path
              d="M28 96 C95 96, 95 28, 175 28 C255 28, 255 104, 345 104 C435 104, 435 28, 515 28 C585 28, 595 88, 650 88"
              stroke={COLORS.amber}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="820"
              strokeDashoffset={pathDash}
            />
            <circle cx="28" cy="96" r="7" fill={COLORS.emerald} />
            <circle cx="650" cy="88" r="7" fill={COLORS.crimson} />
          </svg>

          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.mono, fontSize: 15, color: COLORS.inkMuted}}>
            <span>ENTRY (1 ITEM LIST)</span>
            <span style={{color: COLORS.amber}}>CURVES EVERY ~50 FT (NO EXIT VIEW)</span>
            <span style={{color: COLORS.crimson}}>CHECKOUT</span>
          </div>
        </div>

        <AnimatedMoneyTicker
          from={0}
          to={60}
          startFrame={16}
          durationInFrames={90}
          prefix=""
          suffix="% IMPULSE"
          eyebrow="THE GRUEN TRANSFER EFFECT"
          sublabel="Disorienting layouts turn focused errands into unplanned cart binges."
          accentColor={COLORS.crimson}
          size="lg"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            paddingTop: 20,
            borderTop: `1px solid ${COLORS.borderSubtle}`,
          }}
        >
          <div style={{padding: '16px 20px', borderRadius: 14, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 15, color: COLORS.inkMuted, letterSpacing: '0.1em'}}>
              WINDOWS &amp; CLOCKS
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 30, fontWeight: 700, color: COLORS.crimson}}>
              ZERO
            </div>
          </div>

          <div style={{padding: '16px 20px', borderRadius: 14, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 15, color: COLORS.inkMuted, letterSpacing: '0.1em'}}>
              SHOWROOM FLOW
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 30, fontWeight: 700, color: COLORS.amber}}>
              1-WAY LOOP
            </div>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 2: Victor Gruen Disorientation vs Normal Retail Grid
 */
export const GruenOriginScene: React.FC = () => {
  return (
    <StageShell>
      <ComparisonBarChart
        eyebrow="UCL RETAIL RESEARCH // UNPLANNED CART SHARE"
        title="Grid Aisles vs. Curved Maze"
        maxValue={75}
        startFrame={4}
        staggerFrames={24}
        bars={[
          {
            id: 'grid-store',
            label: 'Standard Grid Store',
            sublabel: 'STRAIGHT EXIT SIGHTLINES',
            value: 22,
            formattedValue: '22%',
            isHighlight: false,
          },
          {
            id: 'ikea-maze',
            label: 'IKEA One-Way Showroom',
            sublabel: 'GRUEN DISORIENTATION',
            value: 60,
            formattedValue: '60% UNPLANNED',
            isHighlight: true,
            accentColor: COLORS.crimson,
          },
        ]}
        footnote="Named after mall architect Victor Gruen — who later disowned his own creation."
      />
    </StageShell>
  );
};

/**
 * Beat 3: One-Way River FOMO & "Bulla Bulla" Bargain Bins
 */
export const UpstreamAnxietyScene: React.FC = () => {
  return (
    <StageShell>
      <ReceiptAndUiCard
        eyebrow="ONE-WAY TRAFFIC // FEAR OF BACKTRACKING"
        title="Pass It Once, Lose It Forever"
        presetLabel="PSYCHOLOGICAL TRIGGERS ALONG THE PATH"
        selectedPresetFrame={40}
        presets={[
          {label: '1-Way Arrows'},
          {label: 'Hidden Doors'},
          {label: 'Bulla Bins', selected: true},
        ]}
        lineItems={[
          {
            label: 'Walking Upstream Against Crowd',
            amount: 'HIGH ANXIETY',
            tone: 'highlight-crimson',
            revealDelayFrames: 26,
          },
          {
            label: 'Overflowing "Bulla Bulla" $3–$9 Bins',
            amount: 'FAKE ABUNDANCE',
            tone: 'highlight-amber',
            revealDelayFrames: 78,
          },
          {
            label: 'Staff Wall Shortcuts Along Maze',
            amount: 'CAMOUFLAGED',
            tone: 'muted',
            revealDelayFrames: 128,
          },
        ]}
        calloutTitle="YELLOW FRÅKTA BAG EFFECT"
        calloutValue="3.4x ITEMS"
        calloutTone="amber"
        calloutRevealFrame={170}
      />
    </StageShell>
  );
};

/**
 * Beat 4: Harvard Business School's "IKEA Effect" (+63% Sweat-Equity Valuation)
 */
export const IkeaEffectScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const leftSpring = spring({frame: Math.max(0, frame - 14), fps, config: SPRINGS.snappy});
  const rightSpring = spring({frame: Math.max(0, frame - 46), fps, config: SPRINGS.snappy});

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
          gap: 26,
        }}
      >
        <div>
          <div style={{fontFamily: FONTS.mono, fontSize: 18, fontWeight: 600, letterSpacing: '0.14em', color: COLORS.emerald, marginBottom: 8}}>
            HARVARD BUSINESS SCHOOL // NORTON, MOCHON &amp; ARIELY
          </div>
          <div style={{fontFamily: FONTS.display, fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: COLORS.inkPrimary}}>
            The &ldquo;IKEA Effect&rdquo; Double Win
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          <div
            style={{
              padding: '24px 22px',
              borderRadius: 18,
              backgroundColor: COLORS.emeraldSoft,
              border: '1.5px solid rgba(16, 217, 136, 0.50)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              opacity: leftSpring,
            }}
          >
            <span style={{fontFamily: FONTS.mono, fontSize: 15, color: COLORS.emerald, letterSpacing: '0.08em'}}>
              YOUR BRAIN (SWEAT EQUITY)
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 40, fontWeight: 700, color: COLORS.emerald}}>
              +63%
            </span>
            <span style={{fontFamily: FONTS.display, fontSize: 19, color: COLORS.inkPrimary, fontWeight: 600}}>
              Higher Perceived Value
            </span>
            <span style={{fontFamily: FONTS.display, fontSize: 17, color: COLORS.inkSecondary}}>
              Buyers value self-built boxes far higher than pre-assembled twins
            </span>
          </div>

          <div
            style={{
              padding: '24px 22px',
              borderRadius: 18,
              backgroundColor: COLORS.amberSoft,
              border: '1.5px solid rgba(245, 166, 35, 0.48)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              opacity: rightSpring,
            }}
          >
            <span style={{fontFamily: FONTS.mono, fontSize: 15, color: COLORS.amber, letterSpacing: '0.08em'}}>
              IKEA LOGISTICS SAVINGS
            </span>
            <span style={{fontFamily: FONTS.mono, fontSize: 40, fontWeight: 700, color: COLORS.amber}}>
              6x DENSER
            </span>
            <span style={{fontFamily: FONTS.display, fontSize: 19, color: COLORS.inkPrimary, fontWeight: 600}}>
              Zero Shipping Air
            </span>
            <span style={{fontFamily: FONTS.display, fontSize: 17, color: COLORS.inkSecondary}}>
              You pick it from Warehouse Aisle 24 and assemble it for $0 labor
            </span>
          </div>
        </div>
      </div>
    </StageShell>
  );
};

/**
 * Beat 5: Post-Checkout Swedish Meatballs & $1 Cone (Daniel Kahneman Peak-End Rule)
 */
export const MeatballFinaleScene: React.FC = () => {
  return (
    <StageShell>
      <FlowNodeGraph
        stepIntervalFrames={38}
        stampRevealFrame={145}
        nodes={[
          {
            id: 'ikea-1',
            stepCode: 'STAGE 01 // CURVED DISORIENTATION',
            title: '50-Ft Bends Erase Your List',
            detail: 'Staged rooms sell lifestyle upgrades instead of single items',
            metric: '60% IMPULSE',
            accent: 'amber',
          },
          {
            id: 'ikea-2',
            stepCode: 'STAGE 02 // SELF-SERVE WAREHOUSE',
            title: 'You Do the Forklift Picking',
            detail: 'Flat-pack sweat equity locks in loyalty while slashing COGS',
            metric: '$0 LABOR',
            accent: 'emerald',
          },
          {
            id: 'ikea-3',
            stepCode: 'STAGE 03 // PEAK-END EXIT BISTRO',
            title: '$1.00 Cone Right Past Register',
            detail: 'Overwrites the sting of a $300 receipt with a cheap dopamine hit',
            metric: 'PAIN ERASED',
            accent: 'crimson',
          },
        ]}
        stampText="ENGINEERED FLOORPLAN"
        stampSubtext="Every turn from showroom to bistro steers your wallet"
        stampBadgeText="MAZE"
      />
    </StageShell>
  );
};

/**
 * Beat 6: $4 Tea Lights -> $300 Trunk & Seamless Loop Bridge
 */
export const IkeaLoopOutroScene: React.FC = () => {
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
              SATURDAY TRIP RECEIPT // REALITY CHECK
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 32, fontWeight: 800, color: COLORS.inkPrimary}}>
              The Gruen Tax on Your Wallet
            </div>
          </div>
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              backgroundColor: COLORS.crimsonSoft,
              border: '1px solid rgba(242, 63, 93, 0.48)',
              fontFamily: FONTS.mono,
              fontSize: 19,
              fontWeight: 700,
              color: COLORS.crimson,
            }}
          >
            TRAPPED
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          <div style={{padding: '22px 24px', borderRadius: 18, backgroundColor: COLORS.surface2}}>
            <div style={{fontFamily: FONTS.mono, fontSize: 16, color: COLORS.inkMuted, letterSpacing: '0.1em'}}>
              PLANNED BUDGET
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, color: COLORS.emerald}}>
              $4.00
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 18, color: COLORS.inkSecondary}}>
              1 pack of scented tea lights
            </div>
          </div>

          <div
            style={{
              padding: '22px 24px',
              borderRadius: 18,
              backgroundColor: COLORS.crimsonSoft,
              border: '1.5px solid rgba(242, 63, 93, 0.50)',
            }}
          >
            <div style={{fontFamily: FONTS.mono, fontSize: 16, color: COLORS.crimson, letterSpacing: '0.1em'}}>
              ACTUAL TRUNK LOAD
            </div>
            <div style={{fontFamily: FONTS.mono, fontSize: 38, fontWeight: 700, color: '#FFE4E8'}}>
              $294.50
            </div>
            <div style={{fontFamily: FONTS.display, fontSize: 18, color: COLORS.inkSecondary}}>
              19 unplanned items + meatballs
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
            You Didn&rsquo;t Lose Self-Control.
            <br />
            <span style={{color: COLORS.amber}}>You Walked Into a Maze.</span>
          </div>

          <div style={{fontFamily: FONTS.mono, fontSize: 20, color: COLORS.inkMuted, letterSpacing: '0.08em'}}>
            WHICH IS WHY... ↺
          </div>
        </div>
      </div>
    </StageShell>
  );
};
