'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { checkingWorldPlazaInventoryFoodEatShouldContinue } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryFoodEatShouldContinue';
import { resolvingWorldPlazaInventoryFoodEatDurationMs } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodEatDurationRegistry';
import { resolvingWorldPlazaInventoryFoodEatFlavorLine } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodEatFlavorTextConstants';
import {
  DEFINING_WORLD_PLAZA_FOOD_EAT_PROGRESS_TARGET_KEY,
  DEFINING_WORLD_PLAZA_FOOD_EAT_TIMED_INTERACTION_PROGRESS_ICON,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodEatTimedInteractionConstants';
import type { DefiningWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { useCallback, useEffect, useState, type RefObject } from 'react';

export type DefiningWorldPlazaInventoryFoodEatProgressContext = {
  readonly slotIndex: number;
  readonly foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  readonly itemMetadata: Readonly<Record<string, unknown>> | undefined;
  readonly flavorLine: string;
  readonly damageBaselineMs: number | null;
};

export type UsingWorldPlazaInventoryFoodEatProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaInventoryFoodEatOverlaySnapshot = {
  readonly isVisible: boolean;
  readonly flavorLine: string;
};

export type UsingWorldPlazaInventoryFoodEatProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly healthStateRef: RefObject<DefiningWorldPlazaEntityHealthState>;
  readonly keyboardDirectionRef: RefObject<DefiningWorldPlazaMovementDirection>;
  readonly walkTargetRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly jumpRequestedRef: RefObject<boolean>;
  readonly rollRequestedRef: RefObject<boolean>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly onEatComplete: (
    context: DefiningWorldPlazaInventoryFoodEatProgressContext
  ) => void;
};

export type UsingWorldPlazaInventoryFoodEatProgressResult = {
  readonly snapshot: UsingWorldPlazaInventoryFoodEatProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly overlaySnapshot: UsingWorldPlazaInventoryFoodEatOverlaySnapshot;
  readonly startingFoodEat: (options: {
    readonly slotIndex: number;
    readonly foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
    readonly itemMetadata?: Readonly<Record<string, unknown>>;
  }) => boolean;
  readonly cancellingFoodEat: () => void;
  readonly isFoodEatActive: () => boolean;
};

/**
 * Food eat channel adapter over the shared timed interaction progress mechanic.
 *
 * Holds the avatar in place via tool action until complete, damage, or a new
 * walk / jump / roll intent cancels the channel.
 */
export function usingWorldPlazaInventoryFoodEatProgress({
  playerPositionRef,
  healthStateRef,
  keyboardDirectionRef,
  walkTargetRef,
  jumpRequestedRef,
  rollRequestedRef,
  avatarToolActionRef,
  onEatComplete,
}: UsingWorldPlazaInventoryFoodEatProgressParams): UsingWorldPlazaInventoryFoodEatProgressResult {
  const [flavorLine, setFlavorLine] = useState('');

  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<DefiningWorldPlazaInventoryFoodEatProgressContext>(
      {
        onComplete: onEatComplete,
        ...(avatarToolActionRef ? { avatarToolActionRef } : {}),
      }
    );

  useEffect(() => {
    if (!snapshot.isActive && !snapshot.isCancelling) {
      setFlavorLine('');
    }
  }, [snapshot.isActive, snapshot.isCancelling]);

  const startingFoodEat = useCallback(
    (options: {
      readonly slotIndex: number;
      readonly foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
      readonly itemMetadata?: Readonly<Record<string, unknown>>;
    }): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const damageBaselineMs = healthStateRef.current.lastDamagedAtMs;
      const nextFlavorLine = resolvingWorldPlazaInventoryFoodEatFlavorLine();
      const durationMs = resolvingWorldPlazaInventoryFoodEatDurationMs({
        itemTypeId: options.foodDefinition.itemTypeId,
        wildlifeSpeciesId: options.foodDefinition.wildlifeSpeciesId,
      });

      // Drop any queued path so eat can start; new walk intent after this cancels.
      walkTargetRef.current = null;
      jumpRequestedRef.current = false;
      rollRequestedRef.current = false;

      const context: DefiningWorldPlazaInventoryFoodEatProgressContext = {
        slotIndex: options.slotIndex,
        foodDefinition: options.foodDefinition,
        itemMetadata: options.itemMetadata,
        flavorLine: nextFlavorLine,
        damageBaselineMs,
      };

      const didStart = startingTimedInteraction({
        targetKey: DEFINING_WORLD_PLAZA_FOOD_EAT_PROGRESS_TARGET_KEY,
        durationMs,
        context,
        progressIcon:
          DEFINING_WORLD_PLAZA_FOOD_EAT_TIMED_INTERACTION_PROGRESS_ICON,
        avatarToolAction: {
          toolActionId: 'eat',
          targetGridX: playerPosition.x,
          targetGridY: playerPosition.y,
        },
        checkingShouldContinue: () => {
          return checkingWorldPlazaInventoryFoodEatShouldContinue({
            damageBaselineMs,
            lastDamagedAtMs: healthStateRef.current.lastDamagedAtMs,
            keyboardDirection: keyboardDirectionRef.current,
            walkTarget: walkTargetRef.current,
            jumpRequested: jumpRequestedRef.current,
            rollRequested: rollRequestedRef.current,
          });
        },
      });

      if (!didStart) {
        return false;
      }

      setFlavorLine(nextFlavorLine);
      return true;
    },
    [
      healthStateRef,
      jumpRequestedRef,
      keyboardDirectionRef,
      playerPositionRef,
      rollRequestedRef,
      startingTimedInteraction,
      walkTargetRef,
    ]
  );

  const isFoodEatActive = useCallback((): boolean => {
    return snapshot.isActive;
  }, [snapshot.isActive]);

  const overlaySnapshot: UsingWorldPlazaInventoryFoodEatOverlaySnapshot = {
    isVisible: snapshot.isActive || snapshot.isCancelling,
    flavorLine,
  };

  return {
    snapshot,
    progressRatioRef,
    overlaySnapshot,
    startingFoodEat,
    cancellingFoodEat: cancellingTimedInteraction,
    isFoodEatActive,
  };
}
