/**
 * Per-species vocalization lines grouped by speech context.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSpeciesSpeechLines = Record<
  DefiningWildlifeSpeechContextKind,
  readonly string[]
>;

const DEFINING_WILDLIFE_EMPTY_SPEECH_LINES: DefiningWildlifeSpeciesSpeechLines =
  {
    passive: [],
    flee: [],
    aggro: [],
  };

const DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesSpeechLines
> = {
  cow: {
    passive: ['Moo', 'Mmm'],
    flee: ['Moo!'],
    aggro: [],
  },
  sheep: {
    passive: ['Baa', 'Meh'],
    flee: ['Baa!'],
    aggro: [],
  },
  chicken: {
    passive: ['Cluck', 'Bawk'],
    flee: ['Squawk!'],
    aggro: ['BWAK!'],
  },
  deer: {
    passive: [],
    flee: ['Snort!'],
    aggro: [],
  },
  zebra: {
    passive: [],
    flee: ['Snort!'],
    aggro: [],
  },
  boar: {
    passive: [],
    flee: ['Oink!'],
    aggro: ['Grunt!', 'Grr!'],
  },
  'brown-bear': {
    passive: [],
    flee: ['Grr!'],
    aggro: ['Grunt!', 'Grr!'],
  },
  'grey-wolf': {
    passive: [],
    flee: [],
    aggro: ['Grr', 'Awooo'],
  },
  lion: {
    passive: [],
    flee: [],
    aggro: ['Roar!', 'Grrr'],
  },
  lioness: {
    passive: [],
    flee: [],
    aggro: ['Roar!', 'Grrr'],
  },
  crocodile: {
    passive: [],
    flee: [],
    aggro: ['Hiss!'],
  },
};

/**
 * Returns vocalization lines for a species and context, or an empty list.
 */
export function resolvingWildlifeSpeciesSpeechLines(
  speciesId: DefiningWildlifeSpeciesId,
  context: DefiningWildlifeSpeechContextKind
): readonly string[] {
  const lines =
    DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY[speciesId] ??
    DEFINING_WILDLIFE_EMPTY_SPEECH_LINES;

  return lines[context];
}
