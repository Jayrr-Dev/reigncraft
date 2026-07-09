/**
 * Selection key for a wildlife corpse Study popover.
 */
export function formattingWildlifeCorpseStudySelectionKey(
  instanceId: string
): string {
  return `wildlife-corpse:${instanceId}`;
}

/** True when a selection key refers to a wildlife corpse. */
export function checkingWildlifeCorpseStudySelectionKey(
  selectionKey: string
): boolean {
  return selectionKey.startsWith('wildlife-corpse:');
}

/** Extracts the instance id from a corpse selection key, or null. */
export function resolvingWildlifeCorpseStudyInstanceIdFromSelectionKey(
  selectionKey: string
): string | null {
  if (!checkingWildlifeCorpseStudySelectionKey(selectionKey)) {
    return null;
  }

  return selectionKey.slice('wildlife-corpse:'.length) || null;
}
