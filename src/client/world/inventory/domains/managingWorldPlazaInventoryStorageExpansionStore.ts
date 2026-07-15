/**
 * Module-level store for bonus inventory storage-row unlocks (max 3).
 *
 * @module components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore
 */

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS,
  resolvingWorldPlazaInventoryStorageExpansionCodexClaimKey,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { readingWorldPlazaInventoryStorageExpansionFromStorage } from '@/components/world/inventory/domains/readingWorldPlazaInventoryStorageExpansionFromStorage';
import { resolvingWorldPlazaInventoryClampedBonusStorageRows } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryCapacity';
import { writingWorldPlazaInventoryStorageExpansionToStorage } from '@/components/world/inventory/domains/writingWorldPlazaInventoryStorageExpansionToStorage';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

const managingWorldPlazaInventoryStorageExpansionSubscribers = new Set<
  () => void
>();

const MANAGING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_EMPTY_CLAIMED_SNAPSHOT: readonly string[] =
  [];

let managingWorldPlazaInventoryStorageExpansionStorageOwnerId: string | null =
  null;
let managingWorldPlazaInventoryStorageExpansionCloudSaveSlotIndex: PlazaSaveSlotIndex | null =
  null;
let managingWorldPlazaInventoryStorageExpansionBonusRows = 0;
let managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys =
  new Set<string>();

function notifyingWorldPlazaInventoryStorageExpansionSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaInventoryStorageExpansionSubscribers) {
    onStoreChange();
  }
}

function mirroringWorldPlazaInventoryStorageExpansionToCloudSave(): void {
  if (managingWorldPlazaInventoryStorageExpansionCloudSaveSlotIndex === null) {
    return;
  }

  void savingPlazaSinglePlayerSaveSlotData(
    managingWorldPlazaInventoryStorageExpansionCloudSaveSlotIndex,
    {
      inventoryBonusStorageRows:
        managingWorldPlazaInventoryStorageExpansionBonusRows > 0
          ? managingWorldPlazaInventoryStorageExpansionBonusRows
          : null,
      inventoryStorageExpansionClaimedCodexKeys:
        managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys.size > 0
          ? [...managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys].sort()
          : null,
    }
  ).catch(() => {
    // Cloud mirror is best-effort; localStorage remains source for the session.
  });
}

function persistingWorldPlazaInventoryStorageExpansion(): void {
  writingWorldPlazaInventoryStorageExpansionToStorage(
    managingWorldPlazaInventoryStorageExpansionStorageOwnerId,
    managingWorldPlazaInventoryStorageExpansionBonusRows,
    managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys
  );
  mirroringWorldPlazaInventoryStorageExpansionToCloudSave();
}

export type InitializingWorldPlazaInventoryStorageExpansionStoreOptions = {
  readonly cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
};

/**
 * Hydrates bonus storage rows from localStorage for one session owner.
 */
export function initializingWorldPlazaInventoryStorageExpansionStore(
  storageOwnerId: string | null,
  options?: InitializingWorldPlazaInventoryStorageExpansionStoreOptions
): void {
  const cloudSaveSlotIndex = options?.cloudSaveSlotIndex ?? null;

  if (
    managingWorldPlazaInventoryStorageExpansionStorageOwnerId === storageOwnerId
  ) {
    managingWorldPlazaInventoryStorageExpansionCloudSaveSlotIndex =
      cloudSaveSlotIndex;
    return;
  }

  managingWorldPlazaInventoryStorageExpansionStorageOwnerId = storageOwnerId;
  managingWorldPlazaInventoryStorageExpansionCloudSaveSlotIndex =
    cloudSaveSlotIndex;
  const snapshot =
    readingWorldPlazaInventoryStorageExpansionFromStorage(storageOwnerId);
  managingWorldPlazaInventoryStorageExpansionBonusRows =
    snapshot.bonusStorageRows;
  managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys = new Set(
    snapshot.claimedCodexKeys
  );
  notifyingWorldPlazaInventoryStorageExpansionSubscribers();
}

export type UnlockingWorldPlazaInventoryStorageRowResult =
  | 'unlocked'
  | 'at-cap';

/**
 * Unlocks one bonus storage row when under the cap.
 */
export function unlockingWorldPlazaInventoryStorageRow(): UnlockingWorldPlazaInventoryStorageRowResult {
  if (
    managingWorldPlazaInventoryStorageExpansionBonusRows >=
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS
  ) {
    return 'at-cap';
  }

  managingWorldPlazaInventoryStorageExpansionBonusRows += 1;
  persistingWorldPlazaInventoryStorageExpansion();
  notifyingWorldPlazaInventoryStorageExpansionSubscribers();
  return 'unlocked';
}

