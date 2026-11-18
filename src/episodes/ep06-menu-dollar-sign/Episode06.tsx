import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP06_CAPTIONS, EP06_SCENES} from './data';
import {
  CornellStudyScene,
  GoldenTriangleScene,
  MenuHeroScene,
  MenuLoopOutroScene,
  MenuStackScene,
  PainOfPayingScene,
} from './scenes';

export interface Episode06Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode06: React.FC<Episode06Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep06-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP06_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP06_SCENES[EP06_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP06_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('menu-hero');
  const s2 = getSceneBounds('cornell-study');
  const s3 = getSceneBounds('pain-of-paying');
  const s4 = getSceneBounds('golden-triangle');
  const s5 = getSceneBounds('menu-stack');
  const s6 = getSceneBounds('menu-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.06"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {/* Ducked Psychological-Thriller Score + Frame-Synced Menu/Scanner SFX */}
      {enableSoundtrack && <Audio src={staticFile('audio/ep06-soundtrack.wav')} volume={0.26} />}

      {/* Custom-Blended Neural Voiceover Narration */}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-MenuHero">
        <MenuHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-CornellStudy">
        <CornellStudyScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-PainOfPaying">
        <PainOfPayingScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-GoldenTriangle">
        <GoldenTriangleScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-MenuStack">
        <MenuStackScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-MenuLoopOutro">
        <MenuLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP06_CAPTIONS} />
    </SafeZoneFrame>
  );
};
