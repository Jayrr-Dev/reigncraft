/**
 * Deterministic god-spawn roll and temperament override from a spawn anchor.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeGodSpawnFromAnchor
 */

import { computingWorldPlazaDistanceDangerBandFromOrigin } from '@/components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin';
import {
  mappingWorldPlazaGrassSeededUnitToIntegerRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_MAX,
  DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_PER_DANGER_BAND,
  DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_SALT,
  DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL,
  DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_SALT,
  type DefiningWildlifeGodSpawnTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeGodSpawnConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeGodSpawnFromAnchorResult = {
  isGodSpawn: true;
  temperamentOverrideId: DefiningWildlifeGodSpawnTemperamentId;
};

/** Chance to promote a spawn at this danger band (0 near origin). */
export function resolvingWildlifeGodSpawnChanceForDangerBand(
  dangerBand: number
): number {
  if (dangerBand <= 0) {
    return 0;
  }

  return Math.min(
    DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_MAX,
    DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_PER_DANGER_BAND * dangerBand
  );
}

function pickingWildlifeGodSpawnTemperamentFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): DefiningWildlifeGodSpawnTemperamentId {
  const temperamentRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_SALT + anchor.packIndex
  );
  const temperamentIndex = mappingWorldPlazaGrassSeededUnitToIntegerRange(
    temperamentRoll,
    0,
    DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL.length - 1
  );

  return (
    DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL[temperamentIndex] ??
    DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL[0]
  );
}

/**
 * Rolls whether this anchor is a god spawn and which aggressive temperament
 * overrides the species. Null when the spawn stays normal.
 */
export function resolvingWildlifeGodSpawnFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): ResolvingWildlifeGodSpawnFromAnchorResult | null {
  const dangerBand = computingWorldPlazaDistanceDangerBandFromOrigin(
    anchor.tileX,
    anchor.tileY
  );
  const chance = resolvingWildlifeGodSpawnChanceForDangerBand(dangerBand);

  if (chance <= 0) {
    return null;
  }

  const chanceRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_SALT + anchor.packIndex
  );

  if (chanceRoll >= chance) {
    return null;
  }

  return {
    isGodSpawn: true,
    temperamentOverrideId: pickingWildlifeGodSpawnTemperamentFromAnchor(anchor),
  };
}
