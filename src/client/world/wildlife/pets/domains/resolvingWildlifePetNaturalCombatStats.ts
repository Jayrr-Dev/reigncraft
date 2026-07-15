/**

 * Resolves natural (pre-upgrade) companion combat stats for Spritcore pricing.

 *

 * @module components/world/wildlife/pets/domains/resolvingWildlifePetNaturalCombatStats

 */

import { resolvingWorldPlazaScaledAttackIntervalMs } from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';

import {
  WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
  type WorldPlazaSpritcoreUpgradeBonuses,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

import {
  resolvingWildlifeInstanceAttackPowerMultiplier,
  resolvingWildlifeInstanceBaseDefense,
  resolvingWildlifeInstanceBaseMaxHealth,
  resolvingWildlifeInstanceNaturalRunSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type ResolvingWildlifePetNaturalCombatStatsResult = {
  readonly naturalMaxHealth: number;

  readonly naturalAttackPower: number;

  readonly naturalAttackSpeed: number;

  readonly naturalDefense: number;

  readonly naturalRunSpeed: number;

  readonly bonuses: WorldPlazaSpritcoreUpgradeBonuses;
};

/**

 * Species+size stats with Spritcore bonuses stripped, plus the live bonuses.

 */

export function resolvingWildlifePetNaturalCombatStats(
  instance: DefiningWildlifeInstance
): ResolvingWildlifePetNaturalCombatStatsResult | null {
  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

  if (!species) {
    return null;
  }

  const bonuses =
    instance.petBond?.spritcoreUpgrades ??
    WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;

  const effectiveMaxHealth = resolvingWildlifeInstanceBaseMaxHealth(
    species,

    instance
  );

  const naturalMaxHealth = Math.max(
    1,

    effectiveMaxHealth - bonuses.bonusMaxHealth
  );

  const naturalAttackPower = Math.round(
    species.vitals.attackPower *
      resolvingWildlifeInstanceAttackPowerMultiplier(species, instance)
  );

  const naturalAttackIntervalMs = resolvingWorldPlazaScaledAttackIntervalMs(
    species.vitals.attackIntervalMs
  );

  const naturalAttackSpeed = 1000 / Math.max(1, naturalAttackIntervalMs);

  const naturalDefense = resolvingWildlifeInstanceBaseDefense(
    species,
    instance
  );

  const naturalRunSpeed = resolvingWildlifeInstanceNaturalRunSpeedGridPerSecond(
    species,

    instance
  );

  return {
    naturalMaxHealth,

    naturalAttackPower,

    naturalAttackSpeed,

    naturalDefense,

    naturalRunSpeed,

    bonuses,
  };
}
