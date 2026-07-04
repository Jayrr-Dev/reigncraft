import {
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY,
  listingWorldPlazaDamageOutcomeTierDevRollOrder,
  resolvingWorldPlazaDamageOutcomeTierDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Representative deviation score for forcing a tier in dev roll tests. */
export const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_FORCED_DEVIATION_SCORE: Partial<
  Record<DefiningWorldPlazaDamageOutcomeTier, number>
> = Object.fromEntries(
  Object.values(DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY).map(
    (descriptor) => [descriptor.tier, descriptor.forcedDeviationScore]
  )
) as Partial<Record<DefiningWorldPlazaDamageOutcomeTier, number>>;

/** Dev tier labels for forced 10 EV roll buttons. */
export const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_LABEL: Partial<
  Record<DefiningWorldPlazaDamageOutcomeTier, string>
> = Object.fromEntries(
  Object.values(DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY).map(
    (descriptor) => [descriptor.tier, descriptor.label]
  )
) as Partial<Record<DefiningWorldPlazaDamageOutcomeTier, string>>;

export const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_ORDER: DefiningWorldPlazaDamageOutcomeTier[] =
  listingWorldPlazaDamageOutcomeTierDevRollOrder();

export function resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore(
  tier: DefiningWorldPlazaDamageOutcomeTier
): number {
  return resolvingWorldPlazaDamageOutcomeTierDescriptor(tier)
    .forcedDeviationScore;
}
