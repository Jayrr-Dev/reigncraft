/**
 * Applies combat payload damage and status effects to one wildlife instance.
 *
 * @module components/world/wildlife/domains/applyingWildlifeInstanceHealthPayload
 */

import { applyingWorldPlazaEntityHealthPayload } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPayload';
import { checkingWorldPlazaEntityHealthSleepCanWakeFromDamage } from '@/components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage';
import { pruningWorldPlazaEntityHealthFloatTexts } from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import type { DefiningWorldPlazaProjectilePayloadConfig } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import type { ApplyingWildlifeInstancePhysicalDamageWakeContext } from '@/components/world/wildlife/domains/applyingWildlifeInstancePhysicalDamage';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeVocalSfxOnDeath } from '@/components/world/wildlife/domains/notifyingWildlifeVocalSfxOnDeath';
import { resolvingWildlifePlayerOutgoingPhysicalDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifePlayerOutgoingPhysicalDamageOptions';
import { resolvingWildlifeSleepAmbushHealthDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions';
import { wakingWildlifeFromSleepHit } from '@/components/world/wildlife/domains/wakingWildlifeFromSleepHit';

export type ApplyingWildlifeInstanceHealthPayloadParams = {
  instance: DefiningWildlifeInstance;
  payload: DefiningWorldPlazaProjectilePayloadConfig;
  nowMs: number;
  wakeContext?: ApplyingWildlifeInstancePhysicalDamageWakeContext | null;
};

/**
 * Runs wildlife payload application with combat floats and sleep wake handling.
 */
export function applyingWildlifeInstanceHealthPayload({
  instance,
  payload,
  nowMs,
  wakeContext = null,
}: ApplyingWildlifeInstanceHealthPayloadParams): DefiningWildlifeInstance {
  const sleepAmbushOptions =
    resolvingWildlifeSleepAmbushHealthDamageOptions(instance);
  const wasSleeping = sleepAmbushOptions !== null;
  const canWakeFromDamage =
    checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
      instance.healthState,
      nowMs
    );
  const shouldWakeFromHit = wasSleeping && canWakeFromDamage;
  const instantDamageAmount = payload.damageAmount ?? 0;
  const instantDamageKind = payload.damageKind ?? 'physical';

  let nextInstance: DefiningWildlifeInstance;

  if (instantDamageAmount > 0) {
    nextInstance = applyingWildlifeInstanceHealthDamageWithFloatFeedback({
      instance: shouldWakeFromHit
        ? {
            ...instance,
            aiState: {
              ...instance.aiState,
              isSleeping: false,
              hasSleepBeenDisturbed: true,
            },
          }
        : instance,
      rawAmount: instantDamageAmount,
      kind: instantDamageKind,
      nowMs,
      options:
        sleepAmbushOptions ??
        resolvingWildlifePlayerOutgoingPhysicalDamageOptions(),
    });
  } else {
    nextInstance = {
      ...instance,
      floatingTexts: pruningWorldPlazaEntityHealthFloatTexts(
        instance.floatingTexts,
        nowMs
      ),
    };
  }

  if ((payload.statusEffects?.length ?? 0) > 0) {
    nextInstance = {
      ...nextInstance,
      healthState: applyingWorldPlazaEntityHealthPayload({
        state: nextInstance.healthState,
        payload: {
          ...payload,
          damageAmount: undefined,
        },
        nowMs,
      }),
    };
  }

  const died = nextInstance.healthState.currentHealth <= 0;

  nextInstance = {
    ...nextInstance,
    isDead: died,
    diedAtMs: died ? nowMs : nextInstance.diedAtMs,
    aiState: {
      ...nextInstance.aiState,
      motionClip: died ? 'die' : nextInstance.aiState.motionClip,
    },
  };

  notifyingWildlifeVocalSfxOnDeath({
    instanceId: instance.instanceId,
    wasDead: instance.isDead,
    isDead: nextInstance.isDead,
  });

  if (shouldWakeFromHit && !nextInstance.isDead && wakeContext) {
    nextInstance = wakingWildlifeFromSleepHit({
      instance: nextInstance,
      species: wakeContext.species,
      threatPoint: wakeContext.threatPoint,
      threatTargetId: wakeContext.threatTargetId,
      hazardSampling: wakeContext.hazardSampling,
      nowMs,
    });
  }

  return nextInstance;
}
