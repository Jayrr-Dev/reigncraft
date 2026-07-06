import { resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierForcedDeviationScores';
import { DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityHealthDamageRollModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_FORCED_TIER_DEVIATION_SCORES =
  Object.values(DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY).map(
    (descriptor) => descriptor.forcedDeviationScore
  );

/**
 * Maps a stored forced-tier modifier value back to its outcome tier.
 */
export function resolvingWorldPlazaDamageOutcomeTierFromForcedDeviationScore(
  forcedDeviationScore: number
): DefiningWorldPlazaDamageOutcomeTier | null {
  for (const descriptor of Object.values(
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY
  )) {
    if (descriptor.forcedDeviationScore === forcedDeviationScore) {
      return descriptor.tier;
    }
  }

  return null;
}

/**
 * Returns the deviation score that always produces the given tier.
 */
export function encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
  tier: DefiningWorldPlazaDamageOutcomeTier
): number {
  return resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore(tier);
}

/**
 * When multiple forced-tier modifiers are active, the lowest deviation score
 * wins so defensive outcomes beat offensive ones on the defender.
 */
export function resolvingWorldPlazaEntityHealthDamageRollForcedDeviationScoreFromModifiers(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[]
): number | null {
  const validScores = modifiers
    .filter((modifier) => modifier.kind === 'forced_tier')
    .map((modifier) => modifier.value)
    .filter((value) =>
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_FORCED_TIER_DEVIATION_SCORES.includes(
        value
      )
    );

  if (validScores.length === 0) {
    return null;
  }

  return Math.min(...validScores);
}

/**
 * Short label for mechanics copy, e.g. `Always Critical`.
 */
export function formattingWorldPlazaEntityHealthDamageRollForcedTierLabel(
  tier: DefiningWorldPlazaDamageOutcomeTier
): string {
  const descriptor = DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[tier];

  return `Always ${descriptor.label}`;
}
