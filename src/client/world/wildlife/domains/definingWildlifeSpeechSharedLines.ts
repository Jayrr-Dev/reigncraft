/**
 * Shared vocalization pools by behavior context (merged with species lines).
 *
 * Animal sounds only: elongated vowels, growls, and comic onomatopoeia.
 * No human words or phrases.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeechSharedLines
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';

/** Generic lines any species may fall back to when its registry slot is empty. */
export const DEFINING_WILDLIFE_SPEECH_SHARED_LINES: Record<
  DefiningWildlifeSpeechContextKind,
  readonly DefiningWildlifeSpeechLine[]
> = {
  neutral: ['Mmm...', 'Hrrm?', 'Snf snf'],
  friendly: ['Mmmm~', 'Mmmmmm', 'Hummm~', 'Ahhh~', 'Ooo~'],
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
  ],
  flee: ['EeeeEE!', 'Aaaah!', 'Skree!', 'Yiii!'],
  chase: ['GRRRRR!', 'Raaa!', 'RAAWR!', 'Skree!'],
  attack: [
    'GRRRRR!',
    'RAAWR!',
    'KRRRKK!',
    'SNAAAP!',
    'CHOMP!',
    'GNRRR!',
    'KRAAASH!',
  ],
  warn: ['GRRRRR!', 'HsssSSS!', 'RAAWR!', 'Snffft!'],
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
  ],
  howl: ['Awooooo!', 'AWOOOOO!', 'Awooo...'],
};
