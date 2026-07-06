import { DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT } from '@/components/home/domains/definingPlazaMechanicsCombatEvBellCurveConstants';
import type { RollingWorldPlazaDamageRollMode } from '@/components/world/health/domains/rollingWorldPlazaDamageEngine';

const COMPUTING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_SKEW_MEAN_FACTOR =
  Math.sqrt(2 / Math.PI);

export type ComputingPlazaMechanicsCombatEvBellCurveDistributionParams = {
  luck?: number;
  deviationBiasShift?: number;
  rollMode?: RollingWorldPlazaDamageRollMode;
};

function clampingPlazaMechanicsCombatEvBellCurveLuck(luck: number): number {
  return Math.min(1, Math.max(-1, luck));
}

function computingPlazaMechanicsCombatEvBellCurveErf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * absX);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-absX * absX);

  return sign * y;
}

function computingPlazaMechanicsCombatEvBellCurveStandardNormalCdf(
  x: number
): number {
  return (
    0.5 * (1 + computingPlazaMechanicsCombatEvBellCurveErf(x / Math.SQRT2))
  );
}

function computingPlazaMechanicsCombatEvBellCurveStandardNormalPdf(
  x: number
): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function computingPlazaMechanicsCombatEvBellCurveSkewNormalAlpha(
  luck: number
): number {
  const delta = clampingPlazaMechanicsCombatEvBellCurveLuck(luck);

  if (delta === 0) {
    return 0;
  }

  const denominator = Math.sqrt(Math.max(1e-6, 1 - delta * delta));

  return delta / denominator;
}

function computingPlazaMechanicsCombatEvBellCurveSkewNormalPdf(
  x: number,
  luck: number
): number {
  const alpha = computingPlazaMechanicsCombatEvBellCurveSkewNormalAlpha(luck);

  if (alpha === 0) {
    return computingPlazaMechanicsCombatEvBellCurveStandardNormalPdf(x);
  }

  return (
    2 *
    computingPlazaMechanicsCombatEvBellCurveStandardNormalPdf(x) *
    computingPlazaMechanicsCombatEvBellCurveStandardNormalCdf(alpha * x)
  );
}

function computingPlazaMechanicsCombatEvBellCurveLockInPdf(
  sigma: number
): number {
  return Math.abs(sigma) <= 0.12 ? 1 : 0;
}

function creatingPlazaMechanicsCombatEvBellCurveDeterministicRandom(
  seed: number
): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function samplingPlazaMechanicsCombatEvBellCurveStandardNormalPair(
  random: () => number
): { z0: number; z1: number } {
  let u0 = 0;
  let u1 = 0;

  while (u0 === 0) {
    u0 = random();
  }

  while (u1 === 0) {
    u1 = random();
  }

  const magnitude = Math.sqrt(-2 * Math.log(u0));
  const angle = 2 * Math.PI * u1;

  return {
    z0: magnitude * Math.cos(angle),
    z1: magnitude * Math.sin(angle),
  };
}

function samplingPlazaMechanicsCombatEvBellCurveChaoticDeviationZ(
  random: () => number
): number {
  const bucket = random();

  if (bucket < 0.4) {
    return 1.2 + random() * 2.3;
  }

  if (bucket < 0.8) {
    return -(1.2 + random() * 2.3);
  }

  const sign = random() < 0.5 ? -1 : 1;

  return sign * (0.25 + random() * 0.65);
}

let cachedPlazaMechanicsCombatEvBellCurveChaoticBins: number[] | null = null;

function listingPlazaMechanicsCombatEvBellCurveChaoticBins(): number[] {
  if (cachedPlazaMechanicsCombatEvBellCurveChaoticBins) {
    return cachedPlazaMechanicsCombatEvBellCurveChaoticBins;
  }

  const layout = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT;
  const random = creatingPlazaMechanicsCombatEvBellCurveDeterministicRandom(42);
  const binCount = 120;
  const sigmaSpan = layout.sigmaMax - layout.sigmaMin;
  const bins = Array.from({ length: binCount }, () => 0);

  for (let sampleIndex = 0; sampleIndex < 12000; sampleIndex += 1) {
    const deviationScore =
      samplingPlazaMechanicsCombatEvBellCurveChaoticDeviationZ(random);

    if (deviationScore < layout.sigmaMin || deviationScore > layout.sigmaMax) {
      continue;
    }

    const normalized = (deviationScore - layout.sigmaMin) / sigmaSpan;
    const binIndex = Math.min(
      binCount - 1,
      Math.max(0, Math.floor(normalized * binCount))
    );
    bins[binIndex] += 1;
  }

  cachedPlazaMechanicsCombatEvBellCurveChaoticBins = bins;

  return bins;
}

