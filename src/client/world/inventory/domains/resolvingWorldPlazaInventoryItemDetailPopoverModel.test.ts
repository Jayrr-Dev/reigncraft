import { DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaHerbariumBerryStudyTier';
import { DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaHerbariumCloverStudyTier';
import { DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';
import { DEFINING_PLAZA_LAPIDARY_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaLapidaryStudyTier';
import { resolvingWorldPlazaCloverItemTypeIdFromLootKind } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverSpriteSheetConstants';
import { resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaOreItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
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
    expect(model?.canEquip).toBe(true);
  });

  it('hides Equip when the weapon/tool is already in the reserved slot', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'axe-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
        quantity: 1,
        slotIndex: 0,
      },
      { isEquipped: true }
    );

    expect(model?.canEquip).toBe(false);
  });

  it('hides Equip for non-equipment items', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'berry-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
        quantity: 1,
        slotIndex: 2,
      },
      { isEquipped: false }
    );

    expect(model?.canEquip).toBe(false);
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
          calendula: DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT,
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

    const familiarity = resolvingWorldPlazaInventoryItemDetailPopoverModel(
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

    expect(familiarity?.description.length).toBeGreaterThan(0);
    expect(
      familiarity?.infoRows.some((row) => row.id === 'flower-when-eaten')
    ).toBe(false);

    const application = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: { calendula: 20 },
      }
    );

    expect(
      application?.infoRows.some((row) => row.id === 'flower-when-eaten')
    ).toBe(true);
    expect(
      application?.infoRows.some((row) => row.id === 'petal-sickness')
    ).toBe(false);

    const proficiency = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'calendula-1',
        itemTypeId: calendulaItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        flowerStudyCountsBySpeciesId: { calendula: 50 },
      }
    );

    expect(
      proficiency?.infoRows.some((row) => row.id === 'petal-sickness')
    ).toBe(true);
    expect(
      proficiency?.infoRows.some((row) => row.id === 'flower-diseases')
    ).toBe(true);
    expect(
      proficiency?.infoRows.find((row) => row.id === 'petal-sickness')?.value
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
          calendula: DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT,
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

describe('resolvingWorldPlazaInventoryItemDetailPopoverModel ore Study', () => {
  const ironItemTypeId = resolvingWorldPlazaOreItemTypeIdFromSpeciesId('iron');

  it('hides vein details until studied, then unlocks by tier', () => {
    const unstudied = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'iron-1',
        itemTypeId: ironItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        oreStudyCountsBySpeciesId: { iron: 0 },
      }
    );

    expect(unstudied?.description).toBe('');
    expect(unstudied?.infoRows.some((row) => row.id === 'lapidary-study')).toBe(
      true
    );
    expect(
      unstudied?.infoRows.some((row) => row.id === 'ore-when-worked')
    ).toBe(false);

    const familiarity = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'iron-1',
        itemTypeId: ironItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        oreStudyCountsBySpeciesId: { iron: 1 },
      }
    );

    expect(familiarity?.description.length).toBeGreaterThan(0);
    expect(
      familiarity?.infoRows.some((row) => row.id === 'ore-when-worked')
    ).toBe(false);

    const application = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'iron-1',
        itemTypeId: ironItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        oreStudyCountsBySpeciesId: { iron: 20 },
      }
    );

    expect(
      application?.infoRows.some((row) => row.id === 'ore-when-worked')
    ).toBe(true);
    expect(application?.infoRows.some((row) => row.id === 'ore-habitat')).toBe(
      false
    );

    const proficiency = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'iron-1',
        itemTypeId: ironItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        oreStudyCountsBySpeciesId: { iron: 50 },
      }
    );

    expect(proficiency?.infoRows.some((row) => row.id === 'ore-habitat')).toBe(
      true
    );
    expect(
      proficiency?.infoRows.some((row) => row.id.startsWith('ore-vein-label-'))
    ).toBe(true);
    expect(
      proficiency?.infoRows.some((row) =>
        row.value.includes('ladder reference')
      )
    ).toBe(false);

    const full = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'iron-1',
        itemTypeId: ironItemTypeId,
        quantity: 5,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        oreStudyCountsBySpeciesId: {
          iron: DEFINING_PLAZA_LAPIDARY_STUDY_FULL_COUNT,
        },
      }
    );

    expect(full?.canStudy).toBe(false);
    expect(
      full?.infoRows.some((row) => row.value.includes('ladder reference'))
    ).toBe(true);
  });
});

describe('resolvingWorldPlazaInventoryItemDetailPopoverModel clover Study', () => {
  const threeLeafItemTypeId =
    resolvingWorldPlazaCloverItemTypeIdFromLootKind('three_leaf');
  const fourLeafItemTypeId =
    resolvingWorldPlazaCloverItemTypeIdFromLootKind('four_leaf');

  it('offers Study while combined clover progress is incomplete', () => {
    const threeLeaf = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'clover-3-1',
        itemTypeId: threeLeafItemTypeId,
        quantity: 9,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        cloverStudyCount: 24,
      }
    );
    const fourLeaf = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'clover-4-1',
        itemTypeId: fourLeafItemTypeId,
        quantity: 1,
        slotIndex: 1,
      },
      {
        isEquipped: false,
        cloverStudyCount: 24,
      }
    );

    expect(threeLeaf?.canStudy).toBe(true);
    expect(fourLeaf?.canStudy).toBe(true);
  });

  it('hides Study once the shared clover track is fully studied', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'clover-3-1',
        itemTypeId: threeLeafItemTypeId,
        quantity: 9,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        cloverStudyCount: DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT,
      }
    );

    expect(model?.canStudy).toBe(false);
  });
});

