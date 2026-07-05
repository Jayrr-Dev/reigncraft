import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import {
  DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
  DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS,
  DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_PLACED_BLOCK_OCCLUDER_TILE_RADIUS,
} from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import type { DefiningWorldDepthProviderContext } from '@/components/world/depth/domains/definingWorldDepthProvider';
import { DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS } from '@/components/world/depth/domains/definingWorldDepthProviderRegistry';
import { checkingWorldPlazaStoneDecorationUsesColumnRockRendering } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaIsometricEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex';

/**
 * Avatar ground shadow entity-layer sort key.
 *
 * @module components/world/depth/domains/resolvingWorldDepthAvatarShadowSortKey
 */

function resolvingWorldDepthAvatarShadowMaxCoplanarTerrainSortKey(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number
): number {
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  let maxTerrainSortKey = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY = -DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <= DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <= DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;

      if (
        resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY) !== standingLayer
      ) {
        continue;
      }

      maxTerrainSortKey = Math.max(
        maxTerrainSortKey,
        resolvingWorldPlazaIsometricEntityZIndex({ x: tileX, y: tileY })
      );
    }
  }

  if (!Number.isFinite(maxTerrainSortKey)) {
    return computingWorldDepthSortKey(gridPoint);
  }

  return maxTerrainSortKey;
}

function resolvingWorldDepthAvatarShadowMaxOccluderSortKeyInFootprint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = []
): number | null {
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  let maxOccluderSortKey = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY = -DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <= DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <= DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;

      for (const provider of DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS) {
        if (!provider.participatesInShadowOcclusion) {
          continue;
        }

        const surfaceLayer = provider.resolvingSurfaceLayerAtTileIndex(
          tileX,
          tileY,
          { placedBlocks }
        );

        if (
          surfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND ||
          standingLayer >= surfaceLayer
        ) {
          continue;
        }

        const isOwnTile = tileOffsetX === 0 && tileOffsetY === 0;
        const isPlacedBlockTile =
          provider.id === 'placedBlockColumn' &&
          !isOwnTile &&
          Math.abs(tileOffsetX) <=
            DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_PLACED_BLOCK_OCCLUDER_TILE_RADIUS &&
          Math.abs(tileOffsetY) <=
            DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_PLACED_BLOCK_OCCLUDER_TILE_RADIUS;

        if (provider.id === 'placedBlockColumn' && !isPlacedBlockTile) {
          continue;
        }

        maxOccluderSortKey = Math.max(
          maxOccluderSortKey,
          provider.resolvingSortKeyAtTileIndex(tileX, tileY, { placedBlocks })
        );
      }

      const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
        tileX,
        tileY
      );
      const rockSurfaceLayer =
        resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY);

      if (
        columnRockMetadata &&
        checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
          columnRockMetadata.sizeTierIndex
        ) &&
        standingLayer < rockSurfaceLayer
      ) {
        maxOccluderSortKey = Math.max(
          maxOccluderSortKey,
          resolvingWorldPlazaTerrainRockColumnEntityZIndex(
            columnRockMetadata.anchorTileX,
            columnRockMetadata.anchorTileY,
            columnRockMetadata
          )
        );
      }
    }
  }

  if (!Number.isFinite(maxOccluderSortKey)) {
    return null;
  }

  return maxOccluderSortKey;
}

function resolvingWorldDepthAvatarShadowBelowNearbyOccluders(
  playerShadowSortKey: number,
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): number {
  const maxOccluderSortKey =
    resolvingWorldDepthAvatarShadowMaxOccluderSortKeyInFootprint(
      gridPoint,
      standingLayer,
      placedBlocks
    );

  if (maxOccluderSortKey === null) {
    return playerShadowSortKey;
  }

  return Math.min(playerShadowSortKey, maxOccluderSortKey - 1);
}

/**
 * Returns the z-index for an avatar shadow on the entity layer.
 */
export function resolvingWorldDepthAvatarShadowSortKey(
  gridPoint: DefiningWorldPlazaWorldPoint,
  context: DefiningWorldDepthProviderContext = {}
): number {
  const placedBlocks = context.placedBlocks ?? [];
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(gridPoint);

  if (standingLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return resolvingWorldDepthAvatarShadowBelowNearbyOccluders(
      computingWorldDepthSortKey(gridPoint) +
        DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
      gridPoint,
      standingLayer,
      placedBlocks
    );
  }

  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  const standingPlacedBlockSurfaceLayer =
    resolvingWorldBuildingSurfaceLayerAtTileIndex(
      centerTileX,
      centerTileY,
      placedBlocks,
      context.placedBlocksByTile
    );
  const standingPlacedBlockColumnSortKey =
    standingPlacedBlockSurfaceLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
    standingLayer >= standingPlacedBlockSurfaceLayer
      ? resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
          centerTileX,
          centerTileY,
          standingPlacedBlockSurfaceLayer
        )
      : Number.NEGATIVE_INFINITY;
  const standingSurfaceSortKey = Math.max(
    resolvingWorldDepthAvatarShadowMaxCoplanarTerrainSortKey(
      gridPoint,
      standingLayer
    ),
    standingPlacedBlockColumnSortKey
  );

  return resolvingWorldDepthAvatarShadowBelowNearbyOccluders(
    standingSurfaceSortKey + DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
    gridPoint,
    standingLayer,
    placedBlocks
  );
}
