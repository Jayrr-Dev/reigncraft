/**
 * Candidate tiles around a pointer for mushroom pick hit-testing.
 *
 * @module components/world/mushrooms/domains/listingWorldPlazaMushroomPickCandidateTilePositionsAroundPointer
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_MUSHROOM_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';

export function listingWorldPlazaMushroomPickCandidateTilePositionsAroundPointer(
  pointerGridPoint: DefiningWorldPlazaWorldPoint
): readonly { readonly tileX: number; readonly tileY: number }[] {
  const centerTileX = Math.floor(pointerGridPoint.x);
  const centerTileY = Math.floor(pointerGridPoint.y);
  const radius =
    DEFINING_WORLD_PLAZA_MUSHROOM_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES;
  const tiles: { readonly tileX: number; readonly tileY: number }[] = [];

  for (let tileY = centerTileY - radius; tileY <= centerTileY + radius; tileY += 1) {
    for (
      let tileX = centerTileX - radius;
      tileX <= centerTileX + radius;
      tileX += 1
    ) {
      tiles.push({ tileX, tileY });
    }
  }

  return tiles;
}
