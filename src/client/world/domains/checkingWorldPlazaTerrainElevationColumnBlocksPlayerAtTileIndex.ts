import { checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  checkingWorldCollisionVerticalColumnBlocksPlayer,
} from '@/components/world/collision/domains/checkingWorldCollisionVerticalColumnRule';
import {
  checkingWorldPlazaTerrainElevationIsWalkableStepForPlayerLayer,
  checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex,
} from "@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer } from "@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex";

/**
 * Procedural terrain column collision aligned with placed tile columns.
 *
 * @module components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex
 */

/** Context used to ignore platform columns behind the player's movement. */
export interface CheckingWorldPlazaTerrainElevationColumnCollisionContext {
  /** Player footprint center X in grid space. */
  playerCenterX: number;
  /** Player footprint center Y in grid space. */
  playerCenterY: number;
  /** Grid movement applied this frame before collision. */
  movementDeltaX: number;
  /** Grid movement applied this frame before collision. */
  movementDeltaY: number;
}

/**
 * Dot-product threshold below which a raised column sits behind movement and
 * should not block a ledge drop (platform lip the player already left).
 */
export const CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CLIFF_LIP_MOVEMENT_DOT_THRESHOLD =
  -0.05 as const;

/** Minimum movement length before cliff-lip relief applies. */
export const CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CLIFF_LIP_MOVEMENT_MIN_GRID =
  1e-5 as const;

/**
 * Returns the downward extrusion height of a terrain column in world layers.
 *
 * Columns rest on ground (layer 1) and extrude up to the procedural surface.
 *
 * @param terrainSurfaceLayer - Top surface layer of the terrain column.
 */
function resolvingWorldPlazaTerrainElevationColumnBlockHeightLayers(
  terrainSurfaceLayer: number,
): number {
  return terrainSurfaceLayer;
}

/**
 * Returns true when a raised terrain tile is a standable platform surface.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainElevationHasStandablePlatformAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY);
}

/**
 * Returns true when a raised column behind the current move should be ignored
 * so the avatar can walk off a ledge without snagging the platform lip.
 *
 * @param tileX - Candidate column tile column index.
 * @param tileY - Candidate column tile row index.
 * @param collisionContext - Player center and frame movement delta.
 */
function checkingWorldPlazaTerrainElevationCliffLipColumnIsBehindMovement(
  tileX: number,
  tileY: number,
  collisionContext: CheckingWorldPlazaTerrainElevationColumnCollisionContext,
): boolean {
  const movementDistance = Math.hypot(
    collisionContext.movementDeltaX,
    collisionContext.movementDeltaY,
  );

  if (
    movementDistance <
    CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CLIFF_LIP_MOVEMENT_MIN_GRID
  ) {
    return false;
  }

  const toTileDeltaX = tileX - collisionContext.playerCenterX;
  const toTileDeltaY = tileY - collisionContext.playerCenterY;
  const toTileDistance = Math.hypot(toTileDeltaX, toTileDeltaY);

  if (
    toTileDistance <
    CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CLIFF_LIP_MOVEMENT_MIN_GRID
  ) {
    return false;
  }

  const movementAlignment =
    (toTileDeltaX / toTileDistance) *
      (collisionContext.movementDeltaX / movementDistance) +
    (toTileDeltaY / toTileDistance) *
      (collisionContext.movementDeltaY / movementDistance);

  return (
    movementAlignment <
    CHECKING_WORLD_PLAZA_TERRAIN_ELEVATION_CLIFF_LIP_MOVEMENT_DOT_THRESHOLD
  );
}

/**
 * Returns true when the procedural column on a tile blocks the player horizontally.
 *
 * Mirrors placed tile-column rules: one-layer walk steps, jump clearance mid-arc,
 * and unjumpable walls when the surface is more than four layers above the player.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param playerLayer - Current player standing layer.
 * @param applyBlockCollision - Whether full block collision is active this frame.
 * @param collisionContext - Optional player center and movement for ledge lip relief.
 */
export function checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex(
  tileX: number,
  tileY: number,
  playerLayer: number,
  applyBlockCollision: boolean,
  collisionContext?: CheckingWorldPlazaTerrainElevationColumnCollisionContext,
): boolean {
  if (
    checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer(
      tileX,
      tileY,
      playerLayer,
    )
  ) {
    return false;
  }

  const terrainSurfaceLayer = resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
    tileX,
    tileY,
  );

  if (terrainSurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return false;
  }

  if (playerLayer >= terrainSurfaceLayer) {
    return false;
  }

  if (
    checkingWorldPlazaTerrainElevationIsWalkableStepForPlayerLayer(
      playerLayer,
      tileX,
      tileY,
    )
  ) {
    return false;
  }

  const blockHeightLayers = resolvingWorldPlazaTerrainElevationColumnBlockHeightLayers(
    terrainSurfaceLayer,
  );

  return checkingWorldCollisionVerticalColumnBlocksPlayer({
    playerLayer,
    surfaceLayer: terrainSurfaceLayer,
    applyBlockCollision,
    isWalkableStep: false,
    verticalBandsOverlap: checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(
      playerLayer,
      terrainSurfaceLayer,
      blockHeightLayers,
    ),
    cliffLipRelief:
      collisionContext !== undefined &&
      checkingWorldPlazaTerrainElevationCliffLipColumnIsBehindMovement(
        tileX,
        tileY,
        collisionContext,
      ),
  });
}
