import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON_BASE_PX,
  DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_MIN_TOUCH_PX,
  DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_SCALE,
} from '@/components/world/domains/definingWorldPlazaMobileJumpButtonConstants';
import type { CSSProperties } from 'react';

/** Viewport-resolved inline styles for the mobile jump button. */
export interface DefiningWorldPlazaMobileJumpButtonViewportStyles {
  readonly anchorStyle: CSSProperties;
  readonly buttonStyle: CSSProperties;
  readonly iconStyle: CSSProperties;
}

/**
 * Clamps a HUD square edge to the mobile minimum touch size.
 *
 * @param edgePx - Scaled edge length in CSS pixels
 */
function clampingWorldPlazaMobileJumpButtonTouchEdgePx(edgePx: number): number {
  return Math.max(DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_MIN_TOUCH_PX, edgePx);
}

/**
 * Resolves crisp pixel-sized jump button styles for the current viewport scale.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function resolvingWorldPlazaMobileJumpButtonViewportStyles(
  viewportHudScale: number
): DefiningWorldPlazaMobileJumpButtonViewportStyles {
  const scaledButtonEdgePx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_SCALE
  );
  const buttonEdgePx =
    clampingWorldPlazaMobileJumpButtonTouchEdgePx(scaledButtonEdgePx);
  const iconEdgePx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_SCALE
  );
  const iconStyle = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_SCALE
  );
  const edgeInsetPx =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
      .inventoryHotbar.mobileFlankClearance.jumpButtonEdgeInsetPx;

  return {
    anchorStyle: {
      right: `calc(${edgeInsetPx}px + env(safe-area-inset-right, 0px))`,
      bottom: `calc(${edgeInsetPx}px + env(safe-area-inset-bottom, 0px))`,
    },
    buttonStyle: {
      width: buttonEdgePx,
      height: buttonEdgePx,
    },
    iconStyle: {
      ...iconStyle,
      width: iconEdgePx,
      height: iconEdgePx,
    },
  };
}
