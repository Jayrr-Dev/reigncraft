import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { computingWorldPlazaInventoryHotbarShellWidthPx } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import type { CSSProperties } from 'react';

/** Base drumstick icon size in px (unscaled). */
export const DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_ICON_BASE_PX = 12;

/** Gap between the hunger row and the inventory hotbar shell (px). */
export const DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_GAP_ABOVE_HOTBAR_BASE_PX = 4;

/** Cooked-meat tone for filled hunger icons (poster orange). */
export const DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR = '#c1592f';

/** Dim bone tone for empty hunger icons. */
export const DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR =
  'rgba(85, 80, 63, 0.55)';

export type DefiningWorldPlazaHungerIndicatorViewportStyles = {
  readonly rowStyle: CSSProperties;
  readonly iconSizePx: number;
};

/**
 * Viewport styles that align the hunger row with the inventory hotbar shell.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function resolvingWorldPlazaHungerIndicatorViewportStyles(
  viewportHudScale: number
): DefiningWorldPlazaHungerIndicatorViewportStyles {
  const shellWidthPx =
    computingWorldPlazaInventoryHotbarShellWidthPx(viewportHudScale);
  const iconSizePx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_ICON_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE
  );

  return {
    rowStyle: {
      width: shellWidthPx,
    },
    iconSizePx,
  };
}
