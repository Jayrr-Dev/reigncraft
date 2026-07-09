/**
 * Timing and copy for the worldNotifications HUD slot.
 *
 * Shared by controls hints and first-discovery named realm reveals.
 *
 * @module components/world/domains/definingWorldPlazaWorldNotificationsConstants
 */

/** How long a named realm discovery name stays fully visible (ms). */
export const DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_REALM_NAME_VISIBLE_MS =
  4_500;

/** Fade-in duration for named realm discovery names (ms). */
export const DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_REALM_NAME_FADE_IN_MS =
  900;

/** Fade-out duration after the visible window (ms). */
export const DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_REALM_NAME_FADE_OUT_MS =
  1_200;

/** How long the boot controls hint stays visible before fading out (ms). */
export const DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_CONTROLS_HINT_VISIBLE_MS =
  6_000;

/** Large display classes for first-discovery named realm titles. */
export const DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_REALM_NAME_CLASS_NAME =
  'select-none px-4 text-center font-display text-2xl font-semibold tracking-[0.08em] text-parchment drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-3xl md:text-4xl' as const;

/**
 * Builds the first-spawn welcome title for a named realm.
 *
 * @param realmDisplayName - Full realm title (e.g. "Kingdom of Westville").
 */
export function formattingWorldPlazaNamedRealmWelcomeMessage(
  realmDisplayName: string
): string {
  return `Welcome to ${realmDisplayName}`;
}
