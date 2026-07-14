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
import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

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

/** Extra scale on mobile for usable finger targets (status HUD still clears). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_SCALE = 1.15 as const;

/**
 * Absolute position shared by left-side action-bar dropdowns (Settings, Guide).
 * Desktop centers under the button; mobile left-aligns and scrolls so panels
 * stay inside the narrow Reddit simulator / phone viewport.
 */
export const STYLING_WORLD_PLAZA_ACTION_BAR_DROPDOWN_LEFT_ANCHOR_CLASS_NAME =
  'pointer-events-auto absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 max-md:left-0 max-md:translate-x-0 max-md:max-h-[min(70dvh,calc(100dvh-7rem))] max-md:overflow-y-auto max-md:overscroll-contain' as const;

/** Base action button edge length in px (Tailwind size-8). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_BASE_PX = 32 as const;

/** Base Lucide icon edge length in px (Tailwind size-4). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_BASE_PX = 16 as const;

/** Base gap between action bar controls in px (Tailwind gap-1). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_GAP_BASE_PX = 4 as const;

/** Base action bar shell padding in px (Tailwind p-0.5). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_PADDING_BASE_PX = 2 as const;

/** Shell padding multiplier in fullscreen viewports (slightly tighter pill). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_PADDING_FULLSCREEN_SCALE =
  0.85 as const;

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

/**
 * Relative column wrapping the action pill and the absolute toast stack under it.
 */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_COLUMN_CLASS_NAME =
  'relative flex flex-col items-center' as const;

/**
 * Absolute Sonner host under the action pill so empty toasts do not push the bar.
 */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_TOAST_HOST_CLASS_NAME =
  'pointer-events-none absolute top-full left-1/2 z-30 mt-1.5 flex -translate-x-1/2 flex-col items-stretch overflow-visible' as const;

/** Pill shell wrapping all plaza action buttons (sizes via inline viewport styles). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarShell} pointer-events-auto flex items-center font-body` as const;

/** Base icon button in the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarButton} flex shrink-0 items-center justify-center ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.actionBarIcon}` as const;

/** Active icon button in the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_ACTIVE_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarButton} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarButtonActive} flex shrink-0 items-center justify-center ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.actionBarIconActive}` as const;

/** Lucide icon layout inside action bar buttons (size via inline viewport styles). */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME =
  'shrink-0' as const;

/** Divider between social and edit controls. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.divider;

/** Top offset for dropdown panels opened from the action bar. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_DROPDOWN_TOP_OFFSET_CLASS_NAME =
  'top-10' as const;

/** Accessible label for the chat action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_CHAT = 'Chat' as const;

/** Accessible label for the friends action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_FRIENDS = 'Friends' as const;

/** Accessible label for the claim mode action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_CLAIM = 'Claim mode' as const;

/** Accessible label for the build / edit session action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_BUILD = 'Build' as const;

/** Accessible label for the character transform action. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM =
  'Transform character' as const;

/** Wrapper anchoring the transform dropdown to its action bar button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** Dropdown panel listing character transform options below the action bar. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max min-w-[9.5rem] max-w-[12rem] -translate-x-1/2 flex-col gap-1 p-1.5 font-body` as const;

/** Search filter input inside the transform dropdown. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER_INPUT_CLASS_NAME =
  `w-full rounded-md border border-poster-wood/35 bg-parchment-dark/35 px-2 py-1 text-[11px] font-body text-ink placeholder:text-ink-soft/60 outline-none focus:border-poster-gold/55 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Scrollable skin list with hidden scrollbar and capped height. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_LIST_CLASS_NAME =
  'flex max-h-[min(42vh,16rem)] flex-col gap-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden' as const;

/** Pixel step when tapping transform list scroll arrows. */
export const DEFINING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_LIST_SCROLL_STEP_PX = 72;

/** Up/down arrow buttons that scroll the transform list. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_ARROW_CLASS_NAME =
  `flex w-full items-center justify-center rounded-md py-0.5 text-ink-soft transition-colors disabled:cursor-default disabled:opacity-25 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold} hover:enabled:bg-parchment-dark/50 hover:enabled:text-ink` as const;

/** Accessible label for the transform skin filter field. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER =
  'Filter characters' as const;

/** Placeholder text for the transform skin filter field. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_FILTER_PLACEHOLDER =
  'Search…' as const;

/** Accessible label for scrolling the transform list upward. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_UP =
  'Scroll character list up' as const;

/** Accessible label for scrolling the transform list downward. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_SCROLL_DOWN =
  'Scroll character list down' as const;

/** Base classes shared by every character transform option button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME =
  `rounded-md px-2.5 py-1 text-left text-xs font-semibold font-body transition-colors ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Classes applied to the active character transform option. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.activeTealGradient;

/** Classes applied to inactive character transform options. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.inactiveInkHover;

/** Notification badge on the friends action button (size via inline viewport styles). */
export const STYLING_WORLD_PLAZA_ACTION_BAR_FRIENDS_NOTIFICATION_BADGE =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.notification;

/** Ensures action bar UI ignores site dark mode (color-scheme + isolation). */
export const STYLING_WORLD_PLAZA_ACTION_BAR_LIGHT_THEME_SCOPE_CLASS =
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS;
