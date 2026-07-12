import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { DEFINING_WORLD_PLAZA_WATER_SHIMMER_LAYER_Z_INDEX } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { drawingWorldPlazaWaterShimmerOnGraphics } from '@/components/world/domains/drawingWorldPlazaWaterShimmerOnGraphics';
import {
  beginningWorldPlazaPerformanceSample,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { Graphics, Rectangle } from 'pixi.js';

/**
 * Maintains one shimmer overlay graphics child for visible water tiles.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleWaterShimmerGraphicsLayer
 */

/** Input for {@link updatingWorldPlazaVisibleWaterShimmerGraphicsLayer}. */
export interface UpdatingWorldPlazaVisibleWaterShimmerGraphicsLayerInput {
  readonly shimmerGraphics: Graphics;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly animationTimeMs: number;
  readonly cameraOffset: DefiningWorldPlazaCameraOffset;
  readonly viewportWidthPx: number;
  readonly viewportHeightPx: number;
  readonly worldZoom: number;
  readonly maxAnimatedTileCount: number;
}

/** Conservative padding for animated streaks and ripple ellipses. */
const SYNCING_WORLD_PLAZA_WATER_SHIMMER_BOUNDS_PADDING_PX = 96;

/**
 * Supplies explicit bounds so Pixi never scans the rebuilt ShapePath.
 */
function updatingWorldPlazaVisibleWaterShimmerBoundsArea(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds
): void {
  const minX =
    (bounds.minTileX - bounds.maxTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX -
    SYNCING_WORLD_PLAZA_WATER_SHIMMER_BOUNDS_PADDING_PX;
  const maxX =
    (bounds.maxTileX - bounds.minTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX +
    SYNCING_WORLD_PLAZA_WATER_SHIMMER_BOUNDS_PADDING_PX;
  const minY =
    (bounds.minTileX + bounds.minTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX -
    SYNCING_WORLD_PLAZA_WATER_SHIMMER_BOUNDS_PADDING_PX;
  const maxY =
    (bounds.maxTileX + bounds.maxTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX +
    SYNCING_WORLD_PLAZA_WATER_SHIMMER_BOUNDS_PADDING_PX;
  const boundsArea = graphics.boundsArea ?? new Rectangle();

  boundsArea.x = minX;
  boundsArea.y = minY;
  boundsArea.width = maxX - minX;
  boundsArea.height = maxY - minY;
  graphics.boundsArea = boundsArea;
}

/**
 * Clears and redraws the shimmer overlay for the current visible bounds.
 *
 * @param input - Shimmer graphics instance, bounds, and animation clock.
 */
export function updatingWorldPlazaVisibleWaterShimmerGraphicsLayer(
  input: UpdatingWorldPlazaVisibleWaterShimmerGraphicsLayerInput
): void {
  const finishSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WATER_SHIMMER_REDRAW
  );

  updatingWorldPlazaVisibleWaterShimmerBoundsArea(
    input.shimmerGraphics,
    input.bounds
  );
  input.shimmerGraphics.clear();
  const { animatedRiverTileCount, animatedTileCount } =
    drawingWorldPlazaWaterShimmerOnGraphics(
      input.shimmerGraphics,
      input.bounds,
      input.animationTimeMs,
      {
        cameraOffset: input.cameraOffset,
        widthPx: input.viewportWidthPx,
        heightPx: input.viewportHeightPx,
        worldZoom: input.worldZoom,
      },
      input.maxAnimatedTileCount
    );

  finishSample();
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WATER_SHIMMER_TILE_COUNT,
    animatedTileCount
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.RIVER_SHIMMER_TILE_COUNT,
    animatedRiverTileCount
  );
}

/**
 * Creates the shimmer overlay graphics child when missing.
 *
 * @param parentContainer - Floor layer container that owns floor chunks.
 * @param shimmerGraphics - Existing shimmer graphics, if any.
 */
export function ensuringWorldPlazaVisibleWaterShimmerGraphicsLayer(
  parentContainer: { addChild: (child: Graphics) => void },
  shimmerGraphics: Graphics | null
): Graphics {
  if (shimmerGraphics) {
    return shimmerGraphics;
  }

  const createdShimmerGraphics = new Graphics();
  createdShimmerGraphics.eventMode = 'none';
  createdShimmerGraphics.boundsArea = new Rectangle();
  createdShimmerGraphics.zIndex =
    DEFINING_WORLD_PLAZA_WATER_SHIMMER_LAYER_Z_INDEX;
  parentContainer.addChild(createdShimmerGraphics);

  return createdShimmerGraphics;
}
