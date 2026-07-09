/**
 * Plaza performance diagnostics tuning and sample identifiers.
 *
 * Enable with `NEXT_PUBLIC_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS=true`, the URL
 * query `?perf=1`, the in-world Perf button, or `window.__WORLD_PLAZA_PERF__.enable()`.
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
} as const;

/** Live gauge ids (point-in-time values). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE = {
  FLOOR_CHUNK_COUNT: 'floor-chunk-count',
  TERRAIN_ELEVATION_COLUMN_COUNT: 'terrain-elevation-column-count',
  TERRAIN_ELEVATION_CHUNK_COUNT: 'terrain-elevation-chunk-count',
  TREE_TRUNK_COUNT: 'tree-trunk-count',
  TREE_CANOPY_COUNT: 'tree-canopy-count',
} as const;

/** Counter ids incremented on discrete events (shown per second). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER = {
  FLOOR_BOUNDS_CROSSING: 'floor-bounds-crossing',
  TRUNK_BOUNDS_CROSSING: 'trunk-bounds-crossing',
  CANOPY_BOUNDS_CROSSING: 'canopy-bounds-crossing',
  FLOOR_CHUNKS_BUILT: 'floor-chunks-built',
  ELEVATION_CHUNKS_BUILT: 'elevation-chunks-built',
  JS_ERROR: 'js-error',
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
