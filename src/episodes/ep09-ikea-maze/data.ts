import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP09_FPS = 60;
export const EP09_DURATION_SEC = timings.totalDurationSec;
export const EP09_DURATION_FRAMES = Math.ceil(EP09_DURATION_SEC * EP09_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP09_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP09_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
