/**
 * EV roll options for the first hit on a sleeping wildlife instance.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions
 */

import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';
import { DEFINING_WILDLIFE_SLEEP_AMBUSH_DAMAGE_OUTCOME_TIER } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeSleepAmbushHealthDamageOptionsResult = Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  | 'skipDamageRoll'
  | 'forcedDeviationScore'
  | 'bypassInvincibilityFrames'
  | 'grantInvincibilityFrames'
>;

/**
 * Returns forced lethal-tier EV roll options when the target is still asleep.
 */
export function resolvingWildlifeSleepAmbushHealthDamageOptions(
  instance: DefiningWildlifeInstance
): ResolvingWildlifeSleepAmbushHealthDamageOptionsResult | null {
  if (!instance.aiState.isSleeping) {
    return null;
  }

  return {
    skipDamageRoll: false,
    forcedDeviationScore: encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
      DEFINING_WILDLIFE_SLEEP_AMBUSH_DAMAGE_OUTCOME_TIER
    ),
    bypassInvincibilityFrames: true,
    grantInvincibilityFrames: false,
  };
}
