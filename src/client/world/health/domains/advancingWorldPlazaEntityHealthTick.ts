import { clampingWorldPlazaEntityHealthCurrentToEffectiveMax } from '@/components/world/health/domains/clampingWorldPlazaEntityHealthCurrentToEffectiveMax';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { expiringWorldPlazaEntityHealthTimedEffects } from '@/components/world/health/domains/expiringWorldPlazaEntityHealthTimedEffects';

export type AdvancingWorldPlazaEntityHealthTickParams = {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  deltaMs: number;
};

/**
 * Advances timed effects, DoT ticks, passive regen, and clamps health to max.
 */
export function advancingWorldPlazaEntityHealthTick({
  state,
  nowMs,
  deltaMs,
}: AdvancingWorldPlazaEntityHealthTickParams): DefiningWorldPlazaEntityHealthState {
  if (state.isDead) {
    return state;
  }

  let nextState = expiringWorldPlazaEntityHealthTimedEffects(state, nowMs);
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    nextState,
    nowMs
  );

  nextState = clampingWorldPlazaEntityHealthCurrentToEffectiveMax(
    nextState,
    effectiveMax
  );

  for (const dotEffect of nextState.damageOverTimeEffects) {
    if (dotEffect.expiresAtMs <= nowMs) {
      continue;
    }

    if (nowMs - dotEffect.lastTickAtMs < dotEffect.tickIntervalMs) {
      continue;
    }

    const tickDamage =
      dotEffect.damagePerSecond * (dotEffect.tickIntervalMs / 1000);
    const damageResult = computingWorldPlazaEntityHealthDamage({
      state: nextState,
      rawAmount: tickDamage,
      kind: dotEffect.kind,
      nowMs,
      options: {
        bypassInvincibilityFrames: true,
        grantInvincibilityFrames: false,
      },
    });

    nextState = {
      ...damageResult.state,
      damageOverTimeEffects: nextState.damageOverTimeEffects.map((effect) =>
        effect.id === dotEffect.id ? { ...effect, lastTickAtMs: nowMs } : effect
      ),
    };

    if (nextState.isDead) {
      return nextState;
    }
  }

  const canRegen =
    nextState.lastDamagedAtMs === null ||
    nowMs - nextState.lastDamagedAtMs >= nextState.regen.delayAfterDamageMs;

  if (canRegen && nextState.currentHealth < effectiveMax && deltaMs > 0) {
    const regenAmount = nextState.regen.healthPerSecond * (deltaMs / 1000);
    nextState = {
      ...nextState,
      currentHealth: Math.min(
        effectiveMax,
        nextState.currentHealth + regenAmount
      ),
    };
  }

  return nextState;
}
