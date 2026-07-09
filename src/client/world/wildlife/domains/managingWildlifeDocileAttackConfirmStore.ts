/**
 * Pending Betray? selection for unauthorized docile wildlife.
 *
 * @module components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore
 */

export type ManagingWildlifeDocileAttackConfirmPending = {
  instanceId: string;
  displayName: string;
  damageAmount: number;
  projectileArchetypeId?: string;
};

type ManagingWildlifeDocileAttackConfirmListener = (
  pending: ManagingWildlifeDocileAttackConfirmPending | null
) => void;

let pendingAttack: ManagingWildlifeDocileAttackConfirmPending | null = null;
const listeners = new Set<ManagingWildlifeDocileAttackConfirmListener>();

function notifyingWildlifeDocileAttackConfirmListeners(): void {
  for (const listener of listeners) {
    listener(pendingAttack);
  }
}

/** Returns the current pending Betray? selection, if any. */
export function readingWildlifeDocileAttackConfirmPending(): ManagingWildlifeDocileAttackConfirmPending | null {
  return pendingAttack;
}

/** Queues one Betray? selection (replaces any prior pending). */
export function settingWildlifeDocileAttackConfirmPending(
  pending: ManagingWildlifeDocileAttackConfirmPending
): void {
  pendingAttack = pending;
  notifyingWildlifeDocileAttackConfirmListeners();
}

/** Clears the pending Betray? selection. */
export function clearingWildlifeDocileAttackConfirmPending(): void {
  if (pendingAttack === null) {
    return;
  }

  pendingAttack = null;
  notifyingWildlifeDocileAttackConfirmListeners();
}

/** Subscribes to pending Betray? changes; returns unsubscribe. */
export function subscribingWildlifeDocileAttackConfirmPending(
  listener: ManagingWildlifeDocileAttackConfirmListener
): () => void {
  listeners.add(listener);
  listener(pendingAttack);

  return () => {
    listeners.delete(listener);
  };
}