describe('resolvingWorldPlazaInventoryItemDetailPopoverModel berry Study', () => {
  const coffeeCherryItemTypeId =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED;

  it('offers Study while berry progress is incomplete', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'coffee-cherry-1',
        itemTypeId: coffeeCherryItemTypeId,
        quantity: 4,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        berryStudyCountsByLootKind: { red_berry: 1 },
      }
    );

    expect(model?.canStudy).toBe(true);
  });

  it('hides Study once the berry dossier is full', () => {
    const model = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'coffee-cherry-1',
        itemTypeId: coffeeCherryItemTypeId,
        quantity: 4,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        berryStudyCountsByLootKind: {
          red_berry: DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT,
        },
      }
    );

    expect(model?.canStudy).toBe(false);
  });

  it('hides hunger and heal until proficiency, then unlocks by tier', () => {
    const unstudied = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'coffee-cherry-1',
        itemTypeId: coffeeCherryItemTypeId,
        quantity: 4,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        berryStudyCountsByLootKind: { red_berry: 0 },
      }
    );

    expect(unstudied?.description).toBe('');
    expect(
      unstudied?.infoRows.some((row) => row.id === 'herbarium-study')
    ).toBe(true);
    expect(unstudied?.badges.some((badge) => badge.id === 'food')).toBe(false);
    expect(unstudied?.badges.some((badge) => badge.id === 'food-heal')).toBe(
      false
    );

    const familiarity = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'coffee-cherry-1',
        itemTypeId: coffeeCherryItemTypeId,
        quantity: 4,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        berryStudyCountsByLootKind: { red_berry: 1 },
      }
    );

    expect(familiarity?.description.length).toBeGreaterThan(0);
    expect(familiarity?.badges.some((badge) => badge.id === 'food')).toBe(
      false
    );

    const application = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'coffee-cherry-1',
        itemTypeId: coffeeCherryItemTypeId,
        quantity: 4,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        berryStudyCountsByLootKind: { red_berry: 20 },
      }
    );

    expect(
      application?.infoRows.some((row) => row.id === 'berry-when-eaten')
    ).toBe(true);
    expect(application?.badges.some((badge) => badge.id === 'food')).toBe(
      false
    );

    const proficiency = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'coffee-cherry-1',
        itemTypeId: coffeeCherryItemTypeId,
        quantity: 4,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        berryStudyCountsByLootKind: { red_berry: 50 },
        playerEffectiveMaxHealth: 100,
      }
    );

    expect(proficiency?.badges.some((badge) => badge.id === 'food')).toBe(true);
    expect(proficiency?.badges.some((badge) => badge.id === 'food-heal')).toBe(
      true
    );
    expect(
      proficiency?.infoRows.some((row) => row.id === 'berry-well-fed')
    ).toBe(true);
    expect(
      proficiency?.infoRows.find((row) => row.id === 'berry-well-fed')?.value
    ).not.toMatch(/%/);

    const full = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'coffee-cherry-1',
        itemTypeId: coffeeCherryItemTypeId,
        quantity: 4,
        slotIndex: 0,
      },
      {
        isEquipped: false,
        berryStudyCountsByLootKind: {
          red_berry: DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT,
        },
        playerEffectiveMaxHealth: 100,
      }
    );

    expect(
      full?.infoRows.find((row) => row.id === 'berry-well-fed')?.value
    ).toMatch(/%/);
  });
});

describe('resolvingWorldPlazaInventoryItemDetailPopoverModel ore smelting actions', () => {
  const ironOreItemTypeId = resolvingWorldPlazaOreItemTypeIdFromSpeciesId('iron');

  it('hides Refine and Add Fuel when no smelting station is reachable', () => {
    const oreModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'ore-1',
        itemTypeId: ironOreItemTypeId,
        quantity: 3,
        slotIndex: 0,
      },
      { isEquipped: false, isOreSmeltingStationReachable: false }
    );
    const woodModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'wood-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 5,
        slotIndex: 1,
      },
      { isEquipped: false, isOreSmeltingStationReachable: false }
    );

    expect(oreModel?.canRefine).toBe(false);
    expect(oreModel?.canAddFuel).toBe(false);
    expect(woodModel?.canRefine).toBe(false);
    expect(woodModel?.canAddFuel).toBe(false);
  });

  it('shows Refine on smeltable ore and Add Fuel on wood when reachable', () => {
    const oreModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'ore-1',
        itemTypeId: ironOreItemTypeId,
        quantity: 3,
        slotIndex: 0,
      },
      { isEquipped: false, isOreSmeltingStationReachable: true }
    );
    const woodModel = resolvingWorldPlazaInventoryItemDetailPopoverModel(
      {
        id: 'wood-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 5,
        slotIndex: 1,
      },
      { isEquipped: false, isOreSmeltingStationReachable: true }
    );

    expect(oreModel?.canRefine).toBe(true);
    expect(oreModel?.canAddFuel).toBe(false);
    expect(woodModel?.canRefine).toBe(false);
    expect(woodModel?.canAddFuel).toBe(true);
  });
});
