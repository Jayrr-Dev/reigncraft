/**
 * Placeholder dialogue lines per placed NPC.
 *
 * @module components/world/npc/domains/definingNpcDialogueCatalog
 */

import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';

export type DefiningNpcDialogueLine = {
  readonly lineId: string;
  readonly text: string;
};

export const DEFINING_NPC_DIALOGUE_CATALOG: Readonly<
  Record<DefiningNpcId, readonly DefiningNpcDialogueLine[]>
> = {
  'npc-villager-a': [
    {
      lineId: 'a-1',
      text: 'Welcome to the plaza. Watch the tall grass — things bite.',
    },
    {
      lineId: 'a-2',
      text: 'If you need supplies later, I keep a stall nearby.',
    },
    {
      lineId: 'a-3',
      text: 'Stay warm after sundown. Cold settles into the bones out here.',
    },
  ],
  'npc-villager-b': [
    {
      lineId: 'b-1',
      text: 'Heard wolves circling past the ridge last night.',
    },
    {
      lineId: 'b-2',
      text: 'I trade when the stock is in. Today the shelves are bare.',
    },
    {
      lineId: 'b-3',
      text: 'Ask around if you need work — someone always does.',
    },
  ],
  'npc-villager-c': [
    {
      lineId: 'c-1',
      text: 'New faces wash up here all the time. You look capable.',
    },
    {
      lineId: 'c-2',
      text: 'Quests will show up on my board when the village needs hands.',
    },
    {
      lineId: 'c-3',
      text: 'Shop, talk, or take a job — all three when we are ready.',
    },
  ],
};

export function resolvingNpcDialogueLines(
  npcId: DefiningNpcId
): readonly DefiningNpcDialogueLine[] {
  return DEFINING_NPC_DIALOGUE_CATALOG[npcId] ?? [];
}
