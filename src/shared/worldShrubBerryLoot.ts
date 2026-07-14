/**
 * Berry loot rolls when a player picks a berry shrub.
 *
 * @module shared/worldShrubBerryLoot
 */

export type WorldShrubBerryLootKind = 'red_berry' | 'blue_berry' | 'golden_berry';

export type WorldShrubBerryLootEntry = {
  readonly itemKind: WorldShrubBerryLootKind;
  readonly weight: number;
};

/** Weighted berry table (total weight 100). */
export const WORLD_SHRUB_BERRY_LOOT_REGISTRY: readonly WorldShrubBerryLootEntry[] =
  [
    { itemKind: 'red_berry', weight: 70 },
    { itemKind: 'blue_berry', weight: 25 },
    { itemKind: 'golden_berry', weight: 5 },
  ];

export const WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT =
  WORLD_SHRUB_BERRY_LOOT_REGISTRY.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

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
