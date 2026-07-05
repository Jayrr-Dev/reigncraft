import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Lava sinking for avatars that step into molten ground-level lava.
 *
 * Avatars are not blocked by lava; instead they visually fall in: the body
 * sinks below the shoreline and a molten cover ellipse renders on top so the
 * lava surface reads as swallowing them. Hazard damage comes from the
 * existing environmental temperature system.
 *
 * @module components/world/domains/resolvingWorldPlazaLavaSinkStateAtGridPoint
 */

/**
 * Future mechanic toggle: when true, avatars walk on the lava crust instead
 * of sinking (e.g. a fire-resistance buff or crust-walking boots).
 */
export const DEFINING_WORLD_PLAZA_LAVA_WALKABLE_ENABLED = false;

/** How deep an avatar sinks into molten lava, in screen pixels. */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX = 10;

/** Molten cover ellipse half width around a sunken avatar. */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_WIDTH_PX = 26;

/** Molten cover ellipse half height around a sunken avatar. */
export const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_HEIGHT_PX = 12;

/** Bright molten fill of the sink cover. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_FILL_COLOR = 0xe8641b;

/** Hot rim immediately around the sunken body. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_RIM_COLOR = 0xf7b24e;

/** Dark crust ring at the cover's outer edge. */
const DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CRUST_COLOR = 0x7a3010;

/**
 * Returns true when the tile is molten ground-level lava an avatar can sink
 * into (lava that is neither raised terrain nor hidden under a rock column).
 */
export function checkingWorldPlazaLavaSinkTileIsMoltenAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (!checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED &&
    checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY)
  ) {
    return false;
  }

  return !checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex(
    tileX,
    tileY
  );
}

/**
 * Returns the downward screen offset for an avatar standing in molten lava.
 *
 * Zero when lava walking is enabled, the avatar stands above ground level
 * (placed blocks, elevated terrain), or the tile is not molten lava.
 *
 * @param gridX - Avatar grid X.
 * @param gridY - Avatar grid Y.
 * @param standingLayer - Avatar standing world layer.
 */
export function computingWorldPlazaLavaSinkOffsetPxAtGridPoint(
  gridX: number,
  gridY: number,
  standingLayer: number
): number {
  if (DEFINING_WORLD_PLAZA_LAVA_WALKABLE_ENABLED) {
    return 0;
  }

  const standingTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint({
    x: gridX,
    y: gridY,
  });

  if (
    !checkingWorldPlazaLavaAtTileIndex(standingTile.tileX, standingTile.tileY)
  ) {
    return 0;
  }

  if (
    checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    )
  ) {
    return 0;
  }

  const isRaisedLava =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED &&
    checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    );

  if (isRaisedLava) {
    // Elevated lava pools: only sink when the avatar stands on that surface,
    // not when walking past on the ground below.
    const surfaceLayer =
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        standingTile.tileX,
        standingTile.tileY
      );

    return standingLayer >= surfaceLayer
      ? DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX
      : 0;
  }

  // Ground-level pools: standing above ground (placed blocks) keeps the
  // avatar dry.
  return standingLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
    ? DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX
    : 0;
}

/**
 * Draws the molten cover ellipse (centered at local 0,0) shown over a sunken
 * avatar's lower body: dark crust ring, molten fill, and a hot inner rim.
 *
 * @param graphics - Pixi graphics owned by the avatar's lava cover container.
 */
export function drawingWorldPlazaLavaSinkCoverOnGraphics(
  graphics: Graphics
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_HALF_HEIGHT_PX;

  graphics.clear();
  graphics.ellipse(0, 0, halfWidth, halfHeight).fill({
    color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_CRUST_COLOR,
    alpha: 0.9,
  });
  graphics.ellipse(0, 0, halfWidth * 0.86, halfHeight * 0.86).fill({
    color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_FILL_COLOR,
    alpha: 0.95,
  });
  graphics.ellipse(0, 0, halfWidth * 0.45, halfHeight * 0.45).fill({
    color: DEFINING_WORLD_PLAZA_LAVA_SINK_COVER_RIM_COLOR,
    alpha: 0.6,
  });
}
