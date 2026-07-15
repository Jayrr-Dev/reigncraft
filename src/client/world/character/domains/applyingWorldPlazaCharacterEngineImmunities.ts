/**
 * Applies character engine immunities to entity health state at spawn.
 *
 * @module components/world/character/domains/applyingWorldPlazaCharacterEngineImmunities
 */

import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { resolvingWorldPlazaCharacterEngineTemperatureComfortBand } from '@/components/world/character/domains/resolvingWorldPlazaCharacterEngineTemperatureComfortBand';
import {
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_IMMUNITY_DAMAGE_KINDS,
  DEFINING_WORLD_PLAZA_ENTITY_POISON_IMMUNITY_DAMAGE_KINDS,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffImmunityDamageKinds';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { settingWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

const APPLYING_WORLD_PLAZA_CHARACTER_ENGINE_IMMUNITY_DAMAGE_KIND_GROUPS: Readonly<
  Record<string, readonly DefiningWorldPlazaEntityDamageKind[]>
> = {
  poison: DEFINING_WORLD_PLAZA_ENTITY_POISON_IMMUNITY_DAMAGE_KINDS,
  bleed: DEFINING_WORLD_PLAZA_ENTITY_BLEED_IMMUNITY_DAMAGE_KINDS,
  fall: ['fall'],
  lava: ['environmental_lava'],
};

function pushingUniqueDamageKinds(
  kinds: DefiningWorldPlazaEntityDamageKind[],
  nextKinds: readonly DefiningWorldPlazaEntityDamageKind[]
): void {
  for (const kind of nextKinds) {
    if (!kinds.includes(kind)) {
      kinds.push(kind);
    }
  }
}

/**
 * Maps character immunities to damage kinds blocked by the entity.
 * Status immunities expand to their full DoT groups (bleed / poison).
 */
export function listingWorldPlazaCharacterEngineImmunityDamageKinds(
  definition: DefiningWorldPlazaCharacterEngineDefinition
): readonly DefiningWorldPlazaEntityDamageKind[] {
  const kinds: DefiningWorldPlazaEntityDamageKind[] = [];

  for (const immunity of definition.immunities) {
    if (immunity === 'heat') {
      pushingUniqueDamageKinds(kinds, ['environmental_heat']);
    }

    if (immunity === 'cold') {
      pushingUniqueDamageKinds(kinds, ['environmental_cold']);
    }

    const mappedKinds =
      APPLYING_WORLD_PLAZA_CHARACTER_ENGINE_IMMUNITY_DAMAGE_KIND_GROUPS[
        immunity
      ];

    if (mappedKinds) {
      pushingUniqueDamageKinds(kinds, mappedKinds);
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

  const nextState = settingWorldPlazaEntityTemperatureResistance(state, {
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
