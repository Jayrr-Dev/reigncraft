'use client';

import { initializingWorldPlazaBuiltinAnimationClips } from '@/components/world/animation/domains/initializingWorldPlazaBuiltinAnimationClips';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { computingWorldPlazaDirectionalTerrainPrefetchBounds } from '@/components/world/domains/computingWorldPlazaDirectionalTerrainPrefetchBounds';
import {
  computingWorldPlazaSmoothedMovementDirection,
  creatingWorldPlazaSmoothedMovementDirectionState,
} from '@/components/world/domains/computingWorldPlazaSmoothedMovementDirection';
import { DEFINING_WORLD_PLAZA_CAMERA_ZOOM } from '@/components/world/domains/definingWorldPlazaCameraConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import { settingWorldPlazaClientDebugStatus } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { beginningWorldPlazaTerrainFrameWorkBudget } from '@/components/world/domains/managingWorldPlazaTerrainFrameWorkBudget';
import {
  beginningWorldPlazaPerformanceSample,
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { invalidatingWorldPlazaMiniMapTileFillColorCache } from '@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor';
import { resolvingWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { resolvingWorldPlazaVisibleIsometricTileBounds } from '@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds';
import { invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache } from '@/components/world/domains/resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex';
import { buildingWorldPlazaPlacedTreeBlocksCacheKey } from '@/components/world/engine/buildingWorldPlazaTerrainLayerCacheKeys';
import {
  buildingWorldPlazaTerrainFloorBoundsCacheKey,
  buildingWorldPlazaTerrainIdleHeavySyncKey,
  computingWorldPlazaTerrainDependencySnapshot,
} from '@/components/world/engine/computingWorldPlazaTerrainDependencySnapshot';
import { DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY } from '@/components/world/engine/definingWorldPlazaTerrainDependencyKeys';
import type { RunningWorldPlazaTerrainLayerEngineInputRefs } from '@/components/world/engine/definingWorldPlazaTerrainLayerDescriptor';
import {
  listingWorldPlazaTerrainLayerDiagnosticsCounts,
  registeringWorldPlazaTerrainLayers,
} from '@/components/world/engine/registeringWorldPlazaTerrainLayers';
import { preloadingWorldPlazaTerrainTextureAssetManifest } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { RunningWorldPlazaTerrainLayerEngine } from '@/components/world/engine/runningWorldPlazaTerrainLayerEngine';
import {
  creatingWorldPlazaTerrainLayerEngine,
  resolvingWorldPlazaTerrainBoundsPrefetchTiles,
  type RunningWorldPlazaTerrainLayerEngineHandle,
} from '@/components/world/engine/runningWorldPlazaTerrainLayerEngine';
import {
  buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey,
  updatingWorldPlazaEnvironmentalTemperatureSamplingContext,
} from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { usingWorldPlazaGenerationFeaturesState } from '@/components/world/hooks/usingWorldPlazaGenerationFeaturesState';
import { usingWorldPlazaIslandModeFeatureEnabledState } from '@/components/world/hooks/usingWorldPlazaIslandModeFeatureEnabledState';
import { usingWorldPlazaProceduralTreesAndRocksFeatureEnabledState } from '@/components/world/hooks/usingWorldPlazaProceduralTreesAndRocksFeatureEnabledState';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import {
  markingWorldPlazaSpawnTerrainReady,
  peekingWorldPlazaSpawnTerrainReady,
  resettingWorldPlazaSpawnTerrainReady,
} from '@/components/world/loading/domains/managingWorldPlazaSpawnTerrainReadyStore';
import { useApplication } from '@pixi/react';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

export type RenderingWorldPlazaDeclarativeTerrainSyncProps =
  RunningWorldPlazaTerrainLayerEngineInputRefs;

/**
 * Lazily creates the terrain engine once per component mount.
 */
function ensuringWorldPlazaTerrainLayerEngine(
  terrainEngineRef: RefObject<RunningWorldPlazaTerrainLayerEngine | null>
): RunningWorldPlazaTerrainLayerEngine {
  if (terrainEngineRef.current) {
    return terrainEngineRef.current;
  }

  const engineHandleRef: {
    current: RunningWorldPlazaTerrainLayerEngineHandle | null;
  } = { current: null };
  const deferredHandle: RunningWorldPlazaTerrainLayerEngineHandle = {
    getIncrementalRuntimeState: (layerId) => {
      if (!engineHandleRef.current) {
        throw new Error('Terrain engine handle is not initialized.');
      }

      return engineHandleRef.current.getIncrementalRuntimeState(layerId);
    },
    markIncrementalLayerIncomplete: (layerId) => {
      engineHandleRef.current?.markIncrementalLayerIncomplete(layerId);
    },
  };
  const layers = registeringWorldPlazaTerrainLayers(deferredHandle);
  const engine = creatingWorldPlazaTerrainLayerEngine(layers);
  engineHandleRef.current = engine.handle;
  terrainEngineRef.current = engine;

  return engine;
}

/**
 * Declarative terrain sync shell driven by the terrain layer engine.
 */
export function RenderingWorldPlazaDeclarativeTerrainSync({
  playerPositionRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  placedBlocksRef,
  burntGrassTileKeysRef,
  choppedTreesByTileKeyRef,
  pickedPebblesByTileKeyRef,
  pickedFlowersByTileKeyRef,
  floorLayerRef,
  trunkLayerRef,
  canopyLayerRef,
}: RenderingWorldPlazaDeclarativeTerrainSyncProps): null {
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const performanceProfileRef = useRef(performanceProfile);
  performanceProfileRef.current = performanceProfile;
  const { islandModeRevision } = usingWorldPlazaIslandModeFeatureEnabledState();
  const { proceduralTreesAndRocksRevision } =
    usingWorldPlazaProceduralTreesAndRocksFeatureEnabledState();
  const { revision: generationFeaturesRevision } =
    usingWorldPlazaGenerationFeaturesState();
  const proceduralGenerationRevision =
    proceduralTreesAndRocksRevision + generationFeaturesRevision;
  const applicationContext = useApplication();
  const lastIslandModeRevisionRef = useRef(islandModeRevision);
  const lastProceduralTreesAndRocksRevisionRef = useRef(
    proceduralGenerationRevision
  );
  const lastThawVisualSyncKeyRef = useRef('');
  const lastFloorBoundsKeyRef = useRef('');
  const lastTreeBoundsKeyRef = useRef('');
  const movementDirectionStateRef = useRef(
    creatingWorldPlazaSmoothedMovementDirectionState()
  );
  const lastViewportSizeRef = useRef({ width: 0, height: 0 });
  const terrainEngineRef = useRef<RunningWorldPlazaTerrainLayerEngine | null>(
    null
  );

  const syncingDeclarativeTerrainLayers = useCallback((): void => {
    const needsTerrainSync =
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.FLOOR_TILES
      ) ||
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ELEVATION
      ) ||
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
      );

    if (!needsTerrainSync) {
      return;
    }

    const terrainEngine =
      ensuringWorldPlazaTerrainLayerEngine(terrainEngineRef);
    const finishTerrainSyncSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_SYNC
    );

    const floorLayer = floorLayerRef.current;
    const trunkLayer = trunkLayerRef.current;
    const canopyLayer = canopyLayerRef.current;
    const playerPosition = playerPositionRef.current;
    const cameraOffset = cameraOffsetRef.current;
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

    const scenePlacedBlocks = placedBlocksRef?.current?.blocks ?? [];
    const choppedTreesByTileKey =
      choppedTreesByTileKeyRef?.current ?? new Map();
    const pickedPebblesByTileKey =
      pickedPebblesByTileKeyRef?.current ?? new Map();
    const pickedFlowersByTileKey =
      pickedFlowersByTileKeyRef?.current ?? new Map();
    const burntGrassTileKeys = burntGrassTileKeysRef?.current;
    const placedTreeBlocksKey =
      buildingWorldPlazaPlacedTreeBlocksCacheKey(scenePlacedBlocks);
    const sunState = computingWorldPlazaDayNightSunState();

    updatingWorldPlazaEnvironmentalTemperatureSamplingContext({
      placedBlocksByTile: placedBlocksRef?.current?.blocksByTile ?? new Map(),
    });

    const thawVisualSyncKey = `${sunState.bucketIndex}|${buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey(scenePlacedBlocks)}`;

    if (thawVisualSyncKey !== lastThawVisualSyncKeyRef.current) {
      lastThawVisualSyncKeyRef.current = thawVisualSyncKey;
      invalidatingWorldPlazaMiniMapTileFillColorCache();
      invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache();
    }

    if (
      viewportSize.width !== lastViewportSizeRef.current.width ||
      viewportSize.height !== lastViewportSizeRef.current.height
    ) {
      lastViewportSizeRef.current = viewportSize;
      lastFloorBoundsKeyRef.current = '';
    }

    const movementDirection = computingWorldPlazaSmoothedMovementDirection(
      movementDirectionStateRef.current,
      playerPosition.x,
      playerPosition.y
    );

    const areFloorTilesEnabled = checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.FLOOR_TILES
    );
    const areElevationColumnsEnabled =
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ELEVATION
      );
    const areTreesEnabled = checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
    );

    const symmetricFloorBounds =
      isFloorRenderLayerEnabled && areFloorTilesEnabled
        ? resolvingWorldPlazaVisibleIsometricTileBounds(
            playerPosition.x,
            playerPosition.y,
            viewportSize.width,
            viewportSize.height,
            performanceProfile.viewportPaddingTiles +
              resolvingWorldPlazaTerrainBoundsPrefetchTiles(
                performanceProfile,
                'floor'
              ),
            performanceProfile.visibleBoundsSnapTiles,
            worldZoom
          )
        : null;
    const symmetricElevationBounds =
      isFloorRenderLayerEnabled && areElevationColumnsEnabled
        ? resolvingWorldPlazaVisibleIsometricTileBounds(
            playerPosition.x,
            playerPosition.y,
            viewportSize.width,
            viewportSize.height,
            performanceProfile.viewportPaddingTiles +
              resolvingWorldPlazaTerrainBoundsPrefetchTiles(
                performanceProfile,
                'elevation'
              ),
            performanceProfile.visibleBoundsSnapTiles,
            worldZoom
          )
        : null;
    const shouldComputeTreeBounds =
      areTreesEnabled &&
      (isTrunkRenderLayerEnabled || isCanopyRenderLayerEnabled);
    const symmetricTreeBounds = shouldComputeTreeBounds
      ? resolvingWorldPlazaVisibleIsometricTileBounds(
          playerPosition.x,
          playerPosition.y,
          viewportSize.width,
          viewportSize.height,
          performanceProfile.viewportPaddingTiles +
            resolvingWorldPlazaTerrainBoundsPrefetchTiles(
              performanceProfile,
              'tree'
            ),
          performanceProfile.visibleBoundsSnapTiles,
          worldZoom
        )
      : null;

    const floorBounds = symmetricFloorBounds
      ? computingWorldPlazaDirectionalTerrainPrefetchBounds(
          symmetricFloorBounds,
          movementDirection,
          performanceProfile.forwardPrefetchTiles,
          // Never trim floor behind the player: trailing-edge void is visible
          // under camera dead-zone and snap drift. Forward expand only.
          0
        )
      : null;
    const elevationBounds = symmetricElevationBounds
      ? computingWorldPlazaDirectionalTerrainPrefetchBounds(
          symmetricElevationBounds,
          movementDirection,
          performanceProfile.forwardPrefetchTiles,
          performanceProfile.behindRetentionTiles
        )
      : null;
    const treeBounds = symmetricTreeBounds
      ? computingWorldPlazaDirectionalTerrainPrefetchBounds(
          symmetricTreeBounds,
          movementDirection,
          performanceProfile.forwardPrefetchTiles,
          performanceProfile.behindRetentionTiles
        )
      : null;

    const floorBoundsKey =
      buildingWorldPlazaTerrainFloorBoundsCacheKey(floorBounds);
    const elevationBoundsKey =
      buildingWorldPlazaTerrainFloorBoundsCacheKey(elevationBounds);
    const treeBoundsKey =
      buildingWorldPlazaTerrainFloorBoundsCacheKey(treeBounds);

    if (
      floorBoundsKey !== lastFloorBoundsKeyRef.current &&
      floorBoundsKey !== ''
    ) {
      if (lastFloorBoundsKeyRef.current !== '') {
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.FLOOR_BOUNDS_CROSSING
        );
      }

      lastFloorBoundsKeyRef.current = floorBoundsKey;
    }

    if (
      treeBoundsKey !== lastTreeBoundsKeyRef.current &&
      treeBoundsKey !== ''
    ) {
      if (lastTreeBoundsKeyRef.current !== '') {
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.TRUNK_BOUNDS_CROSSING
        );
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.CANOPY_BOUNDS_CROSSING
        );
      }

      lastTreeBoundsKeyRef.current = treeBoundsKey;
    }

    const dependencySnapshot = computingWorldPlazaTerrainDependencySnapshot({
      viewportWidth: viewportSize.width,
      viewportHeight: viewportSize.height,
      playerPosition,
      scenePlacedBlocks,
      choppedTreesByTileKey,
      pickedPebblesByTileKey,
      pickedFlowersByTileKey,
      burntGrassTileKeys,
      islandModeRevision,
      proceduralTreesAndRocksRevision: proceduralGenerationRevision,
      floorBounds,
      elevationBounds,
      treeBounds,
    });

    const idleHeavySyncKey = buildingWorldPlazaTerrainIdleHeavySyncKey({
      floorBoundsKey,
      worldZoom,
      viewportWidth: viewportSize.width,
      viewportHeight: viewportSize.height,
      placedTreeBlocksKey,
      thawVisualSyncKey:
        dependencySnapshot[
          DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.THAW_VISUAL
        ],
      pickedPebblesCacheKey:
        dependencySnapshot[
          DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_PEBBLES
        ],
    });

    const animationTimeMs = performance.now();
    const sunBucketIndex = Number(
      dependencySnapshot[DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.SUN_BUCKET]
    );

    const engineContext = {
      performanceProfile,
      playerPosition,
      cameraOffset,
      viewportWidth: viewportSize.width,
      viewportHeight: viewportSize.height,
      worldZoom,
      floorLayer,
      trunkLayer,
      canopyLayer,
      scenePlacedBlocks,
      choppedTreesByTileKey,
      pickedPebblesByTileKey,
      pickedFlowersByTileKey,
      burntGrassTileKeys,
      isFloorRenderLayerEnabled,
      isTrunkRenderLayerEnabled,
      isCanopyRenderLayerEnabled,
      floorBounds,
      elevationBounds,
      treeBounds,
      floorBoundsKey,
      elevationBoundsKey,
      treeBoundsKey,
      sunBucketIndex,
      animationTimeMs,
      playerTileKey:
        dependencySnapshot[
          DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLAYER_TILE
        ],
    };

    terrainEngine.tick({
      context: engineContext,
      dependencySnapshot,
      idleHeavySyncKey,
      floorBoundsForRedraw: floorBounds,
      floorBoundsKeyForRedraw: floorBoundsKey,
      terrainFrameWorkBudget: beginningWorldPlazaTerrainFrameWorkBudget(
        performanceProfile.terrainWorkBudgetMs
      ),
    });

    if (
      !peekingWorldPlazaSpawnTerrainReady() &&
      terrainEngine.checkingSpawnBootFloorChunksReady()
    ) {
      markingWorldPlazaSpawnTerrainReady();
    }

    const diagnosticsCounts = listingWorldPlazaTerrainLayerDiagnosticsCounts(
      terrainEngine.handle
    );

    settingWorldPlazaClientDebugStatus(
      'floor-chunks',
      `${diagnosticsCounts.floorChunkCount}c`
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.FLOOR_CHUNK_COUNT,
      diagnosticsCounts.floorChunkCount
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TERRAIN_ELEVATION_COLUMN_COUNT,
      diagnosticsCounts.terrainElevationColumnCount
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TREE_TRUNK_COUNT,
      diagnosticsCounts.treeTrunkCount
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TREE_CANOPY_COUNT,
      diagnosticsCounts.treeCanopyCount
    );
    finishTerrainSyncSample();
  }, [
    applicationContext,
    burntGrassTileKeysRef,
    cameraOffsetRef,
    cameraWorldZoomRef,
    canopyLayerRef,
    choppedTreesByTileKeyRef,
    floorLayerRef,
    islandModeRevision,
    proceduralGenerationRevision,
    performanceProfile,
    placedBlocksRef,
    pickedPebblesByTileKeyRef,
    pickedFlowersByTileKeyRef,
    playerPositionRef,
    trunkLayerRef,
  ]);

  useEffect(() => {
    void preloadingWorldPlazaTerrainTextureAssetManifest().then(() => {
      initializingWorldPlazaBuiltinAnimationClips();
    });
  }, []);

  useEffect(() => {
    const didIslandModeChange =
      lastIslandModeRevisionRef.current !== islandModeRevision;
    const didProceduralTreesAndRocksChange =
      lastProceduralTreesAndRocksRevisionRef.current !==
      proceduralGenerationRevision;

    if (!didIslandModeChange && !didProceduralTreesAndRocksChange) {
      return;
    }

    lastIslandModeRevisionRef.current = islandModeRevision;
    lastProceduralTreesAndRocksRevisionRef.current =
      proceduralGenerationRevision;

    const floorLayer = floorLayerRef.current;
    const trunkLayer = trunkLayerRef.current;
    const canopyLayer = canopyLayerRef.current;
    const playerPosition = playerPositionRef.current;
    const terrainEngine = terrainEngineRef.current;

    if (!terrainEngine) {
      return;
    }

    if (!floorLayer || !trunkLayer || !canopyLayer) {
      return;
    }

    if (!playerPosition) {
      return;
    }

    terrainEngine.resetAll({
      performanceProfile: performanceProfileRef.current,
      playerPosition,
      cameraOffset: cameraOffsetRef.current,
      viewportWidth: 0,
      viewportHeight: 0,
      worldZoom: DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
      floorLayer,
      trunkLayer,
      canopyLayer,
      scenePlacedBlocks: placedBlocksRef?.current?.blocks ?? [],
      choppedTreesByTileKey: choppedTreesByTileKeyRef?.current ?? new Map(),
      pickedPebblesByTileKey: pickedPebblesByTileKeyRef?.current ?? new Map(),
      pickedFlowersByTileKey: pickedFlowersByTileKeyRef?.current ?? new Map(),
      burntGrassTileKeys: burntGrassTileKeysRef?.current,
      isFloorRenderLayerEnabled: true,
      isTrunkRenderLayerEnabled: true,
      isCanopyRenderLayerEnabled: true,
      floorBounds: null,
      elevationBounds: null,
      treeBounds: null,
      floorBoundsKey: '',
      elevationBoundsKey: '',
      treeBoundsKey: '',
      sunBucketIndex: 0,
      animationTimeMs: 0,
      playerTileKey: '',
    });

    lastFloorBoundsKeyRef.current = '';
    lastThawVisualSyncKeyRef.current = '';
  }, [
    burntGrassTileKeysRef,
    cameraOffsetRef,
    canopyLayerRef,
    choppedTreesByTileKeyRef,
    floorLayerRef,
    islandModeRevision,
    placedBlocksRef,
    pickedPebblesByTileKeyRef,
    pickedFlowersByTileKeyRef,
    playerPositionRef,
    proceduralGenerationRevision,
    trunkLayerRef,
  ]);

  // Destroy only on unmount. Do NOT depend on performanceProfile: adaptive
  // tier changes would re-run cleanup, clear layerEntries, and leave a dead
  // engine in terrainEngineRef (Unknown terrain layer id: floor-chunks).
  useEffect(() => {
    return () => {
      resettingWorldPlazaSpawnTerrainReady();

      const floorLayer = floorLayerRef.current;
      const trunkLayer = trunkLayerRef.current;
      const canopyLayer = canopyLayerRef.current;
      const terrainEngine = terrainEngineRef.current;

      if (!floorLayer || !trunkLayer || !canopyLayer || !terrainEngine) {
        return;
      }

      terrainEngine.destroy({
        performanceProfile: performanceProfileRef.current,
        playerPosition: { x: 0, y: 0 },
        cameraOffset: cameraOffsetRef.current,
        viewportWidth: 0,
        viewportHeight: 0,
        worldZoom: DEFINING_WORLD_PLAZA_CAMERA_ZOOM,
        floorLayer,
        trunkLayer,
        canopyLayer,
        scenePlacedBlocks: [],
        choppedTreesByTileKey: new Map(),
        pickedPebblesByTileKey: new Map(),
        pickedFlowersByTileKey: new Map(),
        burntGrassTileKeys: undefined,
        isFloorRenderLayerEnabled: true,
        isTrunkRenderLayerEnabled: true,
        isCanopyRenderLayerEnabled: true,
        floorBounds: null,
        elevationBounds: null,
        treeBounds: null,
        floorBoundsKey: '',
        elevationBoundsKey: '',
        treeBoundsKey: '',
        sunBucketIndex: 0,
        animationTimeMs: 0,
        playerTileKey: '',
      });
      terrainEngineRef.current = null;
    };
  }, [cameraOffsetRef, canopyLayerRef, floorLayerRef, trunkLayerRef]);

  usingWorldPlazaSafeTick(() => {
    syncingDeclarativeTerrainLayers();
  }, 'tick:terrain-sync');

  return null;
}
