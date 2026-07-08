import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { buildingWorldPlazaEntityDiseaseGrantBuffInstanceId } from '@/components/world/health/domains/checkingWorldPlazaEntityActionLocked';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX,
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import type { DefiningWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
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
  nowMs: number;
};

function buildingWorldPlazaEntityDiseaseGrantEffectInstanceId(
  diseaseInstanceId: string,
  grantIndex: number,
  suffix: string
): string {
  return `disease-grant:${diseaseInstanceId}:${grantIndex}:${suffix}`;
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
}: ApplyingWorldPlazaEntityDiseaseStageGrantParams): DefiningWorldPlazaEntityHealthState {
  if (grant.kind === 'poison') {
    return applyingWorldPlazaEntityHealthPoison(
      state,
      grant.potency,
      grant.totalPoisonDamage,
      nowMs
    );
  }

  if (grant.kind === 'bleed') {
    return applyingWorldPlazaEntityHealthBleed(
      state,
      grant.severity,
      grant.flatExpectedDamage,
      nowMs
    );
  }

  if (grant.kind === 'potential_damage') {
    return applyingWorldPlazaEntityHealthPotentialDamage({
      state,
      pendingExpectedDamage: grant.pendingExpectedDamage,
      resolveDelayMs: grant.resolveDelayMs,
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
      Math.min(DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX, grant.intensity)
    );

    return addingWorldPlazaEntityHealthConfusionEffect(state, {
      id: effectId,
      targetIntensity,
      appliedAtMs: nowMs,
      expiresAtMs: nowMs + grant.durationMs,
      phaseSeed: (grantIndex + 1) * 1.7,
    });
  }

  if (grant.kind === 'sleep') {
    const effectId = buildingWorldPlazaEntityDiseaseGrantEffectInstanceId(
      diseaseInstanceId,
      grantIndex,
      'sleep'
    );

    return addingWorldPlazaEntityHealthSleepEffect(state, {
      id: effectId,
      appliedAtMs: nowMs,
      expiresAtMs: nowMs + grant.durationMs,
      wakeBonusDamage:
        grant.wakeBonusDamage ?? DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE,
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
  const expiresAtMs = nowMs + grant.durationMs;
  const { effect } = descriptor;

  if (effect.kind === 'movement_modifier') {
    let nextState = addingWorldPlazaEntityHealthMovementModifier(state, {
      id: instanceId,
      kind: effect.modifierKind,
      multiplier: effect.multiplier,
      expiresAtMs,
    });

    for (const companionModifier of effect.companionModifiers ?? []) {
      nextState = addingWorldPlazaEntityHealthMovementModifier(nextState, {
        id: instanceId,
        kind: companionModifier.modifierKind,
        multiplier: companionModifier.multiplier,
        expiresAtMs,
      });
    }

    return nextState;
  }

  if (effect.kind === 'incoming_damage_multiplier') {
    return addingWorldPlazaEntityHealthIncomingDamageModifier(state, {
      id: instanceId,
      multiplier: effect.multiplier,
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
