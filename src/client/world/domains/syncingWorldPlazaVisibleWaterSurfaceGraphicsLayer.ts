import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { drawingWorldPlazaVisibleWaterOnGraphics } from '@/components/world/domains/drawingWorldPlazaVisibleWaterOnGraphics';
import {
  beginningWorldPlazaPerformanceSample,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { Graphics, Rectangle } from 'pixi.js';

/**
 * Maintains one translucent water surface overlay above the textured floor.
 *
 * The overlay is a single graphics child of the floor layer with a z-index high
 * enough to render above every floor chunk, so the baked ground texture stays
 * visible through the merged translucent water fill.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleWaterSurfaceGraphicsLayer
 */

/** Input for {@link updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer}. */
export interface UpdatingWorldPlazaVisibleWaterSurfaceGraphicsLayerInput {
  readonly surfaceGraphics: Graphics;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
}

/** Conservative padding for shore strokes around edge diamonds. */
const SYNCING_WORLD_PLAZA_WATER_SURFACE_BOUNDS_PADDING_PX = 8;

/** Supplies explicit bounds so Pixi does not rescan the merged surface path. */
function updatingWorldPlazaVisibleWaterSurfaceBoundsArea(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds
): void {
  const minX =
    (bounds.minTileX - bounds.maxTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX -
    SYNCING_WORLD_PLAZA_WATER_SURFACE_BOUNDS_PADDING_PX;
  const maxX =
    (bounds.maxTileX - bounds.minTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX +
    SYNCING_WORLD_PLAZA_WATER_SURFACE_BOUNDS_PADDING_PX;
  const minY =
    (bounds.minTileX + bounds.minTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX -
    SYNCING_WORLD_PLAZA_WATER_SURFACE_BOUNDS_PADDING_PX;
  const maxY =
    (bounds.maxTileX + bounds.maxTileY) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX +
    SYNCING_WORLD_PLAZA_WATER_SURFACE_BOUNDS_PADDING_PX;
  const boundsArea = graphics.boundsArea ?? new Rectangle();

  boundsArea.x = minX;
  boundsArea.y = minY;
  boundsArea.width = maxX - minX;
  boundsArea.height = maxY - minY;
  graphics.boundsArea = boundsArea;
}

/**
 * Clears and redraws the water surface overlay for the current visible bounds.
 *
 * @param input - Surface graphics instance and visible bounds.
 */
export function updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer(
  input: UpdatingWorldPlazaVisibleWaterSurfaceGraphicsLayerInput
): void {
  const finishSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WATER_SURFACE_REDRAW
  );

  updatingWorldPlazaVisibleWaterSurfaceBoundsArea(
    input.surfaceGraphics,
    input.bounds
  );
  input.surfaceGraphics.clear();
  const { riverTileCount, waterTileCount } =
    drawingWorldPlazaVisibleWaterOnGraphics(
      input.surfaceGraphics,
      input.bounds
    );

  finishSample();
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WATER_VISIBLE_TILE_COUNT,
    waterTileCount
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.RIVER_VISIBLE_TILE_COUNT,
    riverTileCount
  );
  incrementingWorldPlazaPerformanceDiagnosticsCounter(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.WATER_SURFACE_REDRAW
  );
}

/**
 * Creates the water surface overlay graphics child when missing.
 *
 * @param parentContainer - Floor layer container that owns floor chunks.
 * @param surfaceGraphics - Existing surface graphics, if any.
 */
export function ensuringWorldPlazaVisibleWaterSurfaceGraphicsLayer(
  parentContainer: { addChild: (child: Graphics) => void },
  surfaceGraphics: Graphics | null
): Graphics {
  if (surfaceGraphics) {
    return surfaceGraphics;
  }

  const createdSurfaceGraphics = new Graphics();
  createdSurfaceGraphics.eventMode = 'none';
  createdSurfaceGraphics.boundsArea = new Rectangle();
  createdSurfaceGraphics.zIndex =
    DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX;
  parentContainer.addChild(createdSurfaceGraphics);

  return createdSurfaceGraphics;
}
