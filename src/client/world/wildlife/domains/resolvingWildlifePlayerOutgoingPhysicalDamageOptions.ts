/**
 * EV roll options for player-dealt physical damage on wildlife.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePlayerOutgoingPhysicalDamageOptions
 */

import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsResult = Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  'skipDamageRoll' | 'minimumOutcomeTier'
>;

/**
 * Player melee and projectile hits always roll EV damage (never flat).
 * Connected hits floor at `normal` so soften/block/dodge miss floats never show.
 * Forced tiers (sleep ambush, Ultra Instinct, dev) still bypass the floor.
 */
export function resolvingWildlifePlayerOutgoingPhysicalDamageOptions(): ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsResult {
  return {
    skipDamageRoll: false,
    minimumOutcomeTier: 'normal',
  };
}
