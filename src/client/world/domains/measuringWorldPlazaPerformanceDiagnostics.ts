import { detectingWorldPlazaDevEnvironment } from '@/components/world/building/domains/detectingWorldPlazaDevEnvironment';
import { checkingWorldPlazaMobileDebugFeatureIsAvailable } from '@/components/world/domains/checkingWorldPlazaMobileDebug';
import {
  checkingWorldPlazaStarAudioPreloadIsDisabled,
  settingWorldPlazaStarAudioPreloadDisabled,
} from '@/components/world/domains/checkingWorldPlazaStarAudioPreloadIsDisabled';
import type { ComputingWorldPlazaPerformanceTesterStepResult } from '@/components/world/domains/computingWorldPlazaPerformanceTesterStepResult';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ENV_ENABLED,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FRAME_HISTORY_SIZE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_DISPLAY_ORDER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_HISTORY_SIZE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SLOW_FRAME_THRESHOLD_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SPIKE_LOG_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SPIKE_THRESHOLD_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_URL_QUERY_KEY,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_URL_QUERY_VALUE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_VERY_SLOW_FRAME_THRESHOLD_MS,
  type DefiningWorldPlazaPerformanceDiagnosticsCounterId,
  type DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
  type DefiningWorldPlazaPerformanceDiagnosticsSampleId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS,
  type DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import {
  cancellingWorldPlazaPerformanceTesterRun,
  gettingWorldPlazaPerformanceTesterResults,
  startingWorldPlazaPerformanceTesterStepByIdString,
  startingWorldPlazaPerformanceTesterSuite,
} from '@/components/world/domains/managingWorldPlazaPerformanceTesterStore';

/**
 * In-memory performance diagnostics store for the plaza Pixi scene.
 *
 * @module components/world/domains/measuringWorldPlazaPerformanceDiagnostics
 */

/** No-op used when diagnostics are disabled. */
const MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NO_OP = (): void => {};

type MeasuringWorldPlazaPerformanceDiagnosticsPooledTimer = {
  startedAtMs: number;
  isActive: boolean;
  finish: () => void;
};

/**
 * Reuses timer closures after warmup. Active diagnostics start many nested
 * samples per frame; allocating one closure per sample creates GC pauses that
 * appear as unaccounted slow frames in the tool being used to find them.
 */
const MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TIMER_POOL_BY_SAMPLE_ID =
  new Map<
    DefiningWorldPlazaPerformanceDiagnosticsSampleId,
    MeasuringWorldPlazaPerformanceDiagnosticsPooledTimer[]
  >();

/** Global console API attached to `window.__WORLD_PLAZA_PERF__`. */
export const MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CONSOLE_API_KEY =
  '__WORLD_PLAZA_PERF__' as const;

/** Aggregated stats for one instrumented sample. */
export interface MeasuringWorldPlazaPerformanceDiagnosticsSampleStats {
  readonly sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId;
  readonly averageMs: number;
  readonly percentile95Ms: number;
  readonly percentile99Ms: number;
  readonly maxMs: number;
  readonly lastMs: number;
  readonly measurementCount: number;
  readonly spikeCount: number;
}

/** Snapshot consumed by the HUD and console dump. */
export interface MeasuringWorldPlazaPerformanceDiagnosticsSnapshot {
  readonly isEnabled: boolean;
  readonly capturedAtMs: number;
  readonly framesPerSecond: number;
  /** Mean FPS since diagnostics were last enabled or history reset. */
  readonly sessionFramesPerSecond: number;
  /**
   * Lowest FPS since diagnostics were last enabled or history reset
   * (`1000 /` worst frame delta).
   */
  readonly sessionMinimumFramesPerSecond: number;
  /** Frame deltas accumulated into `sessionFramesPerSecond`. */
  readonly sessionFrameCount: number;
  readonly frameAverageMs: number;
  readonly framePercentile95Ms: number;
  readonly framePercentile99Ms: number;
  readonly frameMaxMs: number;
  readonly slowFrameCount: number;
  readonly verySlowFrameCount: number;
  readonly jsHeapUsedMb: number | null;
  /**
   * Sum of per-sample averageMs. Not a perfect partition of the frame (samples
   * can overlap or sit on other rAF loops), but when this is ~1ms and
   * frameAverageMs is ~20ms+, cost is outside instrumented plaza blocks.
   */
  readonly sampleAverageSumMs: number;
  /** max(0, frameAverageMs - sampleAverageSumMs). */
  readonly unaccountedFrameAverageMs: number;
  readonly samples: readonly MeasuringWorldPlazaPerformanceDiagnosticsSampleStats[];
  readonly gauges: Readonly<Record<string, number>>;
  readonly countersPerSecond: Readonly<Record<string, number>>;
  readonly recentSpikeLines: readonly string[];
  readonly renderLayerFlags: Readonly<Record<string, boolean>>;
}

