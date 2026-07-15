/**
 * Weighted fishing catch roll for one water tile context.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCatchRoll
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWaterKind } from '@/components/world/domains/definingWorldPlazaWaterKind';
import {
  DEFINING_WORLD_PLAZA_FISHING_CATCH_KIND_WEIGHT,
  DEFINING_WORLD_PLAZA_FISHING_CATCH_WEIGHT_BY_RARITY,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchConstants';
import {
  DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG,
  type DefiningWorldPlazaFishingCatchCatalogEntry,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';

export type ResolvingWorldPlazaFishingCatchRollContext = {
  readonly waterKind: DefiningWorldPlazaWaterKind;
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
};

type DefiningWorldPlazaFishingCatchKind =
  DefiningWorldPlazaFishingCatchCatalogEntry['kind'];

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

function rollingWeightedCatchKind(
  eligible: readonly DefiningWorldPlazaFishingCatchCatalogEntry[],
  randomUnit: () => number
): DefiningWorldPlazaFishingCatchKind {
  const hasCreature = eligible.some((entry) => entry.kind === 'creature');
  const hasJunk = eligible.some((entry) => entry.kind === 'junk');

  if (hasCreature && !hasJunk) {
    return 'creature';
  }

  if (hasJunk && !hasCreature) {
    return 'junk';
  }

  const creatureWeight = hasCreature
    ? DEFINING_WORLD_PLAZA_FISHING_CATCH_KIND_WEIGHT.creature
    : 0;
  const junkWeight = hasJunk
    ? DEFINING_WORLD_PLAZA_FISHING_CATCH_KIND_WEIGHT.junk
    : 0;
  const totalWeight = creatureWeight + junkWeight;

  if (totalWeight <= 0) {
    return 'creature';
  }

  let ticket = randomUnit() * totalWeight;
  ticket -= creatureWeight;

  return ticket <= 0 ? 'creature' : 'junk';
}

function rollingWeightedCatchFromPool(
  pool: readonly DefiningWorldPlazaFishingCatchCatalogEntry[],
  randomUnit: () => number
): DefiningWorldPlazaFishingCatchCatalogEntry | null {
  if (pool.length === 0) {
    return null;
  }

  let totalWeight = 0;

  for (const entry of pool) {
    totalWeight +=
      DEFINING_WORLD_PLAZA_FISHING_CATCH_WEIGHT_BY_RARITY[entry.rarity];
  }

  if (totalWeight <= 0) {
    return pool[0] ?? null;
  }

  let ticket = randomUnit() * totalWeight;

  for (const entry of pool) {
    ticket -= DEFINING_WORLD_PLAZA_FISHING_CATCH_WEIGHT_BY_RARITY[entry.rarity];

    if (ticket <= 0) {
      return entry;
    }
  }

  return pool[pool.length - 1] ?? null;
}

/**
 * Picks one catch: kind roll first (fish mostly), then rarity weight in pool.
 */
export function resolvingWorldPlazaFishingCatchRoll(
  context: ResolvingWorldPlazaFishingCatchRollContext,
  randomUnit: () => number = Math.random
): DefiningWorldPlazaFishingCatchCatalogEntry | null {
  const eligible = listingWorldPlazaFishingCatchEntriesForContext(context);

  if (eligible.length === 0) {
    return null;
  }

  const kind = rollingWeightedCatchKind(eligible, randomUnit);
  const pool = eligible.filter((entry) => entry.kind === kind);
  const rolledCatch = rollingWeightedCatchFromPool(pool, randomUnit);

  if (rolledCatch) {
    return rolledCatch;
  }

  return rollingWeightedCatchFromPool(eligible, randomUnit);
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
