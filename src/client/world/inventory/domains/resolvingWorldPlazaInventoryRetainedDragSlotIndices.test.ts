import { resolvingWorldPlazaInventoryRetainedDragSlotIndices } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryRetainedDragSlotIndices';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryRetainedDragSlotIndices', () => {
  it('returns nothing when idle or source is already visible', () => {
    expect(
      resolvingWorldPlazaInventoryRetainedDragSlotIndices(0, null)
    ).toEqual([]);
    expect(resolvingWorldPlazaInventoryRetainedDragSlotIndices(0, 2)).toEqual(
      []
    );
    expect(resolvingWorldPlazaInventoryRetainedDragSlotIndices(1, 7)).toEqual(
      []
    );
  });

  it('keeps the off-page drag source mounted when paging away', () => {
    expect(resolvingWorldPlazaInventoryRetainedDragSlotIndices(1, 2)).toEqual([
      2,
    ]);
    expect(resolvingWorldPlazaInventoryRetainedDragSlotIndices(2, 4)).toEqual([
      4,
    ]);
    expect(resolvingWorldPlazaInventoryRetainedDragSlotIndices(0, 11)).toEqual([
      11,
    ]);
  });
});
