/**
 * Adaptive performance tiers for the plaza Pixi scene.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceProfileConstants
 */

/** Full quality for recent desktops and tablets. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH = 'high' as const;

/** Balanced defaults for mid-range hardware. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM = 'medium' as const;

/** Reduced effects for low-end or battery-constrained devices. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW = 'low' as const;

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
  /**
   * Max new tree trunks/canopies/shadows drawn per frame.
   * Spreads forest pop-in so a bounds cross does not bake dozens of trees in one tick.
   */
  readonly treeBuildBudgetPerFrame: number;
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
  /**
   * Max attached elevation columns nearest the player.
   *
   * Dense hills can expose 1000+ raised tiles inside the isometric window;
   * each is a sorted trunk-layer child. Cap keeps sort/draw cost bounded and
   * matches the tree `maxVisibleTrees` pattern.
   */
  readonly maxVisibleElevationColumns: number;
  /** Max new floor chunks built per frame; spreads load to avoid hitches. */
  readonly floorChunkBuildBudgetPerFrame: number;
  /** Max stale floor chunks destroyed per frame when bounds shift. */
  readonly floorChunkPruneBudgetPerFrame: number;
  /** Max new elevation chunks built per frame (batched raised terrain). */
  readonly terrainElevationChunkBuildBudgetPerFrame: number;
  /** When false, hill tops skip flowers and specks for faster chunk builds. */
  readonly drawsTerrainElevationDecorations: boolean;
  /** When false, skip cold/heat hazard tints while baking floor chunks. */
  readonly drawsEnvironmentalHazardFloorTint: boolean;
  /** Visible bounds center snaps to this tile grid so sync does not run every step. */
  readonly visibleBoundsSnapTiles: number;
  readonly drawsGrassDecorations: boolean;
  readonly drawsStoneDecorations: boolean;
  readonly canopyAlphaUpdateIntervalFrames: number;
  readonly minimapIdleRedrawIntervalMs: number;
  /** Minimap overlay refresh interval while the avatar is walking or running. */
  readonly minimapLocomotionUpdateIntervalFrames: number;
  /** Terrain tiles are rebuilt on this snap grid; overlay pans every frame. */
  readonly minimapTerrainSnapTiles: number;
  /** Optional override for minimap visible tile radius. */
  readonly minimapViewRadiusTiles?: number;
  /** When false, the minimap canvas stays hidden until the player enables it in Settings. */
  readonly isMinimapEnabled: boolean;
  /** When false, night darkness uses a flat overlay instead of per-frame lightmap RTT. */
  readonly lightingUsesLightmapRtt: boolean;
  /** Lightmap RTT scale when {@link lightingUsesLightmapRtt} is true. */
  readonly lightingLightmapResolutionScale: number;
  /** Extra tile rings added ahead of movement direction for prefetch. */
  readonly forwardPrefetchTiles: number;
  /** Tile rings trimmed behind the player when moving forward. */
  readonly behindRetentionTiles: number;
  /** Max milliseconds terrain sync may spend building per frame. */
  readonly terrainWorkBudgetMs: number;
  /** Max tree graphics removed per sync when culling stale entries. */
  readonly treePruneBudgetPerFrame: number;
  /** Minimum interval between lightmap RTT redraws while stationary (ms). */
  readonly lightingRttMinIntervalMs: number;
  /** Max wildlife simulation catch-up steps per Pixi frame. */
  readonly wildlifeSimulationMaxStepsPerFrame: number;
  /** Run navigation replan checks every N avatar ticks. */
  readonly navigationReplanIntervalFrames: number;
  /** A* node expansion cap for click-walk pathfinding. */
  readonly navigationMaxNodeExpansions: number;
  /** When false, skip procedural tree ground shadows. */
  readonly drawsTreeShadows: boolean;
  /** When false, skip per-frame tree shake offsets. */
  readonly drawsTreeShake: boolean;
  /** When false, placed-block shadows use contact-only (no blur filter). */
  readonly drawsPlacedBlockShadowBlur: boolean;
  /** Redraw interval for water shimmer (frames). */
  readonly waterShimmerUpdateIntervalFrames: number;
  /** Max visible water tiles that rebuild animated shimmer geometry per redraw. */
  readonly waterShimmerMaxAnimatedTiles: number;
  /** Grid radius beyond local player where remote avatar lava/depth work is skipped. */
  readonly remoteAvatarPresentationCullGridRadius: number;
  /** Grid radius beyond local player where wildlife sprite sync is skipped. */
  readonly wildlifePresentationCullGridRadius: number;
  /** Minimum delay between wildlife React presentation reconciliations. */
  readonly wildlifePresentationReconcileIntervalMs: number;
}

