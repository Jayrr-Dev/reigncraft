/**
 * Copy and layout for the plaza entity death screen overlay.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants
 */

/** Full-screen opaque blackout while the player is dead or waking up. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME =
  'pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black' as const;

/** Centered stack: title + flavor. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_STACK_CLASS_NAME =
  'plaza-death-screen-stack flex max-w-[min(92vw,42rem)] flex-col items-center gap-3 px-4' as const;

/** Dark Souls-style death title typography (font size set by fit hook). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME =
  'plaza-death-screen-title font-display max-w-full whitespace-nowrap font-normal uppercase tracking-[0.14em] text-[#8b2323]' as const;

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

/**
 * Widest letter-spacing used during the title enter animation.
 * Fit measures at this spacing so the zoom-in never wraps mid-animation.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_FIT_LETTER_SPACING_EM = 0.28;

/** Default death title when the killing blow has no source kind. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_DEFAULT_TITLE =
  'YOU DIED' as const;

/** Auto-respawn delay after death (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_AUTO_RESPAWN_MS = 5000;

/** Blackout fade-in duration when death begins (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_FADE_IN_MS = 2800;

/** Death title zoom-in duration (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_ENTER_MS = 3000;

/** Delay before the death title begins its zoom-in (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_ENTER_DELAY_MS = 450;

/** Slow wake-up fade-out after respawn (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_WAKE_FADE_OUT_MS = 3200;
