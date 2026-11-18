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
  voiceoverPath = '',
  targetDepositBillions = 1.84,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentSec = frame / fps;

  const activeScene =
    EP01_SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ??
    EP01_SCENES[EP01_SCENES.length - 1];

  return (
    <SafeZoneFrame
      episodeCode="HM // EP.01"
      sectionLabel={activeScene.sectionLabel}
      mood={activeScene.mood}
      showSafeZoneGuide={showSafeZoneGuide}
      platformOverlay={platformOverlay}
    >
      {/* Synced Dark-Thriller Score + Frame-Accurate UI Sound Design */}
      {enableSoundtrack && <Audio src={staticFile('audio/ep01-soundtrack.wav')} volume={0.88} />}

      {/* Drop-in Custom Cloned / ElevenLabs Voiceover Track */}
      {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1.0} /> : null}

      {/* Beat 1: 0.0s - 3.2s */}
      <Sequence from={0} durationInFrames={Math.round(3.2 * fps)} name="01-HeroMorph">
        <HeroMorphScene targetDepositBillions={targetDepositBillions} />
      </Sequence>

      {/* Beat 2: 3.2s - 11.2s */}
      <Sequence
        from={Math.round(3.2 * fps)}
        durationInFrames={Math.round(8.0 * fps)}
        name="02-BankComparison"
      >
        <BankComparisonScene />
      </Sequence>

      {/* Beat 3: 11.2s - 20.2s */}
      <Sequence
        from={Math.round(11.2 * fps)}
        durationInFrames={Math.round(9.0 * fps)}
        name="03-ReloadTrap"
      >
        <ReloadTrapScene />
      </Sequence>

      {/* Beat 4: 20.2s - 31.2s */}
      <Sequence
        from={Math.round(20.2 * fps)}
        durationInFrames={Math.round(11.0 * fps)}
        name="04-SystemFlow"
      >
        <SystemFlowScene />
      </Sequence>

      {/* Beat 5: 31.2s - 44.0s */}
      <Sequence
        from={Math.round(31.2 * fps)}
        durationInFrames={Math.round(12.8 * fps)}
        name="05-BreakageProfit"
      >
        <BreakageProfitScene />
      </Sequence>

      {/* Beat 6: 44.0s - 52.0s */}
      <Sequence
        from={Math.round(44.0 * fps)}
        durationInFrames={Math.round(8.0 * fps)}
        name="06-LoopOutro"
      >
        <LoopOutroScene />
      </Sequence>

      {/* Word-Synced Insider Thriller Kinetic Captions */}
      <KineticCaptions phrases={EP01_CAPTIONS} />
    </SafeZoneFrame>
  );
};
