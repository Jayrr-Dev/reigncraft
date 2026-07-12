import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import type { DefiningWorldPlazaMiniMapStackInventoryHotbarClearanceLayout } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import { resolvingWorldPlazaMiniMapStackViewportLayout } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportLayout';
import { DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
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
  const gapPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX,
    viewportHudScale,
    inventoryHotbarClearance.scale
  );

  const gridHeightPx =
    slotPx * DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT +
    gapPx * Math.max(0, DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT - 1);

  return gridHeightPx + shellPaddingPx * 2;
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
