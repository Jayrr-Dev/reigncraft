/**
 * Fishing catch balance: rarity weights and cook timing.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingCatchConstants
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

/**
 * Relative pick weights by rarity.
 * Common and rare are already cut by 1/3 from the first draft (50→33, 14→9).
 */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_WEIGHT_BY_RARITY: Record<
  DefiningWorldPlazaInventoryItemRarity,
  number
> = {
  basic: 33,
  common: 33,
  uncommon: 28,
  rare: 9,
  epic: 6,
  legendary: 2,
};

/** Default campfire cook channel for common fish (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_COOK_DURATION_MS_BY_RARITY: Record<
  DefiningWorldPlazaInventoryItemRarity,
  number
> = {
  basic: 2_000,
  common: 2_000,
  uncommon: 2_200,
  rare: 2_500,
  epic: 2_800,
  legendary: 3_200,
};

/** Carry weight for most catch and junk items. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_DEFAULT_CARRY_WEIGHT = 1.5;