/** High tier profile. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH: DefiningWorldPlazaPerformanceProfile =
  {
    tier: DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH,
    renderResolutionMax: 2,
    antialias: true,
    viewportPaddingTiles: 3,
    treePrefetchTiles: 16,
    maxVisibleTrees: 220,
    treeBuildBudgetPerFrame: 6,
    floorChunkSizeTiles: 8,
    floorChunkPrefetchTiles: 24,
    terrainElevationPrefetchTiles: 4,
    maxVisibleElevationColumns: 320,
    floorChunkBuildBudgetPerFrame: 4,
    floorChunkPruneBudgetPerFrame: 12,
    terrainElevationChunkBuildBudgetPerFrame: 2,
    drawsTerrainElevationDecorations: true,
    drawsEnvironmentalHazardFloorTint: true,
    visibleBoundsSnapTiles: 12,
    drawsGrassDecorations: true,
    drawsStoneDecorations: true,
    canopyAlphaUpdateIntervalFrames: 1,
    minimapIdleRedrawIntervalMs: 400,
    minimapLocomotionUpdateIntervalFrames: 1,
    minimapTerrainSnapTiles: 8,
    isMinimapEnabled: true,
    lightingUsesLightmapRtt: true,
    lightingLightmapResolutionScale: 0.5,
    forwardPrefetchTiles: 6,
    behindRetentionTiles: 4,
    terrainWorkBudgetMs: 8,
    treePruneBudgetPerFrame: 12,
    lightingRttMinIntervalMs: 0,
    wildlifeSimulationMaxStepsPerFrame: 2,
    navigationReplanIntervalFrames: 1,
    navigationMaxNodeExpansions: 4096,
    drawsTreeShadows: true,
    drawsTreeShake: true,
    drawsPlacedBlockShadowBlur: true,
    waterShimmerUpdateIntervalFrames: 5,
    waterShimmerMaxAnimatedTiles: 240,
    remoteAvatarPresentationCullGridRadius: 999,
    wildlifePresentationCullGridRadius: 999,
    wildlifePresentationReconcileIntervalMs: 0,
  };

/** Medium tier profile. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_MEDIUM: DefiningWorldPlazaPerformanceProfile =
  {
    tier: DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
    renderResolutionMax: 1.5,
    antialias: false,
    viewportPaddingTiles: 2,
    treePrefetchTiles: 12,
    maxVisibleTrees: 120,
    treeBuildBudgetPerFrame: 4,
    floorChunkSizeTiles: 8,
    floorChunkPrefetchTiles: 22,
    terrainElevationPrefetchTiles: 3,
    maxVisibleElevationColumns: 240,
    floorChunkBuildBudgetPerFrame: 3,
    floorChunkPruneBudgetPerFrame: 10,
    terrainElevationChunkBuildBudgetPerFrame: 1,
    drawsTerrainElevationDecorations: false,
    drawsEnvironmentalHazardFloorTint: true,
    visibleBoundsSnapTiles: 12,
    drawsGrassDecorations: true,
    drawsStoneDecorations: true,
    canopyAlphaUpdateIntervalFrames: 2,
    minimapIdleRedrawIntervalMs: 700,
    minimapLocomotionUpdateIntervalFrames: 2,
    minimapTerrainSnapTiles: 8,
    isMinimapEnabled: true,
    lightingUsesLightmapRtt: true,
    lightingLightmapResolutionScale: 0.5,
    forwardPrefetchTiles: 4,
    behindRetentionTiles: 3,
    terrainWorkBudgetMs: 7,
    treePruneBudgetPerFrame: 8,
    lightingRttMinIntervalMs: 32,
    wildlifeSimulationMaxStepsPerFrame: 2,
    navigationReplanIntervalFrames: 3,
    navigationMaxNodeExpansions: 2048,
    drawsTreeShadows: true,
    drawsTreeShake: true,
    drawsPlacedBlockShadowBlur: true,
    waterShimmerUpdateIntervalFrames: 5,
    waterShimmerMaxAnimatedTiles: 160,
    remoteAvatarPresentationCullGridRadius: 48,
    wildlifePresentationCullGridRadius: 40,
    wildlifePresentationReconcileIntervalMs: 50,
  };

/** Low tier profile. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_LOW: DefiningWorldPlazaPerformanceProfile =
  {
    tier: DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW,
    renderResolutionMax: 1,
    antialias: false,
    viewportPaddingTiles: 2,
    treePrefetchTiles: 10,
    maxVisibleTrees: 60,
    treeBuildBudgetPerFrame: 2,
    floorChunkSizeTiles: 8,
    floorChunkPrefetchTiles: 18,
    terrainElevationPrefetchTiles: 2,
    maxVisibleElevationColumns: 160,
    floorChunkBuildBudgetPerFrame: 2,
    floorChunkPruneBudgetPerFrame: 8,
    terrainElevationChunkBuildBudgetPerFrame: 1,
    drawsTerrainElevationDecorations: false,
    drawsEnvironmentalHazardFloorTint: true,
    // Match medium/high so low tier does not cross bounds more often (worse hitch rate).
    visibleBoundsSnapTiles: 12,
    drawsGrassDecorations: false,
    drawsStoneDecorations: true,
    canopyAlphaUpdateIntervalFrames: 4,
    minimapIdleRedrawIntervalMs: 1200,
    minimapLocomotionUpdateIntervalFrames: 3,
    minimapTerrainSnapTiles: 4,
    minimapViewRadiusTiles: 16,
    isMinimapEnabled: true,
    lightingUsesLightmapRtt: true,
    lightingLightmapResolutionScale: 0.35,
    forwardPrefetchTiles: 3,
    behindRetentionTiles: 2,
    terrainWorkBudgetMs: 6,
    treePruneBudgetPerFrame: 6,
    lightingRttMinIntervalMs: 64,
    wildlifeSimulationMaxStepsPerFrame: 1,
    navigationReplanIntervalFrames: 6,
    navigationMaxNodeExpansions: 1024,
    // Cheap ellipse draws; keep on so mobile/coarse (stuck on LOW) still get contact shadows.
    drawsTreeShadows: true,
    drawsTreeShake: false,
    drawsPlacedBlockShadowBlur: false,
    waterShimmerUpdateIntervalFrames: 9,
    waterShimmerMaxAnimatedTiles: 96,
    remoteAvatarPresentationCullGridRadius: 36,
    wildlifePresentationCullGridRadius: 32,
    wildlifePresentationReconcileIntervalMs: 100,
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
