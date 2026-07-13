import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_BELOW_MINIMAP_GAP_BASE_PX,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  computingWorldPlazaMiniMapStackLeftInsetPx,
  computingWorldPlazaMiniMapStackOccupiedWidthPx,
  computingWorldPlazaMiniMapStackTopPx,
} from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaDevModePanelViewportLayout = {
  anchorClassName: string;
  style: CSSProperties;
};

/**
 * Resolves anchor classes and offsets for the Dev tools panel.
 * Sits in the top-left corner (minimap now drops from the action bar).
 *
 * When the panel is collapsed, the Dev / Perf row matches minimap canvas width.
 */
export function resolvingWorldPlazaDevModePanelViewportLayout({
  viewportHudScale,
  isMobile = false,
  isFullscreen = false,
  isOpen = false,
}: {
  viewportHudScale: number;
  isMobile?: boolean;
  isFullscreen?: boolean;
  isOpen?: boolean;
}): DefiningWorldPlazaDevModePanelViewportLayout {
  const topPx =
    computingWorldPlazaMiniMapStackTopPx(viewportHudScale, isMobile) +
    computingWorldPlazaViewportHudScaledPx(
      DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_BELOW_MINIMAP_GAP_BASE_PX,
      viewportHudScale
    );
  const leftInsetPx = computingWorldPlazaMiniMapStackLeftInsetPx(
    viewportHudScale,
    isMobile,
    isFullscreen
  );
  const style: CSSProperties = {
    top: `calc(${topPx}px + env(safe-area-inset-top, 0px))`,
    left: `calc(${leftInsetPx}px + env(safe-area-inset-left, 0px))`,
  };

  if (!isOpen) {
    style.width = computingWorldPlazaMiniMapStackOccupiedWidthPx(
      isMobile,
      isFullscreen
    );
  }

  return {
    anchorClassName: STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME,
    style,
  };
}
