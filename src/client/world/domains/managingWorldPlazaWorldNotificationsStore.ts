/**
 * Transient worldNotifications queue for the upper-quarter HUD slot.
 *
 * @module components/world/domains/managingWorldPlazaWorldNotificationsStore
 */

export type DefiningWorldPlazaWorldNotificationKind =
  | 'controls-hint'
  | 'biome-region-discovery';

export type DefiningWorldPlazaWorldNotification = {
  readonly id: string;
  readonly kind: DefiningWorldPlazaWorldNotificationKind;
  readonly message: string;
  readonly createdAtMs: number;
};

const managingWorldPlazaWorldNotificationsSubscribers = new Set<() => void>();

let managingWorldPlazaWorldNotificationsQueue: readonly DefiningWorldPlazaWorldNotification[] =
  [];
let managingWorldPlazaWorldNotificationsNextId = 1;

function notifyingWorldPlazaWorldNotificationsSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaWorldNotificationsSubscribers) {
    onStoreChange();
  }
}

/** Snapshot of pending world notifications (oldest first). */
export function gettingWorldPlazaWorldNotificationsSnapshot(): readonly DefiningWorldPlazaWorldNotification[] {
  return managingWorldPlazaWorldNotificationsQueue;
}

/**
 * Enqueues a world notification for the shared HUD slot.
 *
 * @param kind - Notification kind.
 * @param message - Player-facing text.
 */
export function enqueueingWorldPlazaWorldNotification(
  kind: DefiningWorldPlazaWorldNotificationKind,
  message: string
): void {
  const notification: DefiningWorldPlazaWorldNotification = {
    id: `world-notification-${managingWorldPlazaWorldNotificationsNextId}`,
    kind,
    message,
    createdAtMs: Date.now(),
  };
  managingWorldPlazaWorldNotificationsNextId += 1;
  managingWorldPlazaWorldNotificationsQueue = [
    ...managingWorldPlazaWorldNotificationsQueue,
    notification,
  ];
  notifyingWorldPlazaWorldNotificationsSubscribers();
}

/**
 * Removes a world notification after it finishes fading out.
 *
 * @param notificationId - Id returned in the snapshot entry.
 */
export function dismissingWorldPlazaWorldNotification(
  notificationId: string
): void {
  const nextQueue = managingWorldPlazaWorldNotificationsQueue.filter(
    (entry) => entry.id !== notificationId
  );

  if (nextQueue.length === managingWorldPlazaWorldNotificationsQueue.length) {
    return;
  }

  managingWorldPlazaWorldNotificationsQueue = nextQueue;
  notifyingWorldPlazaWorldNotificationsSubscribers();
}

/**
 * Subscribes to world notification queue changes.
 *
 * @param onStoreChange - Callback when the queue changes.
 */
export function subscribingWorldPlazaWorldNotifications(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaWorldNotificationsSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaWorldNotificationsSubscribers.delete(onStoreChange);
  };
}
