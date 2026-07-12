/**
 * Copy and layout for the plaza entity death screen overlay.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants
 */

/** Full-screen opaque blackout while the player is dead or waking up. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME =
  'pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black' as const;

/** Centered stack: rule, title, rule, flavor. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_STACK_CLASS_NAME =
  'plaza-death-screen-stack flex max-w-[min(92vw,42rem)] flex-col items-center justify-center gap-3 px-4 text-center' as const;

/** Thin horizontal rule with diamond tips (Souls-style frame). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_RULE_CLASS_NAME =
  'plaza-death-screen-rule' as const;

/** Dark Souls-style death title typography (font size set by fit hook). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME =
  'plaza-death-screen-title font-display max-w-full whitespace-nowrap text-center font-normal uppercase tracking-[0.14em] text-[#8b2323]' as const;

/**
 * Ladder flavor under the title.
 * Manus returns the soul; no afterlife destination (see lore/world/the-ladder.md).
 */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_CLASS_NAME =
  'plaza-death-screen-flavor font-body max-w-[min(90vw,28rem)] text-center text-[clamp(0.7rem,2.4vw,0.95rem)] font-normal uppercase leading-relaxed tracking-[0.18em] text-[#8b2323]' as const;

export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_FLAVOR_TEXT =
  'Your soul is with Manus. He will reforge you for the climb.' as const;

/** Preferred death title size when the line fits the overlay. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MAX_FONT_SIZE_PX = 64;

/** Smallest death title size when shrinking to avoid wrap. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MIN_FONT_SIZE_PX = 18;

/**
 * Fraction of overlay width the title may occupy.
 * Leaves side padding so long lines do not kiss the viewport edge.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_FIT_AVAILABLE_WIDTH_RATIO = 0.92;

/** Letter-spacing used when measuring title fit (matches rendered tracking). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_FIT_LETTER_SPACING_EM = 0.14;

/** Default death title when the killing blow has no source kind. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_DEFAULT_TITLE =
  'YOU DIED' as const;

/**
 * Delay after death before the death screen appears (ms).
 * Player corpse stays visible in-world until this elapses.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_SHOW_DELAY_MS = 3000;

/**
 * Auto-respawn delay after death (ms).
 * Includes show delay so the death screen is visible for several seconds.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_AUTO_RESPAWN_MS = 8000;

/** Slow wake-up fade-out after respawn (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_WAKE_FADE_OUT_MS = 3200;
