/** Prefix for procedural/placed tree popover selection keys. */
export const DEFINING_WORLD_PLAZA_INTERACTABLE_TREE_SELECTION_KEY_PREFIX =
  'tree' as const;

/**
 * Stable selection key for a tree popover (tile only; trees are not placed blocks).
 */
export function formattingWorldPlazaInteractableTreeSelectionKey(
  tileX: number,
  tileY: number
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_TREE_SELECTION_KEY_PREFIX}:${tileX}:${tileY}`;
}

/**
 * Parses a tree selection key back to tile coordinates.
 */
export function parsingWorldPlazaInteractableTreeSelectionKey(
  selectionKey: string
): { readonly tileX: number; readonly tileY: number } | null {
  const parts = selectionKey.split(':');

  if (
    parts.length !== 3 ||
    parts[0] !== DEFINING_WORLD_PLAZA_INTERACTABLE_TREE_SELECTION_KEY_PREFIX
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
