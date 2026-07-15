import { describe, expect, it } from 'vitest';
import {
  checkingWorldPlazaMushroomCatalogCoversAllSpecies,
  checkingWorldPlazaMushroomDayScheduleMatches,
  checkingWorldPlazaMushroomPhaseWindowMatches,
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG,
  resolvingWorldPlazaMushroomCatalogEntryBySpeciesId,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import { DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { resolvingWildlifeMeatCookRecipeByRawItemTypeId } from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';

describe('definingWorldPlazaMushroomRegistry', () => {
  it('covers all 16 species with unique raw and cooked item ids', () => {
    expect(DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG).toHaveLength(16);
    expect(checkingWorldPlazaMushroomCatalogCoversAllSpecies()).toBe(true);

    const rawIds = new Set(
      DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.map((entry) => entry.rawItemTypeId)
    );
    const cookedIds = new Set(
      DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.map((entry) => entry.cookedItemTypeId)
    );

    expect(rawIds.size).toBe(16);
    expect(cookedIds.size).toBe(16);

    for (const speciesId of DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS) {
      expect(
        resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(speciesId)?.speciesId
      ).toBe(speciesId);
    }
  });

  it('gates day parity and digit endings', () => {
    const parasol = resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(
      'white-parasol'
    )!;
    const vomiter = resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(
      'green-vomiter'
    )!;
    const morel = resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(
      'honeycomb-morel'
    )!;

    expect(checkingWorldPlazaMushroomDayScheduleMatches(parasol, 2)).toBe(true);
    expect(checkingWorldPlazaMushroomDayScheduleMatches(parasol, 3)).toBe(false);
    expect(checkingWorldPlazaMushroomDayScheduleMatches(vomiter, 3)).toBe(true);
    expect(checkingWorldPlazaMushroomDayScheduleMatches(vomiter, 2)).toBe(false);
    expect(checkingWorldPlazaMushroomDayScheduleMatches(morel, 4)).toBe(true);
    expect(checkingWorldPlazaMushroomDayScheduleMatches(morel, 7)).toBe(true);
    expect(checkingWorldPlazaMushroomDayScheduleMatches(morel, 5)).toBe(false);
  });

  it('gates phase windows', () => {
    expect(checkingWorldPlazaMushroomPhaseWindowMatches('any', 0.5)).toBe(true);
    expect(checkingWorldPlazaMushroomPhaseWindowMatches('night', 0.95)).toBe(
      true
    );
    expect(checkingWorldPlazaMushroomPhaseWindowMatches('day', 0.95)).toBe(
      false
    );
  });

  it('registers campfire cook recipes for every raw mushroom', () => {
    for (const entry of DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG) {
      const recipe = resolvingWildlifeMeatCookRecipeByRawItemTypeId(
        entry.rawItemTypeId
      );

      expect(recipe?.cookedItemTypeId).toBe(entry.cookedItemTypeId);
      expect(recipe?.cookDurationMs).toBe(entry.cookDurationMs);
    }
  });
});
