/**
 * Dev-only spawn of one chosen species near the local player.
 *
 * @module components/world/wildlife/domains/spawningWildlifeDevSpeciesNearPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_OFFSET_GRID,
  DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_PLACEMENT_SALT,
} from '@/components/world/wildlife/domains/definingWildlifeDevSpawnConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpawnAnchor,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceAtPosition,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';
import { resolvingWildlifeLargeSizeFrameFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameFromAnchor';
import { resolvingWildlifeSizeBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor';
import { resolvingWildlifeSleepBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSleepBellCurveSampleFromAnchor';

function buildingWildlifeDevSpeciesSpawnThinkAnchor(
  instanceId: string,
  position: DefiningWorldPlazaWorldPoint,
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: instanceId,
    tileX: Math.floor(position.x),
    tileY: Math.floor(position.y),
    speciesId,
    packIndex: 0,
    packSize: 1,
    seed: 0.41,
  };
}

function resolvingWildlifeDevSpeciesSpawnPosition(
  center: DefiningWorldPlazaWorldPoint,
  placementSeed: number
): DefiningWorldPlazaWorldPoint {
  const angleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    placementSeed,
    0,
    DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_PLACEMENT_SALT
  );
  const distanceRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    placementSeed,
    0,
    DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_PLACEMENT_SALT + 1
  );
  const angle = angleRoll * Math.PI * 2;
  const distance = mappingWorldPlazaGrassSeededUnitToFloatRange(
    distanceRoll,
    DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_OFFSET_GRID * 0.75,
    DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_OFFSET_GRID * 1.35
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

export type SpawningWildlifeDevSpeciesNearPointParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  speciesId: DefiningWildlifeSpeciesId;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  /** Must use the same clock as the Pixi wildlife tick (`Date.now()`). */
  nowMs: number;
};

/**
 * Spawns one chosen species near the player with an explicit aggression level.
 */
export function spawningWildlifeDevSpeciesNearPoint({
  store,
  center,
  speciesId,
  aggressionLevel,
  nowMs,
}: SpawningWildlifeDevSpeciesNearPointParams): boolean {
  const species = resolvingWildlifeSpeciesDefinition(speciesId);

  if (!species) {
    return false;
  }

  const instanceId = `wildlife:dev:${speciesId}:${nowMs}`;
  const position = resolvingWildlifeDevSpeciesSpawnPosition(
    center,
    Math.floor(nowMs)
  );
  const thinkScheduleAnchor = buildingWildlifeDevSpeciesSpawnThinkAnchor(
    instanceId,
    position,
    speciesId
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
    aggressionLevel,
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
