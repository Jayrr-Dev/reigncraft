/** Prefix for long-grass search popover selection keys. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_LONG_GRASS_SELECTION_KEY_PREFIX =
  'long-grass' as const;

export function formattingWorldPlazaInteractableLongGrassSelectionKey(
  tileX: number,
  tileY: number
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_LONG_GRASS_SELECTION_KEY_PREFIX}:${tileX}:${tileY}`;
}

export function parsingWorldPlazaInteractableLongGrassSelectionKey(
  selectionKey: string
): { readonly tileX: number; readonly tileY: number } | null {
  const parts = selectionKey.split(':');

  if (
    parts.length !== 3 ||
    parts[0] !== DEFINING_WORLD_PLAZA_INTERACTABLE_LONG_GRASS_SELECTION_KEY_PREFIX
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
