"use client";

import {
  checkingWorldBuildingClaimModeTilePopoverDoubleTap,
  type CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap,
} from "@/components/world/building/domains/checkingWorldBuildingClaimModeTilePopoverDoubleTap";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { useCallback, useEffect, useRef } from "react";

export interface TrackingWorldBuildingClaimModeDoubleTapTileSelectionParams {
  /** When false, double-tap detection is ignored. */
  isEnabled: boolean;
  /** Opens the claim tile popover for the given tile. */
  selectingClaimModeTileAtViewport: (
    tilePosition: DefiningWorldBuildingTilePosition | null,
  ) => void;
}

export interface TrackingWorldBuildingClaimModeDoubleTapTileSelectionResult {
  /**
   * Handles a primary pointer press in claim mode.
   *
   * @returns True when a double tap opened the popover and walk should be skipped.
   */
  handlingClaimModeDoubleTapPointerDown: (
    event: React.PointerEvent<HTMLElement>,
    tilePosition: DefiningWorldBuildingTilePosition | null,
  ) => boolean;
}

/**
 * Tracks touch double-taps (and mouse double-clicks) to open the claim popover.
 *
 * @param params - Enable flag and tile selection callback.
 */
export function trackingWorldBuildingClaimModeDoubleTapTileSelection({
  isEnabled,
  selectingClaimModeTileAtViewport,
}: TrackingWorldBuildingClaimModeDoubleTapTileSelectionParams): TrackingWorldBuildingClaimModeDoubleTapTileSelectionResult {
  const previousPrimaryTapRef =
    useRef<CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap | null>(
      null,
    );

  useEffect(() => {
    if (!isEnabled) {
      previousPrimaryTapRef.current = null;
    }
  }, [isEnabled]);

  const handlingClaimModeDoubleTapPointerDown = useCallback(
    (
      event: React.PointerEvent<HTMLElement>,
      tilePosition: DefiningWorldBuildingTilePosition | null,
    ): boolean => {
      if (!isEnabled) {
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

      selectingClaimModeTileAtViewport(tilePosition);
      return true;
    },
    [isEnabled, selectingClaimModeTileAtViewport],
  );

  return {
    handlingClaimModeDoubleTapPointerDown,
  };
}
