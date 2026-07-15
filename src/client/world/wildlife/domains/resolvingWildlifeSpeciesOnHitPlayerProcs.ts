/**
 * Resolves which wildlife on-hit effects proc against the player on a landed swing.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeciesOnHitPlayerProcs
 */

import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import {
  listingWildlifeSpeciesOnHitEffects,
  type DefiningWildlifeSpeciesOnHitEffect,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_ON_HIT_DEFAULT_DAMAGE_SCALE = 0.25;

const DEFINING_WILDLIFE_ON_HIT_MIN_FLAT_EXPECTED_DAMAGE = 4;

export type ResolvingWildlifeSpeciesOnHitPlayerProc =
  | {
      kind: 'bleed';
      severity: DefiningWorldPlazaEntityBleedSeverity;
      flatExpectedDamage: number;
    }
  | {
      kind: 'poison';
      potency: DefiningWorldPlazaEntityPoisonPotency;
      flatExpectedDamage: number;
    }
  | {
      kind: 'buff';
      buffId: string;
    }
  | {
      kind: 'temperature';
      deltaCelsius: number;
    };

function resolvingWildlifeOnHitFlatExpectedDamage(
  meleeDamage: number,
  effect: Extract<
    DefiningWildlifeSpeciesOnHitEffect,
    { kind: 'bleed' | 'poison' }
  >
): number {
  const damageScale =
    effect.damageScale ?? DEFINING_WILDLIFE_ON_HIT_DEFAULT_DAMAGE_SCALE;

  return Math.max(
    DEFINING_WILDLIFE_ON_HIT_MIN_FLAT_EXPECTED_DAMAGE,
    meleeDamage * damageScale
  );
}

/**
 * Rolls each configured on-hit effect independently and returns the procs that landed.
 */
export function resolvingWildlifeSpeciesOnHitPlayerProcs(
  speciesId: DefiningWildlifeSpeciesId,
  meleeDamage: number,
  roll: () => number = Math.random
): readonly ResolvingWildlifeSpeciesOnHitPlayerProc[] {
  const effects = listingWildlifeSpeciesOnHitEffects(speciesId);

  if (effects.length === 0 || meleeDamage <= 0) {
    return [];
  }

  const procs: ResolvingWildlifeSpeciesOnHitPlayerProc[] = [];

  for (const effect of effects) {
    if (roll() >= effect.procChance) {
      continue;
    }

    if (effect.kind === 'bleed') {
      procs.push({
        kind: 'bleed',
        severity: effect.severity,
        flatExpectedDamage: resolvingWildlifeOnHitFlatExpectedDamage(
          meleeDamage,
          effect
        ),
      });
      continue;
    }

    if (effect.kind === 'poison') {
      procs.push({
        kind: 'poison',
        potency: effect.potency,
        flatExpectedDamage: resolvingWildlifeOnHitFlatExpectedDamage(
          meleeDamage,
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

  return procs;
}