/** Console helpers exposed on `window.__WORLD_PLAZA_PERF__`. */
export interface MeasuringWorldPlazaPerformanceDiagnosticsConsoleApi {
  readonly enable: () => void;
  readonly disable: () => void;
  readonly isEnabled: () => boolean;
  readonly getSnapshot: () => MeasuringWorldPlazaPerformanceDiagnosticsSnapshot;
  readonly dump: () => MeasuringWorldPlazaPerformanceDiagnosticsSnapshot;
  readonly reset: () => void;
  readonly getRenderLayers: () => Readonly<Record<string, boolean>>;
  readonly setRenderLayer: (
    layerId: DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
    isEnabled: boolean
  ) => void;
  readonly toggleRenderLayer: (
    layerId: DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId
  ) => boolean;
  readonly runPerfSuite: () => void;
  readonly runPerfStep: (stepId: string) => void;
  readonly cancelPerfSuite: () => void;
  readonly getPerfSuiteResults: () => readonly ComputingWorldPlazaPerformanceTesterStepResult[];
  /**
   * Skips eager star-audio preload (boot + runtime hooks). Persists in
   * sessionStorage; reload to skip the loading-bar audio step. Clips still
   * load on first play.
   */
  readonly skipAudioPreload: (isDisabled?: boolean) => boolean;
  readonly isAudioPreloadSkipped: () => boolean;
}

interface MeasuringWorldPlazaPerformanceDiagnosticsMutableSampleStats {
  durationsMs: number[];
  spikeCount: number;
}

/** Mutable diagnostics state (module singleton). */
interface MeasuringWorldPlazaPerformanceDiagnosticsState {
  isEnabled: boolean;
  frameDurationsMs: number[];
  sampleStatsById: Map<
    DefiningWorldPlazaPerformanceDiagnosticsSampleId,
    MeasuringWorldPlazaPerformanceDiagnosticsMutableSampleStats
  >;
  gaugesById: Map<DefiningWorldPlazaPerformanceDiagnosticsGaugeId, number>;
  counterTotalsById: Map<
    DefiningWorldPlazaPerformanceDiagnosticsCounterId,
    number
  >;
  counterWindowStartedAtMs: number;
  recentSpikeLines: string[];
  lastSpikeLoggedAtMs: number;
  lastFrameMarkedAtMs: number;
  sessionFrameDurationSumMs: number;
  sessionFrameMaxMs: number;
  sessionFrameCount: number;
  isConsoleApiRegistered: boolean;
  renderLayerFlagsById: Map<
    DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
    boolean
  >;
}

/**
 * Builds the default render-layer flag map (all layers on).
 */
function initializingWorldPlazaPerformanceDiagnosticsRenderLayerFlags(): Map<
  DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
  boolean
> {
  const renderLayerFlagsById = new Map<
    DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
    boolean
  >();

  for (const layerDefinition of DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS) {
    renderLayerFlagsById.set(
      layerDefinition.layerId,
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED
    );
  }

  return renderLayerFlagsById;
}

const measuringWorldPlazaPerformanceDiagnosticsState: MeasuringWorldPlazaPerformanceDiagnosticsState =
  {
    isEnabled: false,
    frameDurationsMs: [],
    sampleStatsById: new Map(),
    gaugesById: new Map(),
    counterTotalsById: new Map(),
    counterWindowStartedAtMs: performance.now(),
    recentSpikeLines: [],
    lastSpikeLoggedAtMs: 0,
    lastFrameMarkedAtMs: 0,
    sessionFrameDurationSumMs: 0,
    sessionFrameMaxMs: 0,
    sessionFrameCount: 0,
    isConsoleApiRegistered: false,
    renderLayerFlagsById:
      initializingWorldPlazaPerformanceDiagnosticsRenderLayerFlags(),
  };

