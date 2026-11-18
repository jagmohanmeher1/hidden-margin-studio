import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP05_FPS = 60;
export const EP05_DURATION_SEC = timings.totalDurationSec;
export const EP05_DURATION_FRAMES = Math.ceil(EP05_DURATION_SEC * EP05_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP05_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP05_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
