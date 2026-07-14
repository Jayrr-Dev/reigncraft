/**
 * Talk / Shop / Quest overhead badges (mirrors companion care badge chrome).
 *
 * @module components/world/npc/domains/definingNpcActionConstants
 */

import type { DefiningNpcActionId } from '@/components/world/npc/domains/definingNpcTypes';

export const LABELING_NPC_ACTION_TALK = 'Talk' as const;
export const LABELING_NPC_ACTION_SHOP = 'Shop' as const;
export const LABELING_NPC_ACTION_QUEST = 'Quest' as const;

export const DEFINING_NPC_ACTION_TALK_ICON_ID = 'mdi:chat' as const;
export const DEFINING_NPC_ACTION_SHOP_ICON_ID = 'mdi:purse' as const;
export const DEFINING_NPC_ACTION_QUEST_ICON_ID =
  'game-icons:scroll-unfurled' as const;

export const DEFINING_NPC_ACTION_BADGE_ICON_SIZE_PX = 12 as const;

export const LABELING_NPC_ACTION_BADGE_TOOLBAR = 'NPC actions' as const;

/** Player interaction reach for NPC badges (grid units). */
export const DEFINING_NPC_PLAYER_INTERACT_REACH_GRID = 1.8 as const;

export const STYLING_NPC_ACTION_STACK_CLASS_NAME =
  'pointer-events-auto flex flex-col items-center justify-center gap-1' as const;

export const STYLING_NPC_ACTION_BADGE_ROW_CLASS_NAME =
  'pointer-events-auto flex max-w-[min(100vw,220px)] flex-wrap items-center justify-center gap-1' as const;

export const STYLING_NPC_ACTION_BADGE_CLASS_NAME =
  'world-plaza-npc-action-badge pointer-events-auto inline-flex size-5 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-white/35 bg-black/60 text-white shadow-sm shadow-black/40 backdrop-blur-[2px] transition-[transform,background-color,border-color,opacity] hover:border-white/55 hover:bg-black/75 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45' as const;

export const STYLING_NPC_ACTION_BADGE_ICON_CLASS_NAME =
  'shrink-0 text-current' as const;

export const STYLING_NPC_NAME_LABEL_CLASS_NAME =
  'pointer-events-none max-w-[min(100vw,160px)] truncate text-center text-[11px] font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]' as const;

/** Lift badges above the NPC feet/name slot (CSS px before camera zoom). */
export const DEFINING_NPC_INTERACTION_LABEL_OFFSET_ABOVE_PX = 52 as const;

export type DefiningNpcActionDescriptor = {
  readonly actionId: DefiningNpcActionId;
  readonly label: string;
  readonly iconId: string;
};

export const DEFINING_NPC_ACTION_REGISTRY: readonly DefiningNpcActionDescriptor[] =
  [
    {
      actionId: 'talk',
      label: LABELING_NPC_ACTION_TALK,
      iconId: DEFINING_NPC_ACTION_TALK_ICON_ID,
    },
    {
      actionId: 'shop',
      label: LABELING_NPC_ACTION_SHOP,
      iconId: DEFINING_NPC_ACTION_SHOP_ICON_ID,
    },
    {
      actionId: 'quest',
      label: LABELING_NPC_ACTION_QUEST,
      iconId: DEFINING_NPC_ACTION_QUEST_ICON_ID,
    },
  ] as const;

export function resolvingNpcActionDescriptor(
  actionId: DefiningNpcActionId
): DefiningNpcActionDescriptor | null {
  return (
    DEFINING_NPC_ACTION_REGISTRY.find((entry) => entry.actionId === actionId) ??
    null
  );
}
