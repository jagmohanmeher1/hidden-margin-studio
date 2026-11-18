import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP10_FPS = 60;
export const EP10_DURATION_SEC = timings.totalDurationSec;
export const EP10_DURATION_FRAMES = Math.ceil(EP10_DURATION_SEC * EP10_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP10_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP10_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
