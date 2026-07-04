import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from "@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex";
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from "@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex";
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from "@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_AVATAR_BODY_BEHIND_OCCLUDER_GRID_Y_TOLERANCE,
  DEFINING_WORLD_PLAZA_AVATAR_BODY_BEHIND_OCCLUDER_SCREEN_Y_TOLERANCE_PX,
  DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN,
} from "@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants";
import { checkingWorldPlazaStoneDecorationUsesColumnRockRendering } from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from "@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";
import { resolvingWorldPlazaIsometricEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex";
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex";
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";
import { resolvingWorldPlazaTreeTrunkEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex";

/**
 * Lowest allowed avatar body z-index when tucked behind nearby foreground columns.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders
 */

/** Tile radius scanned for foreground columns that can occlude the avatar body. */
const DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_FOOTPRINT_TILE_RADIUS = 1;

/**
 * Returns the strictest body z-index cap imposed by nearby columns that sort in
 * front of the avatar foot.
 *
 * The on-block depth bias lets the avatar win its own tile, but that bump can
 * beat adjacent columns once the player is pressed against a collision edge
 * even though the sprite should tuck behind the stack. Clamping to each
 * foreground column keeps terrain hills, placed blocks, boulders, and trees
 * occluding correctly at close range. Columns behind the avatar are skipped.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param centerTileX - Avatar center tile column index.
 * @param centerTileY - Avatar center tile row index.
 * @param standingLayer - Walkable world layer under the avatar.
 * @param placedBlocks - Placed blocks near the footprint.
 */
export function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders(
  gridPoint: DefiningWorldPlazaWorldPoint,
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): number {
  const avatarFootDepthEntityZIndex =
    resolvingWorldPlazaIsometricEntityZIndex(gridPoint);
  let minStandingZIndexCap = Number.POSITIVE_INFINITY;

  for (
    let tileOffsetY =
      -DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_FOOTPRINT_TILE_RADIUS;
    tileOffsetY <=
    DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_FOOTPRINT_TILE_RADIUS;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX =
        -DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_FOOTPRINT_TILE_RADIUS;
      tileOffsetX <=
      DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_FOOTPRINT_TILE_RADIUS;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;

      minStandingZIndexCap = Math.min(
        minStandingZIndexCap,
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontTerrainColumn(
          gridPoint,
          tileX,
          tileY,
          standingLayer,
          avatarFootDepthEntityZIndex,
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontPlacedBlockColumn(
          gridPoint,
          tileX,
          tileY,
          standingLayer,
          placedBlocks,
          avatarFootDepthEntityZIndex,
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontColumnRock(
          gridPoint,
          tileX,
          tileY,
          standingLayer,
          avatarFootDepthEntityZIndex,
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontTree(
          gridPoint,
          tileX,
          tileY,
          placedBlocks,
          avatarFootDepthEntityZIndex,
        ),
      );
    }
  }

  return minStandingZIndexCap;
}

/**
 * @returns Cap from one terrain elevation column, or positive infinity when none applies.
 */
function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontTerrainColumn(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  standingLayer: number,
  avatarFootDepthEntityZIndex: number,
): number {
  const terrainSurfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);

  if (terrainSurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return Number.POSITIVE_INFINITY;
  }

  if (
    checkingWorldPlazaAvatarBodyIsStandingOnColumnTopAtTileIndex(
      terrainSurfaceLayer,
      standingLayer,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const terrainColumnEntityZIndex =
    resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY);

  if (
    !checkingWorldPlazaAvatarBodyShouldTuckBehindColumnFootAtTileIndex(
      gridPoint,
      tileX,
      tileY,
      terrainColumnEntityZIndex,
      avatarFootDepthEntityZIndex,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    terrainColumnEntityZIndex,
  );
}

/**
 * @returns Cap from one placed block column, or positive infinity when none applies.
 */
function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontPlacedBlockColumn(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  avatarFootDepthEntityZIndex: number,
): number {
  if (
    !checkingWorldPlazaTileHasPlacedBlockColumnAtTileIndex(
      tileX,
      tileY,
      placedBlocks,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const placedBlockSurfaceLayer = resolvingWorldBuildingSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
  );

  if (
    checkingWorldPlazaAvatarBodyIsStandingOnColumnTopAtTileIndex(
      placedBlockSurfaceLayer,
      standingLayer,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const placedBlockColumnEntityZIndex =
    resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      tileX,
      tileY,
      placedBlockSurfaceLayer,
    );

  if (
    !checkingWorldPlazaAvatarBodyShouldTuckBehindColumnFootAtTileIndex(
      gridPoint,
      tileX,
      tileY,
      placedBlockColumnEntityZIndex,
      avatarFootDepthEntityZIndex,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    placedBlockColumnEntityZIndex,
  );
}

/**
 * @returns Cap from one procedural column rock, or positive infinity when none applies.
 */
function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontColumnRock(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  standingLayer: number,
  avatarFootDepthEntityZIndex: number,
): number {
  const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
    tileX,
    tileY,
  );
  const rockSurfaceLayer =
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY);

  if (
    !columnRockMetadata ||
    !checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
      columnRockMetadata.sizeTierIndex,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  if (
    checkingWorldPlazaAvatarBodyIsStandingOnColumnTopAtTileIndex(
      rockSurfaceLayer,
      standingLayer,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const rockColumnEntityZIndex = resolvingWorldPlazaTerrainRockColumnEntityZIndex(
    columnRockMetadata.anchorTileX,
    columnRockMetadata.anchorTileY,
    columnRockMetadata,
  );

  if (
    !checkingWorldPlazaAvatarBodyShouldTuckBehindColumnFootAtTileIndex(
      gridPoint,
      columnRockMetadata.anchorTileX,
      columnRockMetadata.anchorTileY,
      rockColumnEntityZIndex,
      avatarFootDepthEntityZIndex,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    rockColumnEntityZIndex,
  );
}

/**
 * @returns Cap from one procedural tree, or positive infinity when none applies.
 */
function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontTree(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  avatarFootDepthEntityZIndex: number,
): number {
  const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
    tileX,
    tileY,
    placedBlocks,
  );

  if (
    !tree ||
    !checkingWorldPlazaAvatarBodyShouldTuckBehindFrontTree(
      gridPoint,
      tree,
      avatarFootDepthEntityZIndex,
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const trunkEntityZIndex = resolvingWorldPlazaTreeTrunkEntityZIndex(
    tree.tileX,
    tree.tileY,
  );
  const terrainColumnEntityZIndex =
    resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
      tree.tileX,
      tree.tileY,
    );

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    Math.max(trunkEntityZIndex, terrainColumnEntityZIndex),
  );
}

/** Subtracts the tuck margin from a foreground column's entity sort key. */
function computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
  occluderEntityZIndex: number,
): number {
  return (
    occluderEntityZIndex -
    DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN
  );
}

/** Returns true when the tile has a placed block that renders as a column stack. */
function checkingWorldPlazaTileHasPlacedBlockColumnAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): boolean {
  for (const block of placedBlocks) {
    if (
      block.tilePosition.tileX !== tileX ||
      block.tilePosition.tileY !== tileY ||
      checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering(block)
    ) {
      continue;
    }

    const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

    if (definition && checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true when the avatar stands at-or-above the walkable top of a column.
 *
 * @param columnSurfaceLayer - Walkable top layer of the column.
 * @param standingLayer - Walkable world layer under the avatar.
 */
function checkingWorldPlazaAvatarBodyIsStandingOnColumnTopAtTileIndex(
  columnSurfaceLayer: number,
  standingLayer: number,
): boolean {
  return standingLayer >= columnSurfaceLayer;
}

/**
 * Returns true when the avatar should tuck behind a column foot at a tile.
 *
 * Uses projected screen Y (not only the biased foot z-index) so collision
 * resolution that nudges the player slightly south still tucks behind thin
 * trunks and block edges. Falls back to the classic foot-depth comparison when
 * the avatar is clearly south on screen.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param columnTileX - Column foot tile column index.
 * @param columnTileY - Column foot tile row index.
 * @param columnEntityZIndex - Entity sort key of the column graphics.
 * @param avatarFootDepthEntityZIndex - Unbiased avatar foot sort key.
 */
function checkingWorldPlazaAvatarBodyShouldTuckBehindColumnFootAtTileIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  columnTileX: number,
  columnTileY: number,
  columnEntityZIndex: number,
  avatarFootDepthEntityZIndex: number,
): boolean {
  const avatarFootScreenY = resolvingWorldPlazaAvatarFootScreenY(gridPoint);
  const columnFootScreenY = resolvingWorldPlazaAvatarFootScreenY({
    x: columnTileX,
    y: columnTileY,
  });
  const screenYDeltaPx = avatarFootScreenY - columnFootScreenY;

  if (
    screenYDeltaPx <
    -DEFINING_WORLD_PLAZA_AVATAR_BODY_BEHIND_OCCLUDER_SCREEN_Y_TOLERANCE_PX
  ) {
    return true;
  }

  if (
    screenYDeltaPx <=
      DEFINING_WORLD_PLAZA_AVATAR_BODY_BEHIND_OCCLUDER_SCREEN_Y_TOLERANCE_PX &&
    gridPoint.y <
      columnTileY + DEFINING_WORLD_PLAZA_AVATAR_BODY_BEHIND_OCCLUDER_GRID_Y_TOLERANCE
  ) {
    return true;
  }

  return columnEntityZIndex > avatarFootDepthEntityZIndex;
}

/**
 * Whether the avatar should tuck behind a nearby tree.
 *
 * No contact-circle gate: the standing terrain bump can lift the avatar above
 * a trunk from a full tile away (well outside collision contact), so any tree
 * in the scanned neighborhood is a tuck candidate. The shared column-foot test
 * still keeps the avatar in front of trees it stands clearly south of.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param tree - Candidate tree instance.
 * @param avatarFootDepthEntityZIndex - Unbiased foot depth sort key.
 */
function checkingWorldPlazaAvatarBodyShouldTuckBehindFrontTree(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tree: DefiningWorldPlazaTreeInstance,
  avatarFootDepthEntityZIndex: number,
): boolean {
  const trunkEntityZIndex = resolvingWorldPlazaTreeTrunkEntityZIndex(
    tree.tileX,
    tree.tileY,
  );

  return checkingWorldPlazaAvatarBodyShouldTuckBehindColumnFootAtTileIndex(
    gridPoint,
    tree.tileX,
    tree.tileY,
    trunkEntityZIndex,
    avatarFootDepthEntityZIndex,
  );
}

/** Projects an avatar or column foot to screen Y for depth comparisons. */
function resolvingWorldPlazaAvatarFootScreenY(
  gridPoint: DefiningWorldPlazaWorldPoint,
): number {
  return convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint).y;
}
