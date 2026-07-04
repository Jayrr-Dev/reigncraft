import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from "@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex";
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from "@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex";
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from "@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
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
          tileX,
          tileY,
          standingLayer,
          avatarFootDepthEntityZIndex,
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontPlacedBlockColumn(
          tileX,
          tileY,
          standingLayer,
          placedBlocks,
          avatarFootDepthEntityZIndex,
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontColumnRock(
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

  if (terrainColumnEntityZIndex <= avatarFootDepthEntityZIndex) {
    return Number.POSITIVE_INFINITY;
  }

  return terrainColumnEntityZIndex - 1;
}

/**
 * @returns Cap from one placed block column, or positive infinity when none applies.
 */
function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontPlacedBlockColumn(
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

  if (placedBlockColumnEntityZIndex <= avatarFootDepthEntityZIndex) {
    return Number.POSITIVE_INFINITY;
  }

  return placedBlockColumnEntityZIndex - 1;
}

/**
 * @returns Cap from one procedural column rock, or positive infinity when none applies.
 */
function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontColumnRock(
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

  if (rockColumnEntityZIndex <= avatarFootDepthEntityZIndex) {
    return Number.POSITIVE_INFINITY;
  }

  return rockColumnEntityZIndex - 1;
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

  const treeColumnEntityZIndex =
    resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
      tree.tileX,
      tree.tileY,
    );

  return treeColumnEntityZIndex - 1;
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
 * A column whose top is at or below the avatar's standing layer can never
 * visually occlude the body, so it must not impose a z-index cap. This is a
 * pure layer comparison on purpose: gating on collision-circle overlap made
 * coplanar tiles one step ahead flip the cap on and off as the player moved,
 * which flashed the terrain cap (and the shadow) over the character.
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
 * Whether the avatar should tuck behind a tree that sorts in front of its foot.
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

  if (trunkEntityZIndex <= avatarFootDepthEntityZIndex) {
    return false;
  }

  const deltaX = gridPoint.x - tree.tileX;
  const deltaY = gridPoint.y - tree.tileY;
  const contactDistance =
    tree.collisionRadiusGrid +
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID;

  return Math.hypot(deltaX, deltaY) <= contactDistance;
}
