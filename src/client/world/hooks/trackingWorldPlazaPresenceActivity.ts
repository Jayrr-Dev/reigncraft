"use client";

import {
  DEFINING_WORLD_PLAZA_PRESENCE_ACTIVITY_EVENTS,
  DEFINING_WORLD_PLAZA_PRESENCE_IDLE_DISCONNECT_MS,
  DEFINING_WORLD_PLAZA_PRESENCE_LOCOMOTION_ACTIVITY_POLL_MS,
  type DefiningWorldPlazaPresenceDisconnectReason,
} from "@/components/world/domains/definingWorldPlazaPresenceDisconnectConstants";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TrackingWorldPlazaPresenceActivityParams {
  /** When false, presence tracking stays idle and the room stays disconnected. */
  isEnabled: boolean;
}

export interface TrackingWorldPlazaPresenceActivityResult {
  /** When false, the Colyseus room should disconnect. */
  isPresenceConnected: boolean;
  /** True when the user should see the manual reconnect overlay. */
  isPresenceReconnectOverlayVisible: boolean;
  /** Why the client disconnected; null while connected. */
  presenceDisconnectReason: DefiningWorldPlazaPresenceDisconnectReason | null;
  /** Rejoins the plaza room after a presence disconnect. */
  reconnectingPresence: () => void;
  /** Bump last-activity time (e.g. from movement sync). */
  markingPresenceActivityRef: React.RefObject<(() => void) | null>;
  /** Returns true when avatar locomotion is active; polled by the hook. */
  registeringLocomotionActivityRef: React.RefObject<(() => boolean) | null>;
}

/**
 * Disconnects the plaza room when the tab is hidden or the user is idle for
 * five minutes. Shows a manual reconnect prompt when they return.
 */
export function trackingWorldPlazaPresenceActivity({
  isEnabled,
}: TrackingWorldPlazaPresenceActivityParams): TrackingWorldPlazaPresenceActivityResult {
  const [isPresenceConnected, setIsPresenceConnected] = useState(true);
  const [isAwaitingPresenceReconnect, setIsAwaitingPresenceReconnect] =
    useState(false);
  const [presenceDisconnectReason, setPresenceDisconnectReason] =
    useState<DefiningWorldPlazaPresenceDisconnectReason | null>(null);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document !== "undefined" && !document.hidden,
  );

  const lastActivityAtMsRef = useRef(Date.now());
  const idleTimeoutIdRef = useRef(0);
  const isPresenceConnectedRef = useRef(true);
  const markingPresenceActivityRef = useRef<(() => void) | null>(null);
  const registeringLocomotionActivityRef = useRef<(() => boolean) | null>(null);

  isPresenceConnectedRef.current = isPresenceConnected;

  const clearingIdleDisconnectTimeout = useCallback((): void => {
    window.clearTimeout(idleTimeoutIdRef.current);
    idleTimeoutIdRef.current = 0;
  }, []);

  const disconnectingPresence = useCallback(
    (reason: DefiningWorldPlazaPresenceDisconnectReason): void => {
      if (!isPresenceConnectedRef.current) {
        return;
      }

      clearingIdleDisconnectTimeout();
      isPresenceConnectedRef.current = false;
      setIsPresenceConnected(false);
      setIsAwaitingPresenceReconnect(true);
      setPresenceDisconnectReason(reason);
    },
    [clearingIdleDisconnectTimeout],
  );

  const schedulingIdleDisconnect = useCallback((): void => {
    clearingIdleDisconnectTimeout();

    if (!isEnabled || !isPresenceConnectedRef.current) {
      return;
    }

    if (typeof document !== "undefined" && document.hidden) {
      return;
    }

    idleTimeoutIdRef.current = window.setTimeout(() => {
      if (!isPresenceConnectedRef.current) {
        return;
      }

      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      const idleDurationMs = Date.now() - lastActivityAtMsRef.current;

      if (idleDurationMs >= DEFINING_WORLD_PLAZA_PRESENCE_IDLE_DISCONNECT_MS) {
        disconnectingPresence("idle");
      }
    }, DEFINING_WORLD_PLAZA_PRESENCE_IDLE_DISCONNECT_MS);
  }, [clearingIdleDisconnectTimeout, disconnectingPresence, isEnabled]);

  const markingPresenceActivity = useCallback((): void => {
    if (!isEnabled || !isPresenceConnectedRef.current) {
      return;
    }

    lastActivityAtMsRef.current = Date.now();
    schedulingIdleDisconnect();
  }, [isEnabled, schedulingIdleDisconnect]);

  markingPresenceActivityRef.current = markingPresenceActivity;

  const reconnectingPresence = useCallback((): void => {
    lastActivityAtMsRef.current = Date.now();
    isPresenceConnectedRef.current = true;
    setIsPresenceConnected(true);
    setIsAwaitingPresenceReconnect(false);
    setPresenceDisconnectReason(null);
    schedulingIdleDisconnect();
  }, [schedulingIdleDisconnect]);

  useEffect(() => {
    if (isEnabled) {
      return;
    }

    clearingIdleDisconnectTimeout();
    isPresenceConnectedRef.current = true;
    setIsPresenceConnected(true);
    setIsAwaitingPresenceReconnect(false);
    setPresenceDisconnectReason(null);
  }, [clearingIdleDisconnectTimeout, isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handlingVisibilityChange = (): void => {
      const isVisible = !document.hidden;
      setIsDocumentVisible(isVisible);

      if (!isVisible) {
        disconnectingPresence("hidden");
        return;
      }
    };

    document.addEventListener("visibilitychange", handlingVisibilityChange);

    if (document.hidden) {
      handlingVisibilityChange();
    }

    return () => {
      document.removeEventListener("visibilitychange", handlingVisibilityChange);
    };
  }, [disconnectingPresence, isEnabled]);

  useEffect(() => {
    if (!isEnabled || !isPresenceConnected) {
      clearingIdleDisconnectTimeout();
      return;
    }

    const handlingActivity = (): void => {
      markingPresenceActivity();
    };

    for (const eventName of DEFINING_WORLD_PLAZA_PRESENCE_ACTIVITY_EVENTS) {
      document.addEventListener(eventName, handlingActivity, {
        capture: true,
        passive: true,
      });
    }

    lastActivityAtMsRef.current = Date.now();
    schedulingIdleDisconnect();

    return () => {
      for (const eventName of DEFINING_WORLD_PLAZA_PRESENCE_ACTIVITY_EVENTS) {
        document.removeEventListener(eventName, handlingActivity, {
          capture: true,
        });
      }
      clearingIdleDisconnectTimeout();
    };
  }, [
    clearingIdleDisconnectTimeout,
    isEnabled,
    isPresenceConnected,
    markingPresenceActivity,
    schedulingIdleDisconnect,
  ]);

  useEffect(() => {
    if (!isEnabled || !isPresenceConnected) {
      return;
    }

    const pollingLocomotionActivity = (): void => {
      if (registeringLocomotionActivityRef.current?.()) {
        markingPresenceActivity();
      }
    };

    const intervalId = window.setInterval(
      pollingLocomotionActivity,
      DEFINING_WORLD_PLAZA_PRESENCE_LOCOMOTION_ACTIVITY_POLL_MS,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, isPresenceConnected, markingPresenceActivity]);

  const isPresenceReconnectOverlayVisible =
    isEnabled && isAwaitingPresenceReconnect && isDocumentVisible;

  return {
    isPresenceConnected,
    isPresenceReconnectOverlayVisible,
    presenceDisconnectReason,
    reconnectingPresence,
    markingPresenceActivityRef,
    registeringLocomotionActivityRef,
  };
}
