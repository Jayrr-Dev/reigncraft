import { resolvingWorldPlazaBestiaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants';
import { resolvingWorldPlazaExploredBiomesStorageKey } from '@/components/world/domains/definingWorldPlazaExploredBiomesConstants';
import { resolvingWorldPlazaLastPositionStorageKey } from '@/components/world/domains/definingWorldPlazaLastPositionConstants';
import { resolvingWorldPlazaDiscoveredNamedRealmsStorageKey } from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';
import { resolvingWorldPlazaRecipeDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaRecipeDiscoveryConstants';
import { resolvingWorldPlazaSavedCoordsStorageKey } from '@/components/world/domains/definingWorldPlazaSavedCoordsConstants';
import { clearingWorldPlazaRecipeDiscoveryStoreForOwner } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import {
  clearingWorldPlazaLocalFarmlandMemoryForOwner,
  resolvingWorldPlazaFarmlandLocalStorageKey,
} from '@/components/world/farming/domains/managingWorldPlazaLocalFarmland';
import { resolvingWorldPlazaFireCellsLocalStorageKey } from '@/components/world/fire/domains/managingWorldPlazaLocalFireCells';
import {
  clearingWorldPlazaLocalChoppedTreesMemoryForOwner,
  resolvingWorldPlazaChoppedTreesLocalStorageKey,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import {
  clearingWorldPlazaLocalMinedRocksMemoryForOwner,
  resolvingWorldPlazaMinedRocksLocalStorageKey,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import {
  clearingWorldPlazaLocalPickedFlowersMemoryForOwner,
  resolvingWorldPlazaPickedFlowersLocalStorageKey,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import {
  clearingWorldPlazaLocalPickedPebblesMemoryForOwner,
  resolvingWorldPlazaPickedPebblesLocalStorageKey,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import {
  clearingWorldPlazaLocalStudiedTreeStumpsMemoryForOwner,
  resolvingWorldPlazaStudiedTreeStumpsLocalStorageKey,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalStudiedTreeStumps';
import { resolvingWorldPlazaPlayerConditionsStorageKey } from '@/components/world/health/domains/definingWorldPlazaPlayerConditionsConstants';
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
    resolvingWorldPlazaBestiaryDiscoveryStorageKey(persistenceOwnerId),
    resolvingWorldPlazaDiscoveredNamedRealmsStorageKey(persistenceOwnerId),
    resolvingWorldPlazaRecipeDiscoveryStorageKey(persistenceOwnerId),
    resolvingWorldPlazaGroundItemsLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaChoppedTreesLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaStudiedTreeStumpsLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaMinedRocksLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaPickedPebblesLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaPickedFlowersLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaFarmlandLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaFireCellsLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaPlayerConditionsStorageKey(persistenceOwnerId),
  ];

  for (const storageKey of storageKeys) {
    window.localStorage.removeItem(storageKey);
  }

  clearingWorldPlazaLocalChoppedTreesMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalStudiedTreeStumpsMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalMinedRocksMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalPickedPebblesMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalPickedFlowersMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalFarmlandMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaRecipeDiscoveryStoreForOwner(persistenceOwnerId);
}
