/**
 * Scaffold Quest panel: empty quest list.
 *
 * @module components/world/npc/components/renderingNpcQuestPanel
 */

'use client';

import { RenderingNpcPanelShell } from '@/components/world/npc/components/renderingNpcPanelShell';
import {
  DEFINING_NPC_PANEL_EMPTY_CLASS_NAME,
  DEFINING_NPC_PANEL_LIST_CLASS_NAME,
  DEFINING_NPC_PANEL_LIST_ROW_CLASS_NAME,
  LABELING_NPC_QUEST_PANEL_TITLE,
} from '@/components/world/npc/domains/definingNpcPanelConstants';
import {
  LABELING_NPC_QUEST_EMPTY,
  resolvingNpcQuestEntries,
} from '@/components/world/npc/domains/definingNpcQuestCatalog';
import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';
import { gettingNpcInstance } from '@/components/world/npc/domains/managingNpcInstanceStore';

export type RenderingNpcQuestPanelProps = {
  readonly isOpen: boolean;
  readonly npcId: DefiningNpcId | null;
  readonly onClose: () => void;
};

export function RenderingNpcQuestPanel({
  isOpen,
  npcId,
  onClose,
}: RenderingNpcQuestPanelProps): React.JSX.Element | null {
  const instance = npcId ? gettingNpcInstance(npcId) : null;
  const quests = npcId ? resolvingNpcQuestEntries(npcId) : [];
  const title = instance
    ? `${LABELING_NPC_QUEST_PANEL_TITLE}: ${instance.displayName}`
    : LABELING_NPC_QUEST_PANEL_TITLE;

  return (
    <RenderingNpcPanelShell isOpen={isOpen} title={title} onClose={onClose}>
      {quests.length === 0 ? (
        <p className={DEFINING_NPC_PANEL_EMPTY_CLASS_NAME}>
          {LABELING_NPC_QUEST_EMPTY}
        </p>
      ) : (
        <ul className={DEFINING_NPC_PANEL_LIST_CLASS_NAME}>
          {quests.map((quest) => (
            <li
              key={quest.questId}
              className={DEFINING_NPC_PANEL_LIST_ROW_CLASS_NAME}
            >
              <div>
                <div className="font-semibold">{quest.title}</div>
                <div className="text-xs opacity-80">{quest.summary}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </RenderingNpcPanelShell>
  );
}
