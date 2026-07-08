import { applyingWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/applyingWorldPlazaEntityDiseaseStageGrant';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityDiseaseDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';

let applyingWorldPlazaEntityDiseaseNextId = 0;

function creatingWorldPlazaEntityDiseaseUniqueId(): string {
  applyingWorldPlazaEntityDiseaseNextId += 1;
  return `disease-instance-${applyingWorldPlazaEntityDiseaseNextId}`;
}

/** Whether a disease entry is still incubating (no HUD or grants yet). */
export function checkingWorldPlazaEntityDiseaseIsIncubating(
  diseaseEffect: {
    symptomsStartAtMs: number;
  },
  worldEpochMs: number
): boolean {
  return worldEpochMs < diseaseEffect.symptomsStartAtMs;
}

/** Whether symptoms are active for one disease entry. */
export function checkingWorldPlazaEntityDiseaseIsSymptomaticEntry(
  diseaseEffect: {
    symptomsStartAtMs: number;
    expiresAtMs: number;
  },
  worldEpochMs: number
): boolean {
  return (
    worldEpochMs >= diseaseEffect.symptomsStartAtMs &&
    diseaseEffect.expiresAtMs > worldEpochMs
  );
}

/** Whether the player is infected (incubating or symptomatic). */
export function checkingWorldPlazaEntityDiseaseIsInfected(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs: number
): boolean {
  return state.diseaseEffects.some(
    (diseaseEffect) => diseaseEffect.expiresAtMs > worldEpochMs
  );
}

/** Whether the player shows disease symptoms (post-incubation). */
export function checkingWorldPlazaEntityDiseaseIsSymptomatic(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs: number
): boolean {
  return state.diseaseEffects.some((diseaseEffect) =>
    checkingWorldPlazaEntityDiseaseIsSymptomaticEntry(
      diseaseEffect,
      worldEpochMs
    )
  );
}

/**
 * Applies a registered disease and schedules its staged grants after incubation.
 */
export function applyingWorldPlazaEntityDisease(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseId: DefiningWorldPlazaEntityDiseaseId,
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs()
): DefiningWorldPlazaEntityHealthState {
  const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(diseaseId);
  const diseaseInstanceId = creatingWorldPlazaEntityDiseaseUniqueId();
  const symptomsStartAtMs = worldEpochMs + descriptor.incubationMs;
  const expiresAtMs = symptomsStartAtMs + descriptor.durationMs;

  let nextState = state;
  const pendingGrants: { grantIndex: number; fireAtMs: number }[] = [];

  for (const [grantIndex, grant] of descriptor.grants.entries()) {
    const fireAtMs = symptomsStartAtMs + grant.delayMs;

    if (worldEpochMs >= fireAtMs) {
      nextState = applyingWorldPlazaEntityDiseaseStageGrant({
        state: nextState,
        diseaseInstanceId,
        grantIndex,
        grant,
        nowMs: worldEpochMs,
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
        contractedAtMs: worldEpochMs,
        symptomsStartAtMs,
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
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs()
): DefiningWorldPlazaEntityHealthState {
  let nextState = state;
  const nextDiseaseEffects = [];

  for (const diseaseEffect of nextState.diseaseEffects) {
    if (diseaseEffect.expiresAtMs <= worldEpochMs) {
      continue;
    }

    if (checkingWorldPlazaEntityDiseaseIsIncubating(diseaseEffect, worldEpochMs)) {
      nextDiseaseEffects.push(diseaseEffect);
      continue;
    }

    const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(
      diseaseEffect.diseaseId as DefiningWorldPlazaEntityDiseaseId
    );
    const remainingPendingGrants = [];

    for (const pendingGrant of diseaseEffect.pendingGrants) {
      if (pendingGrant.fireAtMs > worldEpochMs) {
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
          nowMs: worldEpochMs,
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

/** Whether any disease is currently active (incubating or symptomatic). */
export function checkingWorldPlazaEntityDiseaseIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs()
): boolean {
  return checkingWorldPlazaEntityDiseaseIsInfected(state, worldEpochMs);
}
