import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP02_FPS = 60;
export const EP02_DURATION_SEC = timings.totalDurationSec;
export const EP02_DURATION_FRAMES = Math.ceil(EP02_DURATION_SEC * EP02_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP02_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP02_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
