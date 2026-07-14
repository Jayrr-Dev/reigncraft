import {
  computingWorldPlazaPathologyInfectionStudyHoursToCredit,
  DEFINING_WORLD_PLAZA_PATHOLOGY_STUDY_POINTS_PER_INFECTION_HOUR,
} from '@/components/world/domains/computingWorldPlazaPathologyInfectionStudyHours';
import {
  creditingWorldPlazaPathologyFromInfectionHours,
  recordingWorldPlazaPathologyDiseaseObtained,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import { applyingWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/applyingWorldPlazaEntityDiseaseStageGrant';
import { applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery } from '@/components/world/health/domains/applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery';
import { checkingWorldPlazaEntityCanContractDisease } from '@/components/world/health/domains/checkingWorldPlazaEntityImmuneSystem';
import {
  clearingWorldPlazaEntityDiseaseScopedGrantEffects,
  clearingWorldPlazaEntityOrphanedDiseaseScopedGrantEffects,
} from '@/components/world/health/domains/clearingWorldPlazaEntityDiseaseScopedGrantEffects';
import {
  rollingWorldPlazaEntityDiseaseBellCurveDurationMs,
  samplingWorldPlazaEntityDiseaseStandardNormal,
} from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseBellCurveDurationMs';
import {
  computingWorldPlazaEntityImmuneSystemDurationMultiplier,
  computingWorldPlazaEntityImmuneSystemScaledDurationMs,
  computingWorldPlazaEntityImmuneSystemSymptomStrengthMultiplier,
} from '@/components/world/health/domains/computingWorldPlazaEntityImmuneSystemEffects';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityDiseaseDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type {
  DefiningWorldPlazaEntityHealthDiseaseEffect,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';

let applyingWorldPlazaEntityDiseaseNextId = 0;

export type ApplyingWorldPlazaEntityDiseaseOptions = {
  /** Bypass immunity and replace an active instance of the same disease. */
  forceContract?: boolean;
  /**
   * Multiplies incubation, illness, grant delays, and symptom durations.
   * Use `1/5` for a five-times-faster full-term preview.
   */
  durationScale?: number;
  /** Meat-source multiplier for symptom grant strength (default 1). */
  symptomStrengthScale?: number;
  /** Meat-source multiplier for disease duration (default 1). */
  durationScaleFromMeat?: number;
};

function creatingWorldPlazaEntityDiseaseUniqueId(): string {
  applyingWorldPlazaEntityDiseaseNextId += 1;
  return `disease-instance-${applyingWorldPlazaEntityDiseaseNextId}`;
}

/**
 * Awards Pathology study points for whole in-game hours spent infected.
 * Mutates the Pathology discovery store when hours are owed.
 */
export function creditingWorldPlazaPathologyInfectionStudyHoursForDiseaseEffect(
  diseaseEffect: DefiningWorldPlazaEntityHealthDiseaseEffect,
  worldEpochMs: number
): DefiningWorldPlazaEntityHealthDiseaseEffect {
  const pathologyStudyHoursCredited = Number.isFinite(
    diseaseEffect.pathologyStudyHoursCredited
  )
    ? Math.max(0, Math.floor(diseaseEffect.pathologyStudyHoursCredited))
    : 0;
  const hoursToCredit = computingWorldPlazaPathologyInfectionStudyHoursToCredit(
    {
      contractedAtMs: diseaseEffect.contractedAtMs,
      expiresAtMs: diseaseEffect.expiresAtMs,
      worldEpochMs,
      pathologyStudyHoursCredited,
    }
  );

  if (!Number.isFinite(hoursToCredit) || hoursToCredit <= 0) {
    if (
      diseaseEffect.pathologyStudyHoursCredited === pathologyStudyHoursCredited
    ) {
      return diseaseEffect;
    }

    return {
      ...diseaseEffect,
      pathologyStudyHoursCredited,
    };
  }

  creditingWorldPlazaPathologyFromInfectionHours(
    diseaseEffect.diseaseId as DefiningWorldPlazaEntityDiseaseId,
    hoursToCredit *
      DEFINING_WORLD_PLAZA_PATHOLOGY_STUDY_POINTS_PER_INFECTION_HOUR
  );

  return {
    ...diseaseEffect,
    pathologyStudyHoursCredited: pathologyStudyHoursCredited + hoursToCredit,
  };
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
 *
 * @param worldEpochMs - Wall clock for incubation / illness / grant fire times
 *   (survives logout).
 * @param simulationNowMs - Frame clock for any grants that fire immediately.
 *   Must match health-tick `performance.now()` so movement and DoT effects work.
 *   Defaults to `worldEpochMs` for unit tests that use one shared timeline.
 */
export function applyingWorldPlazaEntityDisease(
  state: DefiningWorldPlazaEntityHealthState,
  diseaseId: DefiningWorldPlazaEntityDiseaseId,
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs(),
  random: () => number = Math.random,
  options: ApplyingWorldPlazaEntityDiseaseOptions = {},
  simulationNowMs = worldEpochMs
): DefiningWorldPlazaEntityHealthState {
  const forceContract = options.forceContract === true;
  const durationScale = options.durationScale ?? 1;
  const durationScaleFromMeat = options.durationScaleFromMeat ?? 1;
  const symptomStrengthScale = options.symptomStrengthScale ?? 1;

  let preparedState = state;

  if (forceContract) {
    const replacedDiseaseEffects = preparedState.diseaseEffects.filter(
      (diseaseEffect) => diseaseEffect.diseaseId === diseaseId
    );
    preparedState = {
      ...preparedState,
      diseaseImmunityIds: preparedState.diseaseImmunityIds.filter(
        (immuneDiseaseId) => immuneDiseaseId !== diseaseId
      ),
      diseaseEffects: preparedState.diseaseEffects.filter(
        (diseaseEffect) => diseaseEffect.diseaseId !== diseaseId
      ),
    };
    for (const replacedDiseaseEffect of replacedDiseaseEffects) {
      creditingWorldPlazaPathologyInfectionStudyHoursForDiseaseEffect(
        replacedDiseaseEffect,
        worldEpochMs
      );
      preparedState = clearingWorldPlazaEntityDiseaseScopedGrantEffects(
        preparedState,
        replacedDiseaseEffect.id
      );
    }
  } else if (
    !checkingWorldPlazaEntityCanContractDisease(
      preparedState,
      diseaseId,
      worldEpochMs
    )
  ) {
    return state;
  }

  const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(diseaseId);
  const diseaseInstanceId = creatingWorldPlazaEntityDiseaseUniqueId();
  const durationMultiplier =
    computingWorldPlazaEntityImmuneSystemDurationMultiplier(
      preparedState.immuneSystemFactor
    ) *
    durationScale *
    durationScaleFromMeat;
  const symptomStrengthMultiplier =
    computingWorldPlazaEntityImmuneSystemSymptomStrengthMultiplier(
      preparedState.immuneSystemFactor
    ) * symptomStrengthScale;
  const incubationSample =
    samplingWorldPlazaEntityDiseaseStandardNormal(random);
  const illnessSample = samplingWorldPlazaEntityDiseaseStandardNormal(random);
  const rolledIncubationMs =
    computingWorldPlazaEntityImmuneSystemScaledDurationMs(
      rollingWorldPlazaEntityDiseaseBellCurveDurationMs({
        meanMs: descriptor.incubationMs,
        kind: 'incubation',
        standardNormalSample: incubationSample,
      }),
      durationMultiplier
    );
  const rolledIllnessDurationMs =
    computingWorldPlazaEntityImmuneSystemScaledDurationMs(
      rollingWorldPlazaEntityDiseaseBellCurveDurationMs({
        meanMs: descriptor.durationMs,
        kind: 'illness',
        standardNormalSample: illnessSample,
      }),
      durationMultiplier
    );
  const symptomsStartAtMs = worldEpochMs + rolledIncubationMs;
  const expiresAtMs = symptomsStartAtMs + rolledIllnessDurationMs;

  let nextState = preparedState;
  const pendingGrants: { grantIndex: number; fireAtMs: number }[] = [];

  for (const [grantIndex, grant] of descriptor.grants.entries()) {
    const fireAtMs =
      symptomsStartAtMs +
      computingWorldPlazaEntityImmuneSystemScaledDurationMs(
        grant.delayMs,
        durationMultiplier
      );

    if (worldEpochMs >= fireAtMs) {
      nextState = applyingWorldPlazaEntityDiseaseStageGrant({
        state: nextState,
        diseaseInstanceId,
        grantIndex,
        grant,
        nowMs: simulationNowMs,
        durationMultiplier,
        symptomStrengthMultiplier,
      });
      continue;
    }

    pendingGrants.push({ grantIndex, fireAtMs });
  }

  // Codex Pathology: unlock the entry once the player contracts it.
  recordingWorldPlazaPathologyDiseaseObtained(diseaseId);

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
        symptomStrengthMultiplier,
        durationMultiplier,
        pathologyStudyHoursCredited: 0,
        pendingGrants,
      },
    ],
  };
}

/**
 * Fires due pending disease grants and removes expired diseases.
 *
 * @param worldEpochMs - Wall clock for incubation / grant fire / disease expiry.
 * @param simulationNowMs - Frame clock stamped onto fired grant effects.
 *   Defaults to `worldEpochMs` for unit tests that use one shared timeline.
 */
export function advancingWorldPlazaEntityHealthDiseaseTick(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs(),
  random: () => number = Math.random,
  simulationNowMs = worldEpochMs
): DefiningWorldPlazaEntityHealthState {
  let nextState = state;
  const nextDiseaseEffects = [];

  for (const diseaseEffect of nextState.diseaseEffects) {
    const creditedDiseaseEffect =
      creditingWorldPlazaPathologyInfectionStudyHoursForDiseaseEffect(
        diseaseEffect,
        worldEpochMs
      );

    if (creditedDiseaseEffect.expiresAtMs <= worldEpochMs) {
      nextState = clearingWorldPlazaEntityDiseaseScopedGrantEffects(
        nextState,
        creditedDiseaseEffect.id
      );
      const recovery = applyingWorldPlazaEntityImmuneSystemPostDiseaseRecovery(
        nextState,
        creditedDiseaseEffect.diseaseId as DefiningWorldPlazaEntityDiseaseId,
        random
      );
      nextState = recovery.state;
      continue;
    }

    if (
      checkingWorldPlazaEntityDiseaseIsIncubating(
        creditedDiseaseEffect,
        worldEpochMs
      )
    ) {
      nextDiseaseEffects.push(creditedDiseaseEffect);
      continue;
    }

    const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(
      creditedDiseaseEffect.diseaseId as DefiningWorldPlazaEntityDiseaseId
    );
    const remainingPendingGrants = [];

    for (const pendingGrant of creditedDiseaseEffect.pendingGrants) {
      if (pendingGrant.fireAtMs > worldEpochMs) {
        remainingPendingGrants.push(pendingGrant);
        continue;
      }

      const grant = descriptor.grants[pendingGrant.grantIndex];

      if (grant) {
        nextState = applyingWorldPlazaEntityDiseaseStageGrant({
          state: nextState,
          diseaseInstanceId: creditedDiseaseEffect.id,
          grantIndex: pendingGrant.grantIndex,
          grant,
          nowMs: simulationNowMs,
          durationMultiplier: creditedDiseaseEffect.durationMultiplier,
          symptomStrengthMultiplier:
            creditedDiseaseEffect.symptomStrengthMultiplier,
        });
      }
    }

    nextDiseaseEffects.push({
      ...creditedDiseaseEffect,
      pendingGrants: remainingPendingGrants,
    });
  }

  return clearingWorldPlazaEntityOrphanedDiseaseScopedGrantEffects({
    ...nextState,
    diseaseEffects: nextDiseaseEffects,
  });
}

/** Whether any disease is currently active (incubating or symptomatic). */
export function checkingWorldPlazaEntityDiseaseIsActive(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs()
): boolean {
  return checkingWorldPlazaEntityDiseaseIsInfected(state, worldEpochMs);
}
