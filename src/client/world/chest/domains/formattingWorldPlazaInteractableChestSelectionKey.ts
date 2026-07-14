/**
 * Selection key for world chest interaction labels.
 *
 * @module components/world/chest/domains/formattingWorldPlazaInteractableChestSelectionKey
 */

import type { DefiningWorldPlazaChestId } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';

export const DEFINING_WORLD_PLAZA_INTERACTABLE_CHEST_SELECTION_KEY_PREFIX =
  'chest' as const;

export function formattingWorldPlazaInteractableChestSelectionKey(
  chestId: DefiningWorldPlazaChestId
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_CHEST_SELECTION_KEY_PREFIX}:${chestId}`;
}

export function parsingWorldPlazaInteractableChestSelectionKey(
  selectionKey: string
): DefiningWorldPlazaChestId | null {
  const prefix = `${DEFINING_WORLD_PLAZA_INTERACTABLE_CHEST_SELECTION_KEY_PREFIX}:`;

  if (!selectionKey.startsWith(prefix)) {
    return null;
  }

  const chestId = selectionKey.slice(prefix.length);

  return chestId.length > 0 ? chestId : null;
}
