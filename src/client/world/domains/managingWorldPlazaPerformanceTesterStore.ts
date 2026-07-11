/**
 * Multistep performance tester suite state machine and baseline restore.
 *
 * @module components/world/domains/managingWorldPlazaPerformanceTesterStore
 */

import {
  applyingWorldPlazaPerformanceTesterRenderLayerFlagsSnapshot,
  applyingWorldPlazaPerformanceTesterStepConfig,
} from '@/components/world/domains/applyingWorldPlazaPerformanceTesterStepConfig';
import type { ComputingWorldPlazaPerformanceTesterStepResult } from '@/components/world/domains/computingWorldPlazaPerformanceTesterStepResult';
import { computingWorldPlazaPerformanceTesterStepResult } from '@/components/world/domains/computingWorldPlazaPerformanceTesterStepResult';
import type {
  DefiningWorldPlazaPerformanceTesterStepDefinition,
  DefiningWorldPlazaPerformanceTesterStepId,
} from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY,
  checkingWorldPlazaPerformanceTesterStepIdIsKnown,
  gettingWorldPlazaPerformanceTesterStepById,
} from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import { checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled } from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { checkingWorldPlazaTerrainCollisionDebugVisible } from '@/components/world/domains/managingWorldPlazaTerrainCollisionDebugVisibilityStore';
import {
  buildingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot,
  buildingWorldPlazaPerformanceDiagnosticsSnapshot,
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  resettingWorldPlazaPerformanceDiagnosticsMeasurementHistory,
  settingWorldPlazaPerformanceDiagnosticsEnabled,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

/** Runner phase for UI and console status. */
export type ManagingWorldPlazaPerformanceTesterPhase =
  | 'idle'
  | 'settling'
  | 'sampling'
  | 'done'
  | 'cancelled';

/** Snapshot of feature toggles restored after a suite or step run. */
export type ManagingWorldPlazaPerformanceTesterBaselineSnapshot = {
  readonly proceduralTreesAndRocksEnabled: boolean;
  readonly collisionDebugVisible: boolean;
  readonly renderLayerFlags: Readonly<Record<string, boolean>>;
};

/** Public store snapshot for React and console consumers. */
export type ManagingWorldPlazaPerformanceTesterStoreSnapshot = {
  readonly phase: ManagingWorldPlazaPerformanceTesterPhase;
  readonly results: readonly ComputingWorldPlazaPerformanceTesterStepResult[];
  readonly currentStepId: DefiningWorldPlazaPerformanceTesterStepId | null;
  readonly currentStepIndex: number;
  readonly totalStepCount: number;
  readonly phaseElapsedMs: number;
  readonly phaseDurationMs: number;
  readonly isPromptingWalk: boolean;
  readonly isRunning: boolean;
};

/** Mutable runner state (module singleton). */
type ManagingWorldPlazaPerformanceTesterMutableState = {
  phase: ManagingWorldPlazaPerformanceTesterPhase;
  results: ComputingWorldPlazaPerformanceTesterStepResult[];
  stepQueue: DefiningWorldPlazaPerformanceTesterStepId[];
  totalStepCount: number;
  currentStepIndex: number;
  currentStepId: DefiningWorldPlazaPerformanceTesterStepId | null;
  currentStepDefinition: DefiningWorldPlazaPerformanceTesterStepDefinition | null;
  phaseStartedAtMs: number;
  phaseDurationMs: number;
  isPromptingWalk: boolean;
  baselineSnapshot: ManagingWorldPlazaPerformanceTesterBaselineSnapshot | null;
  settleTimeoutId: ReturnType<typeof setTimeout> | null;
  sampleTimeoutId: ReturnType<typeof setTimeout> | null;
  progressIntervalId: ReturnType<typeof setInterval> | null;
};

const managingWorldPlazaPerformanceTesterState: ManagingWorldPlazaPerformanceTesterMutableState =
  {
    phase: 'idle',
    results: [],
    stepQueue: [],
    totalStepCount: 0,
    currentStepIndex: 0,
    currentStepId: null,
    currentStepDefinition: null,
    phaseStartedAtMs: 0,
    phaseDurationMs: 0,
    isPromptingWalk: false,
    baselineSnapshot: null,
    settleTimeoutId: null,
    sampleTimeoutId: null,
    progressIntervalId: null,
  };

const managingWorldPlazaPerformanceTesterSubscribers = new Set<() => void>();

/**
 * Captures current plaza feature toggles before a tester run mutates them.
 */
function capturingWorldPlazaPerformanceTesterBaselineSnapshot(): ManagingWorldPlazaPerformanceTesterBaselineSnapshot {
  return {
    proceduralTreesAndRocksEnabled:
      checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled(),
    collisionDebugVisible: checkingWorldPlazaTerrainCollisionDebugVisible(),
    renderLayerFlags:
      buildingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot(),
  };
}

/**
 * Restores feature toggles captured at suite start.
 *
 * @param baselineSnapshot - Snapshot taken before the first step.
 */
function restoringWorldPlazaPerformanceTesterBaselineSnapshot(
  baselineSnapshot: ManagingWorldPlazaPerformanceTesterBaselineSnapshot
): void {
  applyingWorldPlazaPerformanceTesterRenderLayerFlagsSnapshot(
    baselineSnapshot.renderLayerFlags
  );
  applyingWorldPlazaPerformanceTesterStepConfig({
    proceduralTreesAndRocks: baselineSnapshot.proceduralTreesAndRocksEnabled,
    collisionDebugVisible: baselineSnapshot.collisionDebugVisible,
  });
}

/**
 * Clears active runner timers.
 */
function clearingWorldPlazaPerformanceTesterTimers(): void {
  if (managingWorldPlazaPerformanceTesterState.settleTimeoutId !== null) {
    clearTimeout(managingWorldPlazaPerformanceTesterState.settleTimeoutId);
    managingWorldPlazaPerformanceTesterState.settleTimeoutId = null;
  }

  if (managingWorldPlazaPerformanceTesterState.sampleTimeoutId !== null) {
    clearTimeout(managingWorldPlazaPerformanceTesterState.sampleTimeoutId);
    managingWorldPlazaPerformanceTesterState.sampleTimeoutId = null;
  }

  if (managingWorldPlazaPerformanceTesterState.progressIntervalId !== null) {
    clearInterval(managingWorldPlazaPerformanceTesterState.progressIntervalId);
    managingWorldPlazaPerformanceTesterState.progressIntervalId = null;
  }
}

/**
 * Notifies React subscribers that runner state changed.
 */
function notifyingWorldPlazaPerformanceTesterSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaPerformanceTesterSubscribers) {
    onStoreChange();
  }
}

