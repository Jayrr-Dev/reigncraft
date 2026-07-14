/**
 * Selection key for a felled-tree stump Study popover.
 */

const WORLD_PLAZA_TREE_STUMP_STUDY_SELECTION_KEY_PREFIX =
  'tree-stump:' as const;

/**
 * Builds a selection key for one stump tile.
 */
export function formattingWorldPlazaTreeStumpStudySelectionKey(
  tileX: number,
  tileY: number
): string {
  return `${WORLD_PLAZA_TREE_STUMP_STUDY_SELECTION_KEY_PREFIX}${tileX},${tileY}`;
}

/** True when a selection key refers to a tree stump Study target. */
export function checkingWorldPlazaTreeStumpStudySelectionKey(
  selectionKey: string
): boolean {
  return selectionKey.startsWith(
    WORLD_PLAZA_TREE_STUMP_STUDY_SELECTION_KEY_PREFIX
  );
}

/** Extracts stump tile coords from a selection key, or null. */
export function resolvingWorldPlazaTreeStumpStudyTileFromSelectionKey(
  selectionKey: string
): { readonly tileX: number; readonly tileY: number } | null {
  if (!checkingWorldPlazaTreeStumpStudySelectionKey(selectionKey)) {
    return null;
  }

  const payload = selectionKey.slice(
    WORLD_PLAZA_TREE_STUMP_STUDY_SELECTION_KEY_PREFIX.length
  );
  const [tileXRaw, tileYRaw] = payload.split(',');
  const tileX = Number(tileXRaw);
  const tileY = Number(tileYRaw);

  if (!Number.isInteger(tileX) || !Number.isInteger(tileY)) {
    return null;
  }

  return { tileX, tileY };
}
