/**
 * In-world HUD toast styling and timing for transient gameplay feedback.
 *
 * @module components/world/domains/definingWorldPlazaGameplayHudToastConstants
 */

/** How long a gameplay HUD toast stays visible before fading out (ms). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_VISIBLE_DURATION_MS = 3200;

/** Fade-out transition duration after the toast expires (ms). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_FADE_DURATION_MS = 700;

export const STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_ANCHOR_CLASS =
  'pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center transition-opacity ease-out' as const;

export const STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS =
  'select-none rounded-full bg-poster-teal-deep/70 px-3 py-1 text-[10px] font-medium leading-none text-parchment/85 shadow-md shadow-black/25 backdrop-blur-sm' as const;
