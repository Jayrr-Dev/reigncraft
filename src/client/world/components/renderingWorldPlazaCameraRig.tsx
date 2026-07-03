"use client";

import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import { computingWorldPlazaEffectiveCameraWorldZoom } from "@/components/world/domains/computingWorldPlazaEffectiveCameraWorldZoom";
import { computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint } from "@/components/world/domains/computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint";
import { computingWorldPlazaCameraOffsetForPlayerFollow } from "@/components/world/domains/computingWorldPlazaCameraOffsetWithFollowDeadZone";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants";
import { beginningWorldPlazaPerformanceSample } from "@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics";
import { resolvingWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApplication, useTick } from "@pixi/react";
import type { Container } from "pixi.js";
import { useRef } from "react";

/** Enables {@link zIndex} depth sorting for isometric avatars vs floor. */
const DEFINING_WORLD_PLAZA_CAMERA_RIG_SORTABLE_CHILDREN = true;

export interface RenderingWorldPlazaCameraRigProps {
  /** Player position in grid space; used to center the camera each frame. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Updated every tick for screen overlays (chat bubbles). */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Updated every tick with the live Pixi screen size for pointer projection. */
  viewportSizeRef: React.RefObject<DefiningWorldPlazaPixiViewportSize>;
  /** Embedded viewport locked when fullscreen starts; null when embedded. */
  fullscreenLogicalViewportRef: React.RefObject<DefiningWorldPlazaPixiViewportSize | null>;
  /** Effective world-container zoom, including fullscreen compensation. */
  cameraWorldZoomRef: React.RefObject<number>;
  children: React.ReactNode;
}

/**
 * Centers the isometric world on the player with a dead zone before follow pans.
 */
export function RenderingWorldPlazaCameraRig({
  playerPositionRef,
  cameraOffsetRef,
  viewportSizeRef,
  fullscreenLogicalViewportRef,
  cameraWorldZoomRef,
  children,
}: RenderingWorldPlazaCameraRigProps): React.JSX.Element {
  const isMobile = useIsMobile();
  const worldContainerRef = useRef<Container | null>(null);
  const hasInitializedCameraRef = useRef(false);
  const applicationContext = useApplication();

  useTick(() => {
    const finishCameraTickSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.CAMERA_TICK,
    );

    if (!checkingWorldPlazaPixiApplicationIsReady(applicationContext)) {
      finishCameraTickSample();
      return;
    }

    const worldContainer = worldContainerRef.current;
    const playerPosition = playerPositionRef.current;
    const viewportSize = resolvingWorldPlazaPixiViewportSize(applicationContext);

    if (!worldContainer || !playerPosition || !viewportSize) {
      finishCameraTickSample();
      return;
    }

    const playerScreenPoint =
      computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint(
        playerPosition,
      );
    const currentCameraOffset: DefiningWorldPlazaCameraOffset = {
      x: cameraOffsetRef.current.x,
      y: cameraOffsetRef.current.y,
    };
    const worldZoom = computingWorldPlazaEffectiveCameraWorldZoom(
      viewportSize,
      fullscreenLogicalViewportRef.current,
      isMobile,
    );
    const cameraOffset = computingWorldPlazaCameraOffsetForPlayerFollow(
      playerScreenPoint,
      viewportSize,
      currentCameraOffset,
      hasInitializedCameraRef.current,
      worldZoom,
      isMobile,
    );

    hasInitializedCameraRef.current = true;

    worldContainer.scale.set(worldZoom, worldZoom);
    worldContainer.position.set(cameraOffset.x, cameraOffset.y);
    cameraOffsetRef.current.x = cameraOffset.x;
    cameraOffsetRef.current.y = cameraOffset.y;
    cameraWorldZoomRef.current = worldZoom;
    viewportSizeRef.current.width = viewportSize.width;
    viewportSizeRef.current.height = viewportSize.height;
    finishCameraTickSample();
  });

  return (
    <pixiContainer
      sortableChildren={DEFINING_WORLD_PLAZA_CAMERA_RIG_SORTABLE_CHILDREN}
      ref={(instance) => {
        worldContainerRef.current = instance;
      }}
    >
      {children}
    </pixiContainer>
  );
}
