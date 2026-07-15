/**
 * Plain-text report for FLAGS preset A/B compare captures.
 *
 * @module components/world/domains/formattingWorldPlazaPerformanceDiagnosticsAbFindings
 */

import {
  computingWorldPlazaPerformanceDiagnosticsAbDelta,
  type ComputingWorldPlazaPerformanceDiagnosticsAbCapture,
} from '@/components/world/domains/computingWorldPlazaPerformanceDiagnosticsAbDelta';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

export type FormattingWorldPlazaPerformanceDiagnosticsAbFindingsInput = {
  readonly captureA: ComputingWorldPlazaPerformanceDiagnosticsAbCapture | null;
  readonly captureB: ComputingWorldPlazaPerformanceDiagnosticsAbCapture | null;
  readonly activePresetName: string | null;
  readonly currentSnapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot | null;
};

function formattingWorldPlazaPerformanceDiagnosticsAbCaptureLine(
  slotLabel: string,
  capture: ComputingWorldPlazaPerformanceDiagnosticsAbCapture
): string {
  const presetSuffix = capture.presetName
    ? ` · preset: ${capture.presetName}`
    : '';
  const capturedAtIso = new Date(capture.capturedAtMs).toISOString();

  return [
    `${slotLabel}: ${capture.framesPerSecond.toFixed(1)} fps live · ${capture.sessionFramesPerSecond.toFixed(1)} fps session avg · ${capture.sessionMinimumFramesPerSecond.toFixed(1)} fps session min${presetSuffix}`,
    `  captured ${capturedAtIso}`,
  ].join('\n');
}

/**
 * Builds a pasteable FLAGS compare report from A/B captures.
 */
export function formattingWorldPlazaPerformanceDiagnosticsAbFindings({
  captureA,
  captureB,
  activePresetName,
  currentSnapshot,
}: FormattingWorldPlazaPerformanceDiagnosticsAbFindingsInput): string {
  const lines: string[] = ['Plaza perf FLAGS compare', ''];

  if (currentSnapshot) {
    lines.push(
      `Current: ${currentSnapshot.framesPerSecond.toFixed(1)} fps live · ${currentSnapshot.sessionFramesPerSecond.toFixed(1)} fps session avg · ${currentSnapshot.sessionMinimumFramesPerSecond.toFixed(1)} fps session min`
    );

    if (activePresetName) {
      lines.push(`Active preset: ${activePresetName}`);
    }

    lines.push('');
  }

  if (captureA) {
    lines.push(
      formattingWorldPlazaPerformanceDiagnosticsAbCaptureLine('A', captureA)
    );
  } else {
    lines.push('A: (not captured)');
  }

  if (captureB) {
    lines.push(
      formattingWorldPlazaPerformanceDiagnosticsAbCaptureLine('B', captureB)
    );
  } else {
    lines.push('B: (not captured)');
  }

  if (captureA && captureB) {
    const delta = computingWorldPlazaPerformanceDiagnosticsAbDelta(
      captureA,
      captureB
    );
    lines.push('');
    lines.push(`Delta: ${delta.summaryLabel}`);
  }

  return lines.join('\n');
}
