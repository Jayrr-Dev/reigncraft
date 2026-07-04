import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Removes expired temporary bonuses, modifiers, DoTs, and invincibility buffs.
 */
export function expiringWorldPlazaEntityHealthTimedEffects(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    temporaryMaxHealthBonuses: state.temporaryMaxHealthBonuses.filter(
      (bonus) => bonus.expiresAtMs > nowMs
    ),
    incomingDamageModifiers: state.incomingDamageModifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    damageRollModifiers: state.damageRollModifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    damageOverTimeEffects: state.damageOverTimeEffects.filter(
      (effect) => effect.expiresAtMs > nowMs
    ),
    invincibleUntilMs:
      state.invincibleUntilMs !== null && state.invincibleUntilMs <= nowMs
        ? null
        : state.invincibleUntilMs,
  };
}
