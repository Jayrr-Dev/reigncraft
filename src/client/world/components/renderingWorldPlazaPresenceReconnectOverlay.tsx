"use client";

import {
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_HIDDEN_MESSAGE,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_IDLE_MESSAGE,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_TITLE,
  type DefiningWorldPlazaPresenceDisconnectReason,
} from "@/components/world/domains/definingWorldPlazaPresenceDisconnectConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

export interface RenderingWorldPlazaPresenceReconnectOverlayProps {
  /** When true, blocks play until the user reconnects. */
  isVisible: boolean;
  /** Why the client left the room. */
  disconnectReason: DefiningWorldPlazaPresenceDisconnectReason | null;
  /** Rejoins the plaza online room. */
  onReconnect: () => void;
}

/**
 * Manual reconnect prompt after a tab-hidden or idle presence disconnect.
 */
export function RenderingWorldPlazaPresenceReconnectOverlay({
  isVisible,
  disconnectReason,
  onReconnect,
}: RenderingWorldPlazaPresenceReconnectOverlayProps): React.JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  const disconnectMessage =
    disconnectReason === "idle"
      ? DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_IDLE_MESSAGE
      : DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_HIDDEN_MESSAGE;

  return (
    <div
      className={DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_CLASS_NAME}
      role="dialog"
      aria-modal="true"
      aria-labelledby="world-plaza-presence-reconnect-title"
      aria-describedby="world-plaza-presence-reconnect-message"
    >
      <div className="max-w-sm space-y-4">
        <p
          id="world-plaza-presence-reconnect-title"
          className="text-base font-semibold text-white"
        >
          {DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_TITLE}
        </p>
        <p
          id="world-plaza-presence-reconnect-message"
          className="text-sm text-white/80"
        >
          {disconnectMessage}
        </p>
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          className={DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_CLASS_NAME}
          onClick={onReconnect}
        >
          {DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
}
