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

function samplingPlazaMechanicsCombatEvBellCurveSkewNormalZ(
  luck: number,
  random: () => number
): number {
  const delta = clampingPlazaMechanicsCombatEvBellCurveLuck(luck);

  if (delta === 0) {
    return samplingPlazaMechanicsCombatEvBellCurveStandardNormalPair(random).z0;
  }

  const { z0, z1 } =
    samplingPlazaMechanicsCombatEvBellCurveStandardNormalPair(random);
  const deltaScale = Math.sqrt(Math.max(0, 1 - delta * delta));

  return delta * Math.abs(z0) + deltaScale * z1;
}

function samplingPlazaMechanicsCombatEvBellCurveChaoticDeviationZ(
  random: () => number
): number {
  const bucket = random();

  if (bucket < 0.4) {
    const coreDeviation = 1.2 + random() * 2.3;

    if (random() < 0.01) {
      const tailZ = Math.abs(
        samplingPlazaMechanicsCombatEvBellCurveStandardNormalPair(random).z0
      );
      return coreDeviation + tailZ;
    }

    return coreDeviation;
  }

  if (bucket < 0.8) {
    const coreDeviation = -(1.2 + random() * 2.3);

    if (random() < 0.01) {
      const tailZ = Math.abs(
        samplingPlazaMechanicsCombatEvBellCurveStandardNormalPair(random).z0
      );
      return coreDeviation - tailZ;
    }

    return coreDeviation;
  }

  const sign = random() < 0.5 ? -1 : 1;

  return sign * (0.25 + random() * 0.65);
}

function samplingPlazaMechanicsCombatEvBellCurveDeviationScore({
  luck,
  rollMode,
  random,
}: {
  luck: number;
  rollMode: RollingWorldPlazaDamageRollMode;
  random: () => number;
}): number {
  if (rollMode === 'lock_in') {
    return 0;
  }

  if (rollMode === 'chaotic') {
    return samplingPlazaMechanicsCombatEvBellCurveChaoticDeviationZ(random);
  }

  const clampedLuck = clampingPlazaMechanicsCombatEvBellCurveLuck(luck);
  const skewZ = samplingPlazaMechanicsCombatEvBellCurveSkewNormalZ(
    clampedLuck,
    random
  );
  const meanCorrection =
    clampedLuck *
    COMPUTING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_SKEW_MEAN_FACTOR;

  return skewZ - meanCorrection;
}

/** Builds an SVG path for a luck/bias-shifted roll distribution on the σ axis. */
export function computingPlazaMechanicsCombatEvBellCurveDistributionPath({
  luck = 0,
  deviationBiasShift = 0,
  rollMode = 'normal',
  sampleCount = 2400,
  binCount = 80,
  seed = 42,
}: ComputingPlazaMechanicsCombatEvBellCurveDistributionParams & {
  sampleCount?: number;
  binCount?: number;
  seed?: number;
}): string {
  const layout = DEFINING_PLAZA_MECHANICS_COMBAT_EV_BELL_CURVE_LAYOUT;
  const sigmaSpan = layout.sigmaMax - layout.sigmaMin;
  const plotWidth = layout.width - layout.paddingLeft - layout.paddingRight;
  const plotHeight = layout.height - layout.paddingTop - layout.paddingBottom;
  const plotTop = layout.paddingTop;
  const plotBottom = layout.height - layout.paddingBottom;
  const random =
    creatingPlazaMechanicsCombatEvBellCurveDeterministicRandom(seed);
  const bins = Array.from({ length: binCount }, () => 0);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const deviationScore =
      samplingPlazaMechanicsCombatEvBellCurveDeviationScore({
        luck,
        rollMode,
        random,
      }) + deviationBiasShift;

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

  const peakCount = Math.max(...bins, 1);
  const sigmaToX = (sigma: number): number =>
    layout.paddingLeft + ((sigma - layout.sigmaMin) / sigmaSpan) * plotWidth;
  const countToY = (count: number): number =>
    plotBottom - (count / peakCount) * (plotHeight - 8);

  const points: string[] = [];

  for (let binIndex = 0; binIndex < binCount; binIndex += 1) {
    const sigma = layout.sigmaMin + ((binIndex + 0.5) / binCount) * sigmaSpan;
    const x = sigmaToX(sigma);
    const y = countToY(bins[binIndex]);

    points.push(`${binIndex === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return points.join(' ');
}
