/**
 * UI styling for the plaza avatar skin selector toggle and panel.
 *
 * @module components/world/domains/definingWorldPlazaAvatarSkinSelectorUiConstants
 */

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

/** Character toggle button classes when the panel is closed. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_CLASS_NAME =
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME;

/** Character toggle button classes when the panel is open. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME} border-violet-300/70 bg-violet-400/15 text-violet-100` as const;

/** Visible label on the character toggle button. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_BUTTON_LABEL =
  'Character' as const;

/** Accessible label for the character toggle. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_TOGGLE_ARIA_LABEL =
  'Toggle avatar character selector' as const;

/** Expanded skin option panel below the character toggle. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_PANEL_CLASS_NAME =
  'pointer-events-auto flex w-max max-w-[14rem] flex-col gap-1 rounded-md border border-violet-300/40 bg-black/85 p-1.5 shadow-lg backdrop-blur-sm' as const;

/** Scrollable list region inside the skin selector panel. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_LIST_CLASS_NAME =
  'flex max-h-[min(50vh,24rem)] flex-col gap-1 overflow-y-auto overscroll-contain pr-0.5' as const;

/** Filter input inside the skin selector panel. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_FILTER_INPUT_CLASS_NAME =
  'w-full rounded border border-white/20 bg-black/50 px-2 py-1 text-[10px] text-white/90 placeholder:text-white/40 focus:border-violet-300/60 focus:outline-none' as const;

/** Minimum option count before the toggle shows the active skin name. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_SHOW_ACTIVE_LABEL_MIN_OPTIONS = 8;

/** Base classes shared by every skin option button. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_BUTTON_BASE_CLASS_NAME =
  'rounded border px-2 py-0.5 text-left text-[10px] font-semibold transition-colors' as const;

/** Classes applied to the active skin option button. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_ACTIVE_CLASS_NAME =
  'border-violet-300 bg-violet-400/30 text-violet-50' as const;

/** Classes applied to inactive skin option buttons. */
export const DEFINING_WORLD_PLAZA_AVATAR_SKIN_SELECTOR_OPTION_INACTIVE_CLASS_NAME =
  'border-white/20 bg-black/40 text-white/90 hover:bg-violet-400/10' as const;
