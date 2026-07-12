import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_CANVAS_SIZE_PX } from '@/components/world/domains/definingWorldPlazaMiniMapConstants';
import { resolvingWorldPlazaMiniMapStackViewportLayout } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportLayout';
import { resolvingWorldPlazaMobileJumpButtonViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMobileJumpButtonViewportStyles';
import type { CSSProperties } from 'react';

/** Mobile context that shifts the bottom-center anchor between corner controls. */
export type ResolvingWorldPlazaGameplayHudBottomCenterMobileFlanks = {
  /** True while the plaza host is in native fullscreen. */
  isFullscreen: boolean;
};

/**
 * Horizontal footprint of the bottom-left minimap card on mobile, from the
 * screen edge to the card's right edge plus breathing room.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param isFullscreen - True while the plaza host is in native fullscreen
 */
export function computingWorldPlazaGameplayHudBottomCenterMinimapReservedPx(
  viewportHudScale: number,
  isFullscreen: boolean
): number {
  const flankClearance =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
      .inventoryHotbar.mobileFlankClearance;
  const stackLayout = resolvingWorldPlazaMiniMapStackViewportLayout(
    true,
    isFullscreen
  );
  const edgeInsetPx = computingWorldPlazaViewportHudScaledPx(
    stackLayout.edgeInsetBasePx,
    viewportHudScale
  );
  const canvasSizePx =
    DEFINING_WORLD_PLAZA_MINI_MAP_CANVAS_SIZE_PX[
      isFullscreen ? 'fullscreen' : 'embedded'
    ].mobile;

  return (
    edgeInsetPx +
    canvasSizePx +
    flankClearance.minimapCardChromeBasePx +
    flankClearance.gapBasePx
  );
}

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
 * receives asymmetric horizontal padding so the centered content lands between
 * the bottom-left minimap card and the bottom-right jump button.
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
    paddingLeft: computingWorldPlazaGameplayHudBottomCenterMinimapReservedPx(
      viewportHudScale,
      mobileFlanks.isFullscreen
    ),
    paddingRight:
      computingWorldPlazaGameplayHudBottomCenterJumpReservedPx(
        viewportHudScale
      ),
  };
}
