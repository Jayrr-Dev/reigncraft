"use client";

import {
  DEFINING_WORLD_BUILDING_TILE_POPOVER_ACTION_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_TILE_POPOVER_ARROW_CLASS_NAME,
  DEFINING_WORLD_BUILDING_TILE_POPOVER_PANEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_TILE_POPOVER_SHELL_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { projectingWorldBuildingTilePositionToViewportScreenPoint } from "@/components/world/building/domains/projectingWorldBuildingTilePositionToViewportScreenPoint";
import { DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER } from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from "@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON } from "@/components/world/domains/definingWorldPlazaSavedCoordsListUiConstants";
import { useLayoutEffect, useRef } from "react";

/** Accessible label for the save-coords tile popover. */
const RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_LABEL =
  "Save coordinates" as const;

/** Save coordinates action label. */
const RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_SAVE_LABEL =
  "Save Coords" as const;

/** Off-screen default before the first animation frame positions the popover. */
const RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_HIDDEN_TRANSFORM =
  "translate(-9999px, -9999px)" as const;

/** Wrapper classes for the camera-tracked save-coords popover. */
const RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_WRAPPER_CLASS_NAME =
  "pointer-events-none absolute left-0 top-0 z-50 will-change-transform" as const;

export interface RenderingWorldPlazaSaveCoordsTilePopoverProps {
  isOpen: boolean;
  selectedTilePositionRef: React.RefObject<DefiningWorldBuildingTilePosition | null>;
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
  isSavingCoords: boolean;
  canSaveMoreCoords: boolean;
  onSaveCoords: () => void;
}

/**
 * Tile-anchored popover for saving plaza coordinates.
 */
export function RenderingWorldPlazaSaveCoordsTilePopover({
  isOpen,
  selectedTilePositionRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  isSavingCoords,
  canSaveMoreCoords,
  onSaveCoords,
}: RenderingWorldPlazaSaveCoordsTilePopoverProps): React.JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const isOpenRef = useRef(isOpen);

  isOpenRef.current = isOpen;

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    let animationFrameId = 0;
    let isActive = true;

    const updatingPopoverPosition = (): void => {
      if (!isActive || !isOpenRef.current) {
        return;
      }

      const wrapperElement = wrapperRef.current;
      const shellElement = shellRef.current;
      const selectedTilePosition = selectedTilePositionRef.current;
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!wrapperElement || !shellElement || !selectedTilePosition || !cameraOffset) {
        animationFrameId = window.requestAnimationFrame(updatingPopoverPosition);
        return;
      }

      const viewportPoint = projectingWorldBuildingTilePositionToViewportScreenPoint(
        selectedTilePosition,
        cameraOffset,
        cameraWorldZoom,
        DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER,
      );

      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          viewportPoint.x,
          viewportPoint.y,
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        shellElement,
        cameraWorldZoom,
      );

      animationFrameId = window.requestAnimationFrame(updatingPopoverPosition);
    };

    animationFrameId = window.requestAnimationFrame(updatingPopoverPosition);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, isOpen, selectedTilePositionRef]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_WRAPPER_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_HIDDEN_TRANSFORM,
      }}
    >
      <div
        ref={shellRef}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        role="dialog"
        aria-modal="true"
        aria-label={RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_LABEL}
        className={DEFINING_WORLD_BUILDING_TILE_POPOVER_SHELL_CLASS_NAME}
        style={computingWorldPlazaCameraZoomedDomOverlayScaleStyle(
          cameraWorldZoomRef.current ?? 1,
        )}
      >
        <div className={DEFINING_WORLD_BUILDING_TILE_POPOVER_PANEL_CLASS_NAME}>
          <button
            type="button"
            disabled={isSavingCoords || !canSaveMoreCoords}
            onClick={onSaveCoords}
            className={DEFINING_WORLD_BUILDING_TILE_POPOVER_ACTION_BUTTON_CLASS_NAME}
          >
            {isSavingCoords
              ? "Saving..."
              : !canSaveMoreCoords
                ? LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON
                : RENDERING_WORLD_PLAZA_SAVE_COORDS_TILE_POPOVER_SAVE_LABEL}
          </button>
        </div>
        <div
          aria-hidden
          className={DEFINING_WORLD_BUILDING_TILE_POPOVER_ARROW_CLASS_NAME}
        />
      </div>
    </div>
  );
}
