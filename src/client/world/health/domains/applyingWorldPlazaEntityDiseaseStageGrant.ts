import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { buildingWorldPlazaEntityDiseaseGrantBuffInstanceId } from '@/components/world/health/domains/checkingWorldPlazaEntityActionLocked';
import { scalingWorldPlazaEntityDiseaseRealMs } from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseDurationMs';
import {
  computingWorldPlazaEntityImmuneSystemScaledDurationMs,
  computingWorldPlazaEntityImmuneSystemWeakenedDebuffMultiplier,
} from '@/components/world/health/domains/computingWorldPlazaEntityImmuneSystemEffects';
import { resolvingWorldPlazaEntityBleedSeverityDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX,
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import type { DefiningWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityPoisonPotencyDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE } from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';
import {
  addingWorldPlazaEntityHealthConfusionEffect,
  addingWorldPlazaEntityHealthIncomingDamageModifier,
  addingWorldPlazaEntityHealthMovementModifier,
  addingWorldPlazaEntityHealthSleepEffect,
  applyingWorldPlazaEntityHealthBleed,
  applyingWorldPlazaEntityHealthPoison,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

export type ApplyingWorldPlazaEntityDiseaseStageGrantParams = {
  state: DefiningWorldPlazaEntityHealthState;
  diseaseInstanceId: string;
  grantIndex: number;
  grant: DefiningWorldPlazaEntityDiseaseStageGrant;
  /**
   * Simulation / frame clock (`performance.now()` in play).
   * Effect `expiresAtMs` and DoT tick anchors must use this clock so health
   * ticks, movement multipliers, and poison/bleed can see them.
   */
  nowMs: number;
  durationMultiplier?: number;
  symptomStrengthMultiplier?: number;
};

function buildingWorldPlazaEntityDiseaseGrantEffectInstanceId(
  diseaseInstanceId: string,
  grantIndex: number,
  suffix: string
): string {
  return `disease-grant:${diseaseInstanceId}:${grantIndex}:${suffix}`;
}

function resolvingWorldPlazaEntityDiseaseStageGrantDurationMultiplier(
  durationMultiplier: number | undefined
): number {
  return durationMultiplier ?? 1;
}

function resolvingWorldPlazaEntityDiseaseStageGrantSymptomStrengthMultiplier(
  symptomStrengthMultiplier: number | undefined
): number {
  return symptomStrengthMultiplier ?? 1;
}

/**
 * Fires one disease stage grant onto entity health state.
 */
export function applyingWorldPlazaEntityDiseaseStageGrant({
  state,
  diseaseInstanceId,
  grantIndex,
  grant,
  nowMs,
  durationMultiplier,
  symptomStrengthMultiplier,
}: ApplyingWorldPlazaEntityDiseaseStageGrantParams): DefiningWorldPlazaEntityHealthState {
  const resolvedDurationMultiplier =
    resolvingWorldPlazaEntityDiseaseStageGrantDurationMultiplier(
      durationMultiplier
    );
  const resolvedSymptomStrengthMultiplier =
    resolvingWorldPlazaEntityDiseaseStageGrantSymptomStrengthMultiplier(
      symptomStrengthMultiplier
    );

  if (grant.kind === 'poison') {
    const poisonDurationMs =
      computingWorldPlazaEntityImmuneSystemScaledDurationMs(
        scalingWorldPlazaEntityDiseaseRealMs(
          resolvingWorldPlazaEntityPoisonPotencyDescriptor(grant.potency)
            .durationMs
        ),
        resolvedDurationMultiplier
      );
    const scaledPoisonDamage = Math.max(
      1,
      Math.round(grant.totalPoisonDamage * resolvedSymptomStrengthMultiplier)
    );

    return applyingWorldPlazaEntityHealthPoison(
      state,
      grant.potency,
      scaledPoisonDamage,
      nowMs,
      undefined,
      poisonDurationMs
    );
  }

  if (grant.kind === 'bleed') {
    const bleedDurationMs =
      computingWorldPlazaEntityImmuneSystemScaledDurationMs(
        scalingWorldPlazaEntityDiseaseRealMs(
          resolvingWorldPlazaEntityBleedSeverityDescriptor(grant.severity)
            .durationMs
        ),
        resolvedDurationMultiplier
      );
    const scaledBleedDamage = Math.max(
      1,
      Math.round(grant.flatExpectedDamage * resolvedSymptomStrengthMultiplier)
    );

    return applyingWorldPlazaEntityHealthBleed(
      state,
      grant.severity,
      scaledBleedDamage,
      nowMs,
      undefined,
      bleedDurationMs
    );
  }

  if (grant.kind === 'potential_damage') {
    const scaledPendingDamage = Math.max(
      1,
      Math.round(
        grant.pendingExpectedDamage * resolvedSymptomStrengthMultiplier
      )
    );
    const scaledResolveDelayMs =
      computingWorldPlazaEntityImmuneSystemScaledDurationMs(
        grant.resolveDelayMs,
        resolvedDurationMultiplier
      );

    return applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingExpectedDamage: scaledPendingDamage,
      resolveDelayMs: scaledResolveDelayMs,
      nowMs,
    });
  }

  if (grant.kind === 'confusion') {
    const effectId = buildingWorldPlazaEntityDiseaseGrantEffectInstanceId(
      diseaseInstanceId,
      grantIndex,
      'confusion'
    );
    const targetIntensity = Math.max(
      DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
      Math.min(
        DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX,
        Math.round(grant.intensity * resolvedSymptomStrengthMultiplier)
      )
    );
    const confusionDurationMs =
      computingWorldPlazaEntityImmuneSystemScaledDurationMs(
        grant.durationMs,
        resolvedDurationMultiplier
      );

    return addingWorldPlazaEntityHealthConfusionEffect(state, {
      id: effectId,
      targetIntensity,
      appliedAtMs: nowMs,
      expiresAtMs: nowMs + confusionDurationMs,
      phaseSeed: (grantIndex + 1) * 1.7,
    });
  }

  if (grant.kind === 'sleep') {
    const effectId = buildingWorldPlazaEntityDiseaseGrantEffectInstanceId(
      diseaseInstanceId,
      grantIndex,
      'sleep'
    );
    const sleepDurationMs =
      computingWorldPlazaEntityImmuneSystemScaledDurationMs(
        grant.durationMs,
        resolvedDurationMultiplier
      );
    const wakeBonusDamage = Math.max(
      1,
      Math.round(
        (grant.wakeBonusDamage ??
          DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE) *
          resolvedSymptomStrengthMultiplier
      )
    );

    return addingWorldPlazaEntityHealthSleepEffect(state, {
      id: effectId,
      appliedAtMs: nowMs,
      expiresAtMs: nowMs + sleepDurationMs,
      wakeBonusDamage,
    });
  }

  const descriptor = resolvingWorldPlazaEntityBuffDescriptor(grant.buffId);

  if (!descriptor) {
    return state;
  }

  const instanceId = buildingWorldPlazaEntityDiseaseGrantBuffInstanceId(
    diseaseInstanceId,
    grantIndex,
    grant.buffId
  );
  const buffDurationMs = computingWorldPlazaEntityImmuneSystemScaledDurationMs(
    grant.durationMs,
    resolvedDurationMultiplier
  );
  const expiresAtMs = nowMs + buffDurationMs;
  const { effect } = descriptor;

  if (effect.kind === 'movement_modifier') {
    const weakenedMultiplier =
      computingWorldPlazaEntityImmuneSystemWeakenedDebuffMultiplier(
        effect.multiplier,
        resolvedSymptomStrengthMultiplier
      );
    let nextState = addingWorldPlazaEntityHealthMovementModifier(state, {
      id: instanceId,
      kind: effect.modifierKind,
      multiplier: weakenedMultiplier,
      expiresAtMs,
    });

    for (const companionModifier of effect.companionModifiers ?? []) {
      nextState = addingWorldPlazaEntityHealthMovementModifier(nextState, {
        id: instanceId,
        kind: companionModifier.modifierKind,
        multiplier:
          computingWorldPlazaEntityImmuneSystemWeakenedDebuffMultiplier(
            companionModifier.multiplier,
            resolvedSymptomStrengthMultiplier
          ),
        expiresAtMs,
      });
    }

    return nextState;
  }

  if (effect.kind === 'incoming_damage_multiplier') {
    const weakenedMultiplier =
      computingWorldPlazaEntityImmuneSystemWeakenedDebuffMultiplier(
        effect.multiplier,
        resolvedSymptomStrengthMultiplier
      );

    return addingWorldPlazaEntityHealthIncomingDamageModifier(state, {
      id: instanceId,
      multiplier: weakenedMultiplier,
      expiresAtMs,
    });
  }

  return state;
}

/** Extracts template buff id from a disease-scoped instance id. */
export function resolvingWorldPlazaEntityDiseaseGrantTemplateBuffId(
  instanceId: string
): string | null {
  if (!instanceId.startsWith('disease-grant:')) {
    return null;
  }

  const segments = instanceId.split(':');

  return segments.at(-1) ?? null;
}
