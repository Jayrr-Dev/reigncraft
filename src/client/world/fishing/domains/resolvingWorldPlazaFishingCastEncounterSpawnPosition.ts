/**
 * Off-screen spawn point for fishing cast wildlife encounters.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterSpawnPosition
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_ATTEMPT_COUNT,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MAX_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MIN_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_PLACEMENT_SALT,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_SIM_RADIUS_GRID } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ResolvingWorldPlazaFishingCastEncounterSpawnPositionParams = {
  readonly playerCenter: DefiningWorldPlazaWorldPoint;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly placementSeed: number;
  readonly isDaytime: boolean;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/**
 * Picks a walkable point in the off-screen ring around the player, or null.
 */
export function resolvingWorldPlazaFishingCastEncounterSpawnPosition({
  playerCenter,
  species,
  placementSeed,
  isDaytime,
  placedBlocks = [],
  placedBlocksByTile,
}: ResolvingWorldPlazaFishingCastEncounterSpawnPositionParams): DefiningWorldPlazaWorldPoint | null {
  const minDistance =
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MIN_DISTANCE_GRID;
  const maxDistance = Math.min(
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MAX_DISTANCE_GRID,
    DEFINING_WILDLIFE_SIM_RADIUS_GRID * 0.92
  );

  for (
    let attemptIndex = 0;
    attemptIndex <
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_ATTEMPT_COUNT;
    attemptIndex += 1
  ) {
    const angleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      placementSeed,
      attemptIndex,
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_PLACEMENT_SALT
    );
    const distanceRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      placementSeed,
      attemptIndex,
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_PLACEMENT_SALT + 1
    );
    const angle = angleRoll * Math.PI * 2;
    const distance = mappingWorldPlazaGrassSeededUnitToFloatRange(
      distanceRoll,
      minDistance,
      maxDistance
    );
    const x = playerCenter.x + Math.cos(angle) * distance;
    const y = playerCenter.y + Math.sin(angle) * distance;
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    const standingLayer = resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
      tileX,
      tileY,
      placedBlocks
    );
    const candidate: DefiningWorldPlazaWorldPoint = {
      x,
      y,
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
