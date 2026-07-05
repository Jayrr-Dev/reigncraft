'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  resolvingWorldPlazaInteractableTreeFromPointerGridPoint,
  type ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult,
} from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableTreeFromPointerGridPoint';
import { useCallback } from 'react';

export type TrackingWorldPlazaInteractableTreePointerInteractionHandler = (
  match: ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult
) => void;

export type TrackingWorldPlazaInteractableTreePointerInteractionParams = {
  readonly isEnabled: boolean;
  readonly persistenceOwnerId: string | null;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly remainingVisualLayerByTileKey: ReadonlyMap<string, number>;
  readonly onTreeClick: TrackingWorldPlazaInteractableTreePointerInteractionHandler;
};

export type TrackingWorldPlazaInteractableTreePointerInteractionResult = {
  readonly handlingInteractableTreePointerDown: (
    pointerGridPoint: DefiningWorldPlazaWorldPoint | null
  ) => boolean;
};

/**
 * Dispatches viewport clicks to the tree chop handler when a tree is under the pointer.
 */
export function trackingWorldPlazaInteractableTreePointerInteraction({
  isEnabled,
  persistenceOwnerId,
  playerPositionRef,
  placedBlocks,
  remainingVisualLayerByTileKey,
  onTreeClick,
}: TrackingWorldPlazaInteractableTreePointerInteractionParams): TrackingWorldPlazaInteractableTreePointerInteractionResult {
  const handlingInteractableTreePointerDown = useCallback(
    (pointerGridPoint: DefiningWorldPlazaWorldPoint | null): boolean => {
      if (!isEnabled || !pointerGridPoint) {
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const match = resolvingWorldPlazaInteractableTreeFromPointerGridPoint(
        pointerGridPoint,
        playerPosition,
        placedBlocks,
        persistenceOwnerId,
        remainingVisualLayerByTileKey
      );

      if (!match) {
        return false;
      }

      onTreeClick(match);
      return true;
    },
    [
      isEnabled,
      onTreeClick,
      persistenceOwnerId,
      placedBlocks,
      playerPositionRef,
      remainingVisualLayerByTileKey,
    ]
  );

  return {
    handlingInteractableTreePointerDown,
  };
}