/**
 * Starts the sampling window for the active step.
 *
 * @param stepDefinition - Active registry step.
 */
function beginningWorldPlazaPerformanceTesterSampling(
  stepDefinition: DefiningWorldPlazaPerformanceTesterStepDefinition
): void {
  resettingWorldPlazaPerformanceDiagnosticsMeasurementHistory();

  managingWorldPlazaPerformanceTesterState.phase = 'sampling';
  managingWorldPlazaPerformanceTesterState.phaseStartedAtMs = performance.now();
  managingWorldPlazaPerformanceTesterState.phaseDurationMs =
    stepDefinition.sampleMs;
  notifyingWorldPlazaPerformanceTesterSubscribers();

  managingWorldPlazaPerformanceTesterState.progressIntervalId = setInterval(
    () => {
      notifyingWorldPlazaPerformanceTesterSubscribers();
    },
    100
  );

  managingWorldPlazaPerformanceTesterState.sampleTimeoutId = setTimeout(() => {
    finishingWorldPlazaPerformanceTesterSampling(stepDefinition);
  }, stepDefinition.sampleMs);
}

/**
 * Records one step result and advances the queue.
 *
 * @param stepDefinition - Completed registry step.
 */
function finishingWorldPlazaPerformanceTesterSampling(
  stepDefinition: DefiningWorldPlazaPerformanceTesterStepDefinition
): void {
  clearingWorldPlazaPerformanceTesterTimers();

  const diagnosticsSnapshot =
    buildingWorldPlazaPerformanceDiagnosticsSnapshot();
  const stepResult = computingWorldPlazaPerformanceTesterStepResult(
    stepDefinition.id,
    stepDefinition.label,
    diagnosticsSnapshot
  );

  managingWorldPlazaPerformanceTesterState.results.push(stepResult);
  managingWorldPlazaPerformanceTesterState.isPromptingWalk = false;
  managingWorldPlazaPerformanceTesterState.currentStepDefinition = null;

  const nextStepId = managingWorldPlazaPerformanceTesterState.stepQueue.shift();

  if (nextStepId) {
    managingWorldPlazaPerformanceTesterState.currentStepIndex += 1;
    runningWorldPlazaPerformanceTesterStep(nextStepId);
    return;
  }

  finishingWorldPlazaPerformanceTesterRun('done');
}