/**
 * Cached render-layer flags for `useSyncExternalStore`.
 * Replaced with a new object on every change so React sees identity updates
 * (in-place mutation made Reset / toggles look broken).
 */
let measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache: Readonly<
  Record<string, boolean>
> = {};

/**
 * Rebuilds the cached render-layer snapshot with a new object identity.
 */
function refreshingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache(): void {
  const nextSnapshot: Record<string, boolean> = {};

  for (const layerDefinition of DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS) {
    nextSnapshot[layerDefinition.layerId] =
      measuringWorldPlazaPerformanceDiagnosticsState.renderLayerFlagsById.get(
        layerDefinition.layerId
      ) ??
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED;
  }

  measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache =
    nextSnapshot;
}

refreshingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache();

/**
 * Returns the cached render-layer flags object for React subscriptions.
 */
export function buildingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot(): Readonly<
  Record<string, boolean>
> {
  return measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache;
}

/**
 * Returns a copy of render-layer flags for JSON export.
 */
export function copyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot(): Readonly<
  Record<string, boolean>
> {
  return {
    ...measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache,
  };
}

/**
 * Returns true when a render layer should draw (always true when diagnostics off).
 *
 * @param layerId - Render layer identifier.
 */
export function checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
  layerId: DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId
): boolean {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return true;
  }

  return (
    measuringWorldPlazaPerformanceDiagnosticsState.renderLayerFlagsById.get(
      layerId
    ) ??
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED
  );
}

/**
 * Sets one render-layer flag.
 *
 * @param layerId - Render layer identifier.
 * @param isEnabled - True to draw the layer while diagnostics are active.
 */
export function settingWorldPlazaPerformanceDiagnosticsRenderLayer(
  layerId: DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
  isEnabled: boolean
): void {
  measuringWorldPlazaPerformanceDiagnosticsState.renderLayerFlagsById.set(
    layerId,
    isEnabled
  );
  refreshingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache();
  notifyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagSubscribers();
}

/**
 * Flips one render-layer flag and returns the new enabled state.
 *
 * @param layerId - Render layer identifier.
 */
export function togglingWorldPlazaPerformanceDiagnosticsRenderLayer(
  layerId: DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId
): boolean {
  const currentIsEnabled =
    measuringWorldPlazaPerformanceDiagnosticsState.renderLayerFlagsById.get(
      layerId
    ) ??
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED;
  const nextIsEnabled = !currentIsEnabled;

  settingWorldPlazaPerformanceDiagnosticsRenderLayer(layerId, nextIsEnabled);
  return nextIsEnabled;
}

/**
 * Resets every render-layer flag to the default enabled state.
 */
export function resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags(): void {
  measuringWorldPlazaPerformanceDiagnosticsState.renderLayerFlagsById =
    initializingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  refreshingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshotCache();
  notifyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagSubscribers();
}

/** Render-layer flag subscribers (React DOM layers). */
const measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagSubscribers =
  new Set<() => void>();

/**
 * Subscribes to render-layer flag changes.
 *
 * @param onStoreChange - Called when any render-layer flag changes.
 */
export function subscribingWorldPlazaPerformanceDiagnosticsRenderLayerFlags(
  onStoreChange: () => void
): () => void {
  measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagSubscribers.add(
    onStoreChange
  );

  return () => {
    measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagSubscribers.delete(
      onStoreChange
    );
  };
}

/**
 * Notifies React subscribers that render-layer flags changed.
 */
function notifyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagSubscribers(): void {
  for (const onStoreChange of measuringWorldPlazaPerformanceDiagnosticsRenderLayerFlagSubscribers) {
    onStoreChange();
  }
}

/**
 * Returns true when diagnostics should be available in this browser session.
 */
export function checkingWorldPlazaPerformanceDiagnosticsFeatureIsAvailable(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ENV_ENABLED;
  }

  if (DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ENV_ENABLED) {
    return true;
  }

  if (checkingWorldPlazaMobileDebugFeatureIsAvailable()) {
    return true;
  }

  return detectingWorldPlazaDevEnvironment();
}

