/**
 * Bestiary guide rows for fishing catch species.
 *
 * @module components/home/domains/definingPlazaBestiaryFishGuideEntries
 */

import type { DefiningPlazaBestiaryGuideEntry } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import { listingWorldPlazaFishingCatchCreatures } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';

function formattingFishDisplayName(rawDisplayName: string): string {
  return rawDisplayName.replace(/^Raw\s+/u, '');
}

/** Bestiary cards for every fishing catch creature. */
export const DEFINING_PLAZA_BESTIARY_FISH_GUIDE_ENTRIES: readonly DefiningPlazaBestiaryGuideEntry[] =
  listingWorldPlazaFishingCatchCreatures().map((creature) => {
    const name = formattingFishDisplayName(creature.rawDisplayName);
    const waterLabel = creature.waterKinds.join(', ');

    return {
      speciesId: creature.catchId,
      icon: 'mdi:fishing',
      summary: `${name}. Caught from ${waterLabel} water with a fishing rod.`,
      studiedSummary: `${name} lives in ${waterLabel}. Reel one in to log a sighting; cook the catch for safer eating.`,
    };
  });
