import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from "@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex";
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from "@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex";
import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS } from "@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants";
import { checkingWorldPlazaStoneDecorationUsesColumnRockRendering } from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex";
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex";
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex";

/**
 * Resolves the highest column occluder z-index under an avatar shadow footprint.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarGroundShadowMaxOccluderEntityZIndexInFootprint
 */

/**
 * Tile radius for placed-block shadow occlusion. Placed blocks are discrete, so
 * they only overlap the foot-shadow ellipse when directly adjacent. Keeping this
 * tighter than the terrain radius stops distant blocks from yanking the shadow
 * to a far-back depth where it visually disappears.
 */
const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_PLACED_BLOCK_OCCLUDER_TILE_RADIUS = 1;

/**
 * Returns the highest entity z-index for column geometry that should occlude the
 * avatar shadow ellipse in the footprint.
 *
 * Skips columns the player is already standing on top of so hill and boulder caps
 * can still receive a foot shadow. Every other raised column in the footprint can
 * overlap the soft ellipse in screen space even when the player sorts in front.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param standingLayer - Walkable world layer under the avatar.
 * @param placedBlocks - Placed blocks near the footprint (occlude the shadow).
 */
export function resolvingWorldPlazaAvatarGroundShadowMaxOccluderEntityZIndexInFootprint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): number | null {
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  let maxOccluderEntityZ = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <= DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <= DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;

      const terrainSurfaceLayer =
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);

      if (
        terrainSurfaceLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
        standingLayer < terrainSurfaceLayer
      ) {
        maxOccluderEntityZ = Math.max(
          maxOccluderEntityZ,
          resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY),
        );
      }

      const isOwnTile = tileOffsetX === 0 && tileOffsetY === 0;
      const isPlacedBlockOccluderTile =
        !isOwnTile &&
        Math.abs(tileOffsetX) <=
          DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_PLACED_BLOCK_OCCLUDER_TILE_RADIUS &&
        Math.abs(tileOffsetY) <=
          DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_PLACED_BLOCK_OCCLUDER_TILE_RADIUS;

      if (isPlacedBlockOccluderTile) {
        const placedBlockSurfaceLayer =
          resolvingWorldBuildingSurfaceLayerAtTileIndex(
            tileX,
            tileY,
            placedBlocks,
          );

        if (
          placedBlockSurfaceLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
          standingLayer < placedBlockSurfaceLayer
        ) {
          maxOccluderEntityZ = Math.max(
            maxOccluderEntityZ,
            resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
              tileX,
              tileY,
              placedBlockSurfaceLayer,
            ),
          );
        }
      }

      const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
        tileX,
        tileY,
      );
      const rockSurfaceLayer =
        resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(
          tileX,
          tileY,
        );

      if (
        columnRockMetadata &&
        checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
          columnRockMetadata.sizeTierIndex,
        ) &&
        standingLayer < rockSurfaceLayer
      ) {
        maxOccluderEntityZ = Math.max(
          maxOccluderEntityZ,
          resolvingWorldPlazaTerrainRockColumnEntityZIndex(
            columnRockMetadata.anchorTileX,
            columnRockMetadata.anchorTileY,
            columnRockMetadata,
          ),
        );
      }
    }
  }

  if (!Number.isFinite(maxOccluderEntityZ)) {
    return null;
  }

  return maxOccluderEntityZ;
}
