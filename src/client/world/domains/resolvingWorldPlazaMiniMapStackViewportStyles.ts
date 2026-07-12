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
 * Top offset for the minimap stack — same row as the top action bar.
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
 * Vertical footprint of the minimap parchment card (environment bar + map).
 */
export function computingWorldPlazaMiniMapStackOccupiedHeightPx(
  viewportHudScale: number,
  isMobile: boolean,
  isFullscreen: boolean
): number {
  const viewportMode = isFullscreen ? 'fullscreen' : 'embedded';
  const platform = isMobile ? 'mobile' : 'desktop';
  const canvasSizePx =
    DEFINING_WORLD_PLAZA_MINI_MAP_CANVAS_SIZE_PX[viewportMode][platform];
  const environmentBarPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.environmentBarOccupiedBasePx[
      platform
    ],
    viewportHudScale
  );
  const cardChromePx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.cardVerticalChromeBasePx,
    viewportHudScale
  );

  return environmentBarPx + cardChromePx + canvasSizePx;
}

/**
 * Left inset for top-left HUD chrome that aligns with the minimap stack.
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
 * Resolves top-left anchor offsets for the minimap stack.
 *
 * Uses inline px values so positioning does not depend on Tailwind spacing
 * utilities being present in the production CSS bundle.
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
