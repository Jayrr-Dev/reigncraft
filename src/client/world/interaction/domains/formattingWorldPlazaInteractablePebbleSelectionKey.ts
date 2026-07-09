/** Prefix for procedural floor-pebble popover selection keys. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_PEBBLE_SELECTION_KEY_PREFIX =
  'pebble' as const;

/**
 * Stable selection key for a pebble pick popover.
 */
export function formattingWorldPlazaInteractablePebbleSelectionKey(
  tileX: number,
  tileY: number
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_PEBBLE_SELECTION_KEY_PREFIX}:${tileX}:${tileY}`;
}

/**
 * Parses a pebble selection key back to tile coordinates.
 */
export function parsingWorldPlazaInteractablePebbleSelectionKey(
  selectionKey: string
): { readonly tileX: number; readonly tileY: number } | null {
  const parts = selectionKey.split(':');

  if (
    parts.length !== 3 ||
    parts[0] !== DEFINING_WORLD_PLAZA_INTERACTABLE_PEBBLE_SELECTION_KEY_PREFIX
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
