import { checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled } from '@/components/world/domains/checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled';
import type { DefiningWorldPlazaPerformanceProfile } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  checkingWorldPlazaTerrainFrameWorkBudgetExpired,
  type ManagingWorldPlazaTerrainFrameWorkBudget,
} from '@/components/world/domains/managingWorldPlazaTerrainFrameWorkBudget';
import {
  creatingWorldPlazaTerrainParentSortRegistry,
  flushingWorldPlazaTerrainParentSortRegistry,
  markingWorldPlazaTerrainParentSortDirty,
} from '@/components/world/domains/managingWorldPlazaTerrainParentSortRegistry';
import {
  checkingWorldPlazaTerrainDependencyKeysChanged,
  DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY,
  type DefiningWorldPlazaTerrainDependencyKeyId,
  type DefiningWorldPlazaTerrainDependencySnapshot,
} from '@/components/world/engine/definingWorldPlazaTerrainDependencyKeys';
import type {
  DefiningWorldPlazaTerrainIncrementalLayerDescriptor,
  DefiningWorldPlazaTerrainLayerDescriptor,
  DefiningWorldPlazaTerrainPerFrameLayerDescriptor,
  DefiningWorldPlazaTerrainRedrawLayerDescriptor,
  RunningWorldPlazaTerrainLayerEngineContext,
} from '@/components/world/engine/definingWorldPlazaTerrainLayerDescriptor';
import {
  REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID,
  type RegisteringWorldPlazaTextureAssetId,
} from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import type { Container } from 'pixi.js';

/**
 * Exhaustive texture gate registry. Adding a manifest asset id requires its
 * readiness dependency here, preventing layers from completing with empty textures.
 */
const RUNNING_WORLD_PLAZA_TERRAIN_TEXTURE_READINESS_DEPENDENCY_BY_ASSET_ID: Record<
  RegisteringWorldPlazaTextureAssetId,
  DefiningWorldPlazaTerrainDependencyKeyId
> = {
  [REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.FIRELANDS_SPRITES]:
    DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FIRELANDS_TEXTURES_READY,
  [REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.LAVA_STATIC_TILE]:
    DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.LAVA_TEXTURES_READY,
  [REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.LONG_GRASS_SPRITES]:
    DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.LONG_GRASS_TEXTURES_READY,
};

/**
 * Generic terrain layer engine runner.
 *
 * @module components/world/engine/runningWorldPlazaTerrainLayerEngine
 */

/** Stable terrain layer ids used for cross-layer invalidation. */
export const RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID = {
  ROCK_COLUMNS: 'rock-columns',
  FIRELANDS_DECORATIONS: 'firelands-decorations',
  FLOOR_CHUNKS: 'floor-chunks',
  FLOWER_DECORATIONS: 'flower-decorations',
  LONG_GRASS_DECORATIONS: 'long-grass-decorations',
  STONE_DECORATIONS: 'stone-decorations',
  ELEVATION_COLUMNS: 'elevation-columns',
  TREE_TRUNKS: 'tree-trunks',
  TREE_SHADOWS: 'tree-shadows',
  TREE_CANOPIES: 'tree-canopies',
  WATER_SURFACE: 'water-surface',
  WATER_SHIMMER: 'water-shimmer',
  LAVA_OVERLAY: 'lava-overlay',
  CANOPY_ALPHA: 'canopy-alpha',
  TREE_SHAKE: 'tree-shake',
} as const;

type RunningWorldPlazaTerrainLayerRuntimeEntry = {
  readonly descriptor: DefiningWorldPlazaTerrainLayerDescriptor;
  runtimeState: unknown;
  isComplete: boolean;
  lastBoundsKey: string;
  lastRedrawBoundsKey: string;
  frameCounter: number;
  wasLayerMissing: boolean;
  lastTreeShadowSyncKey: string;
  lastSunBucketIndex: number;
  /**
   * Tracks the last generation-feature gate result so disabling clears once and
   * re-enabling forces a full resync without scanning every skipped frame.
   */
  generationFeaturesEnabled: boolean | null;
};

/** Handle exposed to layer descriptors for cross-layer coordination. */
export type RunningWorldPlazaTerrainLayerEngineHandle = {
  getIncrementalRuntimeState: <T>(layerId: string) => T;
  markIncrementalLayerIncomplete: (layerId: string) => void;
};

