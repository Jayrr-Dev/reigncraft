'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { findingWorldBuildingPlacedBlockAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  addingWorldPlazaLocalFireCellFuel,
  findingWorldPlazaLocalFireCellAtTile,
  ignitingWorldPlazaLocalFireCell,
} from '@/components/world/fire/domains/managingWorldPlazaLocalFireCells';
import { DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT } from '@/components/world/fire/hooks/usingWorldPlazaFireCells';
import { ignitingWorldFireDevvitCell } from '@/components/world/fire/repositories/callingWorldFireDevvitApi';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { showToast } from '@devvit/web/client';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useCallback, type RefObject } from 'react';
import {
  resolvingWorldFireDevvitMaterialProperties,
  WORLD_FIRE_DEVVIT_IGNITE_API_PATH,
  WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES,
} from '../../../../shared/worldFireDevvit';

/** Consumes items from the active inventory; returns false when unavailable. */
export type ConsumingWorldPlazaFireInventoryItem = (
  itemTypeId: string,
  quantity: number
) => boolean;

/** Params for {@link attemptingWorldPlazaFlintIgnitionAtTile}. */
export type AttemptingWorldPlazaFlintIgnitionAtTileParams = {
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly inventoryState: DefiningInventoryState;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly onlineUserId: string | null;
  readonly localPersistenceOwnerId: string | null;
  readonly consumingInventoryItem: ConsumingWorldPlazaFireInventoryItem;
  readonly queryClient: QueryClient;
};

function checkingWorldPlazaInventoryHasItemType(
  inventoryState: DefiningInventoryState,
  itemTypeId: string
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null && slot.itemTypeId === itemTypeId && slot.quantity > 0
  );
}

function computingChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

function invalidatingLocalFireCellsQuery(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({
    queryKey: [DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT],
  });
}

/**
 * Single-player fire interaction: refuel a burning tile or light a campfire.
 *
 * Without a server room there are no placed blocks, so flint lights a
 * campfire-style fire directly on the clicked ground tile and wood refuels
 * an already-burning tile. All state lives in the local fire store.
 */
function attemptingWorldPlazaLocalFireActionAtTile({
  tilePosition,
  playerPosition,
  inventoryState,
  placedBlocks,
  localPersistenceOwnerId,
  consumingInventoryItem,
  queryClient,
}: AttemptingWorldPlazaFlintIgnitionAtTileParams & {
  readonly localPersistenceOwnerId: string;
}): boolean {
  const worldLayer = resolvingWorldPlazaPlayerWorldLayer(playerPosition);
  const request = {
    tileX: tilePosition.tileX,
    tileY: tilePosition.tileY,
    worldLayer,
    playerX: playerPosition.x,
    playerY: playerPosition.y,
  };

  const burningCell = findingWorldPlazaLocalFireCellAtTile(
    localPersistenceOwnerId,
    request.tileX,
    request.tileY,
    worldLayer
  );

  if (burningCell) {
    if (
      !checkingWorldPlazaInventoryHasItemType(
        inventoryState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ) {
      showToast('You need wood to fuel the fire.');
      return true;
    }

    const fuelResult = addingWorldPlazaLocalFireCellFuel(
      localPersistenceOwnerId,
      request,
      placedBlocks
    );

    if (fuelResult.outcome === 'out-of-range') {
      showToast('Move closer to the fire.');
      return true;
    }

    if (fuelResult.outcome === 'fueled') {
      consumingInventoryItem(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD, 1);
      invalidatingLocalFireCellsQuery(queryClient);
      showToast('Added wood to the fire.');
    }

    return true;
  }

  if (
    !checkingWorldPlazaInventoryHasItemType(
      inventoryState,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT
    )
  ) {
    return false;
  }

  const igniteResult = ignitingWorldPlazaLocalFireCell(
    localPersistenceOwnerId,
    request,
    placedBlocks
  );

  if (igniteResult.outcome === 'out-of-range') {
    showToast('Move closer to start a fire there.');
    return true;
  }

  if (igniteResult.outcome === 'ignited') {
    consumingInventoryItem(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT, 1);
    invalidatingLocalFireCellsQuery(queryClient);
  }

  return true;
}

/**
 * Attempts a fire action on a tile: online flint ignition of flammable
 * blocks, or the local single-player campfire flow.
 */
export async function attemptingWorldPlazaFlintIgnitionAtTile(
  params: AttemptingWorldPlazaFlintIgnitionAtTileParams
): Promise<boolean> {
  const {
    tilePosition,
    playerPosition,
    inventoryState,
    placedBlocks,
    onlineUserId,
    localPersistenceOwnerId,
    consumingInventoryItem,
  } = params;

  if (!onlineUserId) {
    if (!localPersistenceOwnerId) {
      return false;
    }

    return attemptingWorldPlazaLocalFireActionAtTile({
      ...params,
      localPersistenceOwnerId,
    });
  }

  if (
    !checkingWorldPlazaInventoryHasItemType(
      inventoryState,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT
    )
  ) {
    return false;
  }

  const distance = computingChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    tilePosition.tileX + 0.5,
    tilePosition.tileY + 0.5
  );

  if (distance > WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES) {
    showToast('Move closer to ignite that block.');
    return true;
  }

  const placedBlock = findingWorldBuildingPlacedBlockAtTileIndex(
    tilePosition.tileX,
    tilePosition.tileY,
    [...placedBlocks]
  );

  if (!placedBlock) {
    return false;
  }

  const materialProperties = resolvingWorldFireDevvitMaterialProperties(
    placedBlock.definitionId
  );

  if (!materialProperties || materialProperties.flammability <= 0) {
    showToast('That material is not flammable.');
    return true;
  }

  try {
    await ignitingWorldFireDevvitCell(WORLD_FIRE_DEVVIT_IGNITE_API_PATH, {
      mode: 'flint',
      tileX: tilePosition.tileX,
      tileY: tilePosition.tileY,
      worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(placedBlock),
      playerX: playerPosition.x,
      playerY: playerPosition.y,
    });

    // Mirror the server-side flint consumption locally so the client state
    // (which is what gets persisted on the next save) stays in sync.
    consumingInventoryItem(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT, 1);

    showToast('Fire started.');
    return true;
  } catch (error) {
    showToast(
      error instanceof Error ? error.message : 'Could not ignite fire.'
    );
    return true;
  }
}

/**
 * Returns a callback that tries fire actions on secondary tile clicks.
 */
export function usingWorldPlazaFlintIgnitionAttempt({
  onlineUserId,
  localPersistenceOwnerId = null,
  playerPositionRef,
  inventoryState,
  placedBlocks,
  consumingInventoryItem,
}: {
  readonly onlineUserId: string | null;
  readonly localPersistenceOwnerId?: string | null;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly consumingInventoryItem: ConsumingWorldPlazaFireInventoryItem;
}) {
  const queryClient = useQueryClient();

  return useCallback(
    async (
      tilePosition: DefiningWorldBuildingTilePosition
    ): Promise<boolean> => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      return attemptingWorldPlazaFlintIgnitionAtTile({
        tilePosition,
        playerPosition,
        inventoryState,
        placedBlocks,
        onlineUserId,
        localPersistenceOwnerId,
        consumingInventoryItem,
        queryClient,
      });
    },
    [
      consumingInventoryItem,
      inventoryState,
      localPersistenceOwnerId,
      onlineUserId,
      placedBlocks,
      playerPositionRef,
      queryClient,
    ]
  );
}
