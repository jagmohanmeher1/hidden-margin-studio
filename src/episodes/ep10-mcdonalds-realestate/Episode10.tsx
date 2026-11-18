import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP10_CAPTIONS, EP10_SCENES} from './data';
import {
  FranchiseRiskScene,
  LandMonopolyScene,
  McdHeroScene,
  McdLoopOutroScene,
  RentRatchetScene,
  SonnebornPivotScene,
} from './scenes';

export interface Episode10Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode10: React.FC<Episode10Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep10-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP10_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP10_SCENES[EP10_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP10_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('mcd-hero');
  const s2 = getSceneBounds('sonneborn-pivot');
  const s3 = getSceneBounds('franchise-risk');
  const s4 = getSceneBounds('rent-ratchet');
  const s5 = getSceneBounds('land-monopoly');
  const s6 = getSceneBounds('mcd-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.10"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {enableSoundtrack && <Audio src={staticFile('audio/ep10-soundtrack.wav')} volume={0.26} />}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-McdHero">
        <McdHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-SonnebornPivot">
        <SonnebornPivotScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-FranchiseRisk">
        <FranchiseRiskScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-RentRatchet">
        <RentRatchetScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-LandMonopoly">
        <LandMonopolyScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-McdLoopOutro">
        <McdLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP10_CAPTIONS} />
    </SafeZoneFrame>
  );
};
