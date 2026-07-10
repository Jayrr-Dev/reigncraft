import { resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription', () => {
  it('returns empty string at tier 0', () => {
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription({
        itemTypeId: 'world-plaza-raw-boar-meat',
        wildlifeSpeciesId: 'boar',
        meatKind: 'raw',
        descriptionTier: 0,
        fallbackName: 'Raw Boar Meat',
      })
    ).toBe('');
  });

  it('uses first sentence only at tier 1', () => {
    const description = resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription({
      itemTypeId: 'world-plaza-raw-boar-meat',
      wildlifeSpeciesId: 'boar',
      meatKind: 'raw',
      descriptionTier: 1,
      fallbackName: 'Raw Boar Meat',
    });

    expect(description).toBe('Thick slabs from a tusked boar.');
    expect(description.toLowerCase()).not.toContain('trichinellosis');
  });

  it('adds a cautious risk hint at tier 2 without disease names', () => {
    const description = resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription({
      itemTypeId: 'world-plaza-raw-boar-meat',
      wildlifeSpeciesId: 'boar',
      meatKind: 'raw',
      descriptionTier: 2,
      fallbackName: 'Raw Boar Meat',
    });

    expect(description).toBe(
      'Thick slabs from a tusked boar. Eating it raw is risky.'
    );
    expect(description.toLowerCase()).not.toContain('trichinellosis');
  });

  it('returns full authored copy at tier 3', () => {
    const description = resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription({
      itemTypeId: 'world-plaza-raw-boar-meat',
      wildlifeSpeciesId: 'boar',
      meatKind: 'raw',
      descriptionTier: 3,
      fallbackName: 'Raw Boar Meat',
    });

    expect(description.toLowerCase()).toContain('trichinellosis');
    expect(description.startsWith('Thick slabs from a tusked boar.')).toBe(
      true
    );
  });

  it('uses cooked cautious wording at tier 2', () => {
    const description = resolvingWorldPlazaInventoryWildlifeMeatFlavorDescription({
      itemTypeId: 'world-plaza-cooked-boar-meat',
      wildlifeSpeciesId: 'boar',
      meatKind: 'cooked',
      descriptionTier: 2,
      fallbackName: 'Cooked Boar Meat',
    });

    expect(description).toContain('Cooking made it safer to eat.');
  });
});
