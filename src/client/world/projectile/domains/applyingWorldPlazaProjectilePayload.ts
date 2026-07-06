import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Maps declarative projectile payloads onto the entity health engine.
 *
 * @module components/world/projectile/domains/applyingWorldPlazaProjectilePayload
 */

export type ApplyingWorldPlazaProjectilePayloadParams = {
  readonly state: DefiningWorldPlazaEntityHealthState;
  readonly archetype: DefiningWorldPlazaProjectileArchetype;
  readonly nowMs: number;
};

/**
 * Applies a projectile archetype payload to an entity health state.
 */
export function applyingWorldPlazaProjectilePayload({
  state,
  archetype,
  nowMs,
}: ApplyingWorldPlazaProjectilePayloadParams): DefiningWorldPlazaEntityHealthState {
  let nextState = state;
  const payload = archetype.payload;

  if (payload.damageAmount !== undefined && payload.damageAmount > 0) {
    const damageResult = computingWorldPlazaEntityHealthDamage({
      state: nextState,
      rawAmount: payload.damageAmount,
      kind: payload.damageKind ?? 'physical',
      nowMs,
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
    }
  }

  return nextState;
}
