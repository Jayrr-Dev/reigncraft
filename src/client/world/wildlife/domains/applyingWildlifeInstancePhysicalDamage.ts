/**
 * Applies physical damage to one wildlife instance through the health pipeline.
 *
 * @module components/world/wildlife/domains/applyingWildlifeInstancePhysicalDamage
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { notifyingWorldPlazaAvatarMeleeHitOutcome } from '@/components/world/domains/notifyingWorldPlazaAvatarMeleeHitOutcome';
import { checkingWorldPlazaEntityHealthSleepCanWakeFromDamage } from '@/components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import { checkingWildlifeOmegaWolfSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeOmegaWolfSfxEvent } from '@/components/world/wildlife/domains/notifyingWildlifeOmegaWolfSfxEvent';
import { notifyingWildlifeSpeciesSfxEvent } from '@/components/world/wildlife/domains/notifyingWildlifeSpeciesSfxEvent';
import { notifyingWildlifeVocalSfxOnDeath } from '@/components/world/wildlife/domains/notifyingWildlifeVocalSfxOnDeath';
import {
  resolvingWildlifeObeseIncomingPhysicalDamageOptions,
  resolvingWildlifeObeseJumpAttackDamageOptions,
} from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameDamageOptions';
import { resolvingWildlifeOmegaWolfOutgoingDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfOutgoingDamageOptions';
import { resolvingWildlifePlayerOutgoingPhysicalDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifePlayerOutgoingPhysicalDamageOptions';
import { resolvingWildlifeSleepAmbushHealthDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { wakingWildlifeFromSleepHit } from '@/components/world/wildlife/domains/wakingWildlifeFromSleepHit';

export type ApplyingWildlifeInstancePhysicalDamageWakeContext = {
  threatPoint: DefiningWorldPlazaWorldPoint;
  threatTargetId: string | null;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

export type ApplyingWildlifeInstancePhysicalDamageParams = {
  instance: DefiningWildlifeInstance;
  rawAmount: number;
  nowMs: number;
  wakeContext?: ApplyingWildlifeInstancePhysicalDamageWakeContext | null;
  attacker?: Pick<
    DefiningWildlifeInstance,
    'largeSizeFrame' | 'aiState' | 'speciesId'
  > | null;
};

/**
 * Runs wildlife physical damage, forcing a lethal EV tier roll on sleeping targets.
 */
export function applyingWildlifeInstancePhysicalDamage({
  instance,
  rawAmount,
  nowMs,
  wakeContext = null,
  attacker = null,
}: ApplyingWildlifeInstancePhysicalDamageParams): DefiningWildlifeInstance {
  const sleepAmbushOptions =
    resolvingWildlifeSleepAmbushHealthDamageOptions(instance);
  const obeseIncomingOptions =
    resolvingWildlifeObeseIncomingPhysicalDamageOptions(instance);
  const obeseJumpAttackOptions = attacker
    ? resolvingWildlifeObeseJumpAttackDamageOptions(attacker, nowMs)
    : null;
  const omegaOutgoingOptions = attacker?.speciesId
    ? resolvingWildlifeOmegaWolfOutgoingDamageOptions(attacker.speciesId)
    : null;
  const damageOptions =
    sleepAmbushOptions ??
    omegaOutgoingOptions ??
    obeseJumpAttackOptions ??
    obeseIncomingOptions ??
    (attacker
      ? { skipDamageRoll: true }
      : resolvingWildlifePlayerOutgoingPhysicalDamageOptions());
  const wasSleeping = sleepAmbushOptions !== null;
  const canWakeFromDamage =
    checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
      instance.healthState,
      nowMs
    );
  const shouldWakeFromHit = wasSleeping && canWakeFromDamage;

  let nextInstance = applyingWildlifeInstanceHealthDamageWithFloatFeedback({
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
    rawAmount,
    kind: 'physical',
    nowMs,
    options: damageOptions,
    onAppliedDamage: !attacker
      ? ({ outcomeTier, healthDamage }) => {
          notifyingWorldPlazaAvatarMeleeHitOutcome(outcomeTier);

          if (healthDamage > 0) {
            const willDie =
              instance.healthState.currentHealth - healthDamage <= 0;

            // Lethal hits skip hit_taken; death silence cuts any in-flight vocal.
            if (!willDie) {
              if (checkingWildlifeOmegaWolfSpecies(instance.speciesId)) {
                notifyingWildlifeOmegaWolfSfxEvent({
                  instanceId: instance.instanceId,
                  eventKind: 'hit_taken',
                  worldPoint: instance.position,
                });
              } else {
                notifyingWildlifeSpeciesSfxEvent({
                  instanceId: instance.instanceId,
                  speciesId: instance.speciesId,
                  eventKind: 'hit_taken',
                  worldPoint: instance.position,
                });
              }
            }
          }
        }
      : undefined,
  });

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
