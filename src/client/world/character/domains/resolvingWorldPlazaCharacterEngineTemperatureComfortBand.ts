/**
 * Resolves innate comfort low/high for a character engine definition.
 *
 * Prefers the definition's `temperatureComfort`, then a matching wildlife
 * species registry row (playable animal skins), then the global human default.
 *
 * @module components/world/character/domains/resolvingWorldPlazaCharacterEngineTemperatureComfortBand
 */

import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { DEFINING_WILDLIFE_SPECIES_TEMPERATURE_COMFORT_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesTemperatureComfortRegistry';

/**
 * Innate comfort band for one character definition (before tolerance buffs).
 */
export function resolvingWorldPlazaCharacterEngineTemperatureComfortBand(
  definition: DefiningWorldPlazaCharacterEngineDefinition
): DefiningWorldPlazaEntityTemperatureComfortBand {
  if (definition.temperatureComfort) {
    return {
      comfortLowCelsius: definition.temperatureComfort.comfortLowCelsius,
      comfortHighCelsius: definition.temperatureComfort.comfortHighCelsius,
    };
  }

  const wildlifeBand =
    DEFINING_WILDLIFE_SPECIES_TEMPERATURE_COMFORT_REGISTRY[
      definition.characterId
    ] ??
    DEFINING_WILDLIFE_SPECIES_TEMPERATURE_COMFORT_REGISTRY[
      definition.presentation.skinId
    ];

  if (wildlifeBand) {
    return wildlifeBand;
  }

  return {
    comfortLowCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
    comfortHighCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  };
}
