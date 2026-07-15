import {
  buildingWorldPlazaVisibleTreeDrawEntries,
  type BuildingWorldPlazaVisibleTreeDrawEntry,
} from '@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { computingWorldPlazaEmissiveNightBrightnessMultiplierFromSunState } from '@/components/world/domains/computingWorldPlazaEmissiveNightBrightnessMultiplierFromSunState';
import { DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_SPRITE_ALPHA_BOOST_AT_MIDNIGHT } from '@/components/world/domains/definingWorldPlazaEmissiveNightBoostConstants';
import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_WATER_IDS,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import { DEFINING_WORLD_PLAZA_WATER_SURFACE_VIEWPORT_PADDING_TILES } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import type { InvalidatingWorldPlazaFloorChunkGraphicsTileIndex } from '@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices';
import { invalidatingWorldPlazaFloorChunkGraphicsForTileIndices } from '@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices';
import { listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex } from '@/components/world/domains/listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  beginningWorldPlazaPerformanceSample,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { refreshingWorldPlazaFloorChunkGraphicsForTileIndices } from '@/components/world/domains/refreshingWorldPlazaFloorChunkGraphicsForTileIndices';
import { resolvingWorldPlazaWaterShimmerViewportTileBounds } from '@/components/world/domains/resolvingWorldPlazaWaterShimmerViewportTileBounds';
import { resolvingWorldPlazaWaterViewportTileBounds } from '@/components/world/domains/resolvingWorldPlazaWaterViewportTileBounds';
import { syncingWorldPlazaVisibleFirelandsDecorationLayer } from '@/components/world/domains/syncingWorldPlazaVisibleFirelandsDecorationLayer';
import {
  ensuringWorldPlazaVisibleFlowerDecorationLayer,
  updatingWorldPlazaVisibleFlowerDecorationLayer,
} from '@/components/world/domains/syncingWorldPlazaVisibleFlowerDecorationLayer';
import {
  advancingWorldPlazaVisibleLavaOverlayAnimation,
  clearingWorldPlazaLavaPoolLightSources,
  clearingWorldPlazaVisibleLavaOverlayGroundSprite,
  ensuringWorldPlazaVisibleLavaOverlayLayer,
  updatingWorldPlazaVisibleLavaOverlayLayer,
  type SyncingWorldPlazaVisibleLavaOverlayLayerState,
} from '@/components/world/domains/syncingWorldPlazaVisibleLavaOverlayLayer';
import { syncingWorldPlazaVisibleLongGrassDecorationLayer } from '@/components/world/domains/syncingWorldPlazaVisibleLongGrassDecorationLayer';
import { syncingWorldPlazaVisibleShrubDecorationLayer } from '@/components/world/domains/syncingWorldPlazaVisibleShrubDecorationLayer';
import {
  ensuringWorldPlazaVisibleStoneDecorationLayer,
  updatingWorldPlazaVisibleStoneDecorationLayer,
} from '@/components/world/domains/syncingWorldPlazaVisibleStoneDecorationLayer';
import { syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer';
import { syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer } from '@/components/world/domains/syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer';
import type { SyncingWorldPlazaVisibleTileChunkPendingBuild } from '@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer';
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
  buildingWorldPlazaBurntGrassTileKeysCacheKey,
  buildingWorldPlazaClearedLongGrassCacheKey,
  buildingWorldPlazaPickedFlowersCacheKey,
  buildingWorldPlazaPickedPebblesCacheKey,
} from '@/components/world/engine/buildingWorldPlazaTerrainLayerCacheKeys';
import { DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY } from '@/components/world/engine/definingWorldPlazaTerrainDependencyKeys';
import type {
  DefiningWorldPlazaTerrainLayerDescriptor,
  RunningWorldPlazaTerrainLayerEngineContext,
} from '@/components/world/engine/definingWorldPlazaTerrainLayerDescriptor';
import { REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import {
  RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID,
  type RunningWorldPlazaTerrainLayerEngineHandle,
} from '@/components/world/engine/runningWorldPlazaTerrainLayerEngine';
import { updatingWorldPlazaVisibleTreeShakeOffsets } from '@/components/world/harvest/domains/updatingWorldPlazaVisibleTreeShakeOffsets';
import { syncingWorldPlazaVisibleMushroomDecorationLayer } from '@/components/world/mushrooms/domains/syncingWorldPlazaVisibleMushroomDecorationLayer';
import type { Graphics, Sprite } from 'pixi.js';
import { parsingWorldFireDevvitTileKey } from '../../../shared/worldFireDevvit';

/**
 * Declarative registry of every terrain sync layer.
 *
 * @module components/world/engine/registeringWorldPlazaTerrainLayers
 */

type RunningWorldPlazaRockColumnsLayerState = {
  rockGraphicsByKey: Map<string, Graphics>;
  pendingFloorInvalidationAnchors: InvalidatingWorldPlazaFloorChunkGraphicsTileIndex[];
  lastSyncedBoundsKey: string;
};

type RunningWorldPlazaFirelandsDecorationsLayerState = {
  spriteByKey: Map<string, Sprite>;
};

type RunningWorldPlazaFloorChunksLayerState = {
  chunkGraphicsByKey: Map<string, Graphics>;
  pendingChunkBuilds: Map<
    string,
    SyncingWorldPlazaVisibleTileChunkPendingBuild
  >;
  lastBurntGrassCacheKey: string;
  lastPickedPebblesCacheKey: string;
  lastPickedPebblesTileKeys: Set<string>;
};

type RunningWorldPlazaFlowerDecorationsLayerState = {
  graphics: Graphics | null;
};

type RunningWorldPlazaLongGrassDecorationsLayerState = {
  spriteByKey: Map<string, Sprite>;
};

type RunningWorldPlazaShrubDecorationsLayerState = {
  spriteByKey: Map<string, Sprite>;
};

type RunningWorldPlazaMushroomDecorationsLayerState = {
  spriteByKey: Map<string, Sprite>;
  candidateCache: {
    cacheKey: string;
    candidates: readonly {
      readonly tileX: number;
      readonly tileY: number;
      readonly speciesIndex: number;
    }[];
  };
};

type RunningWorldPlazaStoneDecorationsLayerState = {
  graphics: Graphics | null;
};

type RunningWorldPlazaElevationColumnsLayerState = {
  columnGraphicsByKey: Map<string, Graphics>;
};

type RunningWorldPlazaTreeTrunksLayerState = {
  trunkGraphicsByKey: Map<string, Graphics>;
};

type RunningWorldPlazaTreeShadowsLayerState = {
  shadowGraphicsByKey: Map<string, Graphics>;
  lastSunBucketIndex: number;
};

type RunningWorldPlazaTreeCanopiesLayerState = {
  canopyEntriesByKey: Map<string, SyncingWorldPlazaVisibleTreeCanopyLayerEntry>;
};

type RunningWorldPlazaWaterSurfaceLayerState = {
  graphics: Graphics | null;
};

type RunningWorldPlazaWaterShimmerLayerState = {
  graphics: Graphics | null;
};

type RunningWorldPlazaLavaOverlayLayerState = {
  overlayState: SyncingWorldPlazaVisibleLavaOverlayLayerState | null;
};

type RunningWorldPlazaCanopyAlphaLayerState = {
  frameCounter: number;
  lastPlayerTileKey: string;
};

type RunningWorldPlazaTreeShakeLayerState = Record<string, never>;

/**
 * Registers every declarative terrain layer descriptor.
 */
export function registeringWorldPlazaTerrainLayers(
  engineHandle: RunningWorldPlazaTerrainLayerEngineHandle
): readonly DefiningWorldPlazaTerrainLayerDescriptor[] {
  const treeDrawEntriesByContext = new WeakMap<
    RunningWorldPlazaTerrainLayerEngineContext,
    readonly BuildingWorldPlazaVisibleTreeDrawEntry[]
  >();

  const resolvingSharedTreeDrawEntries = (
    context: RunningWorldPlazaTerrainLayerEngineContext
  ): readonly BuildingWorldPlazaVisibleTreeDrawEntry[] => {
    const cachedEntries = treeDrawEntriesByContext.get(context);

    if (cachedEntries) {
      return cachedEntries;
    }

    if (!context.treeBounds) {
      return [];
    }

    const entries = buildingWorldPlazaVisibleTreeDrawEntries(
      context.treeBounds,
      context.performanceProfile.maxVisibleTrees,
      Math.round(context.playerPosition.x),
      Math.round(context.playerPosition.y),
      context.scenePlacedBlocks,
      context.choppedTreesByTileKey
    );
    treeDrawEntriesByContext.set(context, entries);
    return entries;
  };

  return [
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.ROCK_COLUMNS,
      parentLayer: 'trunk',
      boundsProfile: 'floor',
      participatesInHeavyIdleSkip: true,
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.COLUMN_ROCKS,
      ],
      invalidateOn: [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS],
      createRuntimeState: (): RunningWorldPlazaRockColumnsLayerState => ({
        rockGraphicsByKey: new Map(),
        pendingFloorInvalidationAnchors: [],
        lastSyncedBoundsKey: '',
      }),
      sync: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaRockColumnsLayerState;

        if (!context.floorBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        if (state.lastSyncedBoundsKey !== context.floorBoundsKey) {
          state.lastSyncedBoundsKey = context.floorBoundsKey;
          state.pendingFloorInvalidationAnchors = [];
        }

        const terrainRockSyncResult =
          syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer({
            parentContainer: context.trunkLayer,
            bounds: context.floorBounds,
            rockGraphicsByKey: state.rockGraphicsByKey,
            centerTileX: Math.round(context.playerPosition.x),
            centerTileY: Math.round(context.playerPosition.y),
            maxColumnBuildsPerCall:
              context.performanceProfile
                .terrainElevationChunkBuildBudgetPerFrame *
              context.performanceProfile.floorChunkSizeTiles,
            shouldSortChildrenImmediately: false,
          });

        for (const anchorTile of terrainRockSyncResult.builtAnchorTileIndices) {
          state.pendingFloorInvalidationAnchors.push({
            tileX: anchorTile.tileX,
            tileY: anchorTile.tileY,
          });
        }

        for (const rockGraphics of state.rockGraphicsByKey.values()) {
          rockGraphics.visible = context.isFloorRenderLayerEnabled;
        }

        return {
          isComplete: terrainRockSyncResult.isComplete,
          needsChildSort: terrainRockSyncResult.needsChildSort,
          builtCount: terrainRockSyncResult.columnsBuilt,
        };
      },
      onAfterSync: (context, runtimeState, syncResult) => {
        const state = runtimeState as RunningWorldPlazaRockColumnsLayerState;

        if (
          !syncResult.isComplete ||
          state.pendingFloorInvalidationAnchors.length === 0
        ) {
          return;
        }

        if (!context.floorBounds) {
          state.pendingFloorInvalidationAnchors = [];
          return;
        }

        const floorState =
          engineHandle.getIncrementalRuntimeState<RunningWorldPlazaFloorChunksLayerState>(
            RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOOR_CHUNKS
          );
        const floorInvalidationTileIndices =
          state.pendingFloorInvalidationAnchors.flatMap((anchorTile) =>
            listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex(
              anchorTile.tileX,
              anchorTile.tileY
            )
          );
        state.pendingFloorInvalidationAnchors = [];

        // Redraw in place so rock footprints get lifted biome caps without
        // opening empty diamond holes while floor chunks rebuild.
        refreshingWorldPlazaFloorChunkGraphicsForTileIndices({
          parentContainer: context.floorLayer,
          chunkSizeTiles: context.performanceProfile.floorChunkSizeTiles,
          chunkGraphicsByKey: floorState.chunkGraphicsByKey,
          pendingChunkBuilds: floorState.pendingChunkBuilds,
          tileIndices: floorInvalidationTileIndices,
          drawOptions: {
            drawsGrassDecorations:
              context.performanceProfile.drawsGrassDecorations &&
              checkingWorldPlazaGenerationFeatureEnabled(
                DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES
              ),
            drawsFlowerDecorations: false,
            drawsStoneDecorations: false,
            drawsEnvironmentalHazardFloorTint:
              context.performanceProfile.drawsEnvironmentalHazardFloorTint,
            burntGrassTileKeys: context.burntGrassTileKeys,
          },
        });
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaRockColumnsLayerState;

        for (const rockGraphics of state.rockGraphicsByKey.values()) {
          context.trunkLayer.removeChild(rockGraphics);
          rockGraphics.destroy();
        }

        state.rockGraphicsByKey.clear();
        state.pendingFloorInvalidationAnchors = [];
        state.lastSyncedBoundsKey = '';
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaRockColumnsLayerState;

        for (const rockGraphics of state.rockGraphicsByKey.values()) {
          rockGraphics.parent?.removeChild(rockGraphics);
          rockGraphics.destroy();
        }

        state.rockGraphicsByKey.clear();
        state.pendingFloorInvalidationAnchors = [];
        state.lastSyncedBoundsKey = '';
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FIRELANDS_DECORATIONS,
      parentLayer: 'trunk',
      boundsProfile: 'floor',
      participatesInHeavyIdleSkip: true,
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES,
      ],
      requiresTextures: [
        REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.FIRELANDS_SPRITES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FIRELANDS_TEXTURES_READY,
      ],
      createRuntimeState:
        (): RunningWorldPlazaFirelandsDecorationsLayerState => ({
          spriteByKey: new Map(),
        }),
      sync: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaFirelandsDecorationsLayerState;

        if (!context.floorBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const firelandsSyncResult =
          syncingWorldPlazaVisibleFirelandsDecorationLayer({
            parentContainer: context.trunkLayer,
            bounds: context.floorBounds,
            spriteByKey: state.spriteByKey,
            centerTileX: Math.round(context.playerPosition.x),
            centerTileY: Math.round(context.playerPosition.y),
            maxBuildsPerCall:
              context.performanceProfile
                .terrainElevationChunkBuildBudgetPerFrame *
              context.performanceProfile.floorChunkSizeTiles,
            shouldSortChildrenImmediately: false,
          });

        for (const firelandsSprite of state.spriteByKey.values()) {
          firelandsSprite.visible = context.isFloorRenderLayerEnabled;
        }

        return {
          isComplete: firelandsSyncResult.isComplete,
          needsChildSort: firelandsSyncResult.needsChildSort,
          builtCount: firelandsSyncResult.propsBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaFirelandsDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          context.trunkLayer.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaFirelandsDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          sprite.parent?.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOOR_CHUNKS,
      parentLayer: 'floor',
      boundsProfile: 'floor',
      participatesInHeavyIdleSkip: true,
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.FLOOR_TILES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_PEBBLES,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.THAW_VISUAL,
      ],
      createRuntimeState: (): RunningWorldPlazaFloorChunksLayerState => ({
        chunkGraphicsByKey: new Map(),
        pendingChunkBuilds: new Map(),
        lastBurntGrassCacheKey: '',
        lastPickedPebblesCacheKey: '',
        lastPickedPebblesTileKeys: new Set(),
      }),
      sync: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaFloorChunksLayerState;

        if (!context.floorBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const floorDrawOptions = {
          drawsGrassDecorations:
            context.performanceProfile.drawsGrassDecorations &&
            checkingWorldPlazaGenerationFeatureEnabled(
              DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES
            ),
          drawsFlowerDecorations: false,
          drawsStoneDecorations: false,
          drawsEnvironmentalHazardFloorTint:
            context.performanceProfile.drawsEnvironmentalHazardFloorTint,
          burntGrassTileKeys: context.burntGrassTileKeys,
        };

        const burntGrassCacheKey = buildingWorldPlazaBurntGrassTileKeysCacheKey(
          context.burntGrassTileKeys
        );

        if (
          burntGrassCacheKey !== state.lastBurntGrassCacheKey &&
          context.burntGrassTileKeys &&
          context.burntGrassTileKeys.size > 0
        ) {
          state.lastBurntGrassCacheKey = burntGrassCacheKey;
          const burntGrassTileIndices = Array.from(
            context.burntGrassTileKeys
          ).flatMap((tileKey) => {
            const parsedTile = parsingWorldFireDevvitTileKey(tileKey);

            return parsedTile
              ? [{ tileX: parsedTile.tileX, tileY: parsedTile.tileY }]
              : [];
          });

          if (burntGrassTileIndices.length > 0) {
            invalidatingWorldPlazaFloorChunkGraphicsForTileIndices({
              parentContainer: context.floorLayer,
              bounds: context.floorBounds,
              chunkSizeTiles: context.performanceProfile.floorChunkSizeTiles,
              chunkGraphicsByKey: state.chunkGraphicsByKey,
              pendingChunkBuilds: state.pendingChunkBuilds,
              tileIndices: burntGrassTileIndices,
            });
          }
        } else if (burntGrassCacheKey !== state.lastBurntGrassCacheKey) {
          state.lastBurntGrassCacheKey = burntGrassCacheKey;
        }

        const pickedSurfaceDecorationsCacheKey = `${buildingWorldPlazaPickedPebblesCacheKey(
          context.pickedPebblesByTileKey
        )}|${buildingWorldPlazaPickedFlowersCacheKey(
          context.pickedFlowersByTileKey
        )}`;
        const pickedSurfaceTileKeys = new Set([
          ...context.pickedPebblesByTileKey.keys(),
          ...context.pickedFlowersByTileKey.keys(),
        ]);

        if (
          pickedSurfaceDecorationsCacheKey !==
            state.lastPickedPebblesCacheKey &&
          pickedSurfaceTileKeys.size > 0
        ) {
          const newlyPickedSurfaceTileIndices = Array.from(
            pickedSurfaceTileKeys
          ).flatMap((tileKey) => {
            if (state.lastPickedPebblesTileKeys.has(tileKey)) {
              return [];
            }

            const [rawTileX, rawTileY] = tileKey.split(',');
            const tileX = Number(rawTileX);
            const tileY = Number(rawTileY);

            return Number.isFinite(tileX) && Number.isFinite(tileY)
              ? [{ tileX, tileY }]
              : [];
          });

          state.lastPickedPebblesCacheKey = pickedSurfaceDecorationsCacheKey;
          state.lastPickedPebblesTileKeys = new Set(pickedSurfaceTileKeys);

          if (newlyPickedSurfaceTileIndices.length > 0) {
            refreshingWorldPlazaFloorChunkGraphicsForTileIndices({
              parentContainer: context.floorLayer,
              chunkSizeTiles: context.performanceProfile.floorChunkSizeTiles,
              chunkGraphicsByKey: state.chunkGraphicsByKey,
              pendingChunkBuilds: state.pendingChunkBuilds,
              tileIndices: newlyPickedSurfaceTileIndices,
              drawOptions: floorDrawOptions,
            });
          }
        } else if (
          pickedSurfaceDecorationsCacheKey !== state.lastPickedPebblesCacheKey
        ) {
          state.lastPickedPebblesCacheKey = pickedSurfaceDecorationsCacheKey;
          state.lastPickedPebblesTileKeys = new Set(pickedSurfaceTileKeys);
        }

        const finishFloorSyncSample = beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_FLOOR
        );
        const floorSyncResult = syncingWorldPlazaVisibleTileChunkGraphicsLayer({
          parentContainer: context.floorLayer,
          bounds: context.floorBounds,
          chunkSizeTiles: context.performanceProfile.floorChunkSizeTiles,
          chunkGraphicsByKey: state.chunkGraphicsByKey,
          pendingChunkBuilds: state.pendingChunkBuilds,
          terrainFrameWorkBudget: context.terrainFrameWorkBudget,
          drawOptions: floorDrawOptions,
          centerTileX: Math.round(context.playerPosition.x),
          centerTileY: Math.round(context.playerPosition.y),
          maxChunkBuildsPerCall:
            context.performanceProfile.floorChunkBuildBudgetPerFrame,
          maxChunkPrunesPerCall:
            context.performanceProfile.floorChunkPruneBudgetPerFrame,
          shouldDeferBuildsOnStaleBacklog: false,
          shouldSortChildrenImmediately: false,
        });
        finishFloorSyncSample();

        if (floorSyncResult.chunksBuilt > 0) {
          incrementingWorldPlazaPerformanceDiagnosticsCounter(
            DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.FLOOR_CHUNKS_BUILT,
            floorSyncResult.chunksBuilt
          );
        }

        return {
          isComplete: floorSyncResult.isComplete,
          needsChildSort: floorSyncResult.needsChildSort,
          builtCount: floorSyncResult.chunksBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaFloorChunksLayerState;

        for (const floorChunkGraphics of state.chunkGraphicsByKey.values()) {
          context.floorLayer.removeChild(floorChunkGraphics);
          floorChunkGraphics.destroy();
        }

        for (const pendingBuild of state.pendingChunkBuilds.values()) {
          context.floorLayer.removeChild(pendingBuild.graphics);
          pendingBuild.graphics.destroy();
        }

        state.chunkGraphicsByKey.clear();
        state.pendingChunkBuilds.clear();
        state.lastBurntGrassCacheKey = '';
        state.lastPickedPebblesCacheKey = '';
        state.lastPickedPebblesTileKeys.clear();
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaFloorChunksLayerState;

        for (const floorChunkGraphics of state.chunkGraphicsByKey.values()) {
          floorChunkGraphics.parent?.removeChild(floorChunkGraphics);
          floorChunkGraphics.destroy();
        }

        for (const pendingBuild of state.pendingChunkBuilds.values()) {
          pendingBuild.graphics.parent?.removeChild(pendingBuild.graphics);
          pendingBuild.graphics.destroy();
        }

        state.chunkGraphicsByKey.clear();
        state.pendingChunkBuilds.clear();
        state.lastBurntGrassCacheKey = '';
        state.lastPickedPebblesCacheKey = '';
        state.lastPickedPebblesTileKeys.clear();
      },
    },
    {
      kind: 'redraw',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOWER_DECORATIONS,
      parentLayer: 'floor',
      boundsProfile: 'floor',
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        // Shared key includes both picked pebbles and picked flowers.
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_PEBBLES,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS,
      ],
      createRuntimeState: (): RunningWorldPlazaFlowerDecorationsLayerState => ({
        graphics: null,
      }),
      ensure: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaFlowerDecorationsLayerState;
        state.graphics = ensuringWorldPlazaVisibleFlowerDecorationLayer(
          context.floorLayer,
          state.graphics
        );
        state.graphics.visible = true;
        return state;
      },
      update: (context, runtimeState, bounds) => {
        const state =
          runtimeState as RunningWorldPlazaFlowerDecorationsLayerState;

        if (!state.graphics) {
          return;
        }

        updatingWorldPlazaVisibleFlowerDecorationLayer({
          graphics: state.graphics,
          bounds,
          burntGrassTileKeys: context.burntGrassTileKeys,
        });
      },
      resetRuntimeState: (_context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaFlowerDecorationsLayerState;
        state.graphics?.clear();
      },
      destroyRuntimeState: (_context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaFlowerDecorationsLayerState;
        state.graphics?.parent?.removeChild(state.graphics);
        state.graphics?.destroy();
        state.graphics = null;
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.LONG_GRASS_DECORATIONS,
      parentLayer: 'floor',
      boundsProfile: 'floor',
      participatesInHeavyIdleSkip: true,
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LONG_GRASS,
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES,
      ],
      requiresTextures: [
        REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.LONG_GRASS_SPRITES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_LONG_GRASS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.LONG_GRASS_TEXTURES_READY,
      ],
      createRuntimeState:
        (): RunningWorldPlazaLongGrassDecorationsLayerState => ({
          spriteByKey: new Map(),
        }),
      sync: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaLongGrassDecorationsLayerState;

        if (!context.floorBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const longGrassSyncResult =
          syncingWorldPlazaVisibleLongGrassDecorationLayer({
            parentContainer: context.floorLayer,
            bounds: context.floorBounds,
            spriteByKey: state.spriteByKey,
            centerTileX: Math.round(context.playerPosition.x),
            centerTileY: Math.round(context.playerPosition.y),
            burntGrassTileKeys: context.burntGrassTileKeys,
            listingCacheKey: [
              context.floorBoundsKey,
              buildingWorldPlazaClearedLongGrassCacheKey(
                context.clearedLongGrassByTileKey
              ),
              buildingWorldPlazaBurntGrassTileKeysCacheKey(
                context.burntGrassTileKeys
              ),
            ].join('|'),
            // Match tree budget so grass sprites stream in instead of hitching.
            maxBuildsPerCall:
              context.performanceProfile.treeBuildBudgetPerFrame,
            shouldSortChildrenImmediately: false,
          });

        for (const grassSprite of state.spriteByKey.values()) {
          if (!context.isFloorRenderLayerEnabled) {
            grassSprite.visible = false;
            continue;
          }

          if (
            !grassSprite.visible &&
            grassSprite.texture.width > 0 &&
            grassSprite.texture.height > 0
          ) {
            grassSprite.visible = true;
          }
        }

        return {
          isComplete: longGrassSyncResult.isComplete,
          needsChildSort: longGrassSyncResult.needsChildSort,
          builtCount: longGrassSyncResult.propsBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaLongGrassDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          context.floorLayer.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaLongGrassDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          sprite.parent?.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.SHRUB_DECORATIONS,
      parentLayer: 'floor',
      boundsProfile: 'floor',
      participatesInHeavyIdleSkip: true,
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SHRUBS,
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES,
      ],
      requiresTextures: [
        REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.SHRUB_SPRITES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_SHRUBS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.SHRUB_TEXTURES_READY,
      ],
      createRuntimeState: (): RunningWorldPlazaShrubDecorationsLayerState => ({
        spriteByKey: new Map(),
      }),
      sync: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaShrubDecorationsLayerState;

        if (!context.floorBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const shrubSyncResult = syncingWorldPlazaVisibleShrubDecorationLayer({
          parentContainer: context.floorLayer,
          bounds: context.floorBounds,
          spriteByKey: state.spriteByKey,
          centerTileX: Math.round(context.playerPosition.x),
          centerTileY: Math.round(context.playerPosition.y),
          burntGrassTileKeys: context.burntGrassTileKeys,
          maxBuildsPerCall:
            context.performanceProfile
              .terrainElevationChunkBuildBudgetPerFrame *
            context.performanceProfile.floorChunkSizeTiles,
          shouldSortChildrenImmediately: false,
        });

        for (const shrubSprite of state.spriteByKey.values()) {
          if (!context.isFloorRenderLayerEnabled) {
            shrubSprite.visible = false;
            continue;
          }

          if (
            !shrubSprite.visible &&
            shrubSprite.texture.width > 0 &&
            shrubSprite.texture.height > 0
          ) {
            shrubSprite.visible = true;
          }
        }

        return {
          isComplete: shrubSyncResult.isComplete,
          needsChildSort: shrubSyncResult.needsChildSort,
          builtCount: shrubSyncResult.propsBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaShrubDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          context.floorLayer.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaShrubDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          sprite.parent?.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.MUSHROOM_DECORATIONS,
      parentLayer: 'floor',
      boundsProfile: 'floor',
      participatesInHeavyIdleSkip: true,
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.MUSHROOMS,
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES,
      ],
      requiresTextures: [
        REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.MUSHROOM_SPRITES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_MUSHROOMS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.SUN_BUCKET,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.DAY_NUMBER,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.MUSHROOM_TEXTURES_READY,
      ],
      createRuntimeState:
        (): RunningWorldPlazaMushroomDecorationsLayerState => ({
          spriteByKey: new Map(),
          candidateCache: {
            cacheKey: '',
            candidates: [],
          },
        }),
      sync: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaMushroomDecorationsLayerState;

        if (!context.floorBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const mushroomSyncResult =
          syncingWorldPlazaVisibleMushroomDecorationLayer({
            parentContainer: context.floorLayer,
            bounds: context.floorBounds,
            spriteByKey: state.spriteByKey,
            burntGrassTileKeys: context.burntGrassTileKeys,
            candidateCache: state.candidateCache,
            maxBuildsPerCall:
              context.performanceProfile
                .terrainElevationChunkBuildBudgetPerFrame *
              context.performanceProfile.floorChunkSizeTiles,
            shouldSortChildrenImmediately: false,
          });

        for (const mushroomSprite of state.spriteByKey.values()) {
          if (!context.isFloorRenderLayerEnabled) {
            mushroomSprite.visible = false;
            continue;
          }

          if (
            !mushroomSprite.visible &&
            mushroomSprite.texture.width > 0 &&
            mushroomSprite.texture.height > 0
          ) {
            mushroomSprite.visible = true;
          }
        }

        return {
          isComplete: mushroomSyncResult.isComplete,
          needsChildSort: mushroomSyncResult.needsChildSort,
          builtCount: mushroomSyncResult.propsBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaMushroomDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          context.floorLayer.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
        state.candidateCache.cacheKey = '';
        state.candidateCache.candidates = [];
      },
      destroyRuntimeState: (_context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaMushroomDecorationsLayerState;

        for (const sprite of state.spriteByKey.values()) {
          sprite.parent?.removeChild(sprite);
          sprite.destroy();
        }

        state.spriteByKey.clear();
        state.candidateCache.cacheKey = '';
        state.candidateCache.candidates = [];
      },
    },
    {
      kind: 'redraw',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.STONE_DECORATIONS,
      parentLayer: 'floor',
      boundsProfile: 'floor',
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_PEBBLES,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.ISLAND_MODE_REVISION,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PROCEDURAL_TREES_AND_ROCKS_REVISION,
      ],
      createRuntimeState: (): RunningWorldPlazaStoneDecorationsLayerState => ({
        graphics: null,
      }),
      ensure: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaStoneDecorationsLayerState;
        state.graphics = ensuringWorldPlazaVisibleStoneDecorationLayer(
          context.floorLayer,
          state.graphics
        );
        state.graphics.visible =
          context.performanceProfile.drawsStoneDecorations;
        return state;
      },
      update: (context, runtimeState, bounds) => {
        const state =
          runtimeState as RunningWorldPlazaStoneDecorationsLayerState;

        if (
          !state.graphics ||
          !context.performanceProfile.drawsStoneDecorations
        ) {
          state.graphics?.clear();
          return;
        }

        updatingWorldPlazaVisibleStoneDecorationLayer({
          graphics: state.graphics,
          bounds,
          burntGrassTileKeys: context.burntGrassTileKeys,
        });
      },
      resetRuntimeState: (_context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaStoneDecorationsLayerState;
        state.graphics?.clear();
      },
      destroyRuntimeState: (_context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaStoneDecorationsLayerState;
        state.graphics?.parent?.removeChild(state.graphics);
        state.graphics?.destroy();
        state.graphics = null;
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.ELEVATION_COLUMNS,
      parentLayer: 'trunk',
      boundsProfile: 'elevation',
      participatesInHeavyIdleSkip: true,
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ELEVATION,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.ELEVATION_BOUNDS,
        // Shared key includes picked flowers; caps skip grass dots on those tiles.
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PICKED_PEBBLES,
      ],
      createRuntimeState: (): RunningWorldPlazaElevationColumnsLayerState => ({
        columnGraphicsByKey: new Map(),
      }),
      sync: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaElevationColumnsLayerState;

        if (!DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED) {
          if (state.columnGraphicsByKey.size > 0) {
            for (const elevationGraphics of state.columnGraphicsByKey.values()) {
              context.trunkLayer.removeChild(elevationGraphics);
              elevationGraphics.destroy();
            }

            state.columnGraphicsByKey.clear();
          }

          return { isComplete: true, needsChildSort: false };
        }

        if (!context.elevationBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const terrainElevationSyncResult =
          syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer({
            parentContainer: context.trunkLayer,
            bounds: context.elevationBounds,
            columnGraphicsByKey: state.columnGraphicsByKey,
            drawOptions: {
              drawsSurfaceDecorations:
                context.performanceProfile.drawsTerrainElevationDecorations,
            },
            centerTileX: Math.round(context.playerPosition.x),
            centerTileY: Math.round(context.playerPosition.y),
            maxVisibleElevationColumns:
              context.performanceProfile.maxVisibleElevationColumns,
            maxColumnBuildsPerCall:
              context.performanceProfile
                .terrainElevationChunkBuildBudgetPerFrame *
              context.performanceProfile.floorChunkSizeTiles,
            shouldSortChildrenImmediately: false,
          });

        for (const elevationGraphics of state.columnGraphicsByKey.values()) {
          elevationGraphics.visible = context.isFloorRenderLayerEnabled;
        }

        if (terrainElevationSyncResult.columnsBuilt > 0) {
          incrementingWorldPlazaPerformanceDiagnosticsCounter(
            DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.ELEVATION_CHUNKS_BUILT,
            terrainElevationSyncResult.columnsBuilt
          );
        }

        return {
          isComplete: terrainElevationSyncResult.isComplete,
          needsChildSort: terrainElevationSyncResult.needsChildSort,
          builtCount: terrainElevationSyncResult.columnsBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaElevationColumnsLayerState;

        for (const elevationGraphics of state.columnGraphicsByKey.values()) {
          context.trunkLayer.removeChild(elevationGraphics);
          elevationGraphics.destroy();
        }

        state.columnGraphicsByKey.clear();
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state =
          runtimeState as RunningWorldPlazaElevationColumnsLayerState;

        for (const elevationGraphics of state.columnGraphicsByKey.values()) {
          elevationGraphics.parent?.removeChild(elevationGraphics);
          elevationGraphics.destroy();
        }

        state.columnGraphicsByKey.clear();
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_TRUNKS,
      parentLayer: 'trunk',
      boundsProfile: 'tree',
      renderLayerToggle: 'trunk',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.TREE_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLACED_TREE_BLOCKS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.CHOPPED_TREES,
      ],
      createRuntimeState: (): RunningWorldPlazaTreeTrunksLayerState => ({
        trunkGraphicsByKey: new Map(),
      }),
      sync: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeTrunksLayerState;

        if (!context.treeBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const finishTrunkSyncSample = beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_TRUNK
        );
        const trunkSyncResult = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
          parentContainer: context.trunkLayer,
          bounds: context.treeBounds,
          trunkGraphicsByKey: state.trunkGraphicsByKey,
          drawEntries: resolvingSharedTreeDrawEntries(context),
          maxVisibleTrees: context.performanceProfile.maxVisibleTrees,
          centerTileX: Math.round(context.playerPosition.x),
          centerTileY: Math.round(context.playerPosition.y),
          placedBlocks: context.scenePlacedBlocks,
          choppedTreeStateByTileKey: context.choppedTreesByTileKey,
          shouldSortChildrenImmediately: false,
          maxTreeBuildsPerCall:
            context.performanceProfile.treeBuildBudgetPerFrame,
          maxTreePrunesPerCall:
            context.performanceProfile.treePruneBudgetPerFrame,
        });
        finishTrunkSyncSample();

        return {
          isComplete: trunkSyncResult.isComplete,
          needsChildSort: trunkSyncResult.needsChildSort,
          builtCount: trunkSyncResult.treesBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeTrunksLayerState;

        for (const trunkGraphics of state.trunkGraphicsByKey.values()) {
          context.trunkLayer.removeChild(trunkGraphics);
          trunkGraphics.destroy();
        }

        state.trunkGraphicsByKey.clear();
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeTrunksLayerState;

        for (const trunkGraphics of state.trunkGraphicsByKey.values()) {
          trunkGraphics.parent?.removeChild(trunkGraphics);
          trunkGraphics.destroy();
        }

        state.trunkGraphicsByKey.clear();
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_SHADOWS,
      parentLayer: 'trunk',
      boundsProfile: 'tree',
      renderLayerToggle: 'trunk',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.TREE_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLACED_TREE_BLOCKS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.CHOPPED_TREES,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.SUN_BUCKET,
      ],
      createRuntimeState: (): RunningWorldPlazaTreeShadowsLayerState => ({
        shadowGraphicsByKey: new Map(),
        lastSunBucketIndex: -1,
      }),
      sync: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeShadowsLayerState;

        if (!context.performanceProfile.drawsTreeShadows) {
          if (state.shadowGraphicsByKey.size > 0) {
            for (const shadowGraphics of state.shadowGraphicsByKey.values()) {
              context.trunkLayer.removeChild(shadowGraphics);
              shadowGraphics.destroy();
            }

            state.shadowGraphicsByKey.clear();
          }

          return { isComplete: true, needsChildSort: false };
        }

        if (!context.treeBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const didSunBucketChange =
          context.sunBucketIndex !== state.lastSunBucketIndex;
        state.lastSunBucketIndex = context.sunBucketIndex;

        const treeShadowSyncResult =
          syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer({
            parentContainer: context.trunkLayer,
            bounds: context.treeBounds,
            shadowGraphicsByKey: state.shadowGraphicsByKey,
            drawEntries: resolvingSharedTreeDrawEntries(context),
            maxVisibleTrees: context.performanceProfile.maxVisibleTrees,
            centerTileX: Math.round(context.playerPosition.x),
            centerTileY: Math.round(context.playerPosition.y),
            placedBlocks: context.scenePlacedBlocks,
            choppedTreeStateByTileKey: context.choppedTreesByTileKey,
            shouldSortChildrenImmediately: false,
            shouldRedrawExistingShadows: didSunBucketChange,
            maxTreeBuildsPerCall:
              context.performanceProfile.treeBuildBudgetPerFrame,
            maxTreePrunesPerCall:
              context.performanceProfile.treePruneBudgetPerFrame,
          });

        return {
          isComplete: treeShadowSyncResult.isComplete,
          needsChildSort: treeShadowSyncResult.needsChildSort,
          builtCount: treeShadowSyncResult.treesBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeShadowsLayerState;

        for (const shadowGraphics of state.shadowGraphicsByKey.values()) {
          context.trunkLayer.removeChild(shadowGraphics);
          shadowGraphics.destroy();
        }

        state.shadowGraphicsByKey.clear();
        state.lastSunBucketIndex = -1;
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeShadowsLayerState;

        for (const shadowGraphics of state.shadowGraphicsByKey.values()) {
          shadowGraphics.parent?.removeChild(shadowGraphics);
          shadowGraphics.destroy();
        }

        state.shadowGraphicsByKey.clear();
        state.lastSunBucketIndex = -1;
      },
    },
    {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_CANOPIES,
      parentLayer: 'canopy',
      boundsProfile: 'tree',
      renderLayerToggle: 'canopy',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.TREE_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLACED_TREE_BLOCKS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.CHOPPED_TREES,
      ],
      createRuntimeState: (): RunningWorldPlazaTreeCanopiesLayerState => ({
        canopyEntriesByKey: new Map(),
      }),
      sync: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeCanopiesLayerState;

        if (!context.treeBounds) {
          return { isComplete: true, needsChildSort: false };
        }

        const finishCanopySyncSample = beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY
        );
        const canopySyncResult = syncingWorldPlazaVisibleTreeCanopyLayer({
          parentContainer: context.canopyLayer,
          bounds: context.treeBounds,
          canopyEntriesByKey: state.canopyEntriesByKey,
          drawEntries: resolvingSharedTreeDrawEntries(context),
          maxVisibleTrees: context.performanceProfile.maxVisibleTrees,
          centerTileX: Math.round(context.playerPosition.x),
          centerTileY: Math.round(context.playerPosition.y),
          placedBlocks: context.scenePlacedBlocks,
          choppedTreeStateByTileKey: context.choppedTreesByTileKey,
          shouldSortChildrenImmediately: false,
          maxTreeBuildsPerCall:
            context.performanceProfile.treeBuildBudgetPerFrame,
          maxTreePrunesPerCall:
            context.performanceProfile.treePruneBudgetPerFrame,
        });
        finishCanopySyncSample();

        return {
          isComplete: canopySyncResult.isComplete,
          needsChildSort: canopySyncResult.needsChildSort,
          builtCount: canopySyncResult.treesBuilt,
        };
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeCanopiesLayerState;

        for (const canopyEntry of state.canopyEntriesByKey.values()) {
          context.canopyLayer.removeChild(canopyEntry.container);
          canopyEntry.container.destroy({ children: true });
        }

        state.canopyEntriesByKey.clear();
      },
      destroyRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaTreeCanopiesLayerState;

        for (const canopyEntry of state.canopyEntriesByKey.values()) {
          canopyEntry.container.parent?.removeChild(canopyEntry.container);
          canopyEntry.container.destroy({ children: true });
        }

        state.canopyEntriesByKey.clear();
      },
    },
    {
      kind: 'redraw',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.WATER_SURFACE,
      parentLayer: 'floor',
      boundsProfile: 'none',
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        ...DEFINING_WORLD_PLAZA_GENERATION_FEATURE_WATER_IDS,
      ],
      invalidateOn: [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.THAW_VISUAL,
      ],
      createRuntimeState: (): RunningWorldPlazaWaterSurfaceLayerState => ({
        graphics: null,
      }),
      ensure: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaWaterSurfaceLayerState;
        state.graphics = ensuringWorldPlazaVisibleWaterSurfaceGraphicsLayer(
          context.floorLayer,
          state.graphics
        );
        state.graphics.visible = true;
        return state;
      },
      update: (context, runtimeState, bounds) => {
        const state = runtimeState as RunningWorldPlazaWaterSurfaceLayerState;

        if (!state.graphics) {
          return;
        }

        updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer({
          surfaceGraphics: state.graphics,
          bounds: resolvingWorldPlazaWaterViewportTileBounds({
            playerGridX: context.playerPosition.x,
            playerGridY: context.playerPosition.y,
            viewportWidthPx: context.viewportWidth,
            viewportHeightPx: context.viewportHeight,
            worldZoom: context.worldZoom,
            viewportPaddingTiles:
              context.performanceProfile.visibleBoundsSnapTiles +
              DEFINING_WORLD_PLAZA_WATER_SURFACE_VIEWPORT_PADDING_TILES,
            floorBounds: bounds,
          }),
        });
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaWaterSurfaceLayerState;
        state.graphics?.clear();
      },
      destroyRuntimeState: (_context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaWaterSurfaceLayerState;
        state.graphics?.clear();
        state.graphics = null;
      },
    },
    {
      kind: 'redraw',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.WATER_SHIMMER,
      parentLayer: 'floor',
      boundsProfile: 'none',
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        ...DEFINING_WORLD_PLAZA_GENERATION_FEATURE_WATER_IDS,
      ],
      invalidateOn: [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS],
      updateEveryNFramesFromProfile: (profile) =>
        profile.waterShimmerUpdateIntervalFrames,
      createRuntimeState: (): RunningWorldPlazaWaterShimmerLayerState => ({
        graphics: null,
      }),
      ensure: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaWaterShimmerLayerState;
        state.graphics = ensuringWorldPlazaVisibleWaterShimmerGraphicsLayer(
          context.floorLayer,
          state.graphics
        );
        state.graphics.visible = true;
        return state;
      },
      update: (context, runtimeState, bounds) => {
        const state = runtimeState as RunningWorldPlazaWaterShimmerLayerState;

        if (!state.graphics) {
          return;
        }

        updatingWorldPlazaVisibleWaterShimmerGraphicsLayer({
          shimmerGraphics: state.graphics,
          bounds: resolvingWorldPlazaWaterShimmerViewportTileBounds({
            playerGridX: context.playerPosition.x,
            playerGridY: context.playerPosition.y,
            viewportWidthPx: context.viewportWidth,
            viewportHeightPx: context.viewportHeight,
            worldZoom: context.worldZoom,
            floorBounds: bounds,
          }),
          animationTimeMs: context.animationTimeMs,
          cameraOffset: context.cameraOffset,
          viewportWidthPx: context.viewportWidth,
          viewportHeightPx: context.viewportHeight,
          worldZoom: context.worldZoom,
          maxAnimatedTileCount:
            context.performanceProfile.waterShimmerMaxAnimatedTiles,
        });
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaWaterShimmerLayerState;
        state.graphics?.clear();
      },
      destroyRuntimeState: (_context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaWaterShimmerLayerState;
        state.graphics?.clear();
        state.graphics = null;
      },
    },
    {
      kind: 'redraw',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.LAVA_OVERLAY,
      parentLayer: 'floor',
      boundsProfile: 'none',
      renderLayerToggle: 'floor',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA,
      ],
      requiresTextures: [
        REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.LAVA_STATIC_TILE,
      ],
      invalidateOn: [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS],
      createRuntimeState: (): RunningWorldPlazaLavaOverlayLayerState => ({
        overlayState: null,
      }),
      ensure: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaLavaOverlayLayerState;
        state.overlayState = ensuringWorldPlazaVisibleLavaOverlayLayer(
          context.floorLayer,
          state.overlayState
        );
        state.overlayState.container.visible = true;
        return state;
      },
      update: (_context, runtimeState, bounds) => {
        const state = runtimeState as RunningWorldPlazaLavaOverlayLayerState;

        if (!state.overlayState) {
          return;
        }

        updatingWorldPlazaVisibleLavaOverlayLayer(state.overlayState, bounds);
      },
      tick: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaLavaOverlayLayerState;

        if (!state.overlayState) {
          return;
        }

        advancingWorldPlazaVisibleLavaOverlayAnimation(
          state.overlayState,
          context.animationTimeMs,
          computingWorldPlazaEmissiveNightBrightnessMultiplierFromSunState(
            computingWorldPlazaDayNightSunState(),
            DEFINING_WORLD_PLAZA_EMISSIVE_LAVA_SPRITE_ALPHA_BOOST_AT_MIDNIGHT
          )
        );
      },
      resetRuntimeState: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaLavaOverlayLayerState;

        if (state.overlayState) {
          clearingWorldPlazaVisibleLavaOverlayGroundSprite(state.overlayState);
          state.overlayState.maskGraphics.clear();
          state.overlayState.crustGraphics.clear();
          state.overlayState.lastOverlaySyncKey = '';
        }

        clearingWorldPlazaLavaPoolLightSources();
      },
      destroyRuntimeState: (_context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaLavaOverlayLayerState;

        if (state.overlayState) {
          clearingWorldPlazaVisibleLavaOverlayGroundSprite(state.overlayState);
          state.overlayState.container.destroy({ children: true });
          state.overlayState = null;
        }

        clearingWorldPlazaLavaPoolLightSources();
      },
    },
    {
      kind: 'per-frame',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.CANOPY_ALPHA,
      parentLayer: 'canopy',
      boundsProfile: 'none',
      renderLayerToggle: 'canopy',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
      ],
      invalidateOn: [],
      createRuntimeState: (): RunningWorldPlazaCanopyAlphaLayerState => ({
        frameCounter: 0,
        lastPlayerTileKey: '',
      }),
      tick: (context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaCanopyAlphaLayerState;
        state.frameCounter += 1;

        if (
          context.playerTileKey === state.lastPlayerTileKey ||
          state.frameCounter %
            context.performanceProfile.canopyAlphaUpdateIntervalFrames !==
            0
        ) {
          return;
        }

        state.lastPlayerTileKey = context.playerTileKey;
        const finishCanopyAlphaSample = beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY_ALPHA
        );
        const canopyState =
          engineHandle.getIncrementalRuntimeState<RunningWorldPlazaTreeCanopiesLayerState>(
            RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_CANOPIES
          );
        // Skip alpha while prune backlog is large; iterating stale canopies
        // burns CPU without helping the visible set.
        const maxVisibleTrees = context.performanceProfile.maxVisibleTrees;
        if (
          canopyState.canopyEntriesByKey.size <=
          Math.ceil(maxVisibleTrees * 1.5)
        ) {
          updatingWorldPlazaVisibleTreeCanopyLayerAlpha(
            canopyState.canopyEntriesByKey,
            context.playerPosition
          );
        }
        finishCanopyAlphaSample();
      },
      resetRuntimeState: (_context, runtimeState) => {
        const state = runtimeState as RunningWorldPlazaCanopyAlphaLayerState;
        state.frameCounter = 0;
        state.lastPlayerTileKey = '';
      },
      destroyRuntimeState: () => {},
    },
    {
      kind: 'per-frame',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_SHAKE,
      parentLayer: 'canopy',
      boundsProfile: 'none',
      renderLayerToggle: 'canopy',
      requiresAnyGenerationFeature: [
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
      ],
      invalidateOn: [],
      createRuntimeState: (): RunningWorldPlazaTreeShakeLayerState => ({}),
      tick: (context) => {
        if (!context.performanceProfile.drawsTreeShake) {
          return;
        }

        const trunkState =
          engineHandle.getIncrementalRuntimeState<RunningWorldPlazaTreeTrunksLayerState>(
            RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_TRUNKS
          );
        const canopyState =
          engineHandle.getIncrementalRuntimeState<RunningWorldPlazaTreeCanopiesLayerState>(
            RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_CANOPIES
          );
        updatingWorldPlazaVisibleTreeShakeOffsets(
          trunkState.trunkGraphicsByKey,
          canopyState.canopyEntriesByKey,
          context.animationTimeMs
        );
      },
      resetRuntimeState: () => {},
      destroyRuntimeState: () => {},
    },
  ];
}

