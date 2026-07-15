/**
 * Weighted catalog pick by mushroom rarity.
 *
 * @module components/world/mushrooms/domains/pickingWorldPlazaMushroomCatalogEntryByRarityWeight
 */

import type { DefiningWorldPlazaMushroomCatalogEntry } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import { DEFINING_WORLD_PLAZA_MUSHROOM_RARITY_SPAWN_WEIGHT } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpawnBalanceConstants';

/**
 * Picks one eligible entry using rarity weights. `unitRoll` is in [0, 1).
 */
export function pickingWorldPlazaMushroomCatalogEntryByRarityWeight(
  eligible: readonly DefiningWorldPlazaMushroomCatalogEntry[],
  unitRoll: number
): DefiningWorldPlazaMushroomCatalogEntry | null {
  if (eligible.length === 0) {
    return null;
  }

  if (eligible.length === 1) {
    return eligible[0] ?? null;
  }

  let totalWeight = 0;

  for (const entry of eligible) {
    totalWeight +=
      DEFINING_WORLD_PLAZA_MUSHROOM_RARITY_SPAWN_WEIGHT[entry.rarity];
  }

  if (!(totalWeight > 0)) {
    return eligible[0] ?? null;
  }

  const clampedRoll = Math.min(0.999999, Math.max(0, unitRoll));
  let cursor = clampedRoll * totalWeight;

  for (const entry of eligible) {
    const weight =
      DEFINING_WORLD_PLAZA_MUSHROOM_RARITY_SPAWN_WEIGHT[entry.rarity];

    if (cursor < weight) {
      return entry;
    }

    cursor -= weight;
  }

  return eligible[eligible.length - 1] ?? null;
}
