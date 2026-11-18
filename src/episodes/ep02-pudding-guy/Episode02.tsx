import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP02_CAPTIONS, EP02_SCENES} from './data';
import {
  BoardingLoopScene,
  CharityTwistScene,
  PeelingBottleneckScene,
  PromoMathScene,
  PuddingHeroScene,
  StoreSweepScene,
} from './scenes';

export interface Episode02Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode02: React.FC<Episode02Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep02-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP02_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP02_SCENES[EP02_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP02_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('pudding-hero');
  const s2 = getSceneBounds('promo-math');
  const s3 = getSceneBounds('store-sweep');
  const s4 = getSceneBounds('peeling-bottleneck');
  const s5 = getSceneBounds('charity-twist');
  const s6 = getSceneBounds('boarding-loop');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.02"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {/* Ducked Heist-Thriller Score + Frame-Synced Barcode/Clock/Cabin SFX */}
      {enableSoundtrack && <Audio src={staticFile('audio/ep02-soundtrack.wav')} volume={0.26} />}

      {/* Custom-Blended Neural Voiceover Narration */}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-PuddingHero">
        <PuddingHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-PromoMath">
        <PromoMathScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-StoreSweep">
        <StoreSweepScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-PeelingBottleneck">
        <PeelingBottleneckScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-CharityTwist">
        <CharityTwistScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-BoardingLoop">
        <BoardingLoopScene />
      </Sequence>

      <KineticCaptions phrases={EP02_CAPTIONS} />
    </SafeZoneFrame>
  );
};
