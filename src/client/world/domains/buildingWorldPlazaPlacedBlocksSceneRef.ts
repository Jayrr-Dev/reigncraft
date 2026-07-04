import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  indexingWorldBuildingPlacedBlocksByTile,
  type IndexingWorldBuildingPlacedBlocksByTile,
} from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';

/**
 * Scene snapshot for placed blocks and their tile index.
 *
 * @module components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef
 */

/** Placed blocks plus a tile index rebuilt when the scene block list changes. */
export type DefiningWorldPlazaPlacedBlocksSceneRef = {
  blocks: DefiningWorldBuildingPlacedBlock[];
  blocksByTile: IndexingWorldBuildingPlacedBlocksByTile;
};

/** Empty placed-blocks scene ref for initial ref values. */
export const BUILDING_WORLD_PLAZA_PLACED_BLOCKS_SCENE_REF_EMPTY: DefiningWorldPlazaPlacedBlocksSceneRef =
  {
    blocks: [],
    blocksByTile: new Map(),
  };

/**
 * Builds a scene ref snapshot with a fresh tile index.
 *
 * @param blocks - Placed blocks visible in the scene.
 */
export function buildingWorldPlazaPlacedBlocksSceneRef(
  blocks: readonly DefiningWorldBuildingPlacedBlock[]
): DefiningWorldPlazaPlacedBlocksSceneRef {
  if (blocks.length === 0) {
    return BUILDING_WORLD_PLAZA_PLACED_BLOCKS_SCENE_REF_EMPTY;
  }

  return {
    blocks: [...blocks],
    blocksByTile: indexingWorldBuildingPlacedBlocksByTile(blocks),
  };
}
