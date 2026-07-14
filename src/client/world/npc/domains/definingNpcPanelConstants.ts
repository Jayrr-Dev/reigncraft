/**
 * Panel chrome constants for Talk / Shop / Quest (profile + pet modal styles).
 *
 * @module components/world/npc/domains/definingNpcPanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import {
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';

export const DEFINING_NPC_PANEL_DATA_ATTRIBUTE = 'data-plaza-npc-panel' as const;

export const LABELING_NPC_TALK_PANEL_TITLE = 'Talk' as const;
export const LABELING_NPC_SHOP_PANEL_TITLE = 'Shop' as const;
export const LABELING_NPC_QUEST_PANEL_TITLE = 'Quest' as const;

export const LABELING_NPC_PANEL_CLOSE = 'Close' as const;

export const DEFINING_NPC_PANEL_OVERLAY_CLASS_NAME =
  `pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme}` as const;

export const DEFINING_NPC_PANEL_BACKDROP_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME;

export const DEFINING_NPC_PANEL_SHELL_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME;

export const DEFINING_NPC_PANEL_HEADER_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME;

export const DEFINING_NPC_PANEL_TITLE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME;

export const DEFINING_NPC_PANEL_CLOSE_BUTTON_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME;

export const DEFINING_NPC_PANEL_BODY_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BODY_CLASS_NAME;

export const DEFINING_NPC_PANEL_DIALOGUE_LINE_CLASS_NAME =
  'text-sm leading-relaxed text-[color:var(--plaza-ink,#2a2218)]' as const;

export const DEFINING_NPC_PANEL_DIALOGUE_STACK_CLASS_NAME =
  'flex flex-col gap-2' as const;

export const DEFINING_NPC_PANEL_EMPTY_CLASS_NAME =
  'py-6 text-center text-sm text-[color:var(--plaza-ink-muted,#6b5e4e)]' as const;

export const DEFINING_NPC_PANEL_LIST_CLASS_NAME =
  'flex flex-col gap-1.5' as const;

export const DEFINING_NPC_PANEL_LIST_ROW_CLASS_NAME =
  'flex items-center justify-between gap-2 rounded border border-black/10 bg-black/[0.04] px-2.5 py-2 text-sm' as const;
