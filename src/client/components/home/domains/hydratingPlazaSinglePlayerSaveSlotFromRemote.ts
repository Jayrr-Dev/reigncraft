import { creatingWorldPlazaLastPosition } from '@/components/world/domains/definingWorldPlazaLastPosition';
import { writingWorldPlazaLastPositionToStorage } from '@/components/world/domains/writingWorldPlazaLastPositionToStorage';
import { parsingInventoryState } from '@/components/inventory/domains/parsingInventoryState';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { resolvingWorldPlazaInventoryStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { fetchingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/**
 * Hydrates local single-player save storage from Devvit Redis.
 *
 * @param saveSlotIndex - Save slot (1–3).
 * @param localPersistenceOwnerId - Scoped localStorage owner id.
 */
export async function hydratingPlazaSinglePlayerSaveSlotFromRemote(
  saveSlotIndex: PlazaSaveSlotIndex,
  localPersistenceOwnerId: string,
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
        remoteData.lastPosition.updatedAtMs,
      ),
      localPersistenceOwnerId,
    );
  }

  if (remoteData.inventory && typeof window !== 'undefined') {
    const parsedInventory = parsingInventoryState(
      remoteData.inventory,
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
    );

    if (parsedInventory) {
      window.localStorage.setItem(
        resolvingWorldPlazaInventoryStorageKey(localPersistenceOwnerId),
        JSON.stringify(parsedInventory),
      );
    }
  }
}
