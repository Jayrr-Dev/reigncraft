/**
 * Selection key for NPC proximity interaction labels.
 *
 * @module components/world/npc/domains/formattingNpcSelectionKey
 */

import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';

const DEFINING_NPC_SELECTION_KEY_PREFIX = 'npc:' as const;

export function formattingNpcSelectionKey(npcId: DefiningNpcId): string {
  return `${DEFINING_NPC_SELECTION_KEY_PREFIX}${npcId}`;
}

export function parsingNpcSelectionKey(selectionKey: string): DefiningNpcId | null {
  if (!selectionKey.startsWith(DEFINING_NPC_SELECTION_KEY_PREFIX)) {
    return null;
  }

  const npcId = selectionKey.slice(DEFINING_NPC_SELECTION_KEY_PREFIX.length);

  return npcId.length > 0 ? npcId : null;
}
