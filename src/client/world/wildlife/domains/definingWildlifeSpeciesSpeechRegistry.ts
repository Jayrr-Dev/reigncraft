/**
 * Per-species vocalization lines grouped by behavior speech context.
 *
 * Species lines are merged with shared pools in resolvingWildlifeSpeciesSpeechLines.
 * Text color is fixed per context tone (white / light blue / red).
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import { DEFINING_WILDLIFE_SPEECH_SHARED_LINES } from '@/components/world/wildlife/domains/definingWildlifeSpeechSharedLines';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
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
    { text: 'Zzz...', style: { bubbleAnimation: 'pulse', animatedChar: 'last' } },
    { text: 'Zzzzz', style: { bubbleAnimation: 'pulse', animatedChar: 'last' } },
    { text: 'zzZ', style: { fontSizePx: 10, bubbleAnimation: 'pulse' } },
  ];

const DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesSpeechLines
> = {
  cow: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Moo', 'Hmm'],
    friendly: ['Moo', 'Mmm', 'Mmm-hmm', 'Heh heh', 'Hummm'],
    eating: [
      'Moo',
      'Munch munch',
      'Chew chew',
      'Nom nom nom',
      'Num num',
      'Cromch',
      'Monch',
      'Gulp',
    ],
    flee: ['Moo!', 'Ah!'],
  }),
  sheep: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Baa', 'Meh'],
    friendly: ['Baa', 'Mmm', 'Coos', 'Heh heh'],
    eating: [
      'Baa',
      'Nibble nibble',
      'Munch munch',
      'Chew chew',
      'Nom nom',
      'Crunch',
    ],
    flee: ['Baa!', 'Eek!'],
  }),
  chicken: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Cluck', 'Bawk'],
    friendly: ['Cluck', 'Bawk', 'Heh heh', 'Ooh!'],
    eating: [
      'Peck peck',
      'Peck',
      'Nibble nibble',
      'Crunch',
      'Peck crunch',
      'Nom nom',
    ],
    flee: ['Squawk!', 'Bawk!'],
    chase: ['Squawk!', 'BWAK!'],
    attack: ['PECK!', 'BWAK!', 'CHOMP!', 'SNAP!'],
    warn: ['Squawk!', 'Back off!'],
  }),
  deer: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort'],
    friendly: ['Mmm', 'Hummm'],
    eating: [
      'Nibble nibble',
      'Munch munch',
      'Crunch',
      'Chew chew',
      'Nom nom',
    ],
    flee: ['Snort!', 'Ah!', 'Eek!'],
  }),
  zebra: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort', 'Huh?'],
    friendly: ['Mmm-hmm', 'Hummm'],
    eating: [
      'Munch munch',
      'Crunch-crunch',
      'Chew chew',
      'Nom nom',
      'Monch',
    ],
    flee: ['Snort!', 'Eek!'],
  }),
  boar: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Oink', 'Grunt'],
    friendly: ['Oink', 'Mmm', 'Heh heh'],
    eating: [
      'Oink',
      'Chomp',
      'Smack',
      'Munch munch',
      'Squish',
      'Gobble',
      'Root root',
    ],
    flee: ['Oink!', 'Eek!'],
    chase: ['Grunt!', 'Grr!', 'Snort!'],
    attack: ['CHOMP!', 'Gouge!', 'SNARL!', 'TEAR!'],
    warn: ['Grunt!', 'Back off!', 'Snort!'],
    eatingAggressive: ['Gouge', 'Rip', 'Gobble', 'Savage', 'Mangle'],
  }),
  'brown-bear': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Grunt'],
    friendly: ['Mmm', 'Ahh', 'Hummm'],
    eating: [
      'Chomp',
      'Munch munch',
      'Smack',
      'Nom nom nom',
      'Slurp',
      'Gulp',
      'Yum yum',
    ],
    flee: ['Grr!', 'Ah!'],
    chase: ['Grr!', 'Roar!', 'Snarl!'],
    attack: ['CHOMP!', 'MAUL!', 'CRUSH!', 'SNARL!', 'TEAR!'],
    warn: ['GRRR!', 'Back off!', 'Roar!'],
    eatingAggressive: [
      'RIP',
      'SHRED',
      'Gouge',
      'GROWL',
      'Crunch-mash',
      'Guzzle',
    ],
  }),
  'grey-wolf': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    friendly: ['Heh heh', 'Mmm-hmm'],
    eating: ['Crunch', 'Gulp', 'Chew chew'],
    chase: ['Grr!', 'Awooo!', 'Snarl!'],
    attack: ['SNARL!', 'CHOMP!', 'RIP!', 'TEAR!', 'GNASH!'],
    warn: ['GRRR!', 'Back off!', 'Awooo!'],
    eatingAggressive: [
      'Gnar gnar',
      'Rip',
      'Shred',
      'Wolf',
      'Gobble',
      'GROWL',
    ],
  }),
  lion: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['Crunch', 'Gulp', 'Rip'],
    chase: ['Roar!', 'GRRR!', 'Raaa!'],
    attack: ['ROAR!', 'CHOMP!', 'RIP!', 'SNARL!', 'CRUSH!'],
    warn: ['Roar!', 'GRRR!', 'Stay back!'],
    eatingAggressive: [
      'RIP',
      'TEAR',
      'Savage',
      'GROWL',
      'Gnar gnar',
      'Guzzle',
    ],
  }),
  lioness: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['Crunch', 'Gulp', 'Rip'],
    chase: ['Roar!', 'GRRR!', 'Raaa!'],
    attack: ['ROAR!', 'CHOMP!', 'RIP!', 'SNARL!', 'CRUSH!'],
    warn: ['Roar!', 'GRRR!', 'Stay back!'],
    eatingAggressive: [
      'RIP',
      'TEAR',
      'Savage',
      'GROWL',
      'Gnar gnar',
      'Guzzle',
    ],
  }),
  crocodile: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hiss'],
    eating: ['Chomp', 'Gulp', 'Crunch'],
    chase: ['Hiss!', 'SNAP!', 'Lunge!'],
    attack: ['SNAP!', 'CRUSH!', 'DEATH ROLL!', 'CHOMP!', 'TEAR!'],
    warn: ['Hiss!', 'Stay back!', 'GRRR!'],
    eatingAggressive: [
      'SNAP',
      'CRUSH',
      'Death roll',
      'Rip',
      'Gobble',
      'GROWL',
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