/** Mutable engine state owned across ticks. */
export type RunningWorldPlazaTerrainLayerEngine = {
  readonly handle: RunningWorldPlazaTerrainLayerEngineHandle;
  tick: (input: RunningWorldPlazaTerrainLayerEngineTickInput) => void;
  /** True when every heavy-idle incremental layer finished its current bounds. */
  checkingHeavyLayersFullySynced: () => boolean;
  /**
   * True when spawn floor chunks finished building for the current bounds.
   * Used by the boot overlay; ignores Firelands/rock layers that can stall
   * on textures or cross-layer invalidation.
   */
  checkingSpawnBootFloorChunksReady: () => boolean;
  resetAll: (context: RunningWorldPlazaTerrainLayerEngineContext) => void;
  destroy: (context: RunningWorldPlazaTerrainLayerEngineContext) => void;
};

/** Per-tick inputs resolved by the React shell. */
export type RunningWorldPlazaTerrainLayerEngineTickInput = {
  readonly context: RunningWorldPlazaTerrainLayerEngineContext;
  readonly dependencySnapshot: DefiningWorldPlazaTerrainDependencySnapshot;
  readonly idleHeavySyncKey: string;
  readonly floorBoundsForRedraw: DefiningWorldPlazaVisibleTileBounds | null;
  readonly floorBoundsKeyForRedraw: string;
  readonly terrainFrameWorkBudget?: ManagingWorldPlazaTerrainFrameWorkBudget | null;
};

/**
 * Creates the terrain layer engine for a declarative layer registry.
 */
