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
    expect(
      model?.infoRows.find((row) => row.id === 'created-by')?.value
    ).toBe('Forgehand Mira');
    expect(model?.infoRows.find((row) => row.id === 'rarity')?.value).toBe(
      'Common'
    );
  });
});
