/**
 * Shared vocalization pools by behavior context (merged with species lines).
 *
 * Animal sounds only: elongated vowels, growls, and comic onomatopoeia.
 * No human words or phrases. A few longer playful stretchers sit in each
 * pool so every species rolls them only once in a while.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeechSharedLines
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';

/** Sparse long stretchers for calm contexts (keep count low so rolls stay rare). */
const DEFINING_WILDLIFE_SPEECH_SHARED_LONG_NEUTRAL: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'MMMMoooooooooo',
      style: { fontSizePx: 12, bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    {
      text: 'BaaaaAAAAAaaaa',
      style: { fontSizePx: 12, bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    {
      text: 'Snoooooooort...',
      style: { fontSizePx: 11, bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
  ];

/** Sparse long stretchers for friendly contexts. */
const DEFINING_WILDLIFE_SPEECH_SHARED_LONG_FRIENDLY: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'MmmmmmOOOOOoooo~',
      style: { fontSizePx: 12, bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    {
      text: 'Huuuuuummmmmm~',
      style: { fontSizePx: 11, bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
  ];

/** Sparse long stretchers for flee. */
const DEFINING_WILDLIFE_SPEECH_SHARED_LONG_FLEE: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'EeeeeEEEEEeeee!',
      style: {
        font: 'display',
        fontSizePx: 13,
        bubbleAnimation: 'shake',
        animatedChar: 'lastPunctuation',
      },
    },
    {
      text: 'AaaaaAAAAAah!',
      style: {
        font: 'display',
        fontSizePx: 13,
        bubbleAnimation: 'shake',
        animatedChar: 'lastPunctuation',
      },
    },
  ];

/** Sparse long stretchers for chase / attack / warn. */
const DEFINING_WILDLIFE_SPEECH_SHARED_LONG_AGGRO: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'GRRRRRRRRR!',
      style: {
        font: 'display',
        fontSizePx: 13,
        bubbleAnimation: 'shake',
        animatedChar: 'lastPunctuation',
      },
    },
    {
      text: 'SNOOOOOORT!',
      style: {
        font: 'display',
        fontSizePx: 13,
        bubbleAnimation: 'shake',
        animatedChar: 'lastPunctuation',
      },
    },
    {
      text: 'MMMMooooOOOO!',
      style: {
        font: 'display',
        fontSizePx: 13,
        bubbleAnimation: 'shake',
        animatedChar: 'lastPunctuation',
      },
    },
  ];

/** Sparse long howl stretchers. */
const DEFINING_WILDLIFE_SPEECH_SHARED_LONG_HOWL: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'Awooooooooo!',
      style: {
        fontSizePx: 13,
        bubbleAnimation: 'pulse',
        animatedChar: 'lastPunctuation',
      },
    },
    {
      text: 'AWOOOOOOOOO!',
      style: {
        font: 'display',
        fontSizePx: 14,
        bubbleAnimation: 'pulse',
        animatedChar: 'lastPunctuation',
      },
    },
  ];

/** Generic lines any species may fall back to when its registry slot is empty. */
export const DEFINING_WILDLIFE_SPEECH_SHARED_LINES: Record<
  DefiningWildlifeSpeechContextKind,
  readonly DefiningWildlifeSpeechLine[]
> = {
  neutral: [
    'Mmm...',
    'Hrrm?',
    'Snf snf',
    'Hff',
    'Prrt',
    'Hrmmm',
    'Snrt',
    ...DEFINING_WILDLIFE_SPEECH_SHARED_LONG_NEUTRAL,
  ],
  friendly: [
    'Mmmm~',
    'Mmmmmm',
    'Hummm~',
    'Ahhh~',
    'Ooo~',
    'Prrrr~',
    ...DEFINING_WILDLIFE_SPEECH_SHARED_LONG_FRIENDLY,
  ],
  eating: [
    'mmmMMMmm',
    'mnch mnch',
    'crrnch',
    'chrP chrP',
    'nmm-nmm-nmm',
    'glrp~',
    'slrp slrp',
    'smkk smkk',
    'mnch-mnch-mnch',
    'glug glug',
    'gulp~',
    'crrnch-crrnch',
    {
      text: 'mmmMMMMMmmmm~',
      style: { fontSizePx: 11, bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
  ],
  flee: [
    'EeeeEE!',
    'Aaaah!',
    'Skree!',
    'Yiii!',
    'Hnnn!',
    'Brrhh!',
    ...DEFINING_WILDLIFE_SPEECH_SHARED_LONG_FLEE,
  ],
  chase: [
    'GRRRRR!',
    'Raaa!',
    'RAAWR!',
    'Skree!',
    'Hrrgh!',
    ...DEFINING_WILDLIFE_SPEECH_SHARED_LONG_AGGRO,
  ],
  attack: [
    'GRRRRR!',
    'RAAWR!',
    'KRRRKK!',
    'SNAAAP!',
    'CHOMP!',
    'GNRRR!',
    'KRAAASH!',
    ...DEFINING_WILDLIFE_SPEECH_SHARED_LONG_AGGRO,
  ],
  warn: [
    'Snort!',
    'Grunting!',
    'Stomp!',
    'GRRRRR!',
    'HsssSSS!',
    'RAAWR!',
    'Snffft!',
    ...DEFINING_WILDLIFE_SPEECH_SHARED_LONG_AGGRO,
  ],
  eatingAggressive: [
    'KRRRKK',
    'GNRRR gnrrr',
    'CHOMP CHOMP',
    'RRRIP rrrp',
    'SLRRP slrrp',
    'GRRRROWL',
    'KRAAASH',
    'gnaw gnaw',
    'slrrrp',
    'GRRRR grrrr',
    {
      text: 'GRRRRRRROWL',
      style: {
        font: 'display',
        fontSizePx: 12,
        bubbleAnimation: 'shake',
      },
    },
  ],
  sleep: [],
  wake: [],
  stalk: [
    'sniff',
    'Snf snf',
    'rrr',
    'Rrr...',
    '...',
    '.....',
    'hff',
    'snff',
    'rrr...',
    {
      text: 'Rrrrrrrr...',
      style: { fontSizePx: 9, bubbleAnimation: 'pulse' },
    },
  ],
  howl: [
    'Awooooo!',
    'AWOOOOO!',
    'Awooo...',
    ...DEFINING_WILDLIFE_SPEECH_SHARED_LONG_HOWL,
  ],
};
