import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_LAYOUT,
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_REGISTRY,
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_MAX_LABEL_LENGTH,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaHudToolbarModeBadgesViewportStyles = {
  readonly stackStyle: CSSProperties;
  readonly switcherStyle: CSSProperties;
  readonly buttonStyle: CSSProperties;
  readonly contentStyle: CSSProperties;
  readonly iconSlotStyle: CSSProperties;
  readonly iconStyle: CSSProperties;
  readonly labelStyle: CSSProperties;
};

/**
 * Resolves badge chrome for the HUD toolbar mode strip.
 *
 * Parent stack owns shell width. Mode tabs share that width equally, with a
 * shared icon+label content footprint so every tab matches ITEMS.
 */
export function resolvingWorldPlazaHudToolbarModeBadgesViewportStyles(
  viewportHudScale: number,
  isMobile = false
): DefiningWorldPlazaHudToolbarModeBadgesViewportStyles {
  const designScale = DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE;
  const layout = DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_LAYOUT;
  const modeCount = DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_REGISTRY.length;
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
      width: '100%',
    },
    switcherStyle: {
      gap: buttonGapPx,
      gridTemplateColumns: `repeat(${modeCount}, minmax(0, 1fr))`,
    },
    buttonStyle: {
      paddingTop: paddingYPx,
      paddingBottom: paddingYPx,
      paddingLeft: paddingXPx,
      paddingRight: paddingXPx,
    },
    contentStyle: {
      gap: iconLabelGapPx,
    },
    iconSlotStyle: {
      width: iconPx,
      height: iconPx,
    },
    iconStyle: {
      width: iconPx,
      height: iconPx,
    },
    labelStyle: {
      fontSize: labelTextPx,
      letterSpacing: `${labelTrackingEm}em`,
      width: `${DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_MAX_LABEL_LENGTH}ch`,
    },
  };
}
