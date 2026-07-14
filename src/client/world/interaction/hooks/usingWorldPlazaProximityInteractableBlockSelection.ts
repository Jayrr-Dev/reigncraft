'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { syncingWorldPlazaProximityInteractableBlockSelection } from '@/components/world/interaction/domains/syncingWorldPlazaProximityInteractableBlockSelection';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { useLayoutEffect, useRef, type RefObject } from 'react';

export type UsingWorldPlazaProximityInteractableBlockSelectionParams = {
  readonly enabled: boolean;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly selectedInteractableBlockKeysRef: RefObject<Set<string>>;
  readonly placedBlocksRef: RefObject<
    readonly DefiningWorldBuildingPlacedBlock[]
  >;
  readonly choppedTreeStateByTileKeyRef: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaChoppedTreeTileState>
  >;
  readonly chopPersistenceOwnerId: string | null;
  readonly minedRockStateByTileKeyRef: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaMinedRockTileState>
  >;
  readonly pickedPebbleStateByTileKeyRef: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaPickedPebbleTileState>
  >;
  readonly pickedFlowerStateByTileKeyRef: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaPickedFlowerTileState>
  >;
  readonly clearedLongGrassStateByTileKeyRef?: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaClearedLongGrassTileState>
  >;
  readonly farmlandByTileKeyRef: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaFarmlandTileState>
  >;
  readonly wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  readonly hasEquippedFishrodRef: RefObject<boolean>;
  readonly hasEquippedHoeRef: RefObject<boolean>;
  readonly hasEquippedScytheRef: RefObject<boolean>;
  readonly hasSeedsInInventoryRef: RefObject<boolean>;
};

/**
 * Keeps interactable label selection in sync with player proximity (1 tile).
 */
export function usingWorldPlazaProximityInteractableBlockSelection({
  enabled,
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  placedBlocksRef,
  choppedTreeStateByTileKeyRef,
  chopPersistenceOwnerId,
  minedRockStateByTileKeyRef,
  pickedPebbleStateByTileKeyRef,
  pickedFlowerStateByTileKeyRef,
  clearedLongGrassStateByTileKeyRef,
  farmlandByTileKeyRef,
  wildlifeStoreRef,
  hasEquippedFishrodRef,
  hasEquippedHoeRef,
  hasEquippedScytheRef,
  hasSeedsInInventoryRef,
}: UsingWorldPlazaProximityInteractableBlockSelectionParams): void {
  const wasEnabledRef = useRef(enabled);

  useLayoutEffect(() => {
    if (!enabled) {
      if (
        wasEnabledRef.current &&
        selectedInteractableBlockKeysRef.current.size > 0
      ) {
        selectedInteractableBlockKeysRef.current.clear();
      }
      wasEnabledRef.current = false;
      return;
    }

    wasEnabledRef.current = true;

    return subscribingWorldPlazaDomOverlayFrame(() => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        if (selectedInteractableBlockKeysRef.current.size > 0) {
          selectedInteractableBlockKeysRef.current.clear();
        }
        return;
      }

      syncingWorldPlazaProximityInteractableBlockSelection(
        selectedInteractableBlockKeysRef.current,
        {
          playerPosition,
          placedBlocks: placedBlocksRef.current,
          choppedTreeStateByTileKey: choppedTreeStateByTileKeyRef.current,
          chopPersistenceOwnerId,
          minedRockStateByTileKey: minedRockStateByTileKeyRef.current,
          pickedPebbleStateByTileKey: pickedPebbleStateByTileKeyRef.current,
          pickedFlowerStateByTileKey: pickedFlowerStateByTileKeyRef.current,
          clearedLongGrassStateByTileKey:
            clearedLongGrassStateByTileKeyRef?.current,
          farmlandByTileKey: farmlandByTileKeyRef.current,
          wildlifeStore: wildlifeStoreRef.current,
          hasEquippedFishrod: hasEquippedFishrodRef.current,
          hasEquippedHoe: hasEquippedHoeRef.current,
          hasEquippedScythe: hasEquippedScytheRef.current,
          hasSeedsInInventory: hasSeedsInInventoryRef.current,
          nowMs: Date.now(),
        }
      );
    });
  }, [
    chopPersistenceOwnerId,
    choppedTreeStateByTileKeyRef,
    clearedLongGrassStateByTileKeyRef,
    enabled,
    farmlandByTileKeyRef,
    hasEquippedFishrodRef,
    hasEquippedHoeRef,
    hasEquippedScytheRef,
    hasSeedsInInventoryRef,
    minedRockStateByTileKeyRef,
    pickedPebbleStateByTileKeyRef,
    pickedFlowerStateByTileKeyRef,
    placedBlocksRef,
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    wildlifeStoreRef,
  ]);
}
