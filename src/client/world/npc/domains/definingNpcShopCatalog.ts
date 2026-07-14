/**
 * Per-NPC shop inventory scaffold (empty until economy lands).
 *
 * @module components/world/npc/domains/definingNpcShopCatalog
 */

import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';

export type DefiningNpcShopItem = {
  readonly itemId: string;
  readonly displayName: string;
  readonly price: number;
};

export const DEFINING_NPC_SHOP_CATALOG: Readonly<
  Record<DefiningNpcId, readonly DefiningNpcShopItem[]>
> = {
  'npc-villager-a': [],
  'npc-villager-b': [],
  'npc-villager-c': [],
};

export function resolvingNpcShopItems(
  npcId: DefiningNpcId
): readonly DefiningNpcShopItem[] {
  return DEFINING_NPC_SHOP_CATALOG[npcId] ?? [];
}

export const LABELING_NPC_SHOP_EMPTY = 'Nothing for sale yet' as const;
