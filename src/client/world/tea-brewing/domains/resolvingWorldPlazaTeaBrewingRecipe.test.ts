import { computingWorldPlazaTeaBrewingRecipeSignature } from '@/components/world/tea-brewing/domains/computingWorldPlazaTeaBrewingRecipeSignature';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaTeaBrewingRecipe } from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingRecipe';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaTeaBrewingRecipe', () => {
  it('is order-independent for the same ingredient multiset', () => {
    const left = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
    ]);
    const right = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);

    expect(left).not.toBeNull();
    expect(right).not.toBeNull();
    expect(left?.recipeSignature).toBe(right?.recipeSignature);
    expect(left?.displayName).toBe(right?.displayName);
    expect(left?.effects).toEqual(right?.effects);
  });

  it('keeps the same name for the same formula version', () => {
    const first = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);
    const second = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);

    expect(first?.displayName).toBe(second?.displayName);
    expect(first?.formulaVersion).toBe(1);
  });

  it('changes signature when formula version changes', () => {
    const v1 = computingWorldPlazaTeaBrewingRecipeSignature(
      [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES],
      1
    );
    const v2 = computingWorldPlazaTeaBrewingRecipeSignature(
      [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES],
      2
    );

    expect(v1).not.toBe(v2);
  });

  it('scales repeated traits superlinearly', () => {
    const single = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);
    const triple = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);

    expect(single?.effects[0]?.potency).toBe(1);
    // 1*3*(1 + 0.25*4) = 3 * 2 = 6
    expect(triple?.effects[0]?.potency).toBe(6);
  });

  it('extends duration when traits are diverse', () => {
    const single = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
    ]);
    const diverse = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
    ]);

    expect(single?.effects[0]?.durationMs).toBe(90_000);
    expect(diverse?.effects.find((effect) => effect.traitId === 'tea-calm')
      ?.durationMs).toBe(Math.round(90_000 * 1.25));
  });

  it('grants a stamina concentration bonus for three coffee contributions', () => {
    const brew = resolvingWorldPlazaTeaBrewingRecipe([
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
    ]);

    // Coffee beans contribute two stamina traits each → 4 contributions.
    expect(brew?.concentrationBonus?.category).toBe('stamina');
    expect(brew?.concentrationBonus?.effect).toMatchObject({
      kind: 'movement_modifier',
      modifierKind: 'stamina_max',
    });
    expect(brew?.displayName.startsWith('Concentrated ')).toBe(true);
  });

  it('keeps negative traits when concentrating foxglove', () => {
    const brew = resolvingWorldPlazaTeaBrewingRecipe([
      'world-plaza-flower-foxglove',
      'world-plaza-flower-foxglove',
    ]);

    const toxin = brew?.effects.find(
      (effect) => effect.traitId === 'foxglove-toxin'
    );

    expect(toxin?.polarity).toBe('negative');
    expect(toxin?.potency).toBeGreaterThan(1);
  });
});
