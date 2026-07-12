/**
 * Auto-capture when a nuance group index crosses into critical.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotConstants
 */

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_INDEX_BAND } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeConstants';

/** Capture when combined nuance index reaches this (matches critical badge band). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_INDEX_THRESHOLD =
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_INDEX_BAND.STRAINED_MAX;

/** Min ms between captures for the same nuance id (avoids spam while red). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COOLDOWN_MS = 8_000;

/** Keep the newest N critical captures for copy/paste. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_MAX_COUNT = 8;

/** Summary / footer section label. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_SECTION =
  'Critical captures' as const;

/** Copy button for one capture. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY =
  'Copy' as const;

/** Copy newest critical capture. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_LATEST =
  'Copy critical' as const;

/** Empty state when none captured yet. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_EMPTY =
  'None yet. Captures when a nuance badge hits red (≥0.75).' as const;

/** Toast after successful copy. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_SUCCESS =
  'Critical perf snapshot copied.' as const;

/** Toast when clipboard fails. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_FAILURE =
  'Could not copy critical perf snapshot.' as const;
