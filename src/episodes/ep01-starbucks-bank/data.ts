import type {CaptionPhrase} from '../../components/primitives/KineticCaptions';
import type {MoodTone} from '../../theme/tokens';

export const EP01_DURATION_SEC = 52;
export const EP01_FPS = 60;
export const EP01_DURATION_FRAMES = EP01_DURATION_SEC * EP01_FPS; // 3,120 frames

export interface SceneBeatMeta {
  id: string;
  startSec: number;
  endSec: number;
  sectionLabel: string;
  mood: MoodTone;
}

export const EP01_SCENES: SceneBeatMeta[] = [
  {
    id: 'hero-morph',
    startSec: 0,
    endSec: 3.2,
    sectionLabel: '01 / SHADOW LEDGER',
    mood: 'emerald',
  },
  {
    id: 'bank-comparison',
    startSec: 3.2,
    endSec: 11.2,
    sectionLabel: '02 / DEPOSIT SCALE',
    mood: 'emerald',
  },
  {
    id: 'reload-trap',
    startSec: 11.2,
    endSec: 20.2,
    sectionLabel: '03 / RELOAD FRICTION',
    mood: 'amber',
  },
  {
    id: 'system-flow',
    startSec: 20.2,
    endSec: 31.2,
    sectionLabel: '04 / LEGAL LOOPHOLE',
    mood: 'crimson',
  },
  {
    id: 'breakage-profit',
    startSec: 31.2,
    endSec: 44.0,
    sectionLabel: '05 / PURE BREAKAGE',
    mood: 'crimson',
  },
  {
    id: 'loop-outro',
    startSec: 44.0,
    endSec: 52.0,
    sectionLabel: '06 / FREE FLOAT',
    mood: 'amber',
  },
];

export const EP01_CAPTIONS: CaptionPhrase[] = [
  // Beat 1: 0.0s - 3.2s
  {
    startSec: 0.0,
    endSec: 1.55,
    words: [
      {text: 'Starbucks'},
      {text: "isn't"},
      {text: 'a'},
      {text: 'coffee'},
      {text: 'company'},
      {text: 'anymore—'},
    ],
  },
  {
    startSec: 1.55,
    endSec: 3.2,
    words: [
      {text: "it's"},
      {text: 'an'},
      {text: 'unregulated', tone: 'amber'},
      {text: 'bank', tone: 'emerald'},
      {text: 'holding'},
      {text: '$1.8B', tone: 'emerald'},
      {text: 'cash.'},
    ],
  },

  // Beat 2: 3.2s - 11.2s
  {
    startSec: 3.2,
    endSec: 6.9,
    words: [
      {text: 'Right'},
      {text: 'now,'},
      {text: 'customers'},
      {text: 'keep'},
      {text: 'more'},
      {text: 'money', tone: 'emerald'},
      {text: 'inside'},
      {text: 'the'},
      {text: 'Starbucks'},
      {text: 'app'},
    ],
  },
  {
    startSec: 6.9,
    endSec: 11.2,
    words: [
      {text: 'than'},
      {text: '85%', tone: 'emerald'},
      {text: 'of'},
      {text: 'American'},
      {text: 'regional'},
      {text: 'banks'},
      {text: 'hold'},
      {text: 'in'},
      {text: 'deposits.'},
    ],
  },

  // Beat 3: 11.2s - 20.2s
  {
    startSec: 11.2,
    endSec: 15.8,
    words: [
      {text: "Here's"},
      {text: 'the'},
      {text: 'trap:', tone: 'amber'},
      {text: 'the'},
      {text: 'app'},
      {text: 'nudges'},
      {text: 'preset'},
      {text: 'reloads'},
      {text: 'of'},
      {text: '$10, $25, or $50—', tone: 'emerald'},
    ],
  },
  {
    startSec: 15.8,
    endSec: 20.2,
    words: [
      {text: 'never'},
      {text: 'the'},
      {text: 'exact'},
      {text: 'price'},
      {text: 'of'},
      {text: 'a'},
      {text: 'latte,'},
      {text: 'trapping', tone: 'amber'},
      {text: 'leftover'},
      {text: 'change.'},
    ],
  },

  // Beat 4: 20.2s - 31.2s
  {
    startSec: 20.2,
    endSec: 25.4,
    words: [
      {text: 'Because'},
      {text: 'that'},
      {text: 'balance'},
      {text: 'only'},
      {text: 'buys'},
      {text: 'coffee,'},
      {text: 'banking', tone: 'crimson'},
      {text: 'laws', tone: 'crimson'},
      {text: "don't"},
      {text: 'apply.'},
    ],
  },
  {
    startSec: 25.4,
    endSec: 31.2,
    words: [
      {text: 'Zero', tone: 'crimson'},
      {text: 'withdrawals.'},
      {text: '0.00%', tone: 'crimson'},
      {text: 'interest—'},
      {text: 'funding'},
      {text: 'new'},
      {text: 'stores'},
      {text: 'for'},
      {text: 'free.', tone: 'emerald'},
    ],
  },

  // Beat 5: 31.2s - 44.0s
  {
    startSec: 31.2,
    endSec: 37.6,
    words: [
      {text: 'Even'},
      {text: 'wilder?'},
      {text: 'Every'},
      {text: 'year,'},
      {text: 'nearly'},
      {text: '$200M', tone: 'crimson'},
      {text: 'on'},
      {text: 'forgotten'},
      {text: 'cards'},
    ],
  },
  {
    startSec: 37.6,
    endSec: 44.0,
    words: [
      {text: 'is'},
      {text: 'never'},
      {text: 'redeemed—'},
      {text: 'turning'},
      {text: 'straight'},
      {text: 'into'},
      {text: '100%', tone: 'emerald'},
      {text: 'pure', tone: 'emerald'},
      {text: 'profit.', tone: 'emerald'},
    ],
  },

  // Beat 6: 44.0s - 52.0s (Seamless loop bridge)
  {
    startSec: 44.0,
    endSec: 48.3,
    words: [
      {text: 'You'},
      {text: 'chase'},
      {text: 'gold', tone: 'amber'},
      {text: 'stars', tone: 'amber'},
      {text: 'for'},
      {text: 'a'},
      {text: '$6'},
      {text: 'drink,'},
    ],
  },
  {
    startSec: 48.3,
    endSec: 52.0,
    words: [
      {text: 'while'},
      {text: 'handing'},
      {text: 'Wall'},
      {text: 'Street'},
      {text: 'a'},
      {text: 'free', tone: 'amber'},
      {text: 'loan—', tone: 'amber'},
      {text: 'which'},
      {text: 'is'},
      {text: 'why...'},
    ],
  },
];
