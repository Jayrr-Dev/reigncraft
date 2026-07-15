/**
 * Fishing balance and timed cast constants.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingConstants
 */

import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';

/** Max Chebyshev distance from player foot to water tile for casting. */
export const DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES = 2;

/** Channel duration multiplier per tier (lower = faster). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_MULTIPLIER_BY_TIER: Record<
  DefiningWorldPlazaHeldItemTier,
  number
> = {
  wood: 1,
  iron: 0.88,
  steel: 0.76,
  gold: 0.64,
};

/** Fish granted per successful cast. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY = 1;

/** Progress ring icon for fishing casts. */
export const DEFINING_WORLD_PLAZA_FISHING_TIMED_INTERACTION_PROGRESS_ICON =
  'mdi:fishing' as const;
