import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_ALPHA_MAX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_COLOR,
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_EXPAND_PX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_PERIOD_MS,
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_RADIUS_X_PX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_RADIUS_Y_PX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_STROKE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_TILE_THRESHOLD,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_ALPHA_MAX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_ALPHA_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_COLOR,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_PERIOD_MS,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_RADIUS_X_PX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_RADIUS_Y_PX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_TILE_THRESHOLD,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { mappingWorldPlazaWaterUnitFloatToRange } from "@/components/world/domains/mixingWorldPlazaWaterRgbColors";
import { resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex";
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Occasional still-water ripples and shine for lake tiles.
 *
 * @module components/world/domains/drawingWorldPlazaLakeWaterRipplesAndShineOnGraphics
 */

/** Number of phased ripple rings drawn on eligible lake tiles. */
const DRAWING_WORLD_PLAZA_LAKE_WATER_RIPPLE_RING_COUNT = 2;

/** Shallow band closest to shore where ripples and shine are suppressed. */
const DRAWING_WORLD_PLAZA_LAKE_WATER_EDGE_BAND = 1;

/**
 * Draws one expanding ripple ring centered on a lake tile.
 *
 * @param graphics - Dedicated shimmer graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param offsetX - Seeded lateral ripple offset X.
 * @param offsetY - Seeded lateral ripple offset Y.
 * @param ringPhase - Animation phase in [0, 1).
 */
function drawingWorldPlazaLakeWaterRippleRingOnGraphics(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  offsetX: number,
  offsetY: number,
  ringPhase: number,
): void {
  // Real ripples are brightest when small and fade as they spread outward.
  const fadeInRamp = Math.min(1, ringPhase / 0.18);
  const fadeAlpha =
    fadeInRamp *
    (1 - ringPhase) *
    DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_ALPHA_MAX;

  if (fadeAlpha <= 0.01) {
    return;
  }

  const expandOffsetPx =
    ringPhase * DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_EXPAND_PX;

  graphics
    .ellipse(
      centerX + offsetX,
      centerY + offsetY,
      DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_RADIUS_X_PX + expandOffsetPx,
      DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_RADIUS_Y_PX +
        expandOffsetPx * 0.4,
    )
    .stroke({
      width: DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_STROKE_WIDTH_PX,
      color: DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_COLOR,
      alpha: fadeAlpha,
      alignment: 0.5,
    });
}

/**
 * Draws occasional concentric ripples on one lake tile.
 *
 * @param graphics - Dedicated shimmer graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
function drawingWorldPlazaLakeWaterRipplesOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  animationTimeMs: number,
): void {
  const rippleSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    1181,
  );

  if (rippleSeed <= DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_TILE_THRESHOLD) {
    return;
  }

  if (
    resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(tileX, tileY) ===
    DRAWING_WORLD_PLAZA_LAKE_WATER_EDGE_BAND
  ) {
    return;
  }

  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const offsetX =
    (seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 1483) -
      0.5) *
    halfWidth *
    0.28;
  const offsetY =
    (seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 1629) -
      0.5) *
    halfHeight *
    0.22;

  for (
    let ringIndex = 0;
    ringIndex < DRAWING_WORLD_PLAZA_LAKE_WATER_RIPPLE_RING_COUNT;
    ringIndex += 1
  ) {
    const ringPhaseOffset = ringIndex / DRAWING_WORLD_PLAZA_LAKE_WATER_RIPPLE_RING_COUNT;
    const ringPhase =
      (animationTimeMs / DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_PERIOD_MS +
        rippleSeed +
        ringPhaseOffset) %
      1;

    drawingWorldPlazaLakeWaterRippleRingOnGraphics(
      graphics,
      centerX,
      centerY,
      offsetX,
      offsetY,
      ringPhase,
    );
  }
}

/**
 * Draws a soft stationary shine pulse on one lake tile.
 *
 * @param graphics - Dedicated shimmer graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
function drawingWorldPlazaLakeWaterShineOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  animationTimeMs: number,
): void {
  const shineSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    701,
  );
  const secondarySeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    907,
  );

  if (shineSeed <= DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_TILE_THRESHOLD) {
    return;
  }

  if (
    resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(tileX, tileY) ===
    DRAWING_WORLD_PLAZA_LAKE_WATER_EDGE_BAND
  ) {
    return;
  }

  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const phase =
    ((animationTimeMs + shineSeed * DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_PERIOD_MS) %
      DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_PERIOD_MS) /
    DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_PERIOD_MS;
  const wave = Math.sin(phase * Math.PI * 2);
  const shineAlpha = mappingWorldPlazaWaterUnitFloatToRange(
    0.5 + wave * 0.5,
    DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_ALPHA_MIN,
    DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_ALPHA_MAX,
  );
  const driftX =
    Math.sin((phase + secondarySeed) * Math.PI * 2) * halfWidth * 0.03;
  const driftY =
    Math.cos((phase + shineSeed) * Math.PI * 2) * halfHeight * 0.02;

  graphics
    .ellipse(
      centerX + driftX + halfWidth * 0.06,
      centerY - halfHeight * 0.1 + driftY,
      DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_RADIUS_X_PX,
      DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_RADIUS_Y_PX,
    )
    .fill({
      color: DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_COLOR,
      alpha: shineAlpha,
    });
}

/**
 * Draws occasional lake ripples and soft shine on one tile.
 *
 * @param graphics - Dedicated shimmer graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function drawingWorldPlazaLakeWaterRipplesAndShineOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  animationTimeMs: number,
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });

  drawingWorldPlazaLakeWaterRipplesOnGraphics(
    graphics,
    tileX,
    tileY,
    center.x,
    center.y,
    animationTimeMs,
  );
  drawingWorldPlazaLakeWaterShineOnGraphics(
    graphics,
    tileX,
    tileY,
    center.x,
    center.y,
    animationTimeMs,
  );
}
