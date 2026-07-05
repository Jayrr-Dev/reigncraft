'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  addingWorldPlazaLocalFireCellFuel,
  ignitingWorldPlazaLocalFireCell,
} from '@/components/world/fire/domains/managingWorldPlazaLocalFireCells';
import { DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT } from '@/components/world/fire/hooks/usingWorldPlazaFireCells';
import type { ConsumingWorldPlazaFireInventoryItem } from '@/components/world/fire/hooks/usingWorldPlazaFlintIgnitionAttempt';
import {
  addingWorldFireDevvitCampfireFuel,
  ignitingWorldFireDevvitCell,
} from '@/components/world/fire/repositories/callingWorldFireDevvitApi';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useCallback, type RefObject } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';
import {
  buildingWorldFireDevvitTileKey,
  WORLD_FIRE_DEVVIT_ADD_FUEL_API_PATH,
  WORLD_FIRE_DEVVIT_IGNITE_API_PATH,
} from '../../../../shared/worldFireDevvit';

/** Outcome from a campfire ignite or refuel action. */
export type UsingWorldPlazaCampfireInteractionActionResult = {
  readonly ok: boolean;
  readonly message: string | null;
};

/** Params for campfire interaction actions. */
export type UsingWorldPlazaCampfireInteractionParams = {
  readonly onlineUserId: string | null;
  readonly localPersistenceOwnerId: string | null;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly fireCells: readonly WorldFireDevvitCell[];
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly inventoryState: DefiningInventoryState;
  readonly consumingInventoryItem: ConsumingWorldPlazaFireInventoryItem;
  readonly onInventoryChanged?: () => void;
};

function findingWorldPlazaCampfireFireCellAtBlock(
  block: DefiningWorldBuildingPlacedBlock,
  fireCells: readonly WorldFireDevvitCell[]
): WorldFireDevvitCell | null {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  return (
    fireCells.find(
      (cell) =>
        cell.kind === 'campfire' &&
        cell.tileX === block.tilePosition.tileX &&
        cell.tileY === block.tilePosition.tileY &&
        cell.worldLayer === worldLayer
    ) ?? null
  );
}

function checkingWorldPlazaInventoryHasWood(
  inventoryState: DefiningInventoryState
): boolean {
  return inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD &&
      slot.quantity > 0
  );
}

function patchingWorldPlazaOnlineFireCellsQueryCell(
  queryClient: QueryClient,
  onlineUserId: string,
  cell: WorldFireDevvitCell
): void {
  const tileKey = buildingWorldFireDevvitTileKey(
    cell.tileX,
    cell.tileY,
    cell.worldLayer
  );

  queryClient.setQueryData<{
    readonly cells: readonly WorldFireDevvitCell[];
    readonly burnedBlockIds: readonly string[];
    readonly burntGrassTileKeys: readonly string[];
    readonly extinguishedCampfireTileKeys: readonly string[];
    readonly lastSimulatedTick: number;
  }>([DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT, onlineUserId], (old) => {
    if (!old) {
      return old;
    }

    let didReplaceCell = false;
    const nextCells = old.cells.map((existingCell) => {
      const existingTileKey = buildingWorldFireDevvitTileKey(
        existingCell.tileX,
        existingCell.tileY,
        existingCell.worldLayer
      );

      if (existingTileKey !== tileKey) {
        return existingCell;
      }

      didReplaceCell = true;
      return cell;
    });

    return {
      ...old,
      cells: didReplaceCell ? nextCells : [...nextCells, cell],
    };
  });
}

/**
 * Exposes ignite and refuel actions for interactive campfire blocks.
 */
