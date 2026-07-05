/**
 * Copy and layout for the plaza entity death screen overlay.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants
 */

/** Full-screen opaque blackout while the player is dead or waking up. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME =
  'pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black' as const;

/** Dark Souls-style death title typography. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_CLASS_NAME =
  'plaza-death-screen-title font-display text-[clamp(2.25rem,7vw,4rem)] font-normal uppercase tracking-[0.14em] text-[#8b2323]' as const;

/** Default death title when the killing blow has no source kind. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_DEFAULT_TITLE =
  'YOU DIED' as const;

/** Auto-respawn delay after death (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_AUTO_RESPAWN_MS = 5000;

/** Blackout fade-in duration when death begins (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_FADE_IN_MS = 1400;

/** Death title zoom-in duration (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_ENTER_MS = 3000;

/** Delay before the death title begins its zoom-in (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_ENTER_DELAY_MS = 450;

/** Slow wake-up fade-out after respawn (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_WAKE_FADE_OUT_MS = 3200;
