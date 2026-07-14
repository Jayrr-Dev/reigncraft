import { DEFINING_PLAZA_HERBARIUM_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaHerbariumStudyTier';
import { resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryItemDetailPopoverModel rarity metadata', () => {
  it('includes rarity badge and created-by row when metadata is set', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'axe-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
        quantity: 1,
        slotIndex: 0,
        metadata: { createdBy: 'Forgehand Mira' },
      },
      { isEquipped: false }
    );

    expect(model).not.toBeNull();
    expect(model?.badges.some((badge) => badge.id === 'rarity')).toBe(true);
    expect(model?.badges.find((badge) => badge.id === 'rarity')?.label).toBe(
      'Common'
    );
    expect(model?.infoRows.find((row) => row.id === 'created-by')?.value).toBe(
      'Forgehand Mira'
    );
    expect(model?.infoRows.some((row) => row.id === 'rarity')).toBe(false);
  });
});

describe('resolvingWorldPlazaInventoryItemDetailPopoverModel flower Study', () => {
  const calendulaItemTypeId =
    resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId('calendula');

  it('offers Study while herbarium progress is incomplete', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 3,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: { calendula: 24 },
      }
    );

    expect(model?.canStudy).toBe(true);
  });

  it('hides Study once the flower is fully studied', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 3,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: {
          calendula: DEFINING_PLAZA_HERBARIUM_STUDY_FULL_COUNT,
        },
      }
    );

    expect(model?.canStudy).toBe(false);
  });

  it('hides eat details until studied, then unlocks by tier', () => {
    const unstudied = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: { calendula: 0 },
      }
    );

    expect(unstudied?.description).toBe('');
    expect(
      unstudied?.infoRows.some((row) => row.id === 'herbarium-study')
    ).toBe(true);
    expect(
      unstudied?.infoRows.some((row) => row.id === 'flower-when-eaten')
    ).toBe(false);

    const fieldNotes = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: { calendula: 1 },
      }
    );

    expect(fieldNotes?.description.length).toBeGreaterThan(0);
    expect(
      fieldNotes?.infoRows.some((row) => row.id === 'flower-when-eaten')
    ).toBe(false);

    const properties = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: { calendula: 5 },
      }
    );

    expect(
      properties?.infoRows.some((row) => row.id === 'flower-when-eaten')
    ).toBe(true);
    expect(
      properties?.infoRows.some((row) => row.id === 'petal-sickness')
    ).toBe(false);

    const habitats = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: { calendula: 15 },
      }
    );

    expect(habitats?.infoRows.some((row) => row.id === 'petal-sickness')).toBe(
      true
    );
    expect(habitats?.infoRows.some((row) => row.id === 'flower-diseases')).toBe(
      true
    );
    expect(
      habitats?.infoRows.find((row) => row.id === 'petal-sickness')?.value
    ).not.toContain('3%');

    const full = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: {
          calendula: DEFINING_PLAZA_HERBARIUM_STUDY_FULL_COUNT,
        },
      }
    );

    expect(full?.infoRows.some((row) => row.id === 'flower-raw-proc')).toBe(
      true
    );
    expect(
      full?.infoRows.find((row) => row.id === 'petal-sickness')?.value
    ).toContain('3%');
    expect(
      full?.infoRows.find((row) => row.id === 'flower-diseases')?.value
    ).toMatch(/%/);
  });
});
