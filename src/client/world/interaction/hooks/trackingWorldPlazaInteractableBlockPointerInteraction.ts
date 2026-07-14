'use client';

import { DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import type { DefiningWorldPlazaInteractableBlockClickDispatch } from '@/components/world/interaction/domains/definingWorldPlazaInteractableBlockClickAction';
import type { DefiningWorldPlazaInteractablePointerHitContext } from '@/components/world/interaction/domains/definingWorldPlazaInteractablePointerHitContext';
import { resolvingWorldPlazaInteractableFlowerFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableFlowerFromPointerGridPoint';
import { resolvingWorldPlazaInteractablePebbleFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePebbleFromPointerGridPoint';
import { resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint';
import { resolvingWorldPlazaInteractableRockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableRockFromPointerGridPoint';
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
  /** Runtime/persisted mine state keyed by anchor tile. */
  readonly minedRockStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >;
  /** Opens the rock mine popover for a procedural column rock. */
  readonly onProceduralRockPopoverSelect?: (
    anchorTileX: number,
    anchorTileY: number
  ) => void;
  /** Runtime/persisted pick state keyed by pebble tile. */
  readonly pickedPebbleStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
  /** Opens the pebble pick popover for a floor stone decoration. */
  readonly onProceduralPebblePopoverSelect?: (
    tileX: number,
    tileY: number
  ) => void;
  /** Runtime/persisted pick state keyed by flower tile. */
  readonly pickedFlowerStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >;
  /** Opens the flower pick popover for a biome flower dot. */
  readonly onProceduralFlowerPopoverSelect?: (
    tileX: number,
    tileY: number
  ) => void;
};

export type TrackingWorldPlazaInteractableBlockPointerInteractionResult = {
  readonly handlingInteractableBlockPointerDown: (
    pointerContext: DefiningWorldPlazaInteractablePointerHitContext | null
  ) => boolean;
};

function resolvingWorldPlazaTreeChopPointerHitContext(
  pointerContext: DefiningWorldPlazaInteractablePointerHitContext
) {
  if (
    pointerContext.viewportScreenPoint === undefined ||
    pointerContext.cameraOffset === undefined ||
    pointerContext.cameraWorldZoom === undefined
  ) {
    return null;
  }

  return {
    gridPoint: pointerContext.gridPoint,
    viewportScreenPoint: pointerContext.viewportScreenPoint,
    cameraOffset: pointerContext.cameraOffset,
    cameraWorldZoom: pointerContext.cameraWorldZoom,
  };
}

/**
 * Dispatches viewport pointer clicks to registered interactable block handlers.
 *
 * Procedural trees use the same popover flow as placed tree blocks when
 * `natural:tree:oak` is registered in handlers. Procedural rocks use
 * `onProceduralRockPopoverSelect` independently of the tree handler.
 * Floor pebbles use `onProceduralPebblePopoverSelect` after rock resolution fails.
 * Biome flowers use `onProceduralFlowerPopoverSelect` after pebble resolution fails.
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
  minedRockStateByTileKey,
  onProceduralRockPopoverSelect,
  pickedPebbleStateByTileKey,
  onProceduralPebblePopoverSelect,
  pickedFlowerStateByTileKey,
  onProceduralFlowerPopoverSelect,
}: TrackingWorldPlazaInteractableBlockPointerInteractionParams): TrackingWorldPlazaInteractableBlockPointerInteractionResult {
  const enabledDefinitionIds = useMemo(
    () => new Set(Object.keys(handlers)),
    [handlers]
  );

  const handlingInteractableBlockPointerDown = useCallback(
    (
      pointerContext: DefiningWorldPlazaInteractablePointerHitContext | null
    ): boolean => {
      if (!isEnabled || !pointerContext) {
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const match =
        resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
          pointerContext,
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

      if (handlers[DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK]) {
        const treeChopPointerContext =
          resolvingWorldPlazaTreeChopPointerHitContext(pointerContext);

        if (treeChopPointerContext) {
          const treeMatch =
            resolvingWorldPlazaInteractableTreeFromPointerGridPoint(
              treeChopPointerContext,
              playerPosition,
              placedBlocks,
              chopPersistenceOwnerId,
              choppedTreeStateByTileKey
            );

          if (
            treeMatch &&
            !treeMatch.tree.placedBlockId &&
            onProceduralTreePopoverSelect
          ) {
            onProceduralTreePopoverSelect(
              treeMatch.tilePosition.tileX,
              treeMatch.tilePosition.tileY
            );
            return true;
          }
        }
      }

      if (onProceduralRockPopoverSelect) {
        const rockMatch =
          resolvingWorldPlazaInteractableRockFromPointerGridPoint(
            pointerContext.gridPoint,
            playerPosition,
            chopPersistenceOwnerId,
            minedRockStateByTileKey
          );

        if (rockMatch) {
          onProceduralRockPopoverSelect(
            rockMatch.anchorTileX,
            rockMatch.anchorTileY
          );
          return true;
        }
      }

      if (onProceduralPebblePopoverSelect) {
        const pebbleMatch =
          resolvingWorldPlazaInteractablePebbleFromPointerGridPoint(
            pointerContext.gridPoint,
            playerPosition,
            chopPersistenceOwnerId,
            pickedPebbleStateByTileKey
          );

        if (pebbleMatch) {
          onProceduralPebblePopoverSelect(pebbleMatch.tileX, pebbleMatch.tileY);
          return true;
        }
      }

      if (onProceduralFlowerPopoverSelect) {
        const flowerMatch =
          resolvingWorldPlazaInteractableFlowerFromPointerGridPoint(
            pointerContext.gridPoint,
            playerPosition,
            chopPersistenceOwnerId,
            pickedFlowerStateByTileKey
          );

        if (flowerMatch) {
          onProceduralFlowerPopoverSelect(flowerMatch.tileX, flowerMatch.tileY);
          return true;
        }
      }

      return false;
    },
    [
      actorUserId,
      chopPersistenceOwnerId,
      choppedTreeStateByTileKey,
      enabledDefinitionIds,
      handlers,
      isEnabled,
      minedRockStateByTileKey,
      onProceduralFlowerPopoverSelect,
      onProceduralPebblePopoverSelect,
      onProceduralRockPopoverSelect,
      onProceduralTreePopoverSelect,
      pickedFlowerStateByTileKey,
      pickedPebbleStateByTileKey,
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
