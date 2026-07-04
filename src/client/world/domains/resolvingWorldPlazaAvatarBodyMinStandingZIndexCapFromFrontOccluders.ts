import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import {
  listingWorldBuildingPlacedBlocksAtTileFromIndex,
  type IndexingWorldBuildingPlacedBlocksByTile,
} from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN,
  DEFINING_WORLD_PLAZA_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS,
} from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
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
import { resolvingWorldPlazaTreeTrunkEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex';

/**
 * Lowest allowed avatar body z-index when tucked behind nearby foreground columns.
 *
 * A column may impose a z-index ceiling on the avatar body only when BOTH hold:
 *
 * 1. TALLER - its walkable top is strictly above the avatar's standing layer
 *    (`columnSurfaceLayer > standingLayer`). A column the avatar stands
 *    at-or-above can never visually cover the body, so it never caps. Tree
 *    trunks always count as taller.
 * 2. IN FRONT - its foot sorts strictly deeper than the avatar's foot along the
 *    isometric camera axis (`tileX + tileY > gridPoint.x + gridPoint.y`).
 *
 * Both predicates are pure functions of the avatar position with no tolerance
 * bands: collision resolution keeps the avatar footprint outside solid columns,
 * so contact cases always land strictly on one side of the depth boundary.
 * Earlier screen-Y slack made columns level with (or slightly behind) the
 * avatar flip between capping and not capping as the player moved, which
 * flashed terrain caps over the character.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders
 */

/**
 * Tile radius scanned for foreground columns that can occlude the avatar body.
 * Shared with the standing bump so both rules cover the same neighborhood.
 */
const DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_FOOTPRINT_TILE_RADIUS =
  DEFINING_WORLD_PLAZA_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS;

/**
 * Returns the strictest body z-index cap imposed by nearby columns that are
 * both taller than the avatar's standing surface and in front of its foot.
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
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
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
          standingLayer
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontPlacedBlockColumn(
          gridPoint,
          tileX,
          tileY,
          standingLayer,
          placedBlocks,
          placedBlocksByTile
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontColumnRock(
          gridPoint,
          tileX,
          tileY,
          standingLayer
        ),
        resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontTree(
          gridPoint,
          tileX,
          tileY,
          placedBlocks,
          placedBlocksByTile
        )
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
  standingLayer: number
): number {
  const terrainSurfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);

  if (
    terrainSurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND ||
    !checkingWorldPlazaColumnIsTallerThanAvatarStandingLayer(
      terrainSurfaceLayer,
      standingLayer
    ) ||
    !checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(
      gridPoint,
      tileX,
      tileY
    ) ||
    !checkingWorldPlazaColumnSilhouetteReachesAvatarFootOnScreen(
      gridPoint,
      standingLayer,
      tileX,
      tileY,
      terrainSurfaceLayer
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY)
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
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  if (
    !checkingWorldPlazaTileHasPlacedBlockColumnAtTileIndex(
      tileX,
      tileY,
      placedBlocks,
      placedBlocksByTile
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const placedBlockSurfaceLayer = resolvingWorldBuildingSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    placedBlocks,
    placedBlocksByTile
  );

  if (
    !checkingWorldPlazaColumnIsTallerThanAvatarStandingLayer(
      placedBlockSurfaceLayer,
      standingLayer
    ) ||
    !checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(
      gridPoint,
      tileX,
      tileY
    ) ||
    !checkingWorldPlazaColumnSilhouetteReachesAvatarFootOnScreen(
      gridPoint,
      standingLayer,
      tileX,
      tileY,
      placedBlockSurfaceLayer
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      tileX,
      tileY,
      placedBlockSurfaceLayer
    )
  );
}

/**
 * @returns Cap from one procedural column rock, or positive infinity when none applies.
 */
function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontColumnRock(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  standingLayer: number
): number {
  const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
    tileX,
    tileY
  );

  if (
    !columnRockMetadata ||
    !checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
      columnRockMetadata.sizeTierIndex
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const rockSurfaceLayer =
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY);
  // Compare against the renderer's depth-sort foot (pushed toward the front
  // footprint corner), not the rear anchor. An avatar in the walkable pocket
  // behind a mega-boulder sits deeper than the anchor, so an anchor-based
  // in-front test never fires and the avatar paints over the rock body.
  const rockDepthSortGridPoint =
    resolvingWorldPlazaTerrainRockColumnDepthSortGridPointFromMetadata(
      columnRockMetadata
    );

  if (
    !checkingWorldPlazaColumnIsTallerThanAvatarStandingLayer(
      rockSurfaceLayer,
      standingLayer
    ) ||
    !checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(
      gridPoint,
      rockDepthSortGridPoint.x,
      rockDepthSortGridPoint.y
    ) ||
    !checkingWorldPlazaColumnSilhouetteReachesAvatarFootOnScreen(
      gridPoint,
      standingLayer,
      rockDepthSortGridPoint.x,
      rockDepthSortGridPoint.y,
      rockSurfaceLayer
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    resolvingWorldPlazaTerrainRockColumnEntityZIndex(
      columnRockMetadata.anchorTileX,
      columnRockMetadata.anchorTileY,
      columnRockMetadata
    )
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
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
    tileX,
    tileY,
    placedBlocks,
    placedBlocksByTile
  );

  // Trunks always rise above the avatar, so only the in-front test gates them.
  if (
    !tree ||
    !checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(
      gridPoint,
      tree.tileX,
      tree.tileY
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const trunkEntityZIndex = resolvingWorldPlazaTreeTrunkEntityZIndex(
    tree.tileX,
    tree.tileY
  );
  const terrainColumnEntityZIndex =
    resolvingWorldPlazaTerrainElevationColumnEntityZIndex(
      tree.tileX,
      tree.tileY
    );

  return computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
    Math.max(trunkEntityZIndex, terrainColumnEntityZIndex)
  );
}

/** Subtracts the tuck margin from a foreground column's entity sort key. */
function computingWorldPlazaAvatarBodyStandingZIndexCapBehindOccluder(
  occluderEntityZIndex: number
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
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): boolean {
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

/**
 * Returns true when a column's walkable top rises above the avatar's standing
 * layer, meaning the column is able to visually cover the avatar body.
 *
 * The exact complement (`columnSurfaceLayer <= standingLayer`) is the standing
 * bump condition in `resolvingWorldPlazaAvatarBodyEntityZIndex`, so every
 * column is deterministically either a potential ceiling (here) or a potential
 * floor (there) and the two rules can never both claim the same column.
 *
 * @param columnSurfaceLayer - Walkable top layer of the column.
 * @param standingLayer - Walkable world layer under the avatar.
 */
function checkingWorldPlazaColumnIsTallerThanAvatarStandingLayer(
  columnSurfaceLayer: number,
  standingLayer: number
): boolean {
  return columnSurfaceLayer > standingLayer;
}

/**
 * Returns true when a column tile's foot sorts strictly in front of the avatar
 * foot along the isometric camera axis.
 *
 * In 2:1 iso, projected screen Y is proportional to `x + y`, so comparing grid
 * sums is exact and avoids screen-space rounding. Collision resolution keeps
 * the avatar footprint at least its radius outside every solid column square,
 * so pressed-against-a-wall cases resolve strictly on one side of this
 * boundary and no tolerance band is needed.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param columnTileX - Column foot tile column index.
 * @param columnTileY - Column foot tile row index.
 */
function checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(
  gridPoint: DefiningWorldPlazaWorldPoint,
  columnTileX: number,
  columnTileY: number
): boolean {
  return columnTileX + columnTileY > gridPoint.x + gridPoint.y;
}

/**
 * Returns the highest sort key among nearby columns the avatar stands
 * at-or-above whose caps visually reach the avatar's foot line on screen.
 *
 * These are the columns that must stay UNDER the avatar body no matter what:
 * when a front-occluder cap would push the body below them (e.g. tucking
 * behind a tree trunk whose sort bias above its own tile is smaller than the
 * cap margin), the ground caps at the avatar's feet would clip the legs.
 * The body resolver raises the capped z back above this floor whenever the
 * occluder leaves room, and lets the occluder win only on true conflicts.
 *
 * Radius 1 is sufficient: only immediately adjacent coplanar caps can reach
 * the foot line; farther coplanar caps project strictly below it.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param centerTileX - Avatar center tile column index.
 * @param centerTileY - Avatar center tile row index.
 * @param standingLayer - Walkable world layer under the avatar.
 * @param placedBlocks - Placed blocks near the footprint.
 * @param placedBlocksByTile - Optional tile index for placed blocks.
 */
export function resolvingWorldPlazaAvatarBodyHardFloorEntityZIndexFromFootReachingColumns(
  gridPoint: DefiningWorldPlazaWorldPoint,
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  let hardFloorEntityZIndex = Number.NEGATIVE_INFINITY;

  for (let tileOffsetY = -1; tileOffsetY <= 1; tileOffsetY += 1) {
    for (let tileOffsetX = -1; tileOffsetX <= 1; tileOffsetX += 1) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;
      const terrainSurfaceLayer =
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          tileX,
          tileY
        );

      if (
        terrainSurfaceLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
        terrainSurfaceLayer <= standingLayer &&
        checkingWorldPlazaColumnSilhouetteReachesAvatarFootOnScreen(
          gridPoint,
          standingLayer,
          tileX,
          tileY,
          terrainSurfaceLayer
        )
      ) {
        hardFloorEntityZIndex = Math.max(
          hardFloorEntityZIndex,
          resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY)
        );
      }

      if (
        !checkingWorldPlazaTileHasPlacedBlockColumnAtTileIndex(
          tileX,
          tileY,
          placedBlocks,
          placedBlocksByTile
        )
      ) {
        continue;
      }

      const placedBlockSurfaceLayer =
        resolvingWorldBuildingSurfaceLayerAtTileIndex(
          tileX,
          tileY,
          placedBlocks,
          placedBlocksByTile
        );

      if (
        placedBlockSurfaceLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
        placedBlockSurfaceLayer <= standingLayer &&
        checkingWorldPlazaColumnSilhouetteReachesAvatarFootOnScreen(
          gridPoint,
          standingLayer,
          tileX,
          tileY,
          placedBlockSurfaceLayer
        )
      ) {
        hardFloorEntityZIndex = Math.max(
          hardFloorEntityZIndex,
          resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
            tileX,
            tileY,
            placedBlockSurfaceLayer
          )
        );
      }
    }
  }

  return hardFloorEntityZIndex;
}

