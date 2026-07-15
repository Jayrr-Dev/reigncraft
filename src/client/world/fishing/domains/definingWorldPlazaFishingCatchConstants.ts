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
  mythic: 4,
  legendary: 2,
  godly: 1,
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
  mythic: 3_000,
  legendary: 3_200,
  godly: 3_500,
};

/** Carry weight for most catch and junk items. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_DEFAULT_CARRY_WEIGHT = 1.5;

export type DefiningWorldPlazaFishingCastDurationRangeMs = {
  readonly minMs: number;
  readonly maxMs: number;
};

/**
 * Uniform cast channel range per rarity before rod tier / harvest speed.
 * Seconds: basic/common 1–10, uncommon 3–15, rare 6–20, epic 10–28,
 * mythic 14–35, legendary 18–45, godly 25–60.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_RANGE_MS_BY_RARITY: Record<
  DefiningWorldPlazaInventoryItemRarity,
  DefiningWorldPlazaFishingCastDurationRangeMs
> = {
  basic: { minMs: 1_000, maxMs: 10_000 },
  common: { minMs: 1_000, maxMs: 10_000 },
  uncommon: { minMs: 3_000, maxMs: 15_000 },
  rare: { minMs: 6_000, maxMs: 20_000 },
  epic: { minMs: 10_000, maxMs: 28_000 },
  mythic: { minMs: 14_000, maxMs: 35_000 },
  legendary: { minMs: 18_000, maxMs: 45_000 },
  godly: { minMs: 25_000, maxMs: 60_000 },
};

/** Relative pick weights for creature vs junk before rarity weighting. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_KIND_WEIGHT = {
  creature: 88,
  junk: 12,
} as const;
