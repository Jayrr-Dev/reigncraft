/**
 * dnd-kit ids for inventory storage page arrow drop targets.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryPageArrowDndIds
 */

/** Droppable id for the storage page-up arrow. */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_UP_DROPPABLE_ID =
  'world-plaza-inventory-page-arrow-up' as const;

/** Droppable id for the storage page-down arrow. */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DOWN_DROPPABLE_ID =
  'world-plaza-inventory-page-arrow-down' as const;

/** Page direction encoded by an arrow droppable. */
export type DefiningWorldPlazaInventoryStoragePageArrowDirection =
  | 'up'
  | 'down';

/**
 * Parses a dnd-kit over id into a storage page arrow direction.
 *
 * @param overId - dnd-kit collision id
 */
export function parsingWorldPlazaInventoryStoragePageArrowDirection(
  overId: string
): DefiningWorldPlazaInventoryStoragePageArrowDirection | null {
  if (overId === DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_UP_DROPPABLE_ID) {
    return 'up';
  }

  if (overId === DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DOWN_DROPPABLE_ID) {
    return 'down';
  }

  return null;
}

/**
 * Returns true when a dnd-kit over id is a storage page arrow (not a slot).
 *
 * @param overId - dnd-kit collision id
 */
export function checkingWorldPlazaInventoryOverIdIsStoragePageArrow(
  overId: string
): boolean {
  return parsingWorldPlazaInventoryStoragePageArrowDirection(overId) !== null;
}
