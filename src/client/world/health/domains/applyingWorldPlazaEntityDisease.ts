import { applyingWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/applyingWorldPlazaEntityDiseaseStageGrant';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityDiseaseDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

let applyingWorldPlazaEntityDiseaseNextId = 0;

function creatingWorldPlazaEntityDiseaseUniqueId(): string {
  applyingWorldPlazaEntityDiseaseNextId += 1;
  return `disease-instance-${applyingWorldPlazaEntityDiseaseNextId}`;
}

/**
 * Applies a registered disease and schedules its staged grants.
 */
export function applyingWorldPlazaEntityDisease(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseId: DefiningWorldPlazaEntityDiseaseId,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(diseaseId);
  const diseaseInstanceId = creatingWorldPlazaEntityDiseaseUniqueId();
  const expiresAtMs = nowMs + descriptor.durationMs;

  let nextState = state;
  const pendingGrants: { grantIndex: number; fireAtMs: number }[] = [];

  for (const [grantIndex, grant] of descriptor.grants.entries()) {
    const fireAtMs = nowMs + grant.delayMs;

    if (grant.delayMs <= 0) {
      nextState = applyingWorldPlazaEntityDiseaseStageGrant({
        state: nextState,
        diseaseInstanceId,
        grantIndex,
        grant,
        nowMs,
      });
      continue;
    }

    pendingGrants.push({ grantIndex, fireAtMs });
  }

  return {
    ...nextState,
    diseaseEffects: [
      ...nextState.diseaseEffects,
      {
        id: diseaseInstanceId,
        diseaseId,
        appliedAtMs: nowMs,
        expiresAtMs,
        pendingGrants,
      },
    ],
  };
}

/**
 * Fires due pending disease grants and removes expired diseases.
 */
export function advancingWorldPlazaEntityHealthDiseaseTick(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  let nextState = state;
  const nextDiseaseEffects = [];

  for (const diseaseEffect of nextState.diseaseEffects) {
    if (diseaseEffect.expiresAtMs <= nowMs) {
      continue;
    }

    const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(
      diseaseEffect.diseaseId as DefiningWorldPlazaEntityDiseaseId
    );
    const remainingPendingGrants = [];

    for (const pendingGrant of diseaseEffect.pendingGrants) {
      if (pendingGrant.fireAtMs > nowMs) {
        remainingPendingGrants.push(pendingGrant);
        continue;
      }

      const grant = descriptor.grants[pendingGrant.grantIndex];

      if (grant) {
        nextState = applyingWorldPlazaEntityDiseaseStageGrant({
          state: nextState,
          diseaseInstanceId: diseaseEffect.id,
          grantIndex: pendingGrant.grantIndex,
          grant,
          nowMs,
        });
      }
    }

    nextDiseaseEffects.push({
      ...diseaseEffect,
      pendingGrants: remainingPendingGrants,
    });
  }

  return {
    ...nextState,
    diseaseEffects: nextDiseaseEffects,
  };
}

/** Whether any disease is currently active. */
export function checkingWorldPlazaEntityDiseaseIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): boolean {
  return state.diseaseEffects.some(
    (diseaseEffect) => diseaseEffect.expiresAtMs > nowMs
  );
}
