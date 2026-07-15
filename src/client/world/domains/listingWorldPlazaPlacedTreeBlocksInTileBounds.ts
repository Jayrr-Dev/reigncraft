import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { listingWorldBuildingPlacedBlocksAtTileFromIndex } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaTreePlacedVisualLayerFromGrowthStage } from '@/components/world/domains/computingWorldPlazaTreeBellCurveVisualLayerAtTileIndex';
import { computingWorldPlazaTreeProceduralGrowthStageAtTileIndex } from '@/components/world/domains/computingWorldPlazaTreeProceduralGrowthStageAtTileIndex';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  findingWorldPlazaPlacedTreeBlockAtTileIndex,
  resolvingWorldPlazaPlacedTreeInstanceFromBlock,
} from '@/components/world/domains/resolvingWorldPlazaPlacedTreeInstanceFromBlock';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import {
  resolvingWorldPlazaTreeAtTileIndex,
  type DefiningWorldPlazaTreeInstance,
} from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { applyingWorldPlazaTreeChopStateToInstance } from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import { readingWorldPlazaRuntimeChoppedTreeState } from '@/components/world/harvest/domains/registeringWorldPlazaChoppedTreesVisualLayerLookup';

/**
 * Collects every placed tree within a visible tile range.
 *
 * @module components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds
 */

/**
 * Lists placed natural tree blocks whose tiles fall inside the bounds.
 *
 * Prefers the tile index when provided so callers skip a full-list filter.
 *
 * @param bounds - Inclusive visible tile index range.
 * @param placedBlocks - Placed blocks visible in the scene.
 * @param placedBlocksByTile - Optional tile index for O(bounds) lookup.
 */
export function listingWorldPlazaPlacedTreeBlocksInTileBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): DefiningWorldBuildingPlacedBlock[] {
  if (placedBlocksByTile) {
    const treeBlocks: DefiningWorldBuildingPlacedBlock[] = [];

    for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
      for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
        const tileBlocks = listingWorldBuildingPlacedBlocksAtTileFromIndex(
          placedBlocksByTile,
          tileX,
          tileY
        );

        for (const block of tileBlocks) {
          if (
            checkingWorldBuildingBlockDefinitionIdIsNaturalTree(
              block.definitionId
            )
          ) {
            treeBlocks.push(block);
          }
        }
      }
    }

    return treeBlocks;
  }

  return placedBlocks.filter(
    (block) =>
      checkingWorldBuildingBlockDefinitionIdIsNaturalTree(block.definitionId) &&
      block.tilePosition.tileX >= bounds.minTileX &&
      block.tilePosition.tileX <= bounds.maxTileX &&
      block.tilePosition.tileY >= bounds.minTileY &&
      block.tilePosition.tileY <= bounds.maxTileY
  );
}

/**
 * Resolves the tree on a tile from placed blocks or procedural noise.
 *
 * Placed trees override procedural trees on the same tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Placed blocks near the tile.
 */
export function resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): DefiningWorldPlazaTreeInstance | null {
  const placedTreeBlock = findingWorldPlazaPlacedTreeBlockAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
    placedBlocksByTile
  );

  let tree: DefiningWorldPlazaTreeInstance | null;

  if (placedTreeBlock) {
    tree = resolvingWorldPlazaPlacedTreeInstanceFromBlock(
      placedTreeBlock,
      placedBlocks
    );
  } else {
    const proceduralTree = resolvingWorldPlazaTreeAtTileIndex(tileX, tileY);

    if (!proceduralTree) {
      return null;
    }

    const growthStage = computingWorldPlazaTreeProceduralGrowthStageAtTileIndex(
      tileX,
      tileY
    );

    tree = {
      ...proceduralTree,
      standingSurfaceLayer: resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
        tileX,
        tileY,
        placedBlocks,
        placedBlocksByTile
      ),
      growthStage,
      visualSurfaceLayer:
        computingWorldPlazaTreePlacedVisualLayerFromGrowthStage(
          tileX,
          tileY,
          growthStage
        ),
    };
  }

  return applyingWorldPlazaTreeChopStateToInstance(
    tree,
    readingWorldPlazaRuntimeChoppedTreeState(tileX, tileY)
  );
}
