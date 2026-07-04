import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN } from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaStoneDecorationUsesColumnRockRendering } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';
import { resolvingWorldPlazaTerrainRockColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex';
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

/** Tile radius scanned for foreground columns that can occlude the avatar body. */
const DEFINING_WORLD_PLAZA_AVATAR_BODY_FRONT_OCCLUDER_FOOTPRINT_TILE_RADIUS = 1;

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
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = []
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
          placedBlocks
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
          placedBlocks
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
    !checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(gridPoint, tileX, tileY)
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
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): number {
  if (
    !checkingWorldPlazaTileHasPlacedBlockColumnAtTileIndex(
      tileX,
      tileY,
      placedBlocks
    )
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const placedBlockSurfaceLayer = resolvingWorldBuildingSurfaceLayerAtTileIndex(
    tileX,
    tileY,
    placedBlocks
  );

  if (
    !checkingWorldPlazaColumnIsTallerThanAvatarStandingLayer(
      placedBlockSurfaceLayer,
      standingLayer
    ) ||
    !checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(gridPoint, tileX, tileY)
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

  if (
    !checkingWorldPlazaColumnIsTallerThanAvatarStandingLayer(
      rockSurfaceLayer,
      standingLayer
    ) ||
    !checkingWorldPlazaColumnFootIsInFrontOfAvatarFoot(
      gridPoint,
      columnRockMetadata.anchorTileX,
      columnRockMetadata.anchorTileY
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
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): number {
  const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
    tileX,
    tileY,
    placedBlocks
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
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): boolean {
  for (const block of placedBlocks) {
    if (
      block.tilePosition.tileX !== tileX ||
      block.tilePosition.tileY !== tileY ||
      checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering(block)
    ) {
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
