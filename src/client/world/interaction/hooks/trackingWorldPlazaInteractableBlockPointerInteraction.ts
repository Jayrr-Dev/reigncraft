'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaInteractableBlockClickDispatch } from '@/components/world/interaction/domains/definingWorldPlazaInteractableBlockClickAction';
import { resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint';
import { useCallback, useMemo } from 'react';

export type TrackingWorldPlazaInteractableBlockPointerInteractionHandler = (
  block: DefiningWorldBuildingPlacedBlock
) => void;

export type TrackingWorldPlazaInteractableBlockPointerInteractionHandlers = Readonly<
  Partial<
    Record<string, TrackingWorldPlazaInteractableBlockPointerInteractionHandler>
  >
>;

export type TrackingWorldPlazaInteractableBlockPointerInteractionParams = {
  readonly isEnabled: boolean;
  readonly actorUserId: string | null;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly handlers: TrackingWorldPlazaInteractableBlockPointerInteractionHandlers;
};

export type TrackingWorldPlazaInteractableBlockPointerInteractionResult = {
  readonly handlingInteractableBlockPointerDown: (
    pointerGridPoint: DefiningWorldPlazaWorldPoint | null
  ) => boolean;
};

/**
 * Dispatches viewport pointer clicks to registered interactable block handlers.
 */
export function trackingWorldPlazaInteractableBlockPointerInteraction({
  isEnabled,
  actorUserId,
  playerPositionRef,
  placedBlocks,
  handlers,
}: TrackingWorldPlazaInteractableBlockPointerInteractionParams): TrackingWorldPlazaInteractableBlockPointerInteractionResult {
  const enabledDefinitionIds = useMemo(
    () => new Set(Object.keys(handlers)),
    [handlers]
  );

  const handlingInteractableBlockPointerDown = useCallback(
    (pointerGridPoint: DefiningWorldPlazaWorldPoint | null): boolean => {
      if (!isEnabled || !pointerGridPoint) {
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const match = resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
        pointerGridPoint,
        playerPosition,
        placedBlocks,
        actorUserId,
        enabledDefinitionIds
      );

      if (!match) {
        return false;
      }

      const handler = handlers[match.block.definitionId];

      if (!handler) {
        return false;
      }

      handler(match.block);
      return true;
    },
    [
      actorUserId,
      enabledDefinitionIds,
      handlers,
      isEnabled,
      placedBlocks,
      playerPositionRef,
    ]
  );

  return {
    handlingInteractableBlockPointerDown,
  };
}

export type DefiningWorldPlazaInteractableBlockClickDispatchFilter =
  DefiningWorldPlazaInteractableBlockClickDispatch;
