import {
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG,
  resolvingWorldPlazaMushroomCatalogEntryBySpeciesId,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import {
  checkingWorldPlazaMushroomTimeOfDayMatches,
  DEFINING_WORLD_PLAZA_MUSHROOM_BIOME_SPAWN_DENSITY,
  DEFINING_WORLD_PLAZA_MUSHROOM_RARITY_SPAWN_WEIGHT,
  resolvingWorldPlazaMushroomEffectiveSpawnModulus,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpawnBalanceConstants';
import { pickingWorldPlazaMushroomCatalogEntryByRarityWeight } from '@/components/world/mushrooms/domains/pickingWorldPlazaMushroomCatalogEntryByRarityWeight';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaMushroomSpawnBalanceConstants', () => {
  it('assigns timeOfDay and rarity on every catalog entry', () => {
    for (const entry of DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG) {
      expect(['day', 'night', 'any']).toContain(entry.timeOfDay);
      expect(['common', 'uncommon', 'rare', 'legendary']).toContain(
        entry.rarity
      );
    }
  });

  it('gates day vs night vs any', () => {
    expect(checkingWorldPlazaMushroomTimeOfDayMatches('any', 0.95)).toBe(true);
    expect(checkingWorldPlazaMushroomTimeOfDayMatches('day', 0.5)).toBe(true);
    expect(checkingWorldPlazaMushroomTimeOfDayMatches('day', 0.95)).toBe(false);
    expect(checkingWorldPlazaMushroomTimeOfDayMatches('night', 0.95)).toBe(
      true
    );
    expect(checkingWorldPlazaMushroomTimeOfDayMatches('night', 0.5)).toBe(
      false
    );
  });

  it('makes plains rarer than forest and swamp denser', () => {
    const plainsModulus = resolvingWorldPlazaMushroomEffectiveSpawnModulus(
      100,
      'plains'
    );
    const forestModulus = resolvingWorldPlazaMushroomEffectiveSpawnModulus(
      100,
      'forest'
    );
    const swampModulus = resolvingWorldPlazaMushroomEffectiveSpawnModulus(
      100,
      'swamp'
    );

    expect(plainsModulus).toBeGreaterThan(forestModulus);
    expect(swampModulus).toBeLessThan(forestModulus);
    expect(
      DEFINING_WORLD_PLAZA_MUSHROOM_BIOME_SPAWN_DENSITY.plains
    ).toBeLessThan(1);
    expect(resolvingWorldPlazaMushroomEffectiveSpawnModulus(100, 'ocean')).toBe(
      Number.POSITIVE_INFINITY
    );
  });
});

describe('pickingWorldPlazaMushroomCatalogEntryByRarityWeight', () => {
  it('prefers common over legendary at low rolls', () => {
    const cloudPuff =
      resolvingWorldPlazaMushroomCatalogEntryBySpeciesId('cloud-puff')!;
    const angel =
      resolvingWorldPlazaMushroomCatalogEntryBySpeciesId('angel-button')!;
    // Order: common band is first 12/13 of the unit interval.
    const eligible = [cloudPuff, angel];

    expect(
      pickingWorldPlazaMushroomCatalogEntryByRarityWeight(eligible, 0)
        ?.speciesId
    ).toBe('cloud-puff');
    expect(
      pickingWorldPlazaMushroomCatalogEntryByRarityWeight(eligible, 0.99)
        ?.speciesId
    ).toBe('angel-button');
    expect(
      DEFINING_WORLD_PLAZA_MUSHROOM_RARITY_SPAWN_WEIGHT.common
    ).toBeGreaterThan(
      DEFINING_WORLD_PLAZA_MUSHROOM_RARITY_SPAWN_WEIGHT.legendary
    );
  });
});