/**
 * Returns true when the URL query enables diagnostics on first load.
 */
export function checkingWorldPlazaPerformanceDiagnosticsUrlQueryIsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const queryValue = new URLSearchParams(window.location.search).get(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_URL_QUERY_KEY
  );

  return (
    queryValue === DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_URL_QUERY_VALUE
  );
}

/**
 * Returns whether diagnostics collection is active.
 */
export function checkingWorldPlazaPerformanceDiagnosticsIsEnabled(): boolean {
  return measuringWorldPlazaPerformanceDiagnosticsState.isEnabled;
}

/**
 * Enables or disables diagnostics collection.
 *
 * @param isEnabled - True to start recording samples.
 */
export function settingWorldPlazaPerformanceDiagnosticsEnabled(
  isEnabled: boolean
): void {
  measuringWorldPlazaPerformanceDiagnosticsState.isEnabled = isEnabled;

  if (isEnabled) {
    resettingWorldPlazaPerformanceDiagnostics();
    registeringWorldPlazaPerformanceDiagnosticsConsoleApi();
    installingWorldPlazaPerformanceDiagnosticsErrorListener();
    return;
  }

  console.info('[world-plaza-perf] diagnostics disabled');
}

/**
 * Clears frame and sample histories without touching render-layer flags.
 */
export function resettingWorldPlazaPerformanceDiagnosticsMeasurementHistory(): void {
  measuringWorldPlazaPerformanceDiagnosticsState.frameDurationsMs = [];
  measuringWorldPlazaPerformanceDiagnosticsState.sampleStatsById.clear();
  measuringWorldPlazaPerformanceDiagnosticsState.gaugesById.clear();
  measuringWorldPlazaPerformanceDiagnosticsState.counterTotalsById.clear();
  measuringWorldPlazaPerformanceDiagnosticsState.counterWindowStartedAtMs =
    performance.now();
  measuringWorldPlazaPerformanceDiagnosticsState.recentSpikeLines = [];
  measuringWorldPlazaPerformanceDiagnosticsState.lastSpikeLoggedAtMs = 0;
  measuringWorldPlazaPerformanceDiagnosticsState.lastFrameMarkedAtMs = 0;
  measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameDurationSumMs = 0;
  measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameMaxMs = 0;
  measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameCount = 0;
}

/**
 * Clears rolling histories without changing the enabled flag.
 */
export function resettingWorldPlazaPerformanceDiagnostics(): void {
  resettingWorldPlazaPerformanceDiagnosticsMeasurementHistory();
  resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
}

/**
 * Marks one animation frame boundary for FPS tracking.
 */
export function markingWorldPlazaPerformanceDiagnosticsFrame(): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  const nowMs = performance.now();
  const lastFrameMarkedAtMs =
    measuringWorldPlazaPerformanceDiagnosticsState.lastFrameMarkedAtMs;

  if (lastFrameMarkedAtMs > 0) {
    const frameDurationMs = nowMs - lastFrameMarkedAtMs;
    pushMeasuringWorldPlazaPerformanceDiagnosticsRingValue(
      measuringWorldPlazaPerformanceDiagnosticsState.frameDurationsMs,
      frameDurationMs,
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FRAME_HISTORY_SIZE
    );
    measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameDurationSumMs +=
      frameDurationMs;
    measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameMaxMs = Math.max(
      measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameMaxMs,
      frameDurationMs
    );
    measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameCount += 1;
  }

  measuringWorldPlazaPerformanceDiagnosticsState.lastFrameMarkedAtMs = nowMs;
}

/**
 * Starts timing one instrumented block.
 *
 * @param sampleId - Sample identifier.
 */
