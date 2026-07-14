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
    physicalDamageLifestealModifiers:
      state.physicalDamageLifestealModifiers.filter(
        (modifier) =>
          modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
      ),
    incomingDamageHealModifiers: state.incomingDamageHealModifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    incomingHealAmplifiers: state.incomingHealAmplifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    outgoingHealAmplifiers: state.outgoingHealAmplifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    movementModifiers: state.movementModifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    healBlockModifiers: state.healBlockModifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    confusionEffects: state.confusionEffects.filter(
      (effect) => effect.expiresAtMs === null || effect.expiresAtMs > nowMs
    ),
    sleepEffects: state.sleepEffects.filter(
      (effect) => effect.expiresAtMs > nowMs
    ),
    stunEffects: state.stunEffects.filter(
      (effect) => effect.expiresAtMs > nowMs
    ),
    damageRollModifiers: state.damageRollModifiers.filter(
      (modifier) =>
        modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
    ),
    timedTemperatureModifiers: state.timedTemperatureModifiers.filter(
      (modifier) => modifier.expiresAtMs > nowMs
    ),
    damageOverTimeEffects: state.damageOverTimeEffects.filter(
      (effect) => effect.expiresAtMs > nowMs
    ),
    poisonEffects: state.poisonEffects.filter(
      (effect) => effect.expiresAtMs > nowMs && effect.remainingPoisonDamage > 0
    ),
    bleedEffects: state.bleedEffects.filter(
      (effect) => effect.expiresAtMs > nowMs && effect.remainingBleedDamage > 0
    ),
    invincibleUntilMs:
      state.invincibleUntilMs !== null && state.invincibleUntilMs <= nowMs
        ? null
        : state.invincibleUntilMs,
  };
}
