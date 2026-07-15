/**
 * Wildlife meat catalog rows derived from fishing catch creatures.
 * Keeps aquatic food on the same meat lookup / cook / inspect path as land meats
 * without registering swimming wildlife species.
 *
 * @module components/world/wildlife/domains/definingWildlifeFishMeatCatalog
 */

import { listingWorldPlazaFishingCatchCreatures } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import type { DefiningWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';

/** Fish catch ids treated as wildlife meat species ids. */
export const DEFINING_WILDLIFE_FISH_MEAT_CATALOG: readonly DefiningWildlifeMeatCatalogEntry[] =
  listingWorldPlazaFishingCatchCreatures().map((entry) => ({
    speciesId: entry.catchId,
    rawItemTypeId: entry.rawItemTypeId,
    cookedItemTypeId: entry.cookedItemTypeId,
    rawDisplayName: entry.rawDisplayName,
    cookedDisplayName: entry.cookedDisplayName,
    rawHungerRestoreRatio: entry.rawHungerRestoreRatio,
    cookedHungerRestoreRatio: entry.cookedHungerRestoreRatio,
    lootQuantity: 0,
    cookDurationMs: entry.cookDurationMs,
    rawDiseaseId: entry.rawDiseaseId ?? 'salmonellosis',
    rawDiseaseChance: entry.rawDiseaseChance ?? 0,
    cookedWellFedBuffId: entry.cookedWellFedBuffId ?? 'well-fed-comfort-buff',
    cookedWellFedChance: entry.cookedWellFedChance ?? 0,
  }));

const FISH_MEAT_SPECIES_IDS = new Set(
  DEFINING_WILDLIFE_FISH_MEAT_CATALOG.map((entry) => entry.speciesId)
);

/** True when species id is a fishing catch creature, not a land wildlife spawn. */
export function checkingWildlifeFishMeatSpeciesId(speciesId: string): boolean {
  return FISH_MEAT_SPECIES_IDS.has(speciesId);
}
