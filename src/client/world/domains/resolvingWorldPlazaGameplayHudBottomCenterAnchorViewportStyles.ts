import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import type { CSSProperties } from 'react';

/**
 * Resolves bottom inset for bottom-center HUD anchors (inventory, edit hotbars).
 *
 * Uses inline px values so positioning does not depend on Tailwind spacing
 * utilities being present in the production CSS bundle, and respects iOS safe
 * areas inside Reddit iframes.
 */
export function resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(
  viewportHudScale: number
): CSSProperties {
  const bottomInsetPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
      .inventoryHotbar.edgeInsetBasePx,
    viewportHudScale
  );

  return {
    bottom: `calc(${bottomInsetPx}px + env(safe-area-inset-bottom, 0px))`,
  };
}
