/**
 * Perf Metrics tab: nuance categories that group gauges/counters and drive
 * green→red badge indexes. Samples tab reuses the same groups via sampleIds.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
  type DefiningWorldPlazaPerformanceDiagnosticsCounterId,
  type DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
  type DefiningWorldPlazaPerformanceDiagnosticsSampleId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';

const GAUGE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE;
const COUNTER = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER;
const SAMPLE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE;

/** Metric nuance category ids (kebab-case). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE = {
  SYSTEM: 'system',
  TERRAIN: 'terrain',
  WATER: 'water',
  WILDLIFE_POP: 'wildlife-pop',
  WILDLIFE_BEHAVIOR: 'wildlife-behavior',
  WILDLIFE_SIM: 'wildlife-sim',
  PLAYER: 'player',
  AUDIO: 'audio',
  PROJECTILES: 'projectiles',
  ONLINE: 'online',
} as const;

export type DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId =
  (typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE)[keyof typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE];

/**
 * One gauge contribution to a group index.
 * `higher-worse`: load/backlog style. `lower-worse`: ratio/vitals style.
 * Index 0 at healthyAt, 1 at criticalAt (clamped).
 */
export type DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceSignal = {
  gaugeId: DefiningWorldPlazaPerformanceDiagnosticsGaugeId;
  polarity: 'higher-worse' | 'lower-worse';
  healthyAt: number;
  criticalAt: number;
};

/**
 * One sample timing contribution to a Samples-tab group index (p95 ms).
 * Higher ms is always worse.
 */
export type DefiningWorldPlazaPerformanceDiagnosticsSampleNuanceSignal = {
  sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId;
  healthyAtMs: number;
  criticalAtMs: number;
};

export type DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition = {
  nuanceId: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId;
  label: string;
  description: string;
  gaugeIds: readonly DefiningWorldPlazaPerformanceDiagnosticsGaugeId[];
  counterIds: readonly DefiningWorldPlazaPerformanceDiagnosticsCounterId[];
  sampleIds: readonly DefiningWorldPlazaPerformanceDiagnosticsSampleId[];
  /** Signals that drive the Metrics badge index (worst signal wins). */
  signals: readonly DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceSignal[];
  /** Signals that drive the Samples badge index (worst p95 wins). */
  sampleSignals: readonly DefiningWorldPlazaPerformanceDiagnosticsSampleNuanceSignal[];
};

