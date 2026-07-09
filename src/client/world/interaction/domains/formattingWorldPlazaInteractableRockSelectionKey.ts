/** Prefix for procedural column-rock popover selection keys. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_ROCK_SELECTION_KEY_PREFIX =
  'rock' as const;

/**
 * Stable selection key for a rock mine popover (anchor tile).
 */
export function formattingWorldPlazaInteractableRockSelectionKey(
  anchorTileX: number,
  anchorTileY: number
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_ROCK_SELECTION_KEY_PREFIX}:${anchorTileX}:${anchorTileY}`;
}

/**
 * Parses a rock selection key back to anchor tile coordinates.
 */
export function parsingWorldPlazaInteractableRockSelectionKey(
  selectionKey: string
): { readonly anchorTileX: number; readonly anchorTileY: number } | null {
  const parts = selectionKey.split(':');

  if (
    parts.length !== 3 ||
    parts[0] !== DEFINING_WORLD_PLAZA_INTERACTABLE_ROCK_SELECTION_KEY_PREFIX
  ) {
    return null;
  }

  const anchorTileX = Number(parts[1]);
  const anchorTileY = Number(parts[2]);

  if (!Number.isFinite(anchorTileX) || !Number.isFinite(anchorTileY)) {
    return null;
  }

  return { anchorTileX, anchorTileY };
}
