import { computingWorldPlazaActionBarOccupiedHeightPx } from '@/components/world/domains/computingWorldPlazaActionBarOccupiedHeightPx';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_FPS_READOUT_MOBILE_BELOW_ACTION_BAR_GAP_BASE_PX,
  STYLING_WORLD_PLAZA_PERFORMANCE_FPS_READOUT_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_PERFORMANCE_FPS_READOUT_MOBILE_ANCHOR_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import type { CSSProperties } from 'react';

export type ResolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout =
  {
    readonly anchorClassName: string;
    readonly style: CSSProperties;
  };

/**
 * Places the live FPS counter: desktop top-right corner, mobile just under
 * the action bar on the right so it does not overlap the top bar.
 */
export function resolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout({
  viewportHudScale,
  isMobile = false,
}: {
  viewportHudScale: number;
  isMobile?: boolean;
}): ResolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout {
  if (isMobile) {
    return {
      anchorClassName:
        STYLING_WORLD_PLAZA_PERFORMANCE_FPS_READOUT_MOBILE_ANCHOR_CLASS_NAME,
      style: {
        top:
          computingWorldPlazaActionBarOccupiedHeightPx(viewportHudScale, true) +
          DEFINING_WORLD_PLAZA_PERFORMANCE_FPS_READOUT_MOBILE_BELOW_ACTION_BAR_GAP_BASE_PX,
      },
    };
  }

  return {
    anchorClassName:
      STYLING_WORLD_PLAZA_PERFORMANCE_FPS_READOUT_ANCHOR_CLASS_NAME,
    style: {},
  };
}
