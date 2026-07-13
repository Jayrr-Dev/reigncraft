/**
 * Applies transform-species on-hit procs (bleed, poison, debuffs) to wildlife
 * when the local player lands a melee hit while playing as that animal.
 *
 * @module components/world/wildlife/domains/applyingWildlifeTransformMeleeHitSideEffects
 */

import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeciesOnHitPlayerProcs } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesOnHitPlayerProcs';

export type ApplyingWildlifeTransformMeleeHitSideEffectsParams = {
  readonly instance: DefiningWildlifeInstance;
  readonly attackerSpeciesId: DefiningWildlifeSpeciesId;
  readonly meleeDamage: number;
  readonly nowMs: number;
  readonly roll?: () => number;
};

/**
 * Rolls the attacker species on-hit table and applies landed procs to the target.
 */
export function applyingWildlifeTransformMeleeHitSideEffects({
  instance,
  attackerSpeciesId,
  meleeDamage,
  nowMs,
  roll = Math.random,
}: ApplyingWildlifeTransformMeleeHitSideEffectsParams): DefiningWildlifeInstance {
  if (instance.isDead || meleeDamage <= 0) {
    return instance;
  }

  const procs = resolvingWildlifeSpeciesOnHitPlayerProcs(
    attackerSpeciesId,
    meleeDamage,
    roll
  );

  if (procs.length === 0) {
    return instance;
  }

  let healthState = instance.healthState;

  for (const proc of procs) {
    invokingWorldPlazaLoopBodySafely(
      `combat:transform-melee-proc:${attackerSpeciesId}:${proc.kind}`,
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
