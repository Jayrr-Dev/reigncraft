import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { applyingWorldPlazaEntityHealthTemperatureImpulse } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthTemperatureImpulse';
import { computingWorldPlazaEntityHealthDamageWithSleepWake } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageWithSleepWake';
import type {
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaProjectilePayloadConfig } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Applies declarative combat payload data to one entity health state.
 *
 * @module components/world/health/domains/applyingWorldPlazaEntityHealthPayload
 */

export type ApplyingWorldPlazaEntityHealthPayloadParams = {
  readonly state: DefiningWorldPlazaEntityHealthState;
  readonly payload: DefiningWorldPlazaProjectilePayloadConfig;
  readonly nowMs: number;
  readonly damageOptions?: Pick<
    DefiningWorldPlazaEntityHealthDamageOptions,
    | 'skipDamageRoll'
    | 'attackerDamageRollModifiers'
    | 'forcedDeviationScore'
    | 'forcedRollMode'
    | 'random'
    | 'ephemeralDefenderDamageRollModifiers'
    | 'ephemeralIncomingDamageMultiplier'
  >;
};

/**
 * Applies instant damage and status effects from a payload config.
 */
export function applyingWorldPlazaEntityHealthPayload({
  state,
  payload,
  nowMs,
  damageOptions,
}: ApplyingWorldPlazaEntityHealthPayloadParams): DefiningWorldPlazaEntityHealthState {
  let nextState = state;

  if (payload.damageAmount !== undefined && payload.damageAmount > 0) {
    const damageResult = computingWorldPlazaEntityHealthDamageWithSleepWake({
      state: nextState,
      rawAmount: payload.damageAmount,
      kind: payload.damageKind ?? 'physical',
      nowMs,
      options: damageOptions,
    });
    nextState = damageResult.state;
  }

  for (const statusEffect of payload.statusEffects ?? []) {
    if (statusEffect.kind === 'poison') {
      nextState = applyingWorldPlazaEntityHealthPoisonStack(
        nextState,
        statusEffect.potency,
        statusEffect.totalDamage,
        nowMs
      );
    } else if (statusEffect.kind === 'bleed') {
      nextState = applyingWorldPlazaEntityHealthBleedStack(
        nextState,
        statusEffect.severity,
        statusEffect.totalDamage,
        nowMs
      );
    } else if (statusEffect.kind === 'buff') {
      nextState = applyingWorldPlazaEntityBuff(
        nextState,
        statusEffect.buffId,
        nowMs
      );
    } else if (statusEffect.kind === 'potentialDamage') {
      nextState = applyingWorldPlazaEntityHealthPotentialDamage({
        state: nextState,
        pendingExpectedDamage: statusEffect.expectedDamage,
        resolveDelayMs: statusEffect.resolveDelayMs,
        nowMs,
      });
    } else if (statusEffect.kind === 'temperature') {
      nextState = applyingWorldPlazaEntityHealthTemperatureImpulse(
        nextState,
        statusEffect.deltaCelsius
      );
    }
  }

  return nextState;
}
