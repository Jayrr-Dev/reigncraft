import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { creatingInventoryLocalStorageAdapter } from '@/components/inventory/domains/creatingInventoryLocalStorageAdapter';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { DefiningInventoryPersistenceAdapter } from '@/components/inventory/domains/definingInventoryPersistenceAdapter';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/** Options for {@link creatingInventoryPlazaSinglePlayerSaveAdapter}. */
export type CreatingInventoryPlazaSinglePlayerSaveAdapterOptions = {
  storageKey: string;
  capacity: number;
  registry: DefiningInventoryItemRegistry;
  saveSlotIndex: PlazaSaveSlotIndex;
};

/**
 * Persists inventory to localStorage and mirrors writes to Devvit Redis save slots.
 */
export function creatingInventoryPlazaSinglePlayerSaveAdapter(
  options: CreatingInventoryPlazaSinglePlayerSaveAdapterOptions
): DefiningInventoryPersistenceAdapter {
  const { saveSlotIndex, ...localOptions } = options;
  const localAdapter = creatingInventoryLocalStorageAdapter(localOptions);

  return {
    async load(): Promise<DefiningInventoryState | null> {
      return localAdapter.load();
    },

    async save(state: DefiningInventoryState): Promise<void> {
      localAdapter.save(state);

      await savingPlazaSinglePlayerSaveSlotData(saveSlotIndex, {
        inventory: {
          capacity: state.capacity,
          slots: state.slots.map((slot) =>
            slot
              ? {
                  id: slot.id,
                  itemTypeId: slot.itemTypeId,
                  quantity: slot.quantity,
                  slotIndex: slot.slotIndex,
                  metadata: slot.metadata,
                }
              : null
          ),
        },
      });
    },
  };
}
