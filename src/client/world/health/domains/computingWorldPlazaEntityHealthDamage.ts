import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INVINCIBILITY_FRAME_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthAppliedDamage,
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthIncomingDamageMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthIncomingDamageMultiplier';

export type ComputingWorldPlazaEntityHealthDamageParams = {
  state: DefiningWorldPlazaEntityHealthState;
  rawAmount: number;
  kind: DefiningWorldPlazaEntityDamageKind;
  nowMs: number;
  options?: DefiningWorldPlazaEntityHealthDamageOptions;
};

export type ComputingWorldPlazaEntityHealthDamageResult = {
  state: DefiningWorldPlazaEntityHealthState;
  appliedDamage: DefiningWorldPlazaEntityHealthAppliedDamage;
};

/**
 * Runs the incoming damage pipeline: invulnerability, modifiers, low-health
 * reduction, shield absorption, and optional post-hit invincibility frames.
 */
export function computingWorldPlazaEntityHealthDamage({
  state,
  rawAmount,
  kind,
  nowMs,
  options = {},
}: ComputingWorldPlazaEntityHealthDamageParams): ComputingWorldPlazaEntityHealthDamageResult {
  const bypassInvincibilityFrames = options.bypassInvincibilityFrames === true;
  const grantInvincibilityFrames = options.grantInvincibilityFrames !== false;
  const clampedRawAmount = Math.max(0, rawAmount);

  if (clampedRawAmount <= 0 || state.isDead) {
    return {
      state,
      appliedDamage: {
        rawAmount: clampedRawAmount,
        afterModifiers: 0,
        absorbedByShield: 0,
        healthDamage: 0,
        wasBlocked: true,
      },
    };
  }

  const isInvincibleBuffActive =
    state.invincibleUntilMs !== null && nowMs < state.invincibleUntilMs;
  const isInvincibilityFrameActive =
    !bypassInvincibilityFrames && nowMs < state.invincibilityFrameUntilMs;

  if (isInvincibleBuffActive || isInvincibilityFrameActive) {
    return {
      state,
      appliedDamage: {
        rawAmount: clampedRawAmount,
        afterModifiers: 0,
        absorbedByShield: 0,
        healthDamage: 0,
        wasBlocked: true,
      },
    };
  }

  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );
  const afterModifiers =
    clampedRawAmount *
    resolvingWorldPlazaEntityHealthIncomingDamageMultiplier({
      state,
      nowMs,
      currentHealth: state.currentHealth,
      effectiveMaxHealth: effectiveMax,
    });

  const absorbedByShield = Math.min(state.shieldPoints, afterModifiers);
  const healthDamage = Math.max(0, afterModifiers - absorbedByShield);
  const nextHealth = Math.max(0, state.currentHealth - healthDamage);
  const nextShield = Math.max(0, state.shieldPoints - absorbedByShield);

  const nextState: DefiningWorldPlazaEntityHealthState = {
    ...state,
    currentHealth: nextHealth,
    shieldPoints: nextShield,
    lastDamagedAtMs:
      healthDamage > 0 || absorbedByShield > 0 ? nowMs : state.lastDamagedAtMs,
    lastDamageKind:
      healthDamage > 0 || absorbedByShield > 0 ? kind : state.lastDamageKind,
    invincibilityFrameUntilMs:
      grantInvincibilityFrames && healthDamage > 0
        ? nowMs + DEFINING_WORLD_PLAZA_ENTITY_HEALTH_INVINCIBILITY_FRAME_MS
        : state.invincibilityFrameUntilMs,
    isDead: nextHealth <= 0,
  };

  return {
    state: nextState,
    appliedDamage: {
      rawAmount: clampedRawAmount,
      afterModifiers,
      absorbedByShield,
      healthDamage,
      wasBlocked: false,
    },
  };
}
