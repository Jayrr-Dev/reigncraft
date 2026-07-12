import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { drawingWorldPlazaVisibleWaterOnGraphics } from '@/components/world/domains/drawingWorldPlazaVisibleWaterOnGraphics';
import {
  beginningWorldPlazaPerformanceSample,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { Graphics } from 'pixi.js';

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

  input.surfaceGraphics.clear();
  const waterTileCount = drawingWorldPlazaVisibleWaterOnGraphics(
    input.surfaceGraphics,
    input.bounds
  );

  finishSample();
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WATER_VISIBLE_TILE_COUNT,
    waterTileCount
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
  createdSurfaceGraphics.zIndex =
    DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX;
  parentContainer.addChild(createdSurfaceGraphics);

  return createdSurfaceGraphics;
}
