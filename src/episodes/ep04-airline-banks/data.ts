import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP04_FPS = 60;
export const EP04_DURATION_SEC = timings.totalDurationSec;
export const EP04_DURATION_FRAMES = Math.ceil(EP04_DURATION_SEC * EP04_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP04_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP04_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
