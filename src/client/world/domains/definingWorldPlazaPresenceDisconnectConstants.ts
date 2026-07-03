/**
 * Plaza presence disconnect thresholds and overlay copy.
 *
 * @module components/world/domains/definingWorldPlazaPresenceDisconnectConstants
 */

/** Disconnect when the tab is hidden or the user is idle this long (ms). */
export const DEFINING_WORLD_PLAZA_PRESENCE_IDLE_DISCONNECT_MS = 5 * 60 * 1000;

/** Poll interval for held movement keys and click-to-walk (ms). */
export const DEFINING_WORLD_PLAZA_PRESENCE_LOCOMOTION_ACTIVITY_POLL_MS = 30_000;

/** DOM events that count as plaza user activity. */
export const DEFINING_WORLD_PLAZA_PRESENCE_ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
] as const;

/** Why the local client left the online room. */
export type DefiningWorldPlazaPresenceDisconnectReason = "hidden" | "idle";

/** Overlay panel classes (above HUD, below mobile rotate prompt). */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_CLASS_NAME =
  "pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/75 px-6 text-center" as const;

/** Reconnect overlay title. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_TITLE =
  "Disconnected from the room" as const;

/** Copy when the tab was in the background. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_HIDDEN_MESSAGE =
  "You switched away from this tab. Reconnect to appear online again." as const;

/** Copy when idle timeout fired. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_IDLE_MESSAGE =
  "You were inactive for five minutes. Reconnect to appear online again." as const;

/** Reconnect button label. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_LABEL =
  "Reconnect" as const;

/** Reconnect button classes. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_CLASS_NAME =
  "rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/75" as const;
