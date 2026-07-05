import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_EMBEDDED_EDGE_INSET_BASE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_FULLSCREEN_EDGE_INSET_BASE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_BOTTOM_INSET_BASE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SCALE,
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SHELL_PADDING_BASE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SLOT_BASE_PX,
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_MOBILE_HOTBAR_CLEARANCE_BASE_PX,
} from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import type { CSSProperties } from 'react';

export type ResolvingWorldPlazaMiniMapStackViewportStylesParams = {
  viewportHudScale: number;
  isMobile: boolean;
  isFullscreen: boolean;
  isInventoryHotbarVisible: boolean;
};

/**
 * Occupied height of the inventory hotbar shell in CSS pixels.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function computingWorldPlazaInventoryHotbarOccupiedHeightPx(
  viewportHudScale: number
): number {
  const slotPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SLOT_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SCALE
  );
  const shellPaddingPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SHELL_PADDING_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SCALE
  );

  return slotPx + shellPaddingPx * 2;
}

/**
 * Bottom inset that clears the centered inventory hotbar on mobile.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function computingWorldPlazaMiniMapStackMobileHotbarClearanceBottomPx(
  viewportHudScale: number
): number {
  return (
    computingWorldPlazaViewportHudScaledPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_BOTTOM_INSET_BASE_PX,
      viewportHudScale
    ) +
    computingWorldPlazaInventoryHotbarOccupiedHeightPx(viewportHudScale) +
    computingWorldPlazaViewportHudScaledPx(
      DEFINING_WORLD_PLAZA_MINI_MAP_STACK_MOBILE_HOTBAR_CLEARANCE_BASE_PX,
      viewportHudScale
    )
  );
}

/**
 * Resolves bottom-left anchor offsets for the minimap stack.
 *
 * Uses inline px values so positioning does not depend on Tailwind spacing
 * utilities being present in the production CSS bundle.
 */
export function resolvingWorldPlazaMiniMapStackViewportStyles({
  viewportHudScale,
  isMobile,
  isFullscreen,
  isInventoryHotbarVisible,
}: ResolvingWorldPlazaMiniMapStackViewportStylesParams): CSSProperties {
  const edgeInsetBasePx = isFullscreen
    ? DEFINING_WORLD_PLAZA_MINI_MAP_STACK_FULLSCREEN_EDGE_INSET_BASE_PX
    : DEFINING_WORLD_PLAZA_MINI_MAP_STACK_EMBEDDED_EDGE_INSET_BASE_PX;
  const edgeInsetPx = computingWorldPlazaViewportHudScaledPx(
    edgeInsetBasePx,
    viewportHudScale
  );
  const bottomPx =
    isMobile && isInventoryHotbarVisible
      ? computingWorldPlazaMiniMapStackMobileHotbarClearanceBottomPx(
          viewportHudScale
        )
      : edgeInsetPx;

  return {
    left: `max(${edgeInsetPx}px, env(safe-area-inset-left, 0px))`,
    bottom: `max(${bottomPx}px, env(safe-area-inset-bottom, 0px))`,
  };
}
