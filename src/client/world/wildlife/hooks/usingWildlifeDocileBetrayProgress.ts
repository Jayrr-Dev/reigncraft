'use client';

/**
 * Timed Pet windup adapter over the shared interaction progress mechanic.
 *
 * @module components/world/wildlife/hooks/usingWildlifeDocileBetrayProgress
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { checkingWildlifeDocilePetIsReady } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
import {
  DEFINING_WILDLIFE_DOCILE_PET_PROGRESS_ICON,
  DEFINING_WILDLIFE_DOCILE_PET_WINDUP_MS,
} from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import type { ManagingWildlifeDocileAttackConfirmPending } from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import {
  clearingWildlifeDocileAttackConfirmPending,
  readingWildlifeDocileAttackConfirmPending,
} from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import {
  DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID,
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import { useCallback, type RefObject } from 'react';

export type UsingWildlifeDocileBetrayProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  readonly onBetrayComplete: (
    pending: ManagingWildlifeDocileAttackConfirmPending
  ) => void;
};

export type UsingWildlifeDocileBetrayProgressResult = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingDocileBetray: (
    pending: ManagingWildlifeDocileAttackConfirmPending
  ) => boolean;
  readonly cancellingDocileBetray: () => void;
};

function checkingWildlifeDocilePetStillInRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  targetX: number,
  targetY: number
): boolean {
  const distance = Math.hypot(
    targetX - playerPosition.x,
    targetY - playerPosition.y
  );

  return distance <= DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID;
}

/**
 * Starts a Chop-style timed windup for Pet on a living cat or dog.
 */
export function usingWildlifeDocileBetrayProgress({
  playerPositionRef,
  wildlifeStoreRef,
  onBetrayComplete,
}: UsingWildlifeDocileBetrayProgressParams): UsingWildlifeDocileBetrayProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<ManagingWildlifeDocileAttackConfirmPending>(
      {
        onComplete: (pending) => {
          clearingWildlifeDocileAttackConfirmPending();
          onBetrayComplete(pending);
        },
      }
    );

  const startingDocileBetray = useCallback(
    (pending: ManagingWildlifeDocileAttackConfirmPending): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        pending.instanceId
      );

      if (!instance || instance.isDead) {
        clearingWildlifeDocileAttackConfirmPending();
        return false;
      }

      // Familiar+ namable bonds use Name? → companion panel. Never Pet windup.
      const loyalty = instance.petBond?.loyalty ?? 0;
      if (
        loyalty > 0 &&
        checkingWildlifePetHasCapability(loyalty, 'namable')
      ) {
        return false;
      }

      if (!checkingWildlifeDocilePetIsReady(instance, Date.now())) {
        clearingWildlifeDocileAttackConfirmPending();
        return false;
      }

      if (
        !checkingWildlifeDocilePetStillInRange(
          playerPosition,
          instance.position.x,
          instance.position.y
        )
      ) {
        return false;
      }

      return startingTimedInteraction({
        targetKey: pending.instanceId,
        durationMs: DEFINING_WILDLIFE_DOCILE_PET_WINDUP_MS,
        context: pending,
        progressIcon: DEFINING_WILDLIFE_DOCILE_PET_PROGRESS_ICON,
        checkingShouldContinue: () => {
          const currentPlayerPosition = playerPositionRef.current;
          const currentPending = readingWildlifeDocileAttackConfirmPending();
          const liveInstance = gettingWildlifeInstance(
            wildlifeStoreRef.current,
            pending.instanceId
          );

          if (
            !currentPlayerPosition ||
            !currentPending ||
            currentPending.instanceId !== pending.instanceId ||
            !liveInstance ||
            liveInstance.isDead
          ) {
            return false;
          }

          return checkingWildlifeDocilePetStillInRange(
            currentPlayerPosition,
            liveInstance.position.x,
            liveInstance.position.y
          );
        },
      });
    },
    [playerPositionRef, startingTimedInteraction, wildlifeStoreRef]
  );

  return {
    snapshot,
    progressRatioRef,
    startingDocileBetray,
    cancellingDocileBetray: cancellingTimedInteraction,
  };
}
