/**
 * Pure A/B FPS delta math for perf FLAGS compare.
 *
 * @module components/world/domains/computingWorldPlazaPerformanceDiagnosticsAbDelta
 */

export type ComputingWorldPlazaPerformanceDiagnosticsAbCapture = {
  readonly label: string;
  readonly framesPerSecond: number;
  readonly sessionFramesPerSecond: number;
  readonly sessionMinimumFramesPerSecond: number;
  readonly capturedAtMs: number;
  readonly presetName: string | null;
};

export type ComputingWorldPlazaPerformanceDiagnosticsAbDelta = {
  readonly fpsDelta: number;
  readonly percentDelta: number | null;
  readonly fpsDeltaLabel: string;
  readonly percentDeltaLabel: string;
  readonly sessionMinimumFpsDelta: number;
  readonly sessionMinimumFpsDeltaLabel: string;
  readonly isBFaster: boolean;
  readonly summaryLabel: string;
};

function formattingWorldPlazaPerformanceDiagnosticsSignedFpsDelta(
  fpsDelta: number
): string {
  const roundedDelta = Math.round(fpsDelta * 10) / 10;
  const sign = roundedDelta > 0 ? '+' : '';

  return `${sign}${roundedDelta.toFixed(1)}`;
}

function formattingWorldPlazaPerformanceDiagnosticsSignedPercentDelta(
  percentDelta: number
): string {
  const roundedPercent = Math.round(percentDelta);
  const sign = roundedPercent > 0 ? '+' : '';

  return `${sign}${roundedPercent}%`;
}

/**
 * Computes B vs A FPS delta labels.
 *
 * @param captureA - Baseline capture.
 * @param captureB - Comparison capture.
 */
export function computingWorldPlazaPerformanceDiagnosticsAbDelta(
  captureA: ComputingWorldPlazaPerformanceDiagnosticsAbCapture,
  captureB: ComputingWorldPlazaPerformanceDiagnosticsAbCapture
): ComputingWorldPlazaPerformanceDiagnosticsAbDelta {
  const fpsDelta = captureB.framesPerSecond - captureA.framesPerSecond;
  const percentDelta =
    captureA.framesPerSecond > 0
      ? (fpsDelta / captureA.framesPerSecond) * 100
      : null;
  const fpsDeltaLabel =
    formattingWorldPlazaPerformanceDiagnosticsSignedFpsDelta(fpsDelta);
  const percentDeltaLabel =
    percentDelta === null
      ? 'n/a'
      : formattingWorldPlazaPerformanceDiagnosticsSignedPercentDelta(
          percentDelta
        );
  const sessionMinimumFpsDelta =
    captureB.sessionMinimumFramesPerSecond -
    captureA.sessionMinimumFramesPerSecond;
  const sessionMinimumFpsDeltaLabel =
    formattingWorldPlazaPerformanceDiagnosticsSignedFpsDelta(
      sessionMinimumFpsDelta
    );
  const isBFaster = fpsDelta > 0;
  const liveDeltaLabel =
    percentDelta === null
      ? `B − A = ${fpsDeltaLabel} fps`
      : `B − A = ${fpsDeltaLabel} fps (${percentDeltaLabel})`;
  const summaryLabel = `${liveDeltaLabel} · min ${sessionMinimumFpsDeltaLabel}`;

  return {
    fpsDelta,
    percentDelta,
    fpsDeltaLabel,
    percentDeltaLabel,
    sessionMinimumFpsDelta,
    sessionMinimumFpsDeltaLabel,
    isBFaster,
    summaryLabel,
  };
}
