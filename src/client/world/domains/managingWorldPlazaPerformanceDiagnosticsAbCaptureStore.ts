/**
 * In-memory Capture A / Capture B state for perf FLAGS compare.
 *
 * @module components/world/domains/managingWorldPlazaPerformanceDiagnosticsAbCaptureStore
 */

import type { ComputingWorldPlazaPerformanceDiagnosticsAbCapture } from '@/components/world/domains/computingWorldPlazaPerformanceDiagnosticsAbDelta';
import {
  resettingWorldPlazaPerformanceDiagnosticsMeasurementHistory,
  type MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

export type ManagingWorldPlazaPerformanceDiagnosticsAbCaptureSlot = 'A' | 'B';

type ManagingWorldPlazaPerformanceDiagnosticsAbCaptureState = {
  captureA: ComputingWorldPlazaPerformanceDiagnosticsAbCapture | null;
  captureB: ComputingWorldPlazaPerformanceDiagnosticsAbCapture | null;
  revision: number;
};

const managingWorldPlazaPerformanceDiagnosticsAbCaptureState: ManagingWorldPlazaPerformanceDiagnosticsAbCaptureState =
  {
    captureA: null,
    captureB: null,
    revision: 0,
  };

const managingWorldPlazaPerformanceDiagnosticsAbCaptureSubscribers = new Set<
  () => void
>();

function notifyingWorldPlazaPerformanceDiagnosticsAbCaptureSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaPerformanceDiagnosticsAbCaptureSubscribers) {
    onStoreChange();
  }
}

export function subscribingWorldPlazaPerformanceDiagnosticsAbCaptures(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaPerformanceDiagnosticsAbCaptureSubscribers.add(
    onStoreChange
  );
  return () => {
    managingWorldPlazaPerformanceDiagnosticsAbCaptureSubscribers.delete(
      onStoreChange
    );
  };
}

export function gettingWorldPlazaPerformanceDiagnosticsAbCaptureRevision(): number {
  return managingWorldPlazaPerformanceDiagnosticsAbCaptureState.revision;
}

export function gettingWorldPlazaPerformanceDiagnosticsAbCaptureA(): ComputingWorldPlazaPerformanceDiagnosticsAbCapture | null {
  return managingWorldPlazaPerformanceDiagnosticsAbCaptureState.captureA;
}

export function gettingWorldPlazaPerformanceDiagnosticsAbCaptureB(): ComputingWorldPlazaPerformanceDiagnosticsAbCapture | null {
  return managingWorldPlazaPerformanceDiagnosticsAbCaptureState.captureB;
}

/**
 * Stores one A or B capture from a live diagnostics snapshot, then clears the
 * live session window so the next capture only reflects frames after this one.
 *
 * @param slot - Capture slot.
 * @param snapshot - Latest diagnostics snapshot.
 * @param label - Display label (usually slot name).
 * @param presetName - Active preset name when captured, if any.
 */
export function capturingWorldPlazaPerformanceDiagnosticsAbSlot(
  slot: ManagingWorldPlazaPerformanceDiagnosticsAbCaptureSlot,
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
  label: string,
  presetName: string | null = null
): void {
  const capture: ComputingWorldPlazaPerformanceDiagnosticsAbCapture = {
    label,
    framesPerSecond: snapshot.framesPerSecond,
    sessionFramesPerSecond: snapshot.sessionFramesPerSecond,
    sessionMinimumFramesPerSecond: snapshot.sessionMinimumFramesPerSecond,
    // Wall clock for pasteable findings (snapshot.capturedAtMs is performance.now).
    capturedAtMs: Date.now(),
    presetName,
  };

  if (slot === 'A') {
    managingWorldPlazaPerformanceDiagnosticsAbCaptureState.captureA = capture;
  } else {
    managingWorldPlazaPerformanceDiagnosticsAbCaptureState.captureB = capture;
  }

  managingWorldPlazaPerformanceDiagnosticsAbCaptureState.revision += 1;
  notifyingWorldPlazaPerformanceDiagnosticsAbCaptureSubscribers();

  // Fresh session min/avg for the other slot (or a re-capture).
  resettingWorldPlazaPerformanceDiagnosticsMeasurementHistory();
}

export function clearingWorldPlazaPerformanceDiagnosticsAbCaptures(): void {
  managingWorldPlazaPerformanceDiagnosticsAbCaptureState.captureA = null;
  managingWorldPlazaPerformanceDiagnosticsAbCaptureState.captureB = null;
  managingWorldPlazaPerformanceDiagnosticsAbCaptureState.revision += 1;
  notifyingWorldPlazaPerformanceDiagnosticsAbCaptureSubscribers();
}

/** Test helper. */
export function resettingWorldPlazaPerformanceDiagnosticsAbCaptureStoreForTests(): void {
  clearingWorldPlazaPerformanceDiagnosticsAbCaptures();
  managingWorldPlazaPerformanceDiagnosticsAbCaptureState.revision = 0;
}