function computingPlazaMechanicsCombatEvBellCurveChaoticPdfAtSigma(
  sigma: number
): number {
  const layout = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT;
  const bins = listingPlazaMechanicsCombatEvBellCurveChaoticBins();
  const binCount = bins.length;
  const normalized =
    (sigma - layout.sigmaMin) / (layout.sigmaMax - layout.sigmaMin);
  const binIndex = Math.min(
    binCount - 1,
    Math.max(0, Math.floor(normalized * binCount))
  );

  return bins[binIndex] ?? 0;
}

/** PDF height at σ for luck, tier-bias shift, and special roll modes. */
export function computingPlazaMechanicsCombatEvBellCurvePdfAtSigma(
  sigma: number,
  {
    luck = 0,
    deviationBiasShift = 0,
    rollMode = 'normal',
  }: ComputingPlazaMechanicsCombatEvBellCurveDistributionParams
): number {
  if (rollMode === 'lock_in') {
    return computingPlazaMechanicsCombatEvBellCurveLockInPdf(sigma);
  }

  if (rollMode === 'chaotic') {
    return computingPlazaMechanicsCombatEvBellCurveChaoticPdfAtSigma(sigma);
  }

  const delta = clampingPlazaMechanicsCombatEvBellCurveLuck(luck);
  const meanCorrection =
    delta * COMPUTING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_SKEW_MEAN_FACTOR;
  const centeredSigma = sigma - deviationBiasShift;

  if (delta === 0) {
    return computingPlazaMechanicsCombatEvBellCurveStandardNormalPdf(
      centeredSigma
    );
  }

  return computingPlazaMechanicsCombatEvBellCurveSkewNormalPdf(
    centeredSigma + meanCorrection,
    luck
  );
}

/** Builds a smooth SVG path for a luck/bias-shifted roll distribution on the σ axis. */
export function computingPlazaMechanicsCombatEvBellCurveDistributionPath(
  params: ComputingPlazaMechanicsCombatEvBellCurveDistributionParams
): string {
  const layout = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT;
  const sigmaSpan = layout.sigmaMax - layout.sigmaMin;
  const plotWidth = layout.width - layout.paddingLeft - layout.paddingRight;
  const plotHeight = layout.height - layout.paddingTop - layout.paddingBottom;
  const plotBottom = layout.height - layout.paddingBottom;
  const sampleCount = layout.curveSampleCount;

  let peakPdf = 0;

  for (let sampleIndex = 0; sampleIndex <= sampleCount; sampleIndex += 1) {
    const sigma = layout.sigmaMin + (sampleIndex / sampleCount) * sigmaSpan;
    const pdf = computingPlazaMechanicsCombatEvBellCurvePdfAtSigma(
      sigma,
      params
    );
    peakPdf = Math.max(peakPdf, pdf);
  }

  const pdfPeak = Math.max(peakPdf, 1e-6);
  const sigmaToX = (sigma: number): number =>
    layout.paddingLeft + ((sigma - layout.sigmaMin) / sigmaSpan) * plotWidth;
  const pdfYToSvgY = (pdfY: number): number =>
    plotBottom - (pdfY / pdfPeak) * (plotHeight - 8);

  const points: string[] = [];

  for (let sampleIndex = 0; sampleIndex <= sampleCount; sampleIndex += 1) {
    const sigma = layout.sigmaMin + (sampleIndex / sampleCount) * sigmaSpan;
    const x = sigmaToX(sigma);
    const y = pdfYToSvgY(
      computingPlazaMechanicsCombatEvBellCurvePdfAtSigma(sigma, params)
    );

    points.push(
      `${sampleIndex === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    );
  }

  return points.join(' ');
}
