import { computingWorldPlazaActionBarOccupiedHeightPx } from '@/components/world/domains/computingWorldPlazaActionBarOccupiedHeightPx';
import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_CANVAS_SIZE_PX } from '@/components/world/domains/definingWorldPlazaMiniMapConstants';
import { resolvingWorldPlazaMiniMapStackViewportLayout } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportLayout';
import type { CSSProperties } from 'react';

export type ResolvingWorldPlazaMiniMapStackViewportStylesParams = {
  viewportHudScale: number;
  isMobile: boolean;
  isFullscreen: boolean;
};

/**
 * Top offset for the minimap stack, below the action bar shell.
 */
export function computingWorldPlazaMiniMapStackTopPx(
  viewportHudScale: number,
  isMobile: boolean
): number {
  const belowActionBarGapBasePx =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.minimapStack
      .belowActionBarGapBasePx;

  return (
    computingWorldPlazaActionBarOccupiedHeightPx(viewportHudScale, isMobile) +
    computingWorldPlazaViewportHudScaledPx(
      belowActionBarGapBasePx,
      viewportHudScale
    )
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
  const minimapLayout =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.minimapStack;
  const viewportMode = isFullscreen ? 'fullscreen' : 'embedded';
  const platform = isMobile ? 'mobile' : 'desktop';
  const canvasSizePx =
    DEFINING_WORLD_PLAZA_MINI_MAP_CANVAS_SIZE_PX[viewportMode][platform];
  const environmentBarPx = computingWorldPlazaViewportHudScaledPx(
    minimapLayout.environmentBarOccupiedBasePx[platform],
    viewportHudScale
  );
  const cardChromePx = computingWorldPlazaViewportHudScaledPx(
    minimapLayout.cardVerticalChromeBasePx,
    viewportHudScale
  );

  return environmentBarPx + cardChromePx + canvasSizePx;
}

/**
 * Right inset for top-right HUD chrome that aligns with the minimap stack.
 */
export function computingWorldPlazaMiniMapStackRightInsetPx(
  viewportHudScale: number,
  isMobile: boolean,
  isFullscreen: boolean
): number {
  const viewportLayout = resolvingWorldPlazaMiniMapStackViewportLayout(
    isMobile,
    isFullscreen
  );

  return computingWorldPlazaViewportHudScaledPx(
    viewportLayout.edgeInsetBasePx,
    viewportHudScale
  );
}

/**
 * Resolves top-right anchor offsets for the minimap stack.
 *
 * Uses inline px values so positioning does not depend on Tailwind spacing
 * utilities being present in the production CSS bundle.
 */
export function resolvingWorldPlazaMiniMapStackViewportStyles({
  viewportHudScale,
  isMobile,
  isFullscreen,
}: ResolvingWorldPlazaMiniMapStackViewportStylesParams): CSSProperties {
  const rightInsetPx = computingWorldPlazaMiniMapStackRightInsetPx(
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