/**
 * Resolves live graphics counts for performance diagnostics gauges.
 */
export function listingWorldPlazaTerrainLayerDiagnosticsCounts(
  engineHandle: RunningWorldPlazaTerrainLayerEngineHandle
): {
  floorChunkCount: number;
  terrainElevationColumnCount: number;
  treeTrunkCount: number;
  treeCanopyCount: number;
} {
  try {
    const floorState =
      engineHandle.getIncrementalRuntimeState<RunningWorldPlazaFloorChunksLayerState>(
        RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOOR_CHUNKS
      );
    const elevationState =
      engineHandle.getIncrementalRuntimeState<RunningWorldPlazaElevationColumnsLayerState>(
        RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.ELEVATION_COLUMNS
      );
    const trunkState =
      engineHandle.getIncrementalRuntimeState<RunningWorldPlazaTreeTrunksLayerState>(
        RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_TRUNKS
      );
    const canopyState =
      engineHandle.getIncrementalRuntimeState<RunningWorldPlazaTreeCanopiesLayerState>(
        RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_CANOPIES
      );

    let terrainElevationColumnCount = 0;

    for (const elevationGraphics of elevationState.columnGraphicsByKey.values()) {
      if (elevationGraphics.parent) {
        terrainElevationColumnCount += 1;
      }
    }

    return {
      floorChunkCount: floorState.chunkGraphicsByKey.size,
      terrainElevationColumnCount,
      treeTrunkCount: trunkState.trunkGraphicsByKey.size,
      treeCanopyCount: canopyState.canopyEntriesByKey.size,
    };
  } catch {
    return {
      floorChunkCount: 0,
      terrainElevationColumnCount: 0,
      treeTrunkCount: 0,
      treeCanopyCount: 0,
    };
  }
}
