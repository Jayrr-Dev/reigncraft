/**
 * Reads bonus storage-row unlocks from localStorage.
 *
 * @module components/world/inventory/domains/readingWorldPlazaInventoryStorageExpansionFromStorage
 */

import {
  resolvingWorldPlazaInventoryClampedBonusStorageRows,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryCapacity';
import { resolvingWorldPlazaInventoryStorageExpansionStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';

export type WorldPlazaInventoryStorageExpansionSnapshot = {
  readonly bonusStorageRows: number;
  readonly claimedCodexKeys: ReadonlySet<string>;
};

const WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_EMPTY_SNAPSHOT: WorldPlazaInventoryStorageExpansionSnapshot =
  {
    bonusStorageRows: 0,
    claimedCodexKeys: new Set(),
  };

/**
 * Reads storage-expansion progress for one session owner.
 */
export function readingWorldPlazaInventoryStorageExpansionFromStorage(
  storageOwnerId: string | null
): WorldPlazaInventoryStorageExpansionSnapshot {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_EMPTY_SNAPSHOT;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaInventoryStorageExpansionStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_EMPTY_SNAPSHOT;
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== 'object') {
      return WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_EMPTY_SNAPSHOT;
    }

    const bonusRaw = Reflect.get(parsedValue, 'bonusStorageRows');
    const claimedRaw = Reflect.get(parsedValue, 'claimedCodexKeys');

    return {
      bonusStorageRows: resolvingWorldPlazaInventoryClampedBonusStorageRows(
        typeof bonusRaw === 'number' ? bonusRaw : 0
      ),
      claimedCodexKeys: new Set(
        Array.isArray(claimedRaw)
          ? claimedRaw.filter((value): value is string => typeof value === 'string')
          : []
      ),
    };
  } catch {
    return WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_EMPTY_SNAPSHOT;
  }
}
