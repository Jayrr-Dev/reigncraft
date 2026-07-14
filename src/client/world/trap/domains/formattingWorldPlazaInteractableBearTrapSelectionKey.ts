/**
 * Selection key for world bear trap interaction labels.
 *
 * @module components/world/trap/domains/formattingWorldPlazaInteractableBearTrapSelectionKey
 */

import type { DefiningWorldPlazaBearTrapId } from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';

export const DEFINING_WORLD_PLAZA_INTERACTABLE_BEAR_TRAP_SELECTION_KEY_PREFIX =
  'bear-trap' as const;

export function formattingWorldPlazaInteractableBearTrapSelectionKey(
  trapId: DefiningWorldPlazaBearTrapId
): string {
  return `${DEFINING_WORLD_PLAZA_INTERACTABLE_BEAR_TRAP_SELECTION_KEY_PREFIX}:${trapId}`;
}

export function parsingWorldPlazaInteractableBearTrapSelectionKey(
  selectionKey: string
): DefiningWorldPlazaBearTrapId | null {
  const prefix = `${DEFINING_WORLD_PLAZA_INTERACTABLE_BEAR_TRAP_SELECTION_KEY_PREFIX}:`;

  if (!selectionKey.startsWith(prefix)) {
    return null;
  }

  const trapId = selectionKey.slice(prefix.length);

  return trapId.length > 0 ? trapId : null;
}
