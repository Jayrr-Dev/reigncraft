'use client';

import { applyingWorldPlazaCameraRigTransform } from '@/components/world/domains/applyingWorldPlazaCameraRigTransform';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { resolvingWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApplication, useTick } from '@pixi/react';
import type { Container } from 'pixi.js';
import { useLayoutEffect, useRef } from 'react';

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

  const applyingCameraTransform = (): void => {
    if (!checkingWorldPlazaPixiApplicationIsReady(applicationContext)) {
      return;
    }

    const worldContainer = worldContainerRef.current;
    const playerPosition = playerPositionRef.current;
    const viewportSize =
      resolvingWorldPlazaPixiViewportSize(applicationContext);

    if (!worldContainer || !playerPosition || !viewportSize) {
      return;
    }

    applyingWorldPlazaCameraRigTransform({
      worldContainer,
      playerPosition,
      viewportSize,
      cameraOffsetRef,
      cameraWorldZoomRef,
      viewportSizeRef,
      fullscreenLogicalViewport: fullscreenLogicalViewportRef.current,
      hasInitializedCamera: hasInitializedCameraRef.current,
      isMobile,
    });
    hasInitializedCameraRef.current = true;
  };

  useLayoutEffect(() => {
    if (hasInitializedCameraRef.current) {
      return;
    }

    applyingCameraTransform();
  }, [applicationContext, playerPositionRef]);

  useTick(() => {
    const finishCameraTickSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.CAMERA_TICK
    );

    applyingCameraTransform();
    finishCameraTickSample();
  });

  return (
    <pixiContainer
      sortableChildren={DEFINING_WORLD_PLAZA_CAMERA_RIG_SORTABLE_CHILDREN}
      cullable={false}
      ref={(instance) => {
        worldContainerRef.current = instance;
      }}
    >
      {children}
    </pixiContainer>
  );
}
