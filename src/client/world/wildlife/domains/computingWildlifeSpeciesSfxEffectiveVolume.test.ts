import {
  computingWildlifeSpeciesSfxDistanceAttenuation,
  computingWildlifeSpeciesSfxEffectiveVolume,
} from '@/components/world/wildlife/domains/computingWildlifeSpeciesSfxEffectiveVolume';
import {
  DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_FARM_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_MAX_AUDIBLE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import { describe, expect, it } from 'vitest';

describe('computingWildlifeSpeciesSfxDistanceAttenuation', () => {
  const listenerPoint = { x: 0, y: 0 };

  it('returns 0 when listener position is unknown', () => {
    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        null,
        { x: 0, y: 0 },
        'idle_ambient',
        'farm'
      )
    ).toBe(0);
  });

  it('uses a short radius for ambient idle vocals', () => {
    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        listenerPoint,
        { x: 0, y: 0 },
        'idle_ambient',
        'megafauna'
      )
    ).toBe(1);

    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        listenerPoint,
        {
          x: DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_MAX_AUDIBLE_DISTANCE_GRID,
          y: 0,
        },
        'idle_ambient',
        'megafauna'
      )
    ).toBe(0);
  });

  it('carries loud predator vocals farther than ambient idle', () => {
    const midFarmDistance =
      DEFINING_WILDLIFE_SPECIES_SFX_FARM_MAX_AUDIBLE_DISTANCE_GRID - 2;

    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        listenerPoint,
        { x: midFarmDistance, y: 0 },
        'idle_ambient',
        'farm'
      )
    ).toBe(0);

    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        listenerPoint,
        { x: midFarmDistance, y: 0 },
        'warn',
        'predator'
      )
    ).toBeGreaterThan(0);
  });

  it('extends predator howls beyond farm ambient range', () => {
    const beyondFarmButInsidePredator =
      DEFINING_WILDLIFE_SPECIES_SFX_FARM_MAX_AUDIBLE_DISTANCE_GRID + 1;

    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        listenerPoint,
        { x: beyondFarmButInsidePredator, y: 0 },
        'howl',
        'predator'
      )
    ).toBeGreaterThan(0);

    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        listenerPoint,
        {
          x: DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
          y: 0,
        },
        'howl',
        'predator'
      )
    ).toBe(0);
  });

  it('cuts tiger combat vocals before the old predator max range', () => {
    const beyondCombatButInsideOldPredatorRange =
      DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_MAX_AUDIBLE_DISTANCE_GRID + 4;

    expect(
      computingWildlifeSpeciesSfxDistanceAttenuation(
        listenerPoint,
        { x: beyondCombatButInsideOldPredatorRange, y: 0 },
        'warn',
        'predator'
      )
    ).toBe(0);
  });

  it('trims hot pools such as tiger and boar', () => {
    const tigerVolume = computingWildlifeSpeciesSfxEffectiveVolume(
      'tiger',
      'warn',
      listenerPoint,
      listenerPoint
    );
    const cowVolume = computingWildlifeSpeciesSfxEffectiveVolume(
      'cow',
      'warn',
      listenerPoint,
      listenerPoint
    );

    expect(tigerVolume).toBeLessThan(cowVolume);
  });
});
