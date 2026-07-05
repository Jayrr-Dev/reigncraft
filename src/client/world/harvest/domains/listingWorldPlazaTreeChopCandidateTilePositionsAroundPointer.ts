import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES,
  DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';

/**
 * Tile positions to scan when resolving which tree was clicked.
 */
export function listingWorldPlazaTreeChopCandidateTilePositionsAroundGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  searchRadiusTiles: number = DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES
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
 * Tile positions around the pointer and the player for tree chop resolution.
 */
export function listingWorldPlazaTreeChopCandidateTilePositionsAroundPointer(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition?: DefiningWorldPlazaWorldPoint
): DefiningWorldBuildingTilePosition[] {
  const candidateTiles =
    listingWorldPlazaTreeChopCandidateTilePositionsAroundGridPoint(
      pointerGridPoint
    );

  if (!playerPosition) {
    return candidateTiles;
  }

  const playerSearchRadius =
    DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES +
    DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES;
  const playerCandidateTiles =
    listingWorldPlazaTreeChopCandidateTilePositionsAroundGridPoint(
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
