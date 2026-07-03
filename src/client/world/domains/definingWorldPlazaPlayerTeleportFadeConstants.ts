/**
 * Screen fade tuning for player teleports.
 *
 * @module components/world/domains/definingWorldPlazaPlayerTeleportFadeConstants
 */

/** Duration of the fade-to-black before the teleport executes. */
export const DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OUT_MS = 280;

/** Duration to hold full black while the avatar position updates. */
export const DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_HOLD_MS = 80;

/** Duration of the fade back in after the teleport completes. */
export const DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_IN_MS = 380;

/** Full-screen blackout overlay above plaza HUD and Pixi canvas. */
export const DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OVERLAY_CLASS_NAME =
  "pointer-events-auto absolute inset-0 z-50 bg-black" as const;

/** CSS easing shared by fade-out and fade-in transitions. */
export const DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_EASING =
  "ease-in-out" as const;
