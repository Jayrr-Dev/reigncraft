/**
 * Scaffold Shop panel: empty inventory list.
 *
 * @module components/world/npc/components/renderingNpcShopPanel
 */

'use client';

import { RenderingNpcPanelShell } from '@/components/world/npc/components/renderingNpcPanelShell';
import {
  DEFINING_NPC_PANEL_EMPTY_CLASS_NAME,
  DEFINING_NPC_PANEL_LIST_CLASS_NAME,
  DEFINING_NPC_PANEL_LIST_ROW_CLASS_NAME,
  LABELING_NPC_SHOP_PANEL_TITLE,
} from '@/components/world/npc/domains/definingNpcPanelConstants';
import {
  LABELING_NPC_SHOP_EMPTY,
  resolvingNpcShopItems,
} from '@/components/world/npc/domains/definingNpcShopCatalog';
import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';
import { gettingNpcInstance } from '@/components/world/npc/domains/managingNpcInstanceStore';

export type RenderingNpcShopPanelProps = {
  readonly isOpen: boolean;
  readonly npcId: DefiningNpcId | null;
  readonly onClose: () => void;
};

export function RenderingNpcShopPanel({
  isOpen,
  npcId,
  onClose,
}: RenderingNpcShopPanelProps): React.JSX.Element | null {
  const instance = npcId ? gettingNpcInstance(npcId) : null;
  const items = npcId ? resolvingNpcShopItems(npcId) : [];
  const title = instance
    ? `${LABELING_NPC_SHOP_PANEL_TITLE}: ${instance.displayName}`
    : LABELING_NPC_SHOP_PANEL_TITLE;

  return (
    <RenderingNpcPanelShell isOpen={isOpen} title={title} onClose={onClose}>
      {items.length === 0 ? (
        <p className={DEFINING_NPC_PANEL_EMPTY_CLASS_NAME}>
          {LABELING_NPC_SHOP_EMPTY}
        </p>
      ) : (
        <ul className={DEFINING_NPC_PANEL_LIST_CLASS_NAME}>
          {items.map((item) => (
            <li key={item.itemId} className={DEFINING_NPC_PANEL_LIST_ROW_CLASS_NAME}>
              <span>{item.displayName}</span>
              <span>{item.price}</span>
            </li>
          ))}
        </ul>
      )}
    </RenderingNpcPanelShell>
  );
}
