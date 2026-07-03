"use client";

import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { usingWorldPlazaPerformanceProfile } from "@/components/world/components/providingWorldPlazaPerformanceProfile";
import { usingWorldPlazaIslandModeFeatureEnabledState } from "@/components/world/hooks/usingWorldPlazaIslandModeFeatureEnabledState";
import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants";
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from "@/components/world/domains/definingWorldPlazaTerrainElevationConstants";
import { DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY } from "@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants";
import { buildingWorldPlazaVisibleTileBoundsCacheKey } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { DEFINING_WORLD_PLAZA_WATER_SHIMMER_UPDATE_INTERVAL_FRAMES } from "@/components/world/domains/definingWorldPlazaWaterConstants";
import type { InvalidatingWorldPlazaFloorChunkGraphicsTileIndex } from "@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices";
import { invalidatingWorldPlazaFloorChunkGraphicsForTileIndices } from "@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices";
import { listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex } from "@/components/world/domains/listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex";
import {
  beginningWorldPlazaPerformanceSample,
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from "@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics";
import { invalidatingWorldPlazaMiniMapTileFillColorCache } from "@/components/world/domains/resolvingWorldPlazaMiniMapTileFillColor";
import { resolvingWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";
import { invalidatingWorldPlazaTerrainElevationAtTileIndexCache } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { resolvingWorldPlazaVisibleIsometricTileBounds } from "@/components/world/domains/resolvingWorldPlazaVisibleIsometricTileBounds";
import {
  invalidatingWorldPlazaVisibleTerrainElevationTileColumnSyncState,
  syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer,
} from "@/components/world/domains/syncingWorldPlazaVisibleTerrainElevationTileColumnGraphicsLayer";
import { syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer } from "@/components/world/domains/syncingWorldPlazaVisibleTerrainRockColumnGraphicsLayer";
import { syncingWorldPlazaVisibleTileChunkGraphicsLayer } from "@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer";
import {
  syncingWorldPlazaVisibleTreeCanopyLayer,
  updatingWorldPlazaVisibleTreeCanopyLayerAlpha,
  type SyncingWorldPlazaVisibleTreeCanopyLayerEntry,
} from "@/components/world/domains/syncingWorldPlazaVisibleTreeCanopyLayer";
import { syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer } from "@/components/world/domains/syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer";
import { syncingWorldPlazaVisibleTreeTrunkGraphicsLayer } from "@/components/world/domains/syncingWorldPlazaVisibleTreeTrunkGraphicsLayer";
import {
  ensuringWorldPlazaVisibleWaterShimmerGraphicsLayer,
  updatingWorldPlazaVisibleWaterShimmerGraphicsLayer,
} from "@/components/world/domains/syncingWorldPlazaVisibleWaterShimmerGraphicsLayer";
import {
  ensuringWorldPlazaVisibleWaterSurfaceGraphicsLayer,
  updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer,
} from "@/components/world/domains/syncingWorldPlazaVisibleWaterSurfaceGraphicsLayer";
import { useApplication, useTick } from "@pixi/react";
import type { Container, Graphics } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";

/**
 * Builds a cache key for placed tree blocks so tree layers resync on placement.
 *
 * @param placedBlocks - Placed blocks visible in the scene.
 */
function buildingWorldPlazaPlacedTreeBlocksCacheKey(
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
): string {
  return placedBlocks
    .filter((block) =>
      checkingWorldBuildingBlockDefinitionIdIsNaturalTree(block.definitionId),
    )
    .map((block) => {
      const growthStage =
        block.metadata[DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY];

      return `${block.blockId}:${typeof growthStage === "number" ? growthStage : 0}:${block.worldLayer}`;
    })
    .sort()
    .join("|");
}

export interface RenderingWorldPlazaProceduralTerrainSyncProps {
  /** Player position in grid space; drives visible tile windows. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Player-placed blocks near the avatar; drives placed trees and surface layer. */
  placedBlocksRef?: React.RefObject<DefiningWorldBuildingPlacedBlock[]>;
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
  placedBlocksRef,
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
    new Map(),
  );
  const trunkGraphicsByKeyRef = useRef<Map<string, Graphics>>(new Map());
  const treeShadowGraphicsByKeyRef = useRef<Map<string, Graphics>>(new Map());
  const canopyEntriesByKeyRef = useRef<
    Map<string, SyncingWorldPlazaVisibleTreeCanopyLayerEntry>
  >(new Map());
  const lastFloorBoundsKeyRef = useRef("");
  const isFloorSyncCompleteRef = useRef(false);
  const lastTerrainElevationBoundsKeyRef = useRef("");
  const isTerrainElevationSyncCompleteRef = useRef(false);
  const isTerrainRockSyncCompleteRef = useRef(false);
  const lastTerrainRockBoundsKeyRef = useRef("");
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
  const lastTrunkBoundsKeyRef = useRef("");
  const lastCanopyBoundsKeyRef = useRef("");
  const lastPlacedTreeBlocksKeyRef = useRef("");
  const lastViewportSizeRef = useRef({ width: 0, height: 0 });
  const wasFloorRenderLayerEnabledRef = useRef(true);
  const wasTrunkRenderLayerEnabledRef = useRef(true);
  const wasCanopyRenderLayerEnabledRef = useRef(true);
  const canopyAlphaFrameCounterRef = useRef(0);
  const waterShimmerFrameCounterRef = useRef(0);
  const waterShimmerGraphicsRef = useRef<Graphics | null>(null);
  const waterSurfaceGraphicsRef = useRef<Graphics | null>(null);
  const lastWaterSurfaceBoundsKeyRef = useRef("");
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
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_SYNC,
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
      lastFloorBoundsKeyRef.current = "";
      isFloorSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";
      isTerrainRockSyncCompleteRef.current = false;
      lastTrunkBoundsKeyRef.current = "";
      lastCanopyBoundsKeyRef.current = "";
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
      lastFloorBoundsKeyRef.current = "";
      hasInvalidatedFloorChunksForElevationRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeGroundFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const trunkGraphics of trunkGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(trunkGraphics);
        trunkGraphics.destroy();
      }

      trunkGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = "";

      for (const canopyEntry of canopyEntriesByKeyRef.current.values()) {
        canopyLayer.removeChild(canopyEntry.container);
        canopyEntry.container.destroy({ children: true });
      }

      canopyEntriesByKeyRef.current.clear();
      lastCanopyBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeGroundFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForElevationAlignmentFixRef.current) {
      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

      for (const trunkGraphics of trunkGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(trunkGraphics);
        trunkGraphics.destroy();
      }

      trunkGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = "";

      for (const canopyEntry of canopyEntriesByKeyRef.current.values()) {
        canopyLayer.removeChild(canopyEntry.container);
        canopyEntry.container.destroy({ children: true });
      }

      canopyEntriesByKeyRef.current.clear();
      lastCanopyBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForElevationAlignmentFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeTrunkDepthSortFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const trunkGraphics of trunkGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(trunkGraphics);
        trunkGraphics.destroy();
      }

      trunkGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = "";

      for (const canopyEntry of canopyEntriesByKeyRef.current.values()) {
        canopyLayer.removeChild(canopyEntry.container);
        canopyEntry.container.destroy({ children: true });
      }

      canopyEntriesByKeyRef.current.clear();
      lastCanopyBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeTrunkDepthSortFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeGroundColorFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeGroundColorFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeTileSideFacesFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeTileSideFacesFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeTileSideColorFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeTileSideColorFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBackFacingCliffEdgeFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForBackFacingCliffEdgeFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffVerticalEdgeRemovalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffVerticalEdgeRemovalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCornerVerticalEdgeFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffCornerVerticalEdgeFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffRunContinuationFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffRunContinuationFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCornerOnlyVerticalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffCornerOnlyVerticalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCapRimInteriorSkipFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffCapRimInteriorSkipFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffCapRimRestoreFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffCapRimRestoreFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffPeakCornerVerticalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffPeakCornerVerticalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffFrontCornerVerticalFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffFrontCornerVerticalFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForCliffFullTopRimOutlineFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForCliffFullTopRimOutlineFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowDiamondFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeShadowDiamondFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowCircleFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeShadowCircleFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowLayerFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      for (const shadowGraphics of treeShadowGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(shadowGraphics);
        shadowGraphics.destroy();
      }

      treeShadowGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeShadowLayerFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForTreeShadowRaisedZIndexFixRef.current) {
      for (const shadowGraphics of treeShadowGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(shadowGraphics);
        shadowGraphics.destroy();
      }

      treeShadowGraphicsByKeyRef.current.clear();
      lastTrunkBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForTreeShadowRaisedZIndexFixRef.current = true;
    }

    if (!hasInvalidatedFloorChunksForColumnRockNeighborHoleFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        trunkLayer.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

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
      lastFloorBoundsKeyRef.current = "";

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

      hasInvalidatedFloorChunksForColumnRockOneBlockRadiusOcclusionFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForColumnRockSpacingFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

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
      lastTerrainRockBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForColumnRockSingleChunkShapeFixRef.current = true;
    }

    if (!hasInvalidatedFloorChunksForColumnRockGrassRestoreFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

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
      lastFloorBoundsKeyRef.current = "";

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForColumnRockMegaBoulderScaleFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForColumnRockTreeFootprintFixRef.current) {
      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForColumnRockTreeFootprintFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForRockyBiomeFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      for (const rockGraphics of terrainRockColumnGraphicsByKeyRef.current.values()) {
        rockGraphics.parent?.removeChild(rockGraphics);
        rockGraphics.destroy();
      }

      terrainRockColumnGraphicsByKeyRef.current.clear();
      isTerrainRockSyncCompleteRef.current = false;
      lastTerrainRockBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForRockyBiomeFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBiomeAltitudeFactorFixRef.current) {
      for (const floorChunkGraphics of floorChunkGraphicsByKeyRef.current.values()) {
        floorLayer.removeChild(floorChunkGraphics);
        floorChunkGraphics.destroy();
      }

      floorChunkGraphicsByKeyRef.current.clear();
      isFloorSyncCompleteRef.current = false;
      lastFloorBoundsKeyRef.current = "";

      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForBiomeAltitudeFactorFixRef.current = true;
    }

    if (!hasInvalidatedTerrainLayersForBiomeAltitudeScalingFixRef.current) {
      for (const elevationGraphics of terrainElevationTileColumnGraphicsByKeyRef.current.values()) {
        elevationGraphics.parent?.removeChild(elevationGraphics);
        elevationGraphics.destroy();
      }

      terrainElevationTileColumnGraphicsByKeyRef.current.clear();
      isTerrainElevationSyncCompleteRef.current = false;
      lastTerrainElevationBoundsKeyRef.current = "";

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
      lastTerrainElevationBoundsKeyRef.current = "";

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
      lastTerrainElevationBoundsKeyRef.current = "";

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
      lastTerrainElevationBoundsKeyRef.current = "";

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
      lastTerrainElevationBoundsKeyRef.current = "";

      hasInvalidatedTerrainLayersForElevationTileColumnDepthFixRef.current = true;
    }

    const isFloorRenderLayerEnabled =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.FLOOR_TILES,
      );
    const isTrunkRenderLayerEnabled =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_TRUNKS,
      );
    const isCanopyRenderLayerEnabled =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_CANOPIES,
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
      lastTrunkBoundsKeyRef.current = "";
    }

    if (!wasCanopyRenderLayerEnabledRef.current && isCanopyRenderLayerEnabled) {
      lastCanopyBoundsKeyRef.current = "";
    }

    wasFloorRenderLayerEnabledRef.current = isFloorRenderLayerEnabled;
    wasTrunkRenderLayerEnabledRef.current = isTrunkRenderLayerEnabled;
    wasCanopyRenderLayerEnabledRef.current = isCanopyRenderLayerEnabled;

    const floorBounds = isFloorRenderLayerEnabled
      ? resolvingWorldPlazaVisibleIsometricTileBounds(
          playerPosition.x,
          playerPosition.y,
          viewportSize.width,
          viewportSize.height,
          performanceProfile.viewportPaddingTiles +
            performanceProfile.floorChunkPrefetchTiles,
          performanceProfile.visibleBoundsSnapTiles,
        )
      : null;
    const floorBoundsKey = floorBounds
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
        )
      : null;
    const elevationBoundsKey = elevationBounds
      ? buildingWorldPlazaVisibleTileBoundsCacheKey(elevationBounds)
      : lastTerrainElevationBoundsKeyRef.current;

    if (floorBounds && floorBoundsKey !== lastFloorBoundsKeyRef.current) {
      lastFloorBoundsKeyRef.current = floorBoundsKey;
      isFloorSyncCompleteRef.current = false;
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.FLOOR_BOUNDS_CROSSING,
      );
    }

    let shouldSortFloorLayer = false;
    let shouldSortTrunkLayer = false;
    let shouldSortCanopyLayer = false;

    if (floorBounds && floorBoundsKey !== lastTerrainRockBoundsKeyRef.current) {
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
          pendingRockFloorInvalidationAnchorsRef.current.flatMap((anchorTile) =>
            listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex(
              anchorTile.tileX,
              anchorTile.tileY,
            ),
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
      const finishFloorSyncSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_FLOOR,
      );
      const floorSyncResult = syncingWorldPlazaVisibleTileChunkGraphicsLayer({
        parentContainer: floorLayer,
        bounds: floorBounds,
        chunkSizeTiles: performanceProfile.floorChunkSizeTiles,
        chunkGraphicsByKey: floorChunkGraphicsByKeyRef.current,
        drawOptions: {
          drawsGrassDecorations: performanceProfile.drawsGrassDecorations,
          drawsStoneDecorations: performanceProfile.drawsStoneDecorations,
        },
        centerTileX: Math.round(playerPosition.x),
        centerTileY: Math.round(playerPosition.y),
        maxChunkBuildsPerCall: performanceProfile.floorChunkBuildBudgetPerFrame,
        shouldSortChildrenImmediately: false,
      });
      finishFloorSyncSample();
      isFloorSyncCompleteRef.current = floorSyncResult.isComplete;
      shouldSortFloorLayer = floorSyncResult.needsChildSort;

      if (floorSyncResult.chunksBuilt > 0) {
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.FLOOR_CHUNKS_BUILT,
          floorSyncResult.chunksBuilt,
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
    } else if (elevationBounds && !isTerrainElevationSyncCompleteRef.current) {
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
          terrainElevationSyncResult.columnsBuilt,
        );
      }
    }

    // Trunks and canopies share one bounds window and one nearest-to-player cap
    // so both layers always select the identical set of trees. Separate windows
    // or scan-order caps let dense areas keep different subsets, which strands
    // trunks without canopies (and vice versa).
    const treePaddingExtraTiles = Math.max(
      performanceProfile.treeTrunkPaddingExtraTiles,
      performanceProfile.treeCanopyPaddingExtraTiles,
    );
    const shouldComputeTreeBounds =
      isTrunkRenderLayerEnabled || isCanopyRenderLayerEnabled;
    const treeBounds = shouldComputeTreeBounds
      ? resolvingWorldPlazaVisibleIsometricTileBounds(
          playerPosition.x,
          playerPosition.y,
          viewportSize.width,
          viewportSize.height,
          performanceProfile.viewportPaddingTiles + treePaddingExtraTiles,
          performanceProfile.visibleBoundsSnapTiles,
        )
      : null;
    const treeBoundsKey = treeBounds
      ? buildingWorldPlazaVisibleTileBoundsCacheKey(treeBounds)
      : "";
    const treeCenterTileX = Math.round(playerPosition.x);
    const treeCenterTileY = Math.round(playerPosition.y);
    const scenePlacedBlocks = placedBlocksRef?.current ?? [];
    const placedTreeBlocksKey =
      buildingWorldPlazaPlacedTreeBlocksCacheKey(scenePlacedBlocks);
    const shouldSyncTreeTrunks =
      isTrunkRenderLayerEnabled &&
      treeBounds &&
      (treeBoundsKey !== lastTrunkBoundsKeyRef.current ||
        placedTreeBlocksKey !== lastPlacedTreeBlocksKeyRef.current);
    const shouldSyncTreeCanopies =
      isCanopyRenderLayerEnabled &&
      treeBounds &&
      (treeBoundsKey !== lastCanopyBoundsKeyRef.current ||
        placedTreeBlocksKey !== lastPlacedTreeBlocksKeyRef.current);

    if (shouldSyncTreeTrunks) {
      lastTrunkBoundsKeyRef.current = treeBoundsKey;
      lastPlacedTreeBlocksKeyRef.current = placedTreeBlocksKey;
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.TRUNK_BOUNDS_CROSSING,
      );
      const finishTrunkSyncSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_TRUNK,
      );
      const trunkSyncResult = syncingWorldPlazaVisibleTreeTrunkGraphicsLayer({
        parentContainer: trunkLayer,
        bounds: treeBounds,
        trunkGraphicsByKey: trunkGraphicsByKeyRef.current,
        maxVisibleTrees: performanceProfile.maxVisibleTrees,
        centerTileX: treeCenterTileX,
        centerTileY: treeCenterTileY,
        placedBlocks: scenePlacedBlocks,
        shouldSortChildrenImmediately: false,
      });
      const treeShadowSyncResult =
        syncingWorldPlazaVisibleTreeGroundShadowGraphicsLayer({
          parentContainer: trunkLayer,
          bounds: treeBounds,
          shadowGraphicsByKey: treeShadowGraphicsByKeyRef.current,
          maxVisibleTrees: performanceProfile.maxVisibleTrees,
          centerTileX: treeCenterTileX,
          centerTileY: treeCenterTileY,
          placedBlocks: scenePlacedBlocks,
          shouldSortChildrenImmediately: false,
        });
      shouldSortTrunkLayer =
        trunkSyncResult.needsChildSort || treeShadowSyncResult.needsChildSort;
      finishTrunkSyncSample();
    }

    if (shouldSyncTreeCanopies) {
      lastCanopyBoundsKeyRef.current = treeBoundsKey;
      lastPlacedTreeBlocksKeyRef.current = placedTreeBlocksKey;
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.CANOPY_BOUNDS_CROSSING,
      );
      const finishCanopySyncSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY,
      );
      const canopySyncResult = syncingWorldPlazaVisibleTreeCanopyLayer({
        parentContainer: canopyLayer,
        bounds: treeBounds,
        canopyEntriesByKey: canopyEntriesByKeyRef.current,
        maxVisibleTrees: performanceProfile.maxVisibleTrees,
        centerTileX: treeCenterTileX,
        centerTileY: treeCenterTileY,
        placedBlocks: scenePlacedBlocks,
        shouldSortChildrenImmediately: false,
      });
      shouldSortCanopyLayer = canopySyncResult.needsChildSort;
      finishCanopySyncSample();
    }

    if (shouldSortFloorLayer && floorLayer.sortableChildren) {
      floorLayer.sortChildren();
    }

    if (trunkLayer.sortableChildren) {
      trunkLayer.sortChildren();
    }

    if (shouldSortCanopyLayer && canopyLayer.sortableChildren) {
      canopyLayer.sortChildren();
    }

    if (isFloorRenderLayerEnabled && floorBounds) {
      const wasWaterSurfaceLayerMissing =
        waterSurfaceGraphicsRef.current === null;
      waterSurfaceGraphicsRef.current =
        ensuringWorldPlazaVisibleWaterSurfaceGraphicsLayer(
          floorLayer,
          waterSurfaceGraphicsRef.current,
        );
      waterSurfaceGraphicsRef.current.visible = true;

      if (
        wasWaterSurfaceLayerMissing ||
        floorBoundsKey !== lastWaterSurfaceBoundsKeyRef.current
      ) {
        lastWaterSurfaceBoundsKeyRef.current = floorBoundsKey;
        updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer({
          surfaceGraphics: waterSurfaceGraphicsRef.current,
          bounds: floorBounds,
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
      floorBounds &&
      waterShimmerFrameCounterRef.current %
        DEFINING_WORLD_PLAZA_WATER_SHIMMER_UPDATE_INTERVAL_FRAMES ===
        0
    ) {
      waterShimmerGraphicsRef.current =
        ensuringWorldPlazaVisibleWaterShimmerGraphicsLayer(
          floorLayer,
          waterShimmerGraphicsRef.current,
        );
      waterShimmerGraphicsRef.current.visible = true;
      updatingWorldPlazaVisibleWaterShimmerGraphicsLayer({
        shimmerGraphics: waterShimmerGraphicsRef.current,
        bounds: floorBounds,
        animationTimeMs: performance.now(),
      });
    } else if (waterShimmerGraphicsRef.current) {
      waterShimmerGraphicsRef.current.visible = isFloorRenderLayerEnabled;
    }

    canopyAlphaFrameCounterRef.current += 1;

    if (
      isCanopyRenderLayerEnabled &&
      canopyAlphaFrameCounterRef.current %
        performanceProfile.canopyAlphaUpdateIntervalFrames ===
        0
    ) {
      const finishCanopyAlphaSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY_ALPHA,
      );
      updatingWorldPlazaVisibleTreeCanopyLayerAlpha(
        canopyEntriesByKeyRef.current,
        playerPosition,
      );
      finishCanopyAlphaSample();
    }

    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.FLOOR_CHUNK_COUNT,
      floorChunkGraphicsByKeyRef.current.size,
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TERRAIN_ELEVATION_COLUMN_COUNT,
      terrainElevationTileColumnGraphicsByKeyRef.current.size,
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TREE_TRUNK_COUNT,
      trunkGraphicsByKeyRef.current.size,
    );
    settingWorldPlazaPerformanceDiagnosticsGauge(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.TREE_CANOPY_COUNT,
      canopyEntriesByKeyRef.current.size,
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
    lastFloorBoundsKeyRef.current = "";
    isFloorSyncCompleteRef.current = false;
    lastTerrainElevationBoundsKeyRef.current = "";
    isTerrainElevationSyncCompleteRef.current = false;
    lastTerrainRockBoundsKeyRef.current = "";
    isTerrainRockSyncCompleteRef.current = false;
    lastTrunkBoundsKeyRef.current = "";
    lastCanopyBoundsKeyRef.current = "";
    lastPlacedTreeBlocksKeyRef.current = "";
    lastWaterSurfaceBoundsKeyRef.current = "";
    waterSurfaceGraphicsRef.current?.clear();
    waterShimmerGraphicsRef.current?.clear();
  }, [canopyLayerRef, floorLayerRef, islandModeRevision, trunkLayerRef]);

  useTick(() => {
    syncingProceduralTerrainLayers();
  });

  return null;
}
