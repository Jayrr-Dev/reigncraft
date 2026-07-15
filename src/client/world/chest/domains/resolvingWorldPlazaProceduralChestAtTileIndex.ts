/**
 * Resolves a procedural locked chest placement at a tile, if any.
 *
 * @module components/world/chest/domains/resolvingWorldPlazaProceduralChestAtTileIndex
 */

import { computingWorldPlazaProceduralChestSeedUnitFromTileIndex } from '@/components/world/chest/domains/computingWorldPlazaProceduralChestSeedUnitFromTileIndex';
import type {
  DefiningWorldPlazaChestFacing,
  DefiningWorldPlazaChestKeySource,
  DefiningWorldPlazaChestPlacement,
  DefiningWorldPlazaChestVariant,
} from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import {
  DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_FACING_SEED_SALT,
  DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_SOURCE_SEED_SALT,
  DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_LOOT_POOL_ID,
  DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_PLACEMENT_SEED_SALT,
  DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_TILE_MODULUS,
  DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_VARIANT_SEED_SALT,
} from '@/components/world/chest/domains/definingWorldPlazaProceduralChestConstants';
import { checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex';

const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_FACINGS: readonly DefiningWorldPlazaChestFacing[] =
  ['n', 'e', 's', 'w'];

const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_VARIANTS: readonly DefiningWorldPlazaChestVariant[] =
  ['a', 'b'];

const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_SOURCES: readonly DefiningWorldPlazaChestKeySource[] =
  ['wildlife', 'shrub', 'long-grass'];

/** Stable chest id for one procedural tile. */
export function formattingWorldPlazaProceduralChestId(
  tileX: number,
  tileY: number
): string {
  return `chest-proc-${tileX}-${tileY}`;
}

function resolvingWorldPlazaProceduralChestKeySourceFromUnit(
  unitFloat: number
): DefiningWorldPlazaChestKeySource {
  const index = Math.min(
    DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_SOURCES.length - 1,
    Math.floor(
      unitFloat * DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_SOURCES.length
    )
  );

  return DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_SOURCES[index] ?? 'wildlife';
}

function resolvingWorldPlazaProceduralChestFacingFromUnit(
  unitFloat: number
): DefiningWorldPlazaChestFacing {
  const index = Math.min(
    DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_FACINGS.length - 1,
    Math.floor(unitFloat * DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_FACINGS.length)
  );

  return DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_FACINGS[index] ?? 's';
}

function resolvingWorldPlazaProceduralChestVariantFromUnit(
  unitFloat: number
): DefiningWorldPlazaChestVariant {
  return unitFloat < 0.5 ? 'a' : 'b';
}

/**
 * Returns a locked procedural chest placement for this tile, or null.
 */
export function resolvingWorldPlazaProceduralChestAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaChestPlacement | null {
  if (
    checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({ tileX, tileY })
  ) {
    return null;
  }

  const placementUnit = computingWorldPlazaProceduralChestSeedUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_PLACEMENT_SEED_SALT
  );

  if (
    Math.floor(
      placementUnit * DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_TILE_MODULUS
    ) !== 0
  ) {
    return null;
  }

  const keySourceUnit = computingWorldPlazaProceduralChestSeedUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_SOURCE_SEED_SALT
  );
  const facingUnit = computingWorldPlazaProceduralChestSeedUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_FACING_SEED_SALT
  );
  const variantUnit = computingWorldPlazaProceduralChestSeedUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_VARIANT_SEED_SALT
  );

  return {
    chestId: formattingWorldPlazaProceduralChestId(tileX, tileY),
    worldX: tileX + 0.5,
    worldY: tileY + 0.5,
    facing: resolvingWorldPlazaProceduralChestFacingFromUnit(facingUnit),
    variant: resolvingWorldPlazaProceduralChestVariantFromUnit(variantUnit),
    initialState: 'locked',
    loot: {
      kind: 'pool',
      poolId: DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_LOOT_POOL_ID,
    },
    keySource:
      resolvingWorldPlazaProceduralChestKeySourceFromUnit(keySourceUnit),
  };
}
