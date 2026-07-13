/**
 * Selection key for a living Pet the Cat / Pet the Dog proximity label.
 *
 * @module components/world/wildlife/domains/formattingWildlifeDocilePetSelectionKey
 */

const DEFINING_WILDLIFE_DOCILE_PET_SELECTION_KEY_PREFIX =
  'wildlife-pet:' as const;

/**
 * Selection key for a living companion Pet popover.
 */
export function formattingWildlifeDocilePetSelectionKey(
  instanceId: string
): string {
  return `${DEFINING_WILDLIFE_DOCILE_PET_SELECTION_KEY_PREFIX}${instanceId}`;
}

/** True when a selection key refers to a living pettable companion. */
export function checkingWildlifeDocilePetSelectionKey(
  selectionKey: string
): boolean {
  return selectionKey.startsWith(
    DEFINING_WILDLIFE_DOCILE_PET_SELECTION_KEY_PREFIX
  );
}

/** Extracts the instance id from a pet selection key, or null. */
export function resolvingWildlifeDocilePetInstanceIdFromSelectionKey(
  selectionKey: string
): string | null {
  if (!checkingWildlifeDocilePetSelectionKey(selectionKey)) {
    return null;
  }

  return (
    selectionKey.slice(DEFINING_WILDLIFE_DOCILE_PET_SELECTION_KEY_PREFIX.length) ||
    null
  );
}
