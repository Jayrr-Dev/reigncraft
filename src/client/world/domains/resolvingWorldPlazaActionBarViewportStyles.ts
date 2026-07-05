import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_HEIGHT_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_MARGIN_X_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_NOTIFICATION_BADGE_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_NOTIFICATION_BADGE_TEXT_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_GAP_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_PADDING_BASE_PX,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import type { CSSProperties } from 'react';

/** Viewport-resolved inline styles for the plaza action bar. */
export interface DefiningWorldPlazaActionBarViewportStyles {
  readonly shellStyle: CSSProperties;
  readonly buttonStyle: CSSProperties;
  readonly iconStyle: CSSProperties;
  readonly dividerStyle: CSSProperties;
  readonly notificationBadgeStyle: CSSProperties;
}

/**
 * Resolves crisp pixel-sized action bar styles for the current viewport scale.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param isMobile - When true, applies an extra shrink for narrow viewports
 */
export function resolvingWorldPlazaActionBarViewportStyles(
  viewportHudScale: number,
  isMobile = false
): DefiningWorldPlazaActionBarViewportStyles {
  const designScale =
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE *
    (isMobile ? DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE : 1);
  const buttonStyle = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
    viewportHudScale,
    designScale
  );
  const iconStyle = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX,
    viewportHudScale,
    designScale
  );
  const shellGapPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_GAP_BASE_PX,
    viewportHudScale,
    designScale
  );
  const shellPaddingPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_PADDING_BASE_PX,
    viewportHudScale,
    designScale
  );
  const dividerHeightPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_HEIGHT_BASE_PX,
    viewportHudScale,
    designScale
  );
  const dividerMarginPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_MARGIN_X_BASE_PX,
    viewportHudScale,
    designScale
  );
  const notificationBadgePx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_NOTIFICATION_BADGE_BASE_PX,
    viewportHudScale,
    designScale
  );
  const notificationBadgeTextPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_NOTIFICATION_BADGE_TEXT_BASE_PX,
    viewportHudScale,
    designScale
  );

  return {
    shellStyle: {
      gap: shellGapPx,
      padding: shellPaddingPx,
    },
    buttonStyle,
    iconStyle,
    dividerStyle: {
      height: dividerHeightPx,
      marginInline: dividerMarginPx,
    },
    notificationBadgeStyle: {
      width: notificationBadgePx,
      height: notificationBadgePx,
      fontSize: notificationBadgeTextPx,
    },
  };
}
