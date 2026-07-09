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

    expect(reveal.showDescription).toBe(false);
    expect(reveal.showHungerRestore).toBe(false);
    expect(reveal.showDiseaseName).toBe(false);
    expect(reveal.showDiseaseChance).toBe(false);
  });

  it('shows description only after 1 study', () => {
    const reveal = resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(1);

    expect(reveal.showDescription).toBe(true);
    expect(reveal.showHungerRestore).toBe(false);
    expect(reveal.showDiseaseName).toBe(false);
  });

  it('shows hunger at combat tier and disease names at ecology', () => {
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(10).showHungerRestore
    ).toBe(true);
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(100).showDiseaseName
    ).toBe(true);
    expect(
      resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(100).showDiseaseChance
    ).toBe(false);
  });

  it('shows exact chances at full dossier', () => {
    const reveal = resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(200);

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

  it('shows description without disease after one study', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 1 },
      }
    );

    expect(model?.description.length).toBeGreaterThan(0);
    expect(model?.infoRows.some((row) => row.id === 'raw-disease')).toBe(
      false
    );
    expect(model?.infoRows.some((row) => row.id === 'hunger-restore')).toBe(
      false
    );
  });

  it('shows hunger restore at 10 studies', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 10 },
      }
    );

    expect(
      model?.infoRows.find((row) => row.id === 'hunger-restore')?.value
    ).toBe('28%');
    expect(model?.infoRows.some((row) => row.id === 'raw-disease')).toBe(
      false
    );
  });

  it('shows disease name without chance at 100 studies', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 100 },
      }
    );

    expect(model?.infoRows.find((row) => row.id === 'raw-disease')?.value).toBe(
      'Trichinellosis'
    );
  });

  it('shows exact disease chance and well-fed buff at 200 studies', () => {
    const rawModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      RAW_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 200 },
      }
    );
    const cookedModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      COOKED_BOAR_MEAT_ITEM,
      {
        isEquipped: false,
        studyCountsBySpeciesId: { boar: 200 },
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
