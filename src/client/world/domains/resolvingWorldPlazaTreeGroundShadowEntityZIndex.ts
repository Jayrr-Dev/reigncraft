import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
  DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS,
} from "@/components/world/domains/definingWorldPlazaTreeGroundShadowConstants";
import { resolvingWorldPlazaIsometricEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex";
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex";

/**
 * Entity-layer depth sort key for tree ground shadows.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeGroundShadowEntityZIndex
 */

/**
 * Returns the highest entity z-index among coplanar tiles under a tree shadow.
 *
 * @param tileX - Tree tile column index.
 * @param tileY - Tree tile row index.
 * @param surfaceLayer - Walkable surface layer under the tree.
 */
function resolvingWorldPlazaTreeGroundShadowMaxCoplanarTerrainEntityZIndex(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
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
        resolvingWorldPlazaSurfaceLayerAtTileIndex(
          neighborTileX,
          neighborTileY,
        ) !== surfaceLayer
      ) {
        continue;
      }

      maxTerrainEntityZ = Math.max(
        maxTerrainEntityZ,
        resolvingWorldPlazaIsometricEntityZIndex({
          x: neighborTileX,
          y: neighborTileY,
        }),
      );
    }
  }

  if (!Number.isFinite(maxTerrainEntityZ)) {
    return resolvingWorldPlazaIsometricEntityZIndex({
      x: tileX,
      y: tileY,
    });
  }

  return maxTerrainEntityZ;
}

/**
 * Returns the z-index for a tree shadow on the entity avatar sub-layer.
 *
 * On raised tiles, sorts above every coplanar terrain column the ellipse can
 * overlap so adjacent cap tiles no longer clip the shadow.
 *
 * @param tileX - Tree tile column index.
 * @param tileY - Tree tile row index.
 */
export function resolvingWorldPlazaTreeGroundShadowEntityZIndex(
  tileX: number,
  tileY: number,
): number {
  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY);

  if (surfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return (
      resolvingWorldPlazaIsometricEntityZIndex({
        x: tileX,
        y: tileY,
      }) + DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_ENTITY_DEPTH_BIAS
    );
  }

  return (
    resolvingWorldPlazaTreeGroundShadowMaxCoplanarTerrainEntityZIndex(
      tileX,
      tileY,
      surfaceLayer,
    ) + DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_ENTITY_DEPTH_BIAS
  );
}
