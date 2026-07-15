/**
 * Persists bonus storage-row unlocks to localStorage.
 *
 * @module components/world/inventory/domains/writingWorldPlazaInventoryStorageExpansionToStorage
 */

import { resolvingWorldPlazaInventoryStorageExpansionStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';

/**
 * Writes storage-expansion progress for one session owner.
 */
export function writingWorldPlazaInventoryStorageExpansionToStorage(
  storageOwnerId: string | null,
  bonusStorageRows: number,
  claimedCodexKeys: ReadonlySet<string>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaInventoryStorageExpansionStorageKey(storageOwnerId),
    JSON.stringify({
      bonusStorageRows,
      claimedCodexKeys: [...claimedCodexKeys].sort(),
    })
  );
}
