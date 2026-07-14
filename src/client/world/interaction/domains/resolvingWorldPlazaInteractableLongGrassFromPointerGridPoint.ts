import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import { DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES } from '@/components/world/harvest/domains/definingWorldPlazaLongGrassSearchConstants';
import { checkingWorldPlazaRuntimeLongGrassIsCleared } from '@/components/world/harvest/domains/registeringWorldPlazaClearedLongGrassLookup';

export type ResolvingWorldPlazaInteractableLongGrassFromPointerGridPointResult = {
  readonly tileX: number;
  readonly tileY: number;
  readonly distanceTiles: number;
};

/**
 * Resolves the nearest searchable long-grass clump under the pointer.
 */
export function resolvingWorldPlazaInteractableLongGrassFromPointerGridPoint(
  pointerGridX: number,
  pointerGridY: number,
  pointerHitRadiusTiles: number
): ResolvingWorldPlazaInteractableLongGrassFromPointerGridPointResult | null {
  const searchRadius = Math.max(
    pointerHitRadiusTiles,
    DEFINING_WORLD_PLAZA_LONG_GRASS_SEARCH_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES
  );
  const centerTileX = Math.floor(pointerGridX);
  const centerTileY = Math.floor(pointerGridY);

  let closestMatch: ResolvingWorldPlazaInteractableLongGrassFromPointerGridPointResult | null =
    null;

  for (
    let tileY = centerTileY - searchRadius;
    tileY <= centerTileY + searchRadius;
    tileY += 1
  ) {
    for (
      let tileX = centerTileX - searchRadius;
      tileX <= centerTileX + searchRadius;
      tileX += 1
    ) {
      if (
        checkingWorldPlazaRuntimeLongGrassIsCleared(tileX, tileY) ||
        !checkingWorldPlazaLongGrassDecorationAtTileIndex(tileX, tileY)
      ) {
        continue;
      }

      const targetCenterX = tileX + 0.5;
      const targetCenterY = tileY + 0.5;
      const distance = computingWorldPlazaGridChebyshevDistance(
        pointerGridX,
        pointerGridY,
        targetCenterX,
        targetCenterY
      );

      if (distance > pointerHitRadiusTiles) {
        continue;
      }

      if (!closestMatch || distance < closestMatch.distanceTiles) {
        closestMatch = {
          tileX,
          tileY,
          distanceTiles: distance,
        };
      }
    }
  }

  return closestMatch;
}
