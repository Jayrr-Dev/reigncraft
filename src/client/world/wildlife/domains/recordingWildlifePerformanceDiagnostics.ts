/**
 * Publishes wildlife population and workload gauges to plaza diagnostics.
 *
 * @module components/world/wildlife/domains/recordingWildlifePerformanceDiagnostics
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  type DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  checkingWildlifeSpeciesTexturesAreResolved,
  listingWildlifeSpeciesTexturesCacheIds,
} from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';

export type RecordingWildlifePerformanceDiagnosticsParams = {
  readonly instances: readonly DefiningWildlifeInstance[];
  readonly presentationInstanceIds: {
    readonly size: number;
    readonly has: (instanceId: string) => boolean;
  };
  readonly playerPosition: DefiningWorldPlazaWorldPoint | null;
  readonly presentationCullGridRadius: number;
  readonly simulationStepsThisFrame: number;
  readonly simulationBacklogMs: number;
  readonly isSimulationLeader: boolean;
  readonly snapshotCount: number;
  readonly playerContactCount: number;
};

type RecordingWildlifePerformanceDiagnosticsGaugeEntry = readonly [
  DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
  number,
];

type RecordingWildlifePerformanceIntentCategory =
  | 'idle'
  | 'roaming'
  | 'fleeing'
  | 'combat'
  | 'stalking'
  | 'social'
  | 'foraging';

const RECORDING_WILDLIFE_PERFORMANCE_INTENT_CATEGORY_BY_MODE = {
  idle: 'idle',
  graze: 'idle',
  wander: 'roaming',
  return: 'roaming',
  flee: 'fleeing',
  chase: 'combat',
  attack: 'combat',
  territoryWarn: 'combat',
  stalk: 'stalking',
  followGuardian: 'social',
  seekPackmate: 'social',
  followPlayer: 'social',
  forageChase: 'foraging',
  forageEat: 'foraging',
} as const satisfies Record<
  DefiningWildlifeBehaviorIntent['mode'],
  RecordingWildlifePerformanceIntentCategory
>;

/**
 * Records a detailed point-in-time wildlife workload snapshot.
 */
export function recordingWildlifePerformanceDiagnostics({
  instances,
  presentationInstanceIds,
  playerPosition,
  presentationCullGridRadius,
  simulationStepsThisFrame,
  simulationBacklogMs,
  isSimulationLeader,
  snapshotCount,
  playerContactCount,
}: RecordingWildlifePerformanceDiagnosticsParams): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  let liveCount = 0;
  let corpseCount = 0;
  let movingCount = 0;
  let sleepingCount = 0;
  let jumpingCount = 0;
  let aggroCount = 0;
  const intentCategoryCounts: Record<
    RecordingWildlifePerformanceIntentCategory,
    number
  > = {
    idle: 0,
    roaming: 0,
    fleeing: 0,
    combat: 0,
    stalking: 0,
    social: 0,
    foraging: 0,
  };
  let culledPresentationCount = 0;
  const liveSpeciesIds = new Set<string>();

  for (const instance of instances) {
    if (instance.isDead) {
      corpseCount += 1;
    } else {
      liveCount += 1;
      liveSpeciesIds.add(instance.speciesId);
    }

    if (instance.aiState.isMoving) {
      movingCount += 1;
    }

    if (instance.aiState.isSleeping) {
      sleepingCount += 1;
    }

    if (instance.aiState.jumpState) {
      jumpingCount += 1;
    }

    if (instance.aggroState.activeTargetId !== null) {
      aggroCount += 1;
    }

    const intentCategory =
      RECORDING_WILDLIFE_PERFORMANCE_INTENT_CATEGORY_BY_MODE[
        instance.aiState.intent.mode
      ];
    intentCategoryCounts[intentCategory] += 1;

    if (
      presentationInstanceIds.has(instance.instanceId) &&
      playerPosition &&
      presentationCullGridRadius < 999 &&
      (Math.abs(instance.position.x - playerPosition.x) >
        presentationCullGridRadius ||
        Math.abs(instance.position.y - playerPosition.y) >
          presentationCullGridRadius)
    ) {
      culledPresentationCount += 1;
    }
  }

  const loadedSpeciesCount = listingWildlifeSpeciesTexturesCacheIds().filter(
    checkingWildlifeSpeciesTexturesAreResolved
  ).length;
  const gaugeEntries: readonly RecordingWildlifePerformanceDiagnosticsGaugeEntry[] =
    [
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_INSTANCE_COUNT,
        instances.length,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_LIVE_COUNT,
        liveCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_CORPSE_COUNT,
        corpseCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_MOVING_COUNT,
        movingCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_SLEEPING_COUNT,
        sleepingCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_JUMPING_COUNT,
        jumpingCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_AGGRO_COUNT,
        aggroCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_IDLE_COUNT,
        intentCategoryCounts.idle,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_ROAMING_COUNT,
        intentCategoryCounts.roaming,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_FLEEING_COUNT,
        intentCategoryCounts.fleeing,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_COMBAT_COUNT,
        intentCategoryCounts.combat,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_STALKING_COUNT,
        intentCategoryCounts.stalking,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_SOCIAL_COUNT,
        intentCategoryCounts.social,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_FORAGING_COUNT,
        intentCategoryCounts.foraging,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_MOUNTED_PRESENTATION_COUNT,
        presentationInstanceIds.size,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_CULLED_PRESENTATION_COUNT,
        culledPresentationCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_LIVE_SPECIES_COUNT,
        liveSpeciesIds.size,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_LOADED_SPECIES_COUNT,
        loadedSpeciesCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_SIM_STEPS_THIS_FRAME,
        simulationStepsThisFrame,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_SIM_BACKLOG_MS,
        simulationBacklogMs,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_IS_SIMULATION_LEADER,
        isSimulationLeader ? 1 : 0,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_SNAPSHOT_COUNT,
        snapshotCount,
      ],
      [
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.WILDLIFE_PLAYER_CONTACT_COUNT,
        playerContactCount,
      ],
    ];

  for (const [gaugeId, value] of gaugeEntries) {
    settingWorldPlazaPerformanceDiagnosticsGauge(gaugeId, value);
  }
}
