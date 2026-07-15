import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_MINI_MAP_CANVAS_SIZE_PX } from '@/components/world/domains/definingWorldPlazaMiniMapConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import { resolvingWorldPlazaGameplayHudViewportInsets } from '@/components/world/domains/resolvingWorldPlazaGameplayHudViewportInsets';
import type { CSSProperties } from 'react';

export type ResolvingWorldPlazaMiniMapStackViewportStylesParams = {
  viewportHudScale: number;
  isMobile: boolean;
  isFullscreen: boolean;
};

/**
 * Top offset for top-left HUD chrome on the action bar row.
 */
export function computingWorldPlazaMiniMapStackTopPx(
  viewportHudScale: number,
  _isMobile: boolean
): number {
  return computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.topInsetBasePx,
    viewportHudScale
  );
}

/**
 * Vertical footprint reserved for a corner minimap (unused; map is a dropdown).
 * Kept at chrome-only; Dev tools clear the action bar via occupied height instead.
 */
export function computingWorldPlazaMiniMapStackOccupiedHeightPx(
  viewportHudScale: number,
  _isMobile: boolean,
  _isFullscreen: boolean
): number {
  return computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.cardVerticalChromeBasePx,
    viewportHudScale
  );
}

/**
 * Horizontal footprint matching the minimap canvas (Dev tools collapsed width).
 */
export function computingWorldPlazaMiniMapStackOccupiedWidthPx(
  isMobile: boolean,
  isFullscreen: boolean
): number {
  const viewportMode = isFullscreen ? 'fullscreen' : 'embedded';
  const platform = isMobile ? 'mobile' : 'desktop';

  return DEFINING_WORLD_PLAZA_MINI_MAP_CANVAS_SIZE_PX[viewportMode][platform];
}

/**
 * Left inset for top-left HUD chrome.
 */
export function computingWorldPlazaMiniMapStackLeftInsetPx(
  viewportHudScale: number,
  isMobile: boolean,
  isFullscreen: boolean
): number {
  const viewportInsets = resolvingWorldPlazaGameplayHudViewportInsets(
    isMobile,
    isFullscreen
  );

  return computingWorldPlazaViewportHudScaledPx(
    viewportInsets.edgeBasePx,
    viewportHudScale
  );
}

/**
 * Resolves top-left anchor offsets (legacy corner stack; Dev tools still use this).
 */
export function resolvingWorldPlazaMiniMapStackViewportStyles({
  viewportHudScale,
  isMobile,
  isFullscreen,
}: ResolvingWorldPlazaMiniMapStackViewportStylesParams): CSSProperties {
  const leftInsetPx = computingWorldPlazaMiniMapStackLeftInsetPx(
    viewportHudScale,
    isMobile,
    isFullscreen
  );
  const topPx = computingWorldPlazaMiniMapStackTopPx(
    viewportHudScale,
    isMobile
  );

  return {
    top: `calc(${topPx}px + env(safe-area-inset-top, 0px))`,
    left: `calc(${leftInsetPx}px + env(safe-area-inset-left, 0px))`,
  };
}

/**
 * Resolves top-right fixed offsets for the desktop / fullscreen minimap card.
 */
export function resolvingWorldPlazaMiniMapStackCornerViewportStyles({
  viewportHudScale,
  isMobile,
  isFullscreen,
}: ResolvingWorldPlazaMiniMapStackViewportStylesParams): CSSProperties {
  const rightInsetPx = computingWorldPlazaMiniMapStackLeftInsetPx(
    viewportHudScale,
    isMobile,
    isFullscreen
  );
  const topPx = computingWorldPlazaMiniMapStackTopPx(
    viewportHudScale,
    isMobile
  );

  return {
    top: `calc(${topPx}px + env(safe-area-inset-top, 0px))`,
    right: `calc(${rightInsetPx}px + env(safe-area-inset-right, 0px))`,
  };
}
