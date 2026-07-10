import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata,
  resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata,
} from '@/components/world/domains/resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import {
  applyingWorldPlazaRockMineStateToColumnRockMetadata,
  computingWorldPlazaRockMineableLayerCount,
} from '@/components/world/harvest/domains/applyingWorldPlazaRockMineStateToColumnRockMetadata';
import {
  DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_HIT_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaRockMineConstants';
import { listingWorldPlazaRockMineCandidateTilePositionsAroundPointer } from '@/components/world/harvest/domains/listingWorldPlazaRockMineCandidateTilePositionsAroundPointer';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import {
  formattingWorldPlazaMinedRockTileKey,
  readingWorldPlazaMinedRockState,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';

export type ResolvingWorldPlazaInteractableRockFromPointerGridPointResult = {
  readonly metadata: DefiningWorldPlazaColumnRockMetadata;
  readonly anchorTileX: number;
  readonly anchorTileY: number;
  readonly remainingMineableLayers: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

/**
 * Resolves the nearest mineable column rock under a pointer within player range.
 */
export function resolvingWorldPlazaInteractableRockFromPointerGridPoint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  persistenceOwnerId: string | null,
  minedRockStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >
): ResolvingWorldPlazaInteractableRockFromPointerGridPointResult | null {
  const candidateTiles =
    listingWorldPlazaRockMineCandidateTilePositionsAroundPointer(
      pointerGridPoint,
      playerPosition
    );

  const seenAnchorKeys = new Set<string>();
  let closestMatch: ResolvingWorldPlazaInteractableRockFromPointerGridPointResult | null =
    null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const tilePosition of candidateTiles) {
    const baseMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
      tilePosition.tileX,
      tilePosition.tileY
    );

    if (!baseMetadata) {
      continue;
    }

    const anchorKey = formattingWorldPlazaMinedRockTileKey(
      baseMetadata.anchorTileX,
      baseMetadata.anchorTileY
    );

    if (seenAnchorKeys.has(anchorKey)) {
      continue;
    }

    seenAnchorKeys.add(anchorKey);

    const minedState =
      minedRockStateByTileKey?.get(anchorKey) ??
      readingWorldPlazaMinedRockState(
        persistenceOwnerId,
        baseMetadata.anchorTileX,
        baseMetadata.anchorTileY
      );

    const metadata = applyingWorldPlazaRockMineStateToColumnRockMetadata(
      baseMetadata,
      minedState
    );

    if (!metadata) {
      continue;
    }

    const remainingMineableLayers =
      computingWorldPlazaRockMineableLayerCount(metadata);

    if (remainingMineableLayers <= 0) {
      continue;
    }

    const footprintCenter =
      resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata(
        metadata
      );

    const playerDistance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      footprintCenter.x,
      footprintCenter.y
    );

    if (playerDistance > DEFINING_WORLD_PLAZA_ROCK_MINE_PLAYER_RANGE_TILES) {
      continue;
    }

    const collisionRadius =
      resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata(metadata);
    const pointerHitRadius = Math.max(
      collisionRadius,
      DEFINING_WORLD_PLAZA_ROCK_MINE_POINTER_HIT_RADIUS_TILES
    );
    const pointerDistance = Math.hypot(
      pointerGridPoint.x - footprintCenter.x,
      pointerGridPoint.y - footprintCenter.y
    );

    if (pointerDistance > pointerHitRadius) {
      continue;
    }

    if (pointerDistance < closestPointerDistance) {
      closestPointerDistance = pointerDistance;
      closestMatch = {
        metadata,
        anchorTileX: metadata.anchorTileX,
        anchorTileY: metadata.anchorTileY,
        remainingMineableLayers,
        targetCenterX: footprintCenter.x,
        targetCenterY: footprintCenter.y,
      };
    }
  }

  return closestMatch;
}
