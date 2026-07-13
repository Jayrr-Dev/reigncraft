/**
 * Applies character engine immunities to entity health state at spawn.
 *
 * @module components/world/character/domains/applyingWorldPlazaCharacterEngineImmunities
 */

import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { resolvingWorldPlazaCharacterEngineTemperatureComfortBand } from '@/components/world/character/domains/resolvingWorldPlazaCharacterEngineTemperatureComfortBand';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { settingWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

const APPLYING_WORLD_PLAZA_CHARACTER_ENGINE_IMMUNITY_DAMAGE_KINDS: Record<
  string,
  DefiningWorldPlazaEntityDamageKind
> = {
  poison: 'toxic',
  bleed: 'bleeding',
  fall: 'fall',
  lava: 'environmental_lava',
};

/**
 * Maps character immunities to damage kinds blocked by the entity.
 */
export function listingWorldPlazaCharacterEngineImmunityDamageKinds(
  definition: DefiningWorldPlazaCharacterEngineDefinition
): readonly DefiningWorldPlazaEntityDamageKind[] {
  const kinds: DefiningWorldPlazaEntityDamageKind[] = [];

  for (const immunity of definition.immunities) {
    if (immunity === 'heat') {
      kinds.push('environmental_heat');
    }

    if (immunity === 'cold') {
      kinds.push('environmental_cold');
    }

    const mappedKind =
      APPLYING_WORLD_PLAZA_CHARACTER_ENGINE_IMMUNITY_DAMAGE_KINDS[immunity];

    if (mappedKind) {
      kinds.push(mappedKind);
    }
  }

  return kinds;
}

/**
 * Applies temperature comfort, immunities, and damage-kind blocks from a character definition.
 */
export function applyingWorldPlazaCharacterEngineImmunities(
  state: DefiningWorldPlazaEntityHealthState,
  definition: DefiningWorldPlazaCharacterEngineDefinition
): DefiningWorldPlazaEntityHealthState {
  const comfortBand =
    resolvingWorldPlazaCharacterEngineTemperatureComfortBand(definition);

  let nextState = settingWorldPlazaEntityTemperatureResistance(state, {
    baseComfortLowCelsius: comfortBand.comfortLowCelsius,
    baseComfortHighCelsius: comfortBand.comfortHighCelsius,
    isHeatImmune:
      definition.immunities.includes('heat') ||
      definition.immunities.includes('lava')
        ? true
        : state.temperatureResistance.isHeatImmune,
    isColdImmune: definition.immunities.includes('cold')
      ? true
      : state.temperatureResistance.isColdImmune,
  });

  const damageKindImmunities =
    listingWorldPlazaCharacterEngineImmunityDamageKinds(definition);

  if (damageKindImmunities.length === 0) {
    return nextState;
  }

  return {
    ...nextState,
    damageKindImmunities,
  };
}
