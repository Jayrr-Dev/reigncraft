'use client';

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import {
  LABELING_WORLD_PLAZA_KEYBOARD_CONTROLS_HINT,
  LABELING_WORLD_PLAZA_MOBILE_CONTROLS_HINT,
} from '@/components/world/domains/definingWorldPlazaKeyboardInputConstants';
import {
  DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_CLASS_NAME,
  DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_FADE_IN_MS,
  DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_FADE_OUT_MS,
  DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_VISIBLE_MS,
  DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_CONTROLS_HINT_VISIBLE_MS,
} from '@/components/world/domains/definingWorldPlazaWorldNotificationsConstants';
import {
  dismissingWorldPlazaWorldNotification,
  enqueueingWorldPlazaWorldNotification,
  gettingWorldPlazaWorldNotificationsSnapshot,
  subscribingWorldPlazaWorldNotifications,
  type DefiningWorldPlazaWorldNotification,
} from '@/components/world/domains/managingWorldPlazaWorldNotificationsStore';
import { useEffect, useState, useSyncExternalStore } from 'react';

const RENDERING_WORLD_PLAZA_WORLD_NOTIFICATIONS_ANCHOR_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
    .worldNotifications.anchorClassName;

export type RenderingWorldPlazaWorldNotificationsProps = {
  /** When true, shows mobile-oriented control hints. */
  isMobile?: boolean;
};

/**
 * Shared upper-quarter HUD slot for controls hints and biome region discovery
 * names (worldNotifications).
 */
export function RenderingWorldPlazaWorldNotifications({
  isMobile = false,
}: RenderingWorldPlazaWorldNotificationsProps): React.JSX.Element | null {
  const queue = useSyncExternalStore(
    subscribingWorldPlazaWorldNotifications,
    gettingWorldPlazaWorldNotificationsSnapshot,
    () => []
  );

  useEffect(() => {
    enqueueingWorldPlazaWorldNotification(
      'controls-hint',
      isMobile
        ? LABELING_WORLD_PLAZA_MOBILE_CONTROLS_HINT
        : LABELING_WORLD_PLAZA_KEYBOARD_CONTROLS_HINT
    );
  }, [isMobile]);

  const activeNotification = queue[0] ?? null;

  if (!activeNotification) {
    return null;
  }

  return (
    <RenderingWorldPlazaWorldNotificationEntry
      key={activeNotification.id}
      notification={activeNotification}
    />
  );
}

type RenderingWorldPlazaWorldNotificationEntryProps = {
  notification: DefiningWorldPlazaWorldNotification;
};

function RenderingWorldPlazaWorldNotificationEntry({
  notification,
}: RenderingWorldPlazaWorldNotificationEntryProps): React.JSX.Element {
  const isBiomeDiscovery = notification.kind === 'biome-region-discovery';
  const visibleDurationMs = isBiomeDiscovery
    ? DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_VISIBLE_MS
    : DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_CONTROLS_HINT_VISIBLE_MS;
  const fadeInMs = isBiomeDiscovery
    ? DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_FADE_IN_MS
    : 0;
  const fadeOutMs = isBiomeDiscovery
    ? DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_FADE_OUT_MS
    : 700;

  const [opacity, setOpacity] = useState(fadeInMs > 0 ? 0 : 1);

  useEffect(() => {
    let fadeInFrame = 0;
    let fadeOutTimer = 0;
    let dismissTimer = 0;

    if (fadeInMs > 0) {
      fadeInFrame = window.requestAnimationFrame(() => {
        setOpacity(1);
      });
    }

    fadeOutTimer = window.setTimeout(() => {
      setOpacity(0);
    }, fadeInMs + visibleDurationMs);

    dismissTimer = window.setTimeout(() => {
      dismissingWorldPlazaWorldNotification(notification.id);
    }, fadeInMs + visibleDurationMs + fadeOutMs);

    return () => {
      if (fadeInFrame !== 0) {
        window.cancelAnimationFrame(fadeInFrame);
      }
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [fadeInMs, fadeOutMs, notification.id, visibleDurationMs]);

  const transitionDurationMs =
    opacity === 0 && fadeInMs > 0 ? fadeOutMs : fadeInMs > 0 ? fadeInMs : fadeOutMs;

  return (
    <div
      className={RENDERING_WORLD_PLAZA_WORLD_NOTIFICATIONS_ANCHOR_CLASS}
      style={{
        opacity,
        transitionDuration: `${transitionDurationMs}ms`,
      }}
      aria-live={isBiomeDiscovery ? 'polite' : undefined}
      aria-hidden={isBiomeDiscovery ? undefined : true}
    >
      {isBiomeDiscovery ? (
        <span
          className={DEFINING_WORLD_PLAZA_WORLD_NOTIFICATION_BIOME_NAME_CLASS_NAME}
        >
          {notification.message}
        </span>
      ) : (
        <span className={STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS}>
          {notification.message}
        </span>
      )}
    </div>
  );
}
