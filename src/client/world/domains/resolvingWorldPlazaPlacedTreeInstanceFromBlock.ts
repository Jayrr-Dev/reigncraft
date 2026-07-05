import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  listingWorldBuildingPlacedBlocksAtTileFromIndex,
  type IndexingWorldBuildingPlacedBlocksByTile,
} from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaTreePlacedVisualLayerFromGrowthStage } from '@/components/world/domains/computingWorldPlazaTreeBellCurveVisualLayerAtTileIndex';
import {
  resolvingWorldPlazaTreeSpeciesForVariant,
  type DefiningWorldPlazaTreeVariantKind,
} from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { resolvingWorldPlazaTreeGrowthStageFromPlacedBlockMetadata } from '@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants';
import { resolvingWorldPlazaBaseSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { resolvingWorldPlazaTreeCollisionRadiusGridFromInstance } from '@/components/world/domains/resolvingWorldPlazaTreeCollisionRadiusGridFromInstance';

/**
 * Maps placed tree blocks into procedural tree instances for rendering.
 *
 * @module components/world/domains/resolvingWorldPlazaPlacedTreeInstanceFromBlock
 */

/** Hash multiplier for block-id seed mixing. */
const RESOLVING_WORLD_PLAZA_PLACED_TREE_BLOCK_ID_SEED_MULTIPLIER = 31;

/**
 * Maps a placed tree block definition id to a drawable tree variant.
 *
 * @param definitionId - Block definition id from the registry.
 */
function resolvingWorldPlazaTreeVariantFromPlacedBlockDefinitionId(
  definitionId: DefiningWorldBuildingPlacedBlock['definitionId']
): DefiningWorldPlazaTreeVariantKind {
  if (definitionId === DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK) {
    return 'oak';
  }

  if (checkingWorldBuildingBlockDefinitionIdIsNaturalTree(definitionId)) {
    const speciesSuffix = definitionId.slice('natural:tree:'.length);

    if (
      speciesSuffix === 'blossom' ||
      speciesSuffix === 'willow' ||
      speciesSuffix === 'acacia' ||
      speciesSuffix === 'spruce' ||
      speciesSuffix === 'birch' ||
      speciesSuffix === 'pine' ||
      speciesSuffix === 'palm' ||
      speciesSuffix === 'deadwood' ||
      speciesSuffix === 'cactus'
    ) {
      return speciesSuffix;
    }
  }

  return 'oak';
}

/**
 * Returns a deterministic seed from a placed block id.
 *
 * @param blockId - Persisted placed block id.
 */
function computingWorldPlazaTreeSeedFromPlacedBlockId(blockId: string): number {
  let hash = 0;

  for (let charIndex = 0; charIndex < blockId.length; charIndex += 1) {
    hash =
      (hash * RESOLVING_WORLD_PLAZA_PLACED_TREE_BLOCK_ID_SEED_MULTIPLIER +
        blockId.charCodeAt(charIndex)) |
      0;
  }

  return Math.abs(hash) || 1;
}

/**
 * Builds a tree instance from a placed natural tree block.
 *
 * @param block - Placed tree block entity.
 * @param placedBlocks - All placed blocks near the tile for surface resolution.
 */
export function resolvingWorldPlazaPlacedTreeInstanceFromBlock(
  block: DefiningWorldBuildingPlacedBlock,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = []
): DefiningWorldPlazaTreeInstance {
  const tileX = block.tilePosition.tileX;
  const tileY = block.tilePosition.tileY;
  const variant = resolvingWorldPlazaTreeVariantFromPlacedBlockDefinitionId(
    block.definitionId
  );
  const species = resolvingWorldPlazaTreeSpeciesForVariant(variant);
  const standingSurfaceLayer = Math.max(
    resolvingWorldPlazaBaseSurfaceLayerAtTileIndex(tileX, tileY, placedBlocks),
    resolvingWorldBuildingPlacedBlockWorldLayer(block)
  );
  const growthStage = resolvingWorldPlazaTreeGrowthStageFromPlacedBlockMetadata(
    block.metadata
  );
  const visualSurfaceLayer =
    computingWorldPlazaTreePlacedVisualLayerFromGrowthStage(
      tileX,
      tileY,
      growthStage
    );

  const tree: DefiningWorldPlazaTreeInstance = {
    tileX,
    tileY,
    variant,
    trunkColor: species.trunkColor,
    canopyColors: species.canopyColors,
    scale: species.minScale,
    collisionRadiusGrid: species.collisionRadiusGrid,
    offsetXPx: 0,
    offsetYPx: 0,
    seed: computingWorldPlazaTreeSeedFromPlacedBlockId(block.blockId),
    standingSurfaceLayer,
    visualSurfaceLayer,
    growthStage,
    placedBlockId: block.blockId,
  };

  return {
    ...tree,
    collisionRadiusGrid:
      resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(tree),
  };
}

/**
 * Finds a placed natural tree block on a tile, if any.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Placed blocks near the tile.
 */
export function findingWorldPlazaPlacedTreeBlockAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): DefiningWorldBuildingPlacedBlock | null {
  const blocksAtTile = placedBlocksByTile
    ? listingWorldBuildingPlacedBlocksAtTileFromIndex(
        placedBlocksByTile,
        tileX,
        tileY
      )
    : placedBlocks;

  for (const block of blocksAtTile) {
    if (
      !placedBlocksByTile &&
      (block.tilePosition.tileX !== tileX || block.tilePosition.tileY !== tileY)
    ) {
      continue;
    }

    if (
      checkingWorldBuildingBlockDefinitionIdIsNaturalTree(block.definitionId)
    ) {
      return block;
    }
  }

  return null;
}
