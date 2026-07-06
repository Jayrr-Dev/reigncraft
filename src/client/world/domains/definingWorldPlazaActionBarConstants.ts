/**
 * Styling and labels for the plaza top action bar.
 *
 * @module components/world/domains/definingWorldPlazaActionBarConstants
 */

/** Top-center anchor for the plaza action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_CLASS_NAME =
  'pointer-events-none absolute inset-x-0 top-1 z-40 flex justify-center px-3' as const;

/** Tighter top-center anchor on narrow viewports. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME =
  'pointer-events-none absolute inset-x-0 top-1 z-40 flex justify-center px-2' as const;

/** Top inset for the action bar anchor (Tailwind top-1). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_TOP_BASE_PX = 4 as const;

/** Scale applied to the plaza action bar (1 = legacy size). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE = 1.5 as const;

/** Extra shrink on mobile so the bar clears the status-effect HUD. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE = 1 as const;

/** Base action button edge length in px (Tailwind size-8). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX = 32 as const;

/** Base Lucide icon edge length in px (Tailwind size-4). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX = 16 as const;

/** Base gap between action bar controls in px (Tailwind gap-1). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_GAP_BASE_PX = 4 as const;

/** Base action bar shell padding in px (Tailwind p-1). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_PADDING_BASE_PX = 4 as const;

/** Base divider height in px (Tailwind h-5). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_HEIGHT_BASE_PX =
  20 as const;

/** Base horizontal divider margin in px (Tailwind mx-1). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_MARGIN_X_BASE_PX =
  4 as const;

/** Base friends notification badge diameter in px. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_NOTIFICATION_BADGE_BASE_PX =
  12 as const;

/** Base friends notification badge label size in px. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_NOTIFICATION_BADGE_TEXT_BASE_PX =
  8 as const;

/** Pill shell wrapping all plaza action buttons (sizes via inline viewport styles). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_CLASS_NAME =
  'pointer-events-auto flex items-center rounded-full border border-white/20 bg-black/60 shadow-lg backdrop-blur-md' as const;

/** Base icon button in the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_CLASS_NAME =
  'flex shrink-0 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Active icon button in the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_ACTIVE_CLASS_NAME =
  'flex shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Lucide icon layout inside action bar buttons (size via inline viewport styles). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME =
  'shrink-0' as const;

/** Divider between social and edit controls. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME =
  'w-px shrink-0 bg-white/15' as const;

/** Top offset for dropdown panels opened from the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_DROPDOWN_TOP_OFFSET_CLASS_NAME =
  'top-10' as const;

/** Accessible label for the return-to-home action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_HOME =
  'Return to home screen' as const;

/** Accessible label for the how-to-play tutorial action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TUTORIAL = 'How to play' as const;

/** Accessible label for the chat action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_CHAT = 'Chat' as const;

/** Accessible label for the friends action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_FRIENDS = 'Friends' as const;

/** Accessible label for the claim mode action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_CLAIM = 'Claim mode' as const;

/** Accessible label for the build mode action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_BUILD = 'Build mode' as const;

/** Accessible label for the character transform action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM =
  'Transform character' as const;

/** Wrapper anchoring the transform dropdown to its action bar button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** Dropdown panel listing character transform options below the action bar. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_PANEL_CLASS_NAME =
  'pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max max-w-[12rem] -translate-x-1/2 flex-col gap-1 rounded-xl border border-white/20 bg-black/80 p-1.5 shadow-lg backdrop-blur-md' as const;

/** Base classes shared by every character transform option button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME =
  'rounded-lg px-2.5 py-1 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70' as const;

/** Classes applied to the active character transform option. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME =
  'bg-white/15 text-white ring-1 ring-white/30' as const;

/** Classes applied to inactive character transform options. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME =
  'text-white/75 hover:bg-white/10 hover:text-white' as const;

/** Notification badge on the friends action button (size via inline viewport styles). */
export const STYLING_WORLD_PLAZA_ACTION_BAR_FRIENDS_NOTIFICATION_BADGE =
  'pointer-events-none absolute -right-1 -top-1 flex items-center justify-center rounded-full border border-[#0d1b2a] bg-sky-500 font-semibold leading-none text-white' as const;