export function beginningWorldPlazaPerformanceSample(
  sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId
): () => void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NO_OP;
  }

  let timerPool =
    MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TIMER_POOL_BY_SAMPLE_ID.get(
      sampleId
    );

  if (!timerPool) {
    timerPool = [];
    MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TIMER_POOL_BY_SAMPLE_ID.set(
      sampleId,
      timerPool
    );
  }

  let timer = timerPool.pop();

  if (!timer) {
    timer = {
      startedAtMs: 0,
      isActive: false,
      finish: MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NO_OP,
    };
    const pooledTimer = timer;
    pooledTimer.finish = () => {
      if (!pooledTimer.isActive) {
        return;
      }

      pooledTimer.isActive = false;
      const durationMs = performance.now() - pooledTimer.startedAtMs;
      timerPool.push(pooledTimer);
      recordingWorldPlazaPerformanceSampleDuration(sampleId, durationMs);
    };
  }

  timer.startedAtMs = performance.now();
  timer.isActive = true;

  return timer.finish;
}

/**
 * Records one completed sample duration.
 *
 * @param sampleId - Sample identifier.
 * @param durationMs - Elapsed milliseconds.
 */
export function recordingWorldPlazaPerformanceSampleDuration(
  sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId,
  durationMs: number
): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  let sampleStats =
    measuringWorldPlazaPerformanceDiagnosticsState.sampleStatsById.get(
      sampleId
    );

  if (!sampleStats) {
    sampleStats = {
      durationsMs: [],
      spikeCount: 0,
    };
    measuringWorldPlazaPerformanceDiagnosticsState.sampleStatsById.set(
      sampleId,
      sampleStats
    );
  }

  pushMeasuringWorldPlazaPerformanceDiagnosticsRingValue(
    sampleStats.durationsMs,
    durationMs,
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_HISTORY_SIZE
  );

  if (
    durationMs >=
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SPIKE_THRESHOLD_MS
  ) {
    sampleStats.spikeCount += 1;
    recordingWorldPlazaPerformanceDiagnosticsSpikeLine(sampleId, durationMs);
  }
}

/**
 * Updates one live gauge value.
 *
 * @param gaugeId - Gauge identifier.
 * @param value - Current value.
 */
export function settingWorldPlazaPerformanceDiagnosticsGauge(
  gaugeId: DefiningWorldPlazaPerformanceDiagnosticsGaugeId,
  value: number
): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  measuringWorldPlazaPerformanceDiagnosticsState.gaugesById.set(gaugeId, value);
}

/**
 * Increments one event counter.
 *
 * @param counterId - Counter identifier.
 * @param increment - Amount to add (default 1).
 */
export function incrementingWorldPlazaPerformanceDiagnosticsCounter(
  counterId: DefiningWorldPlazaPerformanceDiagnosticsCounterId,
  increment = 1
): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  const currentTotal =
    measuringWorldPlazaPerformanceDiagnosticsState.counterTotalsById.get(
      counterId
    ) ?? 0;

  measuringWorldPlazaPerformanceDiagnosticsState.counterTotalsById.set(
    counterId,
    currentTotal + increment
  );
}

/**
 * Builds a snapshot for the HUD or console dump.
 */
