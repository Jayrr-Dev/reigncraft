/**
 * Translates wildlife species and instances into strength profiles.
 *
 * Species baseline uses the mean spawn roll (size sample 0, no large-size
 * frame). Instance profiles fold in the per-spawn size bell curve, obese /
 * apex frames, and the aggressive-chicken buffs via declarative modifiers.
 *
 * @module components/world/strength/domains/resolvingWildlifeStrengthProfile
 */

import {
  computingWorldPlazaStrengthIndexScore,
  type ComputingWorldPlazaStrengthIndexResult,
} from '@/components/world/strength/domains/computingWorldPlazaStrengthIndexScore';
import type {
  DefiningWorldPlazaStrengthModifier,
  DefiningWorldPlazaStrengthProfile,
} from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';
import { checkingWildlifeIsAggressiveChicken } from '@/components/world/wildlife/domains/checkingWildlifeIsAggressiveChicken';
import {
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER,
} from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceCombatStatMultiplier,
  resolvingWildlifeInstanceSpeedStatMultiplier,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

type ResolvingWildlifeStrengthInstanceProfile = Pick<
  DefiningWildlifeInstance,
  | 'instanceId'
  | 'speciesId'
  | 'aggressionLevel'
  | 'sizeScaleSample'
  | 'largeSizeFrame'
>;

function buildingWildlifeStrengthProfile(
  species: DefiningWildlifeSpeciesDefinition,
  subjectId: string,
  modifiers: readonly DefiningWorldPlazaStrengthModifier[]
): DefiningWorldPlazaStrengthProfile {
  return {
    subjectId,
    subjectKind: 'wildlife',
    displayName: species.displayName,
    maxHealth: species.vitals.baseMaxHealth,
    healthRegenPerSecond: 0,
    defense: species.vitals.defense,
    attackPower: species.vitals.attackPower,
    attacksPerSecond: 1000 / species.vitals.attackIntervalMs,
    walkSpeedGridPerSecond: species.vitals.walkSpeedGridPerSecond,
    runSpeedGridPerSecond: species.vitals.runSpeedGridPerSecond,
    modifiers,
  };
}

/**
 * Species baseline profile: an average spawn with no per-instance rolls.
 */
export function resolvingWildlifeSpeciesStrengthProfile(
  species: DefiningWildlifeSpeciesDefinition,
  extraModifiers: readonly DefiningWorldPlazaStrengthModifier[] = []
): DefiningWorldPlazaStrengthProfile {
  return buildingWildlifeStrengthProfile(
    species,
    species.speciesId,
    extraModifiers
  );
}

/**
 * Per-instance profile: species baseline plus the spawn's size bell curve,
 * large-size frame, and aggressive-chicken buffs as inspectable modifiers.
 */
export function resolvingWildlifeInstanceStrengthProfile(
  species: DefiningWildlifeSpeciesDefinition,
  instance: ResolvingWildlifeStrengthInstanceProfile,
  extraModifiers: readonly DefiningWorldPlazaStrengthModifier[] = []
): DefiningWorldPlazaStrengthProfile {
  const combatMultiplier = resolvingWildlifeInstanceCombatStatMultiplier(
    species,
    instance
  );
  const speedMultiplier = resolvingWildlifeInstanceSpeedStatMultiplier(
    species,
    instance
  );

  const instanceModifiers: DefiningWorldPlazaStrengthModifier[] = [
    {
      id: 'wildlife-size-survival',
      label: 'Size roll (health)',
      scope: 'survival',
      multiplier: combatMultiplier,
    },
    {
      id: 'wildlife-size-offense',
      label: 'Size roll (damage)',
      scope: 'offense',
      multiplier: combatMultiplier,
    },
    {
      id: 'wildlife-size-mobility',
      label: 'Size roll (speed)',
      scope: 'mobility',
      multiplier: speedMultiplier,
    },
  ];

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    instanceModifiers.push(
      {
        id: 'aggressive-chicken-health',
        label: 'Crazy Chicken (health)',
        scope: 'survival',
        multiplier: DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_HEALTH_MULTIPLIER,
      },
      {
        id: 'aggressive-chicken-attack',
        label: 'Crazy Chicken (damage)',
        scope: 'offense',
        multiplier:
          DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_ATTACK_POWER_MULTIPLIER,
      },
      {
        id: 'aggressive-chicken-speed',
        label: 'Crazy Chicken (speed)',
        scope: 'mobility',
        multiplier: DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPEED_MULTIPLIER,
      }
    );
  }

  return buildingWildlifeStrengthProfile(species, instance.instanceId, [
    ...instanceModifiers,
    ...extraModifiers,
  ]);
}

/** Convenience wrapper: species baseline straight to a scored index. */
export function resolvingWildlifeSpeciesStrengthIndex(
  species: DefiningWildlifeSpeciesDefinition,
  extraModifiers: readonly DefiningWorldPlazaStrengthModifier[] = []
): ComputingWorldPlazaStrengthIndexResult {
  return computingWorldPlazaStrengthIndexScore(
    resolvingWildlifeSpeciesStrengthProfile(species, extraModifiers)
  );
}

/** Convenience wrapper: one live spawn straight to a scored index. */
export function resolvingWildlifeInstanceStrengthIndex(
  species: DefiningWildlifeSpeciesDefinition,
  instance: ResolvingWildlifeStrengthInstanceProfile,
  extraModifiers: readonly DefiningWorldPlazaStrengthModifier[] = []
): ComputingWorldPlazaStrengthIndexResult {
  return computingWorldPlazaStrengthIndexScore(
    resolvingWildlifeInstanceStrengthProfile(species, instance, extraModifiers)
  );
}
