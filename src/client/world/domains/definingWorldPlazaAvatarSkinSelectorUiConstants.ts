/**
 * UI styling for the plaza avatar skin selector toggle and panel.
 *
 * @module components/world/domains/definingWorldPlazaAvatarSkinSelectorUiConstants
 */

/** Character toggle button classes when the panel is closed. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_CLASS_NAME =
  "pointer-events-auto rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70" as const;

/** Character toggle button classes when the panel is open. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  "pointer-events-auto rounded-md border border-violet-300/70 bg-violet-400/15 px-2.5 py-1 text-[10px] font-semibold text-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70" as const;

/** Visible label on the character toggle button. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_LABEL =
  "Character" as const;

/** Accessible label for the character toggle. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_ARIA_LABEL =
  "Toggle avatar character selector" as const;

/** Expanded skin option panel below the character toggle. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_PANEL_CLASS_NAME =
  "pointer-events-auto flex w-max max-w-[10rem] flex-col gap-1 rounded-md border border-violet-300/40 bg-black/85 p-1.5 shadow-lg backdrop-blur-sm" as const;

/** Base classes shared by every skin option button. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_BUTTON_BASE_CLASS_NAME =
  "rounded border px-2 py-0.5 text-left text-[10px] font-semibold transition-colors" as const;

/** Classes applied to the active skin option button. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_ACTIVE_CLASS_NAME =
  "border-violet-300 bg-violet-400/30 text-violet-50" as const;

/** Classes applied to inactive skin option buttons. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_INACTIVE_CLASS_NAME =
  "border-white/20 bg-black/40 text-white/90 hover:bg-violet-400/10" as const;
