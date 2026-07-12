import {
  checkingWorldPlazaInventoryOverIdIsStoragePageArrow,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DOWN_DROPPABLE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_UP_DROPPABLE_ID,
  parsingWorldPlazaInventoryStoragePageArrowDirection,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryPageArrowDndIds';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaInventoryPageArrowDndIds', () => {
  it('parses up and down droppable ids', () => {
    expect(
      parsingWorldPlazaInventoryStoragePageArrowDirection(
        DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_UP_DROPPABLE_ID
      )
    ).toBe('up');
    expect(
      parsingWorldPlazaInventoryStoragePageArrowDirection(
        DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DOWN_DROPPABLE_ID
      )
    ).toBe('down');
    expect(
      parsingWorldPlazaInventoryStoragePageArrowDirection('inventory-slot-3')
    ).toBeNull();
  });

  it('detects page arrow over ids', () => {
    expect(
      checkingWorldPlazaInventoryOverIdIsStoragePageArrow(
        DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DOWN_DROPPABLE_ID
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaInventoryOverIdIsStoragePageArrow('inventory-slot-0')
    ).toBe(false);
  });
});