export type ClaimingWorldPlazaInventoryStorageExpansionCodexResult =
  | 'unlocked'
  | 'already-claimed'
  | 'at-cap';

/**
 * Claims a Codex storage-expansion chest (idempotent). Unlocks a row when under cap.
 */
export function claimingWorldPlazaInventoryStorageExpansionCodexReward(input: {
  readonly sectionId: string;
  readonly meterKind: string;
  readonly percent: number;
}): ClaimingWorldPlazaInventoryStorageExpansionCodexResult {
  const claimKey = resolvingWorldPlazaInventoryStorageExpansionCodexClaimKey(
    input
  );

  if (
    managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys.has(claimKey)
  ) {
    return 'already-claimed';
  }

  managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys = new Set(
    managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys
  );
  managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys.add(claimKey);

  if (
    managingWorldPlazaInventoryStorageExpansionBonusRows >=
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS
  ) {
    persistingWorldPlazaInventoryStorageExpansion();
    notifyingWorldPlazaInventoryStorageExpansionSubscribers();
    return 'at-cap';
  }

  managingWorldPlazaInventoryStorageExpansionBonusRows += 1;
  persistingWorldPlazaInventoryStorageExpansion();
  notifyingWorldPlazaInventoryStorageExpansionSubscribers();
  return 'unlocked';
}

export function checkingWorldPlazaInventoryStorageExpansionCodexClaimed(input: {
  readonly sectionId: string;
  readonly meterKind: string;
  readonly percent: number;
}): boolean {
  return managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys.has(
    resolvingWorldPlazaInventoryStorageExpansionCodexClaimKey(input)
  );
}

export function gettingWorldPlazaInventoryBonusStorageRows(): number {
  return managingWorldPlazaInventoryStorageExpansionBonusRows;
}

/** Sorted claimed Codex keys (for React subscriptions). */
export function gettingWorldPlazaInventoryStorageExpansionClaimedSnapshot(): readonly string[] {
  if (managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys.size === 0) {
    return MANAGING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_EMPTY_CLAIMED_SNAPSHOT;
  }

  return [
    ...managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys,
  ].sort();
}

export function checkingWorldPlazaInventoryStorageExpansionAtCap(): boolean {
  return (
    managingWorldPlazaInventoryStorageExpansionBonusRows >=
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS
  );
}

export function subscribingWorldPlazaInventoryStorageExpansion(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaInventoryStorageExpansionSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaInventoryStorageExpansionSubscribers.delete(onStoreChange);
  };
}

/**
 * Applies remote save-slot values into localStorage + live store for one owner.
 */
export function hydratingWorldPlazaInventoryStorageExpansionFromRemote(
  storageOwnerId: string,
  bonusStorageRows: number | null | undefined,
  claimedCodexKeys: readonly string[] | null | undefined
): void {
  const nextBonus = resolvingWorldPlazaInventoryClampedBonusStorageRows(
    typeof bonusStorageRows === 'number' ? bonusStorageRows : 0
  );
  const nextClaimed = new Set(
    (claimedCodexKeys ?? []).filter(
      (value): value is string => typeof value === 'string'
    )
  );

  writingWorldPlazaInventoryStorageExpansionToStorage(
    storageOwnerId,
    nextBonus,
    nextClaimed
  );

  if (
    managingWorldPlazaInventoryStorageExpansionStorageOwnerId === storageOwnerId
  ) {
    managingWorldPlazaInventoryStorageExpansionBonusRows = nextBonus;
    managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys = nextClaimed;
    notifyingWorldPlazaInventoryStorageExpansionSubscribers();
  }
}

export function clearingWorldPlazaInventoryStorageExpansionStoreForOwner(
  persistenceOwnerId: string
): void {
  if (
    managingWorldPlazaInventoryStorageExpansionStorageOwnerId !==
    persistenceOwnerId
  ) {
    return;
  }

  managingWorldPlazaInventoryStorageExpansionStorageOwnerId = null;
  managingWorldPlazaInventoryStorageExpansionCloudSaveSlotIndex = null;
  managingWorldPlazaInventoryStorageExpansionBonusRows = 0;
  managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys = new Set();
  notifyingWorldPlazaInventoryStorageExpansionSubscribers();
}

/** Test helper: clears in-memory state between unit tests. */
export function resettingWorldPlazaInventoryStorageExpansionStoreForTests(): void {
  managingWorldPlazaInventoryStorageExpansionStorageOwnerId = null;
  managingWorldPlazaInventoryStorageExpansionCloudSaveSlotIndex = null;
  managingWorldPlazaInventoryStorageExpansionBonusRows = 0;
  managingWorldPlazaInventoryStorageExpansionClaimedCodexKeys = new Set();
  managingWorldPlazaInventoryStorageExpansionSubscribers.clear();
}
