import { mergingPlazaSinglePlayerSaveBestiaryDiscovery } from '@/components/home/domains/mergingPlazaSinglePlayerSaveBestiaryDiscovery';
import { fetchingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { parsingInventoryState } from '@/components/inventory/domains/parsingInventoryState';
import { checkingWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { creatingWorldPlazaLastPosition } from '@/components/world/domains/definingWorldPlazaLastPosition';
import { hydratingWorldPlazaWorldSeedFromRemote } from '@/components/world/domains/managingWorldPlazaWorldSeedStore';
import { readingWorldPlazaBestiaryDiscoveryFromStorage } from '@/components/world/domains/readingWorldPlazaBestiaryDiscoveryFromStorage';
import { writingWorldPlazaBestiaryDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaBestiaryDiscoveryToStorage';
import { writingWorldPlazaDiscoveredNamedRealmsToStorage } from '@/components/world/domains/writingWorldPlazaDiscoveredNamedRealmsToStorage';
import { writingWorldPlazaExploredBiomesToStorage } from '@/components/world/domains/writingWorldPlazaExploredBiomesToStorage';
import { writingWorldPlazaLastPositionToStorage } from '@/components/world/domains/writingWorldPlazaLastPositionToStorage';
import { writingWorldPlazaRecipeDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaRecipeDiscoveryToStorage';
import { writingWorldPlazaPlayerConditionsToStorage } from '@/components/world/health/domains/writingWorldPlazaPlayerConditionsToStorage';
import { resolvingWorldPlazaInventoryStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { hydratingWorldPlazaInventoryStorageExpansionFromRemote } from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { listingWildlifeSpeciesIds } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { readingWildlifePetRosterFromStorage } from '@/components/world/wildlife/pets/domains/readingWildlifePetRosterFromStorage';
import { parsingWildlifePetRoster } from '@/components/world/wildlife/pets/domains/serializingWildlifePetRoster';
import { writingWildlifePetRosterToStorage } from '@/components/world/wildlife/pets/domains/writingWildlifePetRosterToStorage';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import type { PlazaSinglePlayerSaveSlotPersistedData } from '../../../../shared/plazaSinglePlayerSavesDevvit';

const DEFINING_WORLD_PLAZA_BIOME_KIND_SET = new Set<string>(
  Object.keys(DEFINING_WORLD_PLAZA_BIOME_CATALOG)
);
const DEFINING_WORLD_PLAZA_BESTIARY_SPECIES_ID_SET = new Set<string>(
  listingWildlifeSpeciesIds()
);

function checkingPlazaSinglePlayerRemoteSaveHasProgress(
  remoteData: PlazaSinglePlayerSaveSlotPersistedData
): boolean {
  return Boolean(
    remoteData.lastPosition ||
      remoteData.inventory ||
      remoteData.playerConditions ||
      (remoteData.attachedRecipeIds &&
        remoteData.attachedRecipeIds.length > 0) ||
      (typeof remoteData.inventoryBonusStorageRows === 'number' &&
        remoteData.inventoryBonusStorageRows > 0) ||
      (remoteData.inventoryStorageExpansionClaimedCodexKeys &&
        remoteData.inventoryStorageExpansionClaimedCodexKeys.length > 0) ||
      remoteData.bestiaryDiscovery ||
      (remoteData.exploredBiomeKinds &&
        remoteData.exploredBiomeKinds.length > 0) ||
      (remoteData.discoveredNamedRealmIds &&
        remoteData.discoveredNamedRealmIds.length > 0) ||
      (remoteData.petRoster && remoteData.petRoster.pets.length > 0)
  );
}

/**
 * Hydrates local single-player save storage from Devvit Redis.
 *
 * @param saveSlotIndex - Save slot (1–3).
 * @param localPersistenceOwnerId - Scoped localStorage owner id.
 */
export async function hydratingPlazaSinglePlayerSaveSlotFromRemote(
  saveSlotIndex: PlazaSaveSlotIndex,
  localPersistenceOwnerId: string
): Promise<void> {
  const remoteData = await fetchingPlazaSinglePlayerSaveSlotData(saveSlotIndex);

  if (!remoteData) {
    return;
  }

  if (
    typeof remoteData.worldSeed === 'number' &&
    Number.isFinite(remoteData.worldSeed)
  ) {
    hydratingWorldPlazaWorldSeedFromRemote(
      localPersistenceOwnerId,
      remoteData.worldSeed
    );
  } else if (checkingPlazaSinglePlayerRemoteSaveHasProgress(remoteData)) {
    // Pre-seed saves keep the legacy fixed map.
    hydratingWorldPlazaWorldSeedFromRemote(localPersistenceOwnerId, 0);
  }

  if (remoteData.lastPosition) {
    writingWorldPlazaLastPositionToStorage(
      creatingWorldPlazaLastPosition(
        remoteData.lastPosition.x,
        remoteData.lastPosition.y,
        remoteData.lastPosition.layer,
        remoteData.lastPosition.updatedAtMs
      ),
      localPersistenceOwnerId
    );
  }

  if (remoteData.inventory && typeof window !== 'undefined') {
    const inventoryStorageKey = resolvingWorldPlazaInventoryStorageKey(
      localPersistenceOwnerId
    );
    const existingLocalInventoryJson =
      window.localStorage.getItem(inventoryStorageKey);
    let localHasItems = false;

    if (existingLocalInventoryJson) {
      try {
        const existingLocalInventory = parsingInventoryState(
          JSON.parse(existingLocalInventoryJson),
          DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );
        localHasItems = existingLocalInventory.slots.some(
          (slot) => slot !== null
        );
      } catch {
        localHasItems = false;
      }
    }

    // Prefer local inventory when present so a lagging Redis snapshot cannot
    // wipe worn tool durability after a successful local save.
    if (!localHasItems) {
      const parsedInventory = parsingInventoryState(
        remoteData.inventory,
        DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      window.localStorage.setItem(
        inventoryStorageKey,
        JSON.stringify(parsedInventory)
      );
    }
  }

  if (remoteData.playerConditions) {
    writingWorldPlazaPlayerConditionsToStorage(
      localPersistenceOwnerId,
      remoteData.playerConditions
    );
  }

  if (remoteData.attachedRecipeIds) {
    const knownRecipeIds = new Set<DefiningWorldPlazaCraftModeRecipeId>(
      remoteData.attachedRecipeIds.filter(checkingWorldPlazaCraftModeRecipeId)
    );

    writingWorldPlazaRecipeDiscoveryToStorage(
      localPersistenceOwnerId,
      knownRecipeIds
    );
  }

  if (
    remoteData.inventoryBonusStorageRows !== null &&
    remoteData.inventoryBonusStorageRows !== undefined
  ) {
    hydratingWorldPlazaInventoryStorageExpansionFromRemote(
      localPersistenceOwnerId,
      remoteData.inventoryBonusStorageRows,
      remoteData.inventoryStorageExpansionClaimedCodexKeys
    );
  } else if (
    remoteData.inventoryStorageExpansionClaimedCodexKeys &&
    remoteData.inventoryStorageExpansionClaimedCodexKeys.length > 0
  ) {
    hydratingWorldPlazaInventoryStorageExpansionFromRemote(
      localPersistenceOwnerId,
      0,
      remoteData.inventoryStorageExpansionClaimedCodexKeys
    );
  }

  if (remoteData.bestiaryDiscovery) {
    const checkingKnownSpeciesId = (
      speciesId: string
    ): speciesId is DefiningWildlifeSpeciesId =>
      DEFINING_WORLD_PLAZA_BESTIARY_SPECIES_ID_SET.has(speciesId);
    const remoteSightedSpeciesIds = new Set(
      remoteData.bestiaryDiscovery.sightedSpeciesIds.filter(
        checkingKnownSpeciesId
      )
    );
    const remoteStudyCountsBySpeciesId = new Map<
      DefiningWildlifeSpeciesId,
      number
    >();

    for (const [speciesId, studyCount] of Object.entries(
      remoteData.bestiaryDiscovery.studyCountsBySpeciesId ?? {}
    )) {
      if (!checkingKnownSpeciesId(speciesId)) {
        continue;
      }

      if (typeof studyCount !== 'number' || studyCount <= 0) {
        continue;
      }

      remoteStudyCountsBySpeciesId.set(speciesId, Math.floor(studyCount));
      remoteSightedSpeciesIds.add(speciesId);
    }

    // Merge with local so a lagging Redis snapshot (sighted-only, older
    // study totals) cannot wipe fresher localStorage study progress.
    const localBestiaryDiscovery =
      readingWorldPlazaBestiaryDiscoveryFromStorage(localPersistenceOwnerId);
    const mergedBestiaryDiscovery =
      mergingPlazaSinglePlayerSaveBestiaryDiscovery(localBestiaryDiscovery, {
        sightedSpeciesIds: remoteSightedSpeciesIds,
        studyCountsBySpeciesId: remoteStudyCountsBySpeciesId,
      });

    writingWorldPlazaBestiaryDiscoveryToStorage(
      localPersistenceOwnerId,
      mergedBestiaryDiscovery.sightedSpeciesIds,
      mergedBestiaryDiscovery.studyCountsBySpeciesId
    );
  }

  if (remoteData.exploredBiomeKinds) {
    const exploredKinds = new Set<DefiningWorldPlazaBiomeKind>(
      remoteData.exploredBiomeKinds.filter(
        (biomeKind): biomeKind is DefiningWorldPlazaBiomeKind =>
          DEFINING_WORLD_PLAZA_BIOME_KIND_SET.has(biomeKind)
      )
    );

    writingWorldPlazaExploredBiomesToStorage(
      localPersistenceOwnerId,
      exploredKinds
    );
  }

  if (remoteData.discoveredNamedRealmIds) {
    const discoveredRealmIds = new Set(
      remoteData.discoveredNamedRealmIds.filter(
        (realmId) => typeof realmId === 'string' && realmId.includes(':')
      )
    );

    writingWorldPlazaDiscoveredNamedRealmsToStorage(
      localPersistenceOwnerId,
      discoveredRealmIds
    );
  }

  if (remoteData.petRoster) {
    // Prefer local roster when present so a lagging Redis snapshot cannot
    // wipe fresher loyalty / equipment progress after a successful local save.
    const localRoster = readingWildlifePetRosterFromStorage(
      localPersistenceOwnerId
    );

    if (localRoster.pets.length === 0) {
      const { roster: remoteRoster } = parsingWildlifePetRoster(
        remoteData.petRoster
      );

      writingWildlifePetRosterToStorage(localPersistenceOwnerId, remoteRoster);
    }
  }
}
