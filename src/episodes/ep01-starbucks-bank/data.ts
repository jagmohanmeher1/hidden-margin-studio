import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP01_FPS = 60;
export const EP01_DURATION_SEC = timings.totalDurationSec;
export const EP01_DURATION_FRAMES = Math.ceil(EP01_DURATION_SEC * EP01_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP01_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP01_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
