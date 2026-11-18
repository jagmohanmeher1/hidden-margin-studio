import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP08_CAPTIONS, EP08_SCENES} from './data';
import {
  LotteryHeroScene,
  LotteryLoopOutroScene,
  MassachusettsShowdownScene,
  RolldownQuirkScene,
  StateAuditScene,
  TownSyndicateScene,
} from './scenes';

export interface Episode08Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode08: React.FC<Episode08Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep08-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP08_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP08_SCENES[EP08_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP08_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('lottery-hero');
  const s2 = getSceneBounds('rolldown-quirk');
  const s3 = getSceneBounds('town-syndicate');
  const s4 = getSceneBounds('massachusetts-showdown');
  const s5 = getSceneBounds('state-audit');
  const s6 = getSceneBounds('lottery-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.08"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {enableSoundtrack && <Audio src={staticFile('audio/ep08-soundtrack.wav')} volume={0.26} />}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-LotteryHero">
        <LotteryHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-RolldownQuirk">
        <RolldownQuirkScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-TownSyndicate">
        <TownSyndicateScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-MassachusettsShowdown">
        <MassachusettsShowdownScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-StateAudit">
        <StateAuditScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-LotteryLoopOutro">
        <LotteryLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP08_CAPTIONS} />
    </SafeZoneFrame>
  );
};
