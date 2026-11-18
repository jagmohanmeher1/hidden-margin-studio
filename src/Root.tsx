import React from 'react';
import {Composition, Folder} from 'remotion';
import {VIDEO_SPEC} from './theme/tokens';
import {EP01_DURATION_FRAMES} from './episodes/ep01-starbucks-bank/data';
import {Episode01, Episode01Props} from './episodes/ep01-starbucks-bank/Episode01';
import {EP02_DURATION_FRAMES} from './episodes/ep02-pudding-guy/data';
import {Episode02, Episode02Props} from './episodes/ep02-pudding-guy/Episode02';
import {EP03_DURATION_FRAMES} from './episodes/ep03-popcorn-decoy/data';
import {Episode03, Episode03Props} from './episodes/ep03-popcorn-decoy/Episode03';
import {EP04_DURATION_FRAMES} from './episodes/ep04-airline-banks/data';
import {Episode04, Episode04Props} from './episodes/ep04-airline-banks/Episode04';
import {EP05_DURATION_FRAMES} from './episodes/ep05-doordash-arbitrage/data';
import {Episode05, Episode05Props} from './episodes/ep05-doordash-arbitrage/Episode05';
import {EP06_DURATION_FRAMES} from './episodes/ep06-menu-dollar-sign/data';
import {Episode06, Episode06Props} from './episodes/ep06-menu-dollar-sign/Episode06';
import {EP07_DURATION_FRAMES} from './episodes/ep07-costco-hotdog/data';
import {Episode07, Episode07Props} from './episodes/ep07-costco-hotdog/Episode07';
import {EP08_DURATION_FRAMES} from './episodes/ep08-lottery-rolldown/data';
import {Episode08, Episode08Props} from './episodes/ep08-lottery-rolldown/Episode08';
import {EP09_DURATION_FRAMES} from './episodes/ep09-ikea-maze/data';
import {Episode09, Episode09Props} from './episodes/ep09-ikea-maze/Episode09';
import {EP10_DURATION_FRAMES} from './episodes/ep10-mcdonalds-realestate/data';
import {Episode10, Episode10Props} from './episodes/ep10-mcdonalds-realestate/Episode10';

const Episode01Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode01 {...(props as Episode01Props)} />
);
const Episode02Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode02 {...(props as Episode02Props)} />
);
const Episode03Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode03 {...(props as Episode03Props)} />
);
const Episode04Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode04 {...(props as Episode04Props)} />
);
const Episode05Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode05 {...(props as Episode05Props)} />
);
const Episode06Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode06 {...(props as Episode06Props)} />
);
const Episode07Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode07 {...(props as Episode07Props)} />
);
const Episode08Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode08 {...(props as Episode08Props)} />
);
const Episode09Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode09 {...(props as Episode09Props)} />
);
const Episode10Component: React.FC<Record<string, unknown>> = (props) => (
  <Episode10 {...(props as Episode10Props)} />
);

export const RemotionRoot: React.FC = () => {
  const episodes = [
    {
      id: 'Ep01-StarbucksBank',
      component: Episode01Component,
      frames: EP01_DURATION_FRAMES,
      voice: 'audio/ep01-voiceover.wav',
      overlay: 'tiktok' as const,
      extra: {targetDepositBillions: 1.84},
    },
    {
      id: 'Ep02-PuddingGuy',
      component: Episode02Component,
      frames: EP02_DURATION_FRAMES,
      voice: 'audio/ep02-voiceover.wav',
      overlay: 'reels' as const,
      extra: {},
    },
    {
      id: 'Ep03-PopcornDecoy',
      component: Episode03Component,
      frames: EP03_DURATION_FRAMES,
      voice: 'audio/ep03-voiceover.wav',
      overlay: 'shorts' as const,
      extra: {},
    },
    {
      id: 'Ep04-AirlineBanks',
      component: Episode04Component,
      frames: EP04_DURATION_FRAMES,
      voice: 'audio/ep04-voiceover.wav',
      overlay: 'tiktok' as const,
      extra: {},
    },
    {
      id: 'Ep05-DoorDashArbitrage',
      component: Episode05Component,
      frames: EP05_DURATION_FRAMES,
      voice: 'audio/ep05-voiceover.wav',
      overlay: 'reels' as const,
      extra: {},
    },
    {
      id: 'Ep06-MenuDollarSign',
      component: Episode06Component,
      frames: EP06_DURATION_FRAMES,
      voice: 'audio/ep06-voiceover.wav',
      overlay: 'shorts' as const,
      extra: {},
    },
    {
      id: 'Ep07-CostcoHotDog',
      component: Episode07Component,
      frames: EP07_DURATION_FRAMES,
      voice: 'audio/ep07-voiceover.wav',
      overlay: 'tiktok' as const,
      extra: {},
    },
    {
      id: 'Ep08-LotteryRolldown',
      component: Episode08Component,
      frames: EP08_DURATION_FRAMES,
      voice: 'audio/ep08-voiceover.wav',
      overlay: 'reels' as const,
      extra: {},
    },
    {
      id: 'Ep09-IkeaMaze',
      component: Episode09Component,
      frames: EP09_DURATION_FRAMES,
      voice: 'audio/ep09-voiceover.wav',
      overlay: 'shorts' as const,
      extra: {},
    },
    {
      id: 'Ep10-McDonaldsRealEstate',
      component: Episode10Component,
      frames: EP10_DURATION_FRAMES,
      voice: 'audio/ep10-voiceover.wav',
      overlay: 'tiktok' as const,
      extra: {},
    },
  ];

  return (
    <Folder name="HiddenMargin-Flagship">
      {episodes.map((ep) => (
        <React.Fragment key={ep.id}>
          <Composition
            id={ep.id}
            component={ep.component}
            durationInFrames={ep.frames}
            fps={VIDEO_SPEC.fps}
            width={VIDEO_SPEC.width}
            height={VIDEO_SPEC.height}
            defaultProps={{
              showSafeZoneGuide: false,
              platformOverlay: 'none',
              enableSoundtrack: true,
              voiceoverPath: ep.voice,
              ...ep.extra,
            }}
          />
          <Composition
            id={`${ep.id}-SafeZonePreview`}
            component={ep.component}
            durationInFrames={ep.frames}
            fps={VIDEO_SPEC.fps}
            width={VIDEO_SPEC.width}
            height={VIDEO_SPEC.height}
            defaultProps={{
              showSafeZoneGuide: true,
              platformOverlay: ep.overlay,
              enableSoundtrack: true,
              voiceoverPath: ep.voice,
              ...ep.extra,
            }}
          />
        </React.Fragment>
      ))}
    </Folder>
  );
};
