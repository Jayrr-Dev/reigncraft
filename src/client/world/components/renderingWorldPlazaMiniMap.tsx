'use client';

import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { listingWorldBuildingPlotTilePositions } from '@/components/world/building/domains/listingWorldBuildingPlotTilePositions';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import {
  checkingWorldPlazaMiniMapOverlayShouldRefreshForCenterPosition,
  composingWorldPlazaMiniMapFrameOnCanvas,
  formattingWorldPlazaMiniMapChromeLayerCacheKey,
  formattingWorldPlazaMiniMapTerrainCenterCacheKey,
  resolvingWorldPlazaMiniMapTerrainCenterPosition,
} from '@/components/world/domains/composingWorldPlazaMiniMapFrameOnCanvas';
import { computingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import { computingWorldPlazaMiniMapTerrainScrollMetrics } from '@/components/world/domains/computingWorldPlazaMiniMapTerrainScrollMetrics';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DrawingWorldPlazaMiniMapPlayerMarker } from '@/components/world/domains/drawingWorldPlazaMiniMapOnCanvas';
import { formattingWorldPlazaMiniMapStatusLabel } from '@/components/world/domains/formattingWorldPlazaMiniMapStatusLabel';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import {
  checkingWorldPlazaDomOverlayFrameShouldUpdate,
  subscribingWorldPlazaDomOverlayFrame,
} from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useMemo, useRef } from 'react';

/** Embedded minimap anchor offset from the bottom-left corner. */
const RENDERING_WORLD_PLAZA_MINI_MAP_EMBEDDED_OFFSET_CLASS_NAME =
  'bottom-3 left-3' as const;

/** Fullscreen minimap anchor offset from the bottom-left corner. */
const RENDERING_WORLD_PLAZA_MINI_MAP_FULLSCREEN_OFFSET_CLASS_NAME =
  'bottom-4 left-4' as const;

/** The minimap canvas when anchored directly on the overlay layer. */
const RENDERING_WORLD_PLAZA_MINI_MAP_CANVAS_ANCHORED_CLASS_NAME =
  'pointer-events-none absolute block rounded-md' as const;

/** The minimap canvas when stacked under the environment bar. */
const RENDERING_WORLD_PLAZA_MINI_MAP_CANVAS_STACKED_CLASS_NAME =
  'pointer-events-none block shrink-0' as const;

export interface RenderingWorldPlazaMiniMapProps {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Smoothed avatar positions for local and remote players. */
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  /** True while click-walk locomotion is active. */
  isWalkingRef: React.RefObject<boolean>;
  /** True while hold-to-run locomotion is active. */
  isRunningRef: React.RefObject<boolean>;
  /** Auth user id; when null only terrain is drawn. */
  localUserId: string | null;
  /** True while the plaza host is in native fullscreen. */
  isFullscreen: boolean;
  /** Live owned plot list for orange minimap markers. */
  ownedPlotsRef: React.RefObject<DefiningWorldBuildingPlot[]>;
  /** When false, positioning is handled by {@link RenderingWorldPlazaMiniMapStack}. */
  isPositionAnchored?: boolean;
}

/**
 * Builds player markers for the minimap overlay.
 *
 * @param localUserId - Authenticated user id.
 * @param centerPosition - Live local player position.
 * @param playerRenderPositionRegistryRef - Smoothed avatar positions.
 */
function listingWorldPlazaMiniMapPlayerMarkers(
  localUserId: string | null,
  centerPosition: DefiningWorldPlazaWorldPoint,
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaWorldPoint>
  >
): DrawingWorldPlazaMiniMapPlayerMarker[] {
  if (!localUserId) {
    return [];
  }

  const playerMarkers: DrawingWorldPlazaMiniMapPlayerMarker[] = [];
  const localRenderPosition =
    playerRenderPositionRegistryRef.current?.get(localUserId) ?? centerPosition;

  playerMarkers.push({
    position: localRenderPosition,
    isLocal: true,
  });

  for (const [
    userId,
    position,
  ] of playerRenderPositionRegistryRef.current?.entries() ?? []) {
    if (userId === localUserId) {
      continue;
    }

    playerMarkers.push({
      position,
      isLocal: false,
    });
  }

  return playerMarkers;
}

/**
 * Compact bottom-left minimap canvas with cached terrain and rAF overlay updates.
 */
