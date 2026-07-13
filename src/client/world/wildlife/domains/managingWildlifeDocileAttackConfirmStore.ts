/**
 * Pending Pet selection for living cats and dogs.
 *
 * @module components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore
 */

import type { DefiningWildlifeDocilePetKind } from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ManagingWildlifeDocileAttackConfirmPending = {
  instanceId: string;
  speciesId: DefiningWildlifeSpeciesId;
  displayName: string;
  petKind: DefiningWildlifeDocilePetKind;
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

/** Returns the current pending Pet selection, if any. */
export function readingWildlifeDocileAttackConfirmPending(): ManagingWildlifeDocileAttackConfirmPending | null {
  return pendingAttack;
}

/** Queues one Pet selection (replaces any prior pending). */
export function settingWildlifeDocileAttackConfirmPending(
  pending: ManagingWildlifeDocileAttackConfirmPending
): void {
  pendingAttack = pending;
  notifyingWildlifeDocileAttackConfirmListeners();
}

/** Clears the pending Pet selection. */
export function clearingWildlifeDocileAttackConfirmPending(): void {
  if (pendingAttack === null) {
    return;
  }

  pendingAttack = null;
  notifyingWildlifeDocileAttackConfirmListeners();
}

/** Subscribes to pending Pet changes; returns unsubscribe. */
export function subscribingWildlifeDocileAttackConfirmPending(
  listener: ManagingWildlifeDocileAttackConfirmListener
): () => void {
  listeners.add(listener);
  listener(pendingAttack);

  return () => {
    listeners.delete(listener);
  };
}
