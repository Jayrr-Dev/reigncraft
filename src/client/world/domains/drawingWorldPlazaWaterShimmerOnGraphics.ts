import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  DEFINING_WORLD_PLAZA_WATER_FLOW_PERIOD_MS,
  DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_ALPHA,
  DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COLOR,
  DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COUNT,
  DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_LENGTH_PX,
  DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_WIDTH_PX,
  DEFINING_WORLD_PLAZA_WATER_HIGHLIGHT_COLOR,
  DEFINING_WORLD_PLAZA_WATER_RIVER_FLOW_PERIOD_MS,
  DEFINING_WORLD_PLAZA_WATER_SHIMMER_ALPHA_MAX,
  DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS,
  DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_X_PX,
  DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_Y_PX,
} from '@/components/world/domains/definingWorldPlazaWaterConstants';
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { drawingWorldPlazaLakeWaterRipplesAndShineOnGraphics } from '@/components/world/domains/drawingWorldPlazaLakeWaterRipplesAndShineOnGraphics';
import { mappingWorldPlazaWaterUnitFloatToRange } from '@/components/world/domains/mixingWorldPlazaWaterRgbColors';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaWaterFlowAxisAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterFlowAxisAtTileIndex';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Draws animated shimmer for rivers and streams, plus still lake ripples and shine.
 *
 * Frozen tiles skip all overlays. Lakes use slow local ripples instead of flow.
 *
 * @module components/world/domains/drawingWorldPlazaWaterShimmerOnGraphics
 */

/** Minimum shimmer alpha at the trough of the animation cycle. */
const DRAWING_WORLD_PLAZA_WATER_SHIMMER_ALPHA_MIN = 0.05;

/** Travel distance of one streak across a tile (pixels). */
const DRAWING_WORLD_PLAZA_WATER_FLOW_TRAVEL_PX =
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX * 1.2;

/** Seeded unit above which a flowing tile gets a single shimmer highlight. */
const DRAWING_WORLD_PLAZA_WATER_FLOW_SHIMMER_TILE_THRESHOLD = 0.66;

/** Seeded unit above which a flowing tile animates flow streaks. */
const DRAWING_WORLD_PLAZA_WATER_FLOW_STREAK_TILE_THRESHOLD = 0.5;

/** Salt for the per-tile seed that decides which tiles animate flow streaks. */
const DRAWING_WORLD_PLAZA_WATER_FLOW_STREAK_TILE_SEED_SALT = 523;

/**
 * Draws animated flow streaks sliding along a channel tile's flow axis.
 *
 * @param graphics - Dedicated shimmer graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param tileSeed - Deterministic per-tile phase offset in [0, 1).
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 * @param flowPeriodMs - Milliseconds for one streak travel cycle (lower flows faster).
 */
function drawingWorldPlazaWaterFlowStreaksOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  tileSeed: number,
  animationTimeMs: number,
  flowPeriodMs: number
): void {
  const flowAxis = resolvingWorldPlazaWaterFlowAxisAtTileIndex(tileX, tileY);
  const perpendicularX = -flowAxis.dirY;
  const perpendicularY = flowAxis.dirX;
  const halfStreakLengthPx =
    DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_LENGTH_PX / 2;

  for (
    let streakIndex = 0;
    streakIndex < DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COUNT;
    streakIndex += 1
  ) {
    const streakPhaseOffset =
      streakIndex / DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COUNT;
    const phase =
      (animationTimeMs / flowPeriodMs + tileSeed + streakPhaseOffset) % 1;
    const travelOffsetPx =
      (phase - 0.5) * DRAWING_WORLD_PLAZA_WATER_FLOW_TRAVEL_PX;
    const lateralOffsetPx =
      (seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        311 + streakIndex
      ) -
        0.5) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
      0.6;
    const streakCenterX =
      centerX +
      flowAxis.dirX * travelOffsetPx +
      perpendicularX * lateralOffsetPx;
    const streakCenterY =
      centerY +
      flowAxis.dirY * travelOffsetPx +
      perpendicularY * lateralOffsetPx;
    const fadeAlpha =
      Math.sin(phase * Math.PI) * DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_ALPHA;

    if (fadeAlpha <= 0.01) {
      continue;
    }

    graphics
      .moveTo(
        streakCenterX - flowAxis.dirX * halfStreakLengthPx,
        streakCenterY - flowAxis.dirY * halfStreakLengthPx
      )
      .lineTo(
        streakCenterX + flowAxis.dirX * halfStreakLengthPx,
        streakCenterY + flowAxis.dirY * halfStreakLengthPx
      )
      .stroke({
        width: DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_WIDTH_PX,
        color: DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COLOR,
        alpha: fadeAlpha,
        cap: 'round',
      });
  }
}

