import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId } from '@/components/world/domains/resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { ensuringWorldPlazaInventoryHudModeTools } from '@/components/world/inventory/domains/ensuringWorldPlazaInventoryHudModeTools';
import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { addingWorldPlazaInventoryItem } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';

describe('resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId', () => {
  it('maps craft / build / claim tools to modes', () => {
    expect(
      resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL
      )
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT);
    expect(
      resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL
      )
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD);
    expect(
      resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL
      )
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM);
  });

  it('falls back to items for empty or other tools', () => {
    expect(
      resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId(null)
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS);
    expect(
      resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId(
        'world-plaza-axe'
      )
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS);
  });
});

describe('ensuringWorldPlazaInventoryHudModeTools', () => {
  it('adds missing craft / build / claim tools', () => {
    const empty = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    const ensured = ensuringWorldPlazaInventoryHudModeTools(empty);
    const typeIds = ensured.slots
      .filter((slot): slot is NonNullable<typeof slot> => slot !== null)
      .map((slot) => slot.itemTypeId);

    expect(typeIds).toContain(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL);
    expect(typeIds).toContain(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL);
    expect(typeIds).toContain(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL);
  });

  it('does not duplicate tools already present', () => {
    let state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    state = addingWorldPlazaInventoryItem(state, {
      id: 'craft-1',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
      quantity: 1,
    });
    state = addingWorldPlazaInventoryItem(state, {
      id: 'build-1',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      quantity: 1,
    });
    state = addingWorldPlazaInventoryItem(state, {
      id: 'claim-1',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
      quantity: 1,
    });

    const ensured = ensuringWorldPlazaInventoryHudModeTools(state);
    const craftCount = ensured.slots.filter(
      (slot) =>
        slot?.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL
    ).length;

    expect(craftCount).toBe(1);
    expect(ensured).toBe(state);
  });
});
