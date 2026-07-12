import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  computingWorldPlazaMiniMapStackOccupiedHeightPx,
  computingWorldPlazaMiniMapStackRightInsetPx,
  computingWorldPlazaMiniMapStackTopPx,
} from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import {
  DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_BELOW_ROOM_HUD_ESTIMATED_OCCUPIED_BASE_PX,
  STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_ANCHOR_CLASS_NAME,
} from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectStackConstants';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaEntityStatusEffectStackViewportLayout = {
  anchorClassName: string;
  style: CSSProperties;
};

function computingWorldPlazaEntityStatusEffectStackTopPx({
  viewportHudScale,
  hasOnlineRoomHud,
  isMobile,
  isFullscreen,
}: {
  viewportHudScale: number;
  hasOnlineRoomHud: boolean;
  isMobile: boolean;
  isFullscreen: boolean;
}): number {
  const belowMinimapGapBasePx =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.minimapStack
      .belowMinimapGapBasePx;
  let topPx =
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

  if (hasOnlineRoomHud && !isMobile) {
    topPx +=
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_BELOW_ROOM_HUD_ESTIMATED_OCCUPIED_BASE_PX,
        viewportHudScale
      ) +
      computingWorldPlazaViewportHudScaledPx(
        belowMinimapGapBasePx,
        viewportHudScale
      );
  }

  return topPx;
}

/**
 * Resolves anchor classes and top offset for the status effect stack.
 */
export function resolvingWorldPlazaEntityStatusEffectStackViewportLayout({
  viewportHudScale,
  hasOnlineRoomHud,
  isMobile = false,
  isFullscreen = false,
}: {
  viewportHudScale: number;
  hasOnlineRoomHud: boolean;
  isMobile?: boolean;
  isFullscreen?: boolean;
}): DefiningWorldPlazaEntityStatusEffectStackViewportLayout {
  const topPx = computingWorldPlazaEntityStatusEffectStackTopPx({
    viewportHudScale,
    hasOnlineRoomHud,
    isMobile,
    isFullscreen,
  });
  const rightInsetPx = computingWorldPlazaMiniMapStackRightInsetPx(
    viewportHudScale,
    isMobile,
    isFullscreen
  );

  return {
    anchorClassName: isMobile
      ? STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_ANCHOR_CLASS_NAME
      : STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME,
    style: {
      top: `calc(${topPx}px + env(safe-area-inset-top, 0px))`,
      right: `calc(${rightInsetPx}px + env(safe-area-inset-right, 0px))`,
    },
  };
}
