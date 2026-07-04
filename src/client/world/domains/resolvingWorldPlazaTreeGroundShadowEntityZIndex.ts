import {
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS,
} from "@/components/world/domains/definingWorldPlazaTreeGroundShadowConstants";
import { resolvingWorldPlazaTerrainElevationAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { resolvingWorldPlazaTerrainElevationColumnRenderEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex";

/**
 * Entity-layer depth sort key for tree ground shadows.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeGroundShadowEntityZIndex
 */

function resolvingWorldPlazaTreeGroundShadowTerrainSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  return resolvingWorldPlazaTerrainElevationAtTileIndex(tileX, tileY).surfaceLayer;
}

/**
 * Returns the highest terrain-column render z-index among coplanar tiles under a
 * tree shadow footprint.
 *
 * Matches procedural terrain elevation only (not flat-canopy tree tops) because
 * shadows paint on hill caps. Unified surface layers that include standable
 * canopies would skip neighboring caps and let those tiles clip the halo.
 *
 * @param tileX - Tree tile column index.
 * @param tileY - Tree tile row index.
 * @param terrainSurfaceLayer - Procedural terrain elevation under the tree.
 */
function resolvingWorldPlazaTreeGroundShadowMaxCoplanarTerrainEntityZIndex(
  tileX: number,
  tileY: number,
  terrainSurfaceLayer: number,
): number {
  let maxTerrainEntityZ = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY = -DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <= DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <= DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const neighborTileX = tileX + tileOffsetX;
      const neighborTileY = tileY + tileOffsetY;

      if (
        resolvingWorldPlazaTreeGroundShadowTerrainSurfaceLayerAtTileIndex(
          neighborTileX,
          neighborTileY,
        ) !== terrainSurfaceLayer
      ) {
        continue;
      }

      maxTerrainEntityZ = Math.max(
        maxTerrainEntityZ,
        resolvingWorldPlazaTerrainElevationColumnRenderEntityZIndex(
          neighborTileX,
          neighborTileY,
        ),
      );
    }
  }

  if (!Number.isFinite(maxTerrainEntityZ)) {
    return resolvingWorldPlazaTerrainElevationColumnRenderEntityZIndex(
      tileX,
      tileY,
    );
  }

  return maxTerrainEntityZ;
}

/**
 * Returns the z-index for a tree shadow on the entity avatar sub-layer.
 *
 * Sorts above every coplanar terrain column cap the ellipse can overlap so
 * adjacent hill tiles no longer clip the shadow. Stays below the trunk via the
 * smaller depth bias.
 *
 * @param tileX - Tree tile column index.
 * @param tileY - Tree tile row index.
 */
export function resolvingWorldPlazaTreeGroundShadowEntityZIndex(
  tileX: number,
  tileY: number,
): number {
  const terrainSurfaceLayer =
    resolvingWorldPlazaTreeGroundShadowTerrainSurfaceLayerAtTileIndex(tileX, tileY);

  return (
    resolvingWorldPlazaTreeGroundShadowMaxCoplanarTerrainEntityZIndex(
      tileX,
      tileY,
      terrainSurfaceLayer,
    ) + DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_ENTITY_DEPTH_BIAS
  );
}
