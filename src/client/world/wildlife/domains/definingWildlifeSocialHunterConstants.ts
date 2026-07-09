/**
 * Social hunter: pack predators forgo hunting until enough allies gather.
 *
 * @module components/world/wildlife/domains/definingWildlifeSocialHunterConstants
 */

import { DEFINING_WILDLIFE_STALK_PACK_COMMIT_MIN_COUNT } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

/** Minimum living area-pack size before a social hunter may open a hunt. */
export const DEFINING_WILDLIFE_SOCIAL_HUNTER_MIN_PACK_COUNT =
  DEFINING_WILDLIFE_STALK_PACK_COMMIT_MIN_COUNT;

/**
 * How far a solo (or under-strength) social hunter looks for packmates to join
 * (grid). Wider than stalk join radius so scattered wolves can regroup.
 */
export const DEFINING_WILDLIFE_SOCIAL_HUNTER_SEARCH_RADIUS_GRID = 28;

/** Stop the seek run once within this distance of the chosen packmate (grid). */
export const DEFINING_WILDLIFE_SOCIAL_HUNTER_COMFORT_DISTANCE_GRID = 3;
