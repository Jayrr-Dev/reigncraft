/**
 * Styling and labels for the plaza top action bar.
 *
 * @module components/world/domains/definingWorldPlazaActionBarConstants
 */

import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_ACTION_BAR_DESKTOP_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

/** Top-center anchor for the plaza action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_ACTION_BAR_DESKTOP_ANCHOR_CLASS_NAME;

/** Tighter top-center anchor on narrow viewports. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME;

/** Top inset for the action bar anchor (Tailwind top-1). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_TOP_BASE_PX =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topCenter.actionBar
    .anchorTopBasePx;

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
  'plaza-action-bar-shell pointer-events-auto flex items-center font-body' as const;

/** Base icon button in the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_CLASS_NAME =
  'plaza-action-bar-button flex shrink-0 items-center justify-center text-poster-teal-deep' as const;

/** Active icon button in the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_ACTIVE_CLASS_NAME =
  'plaza-action-bar-button plaza-action-bar-button--active flex shrink-0 items-center justify-center text-parchment' as const;

/** Lucide icon layout inside action bar buttons (size via inline viewport styles). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME =
  'shrink-0' as const;

/** Divider between social and edit controls. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME =
  'w-px shrink-0 bg-poster-teal/25' as const;

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
  'plaza-action-bar-dropdown pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max max-w-[12rem] -translate-x-1/2 flex-col gap-1 p-1.5 font-body' as const;

/** Base classes shared by every character transform option button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME =
  'rounded-md px-2.5 py-1 text-left text-xs font-semibold font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70' as const;

/** Classes applied to the active character transform option. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME =
  'bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment ring-1 ring-poster-gold/40' as const;

/** Classes applied to inactive character transform options. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME =
  'text-ink-soft hover:bg-parchment-dark/50 hover:text-ink' as const;

/** Notification badge on the friends action button (size via inline viewport styles). */
export const STYLING_WORLD_PLAZA_ACTION_BAR_FRIENDS_NOTIFICATION_BADGE =
  'pointer-events-none absolute -right-1 -top-1 flex items-center justify-center rounded-full border-2 border-parchment bg-poster-orange font-display font-semibold leading-none text-parchment' as const;

/** Ensures action bar UI ignores site dark mode (color-scheme + isolation). */
export const STYLING_WORLD_PLAZA_ACTION_BAR_LIGHT_THEME_SCOPE_CLASS =
  'isolate [color-scheme:light]' as const;
