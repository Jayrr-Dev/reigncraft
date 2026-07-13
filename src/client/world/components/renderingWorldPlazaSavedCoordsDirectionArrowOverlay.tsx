'use client';

import { computingWorldPlazaCameraZoomedDomOverlayPositionTransform } from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import { computingWorldPlazaSavedCoordsScreenDirectionAngleDegrees } from '@/components/world/domains/computingWorldPlazaSavedCoordsScreenDirectionAngleDegrees';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaSavedCoords } from '@/components/world/domains/definingWorldPlazaSavedCoords';
import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARRIVAL_THRESHOLD_PX,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_ORBIT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaSavedCoordsConstants';
import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_FILL_COLOR,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_WRAPPER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaSavedCoordsTrackUiConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaGridPointToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaGridPointToViewportScreenPoint';
import { useLayoutEffect, useRef } from 'react';

/** Off-screen default before the first animation frame positions the arrow. */
const RENDERING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

/** Minimalist north-pointing arrow path (tip at top). */
const RENDERING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_PATH_D =
  'M5 0 L9.5 14.5 L6.4 14.5 L6.4 18 L3.6 18 L3.6 14.5 L0.5 14.5 Z' as const;

export interface RenderingWorldPlazaSavedCoordsDirectionArrowOverlayProps {
  /** True when the direction arrow should render. */
  isVisible: boolean;
  /** Saved tile coordinates to point toward. */
  savedCoords: DefiningWorldPlazaSavedCoords | null;
  /** Live local avatar position. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Updated each frame by the camera rig. */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Effective world-container zoom. */
  cameraWorldZoomRef: React.RefObject<number>;
  /** Clears tracking once the player reaches the saved tile. */
  onArrived?: () => void;
}

/**
 * Minimalist on-screen arrow orbiting the player and pointing toward saved coordinates.
 */
export function RenderingWorldPlazaSavedCoordsDirectionArrowOverlay({
  isVisible,
  savedCoords,
  playerPositionRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  onArrived,
}: RenderingWorldPlazaSavedCoordsDirectionArrowOverlayProps): React.JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const isVisibleRef = useRef(isVisible);
  const savedCoordsRef = useRef(savedCoords);
  const onArrivedRef = useRef(onArrived);
  const hasReportedArrivalRef = useRef(false);

  isVisibleRef.current = isVisible;
  savedCoordsRef.current = savedCoords;
  onArrivedRef.current = onArrived;

  useLayoutEffect(() => {
    hasReportedArrivalRef.current = false;
  }, [savedCoords?.savedCoordsId]);

  useLayoutEffect(() => {
    if (!isVisible || !savedCoords) {
      return;
    }

    let animationFrameId = 0;
    let isActive = true;

    const updatingDirectionArrow = (): void => {
      if (!isActive || !isVisibleRef.current) {
        return;
      }

      const wrapperElement = wrapperRef.current;
      const arrowElement = arrowRef.current;
      const playerPosition = playerPositionRef.current;
      const activeSavedCoords = savedCoordsRef.current;
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (
        !wrapperElement ||
        !arrowElement ||
        !playerPosition ||
        !activeSavedCoords ||
        !cameraOffset
      ) {
        animationFrameId = window.requestAnimationFrame(updatingDirectionArrow);
        return;
      }

      const playerViewportPoint =
        projectingWorldPlazaGridPointToViewportScreenPoint(
          playerPosition,
          cameraOffset,
          cameraWorldZoom
        );
      const savedViewportPoint =
        projectingWorldPlazaGridPointToViewportScreenPoint(
          {
            x: activeSavedCoords.tileX,
            y: activeSavedCoords.tileY,
          },
          cameraOffset,
          cameraWorldZoom
        );
      const deltaX = savedViewportPoint.x - playerViewportPoint.x;
      const deltaY = savedViewportPoint.y - playerViewportPoint.y;
      const distancePx = Math.hypot(deltaX, deltaY);

      if (
        distancePx <=
        DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARRIVAL_THRESHOLD_PX
      ) {
        wrapperElement.style.opacity = '0';
        if (!hasReportedArrivalRef.current) {
          hasReportedArrivalRef.current = true;
          onArrivedRef.current?.();
        }
        animationFrameId = window.requestAnimationFrame(updatingDirectionArrow);
        return;
      }

      const directionAngleRadians = Math.atan2(deltaY, deltaX);
      const orbitRadiusPx =
        DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_ORBIT_RADIUS_PX *
        cameraWorldZoom;
      const arrowCenterX =
        playerViewportPoint.x + Math.cos(directionAngleRadians) * orbitRadiusPx;
      const arrowCenterY =
        playerViewportPoint.y + Math.sin(directionAngleRadians) * orbitRadiusPx;
      const rotationDegrees =
        computingWorldPlazaSavedCoordsScreenDirectionAngleDegrees(
          { x: arrowCenterX, y: arrowCenterY },
          savedViewportPoint
        );
      const arrowWidthPx =
        DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_WIDTH_PX *
        cameraWorldZoom;
      const arrowHeightPx =
        DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_HEIGHT_PX *
        cameraWorldZoom;

      wrapperElement.style.opacity = '1';
      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          arrowCenterX,
          arrowCenterY
        );
      arrowElement.style.width = `${arrowWidthPx}px`;
      arrowElement.style.height = `${arrowHeightPx}px`;
      arrowElement.style.transform = `translate(-50%, -50%) rotate(${rotationDegrees}deg)`;

      animationFrameId = window.requestAnimationFrame(updatingDirectionArrow);
    };

    animationFrameId = window.requestAnimationFrame(updatingDirectionArrow);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    isVisible,
    playerPositionRef,
    savedCoords,
  ]);

  if (!isVisible || !savedCoords) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={
        DEFINING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_WRAPPER_CLASS_NAME
      }
      style={{
        transform:
          RENDERING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_HIDDEN_TRANSFORM,
      }}
    >
      <svg
        ref={arrowRef}
        viewBox="0 0 10 18"
        aria-hidden
        className="block origin-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
      >
        <path
          d={RENDERING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_PATH_D}
          fill={DEFINING_WORLD_PLAZA_SAVED_COORDS_DIRECTION_ARROW_FILL_COLOR}
        />
      </svg>
    </div>
  );
}
