import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS,
  DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_SOURCE_CONFIG,
} from '@/components/world/crafting/domains/definingWorldPlazaRecipePageLootPoolConstants';
import { resolvingWorldPlazaRecipePageLootDrop } from '@/components/world/crafting/domains/resolvingWorldPlazaRecipePageLootDrop';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaRecipePageLootPoolConstants', () => {
  it('lists 47 leftover recipes with unique ids', () => {
    expect(DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS).toHaveLength(
      47
    );
    expect(
      new Set(DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS).size
    ).toBe(47);
    expect(DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS).toContain(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_CHAOS_DIE
    );
    expect(DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS).not.toContain(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.LEATHER_PLATE_BREASTPLATE
    );
  });
});

describe('resolvingWorldPlazaRecipePageLootDrop', () => {
  it('misses when chance roll fails', () => {
    expect(
      resolvingWorldPlazaRecipePageLootDrop({
        source: 'mining',
        randomUnitInterval: () => 0.99,
      })
    ).toBeNull();
  });

  it('picks a mining-themed page when chance hits', () => {
    const sequence = [0, 0];
    let index = 0;
    const drop = resolvingWorldPlazaRecipePageLootDrop({
      source: 'mining',
      randomUnitInterval: () => sequence[index++] ?? 0,
    });

    expect(drop).not.toBeNull();
    expect(drop?.quantity).toBe(1);
    expect(drop?.itemTypeId.startsWith('world-plaza-recipe-page:')).toBe(true);
    expect(
      DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_SOURCE_CONFIG.mining.chance
    ).toBeGreaterThan(0);
  });

  it('skips excluded recipes and returns null when pool exhausted', () => {
    const excluded = new Set<string>(
      DEFINING_WORLD_PLAZA_RECIPE_PAGE_LOOT_POOL_RECIPE_IDS
    );

    expect(
      resolvingWorldPlazaRecipePageLootDrop({
        source: 'chest',
        excludedRecipeIds: excluded,
        randomUnitInterval: () => 0,
      })
    ).toBeNull();
  });
});
