/**
 * Applies or stacks Petal Sickness (confusion + reduced stamina + light poison).
 *
 * @module components/world/inventory/domains/applyingWorldPlazaFlowerPetalSickness
 */

import { checkingWorldPlazaEntityConfusionBuffIsActive } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import {
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX,
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  addingWorldPlazaEntityHealthConfusionEffect,
  addingWorldPlazaEntityHealthMovementModifier,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import {
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CONFUSION_INTENSITY,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_POISON_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_STAMINA_DEBUFF_ID,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerPetalSicknessConstants';
import {
  checkingWorldPlazaFlowerPetalSicknessIsLockedOut,
  extendingWorldPlazaFlowerPetalSicknessLockout,
} from '@/components/world/inventory/domains/managingWorldPlazaFlowerPetalConsumptionStore';

export type ApplyingWorldPlazaFlowerPetalSicknessResult = {
  readonly nextHealthState: DefiningWorldPlazaEntityHealthState;
  readonly didApply: boolean;
  readonly expiresAtMs: number | null;
};

/**
 * Extends Petal Sickness by {@link DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DURATION_MS}
 * when already active, otherwise applies a fresh stack. Fresh contracts respect
 * the post-clear 1-day lockout. Each proc also stacks toxic poison at 3% max HP.
 */
export function applyingWorldPlazaFlowerPetalSickness(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  worldEpochMs: number
): ApplyingWorldPlazaFlowerPetalSicknessResult {
  const isActive = checkingWorldPlazaEntityConfusionBuffIsActive(
    state,
    DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID,
    nowMs
  );

  if (
    !isActive &&
    checkingWorldPlazaFlowerPetalSicknessIsLockedOut(worldEpochMs)
  ) {
    return {
      nextHealthState: state,
      didApply: false,
      expiresAtMs: null,
    };
  }

  const existingConfusion = state.confusionEffects.find(
    (effect) =>
      effect.id === DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID
  );
  const baseExpiresAtMs =
    existingConfusion?.expiresAtMs !== null &&
    existingConfusion?.expiresAtMs !== undefined &&
    existingConfusion.expiresAtMs > nowMs
      ? existingConfusion.expiresAtMs
      : nowMs;
  const expiresAtMs =
    baseExpiresAtMs + DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DURATION_MS;

  const targetIntensity = Math.max(
    DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
    Math.min(
      DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX,
      DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CONFUSION_INTENSITY
    )
  );

  let nextState = addingWorldPlazaEntityHealthConfusionEffect(state, {
    id: DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID,
    targetIntensity,
    appliedAtMs: existingConfusion?.appliedAtMs ?? nowMs,
    expiresAtMs,
    phaseSeed: existingConfusion?.phaseSeed ?? Math.random() * Math.PI * 2,
  });

  nextState = addingWorldPlazaEntityHealthMovementModifier(nextState, {
    id: DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_STAMINA_DEBUFF_ID,
    kind: 'stamina_drain',
    multiplier: 1.5,
    expiresAtMs,
  });
  nextState = addingWorldPlazaEntityHealthMovementModifier(nextState, {
    id: DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_STAMINA_DEBUFF_ID,
    kind: 'stamina_regen',
    multiplier: 0.65,
    expiresAtMs,
  });

  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    nextState,
    nowMs
  );
  nextState = applyingWorldPlazaEntityHealthPoisonStack(
    nextState,
    'toxic',
    effectiveMax * DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_POISON_OF_MAX,
    nowMs
  );

  extendingWorldPlazaFlowerPetalSicknessLockout(
    worldEpochMs + Math.max(0, expiresAtMs - nowMs)
  );

  return {
    nextHealthState: nextState,
    didApply: true,
    expiresAtMs,
  };
}
