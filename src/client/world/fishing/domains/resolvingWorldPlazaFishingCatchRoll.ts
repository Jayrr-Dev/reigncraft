/**
 * Weighted fishing catch roll for one water tile context.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCatchRoll
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWaterKind } from '@/components/world/domains/definingWorldPlazaWaterKind';
import { DEFINING_WORLD_PLAZA_FISHING_CATCH_WEIGHT_BY_RARITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchConstants';
import {
  DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG,
  type DefiningWorldPlazaFishingCatchCatalogEntry,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';

export type ResolvingWorldPlazaFishingCatchRollContext = {
  readonly waterKind: DefiningWorldPlazaWaterKind;
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
};

/**
 * Lists catalog entries eligible for the water kind and biome.
 */
export function listingWorldPlazaFishingCatchEntriesForContext(
  context: ResolvingWorldPlazaFishingCatchRollContext
): readonly DefiningWorldPlazaFishingCatchCatalogEntry[] {
  return DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG.filter((entry) => {
    if (!entry.waterKinds.includes(context.waterKind)) {
      return false;
    }

    if (entry.biomeKinds && entry.biomeKinds.length > 0) {
      return entry.biomeKinds.includes(context.biomeKind);
    }

    return true;
  });
}

/**
 * Picks one catch using rarity weights. Falls back to first eligible entry.
 */
export function resolvingWorldPlazaFishingCatchRoll(
  context: ResolvingWorldPlazaFishingCatchRollContext,
  randomUnit: () => number = Math.random
): DefiningWorldPlazaFishingCatchCatalogEntry | null {
  const eligible = listingWorldPlazaFishingCatchEntriesForContext(context);

  if (eligible.length === 0) {
    return null;
  }

  let totalWeight = 0;

  for (const entry of eligible) {
    totalWeight += DEFINING_WORLD_PLAZA_FISHING_CATCH_WEIGHT_BY_RARITY[entry.rarity];
  }

  if (totalWeight <= 0) {
    return eligible[0] ?? null;
  }

  let ticket = randomUnit() * totalWeight;

  for (const entry of eligible) {
    ticket -= DEFINING_WORLD_PLAZA_FISHING_CATCH_WEIGHT_BY_RARITY[entry.rarity];

    if (ticket <= 0) {
      return entry;
    }
  }

  return eligible[eligible.length - 1] ?? null;
}

/**
 * Inventory grant id + player-facing name for a rolled catch.
 */
export function resolvingWorldPlazaFishingCatchGrant(
  entry: DefiningWorldPlazaFishingCatchCatalogEntry
): { readonly itemTypeId: string; readonly displayName: string } {
  if (entry.kind === 'junk') {
    return {
      itemTypeId: entry.itemTypeId,
      displayName: entry.displayName,
    };
  }

  return {
    itemTypeId: entry.rawItemTypeId,
    displayName: entry.rawDisplayName.replace(/^Raw\s+/u, ''),
  };
}
