import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import {
  DEFINING_WORLD_PLAZA_CONFUSION_BASE_WAVE_FREQUENCY_RAD_PER_SEC,
  DEFINING_WORLD_PLAZA_CONFUSION_MIN_GRID_DELTA_MAGNITUDE,
  DEFINING_WORLD_PLAZA_CONFUSION_SECONDARY_WAVE_FREQUENCY_MULTIPLIER,
  DEFINING_WORLD_PLAZA_CONFUSION_SECONDARY_WAVE_WEIGHT,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import { resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians } from '@/components/world/health/domains/resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians';

export type ComputingWorldPlazaConfusionDeflectedGridDeltaInput = {
  gridDelta: DefiningWorldPlazaMovementDirection;
  deltaSeconds: number;
  effectiveIntensity: number;
  phaseRadians: number;
  phaseSeed: number;
};

export type ComputingWorldPlazaConfusionDeflectedGridDeltaResult = {
  gridDelta: DefiningWorldPlazaMovementDirection;
  nextPhaseRadians: number;
};

/**
 * Rotates a walk grid delta by a layered sine wobble for confused movement.
 */
export function computingWorldPlazaConfusionDeflectedGridDelta({
  gridDelta,
  deltaSeconds,
  effectiveIntensity,
  phaseRadians,
  phaseSeed,
}: ComputingWorldPlazaConfusionDeflectedGridDeltaInput): ComputingWorldPlazaConfusionDeflectedGridDeltaResult {
  const magnitude = Math.hypot(gridDelta.x, gridDelta.y);

  if (magnitude <= DEFINING_WORLD_PLAZA_CONFUSION_MIN_GRID_DELTA_MAGNITUDE) {
    return {
      gridDelta,
      nextPhaseRadians: phaseRadians,
    };
  }

  const intensityRatio = Math.max(0, Math.min(1, effectiveIntensity / 100));
  const waveFrequency =
    DEFINING_WORLD_PLAZA_CONFUSION_BASE_WAVE_FREQUENCY_RAD_PER_SEC *
    (0.35 + intensityRatio * 0.65);
  const nextPhaseRadians =
    phaseRadians + waveFrequency * Math.max(deltaSeconds, 0);

  const primaryWave = Math.sin(nextPhaseRadians + phaseSeed);
  const secondaryWave = Math.sin(
    nextPhaseRadians * DEFINING_WORLD_PLAZA_CONFUSION_SECONDARY_WAVE_FREQUENCY_MULTIPLIER +
      phaseSeed * 1.7
  );
  const wobbleBlend =
    primaryWave +
    secondaryWave * DEFINING_WORLD_PLAZA_CONFUSION_SECONDARY_WAVE_WEIGHT;
  const wobbleRadians =
    wobbleBlend *
    resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(
      effectiveIntensity
    );

  const headingRadians = Math.atan2(gridDelta.y, gridDelta.x);
  const deflectedHeadingRadians = headingRadians + wobbleRadians;
  const cosHeading = Math.cos(deflectedHeadingRadians);
  const sinHeading = Math.sin(deflectedHeadingRadians);

  return {
    gridDelta: {
      x: cosHeading * magnitude,
      y: sinHeading * magnitude,
    },
    nextPhaseRadians,
  };
}
