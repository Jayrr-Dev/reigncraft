import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPerformanceProfile } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import type { DefiningWorldPlazaTerrainDependencyKeyId } from '@/components/world/engine/definingWorldPlazaTerrainDependencyKeys';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import type { Container } from 'pixi.js';
import type { RefObject } from 'react';

/**
 * Declarative terrain layer descriptors consumed by the terrain layer engine.
 *
 * @module components/world/engine/definingWorldPlazaTerrainLayerDescriptor
 */

/** Parent Pixi container a terrain layer attaches to. */
export type DefiningWorldPlazaTerrainParentLayerId =
  | 'floor'
  | 'trunk'
  | 'canopy';

/** Bounds profile used to resolve visible tile windows. */
export type DefiningWorldPlazaTerrainBoundsProfileId =
  | 'floor'
  | 'elevation'
  | 'tree'
  | 'none';

/** Shared tick context passed to every layer descriptor. */
export type RunningWorldPlazaTerrainLayerEngineContext = {
  readonly performanceProfile: DefiningWorldPlazaPerformanceProfile;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly worldZoom: number;
  readonly floorLayer: Container;
  readonly trunkLayer: Container;
  readonly canopyLayer: Container;
  readonly scenePlacedBlocks: DefiningWorldBuildingPlacedBlock[];
  readonly choppedTreesByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >;
  readonly pickedPebblesByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >;
  readonly burntGrassTileKeys: ReadonlySet<string> | undefined;
  readonly isFloorRenderLayerEnabled: boolean;
  readonly isTrunkRenderLayerEnabled: boolean;
  readonly isCanopyRenderLayerEnabled: boolean;
  readonly floorBounds: DefiningWorldPlazaVisibleTileBounds | null;
  readonly elevationBounds: DefiningWorldPlazaVisibleTileBounds | null;
  readonly treeBounds: DefiningWorldPlazaVisibleTileBounds | null;
  readonly floorBoundsKey: string;
  readonly elevationBoundsKey: string;
  readonly treeBoundsKey: string;
  readonly sunBucketIndex: number;
  readonly animationTimeMs: number;
  readonly playerTileKey: string;
};

/** Input refs the React shell resolves into a tick context. */
export type RunningWorldPlazaTerrainLayerEngineInputRefs = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly cameraWorldZoomRef: RefObject<number>;
  readonly placedBlocksRef?: RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  readonly burntGrassTileKeysRef?: RefObject<ReadonlySet<string>>;
  readonly choppedTreesByTileKeyRef?: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaChoppedTreeTileState>
  >;
  readonly pickedPebblesByTileKeyRef?: RefObject<
    ReadonlyMap<string, DefiningWorldPlazaPickedPebbleTileState>
  >;
  readonly floorLayerRef: RefObject<Container | null>;
  readonly trunkLayerRef: RefObject<Container | null>;
  readonly canopyLayerRef: RefObject<Container | null>;
};

/** Result from an incremental layer sync call. */
export type RunningWorldPlazaTerrainIncrementalLayerSyncResult = {
  readonly isComplete: boolean;
  readonly needsChildSort: boolean;
  readonly builtCount?: number;
};

/** Shared fields on every terrain layer descriptor. */
type DefiningWorldPlazaTerrainLayerDescriptorBase = {
  readonly id: string;
  readonly parentLayer: DefiningWorldPlazaTerrainParentLayerId;
  readonly boundsProfile: DefiningWorldPlazaTerrainBoundsProfileId;
  readonly invalidateOn: readonly DefiningWorldPlazaTerrainDependencyKeyId[];
  readonly renderLayerToggle?:
    | DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId
    | 'floor'
    | 'trunk'
    | 'canopy';
  readonly requiresTextures?: readonly string[];
  /** When true, the layer is skipped while the idle heavy-sync fast path is active. */
  readonly participatesInHeavyIdleSkip?: boolean;
};

/** Incremental keyed sync layer (chunks, columns, sprites, trees). */
export type DefiningWorldPlazaTerrainIncrementalLayerDescriptor =
  DefiningWorldPlazaTerrainLayerDescriptorBase & {
    readonly kind: 'incremental';
    readonly sync: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => RunningWorldPlazaTerrainIncrementalLayerSyncResult;
    readonly createRuntimeState: () => unknown;
    readonly resetRuntimeState: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
    readonly destroyRuntimeState: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
    readonly onAfterSync?: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown,
      syncResult: RunningWorldPlazaTerrainIncrementalLayerSyncResult
    ) => void;
  };

/** Full redraw layer (water, shimmer, lava overlay). */
export type DefiningWorldPlazaTerrainRedrawLayerDescriptor =
  DefiningWorldPlazaTerrainLayerDescriptorBase & {
    readonly kind: 'redraw';
    readonly createRuntimeState: () => unknown;
    readonly ensure: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => unknown;
    readonly update: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown,
      bounds: DefiningWorldPlazaVisibleTileBounds
    ) => void;
    readonly updateEveryNFrames?: number;
    readonly tick?: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
    readonly resetRuntimeState: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
    readonly destroyRuntimeState: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
  };

/** Per-frame layer (canopy alpha, tree shake). */
export type DefiningWorldPlazaTerrainPerFrameLayerDescriptor =
  DefiningWorldPlazaTerrainLayerDescriptorBase & {
    readonly kind: 'per-frame';
    readonly createRuntimeState: () => unknown;
    readonly tick: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
    readonly resetRuntimeState: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
    readonly destroyRuntimeState: (
      context: RunningWorldPlazaTerrainLayerEngineContext,
      runtimeState: unknown
    ) => void;
  };

/** One declarative terrain layer definition. */
export type DefiningWorldPlazaTerrainLayerDescriptor =
  | DefiningWorldPlazaTerrainIncrementalLayerDescriptor
  | DefiningWorldPlazaTerrainRedrawLayerDescriptor
  | DefiningWorldPlazaTerrainPerFrameLayerDescriptor;
