import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP06_FPS = 60;
export const EP06_DURATION_SEC = timings.totalDurationSec;
export const EP06_DURATION_FRAMES = Math.ceil(EP06_DURATION_SEC * EP06_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP06_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP06_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
