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
import { resolvingWorldPlazaSavedCoordsTileStarMarkerScreenPoint } from "@/components/world/domains/resolvingWorldPlazaSavedCoordsTileStarMarkerScreenPoint";
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
  /** Updated each frame by the camera rig. */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Effective world-container zoom. */
  cameraWorldZoomRef: React.RefObject<number>;
}

/**
 * Floating star icon above the actively tracked saved plaza coordinate tile.
 */
export function RenderingWorldPlazaSavedCoordsTileStarMarkers({
  trackedSavedCoords,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaSavedCoordsTileStarMarkersProps): React.JSX.Element | null {
  const trackedSavedCoordsRef = useRef(trackedSavedCoords);
  const markerWrapperRef = useRef<HTMLDivElement | null>(null);
  const markerInnerRef = useRef<HTMLDivElement | null>(null);

  trackedSavedCoordsRef.current = trackedSavedCoords;

  useLayoutEffect(() => {
    if (!trackedSavedCoords) {
      return;
    }

    let animationFrameId = 0;
    let isActive = true;

    const updatingMarkerPosition = (): void => {
      if (!isActive || !trackedSavedCoordsRef.current) {
        return;
      }

      const wrapperElement = markerWrapperRef.current;
      const innerElement = markerInnerRef.current;
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!wrapperElement || !cameraOffset) {
        animationFrameId = window.requestAnimationFrame(updatingMarkerPosition);
        return;
      }

      const screenPoint = resolvingWorldPlazaSavedCoordsTileStarMarkerScreenPoint(
        trackedSavedCoordsRef.current,
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

      animationFrameId = window.requestAnimationFrame(updatingMarkerPosition);
    };

    animationFrameId = window.requestAnimationFrame(updatingMarkerPosition);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, trackedSavedCoords]);

  if (!trackedSavedCoords) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
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
    </div>
  );
}
