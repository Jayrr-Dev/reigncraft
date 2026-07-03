import type { DefiningInventoryPersistenceAdapter } from '@/components/inventory/domains/definingInventoryPersistenceAdapter';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { parsingInventoryState } from '@/components/inventory/domains/parsingInventoryState';
import {
  fetchingWorldInventoryDevvitPersistedState,
  savingWorldInventoryDevvitPersistedState,
} from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import { WORLD_INVENTORY_DEVVIT_STATE_API_PATH } from '../../../../shared/worldInventoryDevvit';

/** Options for {@link creatingInventoryDevvitAdapter}. */
export type CreatingInventoryDevvitAdapterOptions = {
  capacity: number;
  registry: DefiningInventoryItemRegistry;
};

/**
 * Creates a Devvit Redis-backed inventory persistence adapter.
 *
 * @param options - Capacity and item registry for parsing persisted JSON.
 */
export function creatingInventoryDevvitAdapter(
  options: CreatingInventoryDevvitAdapterOptions,
): DefiningInventoryPersistenceAdapter {
  const { capacity, registry } = options;

  return {
    async load(): Promise<DefiningInventoryState | null> {
      const persisted = await fetchingWorldInventoryDevvitPersistedState(
        WORLD_INVENTORY_DEVVIT_STATE_API_PATH,
      );

      if (!persisted) {
        return null;
      }

      return parsingInventoryState(persisted, capacity, registry);
    },

    async save(state: DefiningInventoryState): Promise<void> {
      await savingWorldInventoryDevvitPersistedState(
        WORLD_INVENTORY_DEVVIT_STATE_API_PATH,
        {
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
              : null,
          ),
        },
      );
    },
  };
}
