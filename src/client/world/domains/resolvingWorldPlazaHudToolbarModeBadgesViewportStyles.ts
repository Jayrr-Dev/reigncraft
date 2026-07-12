import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_LAYOUT } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { computingWorldPlazaInventoryHotbarShellWidthPx } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaHudToolbarModeBadgesViewportStyles = {
  readonly stackStyle: CSSProperties;
  readonly switcherStyle: CSSProperties;
  readonly buttonStyle: CSSProperties;
  readonly iconStyle: CSSProperties;
  readonly labelStyle: CSSProperties;
};

/**
 * Resolves badge strip size to match the inventory hotbar shell.
 *
 * Width locks to the inventory shell. Chrome (padding, font, icon) uses the
 * same hotbar design scale so badges shrink/grow with inventory slots.
 * Mobile uses a smaller label so CRAFT / CLAIM fit without truncation.
 */
export function resolvingWorldPlazaHudToolbarModeBadgesViewportStyles(
  viewportHudScale: number,
  isMobile = false
): DefiningWorldPlazaHudToolbarModeBadgesViewportStyles {
  const designScale = DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE;
  const layout = DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_LAYOUT;
  const shellWidthPx =
    computingWorldPlazaInventoryHotbarShellWidthPx(viewportHudScale);
  const paddingYPx = computingWorldPlazaViewportHudScaledPx(
    layout.paddingYBasePx,
    viewportHudScale,
    designScale
  );
  const paddingXPx = computingWorldPlazaViewportHudScaledPx(
    isMobile ? layout.mobilePaddingXBasePx : layout.paddingXBasePx,
    viewportHudScale,
    designScale
  );
  const iconLabelGapPx = computingWorldPlazaViewportHudScaledPx(
    isMobile ? layout.mobileIconLabelGapBasePx : layout.iconLabelGapBasePx,
    viewportHudScale,
    designScale
  );
  const buttonGapPx = computingWorldPlazaViewportHudScaledPx(
    layout.buttonGapBasePx,
    viewportHudScale,
    designScale
  );
  const labelTextPx = computingWorldPlazaViewportHudScaledPx(
    isMobile ? layout.mobileLabelTextBasePx : layout.labelTextBasePx,
    viewportHudScale,
    designScale
  );
  const iconPx = computingWorldPlazaViewportHudScaledPx(
    isMobile ? layout.mobileIconBasePx : layout.iconBasePx,
    viewportHudScale,
    designScale
  );
  const labelTrackingEm = isMobile
    ? layout.mobileLabelTrackingEm
    : layout.labelTrackingEm;

  return {
    stackStyle: {
      width: shellWidthPx,
    },
    switcherStyle: {
      gap: buttonGapPx,
    },
    buttonStyle: {
      gap: iconLabelGapPx,
      paddingTop: paddingYPx,
      paddingBottom: paddingYPx,
      paddingLeft: paddingXPx,
      paddingRight: paddingXPx,
    },
    iconStyle: {
      width: iconPx,
      height: iconPx,
    },
    labelStyle: {
      fontSize: labelTextPx,
      letterSpacing: `${labelTrackingEm}em`,
    },
  };
}
