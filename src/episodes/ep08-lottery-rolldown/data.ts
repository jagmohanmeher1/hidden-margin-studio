import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP08_FPS = 60;
export const EP08_DURATION_SEC = timings.totalDurationSec;
export const EP08_DURATION_FRAMES = Math.ceil(EP08_DURATION_SEC * EP08_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP08_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP08_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
