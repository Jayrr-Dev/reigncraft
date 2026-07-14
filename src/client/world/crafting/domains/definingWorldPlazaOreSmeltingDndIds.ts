export type DefiningWorldPlazaOreSmeltingStationSlotKind = 'ore' | 'fuel';

const DEFINING_WORLD_PLAZA_ORE_SMELTING_SLOT_DROPPABLE_ID_PREFIX =
  'world-plaza-smelting-slot' as const;

export function definingWorldPlazaOreSmeltingSlotDroppableId(
  slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind
): string {
  return `${DEFINING_WORLD_PLAZA_ORE_SMELTING_SLOT_DROPPABLE_ID_PREFIX}:${slotKind}`;
}

export function parsingWorldPlazaOreSmeltingSlotDroppableId(
  droppableId: string
): DefiningWorldPlazaOreSmeltingStationSlotKind | null {
  const prefix = `${DEFINING_WORLD_PLAZA_ORE_SMELTING_SLOT_DROPPABLE_ID_PREFIX}:`;

  if (!droppableId.startsWith(prefix)) {
    return null;
  }

  const slotKind = droppableId.slice(prefix.length);
  return slotKind === 'ore' || slotKind === 'fuel' ? slotKind : null;
}
