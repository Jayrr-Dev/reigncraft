import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import type { DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import { resolvingWorldPlazaMiniMapStackViewportLayout } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportLayout';
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
 * @param inventoryHotbarClearance - Mobile clearance layout from the stack profile
 */
export function computingWorldPlazaInventoryHotbarOccupiedHeightPx(
  viewportHudScale: number,
  inventoryHotbarClearance: DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout
): number {
  const slotPx = computingWorldPlazaViewportHudScaledPx(
    inventoryHotbarClearance.slotBasePx,
    viewportHudScale,
    inventoryHotbarClearance.scale
  );
  const shellPaddingPx = computingWorldPlazaViewportHudScaledPx(
    inventoryHotbarClearance.shellPaddingBasePx,
    viewportHudScale,
    inventoryHotbarClearance.scale
  );

  return slotPx + shellPaddingPx * 2;
}

/**
 * Bottom inset that clears the centered inventory hotbar on mobile.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param inventoryHotbarClearance - Mobile clearance layout from the stack profile
 */
export function computingWorldPlazaMiniMapStackMobileHotbarClearanceBottomPx(
  viewportHudScale: number,
  inventoryHotbarClearance: DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout
): number {
  return (
    computingWorldPlazaViewportHudScaledPx(
      inventoryHotbarClearance.bottomInsetBasePx,
      viewportHudScale
    ) +
    computingWorldPlazaInventoryHotbarOccupiedHeightPx(
      viewportHudScale,
      inventoryHotbarClearance
    ) +
    computingWorldPlazaViewportHudScaledPx(
      inventoryHotbarClearance.stackGapBasePx,
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
  const viewportLayout = resolvingWorldPlazaMiniMapStackViewportLayout(
    isMobile,
    isFullscreen
  );
  const edgeInsetPx = computingWorldPlazaViewportHudScaledPx(
    viewportLayout.edgeInsetBasePx,
    viewportHudScale
  );
  const inventoryHotbarClearance = viewportLayout.inventoryHotbarClearance;
  const bottomPx =
    inventoryHotbarClearance && isInventoryHotbarVisible
      ? computingWorldPlazaMiniMapStackMobileHotbarClearanceBottomPx(
          viewportHudScale,
          inventoryHotbarClearance
        )
      : edgeInsetPx;

  return {
    left: `calc(${edgeInsetPx}px + env(safe-area-inset-left, 0px))`,
    bottom: `calc(${bottomPx}px + env(safe-area-inset-bottom, 0px))`,
  };
}
