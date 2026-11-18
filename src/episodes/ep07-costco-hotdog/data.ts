import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';
import timings from './timings.json';

export const EP07_FPS = 60;
export const EP07_DURATION_SEC = timings.totalDurationSec;
export const EP07_DURATION_FRAMES = Math.ceil(EP07_DURATION_SEC * EP07_FPS);

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP07_SCENES: SceneBeatMeta[] = timings.scenes as SceneBeatMeta[];

export const EP07_CAPTIONS: CaptionPhrase[] = timings.captions as CaptionPhrase[];
