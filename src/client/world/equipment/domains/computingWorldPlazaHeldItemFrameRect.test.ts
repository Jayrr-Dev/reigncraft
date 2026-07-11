import { computingWorldPlazaHeldItemFrameRect } from '@/components/world/equipment/domains/computingWorldPlazaHeldItemFrameRect';
import { resolvingWorldPlazaHeldItemPresentationForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaHeldItemPresentationForItemTypeId';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaHeldItemFrameRect', () => {
  it('maps Right to column 0 wood and row 2', () => {
    const rect = computingWorldPlazaHeldItemFrameRect('Right', 'wood');

    expect(rect.x).toBe(0);
    expect(rect.y).toBe(32);
    expect(rect.width).toBe(16);
    expect(rect.height).toBe(16);
  });

  it('maps UpLeft to row 7 and gold column 3', () => {
    const rect = computingWorldPlazaHeldItemFrameRect('UpLeft', 'gold');

    expect(rect.x).toBe(48);
    expect(rect.y).toBe(112);
  });
});

describe('resolvingWorldPlazaHeldItemPresentationForItemTypeId', () => {
  it('resolves wood axe overlay metadata', () => {
    const presentation = resolvingWorldPlazaHeldItemPresentationForItemTypeId(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE
    );

    expect(presentation).toEqual({
      visualId: 'axe',
      tier: 'wood',
      entry: expect.objectContaining({
        sheetUrl: '/harvest/sprites/axes.webp',
      }),
    });
  });
});
