/**
 * Favorite-prey sight and engagement tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeFavoritePreyConstants
 */

import { DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';

/** Grid distance at which a predator notices a favorite prey species on sight. */
export const DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID =
  DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID;

/** Player hits override favorite-prey locks for this long. */
export const DEFINING_WILDLIFE_FAVORITE_PREY_PLAYER_REVENGE_AGGRO_MS = 30_000;
