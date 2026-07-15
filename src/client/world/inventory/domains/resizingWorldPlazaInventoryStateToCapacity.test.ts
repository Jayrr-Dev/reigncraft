import { resizingWorldPlazaInventoryStateToCapacity } from '@/components/world/inventory/domains/resizingWorldPlazaInventoryStateToCapacity';
import { describe, expect, it } from 'vitest';

describe('resizingWorldPlazaInventoryStateToCapacity', () => {
  it('pads empty slots when capacity grows', () => {
    const next = resizingWorldPlazaInventoryStateToCapacity(
      {
        capacity: 24,
        slots: Array.from({ length: 24 }, () => null),
      },
      30
    );

    expect(next.capacity).toBe(30);
    expect(next.slots).toHaveLength(30);
  });

  it('keeps occupied trailing slots when shrinking would drop items', () => {
    const next = resizingWorldPlazaInventoryStateToCapacity(
      {
        capacity: 30,
        slots: [
          ...Array.from({ length: 29 }, () => null),
          {
            id: 'item-1',
            itemTypeId: 'world-plaza-wood',
            quantity: 1,
            slotIndex: 29,
          },
        ],
      },
      24
    );

    expect(next.capacity).toBe(30);
    expect(next.slots[29]?.id).toBe('item-1');
  });
});
