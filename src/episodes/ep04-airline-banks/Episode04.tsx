import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP04_CAPTIONS, EP04_SCENES} from './data';
import {
  AirlineHeroScene,
  AirlineLoopOutroScene,
  BankArbitrageScene,
  CollateralRevealScene,
  DevaluationPowerScene,
  MarginContrastScene,
} from './scenes';

export interface Episode04Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode04: React.FC<Episode04Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep04-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP04_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP04_SCENES[EP04_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP04_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('airline-hero');
  const s2 = getSceneBounds('margin-contrast');
  const s3 = getSceneBounds('bank-arbitrage');
  const s4 = getSceneBounds('collateral-reveal');
  const s5 = getSceneBounds('devaluation-power');
  const s6 = getSceneBounds('airline-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.04"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {/* Ducked Insider-Thriller Score + Frame-Synced Turbine/Swipe/Ticker SFX */}
      {enableSoundtrack && <Audio src={staticFile('audio/ep04-soundtrack.wav')} volume={0.26} />}

      {/* Custom-Blended Neural Voiceover Narration */}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-AirlineHero">
        <AirlineHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-MarginContrast">
        <MarginContrastScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-BankArbitrage">
        <BankArbitrageScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-CollateralReveal">
        <CollateralRevealScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-DevaluationPower">
        <DevaluationPowerScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-AirlineLoopOutro">
        <AirlineLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP04_CAPTIONS} />
    </SafeZoneFrame>
  );
};
