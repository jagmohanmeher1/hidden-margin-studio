import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP09_CAPTIONS, EP09_SCENES} from './data';
import {
  GruenOriginScene,
  IkeaEffectScene,
  IkeaHeroScene,
  IkeaLoopOutroScene,
  MeatballFinaleScene,
  UpstreamAnxietyScene,
} from './scenes';

export interface Episode09Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode09: React.FC<Episode09Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep09-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP09_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP09_SCENES[EP09_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP09_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('ikea-hero');
  const s2 = getSceneBounds('gruen-origin');
  const s3 = getSceneBounds('upstream-anxiety');
  const s4 = getSceneBounds('ikea-effect');
  const s5 = getSceneBounds('meatball-finale');
  const s6 = getSceneBounds('ikea-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.09"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {enableSoundtrack && <Audio src={staticFile('audio/ep09-soundtrack.wav')} volume={0.26} />}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-IkeaHero">
        <IkeaHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-GruenOrigin">
        <GruenOriginScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-UpstreamAnxiety">
        <UpstreamAnxietyScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-IkeaEffect">
        <IkeaEffectScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-MeatballFinale">
        <MeatballFinaleScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-IkeaLoopOutro">
        <IkeaLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP09_CAPTIONS} />
    </SafeZoneFrame>
  );
};
