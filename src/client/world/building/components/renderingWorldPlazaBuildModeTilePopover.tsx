"use client";

import {
  DEFINING_WORLD_BUILDING_TILE_POPOVER_ACTION_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_TILE_POPOVER_ARROW_CLASS_NAME,
  DEFINING_WORLD_BUILDING_TILE_POPOVER_PANEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_TILE_POPOVER_SHELL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_TILE_POPOVER_UNAVAILABLE_TEXT_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { projectingWorldBuildingTilePositionToViewportScreenPoint } from "@/components/world/building/domains/projectingWorldBuildingTilePositionToViewportScreenPoint";
import type { DefiningWorldBuildingBuildModeTilePopoverMode } from "@/components/world/building/domains/resolvingWorldBuildingBuildModeTilePopoverMode";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  applyingWorldPlazaCameraZoomedDomOverlayPositionWithViewportShift,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from "@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { useLayoutEffect, useRef } from "react";

/** Accessible label for the build tile popover. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_LABEL =
  "Build tile actions" as const;

/** Place block action label. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_PLACE_LABEL = "Place" as const;

/** Remove block action label. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_REMOVE_LABEL = "Remove" as const;

/** Unavailable tile message. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_UNAVAILABLE_MESSAGE =
  "Outside your plot." as const;

/** Off-screen default before the first animation frame positions the popover. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_HIDDEN_TRANSFORM =
  "translate(-9999px, -9999px)" as const;

/** Wrapper classes for the camera-tracked tile popover. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_WRAPPER_CLASS_NAME =
  "pointer-events-none absolute left-0 top-0 z-50 will-change-transform" as const;

export interface RenderingWorldPlazaBuildModeTilePopoverProps {
  isOpen: boolean;
  popoverMode: DefiningWorldBuildingBuildModeTilePopoverMode;
  selectedTilePositionRef: React.RefObject<DefiningWorldBuildingTilePosition | null>;
  selectedWorldLayerRef: React.RefObject<number>;
  canPlaceAtSelectedTile: boolean;
  canRemoveAtSelectedTile: boolean;
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
  onPlaceBlock: () => void;
  onRemoveBlock: () => void;
}

/**
 * Tile-anchored build mode action popover with locked selection.
 */
export function RenderingWorldPlazaBuildModeTilePopover({
  isOpen,
  popoverMode,
  selectedTilePositionRef,
  selectedWorldLayerRef,
  canPlaceAtSelectedTile,
  canRemoveAtSelectedTile,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onPlaceBlock,
  onRemoveBlock,
}: RenderingWorldPlazaBuildModeTilePopoverProps): React.JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const isOpenRef = useRef(isOpen);
  const popoverModeRef = useRef(popoverMode);
  const canPlaceAtSelectedTileRef = useRef(canPlaceAtSelectedTile);
  const canRemoveAtSelectedTileRef = useRef(canRemoveAtSelectedTile);

  isOpenRef.current = isOpen;
  popoverModeRef.current = popoverMode;
  canPlaceAtSelectedTileRef.current = canPlaceAtSelectedTile;
  canRemoveAtSelectedTileRef.current = canRemoveAtSelectedTile;

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
        selectedWorldLayerRef.current ??
          DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT,
      );

      applyingWorldPlazaCameraZoomedDomOverlayPositionWithViewportShift(
        wrapperElement,
        shellElement,
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
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    isOpen,
    selectedTilePositionRef,
    selectedWorldLayerRef,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_WRAPPER_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_HIDDEN_TRANSFORM,
      }}
    >
      <div
        ref={shellRef}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        role="dialog"
        aria-modal="true"
        aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_LABEL}
        className={DEFINING_WORLD_BUILDING_TILE_POPOVER_SHELL_CLASS_NAME}
        style={computingWorldPlazaCameraZoomedDomOverlayScaleStyle(
          cameraWorldZoomRef.current ?? 1,
        )}
      >
        <div className={DEFINING_WORLD_BUILDING_TILE_POPOVER_PANEL_CLASS_NAME}>
          {popoverMode === "build" ? (
            <>
              <button
                type="button"
                disabled={!canPlaceAtSelectedTile}
                onClick={onPlaceBlock}
                className={DEFINING_WORLD_BUILDING_TILE_POPOVER_ACTION_BUTTON_CLASS_NAME}
              >
                {RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_PLACE_LABEL}
              </button>
              <button
                type="button"
                disabled={!canRemoveAtSelectedTile}
                onClick={onRemoveBlock}
                className={DEFINING_WORLD_BUILDING_TILE_POPOVER_ACTION_BUTTON_CLASS_NAME}
              >
                {RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_REMOVE_LABEL}
              </button>
            </>
          ) : null}

          {popoverMode === "unavailable" ? (
            <p className={DEFINING_WORLD_BUILDING_TILE_POPOVER_UNAVAILABLE_TEXT_CLASS_NAME}>
              {RENDERING_WORLD_PLAZA_BUILD_MODE_TILE_POPOVER_UNAVAILABLE_MESSAGE}
            </p>
          ) : null}
        </div>
        <div
          aria-hidden
          className={DEFINING_WORLD_BUILDING_TILE_POPOVER_ARROW_CLASS_NAME}
        />
      </div>
    </div>
  );
}
