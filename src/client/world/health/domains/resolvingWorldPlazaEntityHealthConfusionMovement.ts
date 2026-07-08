import {
  DEFINING_WORLD_PLAZA_CONFUSION_FADE_OUT_MS,
  DEFINING_WORLD_PLAZA_CONFUSION_RAMP_IN_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import type { DefiningWorldPlazaEntityHealthConfusionEffect } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWorldPlazaEntityHealthConfusionMovementResult = {
  effectiveIntensity: number;
  phaseSeed: number;
};

function computingWorldPlazaConfusionRampEnvelope(
  effect: DefiningWorldPlazaEntityHealthConfusionEffect,
  nowMs: number
): number {
  const rampProgress = Math.max(
    0,
    Math.min(1, (nowMs - effect.appliedAtMs) / DEFINING_WORLD_PLAZA_CONFUSION_RAMP_IN_MS)
  );

  if (effect.expiresAtMs === null) {
    return rampProgress;
  }

  const remainingMs = effect.expiresAtMs - nowMs;

  if (remainingMs <= 0) {
    return 0;
  }

  const fadeProgress = Math.max(
    0,
    Math.min(1, remainingMs / DEFINING_WORLD_PLAZA_CONFUSION_FADE_OUT_MS)
  );

  return rampProgress * fadeProgress;
}

function resolvingWorldPlazaEntityHealthConfusionEffectIntensity(
  effect: DefiningWorldPlazaEntityHealthConfusionEffect,
  nowMs: number
): number {
  return effect.targetIntensity * computingWorldPlazaConfusionRampEnvelope(effect, nowMs);
}

/**
 * Resolves the strongest active confusion effect into movement parameters.
 */
export function resolvingWorldPlazaEntityHealthConfusionMovement(
  state: { confusionEffects: readonly DefiningWorldPlazaEntityHealthConfusionEffect[] } | null,
  nowMs: number
): ResolvingWorldPlazaEntityHealthConfusionMovementResult {
  if (!state || state.confusionEffects.length === 0) {
    return {
      effectiveIntensity: 0,
      phaseSeed: 0,
    };
  }

  let strongestEffect: DefiningWorldPlazaEntityHealthConfusionEffect | null = null;
  let strongestIntensity = 0;

  for (const effect of state.confusionEffects) {
    if (effect.expiresAtMs !== null && effect.expiresAtMs <= nowMs) {
      continue;
    }

    const effectiveIntensity =
      resolvingWorldPlazaEntityHealthConfusionEffectIntensity(effect, nowMs);

    if (effectiveIntensity > strongestIntensity) {
      strongestIntensity = effectiveIntensity;
      strongestEffect = effect;
    }
  }

  if (!strongestEffect || strongestIntensity <= 0) {
    return {
      effectiveIntensity: 0,
      phaseSeed: 0,
    };
  }

  return {
    effectiveIntensity: strongestIntensity,
    phaseSeed: strongestEffect.phaseSeed,
  };
}
