import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
  type DefiningWorldPlazaPerformanceDiagnosticsSampleId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type {
  MeasuringWorldPlazaPerformanceDiagnosticsSampleStats,
  MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

const SAMPLE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE;
const GAUGE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE;
const COUNTER = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER;

const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FRAME_BUDGET_MS = 1000 / 60;
const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_VERY_SLOW_FRAME_MS = 50;
const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_WARNING_SCORE = 0.35;
const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CRITICAL_SCORE = 1;
const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_MAX_CAUSES = 4;
const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_MAX_HEALTHY_AREAS = 4;

type ResolvingWorldPlazaPerformanceDiagnosticsContributorDefinition = {
  readonly sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId;
  readonly label: string;
  readonly loadLines?: (
    snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot
  ) => readonly string[];
};

/** Parent samples contain their children and must not be presented twice. */
const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CHILD_SAMPLE_IDS_BY_PARENT =
  new Map<
    DefiningWorldPlazaPerformanceDiagnosticsSampleId,
    readonly DefiningWorldPlazaPerformanceDiagnosticsSampleId[]
  >([
    [
      SAMPLE.TERRAIN_SYNC,
      [
        SAMPLE.TERRAIN_FLOOR,
        SAMPLE.TERRAIN_TRUNK,
        SAMPLE.TERRAIN_CANOPY,
        SAMPLE.TERRAIN_PARENT_SORT,
        SAMPLE.TERRAIN_PRUNE,
        SAMPLE.WATER_SURFACE_REDRAW,
        SAMPLE.WATER_SHIMMER_REDRAW,
      ],
    ],
    [SAMPLE.DOM_OVERLAY, [SAMPLE.MINIMAP_REDRAW, SAMPLE.COLLISION_DEBUG]],
    [
      SAMPLE.COLLISION_DEBUG,
      [
        SAMPLE.COLLISION_DEBUG_STATIC,
        SAMPLE.COLLISION_DEBUG_WILDLIFE,
        SAMPLE.COLLISION_DEBUG_PLAYER,
      ],
    ],
    [
      SAMPLE.WILDLIFE_TICK,
      [
        SAMPLE.WILDLIFE_LIFECYCLE,
        SAMPLE.WILDLIFE_SPATIAL_GRID,
        SAMPLE.WILDLIFE_AI,
        SAMPLE.WILDLIFE_SEPARATION,
        SAMPLE.WILDLIFE_PLAYER_COLLISION,
        SAMPLE.WILDLIFE_STANDING_LAYER_SYNC,
        SAMPLE.WILDLIFE_SNAPSHOT_BUILD,
        SAMPLE.WILDLIFE_REMOTE_SYNC,
        SAMPLE.WILDLIFE_RENDER_SYNC,
      ],
    ],
    [
      SAMPLE.AVATAR_TICK,
      [
        SAMPLE.AVATAR_COLLISION,
        SAMPLE.AVATAR_AUTO_JUMP_PROBE,
        SAMPLE.AVATAR_NAVIGATION_PLAN,
        SAMPLE.AVATAR_NAVIGATION_REPLAN,
        SAMPLE.AVATAR_COMBAT_PRESENTATION,
      ],
    ],
  ]);

function formattingGaugeLine(
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
  gaugeId: string,
  label: string
): string | null {
  const value = snapshot.gauges[gaugeId];
  return value === undefined ? null : `${label} ${value}`;
}

function formattingCounterLine(
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
  counterId: string,
  label: string
): string | null {
  const value = snapshot.countersPerSecond[counterId];
  return value === undefined ? null : `${label} ${value.toFixed(1)}/s`;
}

function filteringPresentLines(
  lines: readonly (string | null)[]
): readonly string[] {
  return lines.filter((line): line is string => line !== null);
}

const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CONTRIBUTOR_REGISTRY: readonly ResolvingWorldPlazaPerformanceDiagnosticsContributorDefinition[] =
  [
    {
      sampleId: SAMPLE.TERRAIN_FLOOR,
      label: 'Floor chunk generation',
      loadLines: (snapshot) =>
        filteringPresentLines([
          formattingGaugeLine(
            snapshot,
            GAUGE.FLOOR_CHUNK_COUNT,
            'chunks retained'
          ),
          formattingCounterLine(
            snapshot,
            COUNTER.FLOOR_CHUNKS_BUILT,
            'chunks built'
          ),
          formattingCounterLine(
            snapshot,
            COUNTER.FLOOR_BOUNDS_CROSSING,
            'bounds crossed'
          ),
        ]),
    },
    {
      sampleId: SAMPLE.MINIMAP_REDRAW,
      label: 'Minimap redraw',
    },
    {
      sampleId: SAMPLE.WATER_SURFACE_REDRAW,
      label: 'Water surface rebuild',
      loadLines: (snapshot) =>
        filteringPresentLines([
          formattingGaugeLine(
            snapshot,
            GAUGE.WATER_VISIBLE_TILE_COUNT,
            'water tiles'
          ),
          formattingGaugeLine(
            snapshot,
            GAUGE.RIVER_VISIBLE_TILE_COUNT,
            'river tiles'
          ),
          formattingCounterLine(
            snapshot,
            COUNTER.WATER_SURFACE_REDRAW,
            'redraws'
          ),
        ]),
    },
    {
      sampleId: SAMPLE.WATER_SHIMMER_REDRAW,
      label: 'Water animation',
      loadLines: (snapshot) =>
        filteringPresentLines([
          formattingGaugeLine(
            snapshot,
            GAUGE.WATER_SHIMMER_TILE_COUNT,
            'animated tiles'
          ),
          formattingGaugeLine(
            snapshot,
            GAUGE.RIVER_SHIMMER_TILE_COUNT,
            'animated river tiles'
          ),
        ]),
    },
    { sampleId: SAMPLE.PIXI_RENDER, label: 'Pixi scene render' },
    { sampleId: SAMPLE.LIGHTING_RTT, label: 'Night lighting' },
    { sampleId: SAMPLE.DOM_OVERLAY, label: 'DOM overlay scheduler' },
    { sampleId: SAMPLE.GPU_DISPOSAL, label: 'GPU resource disposal' },
    { sampleId: SAMPLE.TERRAIN_SYNC, label: 'Terrain engine' },
    { sampleId: SAMPLE.TERRAIN_TRUNK, label: 'Tree trunk sync' },
    { sampleId: SAMPLE.TERRAIN_CANOPY, label: 'Tree canopy sync' },
    { sampleId: SAMPLE.TERRAIN_CANOPY_ALPHA, label: 'Tree canopy fading' },
    { sampleId: SAMPLE.TERRAIN_PARENT_SORT, label: 'Terrain depth sort' },
    { sampleId: SAMPLE.TERRAIN_PRUNE, label: 'Terrain pruning' },
    { sampleId: SAMPLE.CAMERA_TICK, label: 'Camera update' },
    { sampleId: SAMPLE.COLLISION_DEBUG, label: 'Collision debug overlay' },
    {
      sampleId: SAMPLE.COLLISION_DEBUG_STATIC,
      label: 'Static collision debug draw',
    },
    {
      sampleId: SAMPLE.COLLISION_DEBUG_WILDLIFE,
      label: 'Wildlife collision debug draw',
    },
    {
      sampleId: SAMPLE.COLLISION_DEBUG_PLAYER,
      label: 'Player collision debug draw',
    },
    { sampleId: SAMPLE.WILDLIFE_TICK, label: 'Wildlife simulation' },
    { sampleId: SAMPLE.WILDLIFE_LIFECYCLE, label: 'Wildlife lifecycle' },
    { sampleId: SAMPLE.WILDLIFE_SPATIAL_GRID, label: 'Wildlife spatial grid' },
    { sampleId: SAMPLE.WILDLIFE_AI, label: 'Wildlife AI' },
    { sampleId: SAMPLE.WILDLIFE_SEPARATION, label: 'Wildlife separation' },
    {
      sampleId: SAMPLE.WILDLIFE_PLAYER_COLLISION,
      label: 'Wildlife player collision',
    },
    {
      sampleId: SAMPLE.WILDLIFE_STANDING_LAYER_SYNC,
      label: 'Wildlife depth sync',
    },
    {
      sampleId: SAMPLE.WILDLIFE_SNAPSHOT_BUILD,
      label: 'Wildlife snapshot build',
    },
    { sampleId: SAMPLE.WILDLIFE_REMOTE_SYNC, label: 'Remote wildlife sync' },
    { sampleId: SAMPLE.WILDLIFE_RENDER_SYNC, label: 'Wildlife presentation' },
    { sampleId: SAMPLE.PROJECTILE_TICK, label: 'Projectile simulation' },
    { sampleId: SAMPLE.AVATAR_TICK, label: 'Player update' },
    { sampleId: SAMPLE.AVATAR_COLLISION, label: 'Player collision' },
    { sampleId: SAMPLE.AVATAR_AUTO_JUMP_PROBE, label: 'Auto-jump probe' },
    { sampleId: SAMPLE.AVATAR_NAVIGATION_PLAN, label: 'Path planning' },
    { sampleId: SAMPLE.AVATAR_NAVIGATION_REPLAN, label: 'Path replanning' },
    {
      sampleId: SAMPLE.AVATAR_COMBAT_PRESENTATION,
      label: 'Player combat presentation',
    },
    { sampleId: SAMPLE.PLAYER_HEALTH_TICK, label: 'Player health' },
    { sampleId: SAMPLE.PLAYER_STAMINA_TICK, label: 'Player stamina' },
    { sampleId: SAMPLE.PLAYER_HUNGER_TICK, label: 'Player hunger' },
    { sampleId: SAMPLE.AUDIO_SFX_PLAY, label: 'Audio playback' },
    { sampleId: SAMPLE.AUDIO_SFX_VOLUME_SYNC, label: 'Audio volume sync' },
  ];

export type ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity =
  | 'healthy'
  | 'warning'
  | 'critical';

export type ResolvingWorldPlazaPerformanceDiagnosticsFpsCause = {
  readonly sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId;
  readonly label: string;
  readonly severity: ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity;
  readonly score: number;
  readonly pattern: 'sustained' | 'intermittent';
  readonly averageMs: number;
  readonly percentile95Ms: number;
  readonly maxMs: number;
  readonly spikeCount: number;
  readonly measurementCount: number;
  readonly loadLines: readonly string[];
};

export type ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary = {
  readonly severity: ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity;
  readonly headline: string;
  readonly causes: readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsCause[];
  readonly healthyAreas: readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsCause[];
};

function resolvingContributorScore(
  sampleStats: MeasuringWorldPlazaPerformanceDiagnosticsSampleStats
): number {
  const sustainedScore =
    sampleStats.percentile95Ms /
    RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FRAME_BUDGET_MS;
  const recurringSpikeWeight =
    sampleStats.spikeCount <= 0
      ? 0.35
      : 0.75 + Math.min(0.25, sampleStats.spikeCount / 12);
  const spikeScore =
    (sampleStats.maxMs /
      RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_VERY_SLOW_FRAME_MS) *
    recurringSpikeWeight;

  return Math.max(sustainedScore, spikeScore);
}

function resolvingContributorSeverity(
  score: number
): ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity {
  if (score >= RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CRITICAL_SCORE) {
    return 'critical';
  }

  if (score >= RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_WARNING_SCORE) {
    return 'warning';
  }

  return 'healthy';
}

function checkingParentContributorExplainedByChild(
  contributor: ResolvingWorldPlazaPerformanceDiagnosticsFpsCause,
  contributorsBySampleId: ReadonlyMap<
    DefiningWorldPlazaPerformanceDiagnosticsSampleId,
    ResolvingWorldPlazaPerformanceDiagnosticsFpsCause
  >
): boolean {
  const childSampleIds =
    RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CHILD_SAMPLE_IDS_BY_PARENT.get(
      contributor.sampleId
    );

  if (!childSampleIds) {
    return false;
  }

  return childSampleIds.some((childSampleId) => {
    const child = contributorsBySampleId.get(childSampleId);

    if (!child) {
      return false;
    }

    const matchesParentSpike =
      contributor.maxMs > 0 && Math.abs(child.maxMs - contributor.maxMs) <= 2;
    const explainsMostPressure = child.score >= contributor.score * 0.7;

    return matchesParentSpike || explainsMostPressure;
  });
}

/**
 * Ranks measured leaf work by its ability to exceed a 60 FPS frame budget.
 */
export function resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary(
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot
): ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary {
  const samplesById = new Map(
    snapshot.samples.map((sampleStats) => [sampleStats.sampleId, sampleStats])
  );
  const contributors =
    RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CONTRIBUTOR_REGISTRY.flatMap(
      (
        definition
      ): readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsCause[] => {
        const sampleStats = samplesById.get(definition.sampleId);

        if (!sampleStats || sampleStats.measurementCount <= 0) {
          return [];
        }

        const score = resolvingContributorScore(sampleStats);

        return [
          {
            sampleId: definition.sampleId,
            label: definition.label,
            severity: resolvingContributorSeverity(score),
            score,
            pattern:
              sampleStats.percentile95Ms >=
              RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FRAME_BUDGET_MS *
                RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_WARNING_SCORE
                ? 'sustained'
                : 'intermittent',
            averageMs: sampleStats.averageMs,
            percentile95Ms: sampleStats.percentile95Ms,
            maxMs: sampleStats.maxMs,
            spikeCount: sampleStats.spikeCount,
            measurementCount: sampleStats.measurementCount,
            loadLines: definition.loadLines?.(snapshot) ?? [],
          },
        ];
      }
    );
  const contributorsBySampleId = new Map(
    contributors.map((contributor) => [contributor.sampleId, contributor])
  );
  const leafContributors = contributors.filter(
    (contributor) =>
      !checkingParentContributorExplainedByChild(
        contributor,
        contributorsBySampleId
      )
  );
  const rankedContributors = [...leafContributors].sort(
    (left, right) => right.score - left.score
  );
  const causes = rankedContributors
    .filter((contributor) => contributor.severity !== 'healthy')
    .slice(0, RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_MAX_CAUSES);
  const healthyAreas = rankedContributors
    .filter((contributor) => contributor.severity === 'healthy')
    .slice(0, RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_MAX_HEALTHY_AREAS);
  const severity: ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity =
    snapshot.framePercentile95Ms >= 33 ||
    snapshot.verySlowFrameCount > 0 ||
    causes.some((cause) => cause.severity === 'critical')
      ? 'critical'
      : snapshot.framePercentile95Ms >= 20 ||
          snapshot.slowFrameCount >= 4 ||
          causes.length > 0
        ? 'warning'
        : 'healthy';
  const headline =
    causes.length > 0
      ? `${causes[0].label} is the strongest measured FPS limiter.`
      : snapshot.framePercentile95Ms >= 20
        ? 'Frame drops are not explained by an instrumented subsystem yet.'
        : 'No measured subsystem is currently threatening 60 FPS.';

  return { severity, headline, causes, healthyAreas };
}
