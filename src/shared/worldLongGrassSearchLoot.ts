/**
 * Weighted long-grass search loot (craft materials + clovers).
 *
 * @module shared/worldLongGrassSearchLoot
 */

import type { WorldCloverSearchLootKind } from './worldCloverSearchLoot';

/** Loot rarity ladder used by the long-grass search table. */
export type WorldLongGrassSearchLootRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'very_rare';

/** Non-clover craft materials found in long grass. */
export type WorldLongGrassSearchMaterialLootKind =
  | 'thatch_bundle'
  | 'grass_fiber'
  | 'soft_down'
  | 'chirper_shell'
  | 'meadow_mite_husk'
  | 'wild_oat_head'
  | 'knotweed_stem'
  | 'dew_caught_seed'
  | 'lost_stitch_scrap'
  | 'field_snail_trail'
  | 'burrow_fluff'
  | 'rusted_clasp';

/** Full long-grass search loot kind (materials + clovers). */
export type WorldLongGrassSearchLootKind =
  | WorldLongGrassSearchMaterialLootKind
  | WorldCloverSearchLootKind;

export type WorldLongGrassSearchLootEntry = {
  readonly itemKind: WorldLongGrassSearchLootKind;
  readonly rarity: WorldLongGrassSearchLootRarity;
  /** Optional weight override; defaults to rarity base weight. */
  readonly weight?: number;
};

/**
 * Base roll weight per rarity tier (relative odds inside one search).
 * very_rare defaults to 1; four-leaf uses an explicit override for ~1% rate.
 */
export const WORLD_LONG_GRASS_SEARCH_RARITY_WEIGHT: Readonly<
  Record<WorldLongGrassSearchLootRarity, number>
> = {
  common: 32,
  uncommon: 12,
  rare: 4,
  very_rare: 1,
};

/**
 * Weighted long-grass search table.
 * Order matches inventory tall-grass sprite sheet (materials), then clovers.
 */
export const WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY: readonly WorldLongGrassSearchLootEntry[] =
  [
    { itemKind: 'thatch_bundle', rarity: 'common' },
    { itemKind: 'grass_fiber', rarity: 'common' },
    { itemKind: 'soft_down', rarity: 'common' },
    { itemKind: 'chirper_shell', rarity: 'uncommon' },
    { itemKind: 'meadow_mite_husk', rarity: 'rare' },
    { itemKind: 'wild_oat_head', rarity: 'common' },
    { itemKind: 'knotweed_stem', rarity: 'uncommon' },
    { itemKind: 'dew_caught_seed', rarity: 'uncommon' },
    { itemKind: 'lost_stitch_scrap', rarity: 'uncommon' },
    { itemKind: 'field_snail_trail', rarity: 'rare' },
    { itemKind: 'burrow_fluff', rarity: 'common' },
    { itemKind: 'rusted_clasp', rarity: 'rare' },
    { itemKind: 'three_leaf', rarity: 'common' },
    { itemKind: 'four_leaf', rarity: 'very_rare', weight: 3 },
  ];

export function resolvingWorldLongGrassSearchLootEntryWeight(
  entry: WorldLongGrassSearchLootEntry
): number {
  return entry.weight ?? WORLD_LONG_GRASS_SEARCH_RARITY_WEIGHT[entry.rarity];
}

export const WORLD_LONG_GRASS_SEARCH_LOOT_TOTAL_WEIGHT =
  WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY.reduce(
    (sum, entry) => sum + resolvingWorldLongGrassSearchLootEntryWeight(entry),
    0
  );

/** Quantity granted per successful search. */
export const WORLD_LONG_GRASS_SEARCH_LOOT_QUANTITY = 1;

/** Seed salt for loot roll (distinct from grass placement / legacy clover salt). */
export const WORLD_LONG_GRASS_SEARCH_LOOT_SEED_SALT = 337;

const WORLD_LONG_GRASS_SEARCH_CLOVER_KINDS =
  new Set<WorldLongGrassSearchLootKind>(['three_leaf', 'four_leaf']);

/**
 * True when the loot kind is a clover (herbarium / lucky-charm side effects).
 */
export function checkingWorldLongGrassSearchLootIsClover(
  itemKind: WorldLongGrassSearchLootKind
): itemKind is WorldCloverSearchLootKind {
  return WORLD_LONG_GRASS_SEARCH_CLOVER_KINDS.has(itemKind);
}

/**
 * Deterministic unit float in [0, 1) from tile coordinates and salt.
 */
export function seedingWorldLongGrassSearchLootUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number = WORLD_LONG_GRASS_SEARCH_LOOT_SEED_SALT
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * Rolls long-grass loot kind from a seeded unit float.
 */
export function resolvingWorldLongGrassSearchLootKindFromUnit(
  unitFloat: number
): WorldLongGrassSearchLootKind {
  const target = unitFloat * WORLD_LONG_GRASS_SEARCH_LOOT_TOTAL_WEIGHT;
  let cumulative = 0;

  for (const entry of WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY) {
    cumulative += resolvingWorldLongGrassSearchLootEntryWeight(entry);

    if (target < cumulative) {
      return entry.itemKind;
    }
  }

  return (
    WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY.at(-1)?.itemKind ?? 'thatch_bundle'
  );
}

/**
 * Resolves long-grass loot kind for one long-grass tile.
 */
export function resolvingWorldLongGrassSearchLootKindAtTileIndex(
  tileX: number,
  tileY: number
): WorldLongGrassSearchLootKind {
  return resolvingWorldLongGrassSearchLootKindFromUnit(
    seedingWorldLongGrassSearchLootUnitFromTileIndex(tileX, tileY)
  );
}
