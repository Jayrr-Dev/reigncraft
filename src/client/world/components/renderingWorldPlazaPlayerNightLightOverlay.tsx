"use client";

import { computingWorldPlazaPlayerNightLightFootAnchorWorldLocalFromGridPoint } from "@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint";
import { computingWorldPlazaPlayerNightLightStateFromSunState } from "@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX,
} from "@/components/world/domains/definingWorldPlazaPlayerNightLightConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { buildingWorldPlazaPlayerNightLightOuterDarknessStyle } from "@/components/world/domains/buildingWorldPlazaPlayerNightLightOverlayStyles";
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera";
import { usingWorldPlazaDayNightSunState } from "@/components/world/hooks/usingWorldPlazaDayNightSunState";
import { useLayoutEffect, useRef } from "react";

/** Shared layer styles for the torch darkness pass. */
const RENDERING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_LAYER_CLASS_NAME =
  "pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-linear" as const;

/** Container above the day/night tint, below HUD overlays. */
const RENDERING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ANCHOR_CLASS_NAME =
  "pointer-events-none absolute inset-0 z-[16]" as const;

export interface RenderingWorldPlazaPlayerNightLightOverlayProps {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Updated each frame by the camera rig. */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Effective world-container zoom. */
  cameraWorldZoomRef: React.RefObject<number>;
}

/**
 * Local torch vignette that follows the player during nighttime.
 *
 * The warm ground glow is rendered in Pixi on the floor layer so avatars stay
 * unlit above it.
 */
export function RenderingWorldPlazaPlayerNightLightOverlay({
  playerPositionRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaPlayerNightLightOverlayProps): React.JSX.Element {
  const sunState = usingWorldPlazaDayNightSunState();
  const nightLightState = computingWorldPlazaPlayerNightLightStateFromSunState(sunState);
  const outerDarknessRef = useRef<HTMLDivElement | null>(null);
  const nightLightStateRef = useRef(nightLightState);

  nightLightStateRef.current = nightLightState;

  useLayoutEffect(() => {
    let animationFrameId = 0;
    let isActive = true;

    const updatingPlayerNightLight = (): void => {
      if (!isActive) {
        return;
      }

      const outerDarknessElement = outerDarknessRef.current;
      const playerPosition = playerPositionRef.current;
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;
      const strength = nightLightStateRef.current.vignetteStrength;

      if (
        !outerDarknessElement ||
        !playerPosition ||
        !cameraOffset ||
        strength <= 0
      ) {
        if (outerDarknessElement) {
          outerDarknessElement.style.opacity = "0";
        }

        animationFrameId = window.requestAnimationFrame(updatingPlayerNightLight);
        return;
      }

      const footWorldLocalPoint =
        computingWorldPlazaPlayerNightLightFootAnchorWorldLocalFromGridPoint(
          playerPosition,
        );
      const footViewportPoint =
        projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
          footWorldLocalPoint,
          cameraOffset,
          cameraWorldZoom,
        );
      const radiusXPx =
        DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX *
        cameraWorldZoom;
      const anchor = {
        centerXPx: footViewportPoint.x,
        centerYPx: footViewportPoint.y,
        radiusXPx,
        radiusYPx:
          radiusXPx * DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
      };
      const outerDarknessStyle = buildingWorldPlazaPlayerNightLightOuterDarknessStyle(
        anchor,
        strength,
      );

      outerDarknessElement.style.backgroundColor =
        outerDarknessStyle.backgroundColor;
      outerDarknessElement.style.maskImage = outerDarknessStyle.maskImage;
      outerDarknessElement.style.webkitMaskImage =
        outerDarknessStyle.WebkitMaskImage;
      outerDarknessElement.style.opacity = String(outerDarknessStyle.opacity);

      animationFrameId = window.requestAnimationFrame(updatingPlayerNightLight);
    };

    animationFrameId = window.requestAnimationFrame(updatingPlayerNightLight);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, playerPositionRef]);

  return (
    <div
      className={RENDERING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ANCHOR_CLASS_NAME}
      aria-hidden
    >
      <div
        ref={outerDarknessRef}
        className={RENDERING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_LAYER_CLASS_NAME}
        style={{ opacity: nightLightState.vignetteStrength > 0 ? 1 : 0 }}
      />
    </div>
  );
}
