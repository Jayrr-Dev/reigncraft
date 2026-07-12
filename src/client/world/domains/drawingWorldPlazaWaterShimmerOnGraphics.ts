import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import {
  checkingWorldPlazaWaterShimmerTileVisibleInViewport,
  type CheckingWorldPlazaWaterShimmerTileVisibleViewport,
} from '@/components/world/domains/checkingWorldPlazaWaterShimmerTileVisibleInViewport';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import {
  buildingWorldPlazaVisibleTileBoundsCacheKey,
  type DefiningWorldPlazaVisibleTileBounds,
} from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
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
  DEFINING_WORLD_PLAZA_WATER_SHIMMER_MAX_ANIMATED_TILES,
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

/** Precomputed per-tile animation inputs cached per bounds window. */
type DrawingWorldPlazaWaterShimmerTileEntry = {
  readonly tileX: number;
  readonly tileY: number;
  readonly centerX: number;
  readonly centerY: number;
  /** True for lake/pond tiles that use ripple-and-shine animation. */
  readonly isStillWater: boolean;
  readonly shimmerSeed: number;
  readonly secondarySeed: number;
  /** True when the flowing tile animates travel streaks. */
  readonly drawsFlowStreaks: boolean;
  /** True when the flowing tile animates the shimmer ellipse. */
  readonly drawsShimmerEllipse: boolean;
  readonly flowPeriodMs: number;
  readonly flowDirX: number;
  readonly flowDirY: number;
  /** Seeded lateral streak offsets, one per streak index. */
  readonly streakLateralOffsetsPx: readonly number[];
};

/** One cached scan of animated water tiles for the last bounds window. */
const drawingWorldPlazaWaterShimmerTileEntryCache: {
  boundsKey: string;
  entries: DrawingWorldPlazaWaterShimmerTileEntry[];
} = {
  boundsKey: '',
  entries: [],
};

/**
 * Clears the cached shimmer tile scan after generation rule changes.
 */
export function invalidatingWorldPlazaWaterShimmerTileEntryCache(): void {
  drawingWorldPlazaWaterShimmerTileEntryCache.boundsKey = '';
  drawingWorldPlazaWaterShimmerTileEntryCache.entries = [];
}

/**
 * Draws animated flow streaks sliding along a channel tile's flow axis.
 *
 * @param graphics - Dedicated shimmer graphics instance.
 * @param entry - Precomputed tile animation inputs.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
function drawingWorldPlazaWaterFlowStreaksOnGraphics(
  graphics: Graphics,
  entry: DrawingWorldPlazaWaterShimmerTileEntry,
  animationTimeMs: number
): void {
  const perpendicularX = -entry.flowDirY;
  const perpendicularY = entry.flowDirX;
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
      (animationTimeMs / entry.flowPeriodMs +
        entry.shimmerSeed +
        streakPhaseOffset) %
      1;
    const travelOffsetPx =
      (phase - 0.5) * DRAWING_WORLD_PLAZA_WATER_FLOW_TRAVEL_PX;
    const lateralOffsetPx = entry.streakLateralOffsetsPx[streakIndex];
    const streakCenterX =
      entry.centerX +
      entry.flowDirX * travelOffsetPx +
      perpendicularX * lateralOffsetPx;
    const streakCenterY =
      entry.centerY +
      entry.flowDirY * travelOffsetPx +
      perpendicularY * lateralOffsetPx;
    const fadeAlpha =
      Math.sin(phase * Math.PI) * DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_ALPHA;

    if (fadeAlpha <= 0.01) {
      continue;
    }

    graphics
      .moveTo(
        streakCenterX - entry.flowDirX * halfStreakLengthPx,
        streakCenterY - entry.flowDirY * halfStreakLengthPx
      )
      .lineTo(
        streakCenterX + entry.flowDirX * halfStreakLengthPx,
        streakCenterY + entry.flowDirY * halfStreakLengthPx
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
 * Scans the bounds once and collects tiles that actually animate.
 *
 * Flowing tiles whose seeds gate out both streaks and the shimmer ellipse
 * never draw anything, so they are dropped here instead of being re-checked
 * every redraw. Frozen state stays dynamic and is checked at draw time.
 *
 * @param bounds - Visible tile index range.
 */
