import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_BELOW_MINIMAP_GAP_BASE_PX,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOOLBAR_ROW_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  computingWorldPlazaMiniMapStackLeftInsetPx,
  computingWorldPlazaMiniMapStackOccupiedWidthPx,
  computingWorldPlazaMiniMapStackTopPx,
} from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaDevModePanelViewportLayout = {
  anchorClassName: string;
  toolbarClassName: string;
  style: CSSProperties;
  toolbarStyle: CSSProperties;
};

/**
 * Resolves anchor classes and offsets for the Dev tools panel.
 * Sits in the top-left corner (minimap now drops from the action bar).
 *
 * Home / Dev / Perf stay on a compact toolbar row; the open panel stacks below.
 * Toolbar width matches the minimap canvas footprint.
 */
export function resolvingWorldPlazaDevModePanelViewportLayout({
  viewportHudScale,
  isMobile = false,
  isFullscreen = false,
}: {
  viewportHudScale: number;
  isMobile?: boolean;
  isFullscreen?: boolean;
  /** Kept for callers; open state no longer changes anchor geometry. */
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
  const toolbarStyle: CSSProperties = {
    width: computingWorldPlazaMiniMapStackOccupiedWidthPx(
      isMobile,
      isFullscreen
    ),
  };

  return {
    anchorClassName: STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME,
    toolbarClassName: STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOOLBAR_ROW_CLASS_NAME,
    style,
    toolbarStyle,
  };
}
