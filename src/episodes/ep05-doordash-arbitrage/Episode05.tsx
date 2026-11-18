import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP05_CAPTIONS, EP05_SCENES} from './data';
import {
  ArbitrageLoopScene,
  PhantomListingScene,
  PizzaHeroScene,
  PizzaLoopOutroScene,
  PlainDoughTestScene,
  VcSubsidyTrapScene,
} from './scenes';

export interface Episode05Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode05: React.FC<Episode05Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep05-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP05_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP05_SCENES[EP05_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP05_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('pizza-hero');
  const s2 = getSceneBounds('phantom-listing');
  const s3 = getSceneBounds('arbitrage-loop');
  const s4 = getSceneBounds('plain-dough-test');
  const s5 = getSceneBounds('vc-subsidy-trap');
  const s6 = getSceneBounds('pizza-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.05"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {/* Ducked Heist-Thriller Score + Frame-Synced App Chime & Register Ka-Ching SFX */}
      {enableSoundtrack && <Audio src={staticFile('audio/ep05-soundtrack.wav')} volume={0.26} />}

      {/* Custom-Blended Neural Voiceover Narration */}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-PizzaHero">
        <PizzaHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-PhantomListing">
        <PhantomListingScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-ArbitrageLoop">
        <ArbitrageLoopScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-PlainDoughTest">
        <PlainDoughTestScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-VcSubsidyTrap">
        <VcSubsidyTrapScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-PizzaLoopOutro">
        <PizzaLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP05_CAPTIONS} />
    </SafeZoneFrame>
  );
};