export function creatingWorldPlazaTerrainLayerEngine(
  layers: readonly DefiningWorldPlazaTerrainLayerDescriptor[]
): RunningWorldPlazaTerrainLayerEngine {
  const layerEntries = new Map<
    string,
    RunningWorldPlazaTerrainLayerRuntimeEntry
  >();

  for (const descriptor of layers) {
    layerEntries.set(descriptor.id, {
      descriptor,
      runtimeState: descriptor.createRuntimeState(),
      isComplete: false,
      lastBoundsKey: '',
      lastRedrawBoundsKey: '',
      frameCounter: 0,
      wasLayerMissing: true,
      lastTreeShadowSyncKey: '',
      lastSunBucketIndex: -1,
      generationFeaturesEnabled: null,
    });
  }

  let previousDependencySnapshot: DefiningWorldPlazaTerrainDependencySnapshot | null =
    null;
  let lastIdleHeavySyncKey = '';
  let wasFloorRenderLayerEnabled = true;
  let wasTrunkRenderLayerEnabled = true;
  let wasCanopyRenderLayerEnabled = true;

  const handle: RunningWorldPlazaTerrainLayerEngineHandle = {
    getIncrementalRuntimeState: <T>(layerId: string): T => {
      const entry = layerEntries.get(layerId);

      if (!entry) {
        throw new Error(`Unknown terrain layer id: ${layerId}`);
      }

      return entry.runtimeState as T;
    },
    markIncrementalLayerIncomplete: (layerId: string): void => {
      const entry = layerEntries.get(layerId);

      if (entry) {
        entry.isComplete = false;
      }
    },
  };

  function ensuringLayerGenerationFeaturesAllowWork(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    entry: RunningWorldPlazaTerrainLayerRuntimeEntry
  ): boolean {
    const isEnabled = checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled(
      entry.descriptor.requiresAnyGenerationFeature
    );

    if (!isEnabled) {
      if (entry.generationFeaturesEnabled !== false) {
        entry.descriptor.resetRuntimeState(context, entry.runtimeState);
        entry.generationFeaturesEnabled = false;
        entry.isComplete = true;
        entry.lastBoundsKey = '';
        entry.lastRedrawBoundsKey = '';
        entry.lastTreeShadowSyncKey = '';
        entry.wasLayerMissing = true;
      }

      return false;
    }

    if (entry.generationFeaturesEnabled === false) {
      entry.isComplete = false;
      entry.lastBoundsKey = '';
      entry.lastRedrawBoundsKey = '';
      entry.lastTreeShadowSyncKey = '';
      entry.wasLayerMissing = true;
    }

    entry.generationFeaturesEnabled = true;
    return true;
  }

  function resolvingParentContainer(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    parentLayer: 'floor' | 'trunk' | 'canopy'
  ): Container {
    if (parentLayer === 'floor') {
      return context.floorLayer;
    }

    if (parentLayer === 'trunk') {
      return context.trunkLayer;
    }

    return context.canopyLayer;
  }

  function checkingLayerRenderToggleEnabled(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    descriptor: DefiningWorldPlazaTerrainLayerDescriptor
  ): boolean {
    if (!descriptor.renderLayerToggle) {
      return true;
    }

    if (descriptor.renderLayerToggle === 'floor') {
      return context.isFloorRenderLayerEnabled;
    }

    if (descriptor.renderLayerToggle === 'trunk') {
      return context.isTrunkRenderLayerEnabled;
    }

    if (descriptor.renderLayerToggle === 'canopy') {
      return context.isCanopyRenderLayerEnabled;
    }

    return true;
  }

  function checkingLayerTexturesReady(
    descriptor: DefiningWorldPlazaTerrainLayerDescriptor,
    dependencySnapshot: DefiningWorldPlazaTerrainDependencySnapshot
  ): boolean {
    if (
      !descriptor.requiresTextures ||
      descriptor.requiresTextures.length === 0
    ) {
      return true;
    }

    for (const textureAssetId of descriptor.requiresTextures) {
      const readinessDependencyKey =
        RUNNING_WORLD_PLAZA_TERRAIN_TEXTURE_READINESS_DEPENDENCY_BY_ASSET_ID[
          textureAssetId
        ];

      if (dependencySnapshot[readinessDependencyKey] !== '1') {
        return false;
      }
    }

    return true;
  }

  function resolvingBoundsForProfile(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    boundsProfile: DefiningWorldPlazaTerrainLayerDescriptor['boundsProfile']
  ): DefiningWorldPlazaVisibleTileBounds | null {
    if (boundsProfile === 'none') {
      return null;
    }

    if (boundsProfile === 'floor') {
      return context.floorBounds;
    }

    if (boundsProfile === 'elevation') {
      return context.elevationBounds;
    }

    return context.treeBounds;
  }

  function resolvingBoundsKeyForProfile(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    boundsProfile: DefiningWorldPlazaTerrainLayerDescriptor['boundsProfile']
  ): string {
    if (boundsProfile === 'floor') {
      return context.floorBoundsKey;
    }

    if (boundsProfile === 'elevation') {
      return context.elevationBoundsKey;
    }

    if (boundsProfile === 'tree') {
      return context.treeBoundsKey;
    }

    return '';
  }

  function checkingShouldSyncIncrementalLayer(
    entry: RunningWorldPlazaTerrainLayerRuntimeEntry,
    descriptor: DefiningWorldPlazaTerrainIncrementalLayerDescriptor,
    dependencySnapshot: DefiningWorldPlazaTerrainDependencySnapshot,
    boundsKey: string
  ): boolean {
    if (descriptor.id === RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_SHADOWS) {
      const treeShadowSyncKey = `${boundsKey}|${dependencySnapshot[DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLACED_TREE_BLOCKS]}|${dependencySnapshot[DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.CHOPPED_TREES]}|${dependencySnapshot[DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.SUN_BUCKET]}`;

      if (treeShadowSyncKey !== entry.lastTreeShadowSyncKey) {
        entry.lastTreeShadowSyncKey = treeShadowSyncKey;
        entry.isComplete = false;
      }

      if (
        checkingWorldPlazaTerrainDependencyKeysChanged(
          dependencySnapshot,
          previousDependencySnapshot,
          descriptor.invalidateOn
        )
      ) {
        entry.isComplete = false;
      }

      return !entry.isComplete;
    }

    if (boundsKey !== entry.lastBoundsKey) {
      entry.lastBoundsKey = boundsKey;
      entry.isComplete = false;
    }

    if (
      checkingWorldPlazaTerrainDependencyKeysChanged(
        dependencySnapshot,
        previousDependencySnapshot,
        descriptor.invalidateOn
      )
    ) {
      entry.isComplete = false;
    }

    return !entry.isComplete;
  }

  function runningIncrementalLayer(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    entry: RunningWorldPlazaTerrainLayerRuntimeEntry,
    descriptor: DefiningWorldPlazaTerrainIncrementalLayerDescriptor,
    dependencySnapshot: DefiningWorldPlazaTerrainDependencySnapshot,
    shouldSortByParent: Map<'floor' | 'trunk' | 'canopy', boolean>,
    terrainFrameWorkBudget: ManagingWorldPlazaTerrainFrameWorkBudget | null
  ): void {
    if (!ensuringLayerGenerationFeaturesAllowWork(context, entry)) {
      return;
    }

    if (
      terrainFrameWorkBudget &&
      checkingWorldPlazaTerrainFrameWorkBudgetExpired(terrainFrameWorkBudget) &&
      // Floor chunk bakes are time-sliced across frames. Always let an
      // incomplete floor sync advance its minimum tile batch, even when rock
      // columns already spent the shared ms budget earlier in the tick.
      !(
        descriptor.id === RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOOR_CHUNKS &&
        !entry.isComplete
      ) &&
      // Tree shadows are tiny ellipse draws; do not let heavy terrain starve them.
      !(
        descriptor.id === RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_SHADOWS &&
        !entry.isComplete
      )
    ) {
      return;
    }
    if (!checkingLayerRenderToggleEnabled(context, descriptor)) {
      return;
    }

    if (!checkingLayerTexturesReady(descriptor, dependencySnapshot)) {
      return;
    }

    const bounds = resolvingBoundsForProfile(context, descriptor.boundsProfile);

    if (!bounds) {
      return;
    }

    const boundsKey = resolvingBoundsKeyForProfile(
      context,
      descriptor.boundsProfile
    );

    if (
      !checkingShouldSyncIncrementalLayer(
        entry,
        descriptor,
        dependencySnapshot,
        boundsKey
      )
    ) {
      return;
    }

    const syncResult = descriptor.sync(context, entry.runtimeState);
    entry.isComplete = syncResult.isComplete;

    if (syncResult.needsChildSort) {
      shouldSortByParent.set(descriptor.parentLayer, true);
    }

    descriptor.onAfterSync?.(context, entry.runtimeState, syncResult);
  }

  function runningRedrawLayer(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    entry: RunningWorldPlazaTerrainLayerRuntimeEntry,
    descriptor: DefiningWorldPlazaTerrainRedrawLayerDescriptor,
    dependencySnapshot: DefiningWorldPlazaTerrainDependencySnapshot,
    previousSnapshot: DefiningWorldPlazaTerrainDependencySnapshot | null,
    bounds: DefiningWorldPlazaVisibleTileBounds | null,
    boundsKey: string,
    shouldSortByParent: Map<'floor' | 'trunk' | 'canopy', boolean>
  ): void {
    if (!ensuringLayerGenerationFeaturesAllowWork(context, entry)) {
      return;
    }

    if (!checkingLayerRenderToggleEnabled(context, descriptor)) {
      const ensuredState = entry.runtimeState as { visible?: boolean };

      if ('graphics' in (entry.runtimeState as object)) {
        const redrawState = entry.runtimeState as {
          graphics?: { visible: boolean };
        };
        if (redrawState.graphics) {
          redrawState.graphics.visible = false;
        }
      }

      if ('overlayState' in (entry.runtimeState as object)) {
        const lavaState = entry.runtimeState as {
          overlayState?: { container: { visible: boolean } } | null;
        };

        if (lavaState.overlayState) {
          lavaState.overlayState.container.visible = false;
        }
      }

      if (ensuredState.visible === false) {
        return;
      }

      return;
    }

    if (!checkingLayerTexturesReady(descriptor, dependencySnapshot)) {
      return;
    }

    if (!bounds) {
      return;
    }

    const wasLayerMissing = entry.wasLayerMissing;
    entry.runtimeState = descriptor.ensure(context, entry.runtimeState);
    entry.wasLayerMissing = false;

    const shouldUpdateBounds =
      wasLayerMissing || boundsKey !== entry.lastRedrawBoundsKey;
    const didDependencyKeysChange =
      descriptor.invalidateOn.length > 0 &&
      checkingWorldPlazaTerrainDependencyKeysChanged(
        dependencySnapshot,
        previousSnapshot,
        descriptor.invalidateOn
      );
    const updateInterval =
      descriptor.updateEveryNFramesFromProfile?.(context.performanceProfile) ??
      descriptor.updateEveryNFrames;
    entry.frameCounter += 1;
    const shouldUpdateOnInterval =
      updateInterval !== undefined &&
      updateInterval > 0 &&
      entry.frameCounter % updateInterval === 0;

    if (shouldUpdateBounds || didDependencyKeysChange) {
      if (shouldUpdateBounds) {
        entry.lastRedrawBoundsKey = boundsKey;
      }

      descriptor.update(context, entry.runtimeState, bounds);

      if (wasLayerMissing) {
        shouldSortByParent.set(descriptor.parentLayer, true);
      }
    } else if (shouldUpdateOnInterval) {
      descriptor.update(context, entry.runtimeState, bounds);
    }

    descriptor.tick?.(context, entry.runtimeState);
  }

  function runningPerFrameLayer(
    context: RunningWorldPlazaTerrainLayerEngineContext,
    entry: RunningWorldPlazaTerrainLayerRuntimeEntry,
    descriptor: DefiningWorldPlazaTerrainPerFrameLayerDescriptor,
    dependencySnapshot: DefiningWorldPlazaTerrainDependencySnapshot
  ): void {
    if (!ensuringLayerGenerationFeaturesAllowWork(context, entry)) {
      return;
    }

    if (!checkingLayerRenderToggleEnabled(context, descriptor)) {
      return;
    }

    if (
      descriptor.invalidateOn.length > 0 &&
      !checkingWorldPlazaTerrainDependencyKeysChanged(
        dependencySnapshot,
        previousDependencySnapshot,
        descriptor.invalidateOn
      ) &&
      descriptor.id !== RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_SHAKE
    ) {
      return;
    }

    descriptor.tick(context, entry.runtimeState);
  }

  function checkingHeavyLayersFullySynced(): boolean {
    for (const entry of layerEntries.values()) {
      const descriptor = entry.descriptor;

      if (
        descriptor.kind !== 'incremental' ||
        !descriptor.participatesInHeavyIdleSkip
      ) {
        continue;
      }

      if (!entry.isComplete) {
        return false;
      }

      if (descriptor.id === RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.ROCK_COLUMNS) {
        const rockState = entry.runtimeState as {
          pendingFloorInvalidationAnchors: unknown[];
        };

        if (rockState.pendingFloorInvalidationAnchors.length > 0) {
          return false;
        }
      }
    }

    return true;
  }

  function checkingSpawnBootFloorChunksReady(): boolean {
    const floorEntry = layerEntries.get(
      RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOOR_CHUNKS
    );

    return floorEntry?.isComplete === true;
  }

  return {
    handle,
    checkingHeavyLayersFullySynced,
    checkingSpawnBootFloorChunksReady,
    tick: (input) => {
      const {
        context,
        dependencySnapshot,
        idleHeavySyncKey,
        floorBoundsForRedraw,
        floorBoundsKeyForRedraw,
        terrainFrameWorkBudget = null,
      } = input;

      context.terrainFrameWorkBudget = terrainFrameWorkBudget;

      const parentSortRegistry = creatingWorldPlazaTerrainParentSortRegistry();

      context.floorLayer.visible = context.isFloorRenderLayerEnabled;
      context.trunkLayer.visible = context.isTrunkRenderLayerEnabled;
      context.canopyLayer.visible = context.isCanopyRenderLayerEnabled;

      if (!wasFloorRenderLayerEnabled && context.isFloorRenderLayerEnabled) {
        for (const entry of layerEntries.values()) {
          if (
            entry.descriptor.kind === 'incremental' &&
            entry.descriptor.participatesInHeavyIdleSkip
          ) {
            entry.isComplete = false;
          }
        }
      }

      if (!wasTrunkRenderLayerEnabled && context.isTrunkRenderLayerEnabled) {
        const trunkEntry = layerEntries.get(
          RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_TRUNKS
        );
        const shadowEntry = layerEntries.get(
          RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_SHADOWS
        );

        if (trunkEntry) {
          trunkEntry.lastBoundsKey = '';
        }

        if (shadowEntry) {
          shadowEntry.lastTreeShadowSyncKey = '';
        }
      }

      if (!wasCanopyRenderLayerEnabled && context.isCanopyRenderLayerEnabled) {
        const canopyEntry = layerEntries.get(
          RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.TREE_CANOPIES
        );

        if (canopyEntry) {
          canopyEntry.lastBoundsKey = '';
        }
      }

      wasFloorRenderLayerEnabled = context.isFloorRenderLayerEnabled;
      wasTrunkRenderLayerEnabled = context.isTrunkRenderLayerEnabled;
      wasCanopyRenderLayerEnabled = context.isCanopyRenderLayerEnabled;

      const canSkipHeavyTerrainLayerSync =
        checkingHeavyLayersFullySynced() &&
        idleHeavySyncKey === lastIdleHeavySyncKey;

      const shouldSortByParent = new Map<
        'floor' | 'trunk' | 'canopy',
        boolean
      >();

      if (!canSkipHeavyTerrainLayerSync) {
        lastIdleHeavySyncKey = idleHeavySyncKey;

        for (const entry of layerEntries.values()) {
          const descriptor = entry.descriptor;

          if (descriptor.kind !== 'incremental') {
            continue;
          }

          if (!descriptor.participatesInHeavyIdleSkip) {
            continue;
          }

          runningIncrementalLayer(
            context,
            entry,
            descriptor,
            dependencySnapshot,
            shouldSortByParent,
            terrainFrameWorkBudget
          );
        }
      }

      for (const entry of layerEntries.values()) {
        const descriptor = entry.descriptor;

        if (
          descriptor.kind === 'incremental' &&
          descriptor.participatesInHeavyIdleSkip
        ) {
          continue;
        }

        if (descriptor.kind === 'incremental') {
          runningIncrementalLayer(
            context,
            entry,
            descriptor,
            dependencySnapshot,
            shouldSortByParent,
            terrainFrameWorkBudget
          );
          continue;
        }

        if (descriptor.kind === 'redraw') {
          runningRedrawLayer(
            context,
            entry,
            descriptor,
            dependencySnapshot,
            previousDependencySnapshot,
            floorBoundsForRedraw,
            floorBoundsKeyForRedraw,
            shouldSortByParent
          );
          continue;
        }

        runningPerFrameLayer(context, entry, descriptor, dependencySnapshot);
      }

      for (const [parentLayer, shouldSort] of shouldSortByParent.entries()) {
        if (!shouldSort) {
          continue;
        }

        markingWorldPlazaTerrainParentSortDirty(
          parentSortRegistry,
          resolvingParentContainer(context, parentLayer)
        );
      }

      flushingWorldPlazaTerrainParentSortRegistry(parentSortRegistry);

      previousDependencySnapshot = dependencySnapshot;
    },
    resetAll: (context) => {
      for (const entry of layerEntries.values()) {
        entry.descriptor.destroyRuntimeState(context, entry.runtimeState);
        entry.runtimeState = entry.descriptor.createRuntimeState();
        entry.isComplete = false;
        entry.lastBoundsKey = '';
        entry.lastRedrawBoundsKey = '';
        entry.frameCounter = 0;
        entry.wasLayerMissing = true;
        entry.lastTreeShadowSyncKey = '';
        entry.lastSunBucketIndex = -1;
      }

      previousDependencySnapshot = null;
      lastIdleHeavySyncKey = '';
    },
    destroy: (context) => {
      for (const entry of layerEntries.values()) {
        entry.descriptor.destroyRuntimeState(context, entry.runtimeState);
      }

      layerEntries.clear();
      previousDependencySnapshot = null;
      lastIdleHeavySyncKey = '';
    },
  };
}

/**
 * Resolves prefetch padding tiles for a bounds profile.
 */
export function resolvingWorldPlazaTerrainBoundsPrefetchTiles(
  performanceProfile: DefiningWorldPlazaPerformanceProfile,
  boundsProfile: DefiningWorldPlazaTerrainLayerDescriptor['boundsProfile']
): number {
  if (boundsProfile === 'tree') {
    return performanceProfile.treePrefetchTiles;
  }

  if (boundsProfile === 'elevation') {
    return performanceProfile.terrainElevationPrefetchTiles;
  }

  if (boundsProfile === 'floor') {
    return performanceProfile.floorChunkPrefetchTiles;
  }

  return 0;
}
