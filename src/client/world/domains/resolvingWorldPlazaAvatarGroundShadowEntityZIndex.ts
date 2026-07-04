import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { checkingWorldPlazaTileHasColumnRockAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN,
  DEFINING_WORLD_PLAZA_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS,
} from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_ON_BLOCK_DEPTH_BIAS } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_AVATAR_STANDING_DEPTH_BIAS } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import {
  resolvingWorldPlazaAvatarBodyHardFloorEntityZIndexFromFootReachingColumns,
  resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders,
} from '@/components/world/domains/resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders';
import { resolvingWorldPlazaAvatarGroundShadowMaxOccluderEntityZIndexInFootprint } from '@/components/world/domains/resolvingWorldPlazaAvatarGroundShadowMaxOccluderEntityZIndexInFootprint';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaIsometricEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex';

/**
 * Entity-layer depth sort key for avatar ground shadows.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarGroundShadowEntityZIndex
 */

export { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS };

/**
 * Returns the highest entity z-index among coplanar terrain tiles under the shadow.
 *
 * Only same-layer procedural terrain is considered so taller neighbors and placed
 * blocks in front of the player still occlude the shadow correctly.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param standingLayer - Walkable surface layer under the avatar.
 */
function resolvingWorldPlazaAvatarGroundShadowMaxCoplanarTerrainEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number
): number {
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  let maxTerrainEntityZ = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <=
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <=
      DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;

      if (
        resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY) !==
        standingLayer
      ) {
        continue;
      }

      maxTerrainEntityZ = Math.max(
        maxTerrainEntityZ,
        resolvingWorldPlazaIsometricEntityZIndex({
          x: tileX,
          y: tileY,
        })
      );
    }
  }

  if (!Number.isFinite(maxTerrainEntityZ)) {
    return resolvingWorldPlazaIsometricEntityZIndex(gridPoint);
  }

  return maxTerrainEntityZ;
}

/**
 * Keeps avatar shadows below nearby column geometry the ellipse can overlap.
 *
 * Foot-depth shadows inherit the player's sort key (+1), so when the player
 * stands in front of a boulder, cliff, or placed block the shadow would
 * otherwise paint on top of that column. Clamp below every occluder in the
 * footprint unless the player is already standing on that column's top surface.
 *
 * @param playerShadowZ - Default shadow z-index from the avatar foot position.
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param standingLayer - Walkable world layer under the avatar.
 * @param placedBlocks - Placed blocks near the footprint (occlude the shadow).
 */
function resolvingWorldPlazaAvatarGroundShadowEntityZIndexBelowNearbyOccluders(
  playerShadowZ: number,
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): number {
  const maxOccluderEntityZ =
    resolvingWorldPlazaAvatarGroundShadowMaxOccluderEntityZIndexInFootprint(
      gridPoint,
      standingLayer,
      placedBlocks
    );

  if (maxOccluderEntityZ === null) {
    return playerShadowZ;
  }

  return Math.min(playerShadowZ, maxOccluderEntityZ - 1);
}

/**
 * Returns the z-index for an avatar shadow on the entity layer.
 *
 * Sorts at foot depth (bias +1), not avatar body depth (+80), so column rocks,
 * foreground terrain, and placed blocks occlude the shadow when the player is
 * behind them. On raised terrain, bumps above coplanar hill caps only.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param placedBlocks - Placed blocks near the footprint (occlude the shadow).
 */
export function resolvingWorldPlazaAvatarGroundShadowEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = []
): number {
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(gridPoint);

  if (standingLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return resolvingWorldPlazaAvatarGroundShadowEntityZIndexBelowNearbyOccluders(
      resolvingWorldPlazaIsometricEntityZIndex(gridPoint) +
        DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
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
      placedBlocks
    );
  const standingPlacedBlockColumnEntityZIndex =
    standingPlacedBlockSurfaceLayer >
      DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
    standingLayer >= standingPlacedBlockSurfaceLayer
      ? resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
          centerTileX,
          centerTileY,
          standingPlacedBlockSurfaceLayer
        )
      : Number.NEGATIVE_INFINITY;
  const standingSurfaceEntityZIndex = Math.max(
    resolvingWorldPlazaAvatarGroundShadowMaxCoplanarTerrainEntityZIndex(
      gridPoint,
      standingLayer
    ),
    standingPlacedBlockColumnEntityZIndex
  );

  return resolvingWorldPlazaAvatarGroundShadowEntityZIndexBelowNearbyOccluders(
    standingSurfaceEntityZIndex +
      DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS,
    gridPoint,
    standingLayer,
    placedBlocks
  );
}

/**
 * Footprint radius (in tiles) scanned around the avatar so nearby terrain the
 * avatar stands at-or-above is forced to render below the body, not just the
 * single tile under the feet. Shares the body-sort radius with the
 * front-occluder cap so wide sprites (bear) never overhang a column that
 * neither rule classified.
 */
const DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS =
  DEFINING_WORLD_PLAZA_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS;

/**
 * Returns the highest terrain-column entity z-index in the avatar footprint that
 * the avatar is standing at-or-above.
 *
 * Scans the immediate neighborhood, not only the center tile, so an elevated
 * block on an adjacent tile that is no taller than the avatar's standing surface
 * still sorts beneath the body instead of clipping over it. Columns taller than
 * the avatar's standing layer are skipped so genuine hills can still occlude.
 *
 * @param centerTileX - Avatar center tile column index.
 * @param centerTileY - Avatar center tile row index.
 * @param standingLayer - Walkable world layer under the avatar.
 */
