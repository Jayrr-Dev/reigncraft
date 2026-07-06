import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE,
  DEFINING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_BASE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_PADDING_X_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_TEXT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SHELL_PADDING_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { CSSProperties } from 'react';

/** Viewport-resolved inline styles for the plaza inventory hotbar. */
export interface DefiningWorldPlazaInventoryHotbarViewportStyles {
  readonly shellStyle: CSSProperties;
  readonly gridStyle: CSSProperties;
  readonly slotStyle: CSSProperties;
  readonly dragSurfaceStyle: CSSProperties;
  readonly iconStyle: CSSProperties;
  readonly emojiStyle: CSSProperties;
  readonly fallbackTextStyle: CSSProperties;
  readonly quantityBadgeStyle: CSSProperties;
  readonly loadingShellStyle: CSSProperties;
  readonly loadingTextStyle: CSSProperties;
}

/**
 * Total shell width of the inventory hotbar in CSS pixels.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function computingWorldPlazaInventoryHotbarShellWidthPx(
  viewportHudScale: number
): number {
  const slotPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const gapPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const paddingPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SHELL_PADDING_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );

  return (
    paddingPx * 2 +
    slotPx * DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY +
    gapPx * (DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY - 1)
  );
}

/**
 * Resolves crisp pixel-sized inventory hotbar styles for the current viewport scale.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function resolvingWorldPlazaInventoryHotbarViewportStyles(
  viewportHudScale: number
): DefiningWorldPlazaInventoryHotbarViewportStyles {
  const slotStyle = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const iconStyle = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const shellGapPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const shellPaddingPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SHELL_PADDING_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const emojiPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const fallbackTextPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const quantityBadgeHeightPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_BASE_HEIGHT_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const quantityBadgePaddingXPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_PADDING_X_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const quantityBadgeTextPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_TEXT_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const loadingTextPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );

  return {
    shellStyle: {
      gap: shellGapPx,
      padding: shellPaddingPx,
    },
    gridStyle: {
      gap: shellGapPx,
    },
    slotStyle,
    dragSurfaceStyle: slotStyle,
    iconStyle,
    emojiStyle: {
      fontSize: emojiPx,
      lineHeight: 1,
    },
    fallbackTextStyle: {
      fontSize: fallbackTextPx,
    },
    quantityBadgeStyle: {
      height: quantityBadgeHeightPx,
      minWidth: quantityBadgeHeightPx,
      paddingLeft: quantityBadgePaddingXPx,
      paddingRight: quantityBadgePaddingXPx,
      fontSize: quantityBadgeTextPx,
    },
    loadingShellStyle: {
      height: slotStyle.height,
    },
    loadingTextStyle: {
      fontSize: loadingTextPx,
    },
  };
}
