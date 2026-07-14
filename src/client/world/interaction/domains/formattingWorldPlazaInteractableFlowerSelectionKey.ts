/** Prefix for biome flower popover selection keys. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_FLOWER_SELECTION_KEY_PREFIX =
  'flower' as const;

export function formattingWorldPlazaInteractableFlowerSelectionKey(
  tileX: number,
  tileY: number
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_FLOWER_SELECTION_KEY_PREFIX}:${tileX}:${tileY}`;
}

export function parsingWorldPlazaInteractableFlowerSelectionKey(
  selectionKey: string
): { readonly tileX: number; readonly tileY: number } | null {
  const parts = selectionKey.split(':');

  if (
    parts.length !== 3 ||
    parts[0] !== DEFINING_WORLD_PLAZA_INTERACTABLE_FLOWER_SELECTION_KEY_PREFIX
  ) {
    return null;
  }

  const tileX = Number(parts[1]);
  const tileY = Number(parts[2]);

  if (!Number.isFinite(tileX) || !Number.isFinite(tileY)) {
    return null;
  }

  return { tileX, tileY };
}
