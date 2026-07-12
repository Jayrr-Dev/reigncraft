import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX,
  DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import type { CSSProperties } from 'react';

/** Brown fill for the hunger sphere (full = high hunger). */
export const DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR = '#8b5a2b';

/** Dim empty track behind the brown fill. */
export const DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR =
  'rgba(55, 45, 32, 0.72)';

/** CSS class for the clickable hunger orb shell. */
export const STYLING_WORLD_PLAZA_HUNGER_INDICATOR_ORB_CLASS_NAME =
  'plaza-hunger-orb relative flex shrink-0 items-center justify-center rounded-full' as const;

/** CSS class for the clipped fill disc inside the hungering orb. */
export const STYLING_WORLD_PLAZA_HUNGER_INDICATOR_FILL_DISC_CLASS_NAME =
  'absolute inset-[3px] overflow-hidden rounded-full' as const;

export type DefiningWorldPlazaHungerIndicatorViewportStyles = {
  readonly sphereStyle: CSSProperties;
  readonly iconSizePx: number;
};

/**
 * Viewport styles that size the hunger sphere to match action bar buttons.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 * @param isMobile - When true, applies the action bar mobile shrink
 */
export function resolvingWorldPlazaHungerIndicatorViewportStyles(
  viewportHudScale: number,
  isMobile = false
): DefiningWorldPlazaHungerIndicatorViewportStyles {
  const designScale =
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE *
    (isMobile ? DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE : 1);

  return {
    sphereStyle: stylingWorldPlazaViewportHudSquarePx(
      DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX,
      viewportHudScale,
      designScale
    ),
    iconSizePx: computingWorldPlazaViewportHudScaledPx(
      DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX,
      viewportHudScale,
      designScale
    ),
  };
}
