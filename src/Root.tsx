import React from 'react';
import {Composition, Folder} from 'remotion';
import {VIDEO_SPEC} from './theme/tokens';
import {EP01_DURATION_FRAMES} from './episodes/ep01-starbucks-bank/data';
import {Episode01, Episode01Props} from './episodes/ep01-starbucks-bank/Episode01';
import {EP02_DURATION_FRAMES} from './episodes/ep02-pudding-guy/data';
import {Episode02, Episode02Props} from './episodes/ep02-pudding-guy/Episode02';
import {EP03_DURATION_FRAMES} from './episodes/ep03-popcorn-decoy/data';
import {Episode03, Episode03Props} from './episodes/ep03-popcorn-decoy/Episode03';

const Episode01Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode01 {...(props as Episode01Props)} />
);

const Episode02Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode02 {...(props as Episode02Props)} />
);

const Episode03Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode03 {...(props as Episode03Props)} />
);

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="HiddenMargin-Flagship">
      <Composition
        id="Ep01-StarbucksBank"
        component={Episode01Component}
        durationInFrames={EP01_DURATION_FRAMES}
        fps={VIDEO_SPEC.fps}
        width={VIDEO_SPEC.width}
        height={VIDEO_SPEC.height}
        defaultProps={{
          showSafeZoneGuide: false,
          platformOverlay: 'none',
          enableSoundtrack: true,
          voiceoverPath: 'audio/ep01-voiceover.wav',
          targetDepositBillions: 1.84,
        }}
      />

      <Composition
        id="Ep01-StarbucksBank-SafeZonePreview"
        component={Episode01Component}
        durationInFrames={EP01_DURATION_FRAMES}
        fps={VIDEO_SPEC.fps}
        width={VIDEO_SPEC.width}
        height={VIDEO_SPEC.height}
        defaultProps={{
          showSafeZoneGuide: true,
          platformOverlay: 'tiktok',
          enableSoundtrack: true,
          voiceoverPath: 'audio/ep01-voiceover.wav',
          targetDepositBillions: 1.84,
        }}
      />

      <Composition
        id="Ep02-PuddingGuy"
        component={Episode02Component}
        durationInFrames={EP02_DURATION_FRAMES}
        fps={VIDEO_SPEC.fps}
        width={VIDEO_SPEC.width}
        height={VIDEO_SPEC.height}
        defaultProps={{
          showSafeZoneGuide: false,
          platformOverlay: 'none',
          enableSoundtrack: true,
          voiceoverPath: 'audio/ep02-voiceover.wav',
        }}
      />

      <Composition
        id="Ep02-PuddingGuy-SafeZonePreview"
        component={Episode02Component}
        durationInFrames={EP02_DURATION_FRAMES}
        fps={VIDEO_SPEC.fps}
        width={VIDEO_SPEC.width}
        height={VIDEO_SPEC.height}
        defaultProps={{
          showSafeZoneGuide: true,
          platformOverlay: 'reels',
          enableSoundtrack: true,
          voiceoverPath: 'audio/ep02-voiceover.wav',
        }}
      />

      <Composition
        id="Ep03-PopcornDecoy"
        component={Episode03Component}
        durationInFrames={EP03_DURATION_FRAMES}
        fps={VIDEO_SPEC.fps}
        width={VIDEO_SPEC.width}
        height={VIDEO_SPEC.height}
        defaultProps={{
          showSafeZoneGuide: false,
          platformOverlay: 'none',
          enableSoundtrack: true,
          voiceoverPath: 'audio/ep03-voiceover.wav',
        }}
      />

      <Composition
        id="Ep03-PopcornDecoy-SafeZonePreview"
        component={Episode03Component}
        durationInFrames={EP03_DURATION_FRAMES}
        fps={VIDEO_SPEC.fps}
        width={VIDEO_SPEC.width}
        height={VIDEO_SPEC.height}
        defaultProps={{
          showSafeZoneGuide: true,
          platformOverlay: 'shorts',
          enableSoundtrack: true,
          voiceoverPath: 'audio/ep03-voiceover.wav',
        }}
      />
    </Folder>
  );
};