function collectingWorldPlazaWaterShimmerTileEntries(
  bounds: DefiningWorldPlazaVisibleTileBounds
): DrawingWorldPlazaWaterShimmerTileEntry[] {
  const entries: DrawingWorldPlazaWaterShimmerTileEntry[] = [];
  const minDepthSum = bounds.minTileX + bounds.minTileY;
  const maxDepthSum = bounds.maxTileX + bounds.maxTileY;

  for (let depthSum = minDepthSum; depthSum <= maxDepthSum; depthSum += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const tileY = depthSum - tileX;

      if (tileY < bounds.minTileY || tileY > bounds.maxTileY) {
        continue;
      }

      const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

      if (
        !waterTile ||
        waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND
      ) {
        continue;
      }

      const isStillWater =
        waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE ||
        waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_POND;
      const shimmerSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        701
      );
      const drawsFlowStreaks =
        !isStillWater &&
        seedingWorldPlazaGrassTileDecorationFromTileIndex(
          tileX,
          tileY,
          DRAWING_WORLD_PLAZA_WATER_FLOW_STREAK_TILE_SEED_SALT
        ) >= DRAWING_WORLD_PLAZA_WATER_FLOW_STREAK_TILE_THRESHOLD;
      const drawsShimmerEllipse =
        !isStillWater &&
        shimmerSeed > DRAWING_WORLD_PLAZA_WATER_FLOW_SHIMMER_TILE_THRESHOLD;

      if (!isStillWater && !drawsFlowStreaks && !drawsShimmerEllipse) {
        continue;
      }

      const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
        x: tileX,
        y: tileY,
      });
      const flowAxis = drawsFlowStreaks
        ? resolvingWorldPlazaWaterFlowAxisAtTileIndex(tileX, tileY)
        : { dirX: 0, dirY: 0 };
      const streakLateralOffsetsPx: number[] = [];

      for (
        let streakIndex = 0;
        streakIndex < DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COUNT;
        streakIndex += 1
      ) {
        streakLateralOffsetsPx.push(
          (seedingWorldPlazaGrassTileDecorationFromTileIndex(
            tileX,
            tileY,
            311 + streakIndex
          ) -
            0.5) *
            DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
            0.6
        );
      }

      entries.push({
        tileX,
        tileY,
        centerX: center.x,
        centerY: center.y,
        isStillWater,
        shimmerSeed,
        secondarySeed: seedingWorldPlazaGrassTileDecorationFromTileIndex(
          tileX,
          tileY,
          907
        ),
        drawsFlowStreaks,
        drawsShimmerEllipse,
        flowPeriodMs:
          waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER
            ? DEFINING_WORLD_PLAZA_WATER_RIVER_FLOW_PERIOD_MS
            : DEFINING_WORLD_PLAZA_WATER_FLOW_PERIOD_MS,
        flowDirX: flowAxis.dirX,
        flowDirY: flowAxis.dirY,
        streakLateralOffsetsPx,
      });
    }
  }

  return entries;
}

/**
 * Redraws the shimmer overlay for animated water tiles inside the bounds.
 *
 * The bounds scan (water resolves, seeds, flow axes, screen centers) is cached
 * per bounds window so steady-state redraws only run phase math and path
 * building. When the window holds more animated tiles than the budget, tiles
 * are skipped at a deterministic stride to bound per-redraw geometry work.
 *
 * @param graphics - Dedicated shimmer graphics instance (caller clears first).
 * @param bounds - Visible tile index range.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 * @param viewport - Live camera viewport used for exact screen culling.
 * @returns Count of animated water tiles, for the perf shimmer tile gauge.
 */
export function drawingWorldPlazaWaterShimmerOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  animationTimeMs: number,
  viewport: CheckingWorldPlazaWaterShimmerTileVisibleViewport
): number {
  const boundsKey = buildingWorldPlazaVisibleTileBoundsCacheKey(bounds);

  if (drawingWorldPlazaWaterShimmerTileEntryCache.boundsKey !== boundsKey) {
    drawingWorldPlazaWaterShimmerTileEntryCache.boundsKey = boundsKey;
    drawingWorldPlazaWaterShimmerTileEntryCache.entries =
      collectingWorldPlazaWaterShimmerTileEntries(bounds);
  }

  const entries = drawingWorldPlazaWaterShimmerTileEntryCache.entries;
  let visibleEntryCount = 0;

  for (const entry of entries) {
    if (
      checkingWorldPlazaWaterShimmerTileVisibleInViewport(
        entry.centerX,
        entry.centerY,
        viewport
      )
    ) {
      visibleEntryCount += 1;
    }
  }

  const entryStride =
    visibleEntryCount > DEFINING_WORLD_PLAZA_WATER_SHIMMER_MAX_ANIMATED_TILES
      ? Math.ceil(
          visibleEntryCount /
            DEFINING_WORLD_PLAZA_WATER_SHIMMER_MAX_ANIMATED_TILES
        )
      : 1;
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const isDaytime = computingWorldPlazaDayNightSunState().isDaytime;
  let animatedTileCount = 0;
  let visibleEntryIndex = 0;

  for (const entry of entries) {
    if (
      !checkingWorldPlazaWaterShimmerTileVisibleInViewport(
        entry.centerX,
        entry.centerY,
        viewport
      )
    ) {
      continue;
    }

    const shouldAnimateEntry = visibleEntryIndex % entryStride === 0;
    visibleEntryIndex += 1;

    if (!shouldAnimateEntry) {
      continue;
    }

    if (
      checkingWorldPlazaWaterIsFrozenAtTileIndex(entry.tileX, entry.tileY, {
        isDaytime,
      })
    ) {
      continue;
    }

    animatedTileCount += 1;

    if (entry.isStillWater) {
      drawingWorldPlazaLakeWaterRipplesAndShineOnGraphics(
        graphics,
        entry.tileX,
        entry.tileY,
        animationTimeMs
      );
      continue;
    }

    if (entry.drawsFlowStreaks) {
      drawingWorldPlazaWaterFlowStreaksOnGraphics(
        graphics,
        entry,
        animationTimeMs
      );
    }

    if (!entry.drawsShimmerEllipse) {
      continue;
    }

    const phase =
      ((animationTimeMs +
        entry.shimmerSeed * DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS) %
        DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS) /
      DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS;
    const wave = Math.sin(phase * Math.PI * 2);
    const shimmerAlpha = mappingWorldPlazaWaterUnitFloatToRange(
      0.5 + wave * 0.5,
      DRAWING_WORLD_PLAZA_WATER_SHIMMER_ALPHA_MIN,
      DEFINING_WORLD_PLAZA_WATER_SHIMMER_ALPHA_MAX
    );
    const driftX =
      Math.sin((phase + entry.secondarySeed) * Math.PI * 2) * halfWidth * 0.12;
    const driftY =
      Math.cos((phase + entry.shimmerSeed) * Math.PI * 2) * halfHeight * 0.08;

    graphics
      .ellipse(
        entry.centerX + driftX + halfWidth * 0.08,
        entry.centerY - halfHeight * 0.12 + driftY,
        DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_X_PX,
        DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_Y_PX
      )
      .fill({
        color: DEFINING_WORLD_PLAZA_WATER_HIGHLIGHT_COLOR,
        alpha: shimmerAlpha,
      });
  }

  return animatedTileCount;
}
