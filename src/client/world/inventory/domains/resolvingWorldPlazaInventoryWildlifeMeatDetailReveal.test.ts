import { resolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import { resolvingWorldPlazaInventoryWildlifeMeatDetailReveal } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryWildlifeMeatDetailReveal';
import { describe, expect, it } from 'vitest';

const RAW_BOAR_MEAT_ITEM = {
  id: 'boar-meat-1',
  itemTypeId: 'world-plaza-raw-boar-meat',
  quantity: 1,
  slotIndex: 1,
} as const;

const COOKED_BOAR_MEAT_ITEM = {
  id: 'boar-meat-cooked-1',
  itemTypeId: 'world-plaza-cooked-boar-meat',
  quantity: 1,
  slotIndex: 1,
} as const;

describe('resolvingWorldPlazaInventoryWildlifeMeatDetailReveal', () => {
  it('hides everything at 0 studies', () => {
    const reveal = resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(0);

    expect(reveal.descriptionTier).toBe(0);
    expect(reveal.showHungerRestore).toBe(false);
    expect(reveal.showDiseaseName).toBe(false);
    expect(reveal.showDiseaseChance).toBe(false);
  });

  it('unlocks flavor tiers across study thresholds', () => {
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(1).descriptionTier
    ).toBe(1);
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(5).descriptionTier
    ).toBe(2);
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(20).descriptionTier
    ).toBe(3);
  });

  it('shows hunger at application and disease names at proficiency', () => {
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(20).showHungerRestore
    ).toBe(true);
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(50).showDiseaseName
    ).toBe(true);
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(50).showDiseaseChance
    ).toBe(false);
  });

  it('shows exact chances at mastery', () => {
    const reveal = resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(100);

    expect(reveal.showDiseaseChance).toBe(true);
    expect(reveal.showWellFedChance).toBe(true);
    expect(reveal.showResidualDisease).toBe(true);
  });
});

describe('resolvingWorldPlazaInventoryItemDetailPopoverModel wildlife meat', () => {
  it('shows title only for unstudied wildlife meat', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 0 },
      }
    );

    expect(model?.name).toBe('Raw Boar Meat');
    expect(model?.description).toBe('');
    expect(model?.badges).toEqual([]);
    expect(model?.infoRows).toEqual([]);
  });

  it('shows vague flavor without disease after one study', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 1 },
      }
    );

    expect(model?.description).toBe('Thick slabs from a tusked boar.');
    expect(model?.description.toLowerCase()).not.toContain('trichinellosis');
    expect(model?.infoRows.some((row) => row.id === 'raw-disease')).toBe(false);
    expect(model?.infoRows.some((row) => row.id === 'hunger-restore')).toBe(
      false
    );
  });

  it('shows cautious flavor at understanding (5)', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 5 },
      }
    );

    expect(model?.description).toBe(
      'Thick slabs from a tusked boar. Eating it raw is risky.'
    );
    expect(model?.infoRows.some((row) => row.id === 'hunger-restore')).toBe(
      false
    );
    expect(model?.infoRows.some((row) => row.id === 'raw-disease')).toBe(false);
  });

  it('shows full flavor and hunger at application (20)', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 20 },
        playerEffectiveMaxHealth: 1400,
      }
    );

    expect(model?.description.toLowerCase()).toContain('trichinellosis');
    expect(
      model?.infoRows.find((row) => row.id === 'hunger-restore')?.value
    ).toBe('28%');
    expect(
      model?.infoRows.find((row) => row.id === 'health-restore')?.value
    ).toMatch(/^\d+ HP \(raw, half\)$/);
    expect(model?.badges.some((badge) => badge.id === 'food-heal')).toBe(true);
    expect(model?.infoRows.some((row) => row.id === 'raw-disease')).toBe(false);
  });

  it('shows disease name without chance at proficiency (50)', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 50 },
      }
    );

    expect(model?.infoRows.find((row) => row.id === 'raw-disease')?.value).toBe(
      'Trichinellosis'
    );
  });

  it('shows exact disease chance and well-fed buff at mastery (100)', () => {
    const rawModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 100 },
      }
    );
    const cookedModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      COOKED_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 100 },
      }
    );

    expect(
      rawModel?.infoRows.find((row) => row.id === 'raw-disease')?.value
    ).toBe('Trichinellosis (40%)');
    expect(
      cookedModel?.infoRows.find((row) => row.id === 'cooked-well-fed')?.value
    ).toBe('Toughened (38%)');
  });
});
