import { creatingWorldPlazaCharacterEngineInitialHealthState } from '@/components/world/character/domains/creatingWorldPlazaCharacterEngineInitialHealthState';
import { resolvingWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import { resolvingWorldPlazaCharacterEngineTemperatureComfortBand } from '@/components/world/character/domains/resolvingWorldPlazaCharacterEngineTemperatureComfortBand';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';
import { listingWildlifeSpeciesIds } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpeciesTemperatureComfortBand } from '@/components/world/wildlife/domains/definingWildlifeSpeciesTemperatureComfortRegistry';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeSpeciesTemperatureComfortBand', () => {
  it('covers every registered wildlife species', () => {
    for (const speciesId of listingWildlifeSpeciesIds()) {
      const band = resolvingWildlifeSpeciesTemperatureComfortBand(speciesId);
      expect(band.comfortHighCelsius).toBeGreaterThan(band.comfortLowCelsius);
    }
  });

  it('keeps arctic species colder than savanna species', () => {
    const polar = resolvingWildlifeSpeciesTemperatureComfortBand('polar-bear');
    const lion = resolvingWildlifeSpeciesTemperatureComfortBand('lion');

    expect(polar.comfortLowCelsius).toBeLessThan(lion.comfortLowCelsius);
    expect(polar.comfortHighCelsius).toBeLessThan(lion.comfortHighCelsius);
  });
});

describe('resolvingWorldPlazaCharacterEngineTemperatureComfortBand', () => {
  it('uses hand-tuned penguin comfort', () => {
    const definition = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.PINGUIN
    );
    const band =
      resolvingWorldPlazaCharacterEngineTemperatureComfortBand(definition);

    expect(band).toEqual({
      comfortLowCelsius: -25,
      comfortHighCelsius: 14,
    });
  });

  it('seeds base comfort onto character health state', () => {
    const definition = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY
    );
    const health =
      creatingWorldPlazaCharacterEngineInitialHealthState(definition);
    const band = resolvingWorldPlazaEntityTemperatureComfortBand(
      health.temperatureResistance
    );

    expect(health.temperatureResistance.baseComfortLowCelsius).toBe(-20);
    expect(health.temperatureResistance.baseComfortHighCelsius).toBe(22);
    expect(band.comfortLowCelsius).toBe(-20);
    expect(band.comfortHighCelsius).toBe(22);
    expect(health.temperatureResistance.isColdImmune).toBe(true);
  });
});
