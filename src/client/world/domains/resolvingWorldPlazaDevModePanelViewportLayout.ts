import { computingWorldPlazaActionBarOccupiedHeightPx } from '@/components/world/domains/computingWorldPlazaActionBarOccupiedHeightPx';
import {
  DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_MOBILE_BELOW_ACTION_BAR_GAP_BASE_PX,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_DESKTOP_TOP_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaDevModePanelViewportLayout = {
  anchorClassName: string;
  style: CSSProperties;
};

/**
 * Resolves anchor classes and top offset for the dev tools panel.
 * On mobile, clears the top-center action bar (same math as status-effect stack).
 */
export function resolvingWorldPlazaDevModePanelViewportLayout({
  viewportHudScale,
  isMobile = false,
}: {
  viewportHudScale: number;
  isMobile?: boolean;
}): DefiningWorldPlazaDevModePanelViewportLayout {
  if (isMobile) {
    return {
      anchorClassName: STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME,
      style: {
        top:
          computingWorldPlazaActionBarOccupiedHeightPx(viewportHudScale, true) +
          DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_MOBILE_BELOW_ACTION_BAR_GAP_BASE_PX,
      },
    };
  }

  return {
    anchorClassName: `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME} ${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_DESKTOP_TOP_CLASS_NAME}`,
    style: {},
  };
}
