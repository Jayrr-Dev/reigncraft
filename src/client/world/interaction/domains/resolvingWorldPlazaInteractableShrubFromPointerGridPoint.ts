import { checkingWorldPlazaShrubDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaShrubDecorationAtTileIndex';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import { DEFINING_WORLD_PLAZA_SHRUB_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES } from '@/components/world/harvest/domains/definingWorldPlazaShrubPickConstants';
import { checkingWorldPlazaRuntimeShrubIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedShrubsLookup';

export type ResolvingWorldPlazaInteractableShrubFromPointerGridPointResult = {
  readonly tileX: number;
  readonly tileY: number;
  readonly distanceTiles: number;
};

/**
 * Resolves the nearest unpicked berry shrub under the pointer.
 */
export function resolvingWorldPlazaInteractableShrubFromPointerGridPoint(
  pointerGridX: number,
  pointerGridY: number,
  pointerHitRadiusTiles: number
): ResolvingWorldPlazaInteractableShrubFromPointerGridPointResult | null {
  const searchRadius = Math.max(
    pointerHitRadiusTiles,
    DEFINING_WORLD_PLAZA_SHRUB_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES
  );
  const centerTileX = Math.floor(pointerGridX);
  const centerTileY = Math.floor(pointerGridY);

  let closestMatch: ResolvingWorldPlazaInteractableShrubFromPointerGridPointResult | null =
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
        checkingWorldPlazaRuntimeShrubIsPicked(tileX, tileY) ||
        !checkingWorldPlazaShrubDecorationAtTileIndex(tileX, tileY)
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
