'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaCampfireInteractionTileKey } from '@/components/world/fire/domains/formattingWorldPlazaCampfireInteractionTileKey';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_CAMPFIRE_DURATION_MS } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey } from '@/components/world/tea-brewing/domains/formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey';
import { useCallback, type RefObject } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';
import { WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES } from '../../../../shared/worldFireDevvit';

export type DefiningWorldPlazaTeaPotCampfireBrewProgressContext = {
  readonly block: DefiningWorldBuildingPlacedBlock;
};

export type UsingWorldPlazaTeaPotCampfireBrewProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly fireCellsRef: RefObject<readonly WorldFireDevvitCell[]>;
  readonly onBrewComplete: (
    context: DefiningWorldPlazaTeaPotCampfireBrewProgressContext
  ) => void;
};

export type UsingWorldPlazaTeaPotCampfireBrewProgressResult = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingTeaPotCampfireBrew: (
    block: DefiningWorldBuildingPlacedBlock
  ) => boolean;
};

function checkingWorldPlazaTeaPotCampfireBrewStillInRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  block: DefiningWorldBuildingPlacedBlock
): boolean {
  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    block.tilePosition.tileX + 0.5,
    block.tilePosition.tileY + 0.5
  );

  return distance <= WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES;
}

function checkingWorldPlazaTeaPotCampfireBrewStillSelected(
  selectedKeys: ReadonlySet<string>,
  block: DefiningWorldBuildingPlacedBlock
): boolean {
  return selectedKeys.has(formattingWorldPlazaCampfireInteractionTileKey(block));
}

function checkingWorldPlazaTeaPotCampfireBrewStillLit(
  block: DefiningWorldBuildingPlacedBlock,
  fireCells: readonly WorldFireDevvitCell[]
): boolean {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  return fireCells.some(
    (cell) =>
      cell.kind === 'campfire' &&
      cell.tileX === block.tilePosition.tileX &&
      cell.tileY === block.tilePosition.tileY &&
      cell.worldLayer === worldLayer
  );
}

/**
 * Campfire tea brew adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaTeaPotCampfireBrewProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  fireCellsRef,
  onBrewComplete,
}: UsingWorldPlazaTeaPotCampfireBrewProgressParams): UsingWorldPlazaTeaPotCampfireBrewProgressResult {
  const { snapshot, progressRatioRef, startingTimedInteraction } =
    usingWorldPlazaTimedInteractionProgress<DefiningWorldPlazaTeaPotCampfireBrewProgressContext>(
      {
        onComplete: onBrewComplete,
      }
    );

  const startingTeaPotCampfireBrew = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaTeaPotCampfireBrewStillInRange(
          playerPosition,
          block
        ) ||
        !checkingWorldPlazaTeaPotCampfireBrewStillLit(block, fireCellsRef.current)
      ) {
        return false;
      }

      const context: DefiningWorldPlazaTeaPotCampfireBrewProgressContext = {
        block,
      };

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaTeaPotCampfireBrewProgressTargetKey(block),
        durationMs: DEFINING_WORLD_PLAZA_TEA_BREWING_CAMPFIRE_DURATION_MS,
        context,
        progressIcon: 'mdi:kettle-steam',
        checkingShouldContinue: () => {
          const currentPlayerPosition = playerPositionRef.current;
          const selectedKeys = selectedInteractableBlockKeysRef.current;

          if (!currentPlayerPosition) {
            return false;
          }

          return (
            checkingWorldPlazaTeaPotCampfireBrewStillInRange(
              currentPlayerPosition,
              block
            ) &&
            checkingWorldPlazaTeaPotCampfireBrewStillSelected(
              selectedKeys,
              block
            ) &&
            checkingWorldPlazaTeaPotCampfireBrewStillLit(
              block,
              fireCellsRef.current
            )
          );
        },
      });
    },
    [
      fireCellsRef,
      playerPositionRef,
      selectedInteractableBlockKeysRef,
      startingTimedInteraction,
    ]
  );

  return {
    snapshot,
    progressRatioRef,
    startingTeaPotCampfireBrew,
  };
}
