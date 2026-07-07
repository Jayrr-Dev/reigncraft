/**
 * Picks a valid random wildlife respawn point away from the player and death site.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeRandomRespawnPosition
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import {
  DEFINING_WILDLIFE_RESPAWN_MIN_DEATH_SITE_DISTANCE_GRID,
  DEFINING_WILDLIFE_RESPAWN_MIN_PLAYER_DISTANCE_GRID,
  DEFINING_WILDLIFE_RESPAWN_RANDOM_ATTEMPT_COUNT,
  DEFINING_WILDLIFE_RESPAWN_RANDOM_PLACEMENT_SALT,
} from '@/components/world/wildlife/domains/definingWildlifeDeathConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_SIM_RADIUS_GRID } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ResolvingWildlifeRandomRespawnPositionParams = {
  playerCenter: DefiningWorldPlazaWorldPoint;
  deathPosition: DefiningWorldPlazaWorldPoint;
  species: DefiningWildlifeSpeciesDefinition;
  placementSeed: number;
  isDaytime: boolean;
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

function checkingWildlifeRespawnDistanceConstraints(
  point: DefiningWorldPlazaWorldPoint,
  playerCenter: DefiningWorldPlazaWorldPoint,
  deathPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const playerDistance = Math.hypot(
    point.x - playerCenter.x,
    point.y - playerCenter.y
  );
  const deathSiteDistance = Math.hypot(
    point.x - deathPosition.x,
    point.y - deathPosition.y
  );

  return (
    playerDistance >= DEFINING_WILDLIFE_RESPAWN_MIN_PLAYER_DISTANCE_GRID &&
    deathSiteDistance >=
      DEFINING_WILDLIFE_RESPAWN_MIN_DEATH_SITE_DISTANCE_GRID &&
    playerDistance <= DEFINING_WILDLIFE_SIM_RADIUS_GRID
  );
}

/**
 * Returns a walkable respawn point in the sim ring, or null when none is found.
 */
export function resolvingWildlifeRandomRespawnPosition({
  playerCenter,
  deathPosition,
  species,
  placementSeed,
  isDaytime,
  placedBlocks = [],
  placedBlocksByTile,
}: ResolvingWildlifeRandomRespawnPositionParams): DefiningWorldPlazaWorldPoint | null {
  const minDistance = DEFINING_WILDLIFE_RESPAWN_MIN_PLAYER_DISTANCE_GRID;
  const maxDistance = DEFINING_WILDLIFE_SIM_RADIUS_GRID * 0.92;

  for (
    let attemptIndex = 0;
    attemptIndex < DEFINING_WILDLIFE_RESPAWN_RANDOM_ATTEMPT_COUNT;
    attemptIndex += 1
  ) {
    const angleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      placementSeed,
      attemptIndex,
      DEFINING_WILDLIFE_RESPAWN_RANDOM_PLACEMENT_SALT
    );
    const distanceRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      placementSeed,
      attemptIndex,
      DEFINING_WILDLIFE_RESPAWN_RANDOM_PLACEMENT_SALT + 1
    );
    const angle = angleRoll * Math.PI * 2;
    const distance = mappingWorldPlazaGrassSeededUnitToFloatRange(
      distanceRoll,
      minDistance,
      maxDistance
    );
    const point = {
      x: playerCenter.x + Math.cos(angle) * distance,
      y: playerCenter.y + Math.sin(angle) * distance,
      layer: playerCenter.layer,
    };

    if (
      !checkingWildlifeRespawnDistanceConstraints(
        point,
        playerCenter,
        deathPosition
      )
    ) {
      continue;
    }

    const tileX = Math.floor(point.x);
    const tileY = Math.floor(point.y);
    const standingLayer = resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
      tileX,
      tileY,
      placedBlocks
    );
    const candidate = {
      x: point.x,
      y: point.y,
      layer: standingLayer,
    };

    if (
      checkingWildlifeHazardAtPoint({
        point: candidate,
        species,
        placedBlocks,
        placedBlocksByTile,
        isDaytime,
      }) !== 'safe'
    ) {
      continue;
    }

    return candidate;
  }

  return null;
}
