import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Representative deviation score for forcing a tier in dev roll tests. */
export const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_FORCED_DEVIATION_SCORE: Partial<
  Record<DefiningWorldPlazaDamageOutcomeTier, number>
> = {
  true_strike: 0,
  critical: 1.25,
  lethal: 2.25,
  fatal: 3.5,
  normal: 0,
  softened: -1.25,
  blocked: -2.25,
  dodged: -3.5,
};

/** Dev tier labels for forced 10 EV roll buttons. */
export const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_LABEL: Partial<
  Record<DefiningWorldPlazaDamageOutcomeTier, string>
> = {
  normal: 'Normal',
  softened: 'Softened',
  blocked: 'Blocked',
  dodged: 'Dodged',
  critical: 'Critical',
  lethal: 'Lethal',
  fatal: 'Fatal',
  true_strike: 'True Strike',
};

export const DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_ORDER: DefiningWorldPlazaDamageOutcomeTier[] =
  [
    'softened',
    'blocked',
    'dodged',
    'normal',
    'critical',
    'lethal',
    'fatal',
    'true_strike',
  ];

export function resolvingWorldPlazaDamageOutcomeTierForcedDeviationScore(
  tier: DefiningWorldPlazaDamageOutcomeTier
): number {
  return (
    DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_FORCED_DEVIATION_SCORE[tier] ?? 0
  );
}
