'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_COOK_TIMED_INTERACTION_PROGRESS_ICON } from '@/components/world/fire/domains/definingWorldPlazaCampfireCookTimedInteractionConstants';
import { formattingWorldPlazaCampfireCookProgressTargetKey } from '@/components/world/fire/domains/formattingWorldPlazaCampfireCookProgressTargetKey';
import { formattingWorldPlazaCampfireInteractionTileKey } from '@/components/world/fire/domains/formattingWorldPlazaCampfireInteractionTileKey';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import type { DefiningWildlifeMeatCookRecipe } from '@/components/world/wildlife/domains/definingWildlifeMeatCookRecipes';
import { useCallback, type RefObject } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';
import { WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES } from '../../../../shared/worldFireDevvit';

export type DefiningWorldPlazaCampfireCookProgressContext = {
  readonly block: DefiningWorldBuildingPlacedBlock;
  readonly recipe: DefiningWildlifeMeatCookRecipe;
};

export type UsingWorldPlazaCampfireCookProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaCampfireCookProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly fireCellsRef: RefObject<readonly WorldFireDevvitCell[]>;
  readonly onCookComplete: (
    context: DefiningWorldPlazaCampfireCookProgressContext
  ) => void;
};

export type UsingWorldPlazaCampfireCookProgressResult = {
  readonly snapshot: UsingWorldPlazaCampfireCookProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingCampfireCook: (
    block: DefiningWorldBuildingPlacedBlock,
    recipe: DefiningWildlifeMeatCookRecipe
  ) => boolean;
  readonly cancellingCampfireCook: () => void;
};

function checkingWorldPlazaCampfireCookStillInRange(
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

function checkingWorldPlazaCampfireCookStillSelected(
  selectedKeys: ReadonlySet<string>,
  block: DefiningWorldBuildingPlacedBlock
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaCampfireInteractionTileKey(block)
  );
}

function checkingWorldPlazaCampfireCookStillLit(
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
 * Campfire meat cooking adapter over the shared timed interaction progress mechanic.
 */
export function usingWorldPlazaCampfireCookProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  fireCellsRef,
  onCookComplete,
}: UsingWorldPlazaCampfireCookProgressParams): UsingWorldPlazaCampfireCookProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<DefiningWorldPlazaCampfireCookProgressContext>(
      {
        onComplete: onCookComplete,
      }
    );

  const startingCampfireCook = useCallback(
    (
      block: DefiningWorldBuildingPlacedBlock,
      recipe: DefiningWildlifeMeatCookRecipe
    ): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaCampfireCookStillInRange(playerPosition, block) ||
        !checkingWorldPlazaCampfireCookStillLit(block, fireCellsRef.current)
      ) {
        return false;
      }

      const context: DefiningWorldPlazaCampfireCookProgressContext = {
        block,
        recipe,
      };

      return startingTimedInteraction({
        targetKey: formattingWorldPlazaCampfireCookProgressTargetKey(block),
        durationMs: recipe.cookDurationMs,
        context,
        progressIcon:
          DEFINING_WORLD_PLAZA_CAMPFIRE_COOK_TIMED_INTERACTION_PROGRESS_ICON,
        checkingShouldContinue: () => {
          const currentPlayerPosition = playerPositionRef.current;
          const selectedKeys = selectedInteractableBlockKeysRef.current;

          if (!currentPlayerPosition) {
            return false;
          }

          return (
            checkingWorldPlazaCampfireCookStillInRange(
              currentPlayerPosition,
              block
            ) &&
            checkingWorldPlazaCampfireCookStillSelected(selectedKeys, block) &&
            checkingWorldPlazaCampfireCookStillLit(block, fireCellsRef.current)
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
    startingCampfireCook,
    cancellingCampfireCook: cancellingTimedInteraction,
  };
}
