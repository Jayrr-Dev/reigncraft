/**
 * EV roll options for player-dealt physical damage on wildlife.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePlayerOutgoingPhysicalDamageOptions
 */

import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsResult = Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  'skipDamageRoll'
>;

/**
 * Player melee and projectile hits always roll EV damage (never flat).
 */
export function resolvingWildlifePlayerOutgoingPhysicalDamageOptions(): ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsResult {
  return {
    skipDamageRoll: false,
  };
}
