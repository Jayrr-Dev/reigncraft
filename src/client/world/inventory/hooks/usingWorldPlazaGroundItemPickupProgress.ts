'use client';

/**
 * Ground-item pickup channel adapter over shared timed interaction progress.
 *
 * @module components/world/inventory/hooks/usingWorldPlazaGroundItemPickupProgress
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { checkingWorldPlazaGroundItemPickupInRange } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemPickupInRange';
import { resolvingWorldPlazaGroundItemPickupDurationMs } from '@/components/world/inventory/domains/resolvingWorldPlazaGroundItemPickupDurationMs';
import { useCallback, type RefObject } from 'react';

export type DefiningWorldPlazaGroundItemPickupProgressContext = {
  readonly groundItem: DefiningWorldPlazaGroundItem;
  readonly quantityAccepted: number;
};

export type UsingWorldPlazaGroundItemPickupProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly onPickupComplete: (
    context: DefiningWorldPlazaGroundItemPickupProgressContext
  ) => void;
};

export type UsingWorldPlazaGroundItemPickupProgressResult = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingGroundItemPickup: (options: {
    readonly groundItem: DefiningWorldPlazaGroundItem;
    readonly quantityAccepted: number;
  }) => boolean;
  readonly cancellingGroundItemPickup: () => void;
  readonly isGroundItemPickupActive: () => boolean;
  readonly activePickupGroundItemId: string | null;
};

/**
 * Pickup channel: hold range until complete, then grant into inventory.
 */
export function usingWorldPlazaGroundItemPickupProgress({
  playerPositionRef,
  onPickupComplete,
}: UsingWorldPlazaGroundItemPickupProgressParams): UsingWorldPlazaGroundItemPickupProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<DefiningWorldPlazaGroundItemPickupProgressContext>(
      {
        onComplete: onPickupComplete,
      }
    );

  const startingGroundItemPickup = useCallback(
    (options: {
      readonly groundItem: DefiningWorldPlazaGroundItem;
      readonly quantityAccepted: number;
    }): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaGroundItemPickupInRange(
          playerPosition,
          options.groundItem
        )
      ) {
        return false;
      }

      const durationMs = resolvingWorldPlazaGroundItemPickupDurationMs(
        options.groundItem.itemTypeId
      );

      return startingTimedInteraction({
        targetKey: options.groundItem.id,
        durationMs,
        context: {
          groundItem: options.groundItem,
          quantityAccepted: options.quantityAccepted,
        },
        checkingShouldContinue: () => {
          const currentPosition = playerPositionRef.current;

          if (!currentPosition) {
            return false;
          }

          return checkingWorldPlazaGroundItemPickupInRange(
            currentPosition,
            options.groundItem
          );
        },
      });
    },
    [playerPositionRef, startingTimedInteraction]
  );

  const isGroundItemPickupActive = useCallback((): boolean => {
    return snapshot.isActive;
  }, [snapshot.isActive]);

  return {
    snapshot,
    progressRatioRef,
    startingGroundItemPickup,
    cancellingGroundItemPickup: cancellingTimedInteraction,
    isGroundItemPickupActive,
    activePickupGroundItemId: snapshot.activeTargetKey,
  };
}
