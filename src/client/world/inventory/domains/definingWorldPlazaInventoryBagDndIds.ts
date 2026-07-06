/**
 * dnd-kit id builders and parsers for bag container slots.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBagDndIds
 */

/** Separator between bag droppable id segments (UUID-safe). */
const DEFINING_WORLD_PLAZA_INVENTORY_BAG_DND_SEGMENT_SEPARATOR = '|' as const;

/** Prefix for bag slot droppable ids. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOT_DROPPABLE_PREFIX =
  'bag-slot' as const;

/**
 * Builds a droppable id for one bag internal slot.
 *
 * @param bagItemInstanceId - Bag item instance id in the hotbar
 * @param bagSlotIndex - Zero-based slot inside the bag
 */
export function definingWorldPlazaInventoryBagSlotDroppableId(
  bagItemInstanceId: string,
  bagSlotIndex: number
): string {
  return `${DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOT_DROPPABLE_PREFIX}${DEFINING_WORLD_PLAZA_INVENTORY_BAG_DND_SEGMENT_SEPARATOR}${bagItemInstanceId}${DEFINING_WORLD_PLAZA_INVENTORY_BAG_DND_SEGMENT_SEPARATOR}${bagSlotIndex}`;
}

/**
 * Parsed bag slot droppable target.
 */
export type DefiningWorldPlazaInventoryBagSlotDroppableTarget = {
  readonly bagItemInstanceId: string;
  readonly bagSlotIndex: number;
};

/**
 * Parses a droppable id into a bag slot target when it matches the bag prefix.
 *
 * @param droppableId - dnd-kit over/active id
 */
export function parsingWorldPlazaInventoryBagSlotDroppableId(
  droppableId: string
): DefiningWorldPlazaInventoryBagSlotDroppableTarget | null {
  if (
    !droppableId.startsWith(
      `${DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOT_DROPPABLE_PREFIX}${DEFINING_WORLD_PLAZA_INVENTORY_BAG_DND_SEGMENT_SEPARATOR}`
    )
  ) {
    return null;
  }

  const remainder = droppableId.slice(
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_SLOT_DROPPABLE_PREFIX.length + 1
  );
  const separatorIndex = remainder.lastIndexOf(
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_DND_SEGMENT_SEPARATOR
  );

  if (separatorIndex <= 0) {
    return null;
  }

  const bagItemInstanceId = remainder.slice(0, separatorIndex);
  const parsedBagSlotIndex = Number.parseInt(
    remainder.slice(separatorIndex + 1),
    10
  );

  if (
    bagItemInstanceId.length === 0 ||
    Number.isNaN(parsedBagSlotIndex) ||
    parsedBagSlotIndex < 0
  ) {
    return null;
  }

  return {
    bagItemInstanceId,
    bagSlotIndex: parsedBagSlotIndex,
  };
}
