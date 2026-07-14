/**
 * Scaffold Talk panel: placeholder dialogue lines.
 *
 * @module components/world/npc/components/renderingNpcTalkPanel
 */

'use client';

import { RenderingNpcPanelShell } from '@/components/world/npc/components/renderingNpcPanelShell';
import { resolvingNpcDialogueLines } from '@/components/world/npc/domains/definingNpcDialogueCatalog';
import {
  DEFINING_NPC_PANEL_DIALOGUE_LINE_CLASS_NAME,
  DEFINING_NPC_PANEL_DIALOGUE_STACK_CLASS_NAME,
  DEFINING_NPC_PANEL_EMPTY_CLASS_NAME,
  LABELING_NPC_TALK_PANEL_TITLE,
} from '@/components/world/npc/domains/definingNpcPanelConstants';
import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';
import { gettingNpcInstance } from '@/components/world/npc/domains/managingNpcInstanceStore';

export type RenderingNpcTalkPanelProps = {
  readonly isOpen: boolean;
  readonly npcId: DefiningNpcId | null;
  readonly onClose: () => void;
};

export function RenderingNpcTalkPanel({
  isOpen,
  npcId,
  onClose,
}: RenderingNpcTalkPanelProps): React.JSX.Element | null {
  const instance = npcId ? gettingNpcInstance(npcId) : null;
  const lines = npcId ? resolvingNpcDialogueLines(npcId) : [];
  const title = instance
    ? `${LABELING_NPC_TALK_PANEL_TITLE}: ${instance.displayName}`
    : LABELING_NPC_TALK_PANEL_TITLE;

  return (
    <RenderingNpcPanelShell isOpen={isOpen} title={title} onClose={onClose}>
      {lines.length === 0 ? (
        <p className={DEFINING_NPC_PANEL_EMPTY_CLASS_NAME}>Nothing to say.</p>
      ) : (
        <div className={DEFINING_NPC_PANEL_DIALOGUE_STACK_CLASS_NAME}>
          {lines.map((line) => (
            <p
              key={line.lineId}
              className={DEFINING_NPC_PANEL_DIALOGUE_LINE_CLASS_NAME}
            >
              {line.text}
            </p>
          ))}
        </div>
      )}
    </RenderingNpcPanelShell>
  );
}
