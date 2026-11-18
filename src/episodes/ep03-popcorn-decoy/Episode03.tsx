import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SafeZoneFrame} from '../../components/layout/SafeZoneFrame';
import {KineticCaptions} from '../../components/primitives/KineticCaptions';
import {EP03_CAPTIONS, EP03_SCENES} from './data';
import {
  DecoyLoopOutroScene,
  DecoyPricingScene,
  EverywhereDecoysScene,
  PopcornHeroScene,
  RawCornMarginScene,
  TwoTierBaselineScene,
} from './scenes';

export interface Episode03Props {
  showSafeZoneGuide?: boolean;
  platformOverlay?: 'none' | 'tiktok' | 'reels' | 'shorts';
  enableSoundtrack?: boolean;
  voiceoverPath?: string;
}

export const Episode03: React.FC<Episode03Props> = ({
  showSafeZoneGuide = false,
  platformOverlay = 'none',
  enableSoundtrack = true,
  voiceoverPath = 'audio/ep03-voiceover.wav',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP03_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP03_SCENES[EP03_SCENES.length - 1];

  const getSceneBounds = (id: string) => {
    const sc = EP03_SCENES.find((s) => s.id === id)!;
    const from = Math.round(sc.startSec * fps);
    const to = Math.round(sc.endSec * fps);
    return {from, durationInFrames: Math.max(1, to - from)};
  };

  const s1 = getSceneBounds('popcorn-hero');
  const s2 = getSceneBounds('two-tier-baseline');
  const s3 = getSceneBounds('decoy-pricing');
  const s4 = getSceneBounds('raw-corn-margin');
  const s5 = getSceneBounds('everywhere-decoys');
  const s6 = getSceneBounds('decoy-loop-outro');

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.03"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {/* Ducked Psychological-Thriller Score + Frame-Synced Menu/Register SFX */}
      {enableSoundtrack && <Audio src={staticFile('audio/ep03-soundtrack.wav')} volume={0.26} />}

      {/* Custom-Blended Neural Voiceover Narration */}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      <Sequence from={s1.from} durationInFrames={s1.durationInFrames} name="01-PopcornHero">
        <PopcornHeroScene />
      </Sequence>

      <Sequence from={s2.from} durationInFrames={s2.durationInFrames} name="02-TwoTierBaseline">
        <TwoTierBaselineScene />
      </Sequence>

      <Sequence from={s3.from} durationInFrames={s3.durationInFrames} name="03-DecoyPricing">
        <DecoyPricingScene />
      </Sequence>

      <Sequence from={s4.from} durationInFrames={s4.durationInFrames} name="04-RawCornMargin">
        <RawCornMarginScene />
      </Sequence>

      <Sequence from={s5.from} durationInFrames={s5.durationInFrames} name="05-EverywhereDecoys">
        <EverywhereDecoysScene />
      </Sequence>

      <Sequence from={s6.from} durationInFrames={s6.durationInFrames} name="06-DecoyLoopOutro">
        <DecoyLoopOutroScene />
      </Sequence>

      <KineticCaptions phrases={EP03_CAPTIONS} />
    </SafeZoneFrame>
  );
};
