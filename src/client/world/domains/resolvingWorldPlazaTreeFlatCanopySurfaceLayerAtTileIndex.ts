import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  clampingWorldBuildingWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldPlazaTreeVariantHasStandableFlatCanopy } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { DEFINING_WORLD_PLAZA_TREE_FLAT_CANOPY_MIN_LAYERS_ABOVE_STANDING } from '@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';

/**
 * Resolves the standable top world layer of a flat-canopy tree on a tile.
 *
 * Acacia, willow, spruce, and pine expose flat horizontal foliage the player
 * can jump onto like a placed block cap. The canopy top aligns with the tree
 * visual surface layer when it sits far enough above the trunk foot.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex
 */

/**
 * Returns the top world layer the player can stand on for a flat-canopy tree.
 *
 * Returns ground when the tile has no qualifying tree or the canopy is too low
 * to read as a platform (saplings stay trunk-only).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Placed blocks considered for tree overrides and layers.
 */
export function resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
    tileX,
    tileY,
    placedBlocks,
    placedBlocksByTile
  );

  if (
    !tree ||
    !checkingWorldPlazaTreeVariantHasStandableFlatCanopy(tree.variant)
  ) {
    return DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
  }

  const standingLayer =
    tree.standingSurfaceLayer ?? DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
  const visualLayer = tree.visualSurfaceLayer ?? standingLayer;
  const layersAboveStanding = visualLayer - standingLayer;

  if (
    layersAboveStanding <
    DEFINING_WORLD_PLAZA_TREE_FLAT_CANOPY_MIN_LAYERS_ABOVE_STANDING
  ) {
    return DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
  }

  return clampingWorldBuildingWorldLayer(visualLayer);
}

/**
 * Returns true when a flat-canopy tree raises the tile above ground.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Placed blocks considered for tree overrides and layers.
 */
export function checkingWorldPlazaTreeFlatCanopyHasRaisedSurfaceAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = []
): boolean {
  return (
    resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex(
      tileX,
      tileY,
      placedBlocks
    ) > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  );
}
