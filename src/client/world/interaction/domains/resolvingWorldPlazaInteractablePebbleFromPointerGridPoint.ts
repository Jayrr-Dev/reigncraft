import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaStoneDecoration } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_PEBBLE_PICK_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_PEBBLE_PICK_POINTER_HIT_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaPebblePickConstants';
import { listingWorldPlazaPebblePickCandidateTilePositionsAroundPointer } from '@/components/world/harvest/domains/listingWorldPlazaPebblePickCandidateTilePositionsAroundPointer';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import {
  formattingWorldPlazaPickedPebbleTileKey,
  readingWorldPlazaPickedPebbleState,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';

export type ResolvingWorldPlazaInteractablePebbleFromPointerGridPointResult = {
  readonly decoration: DefiningWorldPlazaStoneDecoration;
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

/**
 * Resolves the nearest pickable floor pebble under a pointer within player range.
 */
export function resolvingWorldPlazaInteractablePebbleFromPointerGridPoint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  persistenceOwnerId: string | null,
  pickedPebbleStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >
): ResolvingWorldPlazaInteractablePebbleFromPointerGridPointResult | null {
  const candidateTiles =
    listingWorldPlazaPebblePickCandidateTilePositionsAroundPointer(
      pointerGridPoint
    );

  let closestMatch: ResolvingWorldPlazaInteractablePebbleFromPointerGridPointResult | null =
    null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const tilePosition of candidateTiles) {
    const tileKey = formattingWorldPlazaPickedPebbleTileKey(
      tilePosition.tileX,
      tilePosition.tileY
    );
    const pickedState =
      pickedPebbleStateByTileKey?.get(tileKey) ??
      readingWorldPlazaPickedPebbleState(
        persistenceOwnerId,
        tilePosition.tileX,
        tilePosition.tileY
      );

    if (pickedState?.isPicked) {
      continue;
    }

    const decoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
      tilePosition.tileX,
      tilePosition.tileY
    );

    if (!decoration || decoration.surfaceWorldLayer !== null) {
      continue;
    }

    const targetCenterX = tilePosition.tileX + 0.5;
    const targetCenterY = tilePosition.tileY + 0.5;

    const playerDistance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      targetCenterX,
      targetCenterY
    );

    if (playerDistance > DEFINING_WORLD_PLAZA_PEBBLE_PICK_PLAYER_RANGE_TILES) {
      continue;
    }

    const pointerDistance = Math.hypot(
      pointerGridPoint.x - targetCenterX,
      pointerGridPoint.y - targetCenterY
    );

    if (
      pointerDistance > DEFINING_WORLD_PLAZA_PEBBLE_PICK_POINTER_HIT_RADIUS_TILES
    ) {
      continue;
    }

    if (pointerDistance < closestPointerDistance) {
      closestPointerDistance = pointerDistance;
      closestMatch = {
        decoration,
        tileX: tilePosition.tileX,
        tileY: tilePosition.tileY,
        targetCenterX,
        targetCenterY,
      };
    }
  }

  return closestMatch;
}
