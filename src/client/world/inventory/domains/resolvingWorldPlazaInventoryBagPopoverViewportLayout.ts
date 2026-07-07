import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE,
  DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { CSSProperties } from 'react';

/** Viewport layout for one bag storage popover grid. */
export type DefiningWorldPlazaInventoryBagPopoverViewportLayout = {
  readonly panelStyle: CSSProperties;
  readonly gridStyle: CSSProperties;
};

/** Base padding inside the bag popover panel in px. */
const DEFINING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_PANEL_PADDING_BASE_PX =
  8 as const;

/**
 * Resolves fixed bag popover dimensions so the grid is not squeezed to hotbar slot width.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param columns - Bag internal column count
 * @param rows - Bag internal row count
 */
export function resolvingWorldPlazaInventoryBagPopoverViewportLayout(
  viewportHudScale: number,
  columns: number,
  rows: number
): DefiningWorldPlazaInventoryBagPopoverViewportLayout {
  const slotEdgePx = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  ).width;
  const gapPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );
  const panelPaddingPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_PANEL_PADDING_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );

  const gridWidthPx = columns * slotEdgePx + Math.max(0, columns - 1) * gapPx;
  const gridHeightPx = rows * slotEdgePx + Math.max(0, rows - 1) * gapPx;

  return {
    panelStyle: {
      minWidth: gridWidthPx + panelPaddingPx * 2,
      padding: panelPaddingPx,
    },
    gridStyle: {
      gap: gapPx,
      width: gridWidthPx,
      height: gridHeightPx,
      gridTemplateColumns: `repeat(${columns}, ${slotEdgePx}px)`,
      gridTemplateRows: `repeat(${rows}, ${slotEdgePx}px)`,
    },
  };
}