/**
 * Redraws the shimmer overlay for every water tile inside the bounds.
 *
 * @param graphics - Dedicated shimmer graphics instance (caller clears first).
 * @param bounds - Visible tile index range.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function drawingWorldPlazaWaterShimmerOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  animationTimeMs: number
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const minDepthSum = bounds.minTileX + bounds.minTileY;
  const maxDepthSum = bounds.maxTileX + bounds.maxTileY;
  const isDaytime = computingWorldPlazaDayNightSunState().isDaytime;

  for (let depthSum = minDepthSum; depthSum <= maxDepthSum; depthSum += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const tileY = depthSum - tileX;

      if (tileY < bounds.minTileY || tileY > bounds.maxTileY) {
        continue;
      }

      const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

      if (!waterTile) {
        continue;
      }

      if (
        checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY, { isDaytime })
      ) {
        continue;
      }

      const shimmerSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        701
      );
      const secondarySeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        907
      );
      const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
        x: tileX,
        y: tileY,
      });

      if (
        waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE ||
        waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_POND
      ) {
        drawingWorldPlazaLakeWaterRipplesAndShineOnGraphics(
          graphics,
          tileX,
          tileY,
          animationTimeMs
        );
        continue;
      }

      if (waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND) {
        continue;
      }

      const flowStreakTileSeed =
        seedingWorldPlazaGrassTileDecorationFromTileIndex(
          tileX,
          tileY,
          DRAWING_WORLD_PLAZA_WATER_FLOW_STREAK_TILE_SEED_SALT
        );

      if (
        flowStreakTileSeed >=
        DRAWING_WORLD_PLAZA_WATER_FLOW_STREAK_TILE_THRESHOLD
      ) {
        const flowPeriodMs =
          waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER
            ? DEFINING_WORLD_PLAZA_WATER_RIVER_FLOW_PERIOD_MS
            : DEFINING_WORLD_PLAZA_WATER_FLOW_PERIOD_MS;

        drawingWorldPlazaWaterFlowStreaksOnGraphics(
          graphics,
          tileX,
          tileY,
          center.x,
          center.y,
          shimmerSeed,
          animationTimeMs,
          flowPeriodMs
        );
      }

      if (
        shimmerSeed <= DRAWING_WORLD_PLAZA_WATER_FLOW_SHIMMER_TILE_THRESHOLD
      ) {
        continue;
      }
      const phase =
        ((animationTimeMs +
          shimmerSeed * DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS) %
          DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS) /
        DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS;
      const wave = Math.sin(phase * Math.PI * 2);
      const shimmerAlpha = mappingWorldPlazaWaterUnitFloatToRange(
        0.5 + wave * 0.5,
        DRAWING_WORLD_PLAZA_WATER_SHIMMER_ALPHA_MIN,
        DEFINING_WORLD_PLAZA_WATER_SHIMMER_ALPHA_MAX
      );
      const driftX =
        Math.sin((phase + secondarySeed) * Math.PI * 2) * halfWidth * 0.12;
      const driftY =
        Math.cos((phase + shimmerSeed) * Math.PI * 2) * halfHeight * 0.08;

      graphics
        .ellipse(
          center.x + driftX + halfWidth * 0.08,
          center.y - halfHeight * 0.12 + driftY,
          DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_X_PX,
          DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_Y_PX
        )
        .fill({
          color: DEFINING_WORLD_PLAZA_WATER_HIGHLIGHT_COLOR,
          alpha: shimmerAlpha,
        });
    }
  }
}
