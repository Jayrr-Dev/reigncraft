/**
 * Care / command overhead badges for named Familiar+ companions.
 * Pet / Feed circle icons appear immediately when near and triggerable.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetCompanionCareActionConstants
 */

/**
 * Below this hunger ratio, a bonded pet seeks the owner (follow) and Feed is
 * available. Matches the player well-fed cutoff (75%).
 */
export const DEFINING_WILDLIFE_PET_FEED_HUNGER_RATIO_THRESHOLD = 0.75 as const;

/**
 * @deprecated Care icons show immediately when near; kept for older imports.
 */
export const DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTIONS_REVEAL_MS = 0 as const;

/** Overhead Pet action label. */
export const LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET = 'Pet' as const;

/** Overhead Feed action label. */
export const LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED = 'Feed' as const;

/** Iconify id for the Pet care badge. */
export const DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET_ICON_ID =
  'mdi:paw' as const;

/** Iconify id for the Feed care badge. */
export const DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED_ICON_ID =
  'mdi:food-drumstick' as const;

/** Even glyph edge keeps exact 4px insets inside the 16px circle triggers. */
export const DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX =
  8 as const;

/** @deprecated Prefer {@link DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX}. */
export const DEFINING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ICON_SIZE_PX =
  DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX;

/** Accessible label for the overhead companion action badge strip. */
export const LABELING_WILDLIFE_PET_COMPANION_CARE_BADGE_TOOLBAR =
  'Companion care and commands' as const;

/**
 * Column: badge strip above the companion name (centered on the name-tag slot).
 */
export const STYLING_WILDLIFE_PET_COMPANION_CARE_ACTION_STACK_CLASS_NAME =
  'pointer-events-auto flex flex-col items-center justify-center gap-1' as const;

/** Horizontal strip of care / command badges above the name. */
export const STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ROW_CLASS_NAME =
  'pointer-events-auto flex max-w-[min(100vw,220px)] flex-wrap items-center justify-center gap-0.5' as const;

/** Circular Pet / Feed trigger (icon only). */
export const STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_CLASS_NAME =
  'world-plaza-companion-care-badge pointer-events-auto inline-flex size-4 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-white/35 bg-black/60 text-white shadow-sm shadow-black/40 backdrop-blur-[2px] transition-[transform,background-color,border-color,opacity] hover:border-white/55 hover:bg-black/75 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45' as const;

/** Circular Follow / Stay / Attack / Defend command trigger (icon only, gold). */
export const STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME =
  'world-plaza-companion-command-badge pointer-events-auto inline-flex size-4 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-poster-gold/45 bg-black/60 text-poster-gold shadow-sm shadow-black/40 backdrop-blur-[2px] transition-[transform,background-color,border-color,opacity] hover:border-poster-gold/70 hover:bg-black/75 hover:text-[#ffe08a] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45' as const;

/** Active command badge (current Follow / Stay / etc.). */
export const STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ACTIVE_CLASS_NAME =
  'world-plaza-companion-command-badge-active border-poster-gold/80 bg-[linear-gradient(180deg,rgba(44,74,82,0.92)_0%,rgba(26,48,56,0.92)_100%)] text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.28),0_2px_6px_rgba(0,0,0,0.45)] hover:border-poster-gold hover:bg-[linear-gradient(180deg,rgba(44,74,82,0.98)_0%,rgba(26,48,56,0.98)_100%)] hover:text-[#ffe08a]' as const;

/** Icon slot inside a care / command badge. */
export const STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_CLASS_NAME =
  'block shrink-0 text-current' as const;

/**
 * @deprecated Prefer {@link STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME}.
 * Kept so older imports keep compiling during the badge swap.
 */
export const STYLING_WILDLIFE_PET_COMPANION_COMMAND_LABEL_BUTTON_CLASS_NAME =
  STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME;
