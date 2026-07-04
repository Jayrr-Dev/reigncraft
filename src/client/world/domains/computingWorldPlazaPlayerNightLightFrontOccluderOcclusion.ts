import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingSurfaceLayerAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex';

/**
 * Torch dimming when the player tucks behind foreground columns.
 *
 * @module components/world/domains/computingWorldPlazaPlayerNightLightFrontOccluderOcclusion
 */

/** Tile radius scanned around the player for foreground occluding columns. */
const COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_SCAN_TILE_RADIUS = 2;

/** Planar grid distance at (or under) which a front column fully dims the torch. */
const COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_FULL_DISTANCE_GRID = 0.85;

/** Planar grid distance at (or past) which a front column stops dimming the torch. */
const COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_ZERO_DISTANCE_GRID = 2;

/**
 * Screen-Y slack so columns roughly level with the player's feet still count
 * as being in front once the sprite tucks behind them.
 */
const COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_SCREEN_Y_TOLERANCE_PX = 6;

/**
 * Returns true when a tile hosts a column taller than the player's standing
 * layer (placed block stack, tree trunk, boulder, or raised terrain).
 */
function checkingWorldPlazaTileHasOccludingColumnAboveStandingLayer(
  tileX: number,
  tileY: number,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): boolean {
  if (
    resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tileX,
      tileY,
      placedBlocks
    )
  ) {
    return true;
  }

  if (
    resolvingWorldBuildingSurfaceLayerAtTileIndex(tileX, tileY, placedBlocks) >
    standingLayer
  ) {
    return true;
  }

  if (
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY) >
    standingLayer
  ) {
    return true;
  }

  return (
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY) >
    standingLayer
  );
}

/** Smoothstep falloff from 1 (close) to 0 (past the zero distance). */
function computingWorldPlazaFrontOccluderDistanceFalloff(
  distanceGrid: number
): number {
  if (
    distanceGrid <=
    COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_FULL_DISTANCE_GRID
  ) {
    return 1;
  }

  if (
    distanceGrid >=
    COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_ZERO_DISTANCE_GRID
  ) {
    return 0;
  }

  const normalizedFalloff =
    (distanceGrid -
      COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_FULL_DISTANCE_GRID) /
    (COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_ZERO_DISTANCE_GRID -
      COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_FULL_DISTANCE_GRID);
  const strength = 1 - normalizedFalloff;

  return strength * strength * (3 - 2 * strength);
}

/**
 * Returns how strongly foreground columns block the player's torch (0..1).
 *
 * Scans nearby tiles for columns that draw in front of the player (higher
 * projected screen Y) and rise above the player's standing layer. Strength
 * falls off smoothly with planar distance so the torch dims as the player
 * walks behind a block or trunk instead of popping.
 *
 * @param playerPosition - Player position in grid space.
 * @param placedBlocks - Placed blocks near the player.
 */
export function computingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrength(
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = []
): number {
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(playerPosition);
  const playerScreenY =
    convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition).y;
  const centerTileX = Math.floor(playerPosition.x);
  const centerTileY = Math.floor(playerPosition.y);
  const scanRadius =
    COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_SCAN_TILE_RADIUS;
  let maxOcclusionStrength = 0;

  for (
    let tileOffsetY = -scanRadius;
    tileOffsetY <= scanRadius;
    tileOffsetY += 1
  ) {
    for (
      let tileOffsetX = -scanRadius;
      tileOffsetX <= scanRadius;
      tileOffsetX += 1
    ) {
      const tileX = centerTileX + tileOffsetX;
      const tileY = centerTileY + tileOffsetY;
      const tileScreenY = convertingWorldPlazaGridPointToIsometricScreenPoint({
        x: tileX,
        y: tileY,
      }).y;

      // Columns behind the player (drawn earlier) cannot block torch light
      // toward the viewer.
      if (
        tileScreenY <
        playerScreenY -
          COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_SCREEN_Y_TOLERANCE_PX
      ) {
        continue;
      }

      if (
        !checkingWorldPlazaTileHasOccludingColumnAboveStandingLayer(
          tileX,
          tileY,
          standingLayer,
          placedBlocks
        )
      ) {
        continue;
      }

      const distanceGrid = Math.hypot(
        playerPosition.x - tileX,
        playerPosition.y - tileY
      );

      maxOcclusionStrength = Math.max(
        maxOcclusionStrength,
        computingWorldPlazaFrontOccluderDistanceFalloff(distanceGrid)
      );

      if (maxOcclusionStrength >= 1) {
        return 1;
      }
    }
  }

  return maxOcclusionStrength;
}
