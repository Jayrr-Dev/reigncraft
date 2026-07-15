import {
  resolvingWorldPlazaAvatarTransformCooldownStorageKey,
  resolvingWorldPlazaSelectedAvatarSkinStorageKey,
} from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';
import { resolvingWorldPlazaBestiaryDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaBestiaryDiscoveryConstants';
import { resolvingWorldPlazaExploredBiomesStorageKey } from '@/components/world/domains/definingWorldPlazaExploredBiomesConstants';
import { resolvingWorldPlazaLastPositionStorageKey } from '@/components/world/domains/definingWorldPlazaLastPositionConstants';
import { resolvingWorldPlazaDiscoveredNamedRealmsStorageKey } from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';
import { resolvingWorldPlazaRecipeDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaRecipeDiscoveryConstants';
import { resolvingWorldPlazaSavedCoordsStorageKey } from '@/components/world/domains/definingWorldPlazaSavedCoordsConstants';
import { resolvingWorldPlazaWorldSeedStorageKey } from '@/components/world/domains/definingWorldPlazaWorldSeedConstants';
import { clearingWorldPlazaRecipeDiscoveryStoreForOwner } from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { resettingWorldPlazaWorldSeedStore } from '@/components/world/domains/managingWorldPlazaWorldSeedStore';
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
import { resolvingWorldPlazaInventoryStorageExpansionStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { clearingWorldPlazaInventoryStorageExpansionStoreForOwner } from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import {
  resolvingWorldPlazaOnboardingCoachmarksStorageKey,
  resolvingWorldPlazaOnboardingCoreFinishedStorageKey,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { clearingWorldPlazaOnboardingCoachmarkStoreForOwner } from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingCoachmarkStore';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_STORAGE_KEY_PREFIX,
  resolvingWorldPlazaSpritcoreUpgradeStorageKey,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';

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
    resolvingWorldPlazaInventoryStorageExpansionStorageKey(persistenceOwnerId),
    resolvingWorldPlazaGroundItemsLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaChoppedTreesLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaStudiedTreeStumpsLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaMinedRocksLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaPickedPebblesLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaPickedFlowersLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaFarmlandLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaFireCellsLocalStorageKey(persistenceOwnerId),
    resolvingWorldPlazaPlayerConditionsStorageKey(persistenceOwnerId),
    resolvingWorldPlazaAvatarTransformCooldownStorageKey(persistenceOwnerId),
    resolvingWorldPlazaSelectedAvatarSkinStorageKey(persistenceOwnerId),
    resolvingWorldPlazaSpritcoreUpgradeStorageKey(persistenceOwnerId),
    resolvingWorldPlazaOnboardingCoachmarksStorageKey(persistenceOwnerId),
    resolvingWorldPlazaOnboardingCoreFinishedStorageKey(persistenceOwnerId),
    resolvingWorldPlazaWorldSeedStorageKey(persistenceOwnerId),
  ];

  for (const storageKey of storageKeys) {
    window.localStorage.removeItem(storageKey);
  }

  const spritcoreOwnerPrefix = `${DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_STORAGE_KEY_PREFIX}:${persistenceOwnerId}:`;

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const storageKey = window.localStorage.key(index);

    if (storageKey?.startsWith(spritcoreOwnerPrefix)) {
      window.localStorage.removeItem(storageKey);
    }
  }

  clearingWorldPlazaLocalChoppedTreesMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalStudiedTreeStumpsMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalMinedRocksMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalPickedPebblesMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalPickedFlowersMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaLocalFarmlandMemoryForOwner(persistenceOwnerId);
  clearingWorldPlazaRecipeDiscoveryStoreForOwner(persistenceOwnerId);
  clearingWorldPlazaInventoryStorageExpansionStoreForOwner(persistenceOwnerId);
  clearingWorldPlazaOnboardingCoachmarkStoreForOwner(persistenceOwnerId);
  resettingWorldPlazaWorldSeedStore();
}
