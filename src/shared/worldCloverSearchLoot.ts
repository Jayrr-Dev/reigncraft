/**
 * Clover loot rolls when a player searches a long-grass clump.
 *
 * @module shared/worldCloverSearchLoot
 */

export type WorldCloverSearchLootKind = 'three_leaf' | 'four_leaf';

export type WorldCloverSearchLootEntry = {
  readonly itemKind: WorldCloverSearchLootKind;
  readonly weight: number;
};

/** Weighted clover table (total weight 100). */
export const WORLD_CLOVER_SEARCH_LOOT_REGISTRY: readonly WorldCloverSearchLootEntry[] =
  [
    { itemKind: 'three_leaf', weight: 99 },
    { itemKind: 'four_leaf', weight: 1 },
  ];

export const WORLD_CLOVER_SEARCH_LOOT_TOTAL_WEIGHT =
  WORLD_CLOVER_SEARCH_LOOT_REGISTRY.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

/** Quantity granted per successful search. */
export const WORLD_CLOVER_SEARCH_LOOT_QUANTITY = 1;

/** Seed salt for loot roll (distinct from grass placement). */
export const WORLD_CLOVER_SEARCH_LOOT_SEED_SALT = 331;

/**
 * Deterministic unit float in [0, 1) from tile coordinates and salt.
 */
export function seedingWorldCloverSearchLootUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number = WORLD_CLOVER_SEARCH_LOOT_SEED_SALT
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * Rolls clover loot kind from a seeded unit float.
 */
export function resolvingWorldCloverSearchLootKindFromUnit(
  unitFloat: number
): WorldCloverSearchLootKind {
  const target = unitFloat * WORLD_CLOVER_SEARCH_LOOT_TOTAL_WEIGHT;
  let cumulative = 0;

  for (const entry of WORLD_CLOVER_SEARCH_LOOT_REGISTRY) {
    cumulative += entry.weight;

    if (target < cumulative) {
      return entry.itemKind;
    }
  }

  return WORLD_CLOVER_SEARCH_LOOT_REGISTRY.at(-1)?.itemKind ?? 'three_leaf';
}

/**
 * Resolves clover loot kind for one long-grass tile.
 */
export function resolvingWorldCloverSearchLootKindAtTileIndex(
  tileX: number,
  tileY: number
): WorldCloverSearchLootKind {
  return resolvingWorldCloverSearchLootKindFromUnit(
    seedingWorldCloverSearchLootUnitFromTileIndex(tileX, tileY)
  );
}
