"use client";

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from "@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_DISTANCE_PX,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_DURATION,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_INNER_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_WRAPPER_CLASS_NAME,
  STYLING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_TRACKED_ICON_CLASS_NAME,
} from "@/components/world/domains/definingWorldPlazaSavedCoordsTileStarMarkerUiConstants";
import {
  resolvingWorldPlazaSavedCoordsTileStarMarkerScreenPoint,
  type ResolvingWorldPlazaSavedCoordsTileStarMarkerTilePoint,
} from "@/components/world/domains/resolvingWorldPlazaSavedCoordsTileStarMarkerScreenPoint";
import { Star as StarIcon } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

/** Off-screen default before the first animation frame positions a marker. */
const RENDERING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_HIDDEN_TRANSFORM =
  "translate(-9999px, -9999px)" as const;

/** CSS custom properties for the saved-coords star bob animation. */
const RENDERING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_STYLE = {
  ["--celestial-float-distance" as string]:
    DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_DISTANCE_PX,
  ["--celestial-float-duration" as string]:
    DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_DURATION,
} as const;

/** Props for {@link RenderingWorldPlazaSavedCoordsTileStarMarkers}. */
export interface RenderingWorldPlazaSavedCoordsTileStarMarkersProps {
  /** Saved coordinate currently tracked by the direction arrow. */
  trackedSavedCoords: DefiningWorldPlazaSavedCoords | null;
  /** True while Save Coords placement is armed and the player is picking a tile. */
  isSaveCoordsPlacementActive?: boolean;
  /** Hovered tile during Save Coords placement; updated by the pointer handlers. */
  placementHoverTileRef?: React.RefObject<ResolvingWorldPlazaSavedCoordsTileStarMarkerTilePoint | null>;
  /** Updated each frame by the camera rig. */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Effective world-container zoom. */
  cameraWorldZoomRef: React.RefObject<number>;
}

/**
 * Floating yellow star icons above the tracked saved tile and, while Save
 * Coords placement is armed, above the hovered tile indicator.
 */
export function RenderingWorldPlazaSavedCoordsTileStarMarkers({
  trackedSavedCoords,
  isSaveCoordsPlacementActive = false,
  placementHoverTileRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaSavedCoordsTileStarMarkersProps): React.JSX.Element | null {
  const trackedSavedCoordsRef = useRef(trackedSavedCoords);
  const markerWrapperRef = useRef<HTMLDivElement | null>(null);
  const markerInnerRef = useRef<HTMLDivElement | null>(null);
  const placementWrapperRef = useRef<HTMLDivElement | null>(null);
  const placementInnerRef = useRef<HTMLDivElement | null>(null);

  trackedSavedCoordsRef.current = trackedSavedCoords;

  const hasAnyMarker = trackedSavedCoords !== null || isSaveCoordsPlacementActive;

  useLayoutEffect(() => {
    if (!hasAnyMarker) {
      return;
    }

    let animationFrameId = 0;
    let isActive = true;

    const positioningMarkerElements = (
      wrapperElement: HTMLDivElement | null,
      innerElement: HTMLDivElement | null,
      tilePoint: ResolvingWorldPlazaSavedCoordsTileStarMarkerTilePoint | null,
      cameraOffset: DefiningWorldPlazaCameraOffset,
      cameraWorldZoom: number,
    ): void => {
      if (!wrapperElement) {
        return;
      }

      if (!tilePoint) {
        wrapperElement.style.transform =
          RENDERING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_HIDDEN_TRANSFORM;
        return;
      }

      const screenPoint = resolvingWorldPlazaSavedCoordsTileStarMarkerScreenPoint(
        tilePoint,
        cameraOffset,
        cameraWorldZoom,
      );

      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          screenPoint.x,
          screenPoint.y,
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        innerElement,
        cameraWorldZoom,
      );
    };

    const updatingMarkerPositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (cameraOffset) {
        positioningMarkerElements(
          markerWrapperRef.current,
          markerInnerRef.current,
          trackedSavedCoordsRef.current,
          cameraOffset,
          cameraWorldZoom,
        );
        positioningMarkerElements(
          placementWrapperRef.current,
          placementInnerRef.current,
          placementHoverTileRef?.current ?? null,
          cameraOffset,
          cameraWorldZoom,
        );
      }

      animationFrameId = window.requestAnimationFrame(updatingMarkerPositions);
    };

    animationFrameId = window.requestAnimationFrame(updatingMarkerPositions);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, hasAnyMarker, placementHoverTileRef]);

  if (!hasAnyMarker) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {trackedSavedCoords ? (
        <div
          ref={markerWrapperRef}
          aria-hidden
          className={DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_WRAPPER_CLASS_NAME}
          style={{
            transform:
              RENDERING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_HIDDEN_TRANSFORM,
          }}
        >
          <div
            ref={markerInnerRef}
            className={DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_INNER_CLASS_NAME}
            style={RENDERING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_STYLE}
          >
            <StarIcon
              className={
                STYLING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_TRACKED_ICON_CLASS_NAME
              }
              aria-hidden
            />
          </div>
        </div>
      ) : null}
      {isSaveCoordsPlacementActive ? (
        <div
          ref={placementWrapperRef}
          aria-hidden
          className={DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_WRAPPER_CLASS_NAME}
          style={{
            transform:
              RENDERING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_HIDDEN_TRANSFORM,
          }}
        >
          <div
            ref={placementInnerRef}
            className={DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_INNER_CLASS_NAME}
            style={RENDERING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_FLOAT_STYLE}
          >
            <StarIcon
              className={
                STYLING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_TRACKED_ICON_CLASS_NAME
              }
              aria-hidden
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
