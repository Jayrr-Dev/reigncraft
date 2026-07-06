import { resolvingWorldPlazaExploredBiomesStorageKey } from '@/components/world/domains/definingWorldPlazaExploredBiomesConstants';
import { resolvingWorldPlazaLastPositionStorageKey } from '@/components/world/domains/definingWorldPlazaLastPositionConstants';
import { resolvingWorldPlazaSavedCoordsStorageKey } from '@/components/world/domains/definingWorldPlazaSavedCoordsConstants';
import { resolvingWorldPlazaFireCellsLocalStorageKey } from '@/components/world/fire/domains/managingWorldPlazaLocalFireCells';
import { resolvingWorldPlazaChoppedTreesLocalStorageKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { resolvingWorldPlazaGroundItemsLocalStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaGroundItemLocalStorageConstants';
import { resolvingWorldPlazaInventoryStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Removes all local single-player save data for one persistence owner.
 *
 * @param persistenceOwnerId - Scoped localStorage owner id for the slot.
 */
export function clearingPlazaSinglePlayerSaveSlotLocalStorage(
  persistenceOwnerId: string
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKeys = [
    resolvingWorldPlazaLastPositionStorageKey(persistenceOwnerId),
    resolvingWorldPlazaInventoryStorageKey(persistenceOwnerId),
    resolvingWorldPlazaSavedCoordsStorageKey(persistenceOwnerId),
    resolvingWorldPlazaExploredBiomesStorageKey(persistenceOwnerId),
    resolvingWorldPlazaGroundItemsLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaChoppedTreesLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaFireCellsLocalStorageKey(persistenceOwnerId),
  ];

  for (const storageKey of storageKeys) {
    window.localStorage.removeItem(storageKey);
  }
}
