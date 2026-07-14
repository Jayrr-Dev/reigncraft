/**
 * Local layout for the wildlife hunger orb + optional HP/stamina bars.
 *
 * @module components/world/wildlife/domains/computingWildlifeHungerCircleLocalLayout
 */

import {
  DEFINING_WILDLIFE_HUNGER_CIRCLE_GAP_FROM_BARS_PX,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_ICON_SIZE_PX,
  DEFINING_WILDLIFE_HUNGER_CIRCLE_OUTER_RADIUS_PX,
  DEFINING_WILDLIFE_VITALS_BAR_GAP_PX,
  DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX,
  DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX,
  DEFINING_WILDLIFE_VITALS_STAMINA_BAR_HEIGHT_PX,
} from '@/components/world/wildlife/domains/definingWildlifeVitalsBarConstants';

export type ComputingWildlifeHungerCircleLocalLayout = {
  readonly centerX: number;
  readonly centerY: number;
  readonly iconSizePx: number;
};

/**
 * Resolves hunger orb center + icon size in vitals Graphics local space.
 */
export function computingWildlifeHungerCircleLocalLayout(
  showBars: boolean
): ComputingWildlifeHungerCircleLocalLayout {
  const barsHeight =
    DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX +
    DEFINING_WILDLIFE_VITALS_BAR_GAP_PX +
    DEFINING_WILDLIFE_VITALS_STAMINA_BAR_HEIGHT_PX;
  const centerX = showBars
    ? -DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX / 2 -
      DEFINING_WILDLIFE_HUNGER_CIRCLE_GAP_FROM_BARS_PX -
      DEFINING_WILDLIFE_HUNGER_CIRCLE_OUTER_RADIUS_PX
    : 0;
  const centerY = showBars ? barsHeight / 2 : 0;

  return {
    centerX,
    centerY,
    iconSizePx: DEFINING_WILDLIFE_HUNGER_CIRCLE_ICON_SIZE_PX,
  };
}
