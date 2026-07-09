import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventorySlotDoubleActivationAction } from '@/components/world/inventory/domains/resolvingWorldPlazaInventorySlotDoubleActivationAction';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventorySlotDoubleActivationAction', () => {
  it('opens bag storage for bag items', () => {
    expect(
      resolvingWorldPlazaInventorySlotDoubleActivationAction(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL
      )
    ).toBe('toggle-bag');
  });

  it('eats food items', () => {
    expect(
      resolvingWorldPlazaInventorySlotDoubleActivationAction(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE
      )
    ).toBe('eat');
  });

  it('opens detail for equipment (always equipped via reserved slot)', () => {
    expect(
      resolvingWorldPlazaInventorySlotDoubleActivationAction(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
        { isEquipped: false }
      )
    ).toBe('open-detail');
  });

  it('opens detail for already-equipped equipment', () => {
    expect(
      resolvingWorldPlazaInventorySlotDoubleActivationAction(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
        { isEquipped: true }
      )
    ).toBe('open-detail');
  });

  it('opens detail for items without a primary use', () => {
    expect(
      resolvingWorldPlazaInventorySlotDoubleActivationAction(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe('open-detail');
  });
});
