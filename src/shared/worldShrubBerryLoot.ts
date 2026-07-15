/**
 * Berry and leaf loot rolls when a player picks a berry shrub.
 *
 * @module shared/worldShrubBerryLoot
 */

export type WorldShrubBerryLootKind =
  | 'red_berry'
  | 'blue_berry'
  | 'golden_berry'
  | 'tea_leaves'
  | 'cranberry'
  | 'blackberry'
  | 'raspberry'
  | 'bilberry'
  | 'juniper_berry'
  | 'sea_buckthorn'
  | 'yew_aril'
  | 'wolfberry'
  | 'lotus_fruit'
  | 'nettle'
  | 'lemon_balm'
  | 'sage'
  | 'mugwort'
  | 'bay_laurel'
  | 'holly_leaf'
  | 'mistletoe'
  | 'olive_leaf'
  | 'moly';

export type WorldShrubBerryLootEntry = {
  readonly itemKind: WorldShrubBerryLootKind;
  readonly weight: number;
};

/** Weighted shrub forage table (total weight 922). */
export const WORLD_SHRUB_BERRY_LOOT_REGISTRY: readonly WorldShrubBerryLootEntry[] =
  [
    { itemKind: 'red_berry', weight: 350 },
    { itemKind: 'blue_berry', weight: 110 },
    { itemKind: 'golden_berry', weight: 22 },
    { itemKind: 'tea_leaves', weight: 95 },
    { itemKind: 'cranberry', weight: 40 },
    { itemKind: 'blackberry', weight: 40 },
    { itemKind: 'raspberry', weight: 40 },
    { itemKind: 'bilberry', weight: 18 },
    { itemKind: 'juniper_berry', weight: 18 },
    { itemKind: 'sea_buckthorn', weight: 8 },
    { itemKind: 'yew_aril', weight: 5 },
    { itemKind: 'wolfberry', weight: 3 },
    { itemKind: 'lotus_fruit', weight: 2 },
    { itemKind: 'nettle', weight: 40 },
    { itemKind: 'lemon_balm', weight: 40 },
    { itemKind: 'sage', weight: 40 },
    { itemKind: 'mugwort', weight: 18 },
    { itemKind: 'bay_laurel', weight: 18 },
    { itemKind: 'holly_leaf', weight: 8 },
    { itemKind: 'mistletoe', weight: 5 },
    { itemKind: 'olive_leaf', weight: 3 },
    { itemKind: 'moly', weight: 2 },
  ];

export const WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT =
  WORLD_SHRUB_BERRY_LOOT_REGISTRY.reduce((sum, entry) => sum + entry.weight, 0);

/** Quantity granted per successful pick. */
export const WORLD_SHRUB_BERRY_LOOT_QUANTITY = 1;

/** Seed salt for loot roll (distinct from shrub placement). */
export const WORLD_SHRUB_BERRY_LOOT_SEED_SALT = 431;

/**
 * Deterministic unit float in [0, 1) from tile coordinates and salt.
 */
export function seedingWorldShrubBerryLootUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number = WORLD_SHRUB_BERRY_LOOT_SEED_SALT
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * Rolls berry loot kind from a seeded unit float.
 */
export function resolvingWorldShrubBerryLootKindFromUnit(
  unitFloat: number
): WorldShrubBerryLootKind {
  const target = unitFloat * WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT;
  let cumulative = 0;

  for (const entry of WORLD_SHRUB_BERRY_LOOT_REGISTRY) {
    cumulative += entry.weight;

    if (target < cumulative) {
      return entry.itemKind;
    }
  }

  return WORLD_SHRUB_BERRY_LOOT_REGISTRY.at(-1)?.itemKind ?? 'red_berry';
}

/**
 * Resolves berry loot kind for one shrub tile.
 */
export function resolvingWorldShrubBerryLootKindAtTileIndex(
  tileX: number,
  tileY: number
): WorldShrubBerryLootKind {
  return resolvingWorldShrubBerryLootKindFromUnit(
    seedingWorldShrubBerryLootUnitFromTileIndex(tileX, tileY)
  );
}
