/**
 * DnD droppable ids for teapot ingredient slots.
 *
 * @module components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingDndIds
 */

const DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_DROPPABLE_ID_PREFIX =
  'world-plaza-tea-brewing-slot' as const;

export function definingWorldPlazaTeaBrewingSlotDroppableId(
  slotIndex: number
): string {
  return `${DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_DROPPABLE_ID_PREFIX}:${slotIndex}`;
}

export function parsingWorldPlazaTeaBrewingSlotDroppableId(
  droppableId: string
): number | null {
  const prefix = `${DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_DROPPABLE_ID_PREFIX}:`;

  if (!droppableId.startsWith(prefix)) {
    return null;
  }

  const slotIndex = Number(droppableId.slice(prefix.length));

  return Number.isInteger(slotIndex) && slotIndex >= 0 ? slotIndex : null;
}