export function RenderingWorldPlazaMiniMap({
  playerPositionRef,
  playerRenderPositionRegistryRef,
  isWalkingRef,
  isRunningRef,
  localUserId,
  isFullscreen,
  ownedPlotsRef,
  isPositionAnchored = true,
}: RenderingWorldPlazaMiniMapProps): React.JSX.Element | null {
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terrainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chromeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastTerrainCenterCacheKeyRef = useRef('');
  const lastChromeLayerCacheKeyRef = useRef('');
  const lastOverlayCenterRef = useRef<DefiningWorldPlazaWorldPoint | null>(
    null
  );
  const lastLabelRefreshAtMsRef = useRef(0);
  const lastDisplayedTileRef = useRef({ x: Number.NaN, y: Number.NaN });
  const lastMiniMapOverlayUpdateMsRef = useRef(0);
  const miniMapLayout = useMemo(
    () =>
      computingWorldPlazaMiniMapLayout(
        isFullscreen,
        isMobile,
        performanceProfile.minimapViewRadiusTiles
      ),
    [isFullscreen, isMobile, performanceProfile.minimapViewRadiusTiles]
  );
  const terrainScrollMetrics = useMemo(
    () =>
      computingWorldPlazaMiniMapTerrainScrollMetrics(
        miniMapLayout,
        performanceProfile.minimapTerrainSnapTiles
      ),
    [miniMapLayout, performanceProfile.minimapTerrainSnapTiles]
  );
  const miniMapCanvasClassName = isPositionAnchored
    ? isFullscreen
      ? `${RENDERING_WORLD_PLAZA_MINI_MAP_CANVAS_ANCHORED_CLASS_NAME} ${RENDERING_WORLD_PLAZA_MINI_MAP_FULLSCREEN_OFFSET_CLASS_NAME}`
      : `${RENDERING_WORLD_PLAZA_MINI_MAP_CANVAS_ANCHORED_CLASS_NAME} ${RENDERING_WORLD_PLAZA_MINI_MAP_EMBEDDED_OFFSET_CLASS_NAME}`
    : RENDERING_WORLD_PLAZA_MINI_MAP_CANVAS_STACKED_CLASS_NAME;
  const isMinimapProfileEnabled = performanceProfile.isMinimapEnabled;
  const isMinimapRenderLayerEnabled =
    checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.MINIMAP,
      renderLayerFlags
    );
  const isMinimapVisible =
    isMinimapProfileEnabled && isMinimapRenderLayerEnabled;

  useEffect(() => {
    if (!isMinimapVisible) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const visibleContext = canvas.getContext('2d');

    if (!visibleContext) {
      return;
    }

    if (
      !terrainCanvasRef.current ||
      !chromeCanvasRef.current ||
      terrainCanvasRef.current.width !==
        terrainScrollMetrics.terrainCanvasSizePx ||
      terrainCanvasRef.current.height !==
        terrainScrollMetrics.terrainCanvasSizePx ||
      chromeCanvasRef.current.width !== miniMapLayout.canvasSizePx ||
      chromeCanvasRef.current.height !== miniMapLayout.canvasSizePx
    ) {
      const terrainCanvas = document.createElement('canvas');
      terrainCanvas.width = terrainScrollMetrics.terrainCanvasSizePx;
      terrainCanvas.height = terrainScrollMetrics.terrainCanvasSizePx;
      terrainCanvasRef.current = terrainCanvas;

      const chromeCanvas = document.createElement('canvas');
      chromeCanvas.width = miniMapLayout.canvasSizePx;
      chromeCanvas.height = miniMapLayout.canvasSizePx;
      chromeCanvasRef.current = chromeCanvas;

      lastTerrainCenterCacheKeyRef.current = '';
      lastChromeLayerCacheKeyRef.current = '';
    }

    const terrainCanvas = terrainCanvasRef.current;
    const terrainContext = terrainCanvas?.getContext('2d');
    const chromeCanvas = chromeCanvasRef.current;
    const chromeContext = chromeCanvas?.getContext('2d');

    if (!terrainCanvas || !terrainContext || !chromeCanvas || !chromeContext) {
      return;
    }

    const tickingMiniMapFrame = (frameTimeMs: number): void => {
      const centerPosition = playerPositionRef.current;

      if (!centerPosition) {
        return;
      }

      const nowMs = performance.now();
      const terrainCenterPosition =
        resolvingWorldPlazaMiniMapTerrainCenterPosition(
          centerPosition,
          performanceProfile.minimapTerrainSnapTiles
        );
      const terrainCenterCacheKey =
        formattingWorldPlazaMiniMapTerrainCenterCacheKey(terrainCenterPosition);
      const shouldRebuildTerrainLayer =
        terrainCenterCacheKey !== lastTerrainCenterCacheKeyRef.current;
      const shouldRefreshOverlayForMovement =
        checkingWorldPlazaMiniMapOverlayShouldRefreshForCenterPosition(
          lastOverlayCenterRef.current,
          centerPosition
        );
      const centerTileX = Math.floor(centerPosition.x);
      const centerTileY = Math.floor(centerPosition.y);
      const didDisplayTileChange =
        centerTileX !== lastDisplayedTileRef.current.x ||
        centerTileY !== lastDisplayedTileRef.current.y;
      const didLabelRefreshIntervalElapse =
        nowMs - lastLabelRefreshAtMsRef.current >=
        performanceProfile.minimapIdleRedrawIntervalMs;

      const isAvatarLocomoting =
        isWalkingRef.current === true || isRunningRef.current === true;

      if (
        !shouldRebuildTerrainLayer &&
        !shouldRefreshOverlayForMovement &&
        !didLabelRefreshIntervalElapse &&
        !isAvatarLocomoting &&
        !checkingWorldPlazaDomOverlayFrameShouldUpdate(
          0,
          lastMiniMapOverlayUpdateMsRef.current,
          frameTimeMs,
          false
        )
      ) {
        return;
      }

      const finishMiniMapRedrawSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.MINIMAP_REDRAW
      );

      const biomeDisplayName =
        resolvingWorldPlazaBiomeAtWorldPoint(centerPosition).displayName;
      const displayPosition = {
        x: Math.round(centerPosition.x),
        y: Math.round(centerPosition.y),
      };
      const labelOverlay = {
        biomeDisplayName,
        displayPosition,
      };
      const chromeLayerCacheKey =
        formattingWorldPlazaMiniMapChromeLayerCacheKey(labelOverlay);
      const shouldRebuildChromeLayer =
        shouldRebuildTerrainLayer ||
        didDisplayTileChange ||
        didLabelRefreshIntervalElapse ||
        chromeLayerCacheKey !== lastChromeLayerCacheKeyRef.current;

      if (didDisplayTileChange || didLabelRefreshIntervalElapse) {
        canvas.setAttribute(
          'aria-label',
          formattingWorldPlazaMiniMapStatusLabel(
            biomeDisplayName,
            displayPosition
          )
        );
        lastDisplayedTileRef.current = { x: centerTileX, y: centerTileY };
        lastLabelRefreshAtMsRef.current = nowMs;
      }

      composingWorldPlazaMiniMapFrameOnCanvas({
        visibleContext,
        terrainContext,
        terrainCanvas,
        chromeContext,
        chromeCanvas,
        layout: miniMapLayout,
        liveCenterPosition: centerPosition,
        terrainCenterPosition,
        terrainScrollMetrics,
        shouldRebuildTerrainLayer,
        shouldRebuildChromeLayer,
        isStackedInUnifiedCard: !isPositionAnchored,
        playerMarkers: listingWorldPlazaMiniMapPlayerMarkers(
          localUserId,
          centerPosition,
          playerRenderPositionRegistryRef
        ),
        ownedPlotTilePositions: listingWorldBuildingPlotTilePositions(
          ownedPlotsRef.current ?? []
        ),
        labelOverlay,
      });

      lastTerrainCenterCacheKeyRef.current = terrainCenterCacheKey;
      lastChromeLayerCacheKeyRef.current = chromeLayerCacheKey;
      lastOverlayCenterRef.current = {
        x: centerPosition.x,
        y: centerPosition.y,
      };
      finishMiniMapRedrawSample();
      lastMiniMapOverlayUpdateMsRef.current = frameTimeMs;
    };

    lastTerrainCenterCacheKeyRef.current = '';
    lastChromeLayerCacheKeyRef.current = '';
    lastOverlayCenterRef.current = null;

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      (_deltaMs, frameTimeMs) => {
        tickingMiniMapFrame(frameTimeMs);
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
    };
  }, [
    isFullscreen,
    localUserId,
    miniMapLayout,
    ownedPlotsRef,
    performanceProfile.minimapIdleRedrawIntervalMs,
    performanceProfile.minimapTerrainSnapTiles,
    terrainScrollMetrics,
    isRunningRef,
    isWalkingRef,
    isPositionAnchored,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    isMinimapVisible,
  ]);

  if (!isMinimapVisible) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={miniMapLayout.canvasSizePx}
      height={miniMapLayout.canvasSizePx}
      className={miniMapCanvasClassName}
      role="img"
      aria-live="polite"
    />
  );
}
