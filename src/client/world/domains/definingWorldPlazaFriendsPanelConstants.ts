/**
 * Styling tokens for the world plaza friends sidebar panel.
 *
 * @module components/world/domains/definingWorldPlazaFriendsPanelConstants
 */

/** Friends sidebar width (Tailwind class). */
export const DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_WIDTH_CLASS_NAME =
  "w-[196px]" as const;

/** Right-side friends sidebar shell. */
export const DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_CLASS_NAME =
  "pointer-events-auto flex h-full min-h-0 flex-col gap-2 border-l border-white/20 bg-[#0d1b2a]/92 p-2 shadow-lg backdrop-blur-sm" as const;

/** Anchor for the friends sidebar along the plaza viewport right edge. */
export const DEFINING_WORLD_PLAZA_FRIENDS_PANEL_SIDEBAR_ANCHOR_CLASS_NAME =
  "pointer-events-none absolute inset-y-0 right-0 z-40 flex min-h-0 flex-col pt-2 pb-16" as const;

/** Scrollable friends panel body. */
export const STYLING_WORLD_PLAZA_FRIENDS_PANEL_SCROLL_CONTENT_CLASS_NAME =
  "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5" as const;

/** Panel title text. */
export const STYLING_WORLD_PLAZA_FRIENDS_PANEL_TITLE_CLASS_NAME =
  "text-[10px] font-semibold uppercase tracking-wide text-white" as const;
