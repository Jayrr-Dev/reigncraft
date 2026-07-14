/**
 * Selection key for world caltrop interaction labels.
 *
 * @module components/world/trap/domains/formattingWorldPlazaInteractableCaltropSelectionKey
 */

import type { DefiningWorldPlazaCaltropId } from '@/components/world/trap/domains/definingWorldPlazaCaltropTypes';

export const DEFINING_WORLD_PLAZA_INTERACTABLE_CALTROP_SELECTION_KEY_PREFIX =
  'caltrop' as const;

export function formattingWorldPlazaInteractableCaltropSelectionKey(
  trapId: DefiningWorldPlazaCaltropId
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_CALTROP_SELECTION_KEY_PREFIX}:${trapId}`;
}

export function parsingWorldPlazaInteractableCaltropSelectionKey(
  selectionKey: string
): DefiningWorldPlazaCaltropId | null {
  const prefix = `${DEFINING_WORLD_PLAZA_INTERACTABLE_CALTROP_SELECTION_KEY_PREFIX}:`;

  if (!selectionKey.startsWith(prefix)) {
    return null;
  }

  const trapId = selectionKey.slice(prefix.length);

  return trapId.length > 0 ? trapId : null;
}