function resolvingWorldPlazaAvatarBodyMaxStandingTerrainColumnEntityZIndex(
  centerTileX: number,
  centerTileY: number,
  standingLayer: number
): number {
  let maxTerrainEntityZ = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <=
    DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <=
      DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;

      if (
        standingLayer <
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY)
      ) {
        continue;
      }

      maxTerrainEntityZ = Math.max(
        maxTerrainEntityZ,
        resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY)
      );
    }
  }

  return maxTerrainEntityZ;
}

/**
 * Returns the highest placed-block-column entity z-index in the avatar footprint
 * that the avatar is standing at-or-above.
 *
 * Mirrors the terrain scan so the block the avatar is standing on (and adjacent
 * blocks no taller than the avatar's surface) sort beneath the body instead of
 * clipping over the legs. Blocks taller than the avatar's standing layer are
 * skipped so the avatar still ducks behind genuinely higher stacks.
 *
 * @param centerTileX - Avatar center tile column index.
 * @param centerTileY - Avatar center tile row index.
 * @param standingLayer - Walkable world layer under the avatar.
 * @param placedBlocks - Placed blocks near the footprint.
 */
function resolvingWorldPlazaAvatarBodyMaxStandingPlacedBlockColumnEntityZIndex(
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  let maxPlacedBlockEntityZ = Number.NEGATIVE_INFINITY;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <=
    DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <=
      DEFINING_WORLD_PLAZA_AVATAR_BODY_TERRAIN_CLEARANCE_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;
      const placedBlockSurfaceLayer =
        resolvingWorldBuildingSurfaceLayerAtTileIndex(
          tileX,
          tileY,
          placedBlocks,
          placedBlocksByTile
        );

      if (
        placedBlockSurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND ||
        standingLayer < placedBlockSurfaceLayer
      ) {
        continue;
      }

      maxPlacedBlockEntityZ = Math.max(
        maxPlacedBlockEntityZ,
        resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
          tileX,
          tileY,
          placedBlockSurfaceLayer
        )
      );
    }
  }

  return maxPlacedBlockEntityZ;
}

/**
 * Returns the avatar body entity-layer z-index for the same grid foot.
 *
 * Raised terrain, mega-boulders, and placed blocks can sort at the same foot
 * depth as the avatar. When the avatar stands on or beside one of those surfaces
 * at-or-above it, bump above it so the cap never clips through the body. Nearby
 * foreground columns (terrain, placed blocks, boulders, trees) clamp the body
 * behind them when pressed against their collision edge.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param placedBlocks - Placed blocks near the footprint.
 */
export function resolvingWorldPlazaAvatarBodyEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const footEntityZIndex =
    resolvingWorldPlazaIsometricEntityZIndex(gridPoint) +
    DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_ON_BLOCK_DEPTH_BIAS;
  const centerTileX = Math.floor(gridPoint.x);
  const centerTileY = Math.floor(gridPoint.y);
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(gridPoint);
  const terrainEntityZIndex =
    resolvingWorldPlazaAvatarBodyMaxStandingTerrainColumnEntityZIndex(
      centerTileX,
      centerTileY,
      standingLayer
    );
  const placedBlockEntityZIndex =
    resolvingWorldPlazaAvatarBodyMaxStandingPlacedBlockColumnEntityZIndex(
      centerTileX,
      centerTileY,
      standingLayer,
      placedBlocks,
      placedBlocksByTile
    );
  let standingBodyZIndex = Math.max(
    footEntityZIndex,
    terrainEntityZIndex +
      DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_ON_BLOCK_DEPTH_BIAS,
    placedBlockEntityZIndex +
      DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_ON_BLOCK_DEPTH_BIAS
  );

  if (
    checkingWorldPlazaTileHasColumnRockAtTileIndex(centerTileX, centerTileY)
  ) {
    const rockSurfaceLayer =
      resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(
        centerTileX,
        centerTileY
      );
    const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
      centerTileX,
      centerTileY
    );

    if (standingLayer >= rockSurfaceLayer && columnRockMetadata) {
      const rockEntityZIndex = resolvingWorldPlazaTerrainRockColumnEntityZIndex(
        columnRockMetadata.anchorTileX,
        columnRockMetadata.anchorTileY,
        columnRockMetadata
      );

      standingBodyZIndex = Math.max(
        standingBodyZIndex,
        rockEntityZIndex +
          DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_AVATAR_STANDING_DEPTH_BIAS
      );
    }
  }

  const frontOccluderStandingZIndexCap =
    resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders(
      gridPoint,
      centerTileX,
      centerTileY,
      standingLayer,
      placedBlocks,
      placedBlocksByTile
    );

  if (frontOccluderStandingZIndexCap !== Number.POSITIVE_INFINITY) {
    standingBodyZIndex = Math.min(
      standingBodyZIndex,
      frontOccluderStandingZIndexCap
    );

    // The cap margin can land below coplanar ground caps at the avatar's feet
    // (e.g. a tree trunk sorts only slightly above its own tile column), which
    // would let the standing surface clip the legs. Raise the capped z back
    // above every foot-reaching floor column when the occluder leaves room;
    // on a true conflict the occluder's hard ceiling (occluder z minus one)
    // wins, because rendering over a taller wall reads far worse than a few
    // cap pixels at the toes.
    const hardFloorEntityZIndex =
      resolvingWorldPlazaAvatarBodyHardFloorEntityZIndexFromFootReachingColumns(
        gridPoint,
        centerTileX,
        centerTileY,
        standingLayer,
        placedBlocks,
        placedBlocksByTile
      );

    if (Number.isFinite(hardFloorEntityZIndex)) {
      const occluderHardCeilingZIndex =
        frontOccluderStandingZIndexCap +
        DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN -
        1;

      standingBodyZIndex = Math.min(
        Math.max(standingBodyZIndex, hardFloorEntityZIndex + 1),
        occluderHardCeilingZIndex
      );
    }
  }

  return standingBodyZIndex;
}
