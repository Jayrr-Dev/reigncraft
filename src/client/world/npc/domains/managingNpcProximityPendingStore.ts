/**
 * Pending NPC proximity selection (one active target).
 *
 * @module components/world/npc/domains/managingNpcProximityPendingStore
 */

import type { DefiningNpcId } from '@/components/world/npc/domains/definingNpcTypes';

export type ManagingNpcProximityPending = {
  readonly npcId: DefiningNpcId;
  readonly displayName: string;
};

type ManagingNpcProximityPendingListener = (
  pending: ManagingNpcProximityPending | null
) => void;

let pendingNpc: ManagingNpcProximityPending | null = null;
const listeners = new Set<ManagingNpcProximityPendingListener>();

function notifyingNpcProximityPendingListeners(): void {
  for (const listener of listeners) {
    listener(pendingNpc);
  }
}

export function readingNpcProximityPending(): ManagingNpcProximityPending | null {
  return pendingNpc;
}

export function settingNpcProximityPending(
  pending: ManagingNpcProximityPending
): void {
  pendingNpc = pending;
  notifyingNpcProximityPendingListeners();
}

export function clearingNpcProximityPending(): void {
  if (pendingNpc === null) {
    return;
  }

  pendingNpc = null;
  notifyingNpcProximityPendingListeners();
}

export function subscribingNpcProximityPending(
  listener: ManagingNpcProximityPendingListener
): () => void {
  listeners.add(listener);
  listener(pendingNpc);

  return () => {
    listeners.delete(listener);
  };
}