export function buildingWorldPlazaPerformanceDiagnosticsSnapshot(): MeasuringWorldPlazaPerformanceDiagnosticsSnapshot {
  const frameDurationsMs =
    measuringWorldPlazaPerformanceDiagnosticsState.frameDurationsMs;
  const frameAverageMs =
    computingMeasuringWorldPlazaPerformanceDiagnosticsAverage(frameDurationsMs);
  const framesPerSecond = frameAverageMs > 0 ? 1000 / frameAverageMs : 0;
  const sessionFrameCount =
    measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameCount;
  const sessionFrameAverageMs =
    sessionFrameCount > 0
      ? measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameDurationSumMs /
        sessionFrameCount
      : 0;
  const sessionFramesPerSecond =
    sessionFrameAverageMs > 0 ? 1000 / sessionFrameAverageMs : 0;
  const sessionFrameMaxMs =
    measuringWorldPlazaPerformanceDiagnosticsState.sessionFrameMaxMs;
  const sessionMinimumFramesPerSecond =
    sessionFrameMaxMs > 0 ? 1000 / sessionFrameMaxMs : 0;

  const samples =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_DISPLAY_ORDER.map(
      (sampleId) =>
        buildingMeasuringWorldPlazaPerformanceDiagnosticsSampleStats(sampleId)
    ).filter((sampleStats) => sampleStats.measurementCount > 0);

  const counterElapsedSeconds = Math.max(
    0.001,
    (performance.now() -
      measuringWorldPlazaPerformanceDiagnosticsState.counterWindowStartedAtMs) /
      1000
  );
  const countersPerSecond: Record<string, number> = {};

  for (const [
    counterId,
    totalCount,
  ] of measuringWorldPlazaPerformanceDiagnosticsState.counterTotalsById) {
    countersPerSecond[counterId] = totalCount / counterElapsedSeconds;
  }

  const gauges: Record<string, number> = {};

  for (const [
    gaugeId,
    gaugeValue,
  ] of measuringWorldPlazaPerformanceDiagnosticsState.gaugesById) {
    gauges[gaugeId] = gaugeValue;
  }

  const sampleAverageSumMs = samples.reduce(
    (sumMs, sampleStats) => sumMs + sampleStats.averageMs,
    0
  );
  const unaccountedFrameAverageMs = Math.max(
    0,
    frameAverageMs - sampleAverageSumMs
  );

  return {
    isEnabled: measuringWorldPlazaPerformanceDiagnosticsState.isEnabled,
    capturedAtMs: performance.now(),
    framesPerSecond,
    sessionFramesPerSecond,
    sessionMinimumFramesPerSecond,
    sessionFrameCount,
    frameAverageMs,
    framePercentile95Ms:
      computingMeasuringWorldPlazaPerformanceDiagnosticsPercentile95(
        frameDurationsMs
      ),
    framePercentile99Ms:
      computingMeasuringWorldPlazaPerformanceDiagnosticsPercentile(
        frameDurationsMs,
        99
      ),
    frameMaxMs:
      computingMeasuringWorldPlazaPerformanceDiagnosticsMax(frameDurationsMs),
    slowFrameCount: frameDurationsMs.filter(
      (frameDurationMs) =>
        frameDurationMs >=
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SLOW_FRAME_THRESHOLD_MS
    ).length,
    verySlowFrameCount: frameDurationsMs.filter(
      (frameDurationMs) =>
        frameDurationMs >=
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_VERY_SLOW_FRAME_THRESHOLD_MS
    ).length,
    jsHeapUsedMb: readingWorldPlazaPerformanceDiagnosticsJsHeapUsedMb(),
    sampleAverageSumMs,
    unaccountedFrameAverageMs,
    samples,
    gauges,
    countersPerSecond,
    recentSpikeLines: [
      ...measuringWorldPlazaPerformanceDiagnosticsState.recentSpikeLines,
    ],
    renderLayerFlags:
      copyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot(),
  };
}

/**
 * Prints a formatted diagnostics report to the console and returns the snapshot.
 */
export function dumpingWorldPlazaPerformanceDiagnosticsToConsole(): MeasuringWorldPlazaPerformanceDiagnosticsSnapshot {
  const snapshot = buildingWorldPlazaPerformanceDiagnosticsSnapshot();
  const sampleLines = snapshot.samples
    .map(
      (sampleStats) =>
        `  ${sampleStats.sampleId.padEnd(22)} avg ${sampleStats.averageMs.toFixed(2)}ms | p95 ${sampleStats.percentile95Ms.toFixed(2)}ms | max ${sampleStats.maxMs.toFixed(2)}ms | last ${sampleStats.lastMs.toFixed(2)}ms | spikes ${sampleStats.spikeCount}`
    )
    .join('\n');
  const gaugeLines = Object.entries(snapshot.gauges)
    .map(([gaugeId, gaugeValue]) => `  ${gaugeId}: ${gaugeValue}`)
    .join('\n');
  const counterLines = Object.entries(snapshot.countersPerSecond)
    .map(
      ([counterId, counterRate]) =>
        `  ${counterId}: ${counterRate.toFixed(2)}/s`
    )
    .join('\n');
  const spikeLines =
    snapshot.recentSpikeLines.length > 0
      ? snapshot.recentSpikeLines.map((line) => `  ${line}`).join('\n')
      : '  (none)';

  console.info(
    [
      '[world-plaza-perf] snapshot',
      `FPS ${snapshot.framesPerSecond.toFixed(1)} | frame avg ${snapshot.frameAverageMs.toFixed(2)}ms | p95 ${snapshot.framePercentile95Ms.toFixed(2)}ms | p99 ${snapshot.framePercentile99Ms.toFixed(2)}ms | max ${snapshot.frameMaxMs.toFixed(2)}ms | slow ${snapshot.slowFrameCount} | very slow ${snapshot.verySlowFrameCount} | samples sum ${snapshot.sampleAverageSumMs.toFixed(2)}ms | unaccounted ${snapshot.unaccountedFrameAverageMs.toFixed(2)}ms${snapshot.jsHeapUsedMb !== null ? ` | heap ${snapshot.jsHeapUsedMb.toFixed(1)}MB` : ''}`,
      'Samples:',
      sampleLines || '  (no samples yet)',
      'Gauges:',
      gaugeLines || '  (none)',
      'Counters:',
      counterLines || '  (none)',
      'Recent spikes:',
      spikeLines,
    ].join('\n')
  );

  return snapshot;
}

