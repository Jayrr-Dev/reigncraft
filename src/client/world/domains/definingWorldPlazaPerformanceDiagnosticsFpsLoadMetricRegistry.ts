import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  type DefiningWorldPlazaPerformanceDiagnosticsCounterId,
  type DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WILDLIFE_SIMULATION_MAX_STEPS_PER_FRAME,
  DEFINING_WILDLIFE_SIMULATION_TICK_MS,
} from '@/components/world/wildlife/domains/definingWildlifeSimulationTimestepConstants';

const GAUGE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE;
const COUNTER = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER;

export type DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricSignal = {
  readonly metricId:
    | DefiningWorldPlazaPerformanceDiagnosticsGaugeId
    | DefiningWorldPlazaPerformanceDiagnosticsCounterId;
  readonly source: 'gauge' | 'counter';
  readonly label: string;
  readonly unit: 'count' | 'milliseconds' | 'per-second';
  readonly healthyAt: number;
  readonly criticalAt: number;
};

export type DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup = {
  readonly groupId:
    | 'system'
    | 'terrain'
    | 'water'
    | 'wildlife'
    | 'navigation'
    | 'audio'
    | 'projectiles'
    | 'online';
  readonly label: string;
  readonly description: string;
  readonly signals: readonly DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricSignal[];
};

