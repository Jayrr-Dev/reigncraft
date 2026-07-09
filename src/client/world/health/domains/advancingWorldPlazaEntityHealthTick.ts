import { advancingWorldPlazaEntityHealthDiseaseTick } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { clampingWorldPlazaEntityHealthCurrentToEffectiveMax } from '@/components/world/health/domains/clampingWorldPlazaEntityHealthCurrentToEffectiveMax';
import { computingWorldPlazaEntityBleedTickDamage } from '@/components/world/health/domains/computingWorldPlazaEntityBleedTickDamage';
import { computingWorldPlazaEntityHealthDamageWithSleepWake } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageWithSleepWake';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthAmplifiedHealAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthHealAmplifier';
import { computingWorldPlazaEntityPoisonTickDamage } from '@/components/world/health/domains/computingWorldPlazaEntityPoisonTickDamage';
import { computingWorldPlazaEntityPoisonTickIntervalMs } from '@/components/world/health/domains/computingWorldPlazaEntityPoisonTickIntervalMs';
import { mappingWorldPlazaEntityBleedSeverityToDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { mappingWorldPlazaEntityPoisonPotencyToDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { expiringWorldPlazaEntityHealthTimedEffects } from '@/components/world/health/domains/expiringWorldPlazaEntityHealthTimedEffects';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';
import { resolvingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthPotentialDamage';

export type AdvancingWorldPlazaEntityHealthTickParams = {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  deltaMs: number;
  /** When false, passive regen is gated off entirely (e.g. low hunger). Defaults to true. */
  isRegenAllowed?: boolean;
};

/**
 * Advances timed effects, DoT ticks, passive regen, and clamps health to max.
 */
export function advancingWorldPlazaEntityHealthTick({
  state,
  nowMs,
  deltaMs,
  isRegenAllowed = true,
}: AdvancingWorldPlazaEntityHealthTickParams): DefiningWorldPlazaEntityHealthState {
  if (state.isDead) {
    return state;
  }

  let nextState = expiringWorldPlazaEntityHealthTimedEffects(state, nowMs);
  nextState = advancingWorldPlazaEntityHealthDiseaseTick(
    nextState,
    resolvingWorldPlazaEntityDiseaseWorldEpochMs(),
    Math.random,
    nowMs
  );
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    nextState,
    nowMs
  );

  nextState = clampingWorldPlazaEntityHealthCurrentToEffectiveMax(
    nextState,
    effectiveMax
  );

  nextState = resolvingWorldPlazaEntityHealthPotentialDamage(nextState, nowMs);

  if (nextState.isDead) {
    return nextState;
  }

  for (const dotEffect of nextState.damageOverTimeEffects) {
    if (dotEffect.expiresAtMs <= nowMs) {
      continue;
    }

    if (nowMs - dotEffect.lastTickAtMs < dotEffect.tickIntervalMs) {
      continue;
    }

    const tickDamage =
      dotEffect.damagePerSecond * (dotEffect.tickIntervalMs / 1000);
    const damageResult = computingWorldPlazaEntityHealthDamageWithSleepWake({
      state: nextState,
      rawAmount: tickDamage,
      kind: dotEffect.kind,
      nowMs,
      options: {
        skipDamageRoll: true,
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

  for (const poisonEffect of nextState.poisonEffects) {
    if (
      poisonEffect.expiresAtMs <= nowMs ||
      poisonEffect.remainingPoisonDamage <= 0
    ) {
      continue;
    }

    const poisonTickIntervalMs = computingWorldPlazaEntityPoisonTickIntervalMs({
      startedAtMs: poisonEffect.startedAtMs,
      expiresAtMs: poisonEffect.expiresAtMs,
      nowMs,
      baseTickIntervalMs: poisonEffect.tickIntervalMs,
    });

    if (nowMs - poisonEffect.lastTickAtMs < poisonTickIntervalMs) {
      continue;
    }

    const tickDamage = computingWorldPlazaEntityPoisonTickDamage({
      remainingPoisonDamage: poisonEffect.remainingPoisonDamage,
      totalPoisonDamage: poisonEffect.totalPoisonDamage,
      startedAtMs: poisonEffect.startedAtMs,
      expiresAtMs: poisonEffect.expiresAtMs,
      nowMs,
      lastTickAtMs: poisonEffect.lastTickAtMs,
      tickIntervalMs: nowMs - poisonEffect.lastTickAtMs,
    });

    if (tickDamage <= 0) {
      nextState = {
        ...nextState,
        poisonEffects: nextState.poisonEffects.map((effect) =>
          effect.id === poisonEffect.id
            ? { ...effect, lastTickAtMs: nowMs }
            : effect
        ),
      };
      continue;
    }

    const poisonDamageKind = mappingWorldPlazaEntityPoisonPotencyToDamageKind(
      poisonEffect.potency
    );
    const damageResult = computingWorldPlazaEntityHealthDamageWithSleepWake({
      state: nextState,
      rawAmount: tickDamage,
      kind: poisonDamageKind,
      nowMs,
      options: {
        skipDamageRoll: true,
      },
    });

    const nextRemainingPoison = Math.max(
      0,
      poisonEffect.remainingPoisonDamage -
        damageResult.appliedDamage.healthDamage
    );

    nextState = {
      ...damageResult.state,
      poisonEffects: nextState.poisonEffects.map((effect) =>
        effect.id === poisonEffect.id
          ? {
              ...effect,
              remainingPoisonDamage: nextRemainingPoison,
              lastTickAtMs: nowMs,
            }
          : effect
      ),
    };

    if (nextState.isDead) {
      return nextState;
    }
  }

  for (const bleedEffect of nextState.bleedEffects) {
    if (
      bleedEffect.expiresAtMs <= nowMs ||
      bleedEffect.remainingBleedDamage <= 0
    ) {
      continue;
    }

    if (nowMs - bleedEffect.lastTickAtMs < bleedEffect.tickIntervalMs) {
      continue;
    }

    const tickDamage = computingWorldPlazaEntityBleedTickDamage({
      remainingBleedDamage: bleedEffect.remainingBleedDamage,
      startedAtMs: bleedEffect.startedAtMs,
      expiresAtMs: bleedEffect.expiresAtMs,
      nowMs,
      tickIntervalMs: bleedEffect.tickIntervalMs,
    });

    if (tickDamage <= 0) {
      continue;
    }

    const bleedDamageKind = mappingWorldPlazaEntityBleedSeverityToDamageKind(
      bleedEffect.severity
    );
    const damageResult = computingWorldPlazaEntityHealthDamageWithSleepWake({
      state: nextState,
      rawAmount: tickDamage,
      kind: bleedDamageKind,
      nowMs,
      options: {
        skipDamageRoll: true,
      },
    });

    const nextRemainingBleed = Math.max(
      0,
      bleedEffect.remainingBleedDamage - damageResult.appliedDamage.healthDamage
    );

    nextState = {
      ...damageResult.state,
      bleedEffects: nextState.bleedEffects.map((effect) =>
        effect.id === bleedEffect.id
          ? {
              ...effect,
              remainingBleedDamage: nextRemainingBleed,
              lastTickAtMs: nowMs,
            }
          : effect
      ),
    };

    if (nextState.isDead) {
      return nextState;
    }
  }

  const canRegen =
    isRegenAllowed &&
    (nextState.lastDamagedAtMs === null ||
      nowMs - nextState.lastDamagedAtMs >= nextState.regen.delayAfterDamageMs);

  if (canRegen && nextState.currentHealth < effectiveMax && deltaMs > 0) {
    const regenAmount = computingWorldPlazaEntityHealthAmplifiedHealAmount({
      baseHealAmount: nextState.regen.healthPerSecond * (deltaMs / 1000),
      receiverIncomingHealAmplifiers: nextState.incomingHealAmplifiers,
      giverOutgoingHealAmplifiers: nextState.outgoingHealAmplifiers,
      nowMs,
      applyOutgoingAmplifier: false,
    });
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
