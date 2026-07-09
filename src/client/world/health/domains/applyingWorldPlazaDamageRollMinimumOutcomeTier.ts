/**
 * Floors a damage-roll result so connected hits cannot land below a tier.
 *
 * @module components/world/health/domains/applyingWorldPlazaDamageRollMinimumOutcomeTier
 */

import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { RollingWorldPlazaDamageEngineResult } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

/** Lower rank = worse miss-like outcome. Higher ranks stay untouched. */
const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_HIT_RANK: Record<
  DefiningWorldPlazaDamageOutcomeTier,
  number
> = {
  dodged: 0,
  blocked: 1,
  softened: 2,
  normal: 3,
  true_strike: 3,
  critical: 4,
  lethal: 5,
  fatal: 6,
};

/**
 * Raises rolled damage and tier when the sample fell below `minimumOutcomeTier`.
 * Damage is floored to EV so a guaranteed connect never reads as a miss float.
 */
export function applyingWorldPlazaDamageRollMinimumOutcomeTier(
  rollResult: RollingWorldPlazaDamageEngineResult,
  minimumOutcomeTier: DefiningWorldPlazaDamageOutcomeTier
): RollingWorldPlazaDamageEngineResult {
  const rolledRank =
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_HIT_RANK[rollResult.tier];
  const minimumRank =
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_HIT_RANK[minimumOutcomeTier];

  if (rolledRank >= minimumRank) {
    return rollResult;
  }

  const flooredDamage = Math.max(
    rollResult.rolledDamage,
    rollResult.expectedDamage
  );
  const flooredDeviationScore =
    rollResult.standardDeviation > 0
      ? (flooredDamage - rollResult.expectedDamage) /
        rollResult.standardDeviation
      : 0;

  return {
    ...rollResult,
    rolledDamage: flooredDamage,
    deviationScore: flooredDeviationScore,
    tier: minimumOutcomeTier,
  };
}