/**
 * Returns true when a column's projected silhouette can reach the avatar's
 * foot line on screen, meaning it is physically able to cover sprite pixels.
 *
 * Being "in front and taller" is not sufficient to cap the avatar: a short
 * raised column several tiles ahead sorts deeper and rises above the standing
 * layer, yet its graphics never touch the sprite. Capping on it anyway drags
 * the avatar's sort key below the coplanar ground caps at its feet, which then
 * clip the legs. This is an exact projection comparison (both elevation
 * offsets applied), not a tolerance: the column's cap-top corner must rise
 * strictly above the avatar's anchored foot for the cap to apply.
 *
 * @param gridPoint - Avatar grid position (floats allowed).
 * @param standingLayer - Walkable world layer under the avatar.
 * @param columnTileX - Column foot tile column index.
 * @param columnTileY - Column foot tile row index.
 * @param columnSurfaceLayer - Walkable top layer of the column.
 */
function checkingWorldPlazaColumnSilhouetteReachesAvatarFootOnScreen(
  gridPoint: DefiningWorldPlazaWorldPoint,
  standingLayer: number,
  columnTileX: number,
  columnTileY: number,
  columnSurfaceLayer: number
): boolean {
  const avatarFootScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint).y +
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
  const columnCapTopScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: columnTileX,
      y: columnTileY,
    }).y +
    computingWorldBuildingWorldLayerScreenOffsetPx(columnSurfaceLayer) -
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return columnCapTopScreenY < avatarFootScreenY;
}
