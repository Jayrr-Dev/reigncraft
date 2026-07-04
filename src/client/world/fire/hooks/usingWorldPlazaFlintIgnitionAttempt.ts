'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { findingWorldBuildingPlacedBlockAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { ignitingWorldFireDevvitCell } from '@/components/world/fire/repositories/callingWorldFireDevvitApi';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { showToast } from '@devvit/web/client';
import { useCallback, type RefObject } from 'react';
import {
  resolvingWorldFireDevvitMaterialProperties,
  WORLD_FIRE_DEVVIT_IGNITE_API_PATH,
  WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES,
} from '../../../../shared/worldFireDevvit';

/** Params for {@link attemptingWorldPlazaFlintIgnitionAtTile}. */
export type AttemptingWorldPlazaFlintIgnitionAtTileParams = {
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly inventoryState: DefiningInventoryState;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly onlineUserId: string | null;
};

function checkingWorldPlazaInventoryHasFlint(
  inventoryState: DefiningInventoryState
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT &&
      slot.quantity > 0
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

/**
 * Attempts to ignite a flammable placed block with flint when in range.
 */
export async function attemptingWorldPlazaFlintIgnitionAtTile({
  tilePosition,
  playerPosition,
  inventoryState,
  placedBlocks,
  onlineUserId,
}: AttemptingWorldPlazaFlintIgnitionAtTileParams): Promise<boolean> {
  if (!onlineUserId) {
    return false;
  }

  if (!checkingWorldPlazaInventoryHasFlint(inventoryState)) {
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
 * Returns a callback that tries flint ignition on secondary tile clicks.
 */
export function usingWorldPlazaFlintIgnitionAttempt({
  onlineUserId,
  playerPositionRef,
  inventoryState,
  placedBlocks,
}: {
  readonly onlineUserId: string | null;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
}) {
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
      });
    },
    [inventoryState, onlineUserId, placedBlocks, playerPositionRef]
  );
}
