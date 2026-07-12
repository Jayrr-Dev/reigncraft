/**
 * Ring buffer of pasteable critical nuance snapshots for the perf overlay.
 *
 * @module components/world/domains/managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotStore
 */

import type { DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_INDEX_THRESHOLD,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_MAX_COUNT,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotConstants';
import { formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot } from '@/components/world/domains/formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import {
  buildingWorldPlazaPerformanceDiagnosticsSampleStatsById,
  resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex,
} from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex';

export type ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot = {
  readonly id: string;
  readonly nuanceId: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId;
  readonly label: string;
  readonly index: number;
  readonly capturedAtMs: number;
  /** Plain text ready to copy/paste. */
  readonly text: string;
};

type ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState = {
  captures: ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot[];
  lastIndexByNuanceId: Map<
    DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId,
    number
  >;
  lastCaptureAtMsByNuanceId: Map<
    DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId,
    number
  >;
  nextCaptureSerial: number;
};

const managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState: ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState =
  {
    captures: [],
    lastIndexByNuanceId: new Map(),
    lastCaptureAtMsByNuanceId: new Map(),
    nextCaptureSerial: 1,
  };

const managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotSubscribers =
  new Set<() => void>();

function notifyingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotSubscribers) {
    onStoreChange();
  }
}

export function subscribingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotSubscribers.add(
    onStoreChange
  );
  return () => {
    managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotSubscribers.delete(
      onStoreChange
    );
  };
}

export function listingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots(): readonly ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot[] {
  return managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.captures;
}

export function gettingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotLatest(): ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot | null {
  return (
    managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState
      .captures[0] ?? null
  );
}

/**
 * Scans nuance indexes on a live snapshot and records rising-edge criticals.
 */
export function recordingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots(
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot
): void {
  const samplesById = buildingWorldPlazaPerformanceDiagnosticsSampleStatsById(
    snapshot.samples
  );
  const nowMs = snapshot.capturedAtMs;
  const threshold =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_INDEX_THRESHOLD;
  const cooldownMs =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COOLDOWN_MS;

  let didChange = false;

  for (const definition of DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY) {
    const index =
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex(
        definition,
        snapshot.gauges,
        samplesById
      );
    const previousIndex =
      managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.lastIndexByNuanceId.get(
        definition.nuanceId
      ) ?? 0;
    managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.lastIndexByNuanceId.set(
      definition.nuanceId,
      index
    );

    if (index < threshold) {
      continue;
    }

    const crossedIntoCritical = previousIndex < threshold;
    const lastCaptureAtMs =
      managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.lastCaptureAtMsByNuanceId.get(
        definition.nuanceId
      ) ?? 0;
    const cooledDown = nowMs - lastCaptureAtMs >= cooldownMs;

    if (!crossedIntoCritical && !cooledDown) {
      continue;
    }

    // While staying critical, only re-capture if index got worse enough or cooled.
    if (!crossedIntoCritical && index < previousIndex + 0.05) {
      continue;
    }

    const text =
      formattingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot({
        nuanceId: definition.nuanceId,
        index,
        capturedAtMs: nowMs,
        snapshot,
      });

    const capture: ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot =
      {
        id: `nuance-critical-${managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.nextCaptureSerial}`,
        nuanceId: definition.nuanceId,
        label: definition.label,
        index,
        capturedAtMs: nowMs,
        text,
      };

    managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.nextCaptureSerial += 1;
    managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.lastCaptureAtMsByNuanceId.set(
      definition.nuanceId,
      nowMs
    );
    managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.captures =
      [
        capture,
        ...managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.captures,
      ].slice(
        0,
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_MAX_COUNT
      );
    didChange = true;
  }

  if (didChange) {
    notifyingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotSubscribers();
  }
}

/** Test / overlay reset helper. */
export function clearingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots(): void {
  managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.captures =
    [];
  managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.lastIndexByNuanceId.clear();
  managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotState.lastCaptureAtMsByNuanceId.clear();
  notifyingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotSubscribers();
}
