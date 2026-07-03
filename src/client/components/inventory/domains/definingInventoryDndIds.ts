/**
 * dnd-kit id builders and parsers for the inventory engine.
 *
 * @module components/inventory/domains/definingInventoryDndIds
 */

/** Prefix for droppable slot ids. */
export const DEFINING_INVENTORY_SLOT_DROPPABLE_PREFIX =
  "inventory-slot-" as const;

/** Prefix for draggable item ids. */
export const DEFINING_INVENTORY_ITEM_DRAGGABLE_PREFIX =
  "inventory-item-" as const;

/** Prefix for external source draggable ids (e.g. catalog). */
export const DEFINING_INVENTORY_SOURCE_DRAGGABLE_PREFIX =
  "inventory-source-" as const;

/**
 * Builds a droppable id for a slot index.
 *
 * @param slotIndex - Zero-based slot index
 */
export function definingInventorySlotDroppableId(slotIndex: number): string {
  return `${DEFINING_INVENTORY_SLOT_DROPPABLE_PREFIX}${slotIndex}`;
}

/**
 * Parses a droppable id into a slot index when it matches the slot prefix.
 *
 * @param droppableId - dnd-kit over/active id
 */
export function parsingInventorySlotDroppableId(
  droppableId: string,
): number | null {
  if (!droppableId.startsWith(DEFINING_INVENTORY_SLOT_DROPPABLE_PREFIX)) {
    return null;
  }

  const parsedIndex = Number.parseInt(
    droppableId.slice(DEFINING_INVENTORY_SLOT_DROPPABLE_PREFIX.length),
    10,
  );

  if (Number.isNaN(parsedIndex) || parsedIndex < 0) {
    return null;
  }

  return parsedIndex;
}

/**
 * Builds a draggable id for an inventory item instance.
 *
 * @param itemId - Item instance id
 */
export function definingInventoryItemDraggableId(itemId: string): string {
  return `${DEFINING_INVENTORY_ITEM_DRAGGABLE_PREFIX}${itemId}`;
}

/**
 * Parses a draggable id into an item instance id.
 *
 * @param draggableId - dnd-kit active id
 */
export function parsingInventoryItemDraggableId(
  draggableId: string,
): string | null {
  if (!draggableId.startsWith(DEFINING_INVENTORY_ITEM_DRAGGABLE_PREFIX)) {
    return null;
  }

  const itemId = draggableId.slice(
    DEFINING_INVENTORY_ITEM_DRAGGABLE_PREFIX.length,
  );

  return itemId.length > 0 ? itemId : null;
}

/**
 * Builds a draggable id for an external source (catalog, reward, etc.).
 *
 * @param sourceId - External source identifier
 */
export function definingInventorySourceDraggableId(sourceId: string): string {
  return `${DEFINING_INVENTORY_SOURCE_DRAGGABLE_PREFIX}${sourceId}`;
}

/**
 * Parses an external source draggable id.
 *
 * @param draggableId - dnd-kit active id
 */
export function parsingInventorySourceDraggableId(
  draggableId: string,
): string | null {
  if (!draggableId.startsWith(DEFINING_INVENTORY_SOURCE_DRAGGABLE_PREFIX)) {
    return null;
  }

  const sourceId = draggableId.slice(
    DEFINING_INVENTORY_SOURCE_DRAGGABLE_PREFIX.length,
  );

  return sourceId.length > 0 ? sourceId : null;
}
