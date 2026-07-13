import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import { listingWorldBuildingPlacedBlocksAtTileFromIndex } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import type {
  DefiningWorldDepthProvider,
  DefiningWorldDepthProviderContext,
} from '@/components/world/depth/domains/definingWorldDepthProvider';
import { checkingWorldPlazaStoneDecorationUsesColumnRockRendering } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';
import {
  resolvingWorldPlazaTerrainRockColumnDepthSortGridPointFromMetadata,
  resolvingWorldPlazaTerrainRockColumnEntityZIndex,
} from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTreeTrunkEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex';

/**
 * Declarative registry of world-object depth providers.
 *
 * @module components/world/depth/domains/definingWorldDepthProviderRegistry
 */

function checkingWorldDepthPlacedBlockColumnAtTileIndex(
  tileX: number,
  tileY: number,
  context: DefiningWorldDepthProviderContext
): boolean {
  const placedBlocks = context.placedBlocks ?? [];
  const blocksAtTile = context.placedBlocksByTile
    ? listingWorldBuildingPlacedBlocksAtTileFromIndex(
        context.placedBlocksByTile,
        tileX,
        tileY
      )
    : placedBlocks;

  for (const block of blocksAtTile) {
    if (
      !context.placedBlocksByTile &&
      (block.tilePosition.tileX !== tileX || block.tilePosition.tileY !== tileY)
    ) {
      continue;
    }

    if (checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering(block)) {
      continue;
    }

    const definition = resolvingWorldBuildingBlockDefinition(
      block.definitionId
    );

    if (
      definition &&
      checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)
    ) {
      return true;
    }
  }

  return false;
}

const DEFINING_WORLD_DEPTH_TERRAIN_COLUMN_PROVIDER: DefiningWorldDepthProvider =
  {
    id: 'terrainColumn',
    resolvingSurfaceLayerAtTileIndex: (tileX, tileY) =>
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY),
    resolvingSortKeyAtTileIndex: (tileX, tileY) =>
      resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY),
    resolvingDepthSortFootAtTileIndex: (tileX, tileY) => ({
      // Tile center: NW integer foot made rim tiles look "in front" too early
      // and skipped behind-raise while the drawn diamond still covered south.
      x: tileX + 0.5,
      y: tileY + 0.5,
    }),
    alwaysTallerForFrontOcclusion: false,
    participatesInStandingBump: true,
    standingBumpRequiresRaisedSurface: false,
    participatesInFrontOcclusion: true,
    // Terrain columns are solid fill, not walk-under roofs. Same-tile overhead
    // tucked avatars behind plateau tops / cliff faces when their foot still
    // floored onto the raised tile at the rim.
    participatesInSameTileOverheadOcclusion: false,
    participatesInShadowOcclusion: true,
    requiresSilhouetteReachForFrontOcclusion: true,
    checkingHasColumnAtTileIndex: () => true,
  };

const DEFINING_WORLD_DEPTH_PLACED_BLOCK_COLUMN_PROVIDER: DefiningWorldDepthProvider =
  {
    id: 'placedBlockColumn',
    resolvingSurfaceLayerAtTileIndex: (tileX, tileY, context) =>
      resolvingWorldBuildingSurfaceLayerAtTileIndex(
        tileX,
        tileY,
        context.placedBlocks ?? [],
        context.placedBlocksByTile
      ),
    resolvingSortKeyAtTileIndex: (tileX, tileY, context) => {
      const surfaceLayer = resolvingWorldBuildingSurfaceLayerAtTileIndex(
        tileX,
        tileY,
        context.placedBlocks ?? [],
        context.placedBlocksByTile
      );

      return resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        tileX,
        tileY,
        surfaceLayer
      );
    },
    resolvingDepthSortFootAtTileIndex: (tileX, tileY) => ({
      x: tileX,
      y: tileY,
    }),
    alwaysTallerForFrontOcclusion: false,
    participatesInStandingBump: true,
    standingBumpRequiresRaisedSurface: true,
    participatesInFrontOcclusion: true,
    participatesInSameTileOverheadOcclusion: true,
    participatesInShadowOcclusion: true,
    requiresSilhouetteReachForFrontOcclusion: true,
    checkingHasColumnAtTileIndex:
      checkingWorldDepthPlacedBlockColumnAtTileIndex,
  };

