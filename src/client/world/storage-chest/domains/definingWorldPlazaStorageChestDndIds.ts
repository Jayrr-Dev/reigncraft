/**
 * dnd-kit id builders and parsers for storage chest slots.
 *
 * @module components/world/storage-chest/domains/definingWorldPlazaStorageChestDndIds
 */

const DEFINING_WORLD_PLAZA_STORAGE_CHEST_DND_SEGMENT_SEPARATOR = '|' as const;

/** Prefix for storage chest slot droppable ids. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SLOT_DROPPABLE_PREFIX =
  'storage-chest-slot' as const;

/**
 * Builds a droppable id for one chest internal slot.
 */
export function definingWorldPlazaStorageChestSlotDroppableId(
  blockId: string,
  slotIndex: number
): string {
  return `${DEFINING_WORLD_PLAZA_STORAGE_CHEST_SLOT_DROPPABLE_PREFIX}${DEFINING_WORLD_PLAZA_STORAGE_CHEST_DND_SEGMENT_SEPARATOR}${blockId}${DEFINING_WORLD_PLAZA_STORAGE_CHEST_DND_SEGMENT_SEPARATOR}${slotIndex}`;
}

export type DefiningWorldPlazaStorageChestSlotDroppableTarget = {
  readonly blockId: string;
  readonly slotIndex: number;
};

/**
 * Parses a droppable id into a storage chest slot target when it matches.
 */
export function parsingWorldPlazaStorageChestSlotDroppableId(
  droppableId: string
): DefiningWorldPlazaStorageChestSlotDroppableTarget | null {
  if (
    !droppableId.startsWith(
      `${DEFINING_WORLD_PLAZA_STORAGE_CHEST_SLOT_DROPPABLE_PREFIX}${DEFINING_WORLD_PLAZA_STORAGE_CHEST_DND_SEGMENT_SEPARATOR}`
    )
  ) {
    return null;
  }

  const remainder = droppableId.slice(
    DEFINING_WORLD_PLAZA_STORAGE_CHEST_SLOT_DROPPABLE_PREFIX.length + 1
  );
  const separatorIndex = remainder.lastIndexOf(
    DEFINING_WORLD_PLAZA_STORAGE_CHEST_DND_SEGMENT_SEPARATOR
  );

  if (separatorIndex <= 0) {
    return null;
  }

  const blockId = remainder.slice(0, separatorIndex);
  const parsedSlotIndex = Number.parseInt(
    remainder.slice(separatorIndex + 1),
    10
  );

  if (
    blockId.length === 0 ||
    Number.isNaN(parsedSlotIndex) ||
    parsedSlotIndex < 0
  ) {
    return null;
  }

  return {
    blockId,
    slotIndex: parsedSlotIndex,
  };
}
