/**
 * EV roll options for player-dealt physical damage on wildlife.
 *
 * @module components/world/wildlife/domains/resolvingWildlifePlayerOutgoingPhysicalDamageOptions
 */

import type {
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthDamageRollModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsResult = Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  | 'skipDamageRoll'
  | 'minimumOutcomeTier'
  | 'attackerDamageRollModifiers'
  | 'forcedRollMode'
>;

export type ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsInput = {
  readonly attackerDamageRollModifiers?: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  readonly forcedRollMode?: DefiningWorldPlazaEntityHealthDamageOptions['forcedRollMode'];
};

/**
 * Player melee and projectile hits always roll EV damage (never flat).
 * Connected hits floor at `normal` so soften/block/dodge miss floats never show.
 * Forced tiers (sleep ambush, Ultra Instinct, specialty lock_in, dev) still bypass the floor.
 */
export function resolvingWildlifePlayerOutgoingPhysicalDamageOptions(
  input: ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsInput = {}
): ResolvingWildlifePlayerOutgoingPhysicalDamageOptionsResult {
  return {
    skipDamageRoll: false,
    minimumOutcomeTier: 'normal',
    ...(input.attackerDamageRollModifiers &&
    input.attackerDamageRollModifiers.length > 0
      ? {
          attackerDamageRollModifiers: [
            ...input.attackerDamageRollModifiers,
          ],
        }
      : {}),
    ...(input.forcedRollMode
      ? { forcedRollMode: input.forcedRollMode }
      : {}),
  };
}
