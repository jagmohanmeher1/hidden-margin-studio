import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP07_CAPTIONS, EP07_SCENES} from './data';
import {
  CostcoHeroScene,
  CostcoLoopOutroScene,
  InflationLockScene,
  MarkupCapScene,
  MembershipEngineScene,
  VerticalFactoriesScene,
} from './scenes';

export interface Episode07Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode07: React.FC<Episode07Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep07-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP07_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP07_SCENES[EP07_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP07_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('costco-hero');
  const s2 = getSceneBounds('inflation-lock');
  const s3 = getSceneBounds('vertical-factories');
  const s4 = getSceneBounds('markup-cap');
  const s5 = getSceneBounds('membership-engine');
  const s6 = getSceneBounds('costco-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.07"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {enableSoundtrack && <Audio src={staticFile('audio/ep07-soundtrack.wav')} volume={0.26} />}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-CostcoHero">
        <CostcoHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-InflationLock">
        <InflationLockScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-VerticalFactories">
        <VerticalFactoriesScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-MarkupCap">
        <MarkupCapScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-MembershipEngine">
        <MembershipEngineScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-CostcoLoopOutro">
        <CostcoLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP07_CAPTIONS} />
    </SafeZoneFrame>
  );
};
