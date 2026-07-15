/**
 * Applies roll-profile extra on-hit procs (prey kicks / trampling) after a
 * successful animal roll contact hit. Predators already get species on-hit
 * via transform melee side effects on damage apply.
 *
 * @module components/world/wildlife/domains/applyingWildlifeAnimalRollAttackHitSideEffects
 */

import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { applyingWorldPlazaEntityHealthTemperatureImpulse } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthTemperatureImpulse';
import type { DefiningWildlifeSpeciesOnHitEffect } from '@/components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry';
import { listingWildlifeSpeciesOnHitEffects } from '@/components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeSpeciesOnHitPlayerProc } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesOnHitPlayerProcs';

const DEFINING_WILDLIFE_ROLL_EXTRA_ON_HIT_DEFAULT_DAMAGE_SCALE = 0.25;
const DEFINING_WILDLIFE_ROLL_EXTRA_ON_HIT_MIN_FLAT_EXPECTED_DAMAGE = 4;

export type ApplyingWildlifeAnimalRollAttackHitSideEffectsParams = {
  readonly instance: DefiningWildlifeInstance;
  readonly attackerSpeciesId: DefiningWildlifeSpeciesId;
  readonly rollDamage: number;
  readonly extraOnHitEffects: readonly DefiningWildlifeSpeciesOnHitEffect[];
  readonly nowMs: number;
  readonly roll?: () => number;
};

function resolvingWildlifeRollExtraFlatExpectedDamage(
  rollDamage: number,
  effect: Extract<
    DefiningWildlifeSpeciesOnHitEffect,
    { kind: 'bleed' | 'poison' }
  >
): number {
  const damageScale =
    effect.damageScale ?? DEFINING_WILDLIFE_ROLL_EXTRA_ON_HIT_DEFAULT_DAMAGE_SCALE;

  return Math.max(
    DEFINING_WILDLIFE_ROLL_EXTRA_ON_HIT_MIN_FLAT_EXPECTED_DAMAGE,
    rollDamage * damageScale
  );
}

/**
 * Rolls and applies roll-only extra on-hit effects when the attacker species
 * has no shared wildlife on-hit table.
 */
export function applyingWildlifeAnimalRollAttackHitSideEffects({
  instance,
  attackerSpeciesId,
  rollDamage,
  extraOnHitEffects,
  nowMs,
  roll = Math.random,
}: ApplyingWildlifeAnimalRollAttackHitSideEffectsParams): DefiningWildlifeInstance {
  if (
    instance.isDead ||
    rollDamage <= 0 ||
    extraOnHitEffects.length === 0 ||
    listingWildlifeSpeciesOnHitEffects(attackerSpeciesId).length > 0
  ) {
    return instance;
  }

  const procs: ResolvingWildlifeSpeciesOnHitPlayerProc[] = [];

  for (const effect of extraOnHitEffects) {
    if (roll() >= effect.procChance) {
      continue;
    }

    if (effect.kind === 'bleed') {
      procs.push({
        kind: 'bleed',
        severity: effect.severity,
        flatExpectedDamage: resolvingWildlifeRollExtraFlatExpectedDamage(
          rollDamage,
          effect
        ),
      });
      continue;
    }

    if (effect.kind === 'poison') {
      procs.push({
        kind: 'poison',
        potency: effect.potency,
        flatExpectedDamage: resolvingWildlifeRollExtraFlatExpectedDamage(
          rollDamage,
          effect
        ),
      });
      continue;
    }

    if (effect.kind === 'temperature') {
      procs.push({
        kind: 'temperature',
        deltaCelsius: effect.deltaCelsius,
      });
      continue;
    }

    procs.push({
      kind: 'buff',
      buffId: effect.buffId,
    });
  }

  if (procs.length === 0) {
    return instance;
  }

  let healthState = instance.healthState;

  for (const proc of procs) {
    invokingWorldPlazaLoopBodySafely(
      `combat:animal-roll-proc:${attackerSpeciesId}:${proc.kind}`,
      () => {
        if (proc.kind === 'bleed') {
          healthState = applyingWorldPlazaEntityHealthBleedStack(
            healthState,
            proc.severity,
            proc.flatExpectedDamage,
            nowMs
          );
          return;
        }

        if (proc.kind === 'poison') {
          healthState = applyingWorldPlazaEntityHealthPoisonStack(
            healthState,
            proc.potency,
            proc.flatExpectedDamage,
            nowMs
          );
          return;
        }

        if (proc.kind === 'temperature') {
          healthState = applyingWorldPlazaEntityHealthTemperatureImpulse(
            healthState,
            proc.deltaCelsius
          );
          return;
        }

        healthState = applyingWorldPlazaEntityBuff(
          healthState,
          proc.buffId,
          nowMs
        );
      }
    );
  }

  return {
    ...instance,
    healthState,
  };
}
