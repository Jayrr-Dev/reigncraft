import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_DAMAGE_MULTIPLIER,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_THRESHOLD,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWorldPlazaEntityHealthIncomingDamageMultiplierParams = {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  currentHealth: number;
  effectiveMaxHealth: number;
};

/**
 * Multiplies all active incoming-damage modifiers and the below-half-health bonus.
 */
export function resolvingWorldPlazaEntityHealthIncomingDamageMultiplier({
  state,
  nowMs,
  currentHealth,
  effectiveMaxHealth,
}: ResolvingWorldPlazaEntityHealthIncomingDamageMultiplierParams): number {
  const activeModifierProduct = state.incomingDamageModifiers
    .filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    )
    .reduce((product, modifier) => product * modifier.multiplier, 1);

  const healthRatio =
    effectiveMaxHealth > 0 ? currentHealth / effectiveMaxHealth : 1;
  const lowHealthMultiplier =
    healthRatio < DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_THRESHOLD
      ? DEFINING_WORLD_PLAZA_ENTITY_HEALTH_LOW_RATIO_DAMAGE_MULTIPLIER
      : 1;

  return activeModifierProduct * lowHealthMultiplier;
}
