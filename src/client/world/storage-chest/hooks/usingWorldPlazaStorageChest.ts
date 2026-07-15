/**
 * Opens a craftable storage chest and keeps its 6×6 grid in sync with localStorage.
 *
 * @module components/world/storage-chest/hooks/usingWorldPlazaStorageChest
 */

'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemMoved } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemMoved';
import { playingWorldPlazaInventoryBagSfx } from '@/components/world/inventory/domains/playingWorldPlazaInventoryBagSfx';
import {
  applyingWorldPlazaStorageChestTransfer,
  resolvingWorldPlazaStorageChestDragLocationForItemId,
  type DefiningWorldPlazaStorageChestDragLocation,
} from '@/components/world/storage-chest/domains/applyingWorldPlazaStorageChestTransfer';
import {
  readingWorldPlazaLocalStorageChestContents,
  writingWorldPlazaLocalStorageChestContents,
} from '@/components/world/storage-chest/domains/managingWorldPlazaLocalStorageChestContents';
import { playingWorldPlazaStorageChestSfx } from '@/components/world/storage-chest/domains/playingWorldPlazaStorageChestSfx';
import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Plays move when rearranging chest slots; quieter drop when depositing from
 * the hotbar into the chest.
 */
function notifyingWorldPlazaStorageChestTransferSfx(
  from: DefiningWorldPlazaStorageChestDragLocation,
  to: DefiningWorldPlazaStorageChestDragLocation
): void {
  if (from.kind === 'hotbar' && to.kind === 'storage-chest') {
    playingWorldPlazaInventoryBagSfx({ actionId: 'drop' });
    return;
  }

  notifyingWorldPlazaInventoryItemMoved();
}

export type UsingWorldPlazaStorageChestParams = {
  readonly persistenceOwnerId: string | null;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
};

/**
 * Selection + transfer API for one owner-gated storage chest block.
 */
export function usingWorldPlazaStorageChest({
  persistenceOwnerId,
  inventoryState,
  updatingInventoryState,
}: UsingWorldPlazaStorageChestParams) {
  const [selectedBlock, setSelectedBlock] =
    useState<DefiningWorldBuildingPlacedBlock | null>(null);
  const [contentsRevision, setContentsRevision] = useState(0);
  const selectedBlockRef = useRef(selectedBlock);
  selectedBlockRef.current = selectedBlock;

  const selectingChest = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): void => {
      if (selectedBlockRef.current?.blockId !== block.blockId) {
        playingWorldPlazaStorageChestSfx({ actionId: 'open' });
      }
      setSelectedBlock(block);
    },
    []
  );

  const closingChest = useCallback((): void => {
    if (selectedBlockRef.current) {
      playingWorldPlazaStorageChestSfx({ actionId: 'close' });
    }
    setSelectedBlock(null);
  }, []);

  const selectedChestContents = useMemo((): DefiningInventoryState | null => {
    if (!selectedBlock || !persistenceOwnerId) {
      return null;
    }

    void contentsRevision;
    return readingWorldPlazaLocalStorageChestContents(
      persistenceOwnerId,
      selectedBlock.blockId,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );
  }, [contentsRevision, persistenceOwnerId, selectedBlock]);

  const applyingDragTransfer = useCallback(
    (
      from: DefiningWorldPlazaStorageChestDragLocation,
      to: DefiningWorldPlazaStorageChestDragLocation
    ): boolean => {
      if (!selectedBlock || !persistenceOwnerId || !selectedChestContents) {
        return false;
      }

      if (
        (from.kind === 'storage-chest' &&
          from.blockId !== selectedBlock.blockId) ||
        (to.kind === 'storage-chest' && to.blockId !== selectedBlock.blockId)
      ) {
        return false;
      }

      const result = applyingWorldPlazaStorageChestTransfer(
        inventoryState,
        selectedChestContents,
        from,
        to,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      const inventoryChanged =
        result.inventoryState !== inventoryState &&
        result.inventoryState.slots !== inventoryState.slots;
      const chestChanged =
        result.chestContents.slots !== selectedChestContents.slots;

      if (!inventoryChanged && !chestChanged) {
        return false;
      }

      if (inventoryChanged) {
        updatingInventoryState(() => result.inventoryState);
      }

      if (chestChanged) {
        writingWorldPlazaLocalStorageChestContents(
          persistenceOwnerId,
          selectedBlock.blockId,
          result.chestContents,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );
        setContentsRevision((value) => value + 1);
      }

      notifyingWorldPlazaStorageChestTransferSfx(from, to);
      return true;
    },
    [
      inventoryState,
      persistenceOwnerId,
      selectedBlock,
      selectedChestContents,
      updatingInventoryState,
    ]
  );

  const resolvingDragLocationForItemId = useCallback(
    (
      itemInstanceId: string
    ): DefiningWorldPlazaStorageChestDragLocation | null => {
      if (!selectedBlock || !selectedChestContents) {
        return null;
      }

      return resolvingWorldPlazaStorageChestDragLocationForItemId(
        inventoryState,
        selectedChestContents,
        selectedBlock.blockId,
        itemInstanceId
      );
    },
    [inventoryState, selectedBlock, selectedChestContents]
  );

  return {
    selectedBlock,
    selectedChestContents,
    selectingChest,
    closingChest,
    applyingDragTransfer,
    resolvingDragLocationForItemId,
  };
}
