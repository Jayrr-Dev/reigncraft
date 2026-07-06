/**
 * Plaza presence disconnect thresholds and overlay copy.
 *
 * @module components/world/domains/definingWorldPlazaPresenceDisconnectConstants
 */

import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';

/** Disconnect when the tab is hidden or the user is idle this long (ms). */
export const DEFINING_WORLD_PLAZA_PRESENCE_IDLE_DISCONNECT_MS = 5 * 60 * 1000;

/** Poll interval for held movement keys and click-to-walk (ms). */
export const DEFINING_WORLD_PLAZA_PRESENCE_LOCOMOTION_ACTIVITY_POLL_MS = 30_000;

/** DOM events that count as plaza user activity. */
export const DEFINING_WORLD_PLAZA_PRESENCE_ACTIVITY_EVENTS = [
  'pointerdown',
  'keydown',
  'wheel',
  'touchstart',
] as const;

/** Why the local client left the online room. */
export type DefiningWorldPlazaPresenceDisconnectReason = 'hidden' | 'idle';

/** Overlay panel classes (above HUD, below mobile rotate prompt). */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayAbsolute;

/** Reconnect overlay panel shell. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_PANEL_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel;

/** Reconnect overlay title typography. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_TITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.title;

/** Reconnect overlay message typography. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_MESSAGE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.message;

/** Reconnect overlay body layout. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BODY_CLASS_NAME = `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.body} text-center`;

/** Reconnect overlay action row layout. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_ACTIONS_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.actions;

/** Reconnect overlay title. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_TITLE =
  'Disconnected from the room' as const;

/** Copy when the tab was in the background. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_HIDDEN_MESSAGE =
  'You switched away from this tab. Reconnect to appear online again.' as const;

/** Copy when idle timeout fired. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_IDLE_MESSAGE =
  'You were inactive for five minutes. Reconnect to appear online again.' as const;

/** Reconnect button label. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_LABEL =
  'Reconnect' as const;

/** Reconnect button classes. */
export const DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.singleActionButton;
