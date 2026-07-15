/**
 * Applies resolved wildlife on-hit procs to the local player health handlers.
 *
 * @module components/world/wildlife/domains/applyingWildlifePlayerMeleeHitSideEffects
 */

import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { resolvingWildlifeDiseaseTransmissionProfile } from '@/components/world/wildlife/domains/definingWildlifeDiseaseTransmissionRegistry';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifePlayerMeleeHit } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeDiseaseTransmissionChance } from '@/components/world/wildlife/domains/resolvingWildlifeDiseaseTransmissionChance';
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
  /** Positive heats; negative cools (°C). */
  applyTemperature: (deltaCelsius: number) => void;
  applyDisease: (diseaseId: DefiningWorldPlazaEntityDiseaseId) => void;
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
    invokingWorldPlazaLoopBodySafely(
      `combat:wildlife-melee-proc:${hit.speciesId}:${proc.kind}`,
      () => {
        if (proc.kind === 'bleed') {
          handlers.applyBleed(proc.severity, proc.flatExpectedDamage);
          return;
        }

        if (proc.kind === 'poison') {
          handlers.applyPoison(proc.potency, proc.flatExpectedDamage);
          return;
        }

        if (proc.kind === 'temperature') {
          handlers.applyTemperature(proc.deltaCelsius);
          return;
        }

        handlers.applyBuff(proc.buffId);
      }
    );
  }

  invokingWorldPlazaLoopBodySafely(
    `combat:wildlife-melee-disease:${hit.speciesId}`,
    () => {
      const species = resolvingWildlifeSpeciesDefinition(hit.speciesId);

      if (!species) {
        return;
      }

      const profile = resolvingWildlifeDiseaseTransmissionProfile(
        hit.speciesId
      );

      if (!profile?.bite) {
        return;
      }

      const chance = resolvingWildlifeDiseaseTransmissionChance({
        speciesId: hit.speciesId,
        temperamentId: species.temperamentId,
        aggressionLevel: hit.aggressionLevel,
        kind: 'bite',
      });

      if (chance > 0 && roll() < chance) {
        handlers.applyDisease(profile.diseaseId);
      }
    }
  );
}
