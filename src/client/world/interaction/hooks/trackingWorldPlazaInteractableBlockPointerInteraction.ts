'use client';

import { DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaInteractableBlockClickDispatch } from '@/components/world/interaction/domains/definingWorldPlazaInteractableBlockClickAction';
import { resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint';
import { resolvingWorldPlazaInteractableTreeFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableTreeFromPointerGridPoint';
import { useCallback, useMemo } from 'react';

export type TrackingWorldPlazaInteractableBlockPointerInteractionHandler = (
  block: DefiningWorldBuildingPlacedBlock
) => void;

export type TrackingWorldPlazaInteractableBlockPointerInteractionHandlers =
  Readonly<
    Partial<
      Record<
        string,
        TrackingWorldPlazaInteractableBlockPointerInteractionHandler
      >
    >
  >;

export type TrackingWorldPlazaInteractableBlockPointerInteractionParams = {
  readonly isEnabled: boolean;
  readonly actorUserId: string | null;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly handlers: TrackingWorldPlazaInteractableBlockPointerInteractionHandlers;
  /** Persistence owner for procedural tree chop state. */
  readonly chopPersistenceOwnerId?: string | null;
  readonly choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  /** Opens the tree popover for a procedural (non-placed-block) tree. */
  readonly onProceduralTreePopoverSelect?: (
    tileX: number,
    tileY: number
  ) => void;
};

export type TrackingWorldPlazaInteractableBlockPointerInteractionResult = {
  readonly handlingInteractableBlockPointerDown: (
    pointerGridPoint: DefiningWorldPlazaWorldPoint | null
  ) => boolean;
};

/**
 * Dispatches viewport pointer clicks to registered interactable block handlers.
 *
 * Procedural trees use the same popover flow as placed tree blocks when
 * `natural:tree:oak` is registered in handlers.
 */
export function trackingWorldPlazaInteractableBlockPointerInteraction({
  isEnabled,
  actorUserId,
  playerPositionRef,
  placedBlocks,
  handlers,
  chopPersistenceOwnerId = null,
  choppedTreeStateByTileKey,
  onProceduralTreePopoverSelect,
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

      const match =
        resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
          pointerGridPoint,
          playerPosition,
          placedBlocks,
          actorUserId,
          enabledDefinitionIds
        );

      if (match) {
        const handler = handlers[match.block.definitionId];

        if (!handler) {
          return false;
        }

        handler(match.block);
        return true;
      }

      if (!handlers[DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK]) {
        return false;
      }

      const treeMatch = resolvingWorldPlazaInteractableTreeFromPointerGridPoint(
        pointerGridPoint,
        playerPosition,
        placedBlocks,
        chopPersistenceOwnerId,
        choppedTreeStateByTileKey
      );

      if (!treeMatch || treeMatch.tree.placedBlockId) {
        return false;
      }

      if (onProceduralTreePopoverSelect) {
        onProceduralTreePopoverSelect(
          treeMatch.tilePosition.tileX,
          treeMatch.tilePosition.tileY
        );
        return true;
      }

      return false;
    },
    [
      actorUserId,
      chopPersistenceOwnerId,
      enabledDefinitionIds,
      handlers,
      isEnabled,
      onProceduralTreePopoverSelect,
      placedBlocks,
      playerPositionRef,
      choppedTreeStateByTileKey,
    ]
  );

  return {
    handlingInteractableBlockPointerDown,
  };
}

export type DefiningWorldPlazaInteractableBlockClickDispatchFilter =
  DefiningWorldPlazaInteractableBlockClickDispatch;
