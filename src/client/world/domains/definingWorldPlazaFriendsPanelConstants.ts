/**
 * Styling tokens for the world plaza friends sidebar panel.
 *
 * @module components/world/domains/definingWorldPlazaFriendsPanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

/** Friends sidebar width (Tailwind class). */
export const DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_WIDTH_CLASS_NAME =
  'w-[196px]' as const;

/** Right-side friends sidebar shell. */
export const DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_CLASS_NAME =
  'pointer-events-auto flex h-full min-h-0 flex-col gap-2 border-l border-white/20 bg-[#0d1b2a]/92 p-2 shadow-lg backdrop-blur-sm' as const;

/** Anchor for the friends sidebar along the plaza viewport right edge. */
export const DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.rightEdge.friendsPanel
    .anchorClassName;

/** Scrollable friends panel body. */
export const STYLING_WORLD_PLAZA_FRIENDS_PANEL_SCROLL_CONTENT_CLASS_NAME =
  'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5' as const;

/** Panel title text. */
export const STYLING_WORLD_PLAZA_FRIENDS_PANEL_TITLE_CLASS_NAME =
  'text-[10px] font-semibold uppercase tracking-wide text-white' as const;
