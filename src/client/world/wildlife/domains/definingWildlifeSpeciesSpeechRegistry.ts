/**
 * Per-species vocalization lines grouped by behavior speech context.
 *
 * Species lines are merged with shared pools in resolvingWildlifeSpeciesSpeechLines.
 * Text color is fixed per context tone (white / light blue / red).
 * All lines are animal vocalizations only (no human words).
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
import { DEFINING_WILDLIFE_SPEECH_SHARED_LINES } from '@/components/world/wildlife/domains/definingWildlifeSpeechSharedLines';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSpeciesSpeechLines = Record<
  DefiningWildlifeSpeechContextKind,
  readonly DefiningWildlifeSpeechLine[]
>;

const DEFINING_WILDLIFE_EMPTY_SPEECH_LINES: DefiningWildlifeSpeciesSpeechLines =
  {
    neutral: [],
    friendly: [],
    eating: [],
    flee: [],
    chase: [],
    attack: [],
    warn: [],
    eatingAggressive: [],
    sleep: [],
    stalk: [],
  };

function buildingWildlifeSpeciesSpeechLines(
  partial: Partial<DefiningWildlifeSpeciesSpeechLines>
): DefiningWildlifeSpeciesSpeechLines {
  return {
    ...DEFINING_WILDLIFE_EMPTY_SPEECH_LINES,
    ...partial,
  };
}

/** Shared Zzz lines shown above sleeping animals. */
export const DEFINING_WILDLIFE_SLEEP_SPEECH_LINES: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'Zzz...',
      style: { bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    {
      text: 'Zzzzz',
      style: { bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    { text: 'zzZ', style: { fontSizePx: 10, bubbleAnimation: 'pulse' } },
  ];

const DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesSpeechLines
> = {
  cow: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Moo', 'Mooo...'],
    friendly: ['Mooo~', 'Mmmmmm', 'MoooOOOOoooo'],
    eating: [
      'Mooo~',
      'mmmMMMmm',
      'mnch mnch',
      'crrnch',
      'MoooOOOOoooo',
      'glrp~',
      'mnch-mnch-mnch',
    ],
    flee: ['MoooOOO!', 'Moooo!'],
  }),
  sheep: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Baa', 'Meh'],
    friendly: ['Baaa~', 'Mmmmmm', 'BaaaAAaa'],
    eating: ['Baaa~', 'mnch mnch', 'crrnch', 'nmm-nmm-nmm', 'Baaa baaa'],
    flee: ['BaaaAH!', 'Baaa!'],
  }),
  chicken: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Cluck', 'Bawk'],
    friendly: ['Cluck cluck', 'Bawk bawk', 'Bok bok~'],
    eating: ['Tktkt kt', 'tkt-tkt', 'crrnch', 'mnch mnch', 'bok bok~'],
    flee: ['SKWAAAWK!', 'Bawk!'],
    chase: ['SKWAAAWK!', 'BWAAAK!'],
    attack: ['BWAAAK!', 'SKWAAAK!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['SKWAAAWK!', 'BWAAAK!'],
  }),
  deer: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Snort'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'nmm-nmm-nmm', 'snff snff'],
    flee: ['Snort!', 'Skree!', 'EeeeEE!'],
  }),
  zebra: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Hrrm?'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch-crrnch', 'mnch-mnch', 'glrp~'],
    flee: ['Snort!', 'Skree!'],
  }),
  boar: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Oink', 'Grunt'],
    friendly: ['Oiiiink~', 'Mmmmmm', 'Grunt grunt~'],
    eating: ['Oink oink', 'mnch mnch', 'smkk smkk', 'glrp glrp', 'snff snff'],
    flee: ['Oink!', 'Skree!'],
    chase: ['Grunt!', 'GRRRR!', 'Snort!'],
    attack: ['CHOMP!', 'GRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['Grunt!', 'GRRRRR!', 'Snort!'],
    eatingAggressive: ['gnaw gnaw', 'GRRRR grrrr', 'slrrrp', 'KRRRKK'],
  }),
  'brown-bear': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Grunt'],
    friendly: ['Mmmm~', 'Ahhh~', 'Hummm~'],
    eating: ['mnch mnch', 'smkk smkk', 'mmmMMMmm', 'slrp slrp', 'glrp~'],
    flee: ['GRRR!', 'Aaaah!'],
    chase: ['GRRRR!', 'RAAWR!', 'Snort!'],
    attack: ['RAAWR!', 'CHOMP!', 'KRRRKK!', 'GRRRRR!'],
    warn: ['GRRRRR!', 'RAAWR!', 'Huff huff!'],
    eatingAggressive: ['KRRRKK', 'GRRRROWL', 'gnaw gnaw', 'KRAAASH', 'slrrrp'],
  }),
  'grey-wolf': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: ['sniff', 'Snf snf', 'rrr', 'Rrr...', '...', '.....', 'hff', 'snff'],
    chase: ['GRRR!', 'Awooooo!', 'Snort!'],
    attack: ['GRRRRR!', 'KRRRKK!', 'SNAAAP!', 'GNRRR!'],
    warn: ['GRRRRR!', 'Awooooo!'],
    eatingAggressive: ['gnaw gnaw', 'GRRRR grrrr', 'KRRRKK', 'slrrrp'],
  }),
  lion: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['RAAWR!', 'GRRRRR!', 'RoooAAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
  }),
  lioness: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['RAAWR!', 'GRRRRR!', 'RoooAAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
  }),
  crocodile: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hsss'],
    eating: ['CHOMP', 'glrp~', 'crrnch'],
    chase: ['HsssSSS!', 'SNAAAP!', 'KRRRKK!'],
    attack: ['SNAAAP!', 'KRRRKK!', 'GRRRRR!', 'CHOMP!'],
    warn: ['HsssSSS!', 'GRRRRR!', 'HsssSSSsss!'],
    eatingAggressive: [
      'SNAAAP',
      'KRRRKK',
      'thrash thrash',
      'gnaw gnaw',
      'GRRRR grrrr',
    ],
  }),
};

/**
 * Returns vocalization lines for a species and context, merged with shared fallbacks.
 */
export function resolvingWildlifeSpeciesSpeechLines(
  speciesId: DefiningWildlifeSpeciesId,
  context: DefiningWildlifeSpeechContextKind
): readonly DefiningWildlifeSpeechLine[] {
  if (context === 'sleep') {
    return DEFINING_WILDLIFE_SLEEP_SPEECH_LINES;
  }

  const speciesLines =
    DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY[speciesId]?.[context] ?? [];
  const sharedLines = DEFINING_WILDLIFE_SPEECH_SHARED_LINES[context] ?? [];

  if (speciesLines.length === 0) {
    return sharedLines;
  }

  if (sharedLines.length === 0) {
    return speciesLines;
  }

  return [...speciesLines, ...sharedLines];
}
