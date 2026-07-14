'use client';

/**
 * Tracks whether the local player is within reach of an ore-smelting station.
 *
 * @module components/world/crafting/hooks/usingWorldPlazaOreSmeltingStationReachability
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldPlazaOreSmeltingStationWithinUiKeepOpenRange,
  resolvingWorldPlazaOreSmeltingNearbyStation,
} from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingNearbyStation';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export type UsingWorldPlazaOreSmeltingStationReachabilityParams = {
  readonly enabled: boolean;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly placedBlocksRef: RefObject<
    readonly DefiningWorldBuildingPlacedBlock[]
  >;
  /** Open bloomery / kiln / stove UI target; auto-closes when player walks away. */
  readonly selectedStationBlockRef: RefObject<DefiningWorldBuildingPlacedBlock | null>;
  readonly closingSelectedStation: () => void;
};

export type UsingWorldPlazaOreSmeltingStationReachabilityResult = {
  readonly isNearOreSmeltingStation: boolean;
  readonly resolvingNearbyOreSmeltingStation: () => DefiningWorldBuildingPlacedBlock | null;
};

/**
 * React-reachable flag for inventory Refine / Add Fuel actions, synced on the
 * DOM overlay frame so buttons appear/disappear as the player walks.
 * Also dismisses the open station UI past keep-open range.
 */
export function usingWorldPlazaOreSmeltingStationReachability({
  enabled,
  playerPositionRef,
  placedBlocksRef,
  selectedStationBlockRef,
  closingSelectedStation,
}: UsingWorldPlazaOreSmeltingStationReachabilityParams): UsingWorldPlazaOreSmeltingStationReachabilityResult {
  const [isNearOreSmeltingStation, setIsNearOreSmeltingStation] =
    useState(false);
  const nearbyStationRef = useRef<DefiningWorldBuildingPlacedBlock | null>(
    null
  );
  const closingSelectedStationRef = useRef(closingSelectedStation);
  closingSelectedStationRef.current = closingSelectedStation;

  useLayoutEffect(() => {
    if (!enabled) {
      nearbyStationRef.current = null;
      setIsNearOreSmeltingStation(false);
      return;
    }

    return subscribingWorldPlazaDomOverlayFrame(() => {
      const playerPosition = playerPositionRef.current;
      const nextStation = playerPosition
        ? resolvingWorldPlazaOreSmeltingNearbyStation({
            playerWorldPoint: playerPosition,
            placedBlocks: placedBlocksRef.current,
          })
        : null;
      const nextIsNear = nextStation !== null;
      const previousIsNear = nearbyStationRef.current !== null;

      nearbyStationRef.current = nextStation;

      if (nextIsNear !== previousIsNear) {
        setIsNearOreSmeltingStation(nextIsNear);
      }

      const selectedStation = selectedStationBlockRef.current;

      if (
        selectedStation &&
        (!playerPosition ||
          !checkingWorldPlazaOreSmeltingStationWithinUiKeepOpenRange(
            playerPosition,
            selectedStation
          ))
      ) {
        closingSelectedStationRef.current();
      }
    });
  }, [enabled, placedBlocksRef, playerPositionRef, selectedStationBlockRef]);

  const resolvingNearbyOreSmeltingStation = useCallback(
    (): DefiningWorldBuildingPlacedBlock | null => nearbyStationRef.current,
    []
  );

  return {
    isNearOreSmeltingStation,
    resolvingNearbyOreSmeltingStation,
  };
}
