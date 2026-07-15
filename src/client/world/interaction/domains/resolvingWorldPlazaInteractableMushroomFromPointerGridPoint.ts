/**
 * Resolves the nearest pickable mushroom under a pointer within player range.
 *
 * @module components/world/interaction/domains/resolvingWorldPlazaInteractableMushroomFromPointerGridPoint
 */

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PICK_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_MUSHROOM_PICK_POINTER_HIT_RADIUS_TILES,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import { checkingWorldPlazaMushroomDecorationAtTileIndex } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomDecorationAtTileIndex';
import { listingWorldPlazaMushroomPickCandidateTilePositionsAroundPointer } from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomPickCandidateTilePositionsAroundPointer';
import {
  formattingWorldPlazaPickedMushroomTileKey,
  readingWorldPlazaPickedMushroomState,
  type DefiningWorldPlazaPickedMushroomTileState,
} from '@/components/world/mushrooms/domains/managingWorldPlazaLocalPickedMushrooms';

export type ResolvingWorldPlazaInteractableMushroomFromPointerGridPointResult = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

export function resolvingWorldPlazaInteractableMushroomFromPointerGridPoint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  persistenceOwnerId: string | null,
  pickedMushroomStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedMushroomTileState
  >
): ResolvingWorldPlazaInteractableMushroomFromPointerGridPointResult | null {
  const candidateTiles =
    listingWorldPlazaMushroomPickCandidateTilePositionsAroundPointer(
      pointerGridPoint
    );

  let closestMatch: ResolvingWorldPlazaInteractableMushroomFromPointerGridPointResult | null =
    null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const tilePosition of candidateTiles) {
    const tileKey = formattingWorldPlazaPickedMushroomTileKey(
      tilePosition.tileX,
      tilePosition.tileY
    );
    const pickedState =
      pickedMushroomStateByTileKey?.get(tileKey) ??
      readingWorldPlazaPickedMushroomState(
        persistenceOwnerId,
        tilePosition.tileX,
        tilePosition.tileY
      );

    if (pickedState?.isPicked) {
      continue;
    }

    if (
      !checkingWorldPlazaMushroomDecorationAtTileIndex(
        tilePosition.tileX,
        tilePosition.tileY
      )
    ) {
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

    if (playerDistance > DEFINING_WORLD_PLAZA_MUSHROOM_PICK_PLAYER_RANGE_TILES) {
      continue;
    }

    const pointerDistance = Math.hypot(
      pointerGridPoint.x - targetCenterX,
      pointerGridPoint.y - targetCenterY
    );

    if (
      pointerDistance >
      DEFINING_WORLD_PLAZA_MUSHROOM_PICK_POINTER_HIT_RADIUS_TILES
    ) {
      continue;
    }

    if (pointerDistance < closestPointerDistance) {
      closestPointerDistance = pointerDistance;
      closestMatch = {
        tileX: tilePosition.tileX,
        tileY: tilePosition.tileY,
        targetCenterX,
        targetCenterY,
      };
    }
  }

  return closestMatch;
}
