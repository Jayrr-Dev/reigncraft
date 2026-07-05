'use client';

import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { initializingWorldPlazaBuiltinAnimationClips } from '@/components/world/animation/domains/initializingWorldPlazaBuiltinAnimationClips';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { DEFINING_WORLD_PLAZA_CAMERA_ZOOM } from '@/components/world/domains/definingWorldPlazaCameraConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import { DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY } from '@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants';
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { DEFINING_WORLD_PLAZA_WATER_SHIMMER_UPDATE_INTERVAL_FRAMES } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import type { InvalidatingWorldPlazaFloorChunkGraphicsTileIndex } from '@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices';
import { invalidatingWorldPlazaFloorChunkGraphicsForTileIndices } from '@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices';
import { listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex } from '@/components/world/domains/listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex';
import { preloadingWorldPlazaLavaTileTextures } from '@/components/world/domains/loadingWorldPlazaLavaTileTextures';
import { settingWorldPlazaClientDebugStatus } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import {
  beginningWorldPlazaPerformanceSample,
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { invalidatingWorldPlazaMiniMapTileFillColorCache } from '@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor';
import { resolvingWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { invalidatingWorldPlazaTerrainElevationAtTileIndexCache } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import { resolvingWorldPlazaVisibleIsometricTileBounds } from '@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds';
import {
  advancingWorldPlazaVisibleLavaOverlayAnimation,
  clearingWorldPlazaLavaPoolLightSources,
  ensuringWorldPlazaVisibleLavaOverlayLayer,
  updatingWorldPlazaVisibleLavaOverlayLayer,
  type SyncingWorldPlazaVisibleLavaOverlayLayerState,
} from '@/components/world/domains/syncingWorldPlazaVisibleLavaOverlayLayer';
import {
  invalidatingWorldPlazaVisibleTerrainElevationTileColumnSyncState,
  syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer,
} from '@/components/world/domains/syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer';
import { syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer';
import { syncingWorldPlazaVisibleTileChunkGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer';
import {
  syncingWorldPlazaVisibleTreeCanopyLayer,
  updatingWorldPlazaVisibleTreeCanopyLayerAlpha,
  type SyncingWorldPlazaVisibleTreeCanopyLayerEntry,
} from '@/components/world/domains/syncingWorldPlazaVisibleTreeCanopyLayer';
import { syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer';
import { syncingWorldPlazaVisibleTreeTrunkGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTreeTrunkGraphicsLayer';
import {
  ensuringWorldPlazaVisibleWaterShimmerGraphicsLayer,
  updatingWorldPlazaVisibleWaterShimmerGraphicsLayer,
} from '@/components/world/domains/syncingWorldPlazaVisibleWaterShimmerGraphicsLayer';
import {
  ensuringWorldPlazaVisibleWaterSurfaceGraphicsLayer,
  updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer,
} from '@/components/world/domains/syncingWorldPlazaVisibleWaterSurfaceGraphicsLayer';
import {
  buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey,
  updatingWorldPlazaEnvironmentalTemperatureSamplingContext,
} from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { usingWorldPlazaIslandModeFeatureEnabledState } from '@/components/world/hooks/usingWorldPlazaIslandModeFeatureEnabledState';
import { useApplication, useTick } from '@pixi/react';
import type { Container, Graphics } from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';
import { parsingWorldFireDevvitTileKey } from '../../../shared/worldFireDevvit';

/**
 * Builds a cache key for placed tree blocks so tree layers resync on placement.
 *
 * @param placedBlocks - Placed blocks visible in the scene.
 */
function buildingWorldPlazaPlacedTreeBlocksCacheKey(
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): string {
  return placedBlocks
    .filter((block) =>
      checkingWorldBuildingBlockDefinitionIdIsNaturalTree(block.definitionId)
    )
    .map((block) => {
      const growthStage =
        block.metadata[DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY];

      return `${block.blockId}:${typeof growthStage === 'number' ? growthStage : 0}:${block.worldLayer}`;
    })
    .sort()
    .join('|');
}

/**
 * Builds a cache key for chopped-tree state so tree layers resync after chops.
 */
function buildingWorldPlazaChoppedTreesCacheKey(
  choppedTreesByTileKey: ReadonlyMap<string, number>
): string {
  return Array.from(choppedTreesByTileKey.entries())
    .sort(([tileKeyA], [tileKeyB]) => tileKeyA.localeCompare(tileKeyB))
    .map(([tileKey, layer]) => `${tileKey}:${layer}`)
    .join('|');
}

export interface RenderingWorldPlazaProceduralTerrainSyncProps {
  /** Player position in grid space; drives visible tile windows. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Effective world-container zoom for visible tile bounds. */
  cameraWorldZoomRef: React.RefObject<number>;
  /** Player-placed blocks near the avatar; drives placed trees and surface layer. */
  placedBlocksRef?: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  /** Scorched procedural grass tile keys from fire simulation. */
  burntGrassTileKeysRef?: React.RefObject<ReadonlySet<string>>;
  /** Chopped-tree remaining visual layers for tree rendering. */
  choppedTreesByTileKeyRef?: React.RefObject<ReadonlyMap<string, number>>;
  /** Imperative floor chunk layer inside the floor z-index group. */
  floorLayerRef: React.RefObject<Container | null>;
  /** Imperative trunk and terrain column layer inside the entity avatar sub-layer. */
  trunkLayerRef: React.RefObject<Container | null>;
  /** Imperative canopy layer inside the entity z-index group. */
  canopyLayerRef: React.RefObject<Container | null>;
}

/**
 * Syncs floor chunks, trunks, and canopies from one tick (no DOM output).
 */
export function RenderingWorldPlazaProceduralTerrainSync({
  playerPositionRef,
  cameraWorldZoomRef,
  placedBlocksRef,
  burntGrassTileKeysRef,
  choppedTreesByTileKeyRef,
  floorLayerRef,
  trunkLayerRef,
  canopyLayerRef,
}: RenderingWorldPlazaProceduralTerrainSyncProps): null {
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const { islandModeRevision } = usingWorldPlazaIslandModeFeatureEnabledState();
  const lastIslandModeRevisionRef = useRef(islandModeRevision);

  const floorChunkGraphicsByKeyRef = useRef<Map<string, Graphics>>(new Map());
  const terrainElevationTileColumnGraphicsByKeyRef = useRef<
    Map<string, Graphics>
  >(new Map());
  const terrainRockColumnGraphicsByKeyRef = useRef<Map<string, Graphics>>(
    new Map()
  );
  const trunkGraphicsByKeyRef = useRef<Map<string, Graphics>>(new Map());
  const treeShadowGraphicsByKeyRef = useRef<Map<string, Graphics>>(new Map());
  const canopyEntriesByKeyRef = useRef<
    Map<string, SyncingWorldPlazaVisibleTreeCanopyLayerEntry>
  >(new Map());
  const lastFloorBoundsKeyRef = useRef('');
  const isFloorSyncCompleteRef = useRef(false);
  const lastBurntGrassCacheKeyRef = useRef('');
  const lastTerrainElevationBoundsKeyRef = useRef('');
  const isTerrainElevationSyncCompleteRef = useRef(false);
  const isTerrainRockSyncCompleteRef = useRef(false);
  const lastTerrainRockBoundsKeyRef = useRef('');
  /**
   * Rock anchor tiles awaiting a single floor-occlusion invalidation pass.
   *
   * Rocks build incrementally over many frames; invalidating floor chunks per
   * frame made floor and rock layers thrash (rebuilding the same chunks every
   * frame). Anchors accumulate here and flush once when the rock sync completes
   * for the current window, so each affected floor chunk rebuilds only once.
   */
  const pendingRockFloorInvalidationAnchorsRef = useRef<
    InvalidatingWorldPlazaFloorChunkGraphicsTileIndex[]
  >([]);
  const lastTrunkBoundsKeyRef = useRef('');
  const lastTreeShadowSyncKeyRef = useRef('');
  const lastTreeShadowSunBucketRef = useRef(-1);
  const lastCanopyBoundsKeyRef = useRef('');
  const lastPlacedTreeBlocksKeyRef = useRef('');
  const lastChoppedTreesKeyRef = useRef('');
  const lastViewportSizeRef = useRef({ width: 0, height: 0 });
  const wasFloorRenderLayerEnabledRef = useRef(true);
  const wasTrunkRenderLayerEnabledRef = useRef(true);
  const wasCanopyRenderLayerEnabledRef = useRef(true);
  const canopyAlphaFrameCounterRef = useRef(0);
  const waterShimmerFrameCounterRef = useRef(0);
  const waterShimmerGraphicsRef = useRef<Graphics | null>(null);
  const waterSurfaceGraphicsRef = useRef<Graphics | null>(null);
  const lastWaterSurfaceBoundsKeyRef = useRef('');
  const lastThawVisualSyncKeyRef = useRef('');
  const lavaOverlayStateRef =
    useRef<SyncingWorldPlazaVisibleLavaOverlayLayerState | null>(null);
  const lastLavaOverlayBoundsKeyRef = useRef('');
  const lastIdleTerrainSyncKeyRef = useRef('');
  const lastCanopyAlphaPlayerTileKeyRef = useRef('');
  const hasInvalidatedFloorChunksForElevationRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeGroundFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForElevationAlignmentFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeTrunkDepthSortFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeGroundColorFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeTileSideFacesFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeTileSideColorFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForBackFacingCliffEdgeFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForCliffVerticalEdgeRemovalFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForCliffCornerVerticalEdgeFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForCliffRunContinuationFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForCliffCornerOnlyVerticalFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForCliffCapRimInteriorSkipFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForCliffCapRimRestoreFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForCliffPeakCornerVerticalFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForCliffFrontCornerVerticalFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForCliffFullTopRimOutlineFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForTreeShadowDiamondFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeShadowCircleFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeShadowLayerFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForTreeShadowRaisedZIndexFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForTreeShadowTerrainCoplanarZIndexFixRef =
    useRef(false);
  const hasInvalidatedFloorChunksForColumnRockNeighborHoleFixRef =
    useRef(false);
  const hasInvalidatedFloorChunksForColumnRockOneBlockRadiusOcclusionFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForColumnRockSpacingFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForColumnRockSingleChunkShapeFixRef =
    useRef(false);
  const hasInvalidatedFloorChunksForColumnRockGrassRestoreFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForColumnRockMegaBoulderScaleFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForColumnRockTreeFootprintFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForRockyBiomeFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForBiomeAltitudeFactorFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForBiomeAltitudeScalingFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForBiomeAltitudePerformanceFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForBiomeAltitudeSyncPerfFixRef =
    useRef(false);
  const hasInvalidatedTerrainLayersForElevationChunkSyncFixRef = useRef(false);
  const hasInvalidatedTerrainLayersForElevationTileColumnDepthFixRef =
    useRef(false);
  const applicationContext = useApplication();

  const syncingProceduralTerrainLayers = useCallback((): void => {
    const finishTerrainSyncSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_SYNC
    );

    if (!checkingWorldPlazaPixiApplicationIsReady(applicationContext)) {
      finishTerrainSyncSample();
      return;
    }

    const floorLayer = floorLayerRef.current;
    const trunkLayer = trunkLayerRef.current;
    const canopyLayer = canopyLayerRef.current;
    const playerPosition = playerPositionRef.current;
    const viewportSize =
      resolvingWorldPlazaPixiViewportSize(applicationContext);
    const worldZoom =
      cameraWorldZoomRef.current > 0
        ? cameraWorldZoomRef.current
        : DEFINING_WORLD_PLAZA_CAMERA_ZOOM;

    if (
      !floorLayer ||
      !trunkLayer ||
      !canopyLayer ||
      !playerPosition ||
      !viewportSize
    ) {
      finishTerrainSyncSample();
      return;
    }

    if (
      viewportSize.width !== lastViewportSizeRef.current.width ||
      viewportSize.height !== lastViewportSizeRef.current.height
    ) {
      lastViewportSizeRef.current = viewportSize;
      lastFloorBoundsKeyRef.current = '';
      isFloorSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';
      isTerrainRockSyncCompleteRef.current = false;
      lastTrunkBoundsKeyRef.current = '';
      lastCanopyBoundsKeyRef.current = '';
    }

    if (
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED &&
      !hasInvalidatedFloorChunksForElevationRef.current
    ) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';
      hasInvalidatedFloorChunksForElevationRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeGroundFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const trunkGraphics of trunkGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(trunkGraphics);
        trunkGraphics.destroy();
      }

      trunkGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = '';

      for (const canopyEntry of canopyEntriesByKeyRef.current.values()) {
        canopyLayer.removeChild(canopyEntry.container);
        canopyEntry.container.destroy({ children: true });
      }

      canopyEntriesByKeyRef.current.clear();
      lastCanopyBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeGroundFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForElevationAlignmentFixRef.current) {
      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      for (const trunkGraphics of trunkGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(trunkGraphics);
        trunkGraphics.destroy();
      }

      trunkGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = '';

      for (const canopyEntry of canopyEntriesByKeyRef.current.values()) {
        canopyLayer.removeChild(canopyEntry.container);
        canopyEntry.container.destroy({ children: true });
      }

      canopyEntriesByKeyRef.current.clear();
      lastCanopyBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForElevationAlignmentFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeTrunkDepthSortFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const trunkGraphics of trunkGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(trunkGraphics);
        trunkGraphics.destroy();
      }

      trunkGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = '';

      for (const canopyEntry of canopyEntriesByKeyRef.current.values()) {
        canopyLayer.removeChild(canopyEntry.container);
        canopyEntry.container.destroy({ children: true });
      }

      canopyEntriesByKeyRef.current.clear();
      lastCanopyBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeTrunkDepthSortFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeGroundColorFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeGroundColorFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeTileSideFacesFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeTileSideFacesFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeTileSideColorFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeTileSideColorFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBackFacingCliffEdgeFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForBackFacingCliffEdgeFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffVerticalEdgeRemovalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffVerticalEdgeRemovalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCornerVerticalEdgeFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffCornerVerticalEdgeFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffRunContinuationFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffRunContinuationFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCornerOnlyVerticalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffCornerOnlyVerticalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCapRimInteriorSkipFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffCapRimInteriorSkipFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCapRimRestoreFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffCapRimRestoreFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffPeakCornerVerticalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffPeakCornerVerticalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffFrontCornerVerticalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffFrontCornerVerticalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffFullTopRimOutlineFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForCliffFullTopRimOutlineFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowDiamondFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeShadowDiamondFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowCircleFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeShadowCircleFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowLayerFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      for (const shadowGraphics of treeShadowGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(shadowGraphics);
        shadowGraphics.destroy();
      }

      treeShadowGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = '';
      lastTreeShadowSyncKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeShadowLayerFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowRaisedZIndexFixRef.current) {
      for (const shadowGraphics of treeShadowGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(shadowGraphics);
        shadowGraphics.destroy();
      }

      treeShadowGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = '';
      lastTreeShadowSyncKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeShadowRaisedZIndexFixRef.current = true;
    }

    if (
      !hasInvalidatedTerrainLayersForTreeShadowTerrainCoplanarZIndexFixRef.current
    ) {
      for (const shadowGraphics of treeShadowGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(shadowGraphics);
        shadowGraphics.destroy();
      }

      treeShadowGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = '';
      lastTreeShadowSyncKeyRef.current = '';

      hasInvalidatedTerrainLayersForTreeShadowTerrainCoplanarZIndexFixRef.current = true;
    }

    if (!hasInvalidatedFloorChunksForColumnRockNeighborHoleFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedFloorChunksForColumnRockNeighborHoleFixRef.current = true;
    }

    if (
      !hasInvalidatedFloorChunksForColumnRockOneBlockRadiusOcclusionFixRef.current
    ) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedFloorChunksForColumnRockOneBlockRadiusOcclusionFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForColumnRockSpacingFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForColumnRockSpacingFixRef.current = true;
    }

    if (
      !hasInvalidatedTerrainLayersForColumnRockSingleChunkShapeFixRef.current
    ) {
      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForColumnRockSingleChunkShapeFixRef.current = true;
    }

    if (!hasInvalidatedFloorChunksForColumnRockGrassRestoreFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedFloorChunksForColumnRockGrassRestoreFixRef.current = true;
    }

    if (
      !hasInvalidatedTerrainLayersForColumnRockMegaBoulderScaleFixRef.current
    ) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForColumnRockMegaBoulderScaleFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForColumnRockTreeFootprintFixRef.current) {
      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForColumnRockTreeFootprintFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForRockyBiomeFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForRockyBiomeFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBiomeAltitudeFactorFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = '';

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForBiomeAltitudeFactorFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBiomeAltitudeScalingFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForBiomeAltitudeScalingFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBiomeAltitudePerformanceFixRef.current) {
      invalidatingWorldPlazaTerrainElevationAtTileIndexCache();

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForBiomeAltitudePerformanceFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBiomeAltitudeSyncPerfFixRef.current) {
      invalidatingWorldPlazaTerrainElevationAtTileIndexCache();
      invalidatingWorldPlazaMiniMapTileFillColorCache();

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForBiomeAltitudeSyncPerfFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForElevationChunkSyncFixRef.current) {
      invalidatingWorldPlazaTerrainElevationAtTileIndexCache();

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForElevationChunkSyncFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForElevationTileColumnDepthFixRef.current) {
      invalidatingWorldPlazaVisibleTerrainElevationTileColumnSyncState();

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = '';

      hasInvalidatedTerrainLayersForElevationTileColumnDepthFixRef.current = true;
    }

    const isFloorRenderLayerEnabled =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.FLOOR_TILES
      );
    const isTrunkRenderLayerEnabled =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_TRUNKS
      );
    const isCanopyRenderLayerEnabled =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_CANOPIES
      );

    floorLayer.visible = isFloorRenderLayerEnabled;
    trunkLayer.visible = isTrunkRenderLayerEnabled;
    canopyLayer.visible = isCanopyRenderLayerEnabled;

    if (!wasFloorRenderLayerEnabledRef.current && isFloorRenderLayerEnabled) {
      isFloorSyncCompleteRef.current = false;
      isTerrainElevationSyncCompleteRef.current = false;
      isTerrainRockSyncCompleteRef.current = false;
    }

    if (!wasTrunkRenderLayerEnabledRef.current && isTrunkRenderLayerEnabled) {
      lastTrunkBoundsKeyRef.current = '';
    }

    if (!wasCanopyRenderLayerEnabledRef.current && isCanopyRenderLayerEnabled) {
      lastCanopyBoundsKeyRef.current = '';
    }

    wasFloorRenderLayerEnabledRef.current = isFloorRenderLayerEnabled;
    wasTrunkRenderLayerEnabledRef.current = isTrunkRenderLayerEnabled;
    wasCanopyRenderLayerEnabledRef.current = isCanopyRenderLayerEnabled;

    const scenePlacedBlocks = placedBlocksRef?.current?.blocks ?? [];
    const placedTreeBlocksKey =
      buildingWorldPlazaPlacedTreeBlocksCacheKey(scenePlacedBlocks);
    const choppedTreesByTileKey =
      choppedTreesByTileKeyRef?.current ?? new Map<string, number>();
    const choppedTreesKey = buildingWorldPlazaChoppedTreesCacheKey(
      choppedTreesByTileKey
    );
    const sunState = computingWorldPlazaDayNightSunState();
    const thawVisualSyncKey = `${sunState.bucketIndex}|${buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey(scenePlacedBlocks)}`;

    updatingWorldPlazaEnvironmentalTemperatureSamplingContext({
      placedBlocksByTile: placedBlocksRef?.current?.blocksByTile ?? new Map(),
    });

    if (thawVisualSyncKey !== lastThawVisualSyncKeyRef.current) {
      lastThawVisualSyncKeyRef.current = thawVisualSyncKey;
      isFloorSyncCompleteRef.current = false;
      lastWaterSurfaceBoundsKeyRef.current = '';
      invalidatingWorldPlazaMiniMapTileFillColorCache();
    }

    const playerTileKey = formattingWorldPlazaTileIndexCacheKey(
      Math.floor(playerPosition.x),
      Math.floor(playerPosition.y)
    );
    const idleTerrainSyncKey = `${playerTileKey}|${worldZoom}|${viewportSize.width}x${viewportSize.height}|${placedTreeBlocksKey}|${thawVisualSyncKey}`;
    const isTerrainFullySynced =
      isFloorSyncCompleteRef.current &&
      isTerrainElevationSyncCompleteRef.current &&
      isTerrainRockSyncCompleteRef.current &&
      pendingRockFloorInvalidationAnchorsRef.current.length === 0;
    const canSkipHeavyTerrainLayerSync =
      isTerrainFullySynced &&
      idleTerrainSyncKey === lastIdleTerrainSyncKeyRef.current;

    let floorBounds: ReturnType<
      typeof resolvingWorldPlazaVisibleIsometricTileBounds
    > | null = null;
    let floorBoundsKey = lastFloorBoundsKeyRef.current;

    if (!canSkipHeavyTerrainLayerSync) {
      lastIdleTerrainSyncKeyRef.current = idleTerrainSyncKey;

      floorBounds = isFloorRenderLayerEnabled
        ? resolvingWorldPlazaVisibleIsometricTileBounds(
            playerPosition.x,
            playerPosition.y,
            viewportSize.width,
            viewportSize.height,
            performanceProfile.viewportPaddingTiles +
              performanceProfile.floorChunkPrefetchTiles,
            performanceProfile.visibleBoundsSnapTiles,
            worldZoom
          )
        : null;
      floorBoundsKey = floorBounds
        ? buildingWorldPlazaVisibleTileBoundsCacheKey(floorBounds)
        : lastFloorBoundsKeyRef.current;

      // Elevation columns are per-tile Graphics on the sorted entity layer, and
      // culled columns still cost a sort every frame, so they build over a far
      // tighter ring than the batched floor prefetch to cap the live column set.
      const elevationBounds = isFloorRenderLayerEnabled
        ? resolvingWorldPlazaVisibleIsometricTileBounds(
            playerPosition.x,
            playerPosition.y,
            viewportSize.width,
            viewportSize.height,
            performanceProfile.viewportPaddingTiles +
              performanceProfile.terrainElevationPrefetchTiles,
            performanceProfile.visibleBoundsSnapTiles,
            worldZoom
          )
        : null;
      const elevationBoundsKey = elevationBounds
        ? buildingWorldPlazaVisibleTileBoundsCacheKey(elevationBounds)
        : lastTerrainElevationBoundsKeyRef.current;

      if (floorBounds && floorBoundsKey !== lastFloorBoundsKeyRef.current) {
        lastFloorBoundsKeyRef.current = floorBoundsKey;
        isFloorSyncCompleteRef.current = false;
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.FLOOR_BOUNDS_CROSSING
        );
      }

      let shouldSortFloorLayer = false;
      let shouldSortTrunkLayer = false;
      let shouldSortCanopyLayer = false;

      if (
        floorBounds &&
        floorBoundsKey !== lastTerrainRockBoundsKeyRef.current
      ) {
        lastTerrainRockBoundsKeyRef.current = floorBoundsKey;
        isTerrainRockSyncCompleteRef.current = false;
        pendingRockFloorInvalidationAnchorsRef.current = [];
      }

      if (floorBounds && !isTerrainRockSyncCompleteRef.current) {
        const terrainRockSyncResult =
          syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer({
            parentContainer: trunkLayer,
            bounds: floorBounds,
            rockGraphicsByKey: terrainRockColumnGraphicsByKeyRef.current,
            centerTileX: Math.round(playerPosition.x),
            centerTileY: Math.round(playerPosition.y),
            maxColumnBuildsPerCall:
              performanceProfile.terrainElevationChunkBuildBudgetPerFrame *
              performanceProfile.floorChunkSizeTiles,
            shouldSortChildrenImmediately: false,
          });
        isTerrainRockSyncCompleteRef.current = terrainRockSyncResult.isComplete;
        shouldSortTrunkLayer =
          shouldSortTrunkLayer || terrainRockSyncResult.needsChildSort;

        for (const anchorTile of terrainRockSyncResult.builtAnchorTileIndices) {
          pendingRockFloorInvalidationAnchorsRef.current.push({
            tileX: anchorTile.tileX,
            tileY: anchorTile.tileY,
          });
        }

        if (
          isTerrainRockSyncCompleteRef.current &&
          pendingRockFloorInvalidationAnchorsRef.current.length > 0
        ) {
          const floorInvalidationTileIndices =
            pendingRockFloorInvalidationAnchorsRef.current.flatMap(
              (anchorTile) =>
                listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex(
                  anchorTile.tileX,
                  anchorTile.tileY
                )
            );
          pendingRockFloorInvalidationAnchorsRef.current = [];
          const droppedFloorChunkCount =
            invalidatingWorldPlazaFloorChunkGraphicsForTileIndices({
              parentContainer: floorLayer,
              bounds: floorBounds,
              chunkSizeTiles: performanceProfile.floorChunkSizeTiles,
              chunkGraphicsByKey: floorChunkGraphicsByKeyRef.current,
              tileIndices: floorInvalidationTileIndices,
            });

          if (droppedFloorChunkCount > 0) {
            isFloorSyncCompleteRef.current = false;
          }
        }

        for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
          rockGraphics.visible = isFloorRenderLayerEnabled;
        }
      }

      if (floorBounds && !isFloorSyncCompleteRef.current) {
        const burntGrassTileKeys = burntGrassTileKeysRef?.current;
        const burntGrassCacheKey = burntGrassTileKeys
          ? Array.from(burntGrassTileKeys).sort().join('|')
          : '';

        if (
          burntGrassCacheKey !== lastBurntGrassCacheKeyRef.current &&
          burntGrassTileKeys &&
          burntGrassTileKeys.size > 0
        ) {
          lastBurntGrassCacheKeyRef.current = burntGrassCacheKey;
          const burntGrassTileIndices = Array.from(burntGrassTileKeys).flatMap(
            (tileKey) => {
              const parsedTile = parsingWorldFireDevvitTileKey(tileKey);

              return parsedTile
                ? [{ tileX: parsedTile.tileX, tileY: parsedTile.tileY }]
                : [];
            }
          );

          if (burntGrassTileIndices.length > 0) {
            invalidatingWorldPlazaFloorChunkGraphicsForTileIndices({
              parentContainer: floorLayer,
              bounds: floorBounds,
              chunkSizeTiles: performanceProfile.floorChunkSizeTiles,
              chunkGraphicsByKey: floorChunkGraphicsByKeyRef.current,
              tileIndices: burntGrassTileIndices,
            });
          }
        } else if (burntGrassCacheKey !== lastBurntGrassCacheKeyRef.current) {
          lastBurntGrassCacheKeyRef.current = burntGrassCacheKey;
        }

        const finishFloorSyncSample = beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_FLOOR
        );
        const floorSyncResult = syncingWorldPlazaVisibleTileChunkGraphicsLayer({
          parentContainer: floorLayer,
          bounds: floorBounds,
          chunkSizeTiles: performanceProfile.floorChunkSizeTiles,
          chunkGraphicsByKey: floorChunkGraphicsByKeyRef.current,
          drawOptions: {
            drawsGrassDecorations: performanceProfile.drawsGrassDecorations,
            drawsStoneDecorations: performanceProfile.drawsStoneDecorations,
            burntGrassTileKeys: burntGrassTileKeysRef?.current,
          },
          centerTileX: Math.round(playerPosition.x),
          centerTileY: Math.round(playerPosition.y),
          maxChunkBuildsPerCall:
            performanceProfile.floorChunkBuildBudgetPerFrame,
          shouldSortChildrenImmediately: false,
        });
        finishFloorSyncSample();
        isFloorSyncCompleteRef.current = floorSyncResult.isComplete;
        shouldSortFloorLayer = floorSyncResult.needsChildSort;

        if (floorSyncResult.chunksBuilt > 0) {
          incrementingWorldPlazaPerformanceDiagnosticsCounter(
            DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.FLOOR_CHUNKS_BUILT,
            floorSyncResult.chunksBuilt
          );
        }
      }

      if (
        elevationBounds &&
        elevationBoundsKey !== lastTerrainElevationBoundsKeyRef.current
      ) {
        lastTerrainElevationBoundsKeyRef.current = elevationBoundsKey;
        isTerrainElevationSyncCompleteRef.current = false;
      }

      if (!DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED) {
        if (terrainElevationTileColumnGraphicsByKeyRef.current.size > 0) {
          for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
            trunkLayer.removeChild(elevationGraphics);
            elevationGraphics.destroy();
          }

          terrainElevationTileColumnGraphicsByKeyRef.current.clear();
          isTerrainElevationSyncCompleteRef.current = true;
        }
      } else if (
        elevationBounds &&
        !isTerrainElevationSyncCompleteRef.current
      ) {
        const terrainElevationSyncResult =
          syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
            parentContainer: trunkLayer,
            bounds: elevationBounds,
            columnGraphicsByKey:
              terrainElevationTileColumnGraphicsByKeyRef.current,
            drawOptions: {
              drawsSurfaceDecorations:
                performanceProfile.drawsTerrainElevationDecorations,
            },
            centerTileX: Math.round(playerPosition.x),
            centerTileY: Math.round(playerPosition.y),
            maxColumnBuildsPerCall:
              performanceProfile.terrainElevationChunkBuildBudgetPerFrame *
              performanceProfile.floorChunkSizeTiles,
            shouldSortChildrenImmediately: false,
          });
        isTerrainElevationSyncCompleteRef.current =
          terrainElevationSyncResult.isComplete;
        shouldSortTrunkLayer =
          shouldSortTrunkLayer || terrainElevationSyncResult.needsChildSort;

        for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
          elevationGraphics.visible = isFloorRenderLayerEnabled;
        }

        if (terrainElevationSyncResult.columnsBuilt > 0) {
          incrementingWorldPlazaPerformanceDiagnosticsCounter(
            DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.ELEVATION_CHUNKS_BUILT,
            terrainElevationSyncResult.columnsBuilt
          );
        }
      }

      // Trunks and canopies share one bounds window and one nearest-to-player cap
      // so both layers always select the identical set of trees. Separate windows
      // or scan-order caps let dense areas keep different subsets, which strands
      // trunks without canopies (and vice versa). Prefetch must stay wide enough
      // for bounds snap plus tall-crown overhang or trees pop off before scrolling away.
      const shouldComputeTreeBounds =
        isTrunkRenderLayerEnabled || isCanopyRenderLayerEnabled;
      const treeBounds = shouldComputeTreeBounds
        ? resolvingWorldPlazaVisibleIsometricTileBounds(
            playerPosition.x,
            playerPosition.y,
            viewportSize.width,
            viewportSize.height,
            performanceProfile.viewportPaddingTiles +
              performanceProfile.treePrefetchTiles,
            performanceProfile.visibleBoundsSnapTiles,
            worldZoom
          )
        : null;
      const treeBoundsKey = treeBounds
        ? buildingWorldPlazaVisibleTileBoundsCacheKey(treeBounds)
        : '';
      const treeCenterTileX = Math.round(playerPosition.x);
      const treeCenterTileY = Math.round(playerPosition.y);
      const shouldSyncTreeTrunks =
        isTrunkRenderLayerEnabled &&
        treeBounds &&
        (treeBoundsKey !== lastTrunkBoundsKeyRef.current ||
          placedTreeBlocksKey !== lastPlacedTreeBlocksKeyRef.current ||
          choppedTreesKey !== lastChoppedTreesKeyRef.current);
      const shouldSyncTreeCanopies =
        isCanopyRenderLayerEnabled &&
        treeBounds &&
        (treeBoundsKey !== lastCanopyBoundsKeyRef.current ||
          placedTreeBlocksKey !== lastPlacedTreeBlocksKeyRef.current ||
          choppedTreesKey !== lastChoppedTreesKeyRef.current);

      if (shouldSyncTreeTrunks) {
        lastTrunkBoundsKeyRef.current = treeBoundsKey;
        lastPlacedTreeBlocksKeyRef.current = placedTreeBlocksKey;
        lastChoppedTreesKeyRef.current = choppedTreesKey;
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.TRUNK_BOUNDS_CROSSING
        );
        const finishTrunkSyncSample = beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_TRUNK
        );
        const trunkSyncResult = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
          parentContainer: trunkLayer,
          bounds: treeBounds,
          trunkGraphicsByKey: trunkGraphicsByKeyRef.current,
          maxVisibleTrees: performanceProfile.maxVisibleTrees,
          centerTileX: treeCenterTileX,
          centerTileY: treeCenterTileY,
          placedBlocks: scenePlacedBlocks,
          remainingVisualLayerByTileKey: choppedTreesByTileKey,
          shouldSortChildrenImmediately: false,
        });
        shouldSortTrunkLayer =
          shouldSortTrunkLayer || trunkSyncResult.needsChildSort;
        finishTrunkSyncSample();
      }

      // Tree shadows resync on their own key: bounds/tree changes reuse cached
      // graphics, while a sun bucket change redraws them so the cast direction
      // and length follow the day/night cycle.
      const sunState = computingWorldPlazaDayNightSunState();
      const treeShadowSyncKey = `${treeBoundsKey}|${placedTreeBlocksKey}|${choppedTreesKey}|${sunState.bucketIndex}`;
      const shouldSyncTreeShadows =
        isTrunkRenderLayerEnabled &&
        treeBounds &&
        treeShadowSyncKey !== lastTreeShadowSyncKeyRef.current;

      if (shouldSyncTreeShadows) {
        const didSunBucketChange =
          sunState.bucketIndex !== lastTreeShadowSunBucketRef.current;
        lastTreeShadowSyncKeyRef.current = treeShadowSyncKey;
        lastTreeShadowSunBucketRef.current = sunState.bucketIndex;
        const treeShadowSyncResult =
          syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer({
            parentContainer: trunkLayer,
            bounds: treeBounds,
            shadowGraphicsByKey: treeShadowGraphicsByKeyRef.current,
            maxVisibleTrees: performanceProfile.maxVisibleTrees,
            centerTileX: treeCenterTileX,
            centerTileY: treeCenterTileY,
            placedBlocks: scenePlacedBlocks,
            remainingVisualLayerByTileKey: choppedTreesByTileKey,
            shouldSortChildrenImmediately: false,
            shouldRedrawExistingShadows: didSunBucketChange,
          });
        shouldSortTrunkLayer =
          shouldSortTrunkLayer || treeShadowSyncResult.needsChildSort;
      }

      if (shouldSyncTreeCanopies) {
        lastCanopyBoundsKeyRef.current = treeBoundsKey;
        lastPlacedTreeBlocksKeyRef.current = placedTreeBlocksKey;
        lastChoppedTreesKeyRef.current = choppedTreesKey;
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.CANOPY_BOUNDS_CROSSING
        );
        const finishCanopySyncSample = beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY
        );
        const canopySyncResult = syncingWorldPlazaVisibleTreeCanopyLayer({
          parentContainer: canopyLayer,
          bounds: treeBounds,
          canopyEntriesByKey: canopyEntriesByKeyRef.current,
          maxVisibleTrees: performanceProfile.maxVisibleTrees,
          centerTileX: treeCenterTileX,
          centerTileY: treeCenterTileY,
          placedBlocks: scenePlacedBlocks,
          remainingVisualLayerByTileKey: choppedTreesByTileKey,
          shouldSortChildrenImmediately: false,
        });
        shouldSortCanopyLayer = canopySyncResult.needsChildSort;
        finishCanopySyncSample();
      }

      if (shouldSortFloorLayer && floorLayer.sortableChildren) {
        floorLayer.sortChildren();
      }

      if (shouldSortTrunkLayer && trunkLayer.sortableChildren) {
        trunkLayer.sortChildren();
      }

      if (shouldSortCanopyLayer && canopyLayer.sortableChildren) {
        canopyLayer.sortChildren();
      }
    }

    const floorBoundsForWater =
      canSkipHeavyTerrainLayerSync && isFloorRenderLayerEnabled
        ? resolvingWorldPlazaVisibleIsometricTileBounds(
            playerPosition.x,
            playerPosition.y,
            viewportSize.width,
            viewportSize.height,
            performanceProfile.viewportPaddingTiles +
              performanceProfile.floorChunkPrefetchTiles,
            performanceProfile.visibleBoundsSnapTiles,
            worldZoom
          )
        : floorBounds;
    const floorBoundsKeyForWater = floorBoundsForWater
      ? buildingWorldPlazaVisibleTileBoundsCacheKey(floorBoundsForWater)
      : lastFloorBoundsKeyRef.current;

    if (isFloorRenderLayerEnabled && floorBoundsForWater) {
      const wasWaterSurfaceLayerMissing =
        waterSurfaceGraphicsRef.current === null;
      waterSurfaceGraphicsRef.current =
        ensuringWorldPlazaVisibleWaterSurfaceGraphicsLayer(
          floorLayer,
          waterSurfaceGraphicsRef.current
        );
      waterSurfaceGraphicsRef.current.visible = true;

      if (
        wasWaterSurfaceLayerMissing ||
        floorBoundsKeyForWater !== lastWaterSurfaceBoundsKeyRef.current
      ) {
        lastWaterSurfaceBoundsKeyRef.current = floorBoundsKeyForWater;
        updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer({
          surfaceGraphics: waterSurfaceGraphicsRef.current,
          bounds: floorBoundsForWater,
        });
      }

      if (wasWaterSurfaceLayerMissing && floorLayer.sortableChildren) {
        floorLayer.sortChildren();
      }
    } else if (waterSurfaceGraphicsRef.current) {
      waterSurfaceGraphicsRef.current.visible = isFloorRenderLayerEnabled;
    }

    waterShimmerFrameCounterRef.current += 1;

    if (
      isFloorRenderLayerEnabled &&
      floorBoundsForWater &&
      waterShimmerFrameCounterRef.current %
        DEFINING_WORLD_PLAZA_WATER_SHIMMER_UPDATE_INTERVAL_FRAMES ===
        0
    ) {
      waterShimmerGraphicsRef.current =
        ensuringWorldPlazaVisibleWaterShimmerGraphicsLayer(
          floorLayer,
          waterShimmerGraphicsRef.current
        );
      waterShimmerGraphicsRef.current.visible = true;
      updatingWorldPlazaVisibleWaterShimmerGraphicsLayer({
        shimmerGraphics: waterShimmerGraphicsRef.current,
        bounds: floorBoundsForWater,
        animationTimeMs: performance.now(),
      });
    } else if (waterShimmerGraphicsRef.current) {
      waterShimmerGraphicsRef.current.visible = isFloorRenderLayerEnabled;
    }

    const lavaAnimationClip = resolvingWorldPlazaAnimationClip(
      DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE
    );
    const animationTimeMs = performance.now();

    if (isFloorRenderLayerEnabled && floorBoundsForWater && lavaAnimationClip) {
      const wasLavaOverlayMissing = lavaOverlayStateRef.current === null;
      lavaOverlayStateRef.current = ensuringWorldPlazaVisibleLavaOverlayLayer(
        floorLayer,
        lavaOverlayStateRef.current
      );
      lavaOverlayStateRef.current.container.visible = true;

      if (
        wasLavaOverlayMissing ||
        floorBoundsKeyForWater !== lastLavaOverlayBoundsKeyRef.current
      ) {
        lastLavaOverlayBoundsKeyRef.current = floorBoundsKeyForWater;
        updatingWorldPlazaVisibleLavaOverlayLayer(
          lavaOverlayStateRef.current,
          floorBoundsForWater,
          animationTimeMs
        );
      }

      advancingWorldPlazaVisibleLavaOverlayAnimation(
        lavaOverlayStateRef.current,
        animationTimeMs
      );

      if (wasLavaOverlayMissing && floorLayer.sortableChildren) {
        floorLayer.sortChildren();
      }
    } else if (lavaOverlayStateRef.current) {
      lavaOverlayStateRef.current.container.visible = isFloorRenderLayerEnabled;
    }

    canopyAlphaFrameCounterRef.current += 1;

    if (
      isCanopyRenderLayerEnabled &&
      playerTileKey !== lastCanopyAlphaPlayerTileKeyRef.current &&
      canopyAlphaFrameCounterRef.current %
        performanceProfile.canopyAlphaUpdateIntervalFrames ===
        0
    ) {
      lastCanopyAlphaPlayerTileKeyRef.current = playerTileKey;
      const finishCanopyAlphaSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY_ALPHA
      );
      updatingWorldPlazaVisibleTreeCanopyLayerAlpha(
        canopyEntriesByKeyRef.current,
        playerPosition
      );
      finishCanopyAlphaSample();
    }

    settingWorldPlazaClientDebugStatus(
      'floor-chunks',
      `${floorChunkGraphicsByKeyRef.current.size}c`
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.FLOOR_CHUNK_COUNT,
      floorChunkGraphicsByKeyRef.current.size
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TERRAIN_ELEVATION_COLUMN_COUNT,
      terrainElevationTileColumnGraphicsByKeyRef.current.size
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TREE_TRUNK_COUNT,
      trunkGraphicsByKeyRef.current.size
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TREE_CANOPY_COUNT,
      canopyEntriesByKeyRef.current.size
    );
    finishTerrainSyncSample();
  }, [
    applicationContext,
    canopyLayerRef,
    floorLayerRef,
    performanceProfile,
    playerPositionRef,
    trunkLayerRef,
  ]);

  useEffect(() => {
    void preloadingWorldPlazaLavaTileTextures().then(() => {
      initializingWorldPlazaBuiltinAnimationClips();
    });

    return () => {
      clearingWorldPlazaLavaPoolLightSources();
    };
  }, []);

  useEffect(() => {
    if (lastIslandModeRevisionRef.current === islandModeRevision) {
      return;
    }

    lastIslandModeRevisionRef.current = islandModeRevision;

    const floorLayer = floorLayerRef.current;
    const trunkLayer = trunkLayerRef.current;
    const canopyLayer = canopyLayerRef.current;

    for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
      floorLayer?.removeChild(floorChunkGraphics);
      floorChunkGraphics.destroy();
    }

    floorChunkGraphicsByKeyRef.current.clear();

    for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
      trunkLayer?.removeChild(elevationGraphics);
      elevationGraphics.destroy();
    }

    terrainElevationTileColumnGraphicsByKeyRef.current.clear();

    for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
      trunkLayer?.removeChild(rockGraphics);
      rockGraphics.destroy();
    }

    terrainRockColumnGraphicsByKeyRef.current.clear();

    for (const trunkGraphics of trunkGraphicsByKeyRef.current.values()) {
      trunkLayer?.removeChild(trunkGraphics);
      trunkGraphics.destroy();
    }

    trunkGraphicsByKeyRef.current.clear();

    for (const treeShadowGraphics of treeShadowGraphicsByKeyRef.current.values()) {
      trunkLayer?.removeChild(treeShadowGraphics);
      treeShadowGraphics.destroy();
    }

    treeShadowGraphicsByKeyRef.current.clear();

    for (const canopyEntry of canopyEntriesByKeyRef.current.values()) {
      canopyLayer?.removeChild(canopyEntry.container);
      canopyEntry.container.destroy({ children: true });
    }

    canopyEntriesByKeyRef.current.clear();
    pendingRockFloorInvalidationAnchorsRef.current = [];
    lastFloorBoundsKeyRef.current = '';
    isFloorSyncCompleteRef.current = false;
    lastTerrainElevationBoundsKeyRef.current = '';
    isTerrainElevationSyncCompleteRef.current = false;
    lastTerrainRockBoundsKeyRef.current = '';
    isTerrainRockSyncCompleteRef.current = false;
    lastTrunkBoundsKeyRef.current = '';
    lastCanopyBoundsKeyRef.current = '';
    lastPlacedTreeBlocksKeyRef.current = '';
    lastWaterSurfaceBoundsKeyRef.current = '';
    waterSurfaceGraphicsRef.current?.clear();
    waterShimmerGraphicsRef.current?.clear();
    lastLavaOverlayBoundsKeyRef.current = '';

    if (lavaOverlayStateRef.current) {
      for (const lavaSprite of lavaOverlayStateRef.current.sprites) {
        lavaOverlayStateRef.current.container.removeChild(lavaSprite);
        lavaSprite.destroy();
      }

      lavaOverlayStateRef.current.sprites = [];
      lavaOverlayStateRef.current.maskGraphics.clear();
    }

    clearingWorldPlazaLavaPoolLightSources();
  }, [canopyLayerRef, floorLayerRef, islandModeRevision, trunkLayerRef]);

  useTick(() => {
    syncingProceduralTerrainLayers();
  });

  return null;
}
