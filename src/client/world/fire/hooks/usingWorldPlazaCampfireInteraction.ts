'use client';

import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  addingWorldFireDevvitCampfireFuel,
  ignitingWorldFireDevvitCell,
} from '@/components/world/fire/repositories/callingWorldFireDevvitApi';
import { showToast } from '@devvit/web/client';
import { useCallback, type RefObject } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';
import {
  WORLD_FIRE_DEVVIT_ADD_FUEL_API_PATH,
  WORLD_FIRE_DEVVIT_IGNITE_API_PATH,
} from '../../../../shared/worldFireDevvit';

/** Params for campfire interaction actions. */
export type UsingWorldPlazaCampfireInteractionParams = {
  readonly onlineUserId: string | null;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly fireCells: readonly WorldFireDevvitCell[];
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

/**
 * Exposes ignite and refuel actions for interactive campfire blocks.
 */
export function usingWorldPlazaCampfireInteraction({
  onlineUserId,
  playerPositionRef,
  fireCells,
  onInventoryChanged,
}: UsingWorldPlazaCampfireInteractionParams) {
  const ignitingCampfireBlock = useCallback(
    async (block: DefiningWorldBuildingPlacedBlock): Promise<void> => {
      if (!onlineUserId) {
        showToast('Sign in to light campfires.');
        return;
      }

      if (
        block.definitionId !== DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
      ) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      try {
        await ignitingWorldFireDevvitCell(WORLD_FIRE_DEVVIT_IGNITE_API_PATH, {
          mode: 'campfire',
          tileX: block.tilePosition.tileX,
          tileY: block.tilePosition.tileY,
          worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        });

        onInventoryChanged?.();
        showToast('Campfire lit.');
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : 'Could not light campfire.'
        );
      }
    },
    [onlineUserId, onInventoryChanged, playerPositionRef]
  );

  const refuelingCampfireBlock = useCallback(
    async (block: DefiningWorldBuildingPlacedBlock): Promise<void> => {
      if (!onlineUserId) {
        showToast('Sign in to refuel campfires.');
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      try {
        await addingWorldFireDevvitCampfireFuel(
          WORLD_FIRE_DEVVIT_ADD_FUEL_API_PATH,
          {
            tileX: block.tilePosition.tileX,
            tileY: block.tilePosition.tileY,
            worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
            playerX: playerPosition.x,
            playerY: playerPosition.y,
          }
        );

        onInventoryChanged?.();
        showToast('Campfire refueled.');
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : 'Could not refuel campfire.'
        );
      }
    },
    [onlineUserId, onInventoryChanged, playerPositionRef]
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

  return {
    ignitingCampfireBlock,
    refuelingCampfireBlock,
    resolvingCampfireInteractionState,
  };
}
