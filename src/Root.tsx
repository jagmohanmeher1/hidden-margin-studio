import React from 'react';
import {Composition, Folder} from 'remotion';
import {VIDEO_SPEC} from './theme/tokens';
import {EP01_DURATION_FRAMES} from './episodes/ep01-starbucks-bank/data';
import {Episode01, Episode01Props} from './episodes/ep01-starbucks-bank/Episode01';

const Episode01Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode01 {...(props as Episode01Props)} />
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
          voiceoverPath: '',
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
          voiceoverPath: '',
          targetDepositBillions: 1.84,
        }}
      />
    </Folder>
  );
};
