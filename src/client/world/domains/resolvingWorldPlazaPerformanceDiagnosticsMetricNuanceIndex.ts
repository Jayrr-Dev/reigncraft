/**
 * Pure index (0 healthy → 1 critical) for Metrics / Samples / Summary nuance groups.
 *
 * @module components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex
 */

import type {
  DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition,
  DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceSignal,
  DefiningWorldPlazaPerformanceDiagnosticsSampleNuanceSignal,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSampleStats } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

function clampingUnitInterval(value: number): number {
  if (value <= 0) {
    return 0;
  }
  if (value >= 1) {
    return 1;
  }
  return value;
}

/**
 * Maps one gauge reading onto 0..1 using the signal's healthy/critical anchors.
 */
export function resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
  signal: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceSignal,
  gaugeValue: number | undefined
): number {
  if (typeof gaugeValue !== 'number' || !Number.isFinite(gaugeValue)) {
    return 0;
  }

  const { healthyAt, criticalAt, polarity } = signal;
  const span = criticalAt - healthyAt;

  if (span === 0) {
    if (polarity === 'higher-worse') {
      return gaugeValue > criticalAt ? 1 : 0;
    }
    return gaugeValue < criticalAt ? 1 : 0;
  }

  const raw =
    polarity === 'higher-worse'
      ? (gaugeValue - healthyAt) / span
      : (healthyAt - gaugeValue) / (healthyAt - criticalAt);

  return clampingUnitInterval(raw);
}

/**
 * Maps one sample p95 ms onto 0..1 (higher ms worse).
 */
export function resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceSignalIndex(
  signal: DefiningWorldPlazaPerformanceDiagnosticsSampleNuanceSignal,
  percentile95Ms: number | undefined
): number {
  if (typeof percentile95Ms !== 'number' || !Number.isFinite(percentile95Ms)) {
    return 0;
  }

  const span = signal.criticalAtMs - signal.healthyAtMs;

  if (span === 0) {
    return percentile95Ms > signal.criticalAtMs ? 1 : 0;
  }

  return clampingUnitInterval((percentile95Ms - signal.healthyAtMs) / span);
}

/**
 * Group index = max of contributing gauge signal indexes (worst signal wins).
 */
export function resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex(
  definition: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition,
  gauges: Readonly<Record<string, number>>
): number {
  if (definition.signals.length === 0) {
    return 0;
  }

  let worstIndex = 0;
  for (const signal of definition.signals) {
    const signalIndex =
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
        signal,
        gauges[signal.gaugeId]
      );
    if (signalIndex > worstIndex) {
      worstIndex = signalIndex;
    }
  }
  return worstIndex;
}

export type ResolvingWorldPlazaPerformanceDiagnosticsSampleStatsById = ReadonlyMap<
  string,
  MeasuringWorldPlazaPerformanceDiagnosticsSampleStats
>;

/**
 * Builds a sampleId → stats map for nuance index resolvers.
 */
export function buildingWorldPlazaPerformanceDiagnosticsSampleStatsById(
  samples: readonly MeasuringWorldPlazaPerformanceDiagnosticsSampleStats[]
): Map<string, MeasuringWorldPlazaPerformanceDiagnosticsSampleStats> {
  const samplesById = new Map<
    string,
    MeasuringWorldPlazaPerformanceDiagnosticsSampleStats
  >();
  for (const sampleStats of samples) {
    samplesById.set(sampleStats.sampleId, sampleStats);
  }
  return samplesById;
}

/**
 * Samples-tab group index from worst sampleSignal p95.
 */
export function resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceIndex(
  definition: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition,
  samplesById: ResolvingWorldPlazaPerformanceDiagnosticsSampleStatsById
): number {
  if (definition.sampleSignals.length === 0) {
    return 0;
  }

  let worstIndex = 0;
  for (const signal of definition.sampleSignals) {
    const sampleStats = samplesById.get(signal.sampleId);
    const signalIndex =
      resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceSignalIndex(
        signal,
        sampleStats?.percentile95Ms
      );
    if (signalIndex > worstIndex) {
      worstIndex = signalIndex;
    }
  }
  return worstIndex;
}

/**
 * Summary combined index = max(gauge index, sample index).
 */
export function resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex(
  definition: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition,
  gauges: Readonly<Record<string, number>>,
  samplesById: ResolvingWorldPlazaPerformanceDiagnosticsSampleStatsById
): number {
  return Math.max(
    resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex(
      definition,
      gauges
    ),
    resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceIndex(
      definition,
      samplesById
    )
  );
}
