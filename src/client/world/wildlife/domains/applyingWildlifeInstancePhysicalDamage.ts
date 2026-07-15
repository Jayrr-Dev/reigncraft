/**
 * Applies physical damage to one wildlife instance through the health pipeline.
 *
 * @module components/world/wildlife/domains/applyingWildlifeInstancePhysicalDamage
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { notifyingWorldPlazaAvatarMeleeHitOutcome } from '@/components/world/domains/notifyingWorldPlazaAvatarMeleeHitOutcome';
import { checkingWorldPlazaEntityHealthSleepCanWakeFromDamage } from '@/components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage';
import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWildlifeChargeRunAttackDamageOptions } from '@/components/world/wildlife/domains/advancingWildlifeChargeWindup';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import { computingWildlifeInstanceDefenseMitigatedDamage } from '@/components/world/wildlife/domains/computingWildlifeInstanceDefenseMitigatedDamage';
import { checkingWildlifeOmegaWolfSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeOmegaWolfSfxEvent } from '@/components/world/wildlife/domains/notifyingWildlifeOmegaWolfSfxEvent';
import { notifyingWildlifeSpeciesSfxEvent } from '@/components/world/wildlife/domains/notifyingWildlifeSpeciesSfxEvent';
import { notifyingWildlifeVocalSfxOnDeath } from '@/components/world/wildlife/domains/notifyingWildlifeVocalSfxOnDeath';
import { resolvingWildlifeInstanceEffectiveDefense } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import {
  resolvingWildlifeObeseIncomingPhysicalDamageOptions,
  resolvingWildlifeObeseJumpAttackDamageOptions,
} from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameDamageOptions';
import { resolvingWildlifeOmegaWolfOutgoingDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfOutgoingDamageOptions';
import { resolvingWildlifePlayerOutgoingPhysicalDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifePlayerOutgoingPhysicalDamageOptions';
import { resolvingWildlifeSleepAmbushHealthDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { wakingWildlifeFromSleepHit } from '@/components/world/wildlife/domains/wakingWildlifeFromSleepHit';
import { applyingWildlifePetSoulsave } from '@/components/world/wildlife/pets/domains/applyingWildlifePetSoulsave';
import { syncingWildlifePetDeathToRoster } from '@/components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster';

export type ApplyingWildlifeInstancePhysicalDamageWakeContext = {
  threatPoint: DefiningWorldPlazaWorldPoint;
  threatTargetId: string | null;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

export type ApplyingWildlifeOutgoingPhysicalDamageStyle =
  | 'player-ev'
  | 'wildlife-flat';

export type ApplyingWildlifeInstancePhysicalDamageParams = {
  instance: DefiningWildlifeInstance;
  rawAmount: number;
  nowMs: number;
  wakeContext?: ApplyingWildlifeInstancePhysicalDamageWakeContext | null;
  attacker?: Pick<
    DefiningWildlifeInstance,
    'largeSizeFrame' | 'aiState' | 'speciesId' | 'staminaState'
  > | null;
  /** When set with `attacker`, enables charge-run critical EV options. */
  attackerIsRunning?: boolean;
  /**
   * Player girl/tool hits use EV. Animal transforms match wildlife→wildlife flat.
   * Ignored when `attacker` is set (always flat) or sleep/special options win.
   */
  outgoingDamageStyle?: ApplyingWildlifeOutgoingPhysicalDamageStyle;
  /** Player buff + specialty-weapon attacker roll crumbs for EV hits. */
  playerOutgoingDamageOptions?: Pick<
    DefiningWorldPlazaEntityHealthDamageOptions,
    'attackerDamageRollModifiers' | 'forcedRollMode'
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
  attackerIsRunning = false,
  outgoingDamageStyle = 'player-ev',
  playerOutgoingDamageOptions = null,
}: ApplyingWildlifeInstancePhysicalDamageParams): DefiningWildlifeInstance {
  const sleepAmbushOptions =
    resolvingWildlifeSleepAmbushHealthDamageOptions(instance);
  const obeseIncomingOptions =
    resolvingWildlifeObeseIncomingPhysicalDamageOptions(instance);
  const obeseJumpAttackOptions = attacker
    ? resolvingWildlifeObeseJumpAttackDamageOptions(attacker, nowMs)
    : null;
  const chargeRunAttackOptions = attacker
    ? resolvingWildlifeChargeRunAttackDamageOptions(
        attacker,
        attacker.speciesId,
        attackerIsRunning,
        nowMs
      )
    : null;
  const omegaOutgoingOptions = attacker?.speciesId
    ? resolvingWildlifeOmegaWolfOutgoingDamageOptions(attacker.speciesId)
    : null;
  const useWildlifeFlatOutgoing =
    attacker !== null || outgoingDamageStyle === 'wildlife-flat';
  const damageOptions =
    sleepAmbushOptions ??
    chargeRunAttackOptions ??
    omegaOutgoingOptions ??
    obeseJumpAttackOptions ??
    obeseIncomingOptions ??
    (useWildlifeFlatOutgoing
      ? { skipDamageRoll: true }
      : resolvingWildlifePlayerOutgoingPhysicalDamageOptions({
          attackerDamageRollModifiers:
            playerOutgoingDamageOptions?.attackerDamageRollModifiers,
          forcedRollMode: playerOutgoingDamageOptions?.forcedRollMode,
        }));
  const wasSleeping = sleepAmbushOptions !== null;
  const canWakeFromDamage =
    checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
      instance.healthState,
      nowMs
    );
  const shouldWakeFromHit = wasSleeping && canWakeFromDamage;
  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);
  const mitigatedAmount = species
    ? computingWildlifeInstanceDefenseMitigatedDamage(
        rawAmount,
        resolvingWildlifeInstanceEffectiveDefense(species, instance)
      )
    : rawAmount;

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
    rawAmount: mitigatedAmount,
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

  if (nextInstance.isDead || nextInstance.healthState.currentHealth <= 0) {
    const soulsaveResult = applyingWildlifePetSoulsave({
      instance: nextInstance,
      nowMs,
    });

    if (soulsaveResult.intercepted) {
      nextInstance = soulsaveResult.instance;
    } else {
      syncingWildlifePetDeathToRoster(nextInstance, nowMs);
    }
  }

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
