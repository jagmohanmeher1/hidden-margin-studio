import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP03_FPS = 60;
export const EP03_DURATION_SEC = timings.totalDurationSec;
export const EP03_DURATION_FRAMES = Math.ceil(EP03_DURATION_SEC * EP03_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP03_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP03_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
