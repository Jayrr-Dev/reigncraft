import {
  formattingWorldPlazaInventoryItemPickupToastMessage,
  resolvingWorldPlazaInventoryItemPickupDisplayName,
} from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemPickupToastMessage';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaInventoryItemPickupToastMessage', () => {
  it('formats a single-unit pickup without a quantity suffix', () => {
    expect(
      formattingWorldPlazaInventoryItemPickupToastMessage({
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 1,
      })
    ).toBe('Picked up Wood.');
  });

  it('formats multi-unit pickups with a quantity suffix', () => {
    expect(
      formattingWorldPlazaInventoryItemPickupToastMessage({
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 3,
      })
    ).toBe('Picked up Wood ×3.');
  });

  it('falls back to the item type id when the registry has no name', () => {
    expect(
      resolvingWorldPlazaInventoryItemPickupDisplayName('unknown-item-type')
    ).toBe('unknown-item-type');
  });
});
