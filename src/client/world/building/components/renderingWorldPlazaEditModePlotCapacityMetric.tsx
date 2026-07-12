'use client';

/**
 * Top-center plot / tile capacity readout during Build or Claim edit sessions.
 *
 * @module components/world/building/components/renderingWorldPlazaEditModePlotCapacityMetric
 */

import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import {
  formattingWorldPlazaBuildModeHotbarPlotMetric,
  STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_OUTLINE_METRIC_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';
import { resolvingWorldPlazaEditModePlotCapacityMetricViewportStyles } from '@/components/world/building/domains/resolvingWorldPlazaEditModePlotCapacityMetricViewportStyles';
import { useMemo } from 'react';

export type RenderingWorldPlazaEditModePlotCapacityMetricProps = {
  readonly localOwnedPlotCount: number;
  readonly localTileClaimCount: number;
  readonly plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  readonly viewportHudScale?: number;
  readonly isMobile?: boolean;
};

/**
 * Renders the plot / tile capacity HUD line under the top action bar.
 */
export function RenderingWorldPlazaEditModePlotCapacityMetric({
  localOwnedPlotCount,
  localTileClaimCount,
  plotOwnerLimits,
  viewportHudScale = 1,
  isMobile = false,
}: RenderingWorldPlazaEditModePlotCapacityMetricProps): React.JSX.Element {
  const plotMetricLabel = formattingWorldPlazaBuildModeHotbarPlotMetric(
    localOwnedPlotCount,
    plotOwnerLimits.maxOwnedPlotCount,
    localTileClaimCount,
    plotOwnerLimits.maxTileClaimCount
  );

  const plotCapacityMetricViewport = useMemo(
    () =>
      resolvingWorldPlazaEditModePlotCapacityMetricViewportStyles(
        viewportHudScale,
        isMobile
      ),
    [viewportHudScale, isMobile]
  );

  return (
    <div
      className={plotCapacityMetricViewport.anchorClassName}
      style={plotCapacityMetricViewport.style}
      aria-label={plotMetricLabel}
    >
      <p
        className={
          STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_OUTLINE_METRIC_CLASS_NAME
        }
      >
        {plotMetricLabel}
      </p>
    </div>
  );
}
