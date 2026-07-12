/**
 * Formats a pasteable plain-text critical nuance snapshot.
 *
 * @module components/world/domains/formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot
 */

import type { DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import {
  buildingWorldPlazaPerformanceDiagnosticsSampleStatsById,
  resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex,
  resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceSignalIndex,
} from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex';

export type FormattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotInput =
  {
    nuanceId: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId;
    index: number;
    capturedAtMs: number;
    snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot;
  };

/**
 * Builds one pasteable critical-capture block for a nuance group.
 */
export function formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot({
  nuanceId,
  index,
  capturedAtMs,
  snapshot,
}: FormattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotInput): string {
  const definition =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.find(
      (entry) => entry.nuanceId === nuanceId
    );

  const label = definition?.label ?? nuanceId;
  const samplesById = buildingWorldPlazaPerformanceDiagnosticsSampleStatsById(
    snapshot.samples
  );
  const isoTime = new Date(capturedAtMs).toISOString();

  const lines: string[] = [
    `[plaza-perf nuance critical] ${label} (${nuanceId}) index=${index.toFixed(2)} @ ${isoTime}`,
    `fps=${snapshot.framesPerSecond.toFixed(1)} frameAvg=${snapshot.frameAverageMs.toFixed(1)}ms p95=${snapshot.framePercentile95Ms.toFixed(1)}ms unaccounted=${snapshot.unaccountedFrameAverageMs.toFixed(1)}ms`,
  ];

  if (!definition) {
    return lines.join('\n');
  }

  lines.push('signals:');
  for (const signal of definition.signals) {
    const gaugeValue = snapshot.gauges[signal.gaugeId];
    const signalIndex =
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
        signal,
        gaugeValue
      );
    lines.push(
      `  gauge ${signal.gaugeId}=${gaugeValue ?? 'n/a'} signal=${signalIndex.toFixed(2)} (${signal.polarity} ${signal.healthyAt}→${signal.criticalAt})`
    );
  }
  for (const signal of definition.sampleSignals) {
    const sampleStats = samplesById.get(signal.sampleId);
    const signalIndex =
      resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceSignalIndex(
        signal,
        sampleStats?.percentile95Ms
      );
    lines.push(
      `  sample ${signal.sampleId} p95=${sampleStats ? sampleStats.percentile95Ms.toFixed(1) : 'n/a'}ms signal=${signalIndex.toFixed(2)} (${signal.healthyAtMs}→${signal.criticalAtMs}ms)`
    );
  }

  lines.push('gauges:');
  for (const gaugeId of definition.gaugeIds) {
    const gaugeValue = snapshot.gauges[gaugeId];
    if (gaugeValue === undefined) {
      continue;
    }
    lines.push(`  ${gaugeId}: ${gaugeValue}`);
  }

  lines.push('samples:');
  for (const sampleId of definition.sampleIds) {
    const sampleStats = samplesById.get(sampleId);
    if (!sampleStats || sampleStats.measurementCount <= 0) {
      continue;
    }
    lines.push(
      `  ${sampleId}: avg ${sampleStats.averageMs.toFixed(1)} | p95 ${sampleStats.percentile95Ms.toFixed(1)} | max ${sampleStats.maxMs.toFixed(1)} | spikes ${sampleStats.spikeCount}`
    );
  }

  const relatedSpikes = snapshot.recentSpikeLines.filter((spikeLine) =>
    definition.sampleIds.some((sampleId) => spikeLine.includes(sampleId))
  );
  if (relatedSpikes.length > 0) {
    lines.push('spikes:');
    for (const spikeLine of relatedSpikes) {
      lines.push(`  ${spikeLine}`);
    }
  }

  return lines.join('\n');
}
