import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { listingWorldPlazaPlacedTreeBlocksInTileBounds } from "@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds";
import { resolvingWorldPlazaPlacedTreeInstanceFromBlock } from "@/components/world/domains/resolvingWorldPlazaPlacedTreeInstanceFromBlock";
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from "@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Collects every placed tree within a visible tile range.
 *
 * @module components/world/domains/listingWorldPlazaTreesInTileBounds
 */

/** Default safety cap on rendered trees so a huge viewport can never stall the layer. */
export const DEFINING_WORLD_PLAZA_TREE_MAX_VISIBLE_COUNT_DEFAULT = 220;

/**
 * Scans the tile bounds and returns the trees standing within them.
 *
 * Placed trees always take priority over procedural trees on the same tile and
 * are kept first when the visible cap trims distant trees.
 *
 * When more trees fall inside the bounds than the cap allows, the trees nearest
 * the center are kept. Capping by distance (instead of by scan order) keeps the
 * surviving set stable and identical across callers that share the same bounds
 * and center, so a tree never renders its trunk without its canopy (or vice
 * versa) and culling happens gracefully at the screen edges.
 *
 * @param bounds - Inclusive visible tile index range.
 * @param maxVisibleTrees - Upper bound on returned trees for adaptive quality.
 * @param centerTileX - Tile column to measure nearness from (usually the player).
 * @param centerTileY - Tile row to measure nearness from.
 * @param placedBlocks - Placed blocks visible in the scene.
 */
export function listingWorldPlazaTreesInTileBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  maxVisibleTrees: number = DEFINING_WORLD_PLAZA_TREE_MAX_VISIBLE_COUNT_DEFAULT,
  centerTileX?: number,
  centerTileY?: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): DefiningWorldPlazaTreeInstance[] {
  const placedTreeBlocks = listingWorldPlazaPlacedTreeBlocksInTileBounds(
    bounds,
    placedBlocks,
  );
  const placedTreeTiles = new Set<string>();
  const trees: DefiningWorldPlazaTreeInstance[] = [];

  for (const placedTreeBlock of placedTreeBlocks) {
    const placedTree = resolvingWorldPlazaPlacedTreeInstanceFromBlock(
      placedTreeBlock,
      placedBlocks,
    );

    placedTreeTiles.add(`${placedTree.tileX},${placedTree.tileY}`);
    trees.push(placedTree);
  }

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      if (placedTreeTiles.has(`${tileX},${tileY}`)) {
        continue;
      }

      const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
        tileX,
        tileY,
        placedBlocks,
      );

      if (tree && !tree.placedBlockId) {
        trees.push(tree);
      }
    }
  }

  const resolvedMaxVisibleTrees = Math.max(0, Math.floor(maxVisibleTrees));

  if (trees.length <= resolvedMaxVisibleTrees) {
    return trees;
  }

  if (centerTileX === undefined || centerTileY === undefined) {
    return trees.slice(0, resolvedMaxVisibleTrees);
  }

  trees.sort((treeA, treeB) => {
    const priorityA = treeA.placedBlockId ? 0 : 1;
    const priorityB = treeB.placedBlockId ? 0 : 1;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return (
      squaringWorldPlazaTreeDistanceToCenter(treeA, centerTileX, centerTileY) -
      squaringWorldPlazaTreeDistanceToCenter(treeB, centerTileX, centerTileY)
    );
  });

  return trees.slice(0, resolvedMaxVisibleTrees);
}

/** Squared tile distance from a tree to a center point (avoids a sqrt). */
function squaringWorldPlazaTreeDistanceToCenter(
  tree: DefiningWorldPlazaTreeInstance,
  centerTileX: number,
  centerTileY: number,
): number {
  const deltaX = tree.tileX - centerTileX;
  const deltaY = tree.tileY - centerTileY;

  return deltaX * deltaX + deltaY * deltaY;
}