export function usingWorldPlazaCampfireInteraction({
  onlineUserId,
  localPersistenceOwnerId,
  playerPositionRef,
  fireCells,
  placedBlocks,
  inventoryState,
  consumingInventoryItem,
  onInventoryChanged,
}: UsingWorldPlazaCampfireInteractionParams) {
  const queryClient = useQueryClient();

  const invalidatingLocalFireCells = useCallback((): void => {
    void queryClient.invalidateQueries({
      queryKey: [DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT],
    });
  }, [queryClient]);

  const ignitingCampfireBlock = useCallback(
    async (
      block: DefiningWorldBuildingPlacedBlock
    ): Promise<UsingWorldPlazaCampfireInteractionActionResult> => {
      if (
        block.definitionId !== DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
      ) {
        return { ok: false, message: null };
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return { ok: false, message: 'Move closer to the campfire.' };
      }

      if (!checkingWorldPlazaInventoryHasWood(inventoryState)) {
        return { ok: false, message: 'You need wood to light the campfire.' };
      }

      if (onlineUserId) {
        try {
          const ignitedCell = await ignitingWorldFireDevvitCell(
            WORLD_FIRE_DEVVIT_IGNITE_API_PATH,
            {
              mode: 'campfire',
              tileX: block.tilePosition.tileX,
              tileY: block.tilePosition.tileY,
              worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
              playerX: playerPosition.x,
              playerY: playerPosition.y,
            }
          );

          patchingWorldPlazaOnlineFireCellsQueryCell(
            queryClient,
            onlineUserId,
            ignitedCell
          );
          void queryClient.invalidateQueries({
            queryKey: [DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT],
          });

          onInventoryChanged?.();
          return { ok: true, message: null };
        } catch (error) {
          return {
            ok: false,
            message:
              error instanceof Error
                ? error.message
                : 'Could not light campfire.',
          };
        }
      }

      if (!localPersistenceOwnerId) {
        return { ok: false, message: 'Sign in to light campfires.' };
      }

      const igniteResult = ignitingWorldPlazaLocalFireCell(
        localPersistenceOwnerId,
        {
          tileX: block.tilePosition.tileX,
          tileY: block.tilePosition.tileY,
          worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        },
        placedBlocks,
        { inventoryWoodConsumed: 1 }
      );

      if (igniteResult.outcome === 'out-of-range') {
        return { ok: false, message: 'Move closer to the campfire.' };
      }

      if (igniteResult.outcome === 'already-burning') {
        return { ok: false, message: 'This campfire is already lit.' };
      }

      if (igniteResult.outcome === 'ignited') {
        const consumed = consumingInventoryItem(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          1
        );

        if (!consumed) {
          return { ok: false, message: 'You need wood to light the campfire.' };
        }

        invalidatingLocalFireCells();
        onInventoryChanged?.();
        return { ok: true, message: null };
      }

      return { ok: false, message: 'Could not light campfire.' };
    },
    [
      consumingInventoryItem,
      invalidatingLocalFireCells,
      inventoryState,
      localPersistenceOwnerId,
      onInventoryChanged,
      onlineUserId,
      placedBlocks,
      playerPositionRef,
      queryClient,
    ]
  );

  const refuelingCampfireBlock = useCallback(
    async (
      block: DefiningWorldBuildingPlacedBlock
    ): Promise<UsingWorldPlazaCampfireInteractionActionResult> => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return { ok: false, message: 'Move closer to the campfire.' };
      }

      if (!checkingWorldPlazaInventoryHasWood(inventoryState)) {
        return { ok: false, message: 'You need wood to refuel the campfire.' };
      }

      if (onlineUserId) {
        try {
          const fueledCell = await addingWorldFireDevvitCampfireFuel(
            WORLD_FIRE_DEVVIT_ADD_FUEL_API_PATH,
            {
              tileX: block.tilePosition.tileX,
              tileY: block.tilePosition.tileY,
              worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
              playerX: playerPosition.x,
              playerY: playerPosition.y,
            }
          );

          patchingWorldPlazaOnlineFireCellsQueryCell(
            queryClient,
            onlineUserId,
            fueledCell
          );
          void queryClient.invalidateQueries({
            queryKey: [DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT],
          });

          onInventoryChanged?.();
          return { ok: true, message: null };
        } catch (error) {
          return {
            ok: false,
            message:
              error instanceof Error
                ? error.message
                : 'Could not refuel campfire.',
          };
        }
      }

      if (!localPersistenceOwnerId) {
        return { ok: false, message: 'Sign in to refuel campfires.' };
      }

      const fuelResult = addingWorldPlazaLocalFireCellFuel(
        localPersistenceOwnerId,
        {
          tileX: block.tilePosition.tileX,
          tileY: block.tilePosition.tileY,
          worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        },
        placedBlocks
      );

      if (fuelResult.outcome === 'out-of-range') {
        return { ok: false, message: 'Move closer to the campfire.' };
      }

      if (fuelResult.outcome === 'no-fire') {
        return { ok: false, message: 'No lit campfire here to refuel.' };
      }

      if (fuelResult.outcome === 'fueled') {
        const consumed = consumingInventoryItem(
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          1
        );

        if (!consumed) {
          return {
            ok: false,
            message: 'You need wood to refuel the campfire.',
          };
        }

        invalidatingLocalFireCells();
        onInventoryChanged?.();
        return { ok: true, message: null };
      }

      return { ok: false, message: 'Could not refuel campfire.' };
    },
    [
      consumingInventoryItem,
      invalidatingLocalFireCells,
      inventoryState,
      localPersistenceOwnerId,
      onInventoryChanged,
      onlineUserId,
      placedBlocks,
      playerPositionRef,
      queryClient,
    ]
  );

  const resolvingCampfireInteractionState = useCallback(
    (block: DefiningWorldBuildingPlacedBlock | null) => {
      if (
        !block ||
        block.definitionId !== DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
      ) {
        return {
          isCampfire: false,
          isLit: false,
        } as const;
      }

      return {
        isCampfire: true,
        isLit:
          findingWorldPlazaCampfireFireCellAtBlock(block, fireCells) !== null,
      } as const;
    },
    [fireCells]
  );

  const interactingWithCampfireBlock = useCallback(
    async (
      block: DefiningWorldBuildingPlacedBlock
    ): Promise<UsingWorldPlazaCampfireInteractionActionResult> => {
      const { isLit } = resolvingCampfireInteractionState(block);

      if (isLit) {
        return refuelingCampfireBlock(block);
      }

      return ignitingCampfireBlock(block);
    },
    [
      ignitingCampfireBlock,
      refuelingCampfireBlock,
      resolvingCampfireInteractionState,
    ]
  );

  return {
    ignitingCampfireBlock,
    refuelingCampfireBlock,
    interactingWithCampfireBlock,
    resolvingCampfireInteractionState,
  };
}
