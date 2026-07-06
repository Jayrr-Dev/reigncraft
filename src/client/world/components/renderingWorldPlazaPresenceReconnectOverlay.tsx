'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_ACTIONS_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BODY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_HIDDEN_MESSAGE,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_IDLE_MESSAGE,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_MESSAGE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_TITLE,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_PANEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_TITLE_CLASS_NAME,
  type DefiningWorldPlazaPresenceDisconnectReason,
} from '@/components/world/domains/definingWorldPlazaPresenceDisconnectConstants';

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
    disconnectReason === 'idle'
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
      <div className={DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_PANEL_CLASS_NAME}>
        <div
          className={DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BODY_CLASS_NAME}
        >
          <p
            id="world-plaza-presence-reconnect-title"
            className={DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_TITLE_CLASS_NAME}
          >
            {DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_OVERLAY_TITLE}
          </p>
          <p
            id="world-plaza-presence-reconnect-message"
            className={
              DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_MESSAGE_CLASS_NAME
            }
          >
            {disconnectMessage}
          </p>
        </div>
        <div
          className={DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_ACTIONS_CLASS_NAME}
        >
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_CLASS_NAME
            }
            onClick={onReconnect}
          >
            {DEFINING_WORLD_PLAZA_PRESENCE_RECONNECT_BUTTON_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
