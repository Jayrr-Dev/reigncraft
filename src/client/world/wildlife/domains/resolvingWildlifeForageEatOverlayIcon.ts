/**
 * Center icon for one wildlife forage / graze eat overlay.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeForageEatOverlayIcon
 */

import { checkingWildlifeGroundFlowerItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';
import { checkingWildlifeGroundGrassItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants';
import { checkingWildlifeGroundShrubItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundShrubIdConstants';
import {
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_BERRY,
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FLOWER,
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FOOD,
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRASS,
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRAZE,
} from '@/components/world/wildlife/domains/definingWildlifeForageEatOverlayConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Resolves the eat-ring icon for the current forage / graze intent. */
export function resolvingWildlifeForageEatOverlayIcon(
  intent: DefiningWildlifeBehaviorIntent
): string | null {
  if (intent.mode === 'graze') {
    return DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRAZE;
  }

  if (intent.mode !== 'forageEat') {
    return null;
  }

  const groundItemId = intent.targetGroundItemId;

  if (checkingWildlifeGroundGrassItemId(groundItemId)) {
    return DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRASS;
  }

  if (checkingWildlifeGroundFlowerItemId(groundItemId)) {
    return DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FLOWER;
  }

  if (checkingWildlifeGroundShrubItemId(groundItemId)) {
    return DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_BERRY;
  }

  return DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FOOD;
}
