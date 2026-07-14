import { checkingWorldPlazaPickableFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaPickableFlowerDecorationAtTileIndex';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_FLOWER_PICK_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_FLOWER_PICK_POINTER_HIT_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaFlowerPickConstants';
import { listingWorldPlazaFlowerPickCandidateTilePositionsAroundPointer } from '@/components/world/harvest/domains/listingWorldPlazaFlowerPickCandidateTilePositionsAroundPointer';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import {
  formattingWorldPlazaPickedFlowerTileKey,
  readingWorldPlazaPickedFlowerState,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';

export type ResolvingWorldPlazaInteractableFlowerFromPointerGridPointResult = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

/**
 * Resolves the nearest pickable biome flower dot under a pointer within player range.
 */
export function resolvingWorldPlazaInteractableFlowerFromPointerGridPoint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  persistenceOwnerId: string | null,
  pickedFlowerStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >
): ResolvingWorldPlazaInteractableFlowerFromPointerGridPointResult | null {
  const candidateTiles =
    listingWorldPlazaFlowerPickCandidateTilePositionsAroundPointer(
      pointerGridPoint
    );

  let closestMatch: ResolvingWorldPlazaInteractableFlowerFromPointerGridPointResult | null =
    null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const tilePosition of candidateTiles) {
    const tileKey = formattingWorldPlazaPickedFlowerTileKey(
      tilePosition.tileX,
      tilePosition.tileY
    );
    const pickedState =
      pickedFlowerStateByTileKey?.get(tileKey) ??
      readingWorldPlazaPickedFlowerState(
        persistenceOwnerId,
        tilePosition.tileX,
        tilePosition.tileY
      );

    if (pickedState?.isPicked) {
      continue;
    }

    if (
      !checkingWorldPlazaPickableFlowerDecorationAtTileIndex(
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

    if (playerDistance > DEFINING_WORLD_PLAZA_FLOWER_PICK_PLAYER_RANGE_TILES) {
      continue;
    }

    const pointerDistance = Math.hypot(
      pointerGridPoint.x - targetCenterX,
      pointerGridPoint.y - targetCenterY
    );

    if (
      pointerDistance >
      DEFINING_WORLD_PLAZA_FLOWER_PICK_POINTER_HIT_RADIUS_TILES
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