const DEFINING_WORLD_DEPTH_COLUMN_ROCK_PROVIDER: DefiningWorldDepthProvider = {
  id: 'columnRock',
  resolvingSurfaceLayerAtTileIndex: (tileX, tileY) =>
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY),
  resolvingSortKeyAtTileIndex: (tileX, tileY) => {
    const metadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
      tileX,
      tileY
    );

    if (
      !metadata ||
      !checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
        metadata.sizeTierIndex
      )
    ) {
      return resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        tileX,
        tileY
      );
    }

    return resolvingWorldPlazaTerrainRockColumnEntityZIndex(
      metadata.anchorTileX,
      metadata.anchorTileY,
      metadata
    );
  },
  resolvingDepthSortFootAtTileIndex: (tileX, tileY) => {
    const metadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
      tileX,
      tileY
    );

    if (
      !metadata ||
      !checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
        metadata.sizeTierIndex
      )
    ) {
      return { x: tileX, y: tileY };
    }

    return resolvingWorldPlazaTerrainRockColumnDepthSortGridPointFromMetadata(
      metadata
    );
  },
  alwaysTallerForFrontOcclusion: false,
  participatesInStandingBump: false,
  standingBumpRequiresRaisedSurface: true,
  participatesInFrontOcclusion: true,
  // Boulders are solid mass, not walk-under roofs. Same-tile overhead tucked
  // avatars behind 1-tile field rocks and mega-boulder footprint tiles when
  // standing south of the drawn body.
  participatesInSameTileOverheadOcclusion: false,
  participatesInShadowOcclusion: true,
  requiresSilhouetteReachForFrontOcclusion: true,
  checkingHasColumnAtTileIndex: (tileX, tileY) => {
    const metadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
      tileX,
      tileY
    );

    return (
      metadata !== null &&
      checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
        metadata.sizeTierIndex
      )
    );
  },
};

const DEFINING_WORLD_DEPTH_TREE_TRUNK_PROVIDER: DefiningWorldDepthProvider = {
  id: 'treeTrunk',
  resolvingSurfaceLayerAtTileIndex: () =>
    DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  resolvingSortKeyAtTileIndex: (tileX, tileY, context) => {
    const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tileX,
      tileY,
      context.placedBlocks ?? [],
      context.placedBlocksByTile
    );

    if (!tree) {
      return resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        tileX,
        tileY
      );
    }

    return Math.max(
      resolvingWorldPlazaTreeTrunkEntityZIndex(tree.tileX, tree.tileY),
      resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
        tree.tileX,
        tree.tileY
      )
    );
  },
  resolvingDepthSortFootAtTileIndex: (tileX, tileY, context) => {
    const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tileX,
      tileY,
      context.placedBlocks ?? [],
      context.placedBlocksByTile
    );

    return tree ? { x: tree.tileX, y: tree.tileY } : { x: tileX, y: tileY };
  },
  alwaysTallerForFrontOcclusion: true,
  participatesInStandingBump: false,
  standingBumpRequiresRaisedSurface: true,
  participatesInFrontOcclusion: true,
  participatesInSameTileOverheadOcclusion: false,
  participatesInShadowOcclusion: false,
  requiresSilhouetteReachForFrontOcclusion: false,
  checkingHasColumnAtTileIndex: (tileX, tileY, context) =>
    resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tileX,
      tileY,
      context.placedBlocks ?? [],
      context.placedBlocksByTile
    ) !== null,
};

const DEFINING_WORLD_DEPTH_TREE_FLAT_CANOPY_PROVIDER: DefiningWorldDepthProvider =
  {
    id: 'treeFlatCanopy',
    resolvingSurfaceLayerAtTileIndex: (tileX, tileY, context) =>
      resolvingWorldPlazaTreeFlatCanopySurfaceLayerAtTileIndex(
        tileX,
        tileY,
        context.placedBlocks ?? [],
        context.placedBlocksByTile
      ),
    resolvingSortKeyAtTileIndex: () => 0,
    resolvingDepthSortFootAtTileIndex: (tileX, tileY) => ({
      x: tileX,
      y: tileY,
    }),
    alwaysTallerForFrontOcclusion: false,
    participatesInStandingBump: false,
    standingBumpRequiresRaisedSurface: true,
    participatesInFrontOcclusion: false,
    participatesInSameTileOverheadOcclusion: false,
    participatesInShadowOcclusion: false,
    requiresSilhouetteReachForFrontOcclusion: false,
    checkingHasColumnAtTileIndex: () => false,
  };

/** Providers that contribute to unified walkable surface resolution. */
export const DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS: readonly DefiningWorldDepthProvider[] =
  [
    DEFINING_WORLD_DEPTH_TERRAIN_COLUMN_PROVIDER,
    DEFINING_WORLD_DEPTH_COLUMN_ROCK_PROVIDER,
    DEFINING_WORLD_DEPTH_PLACED_BLOCK_COLUMN_PROVIDER,
    DEFINING_WORLD_DEPTH_TREE_FLAT_CANOPY_PROVIDER,
  ];

/** Providers scanned for avatar standing bump, front occlusion, and shadow rules. */
export const DEFINING_WORLD_DEPTH_AVATAR_OCCLUSION_PROVIDERS: readonly DefiningWorldDepthProvider[] =
  [
    DEFINING_WORLD_DEPTH_TERRAIN_COLUMN_PROVIDER,
    DEFINING_WORLD_DEPTH_PLACED_BLOCK_COLUMN_PROVIDER,
    DEFINING_WORLD_DEPTH_COLUMN_ROCK_PROVIDER,
    DEFINING_WORLD_DEPTH_TREE_TRUNK_PROVIDER,
  ];

/** Lookup a provider by id. */
export function findingWorldDepthProviderById(
  providerId: DefiningWorldDepthProvider['id']
): DefiningWorldDepthProvider | null {
  return (
    DEFINING_WORLD_DEPTH_AVATAR_OCCLUSION_PROVIDERS.find(
      (provider) => provider.id === providerId
    ) ??
    DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS.find(
      (provider) => provider.id === providerId
    ) ??
    null
  );
}
