import { expandingInventorySlotsByOneColumnPerRow } from '@/components/inventory/domains/expandingInventorySlotsByOneColumnPerRow';
import { describe, expect, it } from 'vitest';

describe('expandingInventorySlotsByOneColumnPerRow', () => {
  it('expands 5×3 saves into 6×3 with a trailing empty cell per row', () => {
    const rawSlots = Array.from({ length: 15 }, (_, index) => ({
      id: `item-${index}`,
    }));

    const remapped = expandingInventorySlotsByOneColumnPerRow(rawSlots, 18);

    expect(remapped).not.toBeNull();
    expect(remapped).toHaveLength(18);
    expect(remapped?.[0]).toEqual({ id: 'item-0' });
    expect(remapped?.[4]).toEqual({ id: 'item-4' });
    expect(remapped?.[5]).toBeNull();
    expect(remapped?.[6]).toEqual({ id: 'item-5' });
    expect(remapped?.[11]).toBeNull();
    expect(remapped?.[12]).toEqual({ id: 'item-10' });
    expect(remapped?.[17]).toBeNull();
  });

  it('returns null when capacity already matches or pattern does not fit', () => {
    expect(expandingInventorySlotsByOneColumnPerRow([], 18)).toBeNull();
    expect(
      expandingInventorySlotsByOneColumnPerRow(Array.from({ length: 18 }), 18)
    ).toBeNull();
    expect(
      expandingInventorySlotsByOneColumnPerRow(Array.from({ length: 15 }), 17)
    ).toBeNull();
  });
});
