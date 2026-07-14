import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_FLOWER_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES } from '@/components/world/harvest/domains/definingWorldPlazaFlowerPickConstants';

/**
 * Tile positions to scan when resolving which biome flower dot was clicked.
 */
export function listingWorldPlazaFlowerPickCandidateTilePositionsAroundPointer(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  searchRadiusTiles: number = DEFINING_WORLD_PLAZA_FLOWER_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES
): DefiningWorldBuildingTilePosition[] {
  const centerTileX = Math.floor(pointerGridPoint.x);
  const centerTileY = Math.floor(pointerGridPoint.y);
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