/**
 * Ordered nuance groups for Metrics / Samples / Summary badge strips.
 */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY: readonly DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition[] =
  [
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.SYSTEM,
      label: 'System',
      description: 'DOM overlays, Dev QA, overlay subscriber load',
      gaugeIds: [
        GAUGE.DOM_OVERLAYS_FEATURE_ENABLED,
        GAUGE.DEV_QA_LOAD_ENABLED,
        GAUGE.DOM_OVERLAY_SUBSCRIBER_COUNT,
      ],
      counterIds: [COUNTER.JS_ERROR],
      sampleIds: [
        SAMPLE.DOM_OVERLAY,
        SAMPLE.GPU_DISPOSAL,
        SAMPLE.LIGHTING_RTT,
        SAMPLE.COLLISION_DEBUG,
        SAMPLE.COLLISION_DEBUG_STATIC,
        SAMPLE.COLLISION_DEBUG_WILDLIFE,
        SAMPLE.COLLISION_DEBUG_PLAYER,
        SAMPLE.MINIMAP_REDRAW,
      ],
      signals: [
        {
          gaugeId: GAUGE.DOM_OVERLAY_SUBSCRIBER_COUNT,
          polarity: 'higher-worse',
          healthyAt: 16,
          criticalAt: 64,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.DOM_OVERLAY,
          healthyAtMs: 2,
          criticalAtMs: 12,
        },
        {
          sampleId: SAMPLE.LIGHTING_RTT,
          healthyAtMs: 2,
          criticalAtMs: 10,
        },
        {
          sampleId: SAMPLE.GPU_DISPOSAL,
          healthyAtMs: 1,
          criticalAtMs: 8,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.TERRAIN,
      label: 'Terrain',
      description: 'Floor chunks, elevation columns, tree draw counts',
      gaugeIds: [
        GAUGE.FLOOR_CHUNK_COUNT,
        GAUGE.TERRAIN_ELEVATION_COLUMN_COUNT,
        GAUGE.TERRAIN_ELEVATION_CHUNK_COUNT,
        GAUGE.TREE_TRUNK_COUNT,
        GAUGE.TREE_CANOPY_COUNT,
      ],
      counterIds: [
        COUNTER.FLOOR_BOUNDS_CROSSING,
        COUNTER.TRUNK_BOUNDS_CROSSING,
        COUNTER.CANOPY_BOUNDS_CROSSING,
        COUNTER.FLOOR_CHUNKS_BUILT,
        COUNTER.ELEVATION_CHUNKS_BUILT,
      ],
      sampleIds: [
        SAMPLE.TERRAIN_SYNC,
        SAMPLE.TERRAIN_FLOOR,
        SAMPLE.TERRAIN_TRUNK,
        SAMPLE.TERRAIN_CANOPY,
        SAMPLE.TERRAIN_CANOPY_ALPHA,
        SAMPLE.TERRAIN_PARENT_SORT,
        SAMPLE.TERRAIN_PRUNE,
        SAMPLE.PIXI_RENDER,
        SAMPLE.CAMERA_TICK,
      ],
      signals: [
        {
          gaugeId: GAUGE.FLOOR_CHUNK_COUNT,
          polarity: 'higher-worse',
          healthyAt: 64,
          criticalAt: 220,
        },
        {
          gaugeId: GAUGE.TREE_TRUNK_COUNT,
          polarity: 'higher-worse',
          healthyAt: 40,
          criticalAt: 180,
        },
        {
          gaugeId: GAUGE.TERRAIN_ELEVATION_COLUMN_COUNT,
          polarity: 'higher-worse',
          healthyAt: 100,
          criticalAt: 400,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.TERRAIN_SYNC,
          healthyAtMs: 4,
          criticalAtMs: 20,
        },
        {
          sampleId: SAMPLE.TERRAIN_FLOOR,
          healthyAtMs: 2,
          criticalAtMs: 12,
        },
        {
          sampleId: SAMPLE.PIXI_RENDER,
          healthyAtMs: 4,
          criticalAtMs: 16,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.WATER,
      label: 'Water',
      description: 'Lake/river/stream surface redraw and shimmer animation',
      gaugeIds: [
        GAUGE.WATER_VISIBLE_TILE_COUNT,
        GAUGE.WATER_SHIMMER_TILE_COUNT,
        GAUGE.RIVER_VISIBLE_TILE_COUNT,
        GAUGE.RIVER_SHIMMER_TILE_COUNT,
      ],
      counterIds: [COUNTER.WATER_SURFACE_REDRAW],
      sampleIds: [SAMPLE.WATER_SURFACE_REDRAW, SAMPLE.WATER_SHIMMER_REDRAW],
      signals: [
        {
          gaugeId: GAUGE.WATER_VISIBLE_TILE_COUNT,
          polarity: 'higher-worse',
          healthyAt: 200,
          criticalAt: 1600,
        },
        {
          gaugeId: GAUGE.WATER_SHIMMER_TILE_COUNT,
          polarity: 'higher-worse',
          healthyAt: 120,
          criticalAt: 900,
        },
        {
          gaugeId: GAUGE.RIVER_VISIBLE_TILE_COUNT,
          polarity: 'higher-worse',
          healthyAt: 120,
          criticalAt: 1200,
        },
        {
          gaugeId: GAUGE.RIVER_SHIMMER_TILE_COUNT,
          polarity: 'higher-worse',
          healthyAt: 80,
          criticalAt: 600,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.WATER_SURFACE_REDRAW,
          healthyAtMs: 2,
          criticalAtMs: 12,
        },
        {
          sampleId: SAMPLE.WATER_SHIMMER_REDRAW,
          healthyAtMs: 1,
          criticalAtMs: 6,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.WILDLIFE_POP,
      label: 'Wildlife pop',
      description: 'Live/corpse counts, species load, presentation mount/cull',
      gaugeIds: [
        GAUGE.WILDLIFE_INSTANCE_COUNT,
        GAUGE.WILDLIFE_LIVE_COUNT,
        GAUGE.WILDLIFE_CORPSE_COUNT,
        GAUGE.WILDLIFE_LIVE_SPECIES_COUNT,
        GAUGE.WILDLIFE_LOADED_SPECIES_COUNT,
        GAUGE.WILDLIFE_MOUNTED_PRESENTATION_COUNT,
        GAUGE.WILDLIFE_CULLED_PRESENTATION_COUNT,
      ],
      counterIds: [
        COUNTER.WILDLIFE_TEXTURE_LOAD_REQUEST,
        COUNTER.WILDLIFE_TEXTURE_LOAD_FAILURE,
        COUNTER.WILDLIFE_TEXTURE_EVICTION,
        COUNTER.WILDLIFE_REACT_RECONCILE,
      ],
      sampleIds: [
        SAMPLE.WILDLIFE_LIFECYCLE,
        SAMPLE.WILDLIFE_RENDER_SYNC,
        SAMPLE.WILDLIFE_STANDING_LAYER_SYNC,
        SAMPLE.WILDLIFE_SNAPSHOT_BUILD,
      ],
      signals: [
        {
          gaugeId: GAUGE.WILDLIFE_INSTANCE_COUNT,
          polarity: 'higher-worse',
          healthyAt: 16,
          criticalAt: 80,
        },
        {
          gaugeId: GAUGE.WILDLIFE_MOUNTED_PRESENTATION_COUNT,
          polarity: 'higher-worse',
          healthyAt: 16,
          criticalAt: 64,
        },
        {
          gaugeId: GAUGE.WILDLIFE_LOADED_SPECIES_COUNT,
          polarity: 'higher-worse',
          healthyAt: 8,
          criticalAt: 24,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.WILDLIFE_RENDER_SYNC,
          healthyAtMs: 2,
          criticalAtMs: 12,
        },
        {
          sampleId: SAMPLE.WILDLIFE_LIFECYCLE,
          healthyAtMs: 1,
          criticalAtMs: 8,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.WILDLIFE_BEHAVIOR,
      label: 'Wildlife AI',
      description: 'Behavior-state census (aggro/combat weigh the index)',
      gaugeIds: [
        GAUGE.WILDLIFE_MOVING_COUNT,
        GAUGE.WILDLIFE_SLEEPING_COUNT,
        GAUGE.WILDLIFE_JUMPING_COUNT,
        GAUGE.WILDLIFE_AGGRO_COUNT,
        GAUGE.WILDLIFE_IDLE_COUNT,
        GAUGE.WILDLIFE_ROAMING_COUNT,
        GAUGE.WILDLIFE_FLEEING_COUNT,
        GAUGE.WILDLIFE_COMBAT_COUNT,
        GAUGE.WILDLIFE_STALKING_COUNT,
        GAUGE.WILDLIFE_SOCIAL_COUNT,
        GAUGE.WILDLIFE_FORAGING_COUNT,
      ],
      counterIds: [],
      sampleIds: [SAMPLE.WILDLIFE_AI, SAMPLE.WILDLIFE_SEPARATION],
      signals: [
        {
          gaugeId: GAUGE.WILDLIFE_AGGRO_COUNT,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 8,
        },
        {
          gaugeId: GAUGE.WILDLIFE_COMBAT_COUNT,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 6,
        },
        {
          gaugeId: GAUGE.WILDLIFE_MOVING_COUNT,
          polarity: 'higher-worse',
          healthyAt: 8,
          criticalAt: 40,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.WILDLIFE_AI,
          healthyAtMs: 2,
          criticalAtMs: 12,
        },
        {
          sampleId: SAMPLE.WILDLIFE_SEPARATION,
          healthyAtMs: 1,
          criticalAtMs: 8,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.WILDLIFE_SIM,
      label: 'Wildlife sim',
      description: 'Fixed-step backlog, sim steps, snapshots, contacts',
      gaugeIds: [
        GAUGE.WILDLIFE_SIM_STEPS_THIS_FRAME,
        GAUGE.WILDLIFE_SIM_BACKLOG_MS,
        GAUGE.WILDLIFE_IS_SIMULATION_LEADER,
        GAUGE.WILDLIFE_SNAPSHOT_COUNT,
        GAUGE.WILDLIFE_PLAYER_CONTACT_COUNT,
      ],
      counterIds: [COUNTER.WILDLIFE_SIM_STEP],
      sampleIds: [
        SAMPLE.WILDLIFE_TICK,
        SAMPLE.WILDLIFE_SPATIAL_GRID,
        SAMPLE.WILDLIFE_PLAYER_COLLISION,
        SAMPLE.WILDLIFE_REMOTE_SYNC,
      ],
      signals: [
        {
          gaugeId: GAUGE.WILDLIFE_SIM_BACKLOG_MS,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 48,
        },
        {
          gaugeId: GAUGE.WILDLIFE_SIM_STEPS_THIS_FRAME,
          polarity: 'higher-worse',
          healthyAt: 1,
          criticalAt: 6,
        },
        {
          gaugeId: GAUGE.WILDLIFE_PLAYER_CONTACT_COUNT,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 8,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.WILDLIFE_TICK,
          healthyAtMs: 4,
          criticalAtMs: 20,
        },
        {
          sampleId: SAMPLE.WILDLIFE_SPATIAL_GRID,
          healthyAtMs: 1,
          criticalAtMs: 8,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.PLAYER,
      label: 'Player',
      description: 'Vitals, speed, navigation, motion flags',
      gaugeIds: [
        GAUGE.PLAYER_HUNGER_RATIO,
        GAUGE.PLAYER_IS_STARVING,
        GAUGE.PLAYER_HEALTH_RATIO,
        GAUGE.PLAYER_STAMINA_RATIO,
        GAUGE.PLAYER_STAMINA_RUNNING_SECONDS,
        GAUGE.PLAYER_SPEED_GRID_PER_SECOND,
        GAUGE.PLAYER_ATTEMPTED_SPEED_GRID_PER_SECOND,
        GAUGE.PLAYER_NAVIGATION_WAYPOINT_COUNT,
        GAUGE.PLAYER_NAVIGATION_LAST_NODES_EXPANDED,
        GAUGE.PLAYER_NAVIGATION_LAST_PATH_LENGTH,
        GAUGE.PLAYER_WORLD_LAYER,
        GAUGE.PLAYER_IS_KEYBOARD_MOVING,
        GAUGE.PLAYER_IS_CLICK_MOVING,
        GAUGE.PLAYER_IS_RUNNING,
        GAUGE.PLAYER_IS_JUMPING,
        GAUGE.PLAYER_IS_FALLING,
        GAUGE.PLAYER_IS_ROLLING,
        GAUGE.PLAYER_IS_PUSHING,
        GAUGE.PLAYER_IS_ICE_SLIDING,
        GAUGE.PLAYER_IS_STUNNED,
        GAUGE.PLAYER_IS_ASLEEP,
        GAUGE.PLAYER_IS_DEAD,
      ],
      counterIds: [
        COUNTER.PLAYER_COLLISION_BLOCKED_FRAME,
        COUNTER.PLAYER_NAVIGATION_PLAN,
        COUNTER.PLAYER_NAVIGATION_PLAN_PATHFINDING,
        COUNTER.PLAYER_NAVIGATION_PLAN_DIRECT_OR_FALLBACK,
        COUNTER.PLAYER_NAVIGATION_REPLAN,
        COUNTER.PLAYER_NAVIGATION_REPLAN_PATHFINDING,
        COUNTER.PLAYER_NAVIGATION_REPLAN_FALLBACK,
        COUNTER.PLAYER_AUTO_JUMP_PROBE,
        COUNTER.PLAYER_AUTO_JUMP_TRIGGER,
        COUNTER.PLAYER_FALL_STARTED,
        COUNTER.PLAYER_MOTION_TRANSITION,
        COUNTER.ENTITY_DEPTH_CACHE_HIT,
        COUNTER.ENTITY_DEPTH_CACHE_MISS,
      ],
      sampleIds: [
        SAMPLE.AVATAR_TICK,
        SAMPLE.AVATAR_COLLISION,
        SAMPLE.AVATAR_AUTO_JUMP_PROBE,
        SAMPLE.AVATAR_NAVIGATION_PLAN,
        SAMPLE.AVATAR_NAVIGATION_REPLAN,
        SAMPLE.AVATAR_COMBAT_PRESENTATION,
        SAMPLE.PLAYER_HEALTH_TICK,
        SAMPLE.PLAYER_STAMINA_TICK,
        SAMPLE.PLAYER_HUNGER_TICK,
      ],
      signals: [
        {
          gaugeId: GAUGE.PLAYER_HEALTH_RATIO,
          polarity: 'lower-worse',
          healthyAt: 1,
          criticalAt: 0.2,
        },
        {
          gaugeId: GAUGE.PLAYER_HUNGER_RATIO,
          polarity: 'lower-worse',
          healthyAt: 1,
          criticalAt: 0.15,
        },
        {
          gaugeId: GAUGE.PLAYER_STAMINA_RATIO,
          polarity: 'lower-worse',
          healthyAt: 1,
          criticalAt: 0.1,
        },
        {
          gaugeId: GAUGE.PLAYER_NAVIGATION_LAST_NODES_EXPANDED,
          polarity: 'higher-worse',
          healthyAt: 64,
          criticalAt: 800,
        },
        {
          gaugeId: GAUGE.PLAYER_IS_DEAD,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 1,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.AVATAR_TICK,
          healthyAtMs: 2,
          criticalAtMs: 10,
        },
        {
          sampleId: SAMPLE.AVATAR_NAVIGATION_PLAN,
          healthyAtMs: 2,
          criticalAtMs: 16,
        },
        {
          sampleId: SAMPLE.AVATAR_COLLISION,
          healthyAtMs: 1,
          criticalAtMs: 8,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.AUDIO,
      label: 'Audio',
      description: 'SFX voices, preload pressure, music bus',
      gaugeIds: [
        GAUGE.AUDIO_ACTIVE_SFX_COUNT,
        GAUGE.AUDIO_PRELOADED_ASSET_COUNT,
        GAUGE.AUDIO_INFLIGHT_LOAD_COUNT,
        GAUGE.AUDIO_CONSUMER_COUNT,
        GAUGE.AUDIO_IS_LOCKED,
        GAUGE.AUDIO_MUSIC_ACTIVE_VOICE_COUNT,
        GAUGE.AUDIO_MUSIC_IS_CROSSFADING,
        GAUGE.AUDIO_MUSIC_TARGET_VOLUME,
      ],
      counterIds: [
        COUNTER.AUDIO_SFX_PLAY_REQUEST,
        COUNTER.AUDIO_SFX_PLAY_FAILURE,
        COUNTER.AUDIO_PRELOAD_REQUEST,
        COUNTER.AUDIO_PRELOAD_FAILURE,
        COUNTER.AUDIO_PRELOAD_CACHE_HIT,
        COUNTER.AUDIO_PRELOAD_INFLIGHT_HIT,
        COUNTER.AUDIO_MUSIC_SWITCH,
        COUNTER.AUDIO_MUSIC_PLAY_FAILURE,
      ],
      sampleIds: [
        SAMPLE.AUDIO_SFX_PLAY,
        SAMPLE.AUDIO_SFX_VOLUME_SYNC,
        SAMPLE.AUDIO_PRELOAD,
      ],
      signals: [
        {
          gaugeId: GAUGE.AUDIO_ACTIVE_SFX_COUNT,
          polarity: 'higher-worse',
          healthyAt: 4,
          criticalAt: 24,
        },
        {
          gaugeId: GAUGE.AUDIO_INFLIGHT_LOAD_COUNT,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 8,
        },
        {
          gaugeId: GAUGE.AUDIO_IS_LOCKED,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 1,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.AUDIO_PRELOAD,
          healthyAtMs: 40,
          criticalAtMs: 400,
        },
        {
          sampleId: SAMPLE.AUDIO_SFX_PLAY,
          healthyAtMs: 0.5,
          criticalAtMs: 4,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.PROJECTILES,
      label: 'Projectiles',
      description: 'Active projectiles and substep pressure',
      gaugeIds: [
        GAUGE.PROJECTILE_INSTANCE_COUNT,
        GAUGE.PROJECTILE_TARGET_COUNT,
        GAUGE.PROJECTILE_SUBSTEPS_THIS_FRAME,
      ],
      counterIds: [
        COUNTER.PROJECTILE_SPAWN,
        COUNTER.PROJECTILE_HIT,
        COUNTER.PROJECTILE_MISS,
        COUNTER.PROJECTILE_IMPACT,
      ],
      sampleIds: [SAMPLE.PROJECTILE_TICK],
      signals: [
        {
          gaugeId: GAUGE.PROJECTILE_INSTANCE_COUNT,
          polarity: 'higher-worse',
          healthyAt: 4,
          criticalAt: 40,
        },
        {
          gaugeId: GAUGE.PROJECTILE_SUBSTEPS_THIS_FRAME,
          polarity: 'higher-worse',
          healthyAt: 2,
          criticalAt: 16,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.PROJECTILE_TICK,
          healthyAtMs: 1,
          criticalAtMs: 8,
        },
      ],
    },
    {
      nuanceId:
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.ONLINE,
      label: 'Online',
      description: 'Remote players, participants, wildlife snapshots',
      gaugeIds: [
        GAUGE.ONLINE_REMOTE_PLAYER_COUNT,
        GAUGE.ONLINE_PARTICIPANT_COUNT,
        GAUGE.ONLINE_REMOTE_WILDLIFE_SNAPSHOT_COUNT,
      ],
      counterIds: [
        COUNTER.ONLINE_SYNC_FAILURE,
        COUNTER.ONLINE_POLL_FAILURE,
        COUNTER.ONLINE_SYNC_SKIPPED_INFLIGHT,
      ],
      sampleIds: [SAMPLE.ONLINE_SYNC_ROUND_TRIP, SAMPLE.ONLINE_POLL_ROUND_TRIP],
      signals: [
        {
          gaugeId: GAUGE.ONLINE_REMOTE_PLAYER_COUNT,
          polarity: 'higher-worse',
          healthyAt: 4,
          criticalAt: 24,
        },
        {
          gaugeId: GAUGE.ONLINE_REMOTE_WILDLIFE_SNAPSHOT_COUNT,
          polarity: 'higher-worse',
          healthyAt: 8,
          criticalAt: 64,
        },
      ],
      sampleSignals: [
        {
          sampleId: SAMPLE.ONLINE_SYNC_ROUND_TRIP,
          healthyAtMs: 80,
          criticalAtMs: 400,
        },
        {
          sampleId: SAMPLE.ONLINE_POLL_ROUND_TRIP,
          healthyAtMs: 80,
          criticalAtMs: 400,
        },
      ],
    },
  ];
