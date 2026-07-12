import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { resolvingWorldPlazaMobileJumpButtonViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMobileJumpButtonViewportStyles';
import type { CSSProperties } from 'react';

/** Mobile context that shifts the bottom-center anchor away from the jump button. */
export type ResolvingWorldPlazaGameplayHudBottomCenterMobileFlanks = {
  /** True while the plaza host is in native fullscreen. */
  isFullscreen: boolean;
};

/**
 * Horizontal footprint of the bottom-right mobile jump button, from the screen
 * edge to the button's left edge plus breathing room.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function computingWorldPlazaGameplayHudBottomCenterJumpReservedPx(
  viewportHudScale: number
): number {
  const flankClearance =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
      .inventoryHotbar.mobileFlankClearance;
  const jumpButtonStyles =
    resolvingWorldPlazaMobileJumpButtonViewportStyles(viewportHudScale);
  const jumpButtonEdgePx =
    typeof jumpButtonStyles.buttonStyle.width === 'number'
      ? jumpButtonStyles.buttonStyle.width
      : 0;

  return (
    flankClearance.jumpButtonEdgeInsetPx +
    jumpButtonEdgePx +
    flankClearance.gapBasePx
  );
}

/**
 * Resolves bottom inset for bottom-center HUD anchors (inventory, edit hotbars).
 *
 * Uses inline px values so positioning does not depend on Tailwind spacing
 * utilities being present in the production CSS bundle, and respects iOS safe
 * areas inside Reddit iframes.
 *
 * When `mobileFlanks` is provided (phone-sized viewports), the anchor also
 * receives right padding so the centered content clears the jump button.
 */
export function resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(
  viewportHudScale: number,
  mobileFlanks?: ResolvingWorldPlazaGameplayHudBottomCenterMobileFlanks
): CSSProperties {
  const bottomInsetPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
      .inventoryHotbar.edgeInsetBasePx,
    viewportHudScale
  );
  const bottomStyle: CSSProperties = {
    bottom: `calc(${bottomInsetPx}px + env(safe-area-inset-bottom, 0px))`,
  };

  if (!mobileFlanks) {
    return bottomStyle;
  }

  return {
    ...bottomStyle,
    paddingRight:
      computingWorldPlazaGameplayHudBottomCenterJumpReservedPx(
        viewportHudScale
      ),
  };
}
