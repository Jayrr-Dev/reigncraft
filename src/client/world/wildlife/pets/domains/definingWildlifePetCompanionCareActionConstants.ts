/**
 * Care / command overhead badges for named Familiar+ companions.
 * Badges sit in a row above the companion name after the reveal dwell.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetCompanionCareActionConstants
 */

/**
 * Below this hunger ratio, a bonded pet seeks the owner (follow) and Feed is
 * available. Matches the player well-fed cutoff (75%).
 */
export const DEFINING_WILDLIFE_PET_FEED_HUNGER_RATIO_THRESHOLD = 0.75 as const;

/** Hover / near dwell before care + command badges appear above the name. */
export const DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTIONS_REVEAL_MS =
  5_000 as const;

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

/** Glyph edge length inside care / command badges. */
export const DEFINING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_SIZE_PX =
  10 as const;

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
  'pointer-events-auto flex max-w-[min(100vw,220px)] flex-wrap items-center justify-center gap-1' as const;

/** Shared shell for Pet / Feed care badges. */
export const STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_CLASS_NAME =
  'world-plaza-companion-care-badge pointer-events-auto inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-0.5 rounded-md border border-white/35 bg-black/60 px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-[0.06em] text-white shadow-sm shadow-black/40 backdrop-blur-[2px] transition-[transform,background-color,border-color,opacity] hover:border-white/55 hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-45' as const;

/** Follow / Stay / Attack / Defend command badges (gold order chrome). */
export const STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME =
  'world-plaza-companion-command-badge pointer-events-auto inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-0.5 rounded-md border border-poster-gold/45 bg-black/60 px-1.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-[0.06em] text-poster-gold shadow-sm shadow-black/40 backdrop-blur-[2px] transition-[transform,background-color,border-color,opacity] hover:border-poster-gold/70 hover:bg-black/75 hover:text-[#ffe08a] disabled:cursor-not-allowed disabled:opacity-45' as const;

/** Active command badge (current Follow / Stay / etc.). */
export const STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_ACTIVE_CLASS_NAME =
  'world-plaza-companion-command-badge-active border-poster-gold/80 bg-[linear-gradient(180deg,rgba(44,74,82,0.92)_0%,rgba(26,48,56,0.92)_100%)] text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.28),0_2px_6px_rgba(0,0,0,0.45)] hover:border-poster-gold hover:bg-[linear-gradient(180deg,rgba(44,74,82,0.98)_0%,rgba(26,48,56,0.98)_100%)] hover:text-[#ffe08a]' as const;

/** Icon slot inside a care / command badge. */
export const STYLING_WILDLIFE_PET_COMPANION_CARE_BADGE_ICON_CLASS_NAME =
  'shrink-0 text-current' as const;

/**
 * @deprecated Prefer {@link STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME}.
 * Kept so older imports keep compiling during the badge swap.
 */
export const STYLING_WILDLIFE_PET_COMPANION_COMMAND_LABEL_BUTTON_CLASS_NAME =
  STYLING_WILDLIFE_PET_COMPANION_COMMAND_BADGE_CLASS_NAME;
