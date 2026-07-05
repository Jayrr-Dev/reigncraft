import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { snappingWorldBuildingTilePositionFromGridPoint } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import {
  applyingWorldPlazaTreeChopStateToInstance,
  computingWorldPlazaTreeChoppableLayerCount,
} from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES,
  DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';
import { readingWorldPlazaChoppedTreeRemainingVisualLayer } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';

export type ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult = {
  readonly tree: DefiningWorldPlazaTreeInstance;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly remainingChoppableLayers: number;
};

/**
 * Resolves the nearest choppable tree under a pointer within player range.
 */
export function resolvingWorldPlazaInteractableTreeFromPointerGridPoint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  persistenceOwnerId: string | null,
  remainingVisualLayerByTileKey?: ReadonlyMap<string, number>
): ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult | null {
  const snappedTile =
    snappingWorldBuildingTilePositionFromGridPoint(pointerGridPoint);

  if (!snappedTile) {
    return null;
  }

  const candidateTiles: DefiningWorldBuildingTilePosition[] = [
    snappedTile,
    {
      tileX: snappedTile.tileX - 1,
      tileY: snappedTile.tileY,
    },
    {
      tileX: snappedTile.tileX + 1,
      tileY: snappedTile.tileY,
    },
    {
      tileX: snappedTile.tileX,
      tileY: snappedTile.tileY - 1,
    },
    {
      tileX: snappedTile.tileX,
      tileY: snappedTile.tileY + 1,
    },
  ];

  let closestMatch: ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult | null =
    null;
  let closestPointerDistance = Number.POSITIVE_INFINITY;

  for (const tilePosition of candidateTiles) {
    const pointerDistance = computingWorldPlazaGridChebyshevDistance(
      pointerGridPoint.x,
      pointerGridPoint.y,
      tilePosition.tileX + 0.5,
      tilePosition.tileY + 0.5
    );

    if (
      pointerDistance > DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES
    ) {
      continue;
    }

    const playerDistance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      tilePosition.tileX + 0.5,
      tilePosition.tileY + 0.5
    );

    if (playerDistance > DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES) {
      continue;
    }

    const baseTree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tilePosition.tileX,
      tilePosition.tileY,
      placedBlocks
    );

    if (!baseTree) {
      continue;
    }

    const choppedRemaining =
      remainingVisualLayerByTileKey?.get(
        `${tilePosition.tileX},${tilePosition.tileY}`
      ) ??
      readingWorldPlazaChoppedTreeRemainingVisualLayer(
        persistenceOwnerId,
        tilePosition.tileX,
        tilePosition.tileY
      );

    const tree = applyingWorldPlazaTreeChopStateToInstance(
      baseTree,
      choppedRemaining
    );

    if (!tree) {
      continue;
    }

    const remainingChoppableLayers =
      computingWorldPlazaTreeChoppableLayerCount(tree);

    if (remainingChoppableLayers <= 0) {
      continue;
    }

    if (pointerDistance < closestPointerDistance) {
      closestPointerDistance = pointerDistance;
      closestMatch = {
        tree,
        tilePosition,
        remainingChoppableLayers,
      };
    }
  }

  return closestMatch;
}
