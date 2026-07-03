"use client";

import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { useCallback, useEffect, useState } from "react";

/** Result from {@link usingWorldPlazaSaveCoordsTilePopover}. */
export interface UsingWorldPlazaSaveCoordsTilePopoverResult {
  /** Selected tile for the save-coords popover. */
  selectedTilePosition: DefiningWorldBuildingTilePosition | null;
  /** True while the save-coords popover is open. */
  isSaveCoordsTilePopoverOpen: boolean;
  /** Opens the save-coords popover for a tile. */
  selectingSaveCoordsTileAtViewport: (
    tilePosition: DefiningWorldBuildingTilePosition | null,
  ) => void;
  /** Closes the save-coords popover. */
  closingSaveCoordsTilePopover: () => void;
}

/**
 * Owns open state for the general save-coords tile popover.
 */
export function usingWorldPlazaSaveCoordsTilePopover(): UsingWorldPlazaSaveCoordsTilePopoverResult {
  const [selectedTilePosition, setSelectedTilePosition] =
    useState<DefiningWorldBuildingTilePosition | null>(null);
  const [isSaveCoordsTilePopoverOpen, setIsSaveCoordsTilePopoverOpen] =
    useState(false);

  const closingSaveCoordsTilePopover = useCallback((): void => {
    setIsSaveCoordsTilePopoverOpen(false);
  }, []);

  const selectingSaveCoordsTileAtViewport = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): void => {
      if (!tilePosition) {
        return;
      }

      setSelectedTilePosition(tilePosition);
      setIsSaveCoordsTilePopoverOpen(true);
    },
    [],
  );

  useEffect(() => {
    if (!isSaveCoordsTilePopoverOpen) {
      return;
    }

    const closingSaveCoordsTilePopoverOnOutsidePointerDown = (
      event: PointerEvent,
    ): void => {
      const eventTarget = event.target;

      if (
        eventTarget instanceof HTMLElement &&
        eventTarget.closest(`[${DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE}]`)
      ) {
        return;
      }

      closingSaveCoordsTilePopover();
    };

    document.addEventListener(
      "pointerdown",
      closingSaveCoordsTilePopoverOnOutsidePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        closingSaveCoordsTilePopoverOnOutsidePointerDown,
      );
    };
  }, [closingSaveCoordsTilePopover, isSaveCoordsTilePopoverOpen]);

  return {
    selectedTilePosition,
    isSaveCoordsTilePopoverOpen,
    selectingSaveCoordsTileAtViewport,
    closingSaveCoordsTilePopover,
  };
}
