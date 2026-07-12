import { computingWorldPlazaActionBarOccupiedHeightPx } from '@/components/world/domains/computingWorldPlazaActionBarOccupiedHeightPx';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import type { CSSProperties } from 'react';

const EDIT_MODE_PLOT_CAPACITY_METRIC_LAYOUT =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topCenter
    .editModePlotCapacityMetric;

/** Viewport-resolved styles for the edit-mode plot capacity metric. */
export type ResolvingWorldPlazaEditModePlotCapacityMetricViewportStyles = {
  readonly anchorClassName: string;
  readonly style: CSSProperties;
};

/**
 * Places the plot / tile capacity readout just under the top action bar.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame.
 * @param isMobile - When true, uses the mobile action bar occupied height.
 */
export function resolvingWorldPlazaEditModePlotCapacityMetricViewportStyles(
  viewportHudScale: number,
  isMobile = false
): ResolvingWorldPlazaEditModePlotCapacityMetricViewportStyles {
  return {
    anchorClassName: EDIT_MODE_PLOT_CAPACITY_METRIC_LAYOUT.anchorClassName,
    style: {
      top:
        computingWorldPlazaActionBarOccupiedHeightPx(
          viewportHudScale,
          isMobile
        ) + EDIT_MODE_PLOT_CAPACITY_METRIC_LAYOUT.belowActionBarGapBasePx,
    },
  };
}
