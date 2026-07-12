import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS,
  DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON_SIZE_RATIO,
  DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE,
  DEFINING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_MIN_HIT_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_BASE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_PADDING_X_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_TEXT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SHELL_BORDER_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SHELL_PADDING_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { CSSProperties } from 'react';

/**
 * Visual page-arrow face edge vs inventory slot edge.
 * Two stacked faces + gap stay within one slot height; hit boxes may expand past that.
 */
const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_RATIO = 0.42;

/** Glyph size vs visual arrow face edge so the triangle fills the highlight. */
const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_RATIO = 0.9;

/** Viewport-resolved inline styles for the plaza inventory hotbar. */
export interface DefiningWorldPlazaInventoryHotbarViewportStyles {
  readonly shellStyle: CSSProperties;
  readonly shellBodyStyle: CSSProperties;
  readonly gridStyle: CSSProperties;
  readonly slotStyle: CSSProperties;
  readonly dragSurfaceStyle: CSSProperties;
  readonly iconStyle: CSSProperties;
  readonly emptyFistIconStyle: CSSProperties;
  readonly emojiStyle: CSSProperties;
  readonly fallbackTextStyle: CSSProperties;
  readonly quantityBadgeStyle: CSSProperties;
  readonly loadingShellStyle: CSSProperties;
  readonly loadingTextStyle: CSSProperties;
  readonly pageArrowStackStyle: CSSProperties;
  /** Expanded tap/drag target; may exceed visual face via negative margin. */
  readonly pageArrowHitStyle: CSSProperties;
  /** Visible parchment face size (unchanged when hit expands). */
  readonly pageArrowButtonStyle: CSSProperties;
  readonly pageArrowIconStyle: CSSProperties;
}

/**
 * Total border-box shell width of the inventory hotbar in CSS pixels.
 * Includes slots, page arrows, padding, and the wood border so mode tabs /
 * craft / build shells can lock to the same measured footprint.
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

  const gridWidthPx =
    slotPx * DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS +
    gapPx * (DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS - 1);
  const arrowColumnWidthPx = Math.max(
    1,
    Math.round(slotPx * DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_RATIO)
  );

  return (
    paddingPx * 2 +
    gridWidthPx +
    gapPx +
    arrowColumnWidthPx +
    DEFINING_WORLD_PLAZA_INVENTORY_SHELL_BORDER_PX * 2
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
  const slotEdgePx =
    typeof slotStyle.width === 'number'
      ? slotStyle.width
      : computingWorldPlazaViewportHudScaledPx(
          DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX,
          viewportHudScale,
          DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
        );
  const gridHeightPx =
    slotEdgePx * DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT +
    shellGapPx *
      Math.max(0, DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT - 1);
  const pageArrowEdgePx = Math.max(
    1,
    Math.round(
      slotEdgePx * DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_RATIO
    )
  );
  const pageArrowIconPx = Math.max(
    1,
    Math.round(
      pageArrowEdgePx * DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_RATIO
    )
  );
  const pageArrowGapPx = Math.max(1, Math.round(shellGapPx * 0.5));
  const pageArrowHitHeightPx = Math.max(
    pageArrowEdgePx,
    Math.floor((gridHeightPx - pageArrowGapPx) / 2)
  );
  const pageArrowHitWidthPx = Math.max(
    pageArrowEdgePx,
    DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_MIN_HIT_PX
  );
  const pageArrowHitMarginXPx = (pageArrowEdgePx - pageArrowHitWidthPx) / 2;
  const emptyFistIconEdgePx = Math.max(
    1,
    Math.round(
      slotEdgePx * DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON_SIZE_RATIO
    )
  );
  const shellWidthPx =
    computingWorldPlazaInventoryHotbarShellWidthPx(viewportHudScale);

  return {
    shellStyle: {
      width: shellWidthPx,
      boxSizing: 'border-box',
      gap: shellGapPx,
      padding: shellPaddingPx,
    },
    shellBodyStyle: {
      gap: shellGapPx,
      alignItems: 'center',
    },
    gridStyle: {
      gap: shellGapPx,
      gridTemplateColumns: `repeat(${DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS}, ${slotEdgePx}px)`,
      gridTemplateRows: `repeat(${DEFINING_WORLD_PLAZA_INVENTORY_VISIBLE_ROW_COUNT}, ${slotEdgePx}px)`,
    },
    slotStyle,
    dragSurfaceStyle: slotStyle,
    iconStyle,
    emptyFistIconStyle: {
      width: emptyFistIconEdgePx,
      height: emptyFistIconEdgePx,
    },
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
      height: gridHeightPx,
      minWidth: shellWidthPx,
    },
    loadingTextStyle: {
      fontSize: loadingTextPx,
    },
    pageArrowStackStyle: {
      gap: pageArrowGapPx,
      height: gridHeightPx,
      justifyContent: 'center',
    },
    pageArrowHitStyle: {
      width: pageArrowHitWidthPx,
      height: pageArrowHitHeightPx,
      marginLeft: pageArrowHitMarginXPx,
      marginRight: pageArrowHitMarginXPx,
    },
    pageArrowButtonStyle: {
      width: pageArrowEdgePx,
      height: pageArrowEdgePx,
    },
    pageArrowIconStyle: {
      width: pageArrowIconPx,
      height: pageArrowIconPx,
    },
  };
}
