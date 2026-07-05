/**
 * Applies character engine immunities to entity health state at spawn.
 *
 * @module components/world/character/domains/applyingWorldPlazaCharacterEngineImmunities
 */

import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
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
 * Applies temperature and damage-kind immunities from a character definition.
 */
export function applyingWorldPlazaCharacterEngineImmunities(
  state: DefiningWorldPlazaEntityHealthState,
  definition: DefiningWorldPlazaCharacterEngineDefinition
): DefiningWorldPlazaEntityHealthState {
  let nextState = state;

  if (
    definition.immunities.includes('heat') ||
    definition.immunities.includes('lava')
  ) {
    nextState = settingWorldPlazaEntityTemperatureResistance(nextState, {
      isHeatImmune: true,
    });
  }

  if (definition.immunities.includes('cold')) {
    nextState = settingWorldPlazaEntityTemperatureResistance(nextState, {
      isColdImmune: true,
    });
  }

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