/**
 * Attaches `window.__WORLD_PLAZA_PERF__` once on the client.
 */
export function registeringWorldPlazaPerformanceDiagnosticsConsoleApi(): void {
  if (
    typeof window === 'undefined' ||
    measuringWorldPlazaPerformanceDiagnosticsState.isConsoleApiRegistered
  ) {
    return;
  }

  const consoleApi: MeasuringWorldPlazaPerformanceDiagnosticsConsoleApi = {
    enable: () => {
      settingWorldPlazaPerformanceDiagnosticsEnabled(true);
    },
    disable: () => {
      settingWorldPlazaPerformanceDiagnosticsEnabled(false);
    },
    isEnabled: checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
    getSnapshot: buildingWorldPlazaPerformanceDiagnosticsSnapshot,
    dump: dumpingWorldPlazaPerformanceDiagnosticsToConsole,
    reset: () => {
      resettingWorldPlazaPerformanceDiagnostics();
    },
    getRenderLayers:
      buildingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot,
    setRenderLayer: settingWorldPlazaPerformanceDiagnosticsRenderLayer,
    toggleRenderLayer: togglingWorldPlazaPerformanceDiagnosticsRenderLayer,
    runPerfSuite: startingWorldPlazaPerformanceTesterSuite,
    runPerfStep: startingWorldPlazaPerformanceTesterStepByIdString,
    cancelPerfSuite: cancellingWorldPlazaPerformanceTesterRun,
    getPerfSuiteResults: gettingWorldPlazaPerformanceTesterResults,
    skipAudioPreload: (isDisabled = true) => {
      settingWorldPlazaStarAudioPreloadDisabled(isDisabled);
      const isSkipped = checkingWorldPlazaStarAudioPreloadIsDisabled();
      console.info(
        `[world-plaza-perf] audio preload ${isSkipped ? 'skipped' : 'enabled'} (reload to affect boot step; URL ?skipAudioPreload=1 also works)`
      );
      return isSkipped;
    },
    isAudioPreloadSkipped: checkingWorldPlazaStarAudioPreloadIsDisabled,
  };

  (
    window as Window & {
      [MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CONSOLE_API_KEY]?: MeasuringWorldPlazaPerformanceDiagnosticsConsoleApi;
    }
  )[MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CONSOLE_API_KEY] = consoleApi;

  measuringWorldPlazaPerformanceDiagnosticsState.isConsoleApiRegistered = true;

  console.info(
    `[world-plaza-perf] console API ready on window.${MEASURING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CONSOLE_API_KEY} (try .dump())`
  );
}

/**
 * Resolves the default enabled state on first plaza mount.
 */
export function resolvingWorldPlazaPerformanceDiagnosticsInitialEnabledState(): boolean {
  return (
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ENV_ENABLED ||
    checkingWorldPlazaPerformanceDiagnosticsUrlQueryIsEnabled()
  );
}

function installingWorldPlazaPerformanceDiagnosticsErrorListener(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const errorListenerKey = '__worldPlazaPerformanceDiagnosticsErrorListener';

  if ((window as Window & { [errorListenerKey]?: boolean })[errorListenerKey]) {
    return;
  }

  window.addEventListener('error', (event) => {
    if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
      return;
    }

    incrementingWorldPlazaPerformanceDiagnosticsCounter(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.JS_ERROR
    );

    const message = event.message?.trim() || 'Unknown error';
    recordingWorldPlazaPerformanceDiagnosticsSpikeLine('js-error', 0, message);
  });

  (window as Window & { [errorListenerKey]?: boolean })[errorListenerKey] =
    true;
}