/**
 * Restores baseline toggles and settles runner phase.
 *
 * @param phase - Terminal phase after the run ends.
 */
function finishingWorldPlazaPerformanceTesterRun(
  phase: Extract<ManagingWorldPlazaPerformanceTesterPhase, 'done' | 'cancelled'>
): void {
  clearingWorldPlazaPerformanceTesterTimers();

  const baselineSnapshot =
    managingWorldPlazaPerformanceTesterState.baselineSnapshot;

  if (baselineSnapshot) {
    restoringWorldPlazaPerformanceTesterBaselineSnapshot(baselineSnapshot);
  }

  managingWorldPlazaPerformanceTesterState.phase = phase;
  managingWorldPlazaPerformanceTesterState.stepQueue = [];
  managingWorldPlazaPerformanceTesterState.currentStepId = null;
  managingWorldPlazaPerformanceTesterState.currentStepDefinition = null;
  managingWorldPlazaPerformanceTesterState.isPromptingWalk = false;
  managingWorldPlazaPerformanceTesterState.baselineSnapshot = null;
  notifyingWorldPlazaPerformanceTesterSubscribers();
}

/**
 * Applies one step config and waits for settle before sampling.
 *
 * @param stepId - Registry step id.
 */
function runningWorldPlazaPerformanceTesterStep(
  stepId: DefiningWorldPlazaPerformanceTesterStepId
): void {
  const stepDefinition = gettingWorldPlazaPerformanceTesterStepById(stepId);

  applyingWorldPlazaPerformanceTesterStepConfig(stepDefinition.config);

  managingWorldPlazaPerformanceTesterState.currentStepId = stepId;
  managingWorldPlazaPerformanceTesterState.currentStepDefinition =
    stepDefinition;
  managingWorldPlazaPerformanceTesterState.isPromptingWalk =
    stepDefinition.promptWalk ?? false;
  managingWorldPlazaPerformanceTesterState.phase = 'settling';
  managingWorldPlazaPerformanceTesterState.phaseStartedAtMs = performance.now();
  managingWorldPlazaPerformanceTesterState.phaseDurationMs =
    stepDefinition.settleMs;
  notifyingWorldPlazaPerformanceTesterSubscribers();

  managingWorldPlazaPerformanceTesterState.settleTimeoutId = setTimeout(() => {
    beginningWorldPlazaPerformanceTesterSampling(stepDefinition);
  }, stepDefinition.settleMs);
}

/**
 * Starts a queued run after capturing baseline toggles.
 *
 * @param stepIds - Ordered step ids to execute.
 */
function startingWorldPlazaPerformanceTesterRun(
  stepIds: readonly DefiningWorldPlazaPerformanceTesterStepId[]
): void {
  if (
    managingWorldPlazaPerformanceTesterState.phase === 'settling' ||
    managingWorldPlazaPerformanceTesterState.phase === 'sampling'
  ) {
    return;
  }

  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    settingWorldPlazaPerformanceDiagnosticsEnabled(true);
  }

  clearingWorldPlazaPerformanceTesterTimers();

  managingWorldPlazaPerformanceTesterState.baselineSnapshot =
    capturingWorldPlazaPerformanceTesterBaselineSnapshot();
  managingWorldPlazaPerformanceTesterState.stepQueue = [...stepIds];
  managingWorldPlazaPerformanceTesterState.totalStepCount = stepIds.length;
  managingWorldPlazaPerformanceTesterState.currentStepIndex = 1;

  const firstStepId =
    managingWorldPlazaPerformanceTesterState.stepQueue.shift();

  if (!firstStepId) {
    return;
  }

  runningWorldPlazaPerformanceTesterStep(firstStepId);
}

