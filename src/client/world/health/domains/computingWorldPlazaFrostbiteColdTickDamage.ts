/**
 * Resolves ambient + percent frost damage for one cold tick under frostbite.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteColdTickDamage
 */

import { computingWorldPlazaFrostbitePercentMaxHealthDamage } from '@/components/world/health/domains/computingWorldPlazaFrostbitePercentMaxHealthDamage';
import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_FROST_DAMAGE_TAKEN_MULTIPLIER } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import type { DefiningWorldPlazaEntityFrostbiteState } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteTypes';
import { resolvingWorldPlazaEntityFrostbiteStage } from '@/components/world/health/domains/resolvingWorldPlazaEntityFrostbiteStage';

export type ComputingWorldPlazaFrostbiteColdTickDamageResult = {
  ambientDamage: number;
  percentMaxHealthDamage: number;
  totalDamage: number;
};

/**
 * Scales ambient cold tick damage and optional Frostnip+ percent damage.
 */
export function computingWorldPlazaFrostbiteColdTickDamage({
  ambientTickDamage,
  frostbite,
  effectiveMaxHealth,
}: {
  ambientTickDamage: number;
  frostbite: DefiningWorldPlazaEntityFrostbiteState | null;
  effectiveMaxHealth: number;
}): ComputingWorldPlazaFrostbiteColdTickDamageResult {
  const stage = resolvingWorldPlazaEntityFrostbiteStage(
    frostbite?.stackCount ?? 0
  );
  const frostMultiplier =
    stage?.amplifiesFrostDamage === true
      ? DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_FROST_DAMAGE_TAKEN_MULTIPLIER
      : 1;
  const percentMaxHealthDamage =
    stage?.appliesPercentMaxHealthFrostDamage === true
      ? computingWorldPlazaFrostbitePercentMaxHealthDamage(
          frostbite?.stackCount ?? 0,
          effectiveMaxHealth
        ) * frostMultiplier
      : 0;
  const ambientDamage = ambientTickDamage * frostMultiplier;

  return {
    ambientDamage,
    percentMaxHealthDamage,
    totalDamage: ambientDamage + percentMaxHealthDamage,
  };
}
