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

/**
 * Base chance a hooked creature slips the line before the cast completes.
 * Better tiers and harvest speed lower the final roll.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_BY_TIER: Record<
  DefiningWorldPlazaHeldItemTier,
  number
> = {
  wood: 0.2,
  iron: 0.14,
  steel: 0.09,
  gold: 0.05,
};

/** Floor for escape chance after rod bonuses. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_MIN = 0.02;

/** Ceiling for escape chance after rod bonuses. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_MAX = 0.35;

/** Escape chance removed per successful reel click during an active cast. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_PER_CLICK = 0.04;

/** Max total escape reduction from reeling on one cast. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_MAX = 0.14;

/** Min milliseconds between reel clicks on one cast. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_CLICK_COOLDOWN_MS = 180;

/** Fish granted per successful cast. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_QUANTITY = 1;

/** Progress ring icon for fishing casts. */
export const DEFINING_WORLD_PLAZA_FISHING_TIMED_INTERACTION_PROGRESS_ICON =
  'mdi:fishing' as const;
