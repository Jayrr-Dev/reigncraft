import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES,
  DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaRockMineConstants';

/**
 * Tile positions to scan when resolving which rock was clicked.
 */
export function listingWorldPlazaRockMineCandidateTilePositionsAroundGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  searchRadiusTiles: number = DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES
): DefiningWorldBuildingTilePosition[] {
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  const candidateTiles: DefiningWorldBuildingTilePosition[] = [];

  for (
    let tileY = centerTileY - searchRadiusTiles;
    tileY <= centerTileY + searchRadiusTiles;
    tileY += 1
  ) {
    for (
      let tileX = centerTileX - searchRadiusTiles;
      tileX <= centerTileX + searchRadiusTiles;
      tileX += 1
    ) {
      candidateTiles.push({ tileX, tileY });
    }
  }

  return candidateTiles;
}

/**
 * Tile positions around the pointer and the player for rock mine resolution.
 */
export function listingWorldPlazaRockMineCandidateTilePositionsAroundPointer(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition?: DefiningWorldPlazaWorldPoint
): DefiningWorldBuildingTilePosition[] {
  const candidateTiles =
    listingWorldPlazaRockMineCandidateTilePositionsAroundGridPoint(
      pointerGridPoint
    );

  if (!playerPosition) {
    return candidateTiles;
  }

  const playerSearchRadius =
    DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES +
    DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES;
  const playerCandidateTiles =
    listingWorldPlazaRockMineCandidateTilePositionsAroundGridPoint(
      playerPosition,
      playerSearchRadius
    );
  const seenTileKeys = new Set<string>();

  return [...candidateTiles, ...playerCandidateTiles].filter((tilePosition) => {
    const tileKey = `${tilePosition.tileX},${tilePosition.tileY}`;

    if (seenTileKeys.has(tileKey)) {
      return false;
    }

    seenTileKeys.add(tileKey);
    return true;
  });
}
