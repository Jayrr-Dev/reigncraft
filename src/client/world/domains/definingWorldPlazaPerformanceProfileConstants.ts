/**
 * Adaptive performance tiers for the plaza Pixi scene.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceProfileConstants
 */

/** Full quality for recent desktops and tablets. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH = "high" as const;

/** Balanced defaults for mid-range hardware. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM = "medium" as const;

/** Reduced effects for low-end or battery-constrained devices. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW = "low" as const;

/** Supported automatic performance tiers. */
export type DefiningWorldPlazaPerformanceTier =
  | typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH
  | typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM
  | typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW;

/** Runtime tuning bundle selected once per plaza session. */
export interface DefiningWorldPlazaPerformanceProfile {
  readonly tier: DefiningWorldPlazaPerformanceTier;
  readonly renderResolutionMax: number;
  readonly antialias: boolean;
  readonly viewportPaddingTiles: number;
  /**
   * Extra off-screen tile ring so tall canopies stay cached until they scroll away.
   *
   * Must exceed {@link visibleBoundsSnapTiles} plus the tallest procedural tree
   * crown overhang in grid units; otherwise bounds snap drops trees while foliage
   * is still on screen.
   */
  readonly treePrefetchTiles: number;
  readonly maxVisibleTrees: number;
  readonly floorChunkSizeTiles: number;
  /** Extra off-screen tile ring so floor chunks build before they scroll in. */
  readonly floorChunkPrefetchTiles: number;
  /**
   * Extra off-screen tile ring for elevation columns.
   *
   * Elevation uses one Pixi Graphics per raised tile on the sorted entity
   * layer, and culled columns still participate in the per-frame avatar sort.
   * So this ring stays far tighter than the batched floor prefetch to cap how
   * many column objects exist (and must be sorted) at once.
   */
  readonly terrainElevationPrefetchTiles: number;
  /** Max new floor chunks built per frame; spreads load to avoid hitches. */
  readonly floorChunkBuildBudgetPerFrame: number;
  /** Max new elevation chunks built per frame (batched raised terrain). */
  readonly terrainElevationChunkBuildBudgetPerFrame: number;
  /** When false, hill tops skip flowers and specks for faster chunk builds. */
  readonly drawsTerrainElevationDecorations: boolean;
  /** Visible bounds center snaps to this tile grid so sync does not run every step. */
  readonly visibleBoundsSnapTiles: number;
  readonly drawsGrassDecorations: boolean;
  readonly drawsStoneDecorations: boolean;
  readonly canopyAlphaUpdateIntervalFrames: number;
  readonly minimapIdleRedrawIntervalMs: number;
  /** Terrain tiles are rebuilt on this snap grid; overlay pans every frame. */
  readonly minimapTerrainSnapTiles: number;
  /** Optional override for minimap visible tile radius. */
  readonly minimapViewRadiusTiles?: number;
  readonly isMinimapEnabled: boolean;
}

/** High tier profile. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH: DefiningWorldPlazaPerformanceProfile =
  {
    tier: DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH,
    renderResolutionMax: 2,
    antialias: true,
    viewportPaddingTiles: 2,
    treePrefetchTiles: 16,
    maxVisibleTrees: 220,
    floorChunkSizeTiles: 8,
    floorChunkPrefetchTiles: 24,
    terrainElevationPrefetchTiles: 4,
    floorChunkBuildBudgetPerFrame: 2,
    terrainElevationChunkBuildBudgetPerFrame: 2,
    drawsTerrainElevationDecorations: true,
    visibleBoundsSnapTiles: 8,
    drawsGrassDecorations: true,
    drawsStoneDecorations: true,
    canopyAlphaUpdateIntervalFrames: 1,
    minimapIdleRedrawIntervalMs: 400,
    minimapTerrainSnapTiles: 8,
    isMinimapEnabled: true,
  };

/** Medium tier profile. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_MEDIUM: DefiningWorldPlazaPerformanceProfile =
  {
    tier: DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
    renderResolutionMax: 1.5,
    antialias: false,
    viewportPaddingTiles: 1,
    treePrefetchTiles: 12,
    maxVisibleTrees: 120,
    floorChunkSizeTiles: 8,
    floorChunkPrefetchTiles: 24,
    terrainElevationPrefetchTiles: 3,
    floorChunkBuildBudgetPerFrame: 2,
    terrainElevationChunkBuildBudgetPerFrame: 1,
    drawsTerrainElevationDecorations: false,
    visibleBoundsSnapTiles: 8,
    drawsGrassDecorations: true,
    drawsStoneDecorations: false,
    canopyAlphaUpdateIntervalFrames: 2,
    minimapIdleRedrawIntervalMs: 700,
    minimapTerrainSnapTiles: 8,
    isMinimapEnabled: true,
  };

/** Low tier profile. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_LOW: DefiningWorldPlazaPerformanceProfile =
  {
    tier: DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW,
    renderResolutionMax: 1,
    antialias: false,
    viewportPaddingTiles: 0,
    treePrefetchTiles: 10,
    maxVisibleTrees: 60,
    floorChunkSizeTiles: 8,
    floorChunkPrefetchTiles: 20,
    terrainElevationPrefetchTiles: 2,
    floorChunkBuildBudgetPerFrame: 2,
    terrainElevationChunkBuildBudgetPerFrame: 1,
    drawsTerrainElevationDecorations: false,
    visibleBoundsSnapTiles: 8,
    drawsGrassDecorations: false,
    drawsStoneDecorations: false,
    canopyAlphaUpdateIntervalFrames: 4,
    minimapIdleRedrawIntervalMs: 1200,
    minimapTerrainSnapTiles: 4,
    minimapViewRadiusTiles: 16,
    isMinimapEnabled: true,
  };

/** Profiles keyed by tier id. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILES: Record<
  DefiningWorldPlazaPerformanceTier,
  DefiningWorldPlazaPerformanceProfile
> = {
  [DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH]:
    DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH,
  [DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM]:
    DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_MEDIUM,
  [DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW]:
    DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_LOW,
};
