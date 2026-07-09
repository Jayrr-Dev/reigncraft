/**
 * Dev-only grey wolf spawn at a random point near the local player.
 *
 * @module components/world/wildlife/domains/spawningWildlifeDevGreyWolfRandomlyNearPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_DEV_GREY_WOLF_RANDOM_PLACEMENT_SALT,
  DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MAX_GRID,
  DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MIN_GRID,
  DEFINING_WILDLIFE_GREY_WOLF_SPECIES_ID,
} from '@/components/world/wildlife/domains/definingWildlifeDevSpawnConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceAtPosition,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeAggressionLevelFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';
import { resolvingWildlifeLargeSizeFrameFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameFromAnchor';
import { resolvingWildlifeSizeBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor';
import { resolvingWildlifeSleepBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSleepBellCurveSampleFromAnchor';

function buildingWildlifeDevGreyWolfSpawnThinkAnchor(
  instanceId: string,
  position: DefiningWorldPlazaWorldPoint
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: instanceId,
    tileX: Math.floor(position.x),
    tileY: Math.floor(position.y),
    speciesId: DEFINING_WILDLIFE_GREY_WOLF_SPECIES_ID,
    packIndex: 0,
    packSize: 1,
    seed: 0.31,
  };
}

function resolvingWildlifeDevGreyWolfRandomSpawnPosition(
  center: DefiningWorldPlazaWorldPoint,
  placementSeed: number
): DefiningWorldPlazaWorldPoint {
  const angleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    placementSeed,
    0,
    DEFINING_WILDLIFE_DEV_GREY_WOLF_RANDOM_PLACEMENT_SALT
  );
  const distanceRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    placementSeed,
    0,
    DEFINING_WILDLIFE_DEV_GREY_WOLF_RANDOM_PLACEMENT_SALT + 1
  );
  const angle = angleRoll * Math.PI * 2;
  const distance = mappingWorldPlazaGrassSeededUnitToFloatRange(
    distanceRoll,
    DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MIN_GRID,
    DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MAX_GRID
  );

  const x = center.x + Math.cos(angle) * distance;
  const y = center.y + Math.sin(angle) * distance;
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);

  return {
    x,
    y,
    layer: resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(tileX, tileY, []),
  };
}

export type SpawningWildlifeDevGreyWolfRandomlyNearPointParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  /** Must use the same clock as the Pixi wildlife tick (`performance.now()`). */
  nowMs: number;
};

/**
 * Spawns one grey wolf at a random point near the player and returns whether it was added.
 */
export function spawningWildlifeDevGreyWolfRandomlyNearPoint({
  store,
  center,
  nowMs,
}: SpawningWildlifeDevGreyWolfRandomlyNearPointParams): boolean {
  const species = resolvingWildlifeSpeciesDefinition(
    DEFINING_WILDLIFE_GREY_WOLF_SPECIES_ID
  );

  if (!species) {
    return false;
  }

  const instanceId = `wildlife:dev:wolf:${nowMs}`;
  const position = resolvingWildlifeDevGreyWolfRandomSpawnPosition(
    center,
    Math.floor(nowMs)
  );
  const thinkScheduleAnchor = buildingWildlifeDevGreyWolfSpawnThinkAnchor(
    instanceId,
    position
  );
  const sizeScaleSample =
    resolvingWildlifeSizeBellCurveSampleFromAnchor(thinkScheduleAnchor);
  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    sizeScaleSample,
    species
  );
  const instance = creatingWildlifeInstanceAtPosition({
    instanceId,
    anchorId: instanceId,
    species,
    position,
    spawnAnchor: position,
    aggressionLevel: resolvingWildlifeAggressionLevelFromAnchor(
      thinkScheduleAnchor,
      species
    ),
    sleepScheduleSample:
      resolvingWildlifeSleepBellCurveSampleFromAnchor(thinkScheduleAnchor),
    sizeScaleSample,
    largeSizeFrame: resolvingWildlifeLargeSizeFrameFromAnchor(
      thinkScheduleAnchor,
      sizeTier
    ),
    thinkScheduleAnchor,
    nowMs,
  });

  store.instances.set(instanceId, instance);

  return true;
}
