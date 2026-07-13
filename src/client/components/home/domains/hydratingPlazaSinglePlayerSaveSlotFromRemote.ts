import { fetchingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { parsingInventoryState } from '@/components/inventory/domains/parsingInventoryState';
import { checkingWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { creatingWorldPlazaLastPosition } from '@/components/world/domains/definingWorldPlazaLastPosition';
import { writingWorldPlazaBestiaryDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaBestiaryDiscoveryToStorage';
import { writingWorldPlazaDiscoveredNamedRealmsToStorage } from '@/components/world/domains/writingWorldPlazaDiscoveredNamedRealmsToStorage';
import { writingWorldPlazaExploredBiomesToStorage } from '@/components/world/domains/writingWorldPlazaExploredBiomesToStorage';
import { writingWorldPlazaLastPositionToStorage } from '@/components/world/domains/writingWorldPlazaLastPositionToStorage';
import { writingWorldPlazaRecipeDiscoveryToStorage } from '@/components/world/domains/writingWorldPlazaRecipeDiscoveryToStorage';
import { writingWorldPlazaPlayerConditionsToStorage } from '@/components/world/health/domains/writingWorldPlazaPlayerConditionsToStorage';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  resolvingWorldPlazaInventoryStorageKey,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { listingWildlifeSpeciesIds } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

const DEFINING_WORLD_PLAZA_BIOME_KIND_SET = new Set<string>(
  Object.keys(DEFINING_WORLD_PLAZA_BIOME_CATALOG)
);
const DEFINING_WORLD_PLAZA_BESTIARY_SPECIES_ID_SET = new Set<string>(
  listingWildlifeSpeciesIds()
);

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
    const parsedInventory = parsingInventoryState(
      remoteData.inventory,
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    if (parsedInventory) {
      window.localStorage.setItem(
        resolvingWorldPlazaInventoryStorageKey(localPersistenceOwnerId),
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

  if (remoteData.bestiaryDiscovery) {
    const checkingKnownSpeciesId = (
      speciesId: string
    ): speciesId is DefiningWildlifeSpeciesId =>
      DEFINING_WORLD_PLAZA_BESTIARY_SPECIES_ID_SET.has(speciesId);
    const sightedSpeciesIds = new Set(
      remoteData.bestiaryDiscovery.sightedSpeciesIds.filter(
        checkingKnownSpeciesId
      )
    );
    const studyCountsBySpeciesId = new Map<DefiningWildlifeSpeciesId, number>();

    for (const [speciesId, studyCount] of Object.entries(
      remoteData.bestiaryDiscovery.studyCountsBySpeciesId
    )) {
      if (!checkingKnownSpeciesId(speciesId)) {
        continue;
      }

      if (typeof studyCount !== 'number' || studyCount <= 0) {
        continue;
      }

      studyCountsBySpeciesId.set(speciesId, Math.floor(studyCount));
      sightedSpeciesIds.add(speciesId);
    }

    writingWorldPlazaBestiaryDiscoveryToStorage(
      localPersistenceOwnerId,
      sightedSpeciesIds,
      studyCountsBySpeciesId
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
}
