/**
 * Plaza performance diagnostics tuning and sample identifiers.
 *
 * Enable with `NEXT_PUBLIC_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS=true`, the URL
 * query `?perf=1` or `?debug=1`, the in-world Perf button, or `window.__WORLD_PLAZA_PERF__.enable()`.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants
 */

/** Starts with the overlay open when set in `.env.local`. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ENV_ENABLED =
  import.meta.env.NEXT_PUBLIC_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS === 'true';

/** URL query flag that opens diagnostics on load. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_URL_QUERY_KEY =
  'perf' as const;

/** URL query value that enables diagnostics. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_URL_QUERY_VALUE =
  '1' as const;

/** Rolling window size for per-sample duration history. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_HISTORY_SIZE = 120;

/** Rolling window size for frame-time history (FPS). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FRAME_HISTORY_SIZE = 120;

/** Sample durations at or above this value count as spikes (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SPIKE_THRESHOLD_MS = 8;

/** Minimum interval between automatic spike console reports (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SPIKE_LOG_INTERVAL_MS = 2000;

/** HUD refresh interval so React does not re-render every frame (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS = 400;

/** Frame times at or above this value count as slow frames (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SLOW_FRAME_THRESHOLD_MS = 20;

/** Frame times at or above this value count as very slow frames (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_VERY_SLOW_FRAME_THRESHOLD_MS = 50;

/** Instrumented sample ids grouped for the HUD and console dump. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE = {
  AVATAR_TICK: 'avatar-tick',
  AVATAR_COLLISION: 'avatar-collision',
  TERRAIN_SYNC: 'terrain-sync',
  TERRAIN_FLOOR: 'terrain-floor-sync',
  TERRAIN_TRUNK: 'terrain-trunk-sync',
  TERRAIN_CANOPY: 'terrain-canopy-sync',
  TERRAIN_CANOPY_ALPHA: 'terrain-canopy-alpha',
  CAMERA_TICK: 'camera-tick',
  COLLISION_DEBUG: 'collision-debug-overlay',
  COLLISION_DEBUG_STATIC: 'collision-debug-static-tiles',
  COLLISION_DEBUG_WILDLIFE: 'collision-debug-wildlife',
  COLLISION_DEBUG_PLAYER: 'collision-debug-player-marker',
  MINIMAP_REDRAW: 'minimap-redraw',
  PIXI_RENDER: 'pixi-render',
  TERRAIN_PARENT_SORT: 'terrain-parent-sort',
  TERRAIN_PRUNE: 'terrain-prune',
  WILDLIFE_TICK: 'wildlife-tick',
  WILDLIFE_LIFECYCLE: 'wildlife-lifecycle',
  WILDLIFE_SPATIAL_GRID: 'wildlife-spatial-grid',
  WILDLIFE_AI: 'wildlife-ai',
  WILDLIFE_SEPARATION: 'wildlife-separation',
  WILDLIFE_PLAYER_COLLISION: 'wildlife-player-collision',
  WILDLIFE_STANDING_LAYER_SYNC: 'wildlife-standing-layer-sync',
  WILDLIFE_SNAPSHOT_BUILD: 'wildlife-snapshot-build',
  WILDLIFE_REMOTE_SYNC: 'wildlife-remote-sync',
  WILDLIFE_RENDER_SYNC: 'wildlife-render-sync',
  LIGHTING_RTT: 'lighting-rtt',
  DOM_OVERLAY: 'dom-overlay',
  GPU_DISPOSAL: 'gpu-disposal',
  PROJECTILE_TICK: 'projectile-tick',
} as const;

/** Live gauge ids (point-in-time values). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE = {
  FLOOR_CHUNK_COUNT: 'floor-chunk-count',
  TERRAIN_ELEVATION_COLUMN_COUNT: 'terrain-elevation-column-count',
  TERRAIN_ELEVATION_CHUNK_COUNT: 'terrain-elevation-chunk-count',
  TREE_TRUNK_COUNT: 'tree-trunk-count',
  TREE_CANOPY_COUNT: 'tree-canopy-count',
  DOM_OVERLAY_SUBSCRIBER_COUNT: 'dom-overlay-subscriber-count',
  WILDLIFE_INSTANCE_COUNT: 'wildlife-instance-count',
  WILDLIFE_LIVE_COUNT: 'wildlife-live-count',
  WILDLIFE_CORPSE_COUNT: 'wildlife-corpse-count',
  WILDLIFE_MOVING_COUNT: 'wildlife-moving-count',
  WILDLIFE_SLEEPING_COUNT: 'wildlife-sleeping-count',
  WILDLIFE_JUMPING_COUNT: 'wildlife-jumping-count',
  WILDLIFE_AGGRO_COUNT: 'wildlife-aggro-count',
  WILDLIFE_IDLE_COUNT: 'wildlife-idle-count',
  WILDLIFE_ROAMING_COUNT: 'wildlife-roaming-count',
  WILDLIFE_FLEEING_COUNT: 'wildlife-fleeing-count',
  WILDLIFE_COMBAT_COUNT: 'wildlife-combat-count',
  WILDLIFE_STALKING_COUNT: 'wildlife-stalking-count',
  WILDLIFE_SOCIAL_COUNT: 'wildlife-social-count',
  WILDLIFE_FORAGING_COUNT: 'wildlife-foraging-count',
  WILDLIFE_MOUNTED_PRESENTATION_COUNT: 'wildlife-mounted-presentation-count',
  WILDLIFE_CULLED_PRESENTATION_COUNT: 'wildlife-culled-presentation-count',
  WILDLIFE_LIVE_SPECIES_COUNT: 'wildlife-live-species-count',
  WILDLIFE_LOADED_SPECIES_COUNT: 'wildlife-loaded-species-count',
  WILDLIFE_SIM_STEPS_THIS_FRAME: 'wildlife-sim-steps-this-frame',
  WILDLIFE_SIM_BACKLOG_MS: 'wildlife-sim-backlog-ms',
  WILDLIFE_IS_SIMULATION_LEADER: 'wildlife-is-simulation-leader',
  WILDLIFE_SNAPSHOT_COUNT: 'wildlife-snapshot-count',
  WILDLIFE_PLAYER_CONTACT_COUNT: 'wildlife-player-contact-count',
} as const;

/** Counter ids incremented on discrete events (shown per second). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER = {
  FLOOR_BOUNDS_CROSSING: 'floor-bounds-crossing',
  TRUNK_BOUNDS_CROSSING: 'trunk-bounds-crossing',
  CANOPY_BOUNDS_CROSSING: 'canopy-bounds-crossing',
  FLOOR_CHUNKS_BUILT: 'floor-chunks-built',
  ELEVATION_CHUNKS_BUILT: 'elevation-chunks-built',
  JS_ERROR: 'js-error',
  ENTITY_DEPTH_CACHE_HIT: 'entity-depth-cache-hit',
  ENTITY_DEPTH_CACHE_MISS: 'entity-depth-cache-miss',
  WILDLIFE_SIM_STEP: 'wildlife-sim-step',
  WILDLIFE_TEXTURE_LOAD_REQUEST: 'wildlife-texture-load-request',
  WILDLIFE_TEXTURE_LOAD_FAILURE: 'wildlife-texture-load-failure',
  WILDLIFE_TEXTURE_EVICTION: 'wildlife-texture-eviction',
  WILDLIFE_REACT_RECONCILE: 'wildlife-react-reconcile',
} as const;

/** Sample ids shown in the overlay, in display order. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_DISPLAY_ORDER =
  [
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_TICK,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_COLLISION,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_SYNC,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_FLOOR,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_TRUNK,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_CANOPY_ALPHA,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.CAMERA_TICK,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG_STATIC,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG_WILDLIFE,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.COLLISION_DEBUG_PLAYER,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.MINIMAP_REDRAW,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.PIXI_RENDER,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_PARENT_SORT,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.TERRAIN_PRUNE,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_TICK,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_LIFECYCLE,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_SPATIAL_GRID,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_AI,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_SEPARATION,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE
      .WILDLIFE_PLAYER_COLLISION,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE
      .WILDLIFE_STANDING_LAYER_SYNC,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_SNAPSHOT_BUILD,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_REMOTE_SYNC,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_RENDER_SYNC,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.LIGHTING_RTT,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.DOM_OVERLAY,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.GPU_DISPOSAL,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.PROJECTILE_TICK,
  ] as const;

/** One instrumented sample id. */
export type DefiningWorldPlazaPerformanceDiagnosticsSampleId =
  (typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE)[keyof typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE];

/** One gauge id. */
export type DefiningWorldPlazaPerformanceDiagnosticsGaugeId =
  (typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE)[keyof typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE];

/** One counter id. */
export type DefiningWorldPlazaPerformanceDiagnosticsCounterId =
  (typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER)[keyof typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER];
