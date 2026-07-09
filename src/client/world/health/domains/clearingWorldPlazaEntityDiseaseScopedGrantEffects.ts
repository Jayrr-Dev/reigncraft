import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Prefix shared by every effect id stamped from a disease stage grant. */
export function buildingWorldPlazaEntityDiseaseScopedGrantEffectIdPrefix(
  diseaseInstanceId: string
): string {
  return `disease-grant:${diseaseInstanceId}:`;
}

function checkingWorldPlazaEntityEffectBelongsToDiseaseInstance(
  effectId: string,
  diseaseInstanceId: string
): boolean {
  return effectId.startsWith(
    buildingWorldPlazaEntityDiseaseScopedGrantEffectIdPrefix(diseaseInstanceId)
  );
}

function resolvingWorldPlazaEntityDiseaseInstanceIdFromGrantEffectId(
  effectId: string
): string | null {
  if (!effectId.startsWith('disease-grant:')) {
    return null;
  }

  const diseaseInstanceId = effectId
    .slice('disease-grant:'.length)
    .split(':')[0];

  if (!diseaseInstanceId) {
    return null;
  }

  return diseaseInstanceId;
}

function filteringWorldPlazaEntityDiseaseScopedGrantEffects(
  state: DefiningWorldPlazaEntityHealthState,
  shouldKeepEffectId: (effectId: string) => boolean
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    movementModifiers: state.movementModifiers.filter((modifier) =>
      shouldKeepEffectId(modifier.id)
    ),
    incomingDamageModifiers: state.incomingDamageModifiers.filter((modifier) =>
      shouldKeepEffectId(modifier.id)
    ),
    confusionEffects: state.confusionEffects.filter((effect) =>
      shouldKeepEffectId(effect.id)
    ),
    sleepEffects: state.sleepEffects.filter((effect) =>
      shouldKeepEffectId(effect.id)
    ),
    stunEffects: state.stunEffects.filter((effect) =>
      shouldKeepEffectId(effect.id)
    ),
  };
}

/**
 * Removes confusion, sleep, stun, and modifier effects stamped by one disease
 * instance. Call when that disease expires or is force-replaced mid-session so
 * symptoms cannot outlive the illness badge (grant timers are not bell-curved).
 */
export function clearingWorldPlazaEntityDiseaseScopedGrantEffects(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseInstanceId: string
): DefiningWorldPlazaEntityHealthState {
  return filteringWorldPlazaEntityDiseaseScopedGrantEffects(
    state,
    (effectId) =>
      !checkingWorldPlazaEntityEffectBelongsToDiseaseInstance(
        effectId,
        diseaseInstanceId
      )
  );
}

/**
 * Drops `disease-grant:{instanceId}:…` effects whose disease instance is gone
 * (already expired before cleanup existed, or force-replaced mid-session).
 */
export function clearingWorldPlazaEntityOrphanedDiseaseScopedGrantEffects(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  const activeDiseaseInstanceIds = new Set(
    state.diseaseEffects.map((diseaseEffect) => diseaseEffect.id)
  );

  return filteringWorldPlazaEntityDiseaseScopedGrantEffects(
    state,
    (effectId) => {
      const diseaseInstanceId =
        resolvingWorldPlazaEntityDiseaseInstanceIdFromGrantEffectId(effectId);

      if (diseaseInstanceId === null) {
        return true;
      }

      return activeDiseaseInstanceIds.has(diseaseInstanceId);
    }
  );
}
