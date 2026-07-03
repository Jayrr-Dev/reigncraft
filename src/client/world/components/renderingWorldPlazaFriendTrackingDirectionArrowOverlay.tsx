"use client";

import {
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from "@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform";
import { computingWorldPlazaSavedCoordsScreenDirectionAngleDegrees } from "@/components/world/domains/computingWorldPlazaSavedCoordsScreenDirectionAngleDegrees";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import {
  DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARRIVAL_THRESHOLD_PX,
  DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_ORBIT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_WIDTH_PX,
  DEFINING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_FILL_COLOR,
  DEFINING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_WRAPPER_CLASS_NAME,
} from "@/components/world/domains/definingWorldPlazaFriendTrackingConstants";
import type { DefiningWorldPlazaRemotePlayer } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { projectingWorldPlazaGridPointToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaGridPointToViewportScreenPoint";
import { resolvingWorldPlazaTrackedFriendWorldPoint } from "@/components/world/domains/resolvingWorldPlazaTrackedFriendWorldPoint";
import { useLayoutEffect, useRef } from "react";

/** Off-screen default before the first animation frame positions the arrow. */
const RENDERING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_HIDDEN_TRANSFORM =
  "translate(-9999px, -9999px)" as const;

/** Minimalist north-pointing arrow path (tip at top). */
const RENDERING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_PATH_D =
  "M5 0 L9.5 14.5 L6.4 14.5 L6.4 18 L3.6 18 L3.6 14.5 L0.5 14.5 Z" as const;

/** Props for {@link RenderingWorldPlazaFriendTrackingDirectionArrowOverlay}. */
export interface RenderingWorldPlazaFriendTrackingDirectionArrowOverlayProps {
  /** Friend auth user id being tracked, or null when idle. */
  trackedFriendUserId: string | null;
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
}

/**
 * On-screen arrow orbiting the player and pointing toward a tracked friend's live position.
 */
export function RenderingWorldPlazaFriendTrackingDirectionArrowOverlay({
  trackedFriendUserId,
  remotePlayerRegistryRef,
  playerPositionRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaFriendTrackingDirectionArrowOverlayProps): React.JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const trackedFriendUserIdRef = useRef(trackedFriendUserId);

  trackedFriendUserIdRef.current = trackedFriendUserId;

  useLayoutEffect(() => {
    if (!trackedFriendUserId) {
      return;
    }

    let animationFrameId = 0;
    let isActive = true;

    const updatingDirectionArrow = (): void => {
      if (!isActive || !trackedFriendUserIdRef.current) {
        return;
      }

      const wrapperElement = wrapperRef.current;
      const arrowElement = arrowRef.current;
      const playerPosition = playerPositionRef.current;
      const friendWorldPoint = resolvingWorldPlazaTrackedFriendWorldPoint(
        remotePlayerRegistryRef,
        trackedFriendUserIdRef.current,
      );
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (
        !wrapperElement ||
        !arrowElement ||
        !playerPosition ||
        !friendWorldPoint ||
        !cameraOffset
      ) {
        animationFrameId = window.requestAnimationFrame(updatingDirectionArrow);
        return;
      }

      const playerViewportPoint = projectingWorldPlazaGridPointToViewportScreenPoint(
        playerPosition,
        cameraOffset,
        cameraWorldZoom,
      );
      const friendViewportPoint = projectingWorldPlazaGridPointToViewportScreenPoint(
        friendWorldPoint,
        cameraOffset,
        cameraWorldZoom,
      );
      const deltaX = friendViewportPoint.x - playerViewportPoint.x;
      const deltaY = friendViewportPoint.y - playerViewportPoint.y;
      const distancePx = Math.hypot(deltaX, deltaY);

      if (distancePx <= DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARRIVAL_THRESHOLD_PX) {
        wrapperElement.style.opacity = "0";
        animationFrameId = window.requestAnimationFrame(updatingDirectionArrow);
        return;
      }

      const directionAngleRadians = Math.atan2(deltaY, deltaX);
      const orbitRadiusPx =
        DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_ORBIT_RADIUS_PX * cameraWorldZoom;
      const arrowCenterX =
        playerViewportPoint.x + Math.cos(directionAngleRadians) * orbitRadiusPx;
      const arrowCenterY =
        playerViewportPoint.y + Math.sin(directionAngleRadians) * orbitRadiusPx;
      const rotationDegrees = computingWorldPlazaSavedCoordsScreenDirectionAngleDegrees(
        { x: arrowCenterX, y: arrowCenterY },
        friendViewportPoint,
      );
      const arrowWidthPx =
        DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_WIDTH_PX * cameraWorldZoom;
      const arrowHeightPx =
        DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_HEIGHT_PX * cameraWorldZoom;

      wrapperElement.style.opacity = "1";
      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          arrowCenterX,
          arrowCenterY,
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
    playerPositionRef,
    remotePlayerRegistryRef,
    trackedFriendUserId,
  ]);

  if (!trackedFriendUserId) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={DEFINING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_WRAPPER_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_HIDDEN_TRANSFORM,
      }}
    >
      <svg
        ref={arrowRef}
        viewBox="0 0 10 18"
        aria-hidden
        className="block origin-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
      >
        <path
          d={RENDERING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_PATH_D}
          fill={DEFINING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_FILL_COLOR}
        />
      </svg>
    </div>
  );
}
