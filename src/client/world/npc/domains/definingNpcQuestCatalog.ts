/**
 * Per-NPC quest list scaffold (empty until quests land).
 *
 * @module components/world/npc/domains/definingNpcQuestCatalog
 */

import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';

export type DefiningNpcQuestEntry = {
  readonly questId: string;
  readonly title: string;
  readonly summary: string;
};

export const DEFINING_NPC_QUEST_CATALOG: Readonly<
  Record<DefiningNpcId, readonly DefiningNpcQuestEntry[]>
> = {
  'npc-villager-a': [],
  'npc-villager-b': [],
  'npc-villager-c': [],
};

export function resolvingNpcQuestEntries(
  npcId: DefiningNpcId
): readonly DefiningNpcQuestEntry[] {
  return DEFINING_NPC_QUEST_CATALOG[npcId] ?? [];
}

export const LABELING_NPC_QUEST_EMPTY = 'No quests yet' as const;