/**
 * Only workload volume and churn signals that can increase frame CPU/GPU cost.
 * Gameplay state, vitals, feature state, and network latency are excluded.
 */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_LOAD_METRIC_REGISTRY: readonly DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup[] =
  [
    {
      groupId: 'system',
      label: 'DOM',
      description: 'Per-frame DOM overlay callbacks',
      signals: [
        {
          metricId: GAUGE.DOM_OVERLAY_SUBSCRIBER_COUNT,
          source: 'gauge',
          label: 'overlay subscribers',
          unit: 'count',
          healthyAt: 16,
          criticalAt: 64,
        },
      ],
    },
    {
      groupId: 'terrain',
      label: 'Terrain',
      description: 'Visible sorted geometry and chunk rebuild churn',
      signals: [
        {
          metricId: GAUGE.TERRAIN_ELEVATION_COLUMN_COUNT,
          source: 'gauge',
          label: 'elevation columns',
          unit: 'count',
          healthyAt: 100,
          criticalAt: 400,
        },
        {
          metricId: GAUGE.TREE_TRUNK_COUNT,
          source: 'gauge',
          label: 'tree trunks',
          unit: 'count',
          healthyAt: 40,
          criticalAt: 180,
        },
        {
          metricId: GAUGE.TREE_CANOPY_COUNT,
          source: 'gauge',
          label: 'tree canopies',
          unit: 'count',
          healthyAt: 40,
          criticalAt: 180,
        },
        {
          metricId: COUNTER.FLOOR_CHUNKS_BUILT,
          source: 'counter',
          label: 'floor chunks built',
          unit: 'per-second',
          healthyAt: 1,
          criticalAt: 20,
        },
        {
          metricId: COUNTER.ELEVATION_CHUNKS_BUILT,
          source: 'counter',
          label: 'elevation chunks built',
          unit: 'per-second',
          healthyAt: 1,
          criticalAt: 16,
        },
        {
          metricId: COUNTER.FLOOR_BOUNDS_CROSSING,
          source: 'counter',
          label: 'floor bounds crossings',
          unit: 'per-second',
          healthyAt: 0.5,
          criticalAt: 10,
        },
      ],
    },
    {
      groupId: 'water',
      label: 'Water',
      description: 'Visible water geometry and animated tiles',
      signals: [
        {
          metricId: GAUGE.WATER_VISIBLE_TILE_COUNT,
          source: 'gauge',
          label: 'visible water tiles',
          unit: 'count',
          healthyAt: 200,
          criticalAt: 1600,
        },
        {
          metricId: GAUGE.WATER_SHIMMER_TILE_COUNT,
          source: 'gauge',
          label: 'animated water tiles',
          unit: 'count',
          healthyAt: 120,
          criticalAt: 900,
        },
        {
          metricId: GAUGE.RIVER_VISIBLE_TILE_COUNT,
          source: 'gauge',
          label: 'visible river tiles',
          unit: 'count',
          healthyAt: 120,
          criticalAt: 1200,
        },
        {
          metricId: GAUGE.RIVER_SHIMMER_TILE_COUNT,
          source: 'gauge',
          label: 'animated river tiles',
          unit: 'count',
          healthyAt: 80,
          criticalAt: 600,
        },
        {
          metricId: COUNTER.WATER_SURFACE_REDRAW,
          source: 'counter',
          label: 'surface redraws',
          unit: 'per-second',
          healthyAt: 2,
          criticalAt: 10,
        },
      ],
    },
    {
      groupId: 'wildlife',
      label: 'Wildlife',
      description: 'Simulation and rendered wildlife workload',
      signals: [
        {
          metricId: GAUGE.WILDLIFE_INSTANCE_COUNT,
          source: 'gauge',
          label: 'wildlife instances',
          unit: 'count',
          healthyAt: 16,
          criticalAt: 80,
        },
        {
          metricId: GAUGE.WILDLIFE_MOUNTED_PRESENTATION_COUNT,
          source: 'gauge',
          label: 'mounted presentations',
          unit: 'count',
          healthyAt: 16,
          criticalAt: 64,
        },
        {
          metricId: GAUGE.WILDLIFE_MOVING_COUNT,
          source: 'gauge',
          label: 'moving wildlife',
          unit: 'count',
          healthyAt: 8,
          criticalAt: 40,
        },
        {
          metricId: GAUGE.WILDLIFE_SIM_BACKLOG_MS,
          source: 'gauge',
          label: 'simulation backlog',
          unit: 'milliseconds',
          healthyAt: DEFINING_WILDLIFE_SIMULATION_TICK_MS,
          criticalAt:
            DEFINING_WILDLIFE_SIMULATION_TICK_MS *
            DEFINING_WILDLIFE_SIMULATION_MAX_STEPS_PER_FRAME,
        },
        {
          metricId: GAUGE.WILDLIFE_SIM_STEPS_THIS_FRAME,
          source: 'gauge',
          label: 'simulation steps this frame',
          unit: 'count',
          healthyAt: 1,
          criticalAt: 6,
        },
        {
          metricId: GAUGE.WILDLIFE_PLAYER_CONTACT_COUNT,
          source: 'gauge',
          label: 'player contacts',
          unit: 'count',
          healthyAt: 0,
          criticalAt: 8,
        },
        {
          metricId: COUNTER.WILDLIFE_REACT_RECONCILE,
          source: 'counter',
          label: 'React reconciles',
          unit: 'per-second',
          healthyAt: 10,
          criticalAt: 60,
        },
      ],
    },
    {
      groupId: 'navigation',
      label: 'Navigation',
      description: 'Pathfinding search size and replan churn',
      signals: [
        {
          metricId: GAUGE.PLAYER_NAVIGATION_LAST_NODES_EXPANDED,
          source: 'gauge',
          label: 'nodes expanded',
          unit: 'count',
          healthyAt: 64,
          criticalAt: 800,
        },
        {
          metricId: COUNTER.PLAYER_NAVIGATION_PLAN_PATHFINDING,
          source: 'counter',
          label: 'pathfinding plans',
          unit: 'per-second',
          healthyAt: 0.5,
          criticalAt: 8,
        },
        {
          metricId: COUNTER.PLAYER_NAVIGATION_REPLAN,
          source: 'counter',
          label: 'replans',
          unit: 'per-second',
          healthyAt: 1,
          criticalAt: 12,
        },
        {
          metricId: COUNTER.PLAYER_AUTO_JUMP_PROBE,
          source: 'counter',
          label: 'auto-jump probes',
          unit: 'per-second',
          healthyAt: 4,
          criticalAt: 60,
        },
      ],
    },
    {
      groupId: 'audio',
      label: 'Audio',
      description: 'Concurrent voices and loading pressure',
      signals: [
        {
          metricId: GAUGE.AUDIO_ACTIVE_SFX_COUNT,
          source: 'gauge',
          label: 'active SFX voices',
          unit: 'count',
          healthyAt: 4,
          criticalAt: 24,
        },
        {
          metricId: GAUGE.AUDIO_MUSIC_ACTIVE_VOICE_COUNT,
          source: 'gauge',
          label: 'music voices',
          unit: 'count',
          healthyAt: 1,
          criticalAt: 4,
        },
        {
          metricId: GAUGE.AUDIO_INFLIGHT_LOAD_COUNT,
          source: 'gauge',
          label: 'active preload workers',
          unit: 'count',
          healthyAt: 0,
          criticalAt: 8,
        },
        {
          metricId: COUNTER.AUDIO_SFX_PLAY_REQUEST,
          source: 'counter',
          label: 'SFX play requests',
          unit: 'per-second',
          healthyAt: 4,
          criticalAt: 50,
        },
      ],
    },
    {
      groupId: 'projectiles',
      label: 'Projectiles',
      description: 'Projectile population and physics substeps',
      signals: [
        {
          metricId: GAUGE.PROJECTILE_INSTANCE_COUNT,
          source: 'gauge',
          label: 'active projectiles',
          unit: 'count',
          healthyAt: 4,
          criticalAt: 40,
        },
        {
          metricId: GAUGE.PROJECTILE_TARGET_COUNT,
          source: 'gauge',
          label: 'tracked targets',
          unit: 'count',
          healthyAt: 4,
          criticalAt: 40,
        },
        {
          metricId: GAUGE.PROJECTILE_SUBSTEPS_THIS_FRAME,
          source: 'gauge',
          label: 'substeps this frame',
          unit: 'count',
          healthyAt: 2,
          criticalAt: 16,
        },
        {
          metricId: COUNTER.PROJECTILE_SPAWN,
          source: 'counter',
          label: 'projectile spawns',
          unit: 'per-second',
          healthyAt: 4,
          criticalAt: 30,
        },
      ],
    },
    {
      groupId: 'online',
      label: 'Online entities',
      description: 'Remote entities requiring local sync and rendering',
      signals: [
        {
          metricId: GAUGE.ONLINE_REMOTE_PLAYER_COUNT,
          source: 'gauge',
          label: 'remote players',
          unit: 'count',
          healthyAt: 4,
          criticalAt: 24,
        },
        {
          metricId: GAUGE.ONLINE_REMOTE_WILDLIFE_SNAPSHOT_COUNT,
          source: 'gauge',
          label: 'remote wildlife snapshots',
          unit: 'count',
          healthyAt: 8,
          criticalAt: 64,
        },
      ],
    },
  ];
