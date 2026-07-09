import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_BELL_CURVE_RANGE_SIGMAS,
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_DURATION_BELL_CURVE_SPREAD_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_INCUBATION_BELL_CURVE_SPREAD_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_MIN_DURATION_MS,
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_MIN_INCUBATION_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseBellCurveConstants';

const COMPUTING_WORLD_PLAZA_ENTITY_DISEASE_BELL_CURVE_MIN_UNIFORM = 1e-6;

export type ComputingWorldPlazaEntityDiseaseBellCurveDurationKind =
  | 'incubation'
  | 'illness';

function computingWorldPlazaEntityDiseaseBellCurveSpreadRatio(
  kind: ComputingWorldPlazaEntityDiseaseBellCurveDurationKind
): number {
  return kind === 'incubation'
    ? DEFINING_WORLD_PLAZA_ENTITY_DISEASE_INCUBATION_BELL_CURVE_SPREAD_RATIO
    : DEFINING_WORLD_PLAZA_ENTITY_DISEASE_DURATION_BELL_CURVE_SPREAD_RATIO;
}

function computingWorldPlazaEntityDiseaseBellCurveMinimumMs(
  kind: ComputingWorldPlazaEntityDiseaseBellCurveDurationKind
): number {
  return kind === 'incubation'
    ? DEFINING_WORLD_PLAZA_ENTITY_DISEASE_MIN_INCUBATION_MS
    : DEFINING_WORLD_PLAZA_ENTITY_DISEASE_MIN_DURATION_MS;
}

/** Samples one standard-normal value with Box-Muller. */
export function samplingWorldPlazaEntityDiseaseStandardNormal(
  random: () => number = Math.random
): number {
  const uniformU1 = Math.max(
    COMPUTING_WORLD_PLAZA_ENTITY_DISEASE_BELL_CURVE_MIN_UNIFORM,
    random()
  );
  const uniformU2 = random();

  return (
    Math.sqrt(-2 * Math.log(uniformU1)) * Math.cos(Math.PI * 2 * uniformU2)
  );
}

function clampingWorldPlazaEntityDiseaseBellCurveDurationMs(
  meanMs: number,
  kind: ComputingWorldPlazaEntityDiseaseBellCurveDurationKind,
  rolledMs: number
): number {
  const minimumMs = Math.min(
    computingWorldPlazaEntityDiseaseBellCurveMinimumMs(kind),
    meanMs
  );

  return Math.max(minimumMs, Math.round(rolledMs));
}

/** Rolls one incubation or illness duration from a bell curve around the mean. */
export function rollingWorldPlazaEntityDiseaseBellCurveDurationMs({
  meanMs,
  kind,
  standardNormalSample,
}: {
  meanMs: number;
  kind: ComputingWorldPlazaEntityDiseaseBellCurveDurationKind;
  standardNormalSample: number;
}): number {
  const spreadRatio =
    computingWorldPlazaEntityDiseaseBellCurveSpreadRatio(kind);
  const standardDeviationMs = meanMs * spreadRatio;
  const rolledMs = meanMs + standardNormalSample * standardDeviationMs;

  return clampingWorldPlazaEntityDiseaseBellCurveDurationMs(
    meanMs,
    kind,
    rolledMs
  );
}

/** Typical low/high window for mechanics copy (~±2σ). */
export function resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs({
  meanMs,
  kind,
}: {
  meanMs: number;
  kind: ComputingWorldPlazaEntityDiseaseBellCurveDurationKind;
}): {
  minMs: number;
  maxMs: number;
} {
  const spreadRatio =
    computingWorldPlazaEntityDiseaseBellCurveSpreadRatio(kind);
  const standardDeviationMs = meanMs * spreadRatio;
  const sigmaSpan =
    standardDeviationMs *
    DEFINING_WORLD_PLAZA_ENTITY_DISEASE_BELL_CURVE_RANGE_SIGMAS;

  return {
    minMs: clampingWorldPlazaEntityDiseaseBellCurveDurationMs(
      meanMs,
      kind,
      meanMs - sigmaSpan
    ),
    maxMs: clampingWorldPlazaEntityDiseaseBellCurveDurationMs(
      meanMs,
      kind,
      meanMs + sigmaSpan
    ),
  };
}
