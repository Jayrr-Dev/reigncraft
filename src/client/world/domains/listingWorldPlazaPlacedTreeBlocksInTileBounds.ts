import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import {
  findingWorldPlazaPlacedTreeBlockAtTileIndex,
  resolvingWorldPlazaPlacedTreeInstanceFromBlock,
} from "@/components/world/domains/resolvingWorldPlazaPlacedTreeInstanceFromBlock";
import {
  resolvingWorldPlazaTreeAtTileIndex,
  type DefiningWorldPlazaTreeInstance,
} from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";
import {
  computingWorldPlazaTreePlacedVisualLayerFromGrowthStage,
} from "@/components/world/domains/computingWorldPlazaTreeBellCurveVisualLayerAtTileIndex";
import { computingWorldPlazaTreeProceduralGrowthStageAtTileIndex } from "@/components/world/domains/computingWorldPlazaTreeProceduralGrowthStageAtTileIndex";
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex";

/**
 * Collects every placed tree within a visible tile range.
 *
 * @module components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds
 */

/**
 * Lists placed natural tree blocks whose tiles fall inside the bounds.
 *
 * @param bounds - Inclusive visible tile index range.
 * @param placedBlocks - Placed blocks visible in the scene.
 */
export function listingWorldPlazaPlacedTreeBlocksInTileBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): DefiningWorldBuildingPlacedBlock[] {
  return placedBlocks.filter(
    (block) =>
      checkingWorldBuildingBlockDefinitionIdIsNaturalTree(block.definitionId) &&
      block.tilePosition.tileX >= bounds.minTileX &&
      block.tilePosition.tileX <= bounds.maxTileX &&
      block.tilePosition.tileY >= bounds.minTileY &&
      block.tilePosition.tileY <= bounds.maxTileY,
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
): DefiningWorldPlazaTreeInstance | null {
  const placedTreeBlock = findingWorldPlazaPlacedTreeBlockAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
  );

  if (placedTreeBlock) {
    return resolvingWorldPlazaPlacedTreeInstanceFromBlock(
      placedTreeBlock,
      placedBlocks,
    );
  }

  const proceduralTree = resolvingWorldPlazaTreeAtTileIndex(tileX, tileY);

  if (!proceduralTree) {
    return null;
  }

  const growthStage = computingWorldPlazaTreeProceduralGrowthStageAtTileIndex(
    tileX,
    tileY,
  );

  return {
    ...proceduralTree,
    standingSurfaceLayer: resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(
      tileX,
      tileY,
      placedBlocks,
    ),
    growthStage,
    visualSurfaceLayer: computingWorldPlazaTreePlacedVisualLayerFromGrowthStage(
      tileX,
      tileY,
      growthStage,
    ),
  };
}
