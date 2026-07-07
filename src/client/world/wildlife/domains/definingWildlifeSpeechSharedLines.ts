/**
 * Shared vocalization pools by behavior context (merged with species lines).
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
  neutral: ['Hmm', '...', 'Huh?'],
  friendly: [
    'Mmm-hmm',
    'Heh heh',
    'Mmm',
    'Ahh',
    'Ooh!',
    'Hummm',
    'Phew',
  ],
  eating: [
    'Munch munch',
    'Chew chew',
    'Nom nom nom',
    'Num num',
    'Nibble nibble',
    'Crunch',
    'Cromch',
    'Smack',
    'Mmm mmm',
    'Yum yum',
    'Squish',
    'Sip',
    'Gulp',
    'Glug glug',
    'Chomp',
    'Crackle',
    'Monch',
  ],
  flee: ['Eek!', 'Ah!', 'Yipe!', 'Run!'],
  chase: ['GRRR!', 'Snarl!', 'Raaa!', 'Get em!'],
  attack: [
    'SNARL!',
    'CHOMP!',
    'RIP!',
    'SNAP!',
    'CRUSH!',
    'GNASH!',
    'TEAR!',
    'GROWL!',
    'GRRR!',
  ],
  warn: ['GRRR!', 'Back off!', 'Stay back!', 'Hey!', 'Snort!'],
  eatingAggressive: [
    'RIP',
    'SHRED',
    'SNAP',
    'CRUSH',
    'GNASH',
    'TEAR',
    'CHOMP CHOMP',
    'WOLF',
    'Mangle',
    'Savage',
    'Gouge',
    'Gobble',
    'GROWL',
    'SNARL',
    'Gnar gnar',
    'Crunch-mash',
    'Slobber',
    'Guzzle',
  ],
  sleep: [],
};
