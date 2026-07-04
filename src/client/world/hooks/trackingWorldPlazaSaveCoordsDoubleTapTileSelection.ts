"use client";

import {
  checkingWorldBuildingClaimModeTilePopoverDoubleTap,
  type CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap,
} from "@/components/world/building/domains/checkingWorldBuildingClaimModeTilePopoverDoubleTap";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import {
  checkingWorldBuildingTilePositionEquals,
  snappingWorldBuildingTilePositionFromGridPoint,
} from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { useCallback, useEffect, useRef } from "react";

export interface TrackingWorldPlazaSaveCoordsDoubleTapTileSelectionParams {
  /** When false, double-tap detection is ignored. */
  isEnabled: boolean;
  /** Live local avatar position for tile-under-foot checks. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Opens the save-coords tile popover for the given tile. */
  selectingSaveCoordsTileAtViewport: (
    tilePosition: DefiningWorldBuildingTilePosition | null,
  ) => void;
}

export interface TrackingWorldPlazaSaveCoordsDoubleTapTileSelectionResult {
  /**
   * Handles a primary pointer down for save-coords double-tap detection.
   *
   * @returns True when a double tap opened the popover and walk should be skipped.
   */
  handlingSaveCoordsDoubleTapPointerDown: (
    event: React.PointerEvent<HTMLElement>,
    tilePosition: DefiningWorldBuildingTilePosition | null,
  ) => boolean;
}

/**
 * Tracks touch double-taps (and mouse double-clicks) on the tile under the
 * local avatar to open the save-coords popover.
 *
 * @param params - Enable flag and tile selection callback.
 */
export function trackingWorldPlazaSaveCoordsDoubleTapTileSelection({
  isEnabled,
  playerPositionRef,
  selectingSaveCoordsTileAtViewport,
}: TrackingWorldPlazaSaveCoordsDoubleTapTileSelectionParams): TrackingWorldPlazaSaveCoordsDoubleTapTileSelectionResult {
  const previousPrimaryTapRef =
    useRef<CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap | null>(
      null,
    );

  useEffect(() => {
    if (!isEnabled) {
      previousPrimaryTapRef.current = null;
    }
  }, [isEnabled]);

  const handlingSaveCoordsDoubleTapPointerDown = useCallback(
    (
      event: React.PointerEvent<HTMLElement>,
      tilePosition: DefiningWorldBuildingTilePosition | null,
    ): boolean => {
      if (!isEnabled) {
        return false;
      }

      if (!tilePosition) {
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const playerTile =
        snappingWorldBuildingTilePositionFromGridPoint(playerPosition);

      if (!checkingWorldBuildingTilePositionEquals(tilePosition, playerTile)) {
        return false;
      }

      const nowMs = performance.now();
      const clientPoint = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      const isDoubleTap = checkingWorldBuildingClaimModeTilePopoverDoubleTap({
        eventDetail: event.detail,
        nowMs,
        clientPoint,
        tilePosition,
        previousTap: previousPrimaryTapRef.current,
      });

      if (tilePosition) {
        previousPrimaryTapRef.current = {
          atMs: nowMs,
          clientPoint,
          tilePosition,
        };
      } else {
        previousPrimaryTapRef.current = null;
      }

      if (!isDoubleTap) {
        return false;
      }

      selectingSaveCoordsTileAtViewport(tilePosition);
      return true;
    },
    [isEnabled, playerPositionRef, selectingSaveCoordsTileAtViewport],
  );

  return {
    handlingSaveCoordsDoubleTapPointerDown,
  };
}