function recordingWorldPlazaPerformanceDiagnosticsSpikeLine(
  sampleId: string,
  durationMs: number,
  detailMessage?: string
): void {
  const spikeLine = detailMessage ?? `${sampleId} ${durationMs.toFixed(2)}ms`;

  measuringWorldPlazaPerformanceDiagnosticsState.recentSpikeLines.unshift(
    spikeLine
  );
  measuringWorldPlazaPerformanceDiagnosticsState.recentSpikeLines =
    measuringWorldPlazaPerformanceDiagnosticsState.recentSpikeLines.slice(0, 6);

  const nowMs = performance.now();

  if (
    nowMs - measuringWorldPlazaPerformanceDiagnosticsState.lastSpikeLoggedAtMs <
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SPIKE_LOG_INTERVAL_MS
  ) {
    return;
  }

  measuringWorldPlazaPerformanceDiagnosticsState.lastSpikeLoggedAtMs = nowMs;
  console.warn(`[world-plaza-perf] spike ${spikeLine}`);
}

function buildingMeasuringWorldPlazaPerformanceDiagnosticsSampleStats(
  sampleId: DefiningWorldPlazaPerformanceDiagnosticsSampleId
): MeasuringWorldPlazaPerformanceDiagnosticsSampleStats {
  const sampleStats =
    measuringWorldPlazaPerformanceDiagnosticsState.sampleStatsById.get(
      sampleId
    );
  const durationsMs = sampleStats?.durationsMs ?? [];

  return {
    sampleId,
    averageMs:
      computingMeasuringWorldPlazaPerformanceDiagnosticsAverage(durationsMs),
    percentile95Ms:
      computingMeasuringWorldPlazaPerformanceDiagnosticsPercentile95(
        durationsMs
      ),
    percentile99Ms:
      computingMeasuringWorldPlazaPerformanceDiagnosticsPercentile(
        durationsMs,
        99
      ),
    maxMs: computingMeasuringWorldPlazaPerformanceDiagnosticsMax(durationsMs),
    lastMs: durationsMs.at(-1) ?? 0,
    measurementCount: durationsMs.length,
    spikeCount: sampleStats?.spikeCount ?? 0,
  };
}

function pushMeasuringWorldPlazaPerformanceDiagnosticsRingValue(
  ringValues: number[],
  nextValue: number,
  maxLength: number
): void {
  ringValues.push(nextValue);

  if (ringValues.length > maxLength) {
    ringValues.shift();
  }
}

function computingMeasuringWorldPlazaPerformanceDiagnosticsAverage(
  values: readonly number[]
): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return total / values.length;
}

function computingMeasuringWorldPlazaPerformanceDiagnosticsMax(
  values: readonly number[]
): number {
  if (values.length === 0) {
    return 0;
  }

  return Math.max(...values);
}

function computingMeasuringWorldPlazaPerformanceDiagnosticsPercentile95(
  values: readonly number[]
): number {
  return computingMeasuringWorldPlazaPerformanceDiagnosticsPercentile(
    values,
    95
  );
}

function computingMeasuringWorldPlazaPerformanceDiagnosticsPercentile(
  values: readonly number[],
  percentile: number
): number {
  if (values.length === 0) {
    return 0;
  }

  const sortedValues = [...values].sort((valueA, valueB) => valueA - valueB);
  const percentileIndex = Math.min(
    sortedValues.length - 1,
    Math.max(0, Math.ceil((percentile / 100) * sortedValues.length) - 1)
  );

  return sortedValues[percentileIndex] ?? 0;
}

function readingWorldPlazaPerformanceDiagnosticsJsHeapUsedMb(): number | null {
  if (typeof performance === 'undefined') {
    return null;
  }

  const memory = (
    performance as Performance & {
      memory?: { usedJSHeapSize: number };
    }
  ).memory;

  if (!memory) {
    return null;
  }

  return memory.usedJSHeapSize / (1024 * 1024);
}
