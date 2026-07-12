import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  computingWorldPlazaMiniMapStackOccupiedHeightPx,
  computingWorldPlazaMiniMapStackRightInsetPx,
  computingWorldPlazaMiniMapStackTopPx,
} from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import type { CSSProperties } from 'react';

export type ResolvingWorldPlazaRoomStatusHudViewportStylesParams = {
  viewportHudScale: number;
  isMobile: boolean;
  isFullscreen: boolean;
};

/**
 * Resolves top-right anchor offsets for the online room status HUD.
 *
 * Sits directly below the minimap card on md+ viewports.
 */
export function resolvingWorldPlazaRoomStatusHudViewportStyles({
  viewportHudScale,
  isMobile,
  isFullscreen,
}: ResolvingWorldPlazaRoomStatusHudViewportStylesParams): CSSProperties {
  const belowMinimapGapBasePx =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.minimapStack
      .belowMinimapGapBasePx;
  const topPx =
    computingWorldPlazaMiniMapStackTopPx(viewportHudScale, isMobile) +
    computingWorldPlazaMiniMapStackOccupiedHeightPx(
      viewportHudScale,
      isMobile,
      isFullscreen
    ) +
    computingWorldPlazaViewportHudScaledPx(
      belowMinimapGapBasePx,
      viewportHudScale
    );
  const rightInsetPx = computingWorldPlazaMiniMapStackRightInsetPx(
    viewportHudScale,
    isMobile,
    isFullscreen
  );

  return {
    top: `calc(${topPx}px + env(safe-area-inset-top, 0px))`,
    right: `calc(${rightInsetPx}px + env(safe-area-inset-right, 0px))`,
  };
}
