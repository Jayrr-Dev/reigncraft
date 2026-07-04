'use client';

import { drawingWorldPlazaVisiblePlacedBlockCollisionDebugOnGraphics } from '@/components/world/building/domains/drawingWorldPlazaVisiblePlacedBlockCollisionDebugOnGraphics';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_BUILD_BUDGET_PER_FRAME,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_SIZE_TILES,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCKS_Z_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_VIEWPORT_PADDING_TILES,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_Z_INDEX,
} from '@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants';
import { drawingWorldPlazaTerrainCollisionBlockerHitDebugMarkerOnGraphics } from '@/components/world/domains/drawingWorldPlazaTerrainCollisionBlockerHitDebugMarkerOnGraphics';
import { drawingWorldPlazaVisibleTerrainCollisionDebugPlayerMarkerOnGraphics } from '@/components/world/domains/drawingWorldPlazaVisibleTerrainCollisionDebugOnGraphics';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { readingWorldPlazaTerrainCollisionBlockerHitDebugState } from '@/components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitDebugState';
import { resolvingWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { resolvingWorldPlazaVisibleIsometricTileBounds } from '@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds';
import { syncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayer';
import { useApplication, useTick } from '@pixi/react';
import type { Container, Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

/** z-index for the per-frame player marker above static collider chunks. */
const RENDERING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_Z_INDEX =
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCKS_Z_INDEX + 1;

/** Keeps cached debug chunks in insertion order (no per-child depth sort). */
const RENDERING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_SORTABLE_CHILDREN = false;

export interface RenderingWorldPlazaTerrainCollisionDebugOverlayProps {
  /** Player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Live collision debug visibility from the left-side toggle. */
  isVisibleRef: React.RefObject<boolean>;
  /** Player-placed blocks near the avatar; drives placed-block collider outlines. */
  placedBlocksRef: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
}

/**
 * Dotted-line overlay for tile diamonds, circular colliders, and the player marker.
 *
 * Static colliders are cached as cullable per-chunk graphics (same model as the
 * floor layer): each chunk is drawn once, reused while it stays in the padded
 * window, and skipped by the CullerPlugin when off-screen. The player marker
 * redraws every frame with a tiny pass so debug mode stays smooth while moving.
 */
export function RenderingWorldPlazaTerrainCollisionDebugOverlay({
  playerPositionRef,
  isVisibleRef,
  placedBlocksRef,
}: RenderingWorldPlazaTerrainCollisionDebugOverlayProps): React.JSX.Element {
  const staticChunkContainerRef = useRef<Container | null>(null);
  const staticChunkGraphicsByKeyRef = useRef<Map<string, Graphics>>(new Map());
  const placedBlocksGraphicsRef = useRef<Graphics | null>(null);
  const playerMarkerGraphicsRef = useRef<Graphics | null>(null);
  const applicationContext = useApplication();

  const initializingStaticChunkContainer = useCallback(
    (container: Container | null): void => {
      staticChunkContainerRef.current = container;

      if (!container) {
        return;
      }

      container.zIndex = DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_Z_INDEX;
      container.visible = isVisibleRef.current ?? false;
      container.eventMode = 'none';
    },
    [isVisibleRef]
  );

  const initializingPlacedBlocksDebugGraphics = useCallback(
    (graphics: Graphics): void => {
      placedBlocksGraphicsRef.current = graphics;
      graphics.zIndex =
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCKS_Z_INDEX;
      graphics.visible = isVisibleRef.current ?? false;
      graphics.eventMode = 'none';
    },
    [isVisibleRef]
  );

  const initializingPlayerMarkerDebugGraphics = useCallback(
    (graphics: Graphics): void => {
      playerMarkerGraphicsRef.current = graphics;
      graphics.zIndex =
        RENDERING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_Z_INDEX;
      graphics.visible = isVisibleRef.current ?? false;
      graphics.eventMode = 'none';
    },
    [isVisibleRef]
  );

  const droppingCachedStaticChunkGraphics = useCallback((): void => {
    const container = staticChunkContainerRef.current;

    for (const chunkGraphics of staticChunkGraphicsByKeyRef.current.values()) {
      container?.removeChild(chunkGraphics);
      chunkGraphics.destroy();
    }

    staticChunkGraphicsByKeyRef.current.clear();
  }, []);

  useTick(() => {
    const staticChunkContainer = staticChunkContainerRef.current;
    const placedBlocksGraphics = placedBlocksGraphicsRef.current;
    const playerMarkerGraphics = playerMarkerGraphicsRef.current;
    const isVisible = isVisibleRef.current ?? false;

    if (
      !staticChunkContainer ||
      !placedBlocksGraphics ||
      !playerMarkerGraphics
    ) {
      return;
    }

    staticChunkContainer.visible = isVisible;
    placedBlocksGraphics.visible = isVisible;
    playerMarkerGraphics.visible = isVisible;

    if (
      !isVisible ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      if (!isVisible && staticChunkGraphicsByKeyRef.current.size > 0) {
        droppingCachedStaticChunkGraphics();
        placedBlocksGraphics.clear();
        playerMarkerGraphics.clear();
      }

      return;
    }

    const playerPosition = playerPositionRef.current;
    const viewportSize =
      resolvingWorldPlazaPixiViewportSize(applicationContext);

    if (!playerPosition || !viewportSize) {
      return;
    }

    const bounds = resolvingWorldPlazaVisibleIsometricTileBounds(
      playerPosition.x,
      playerPosition.y,
      viewportSize.width,
      viewportSize.height,
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_VIEWPORT_PADDING_TILES
    );

    const finishStaticCollisionDebugSample =
      beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG_STATIC
      );
    syncingWorldPlazaVisibleTerrainCollisionDebugChunkGraphicsLayer({
      parentContainer: staticChunkContainer,
      bounds,
      chunkSizeTiles:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_SIZE_TILES,
      chunkGraphicsByKey: staticChunkGraphicsByKeyRef.current,
      centerTileX: Math.round(playerPosition.x),
      centerTileY: Math.round(playerPosition.y),
      maxChunkBuildsPerCall:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_BUILD_BUDGET_PER_FRAME,
    });
    finishStaticCollisionDebugSample();

    placedBlocksGraphics.clear();
    drawingWorldPlazaVisiblePlacedBlockCollisionDebugOnGraphics(
      placedBlocksGraphics,
      bounds,
      placedBlocksRef.current?.blocks ?? []
    );

    playerMarkerGraphics.clear();
    const finishPlayerMarkerSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG_PLAYER
    );
    drawingWorldPlazaVisibleTerrainCollisionDebugPlayerMarkerOnGraphics(
      playerMarkerGraphics,
      playerPosition
    );

    const latestBlockerHit =
      readingWorldPlazaTerrainCollisionBlockerHitDebugState();

    if (latestBlockerHit) {
      drawingWorldPlazaTerrainCollisionBlockerHitDebugMarkerOnGraphics(
        playerMarkerGraphics,
        latestBlockerHit,
        performance.now()
      );
    }

    finishPlayerMarkerSample();
  });

  return (
    <>
      <pixiContainer
        ref={initializingStaticChunkContainer}
        sortableChildren={
          RENDERING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_SORTABLE_CHILDREN
        }
      />
      <pixiGraphics draw={initializingPlacedBlocksDebugGraphics} />
      <pixiGraphics draw={initializingPlayerMarkerDebugGraphics} />
    </>
  );
}
