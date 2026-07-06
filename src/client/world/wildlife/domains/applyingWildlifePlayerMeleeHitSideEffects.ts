/**
 * Applies resolved wildlife on-hit procs to the local player health handlers.
 *
 * @module components/world/wildlife/domains/applyingWildlifePlayerMeleeHitSideEffects
 */

import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type { DefiningWildlifePlayerMeleeHit } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeciesOnHitPlayerProcs } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesOnHitPlayerProcs';

export type ApplyingWildlifePlayerMeleeHitSideEffectsHandlers = {
  applyBleed: (
    severity: DefiningWorldPlazaEntityBleedSeverity,
    flatExpectedDamage: number
  ) => void;
  applyPoison: (
    potency: DefiningWorldPlazaEntityPoisonPotency,
    flatExpectedDamage: number
  ) => void;
  applyBuff: (buffId: string) => void;
};

/**
 * Rolls and applies bleed, poison, and thematic debuff procs for one melee hit.
 */
export function applyingWildlifePlayerMeleeHitSideEffects(
  hit: DefiningWildlifePlayerMeleeHit,
  handlers: ApplyingWildlifePlayerMeleeHitSideEffectsHandlers,
  roll: () => number = Math.random
): void {
  const procs = resolvingWildlifeSpeciesOnHitPlayerProcs(
    hit.speciesId,
    hit.damageAmount,
    roll
  );

  for (const proc of procs) {
    if (proc.kind === 'bleed') {
      handlers.applyBleed(proc.severity, proc.flatExpectedDamage);
      continue;
    }

    if (proc.kind === 'poison') {
      handlers.applyPoison(proc.potency, proc.flatExpectedDamage);
      continue;
    }

    handlers.applyBuff(proc.buffId);
  }
}
