import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP01_CAPTIONS, EP01_SCENES} from './data';
import {
  BankComparisonScene,
  BreakageProfitScene,
  HeroMorphScene,
  LoopOutroScene,
  ReloadTrapScene,
  SystemFlowScene,
} from './scenes';

export interface Episode01Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
  targetDepositBillions?: number;
}

export const Episode01: React.FC<Episode01Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep01-voiceover.wav',
  targetDepositBillions = 1.84,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP01_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP01_SCENES[EP01_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP01_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('hero-morph');
  const s2 = getSceneBounds('bank-comparison');
  const s3 = getSceneBounds('reload-trap');
  const s4 = getSceneBounds('system-flow');
  const s5 = getSceneBounds('breakage-profit');
  const s6 = getSceneBounds('loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.01"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {/* Ducked Dark-Thriller Score + Frame-Accurate UI Sound Design (-11.7 dB under VO) */}
      {enableSoundtrack && <Audio src={staticFile('audio/ep01-soundtrack.wav')} volume={0.26} />}

      {/* Custom-Blended Neural Voiceover Narration */}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-HeroMorph">
        <HeroMorphScene targetDepositBillions={targetDepositBillions} />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-BankComparison">
        <BankComparisonScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-ReloadTrap">
        <ReloadTrapScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-SystemFlow">
        <SystemFlowScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-BreakageProfit">
        <BreakageProfitScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-LoopOutro">
        <LoopOutroScene />
      </Sequence>

      {/* Millisecond-Synced Insider Thriller Kinetic Captions */}
      <KineticCaptions phrases={EP01_CAPTIONS} />
    </SafeZoneFrame>
  );
};
