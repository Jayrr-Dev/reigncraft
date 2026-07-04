'use client';

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { buildingWorldPlazaPlayerNightLightOuterDarknessStyle } from '@/components/world/domains/buildingWorldPlazaPlayerNightLightOverlayStyles';
import { readingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrengthCached } from '@/components/world/domains/cachingWorldPlazaPlayerNightLightFrontOccluderOcclusion';
import { computingWorldPlazaPlayerNightLightFootAnchorWorldLocalFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_HOLE_CLOSE_MAX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX,
} from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { useLayoutEffect, useRef } from 'react';

/** Shared layer styles for the torch darkness pass. */
const RENDERING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_LAYER_CLASS_NAME =
  'pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-linear' as const;

/** Container above the day/night tint, below HUD overlays. */
const RENDERING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ANCHOR_CLASS_NAME =
  'pointer-events-none absolute inset-0 z-[16]' as const;

export interface RenderingWorldPlazaPlayerNightLightOverlayProps {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Updated each frame by the camera rig. */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Effective world-container zoom. */
  cameraWorldZoomRef: React.RefObject<number>;
  /** Placed blocks near the player for front-occluder torch dimming. */
  placedBlocksRef: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
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
  placedBlocksRef,
}: RenderingWorldPlazaPlayerNightLightOverlayProps): React.JSX.Element {
  const sunState = usingWorldPlazaDayNightSunState();
  const nightLightState =
    computingWorldPlazaPlayerNightLightStateFromSunState(sunState);
  const outerDarknessRef = useRef<HTMLDivElement | null>(null);
  const lastAppliedNightLightOverlayStyleKeyRef = useRef('');
  const nightLightStateRef = useRef(nightLightState);

  nightLightStateRef.current = nightLightState;

  useLayoutEffect(() => {
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
          outerDarknessElement.style.opacity = '0';
        }

        return;
      }

      const footWorldLocalPoint =
        computingWorldPlazaPlayerNightLightFootAnchorWorldLocalFromGridPoint(
          playerPosition
        );
      const footViewportPoint =
        projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
          footWorldLocalPoint,
          cameraOffset,
          cameraWorldZoom
        );
      const radiusXPx =
        DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_RADIUS_WORLD_LOCAL_PX *
        cameraWorldZoom;
      const anchor = {
        centerXPx: footViewportPoint.x,
        centerYPx: footViewportPoint.y,
        radiusXPx,
        radiusYPx:
          radiusXPx *
          DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ISOMETRIC_VERTICAL_RATIO,
      };
      const placedBlocksScene = placedBlocksRef.current;
      const placedBlocks = placedBlocksScene?.blocks ?? [];
      const placedBlocksByTile = placedBlocksScene?.blocksByTile;
      const holeCloseStrength =
        readingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrengthCached(
          playerPosition,
          placedBlocks,
          placedBlocksByTile
        ) *
        DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_HOLE_CLOSE_MAX;
      const outerDarknessStyle =
        buildingWorldPlazaPlayerNightLightOuterDarknessStyle(
          anchor,
          strength,
          holeCloseStrength
        );
      const overlayStyleKey = `${outerDarknessStyle.backgroundColor}|${outerDarknessStyle.maskImage}|${outerDarknessStyle.opacity}`;

      if (overlayStyleKey !== lastAppliedNightLightOverlayStyleKeyRef.current) {
        lastAppliedNightLightOverlayStyleKeyRef.current = overlayStyleKey;
        outerDarknessElement.style.backgroundColor =
          outerDarknessStyle.backgroundColor;
        outerDarknessElement.style.maskImage = outerDarknessStyle.maskImage;
        outerDarknessElement.style.webkitMaskImage =
          outerDarknessStyle.WebkitMaskImage;
        outerDarknessElement.style.opacity = String(outerDarknessStyle.opacity);
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingPlayerNightLight();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, placedBlocksRef, playerPositionRef]);

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