/**
 * Returns the public runner snapshot for UI and console consumers.
 */
export function gettingWorldPlazaPerformanceTesterStoreSnapshot(): ManagingWorldPlazaPerformanceTesterStoreSnapshot {
  const phaseElapsedMs =
    managingWorldPlazaPerformanceTesterState.phase === 'idle' ||
    managingWorldPlazaPerformanceTesterState.phase === 'done' ||
    managingWorldPlazaPerformanceTesterState.phase === 'cancelled'
      ? 0
      : Math.max(
          0,
          performance.now() -
            managingWorldPlazaPerformanceTesterState.phaseStartedAtMs
        );

  return {
    phase: managingWorldPlazaPerformanceTesterState.phase,
    results: [...managingWorldPlazaPerformanceTesterState.results],
    currentStepId: managingWorldPlazaPerformanceTesterState.currentStepId,
    currentStepIndex: managingWorldPlazaPerformanceTesterState.currentStepIndex,
    totalStepCount: managingWorldPlazaPerformanceTesterState.totalStepCount,
    phaseElapsedMs,
    phaseDurationMs: managingWorldPlazaPerformanceTesterState.phaseDurationMs,
    isPromptingWalk: managingWorldPlazaPerformanceTesterState.isPromptingWalk,
    isRunning:
      managingWorldPlazaPerformanceTesterState.phase === 'settling' ||
      managingWorldPlazaPerformanceTesterState.phase === 'sampling',
  };
}

/**
 * Returns recorded step results.
 */
export function gettingWorldPlazaPerformanceTesterResults(): readonly ComputingWorldPlazaPerformanceTesterStepResult[] {
  return [...managingWorldPlazaPerformanceTesterState.results];
}

/**
 * Runs the full declarative step suite in registry order.
 */
export function startingWorldPlazaPerformanceTesterSuite(): void {
  startingWorldPlazaPerformanceTesterRun(
    DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY.map((step) => step.id)
  );
}

/**
 * Runs one registry step with the same settle and sample pipeline.
 *
 * @param stepId - Registry step id.
 */
export function startingWorldPlazaPerformanceTesterStep(
  stepId: DefiningWorldPlazaPerformanceTesterStepId
): void {
  startingWorldPlazaPerformanceTesterRun([stepId]);
}

/**
 * Cancels the active suite or single-step run and restores baseline toggles.
 */
export function cancellingWorldPlazaPerformanceTesterRun(): void {
  if (
    managingWorldPlazaPerformanceTesterState.phase !== 'settling' &&
    managingWorldPlazaPerformanceTesterState.phase !== 'sampling'
  ) {
    return;
  }

  finishingWorldPlazaPerformanceTesterRun('cancelled');
}

/**
 * Clears stored step results and resets idle status when not running.
 */
export function clearingWorldPlazaPerformanceTesterResults(): void {
  if (
    managingWorldPlazaPerformanceTesterState.phase === 'settling' ||
    managingWorldPlazaPerformanceTesterState.phase === 'sampling'
  ) {
    return;
  }

  managingWorldPlazaPerformanceTesterState.results = [];
  managingWorldPlazaPerformanceTesterState.phase = 'idle';
  managingWorldPlazaPerformanceTesterState.currentStepId = null;
  managingWorldPlazaPerformanceTesterState.currentStepIndex = 0;
  managingWorldPlazaPerformanceTesterState.totalStepCount = 0;
  notifyingWorldPlazaPerformanceTesterSubscribers();
}

/**
 * Subscribes to runner state changes.
 *
 * @param onStoreChange - Callback invoked when runner state changes.
 */
export function subscribingWorldPlazaPerformanceTesterStore(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaPerformanceTesterSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaPerformanceTesterSubscribers.delete(onStoreChange);
  };
}

/**
 * Runs one step when the id string is known; no-op otherwise.
 *
 * @param stepId - Candidate registry step id.
 */
export function startingWorldPlazaPerformanceTesterStepByIdString(
  stepId: string
): void {
  if (!checkingWorldPlazaPerformanceTesterStepIdIsKnown(stepId)) {
    console.warn(`[world-plaza-perf] unknown perf tester step: ${stepId}`);
    return;
  }

  startingWorldPlazaPerformanceTesterStep(stepId);
}
