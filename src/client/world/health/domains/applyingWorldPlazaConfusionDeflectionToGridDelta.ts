import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import { computingWorldPlazaConfusionDeflectedGridDelta } from '@/components/world/health/domains/computingWorldPlazaConfusionDeflectedGridDelta';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthConfusionMovement } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthConfusionMovement';

export type ApplyingWorldPlazaConfusionDeflectionToGridDeltaInput = {
  gridDelta: DefiningWorldPlazaMovementDirection;
  deltaSeconds: number;
  healthState: DefiningWorldPlazaEntityHealthState | null;
  nowMs: number;
  phaseRadians: number;
};

export type ApplyingWorldPlazaConfusionDeflectionToGridDeltaResult = {
  gridDelta: DefiningWorldPlazaMovementDirection;
  nextPhaseRadians: number;
};

/**
 * Applies active confusion wobble to a locomotion grid delta when present.
 */
export function applyingWorldPlazaConfusionDeflectionToGridDelta({
  gridDelta,
  deltaSeconds,
  healthState,
  nowMs,
  phaseRadians,
}: ApplyingWorldPlazaConfusionDeflectionToGridDeltaInput): ApplyingWorldPlazaConfusionDeflectionToGridDeltaResult {
  const confusion = resolvingWorldPlazaEntityHealthConfusionMovement(
    healthState,
    nowMs
  );

  if (confusion.effectiveIntensity <= 0) {
    return {
      gridDelta,
      nextPhaseRadians: phaseRadians,
    };
  }

  return computingWorldPlazaConfusionDeflectedGridDelta({
    gridDelta,
    deltaSeconds,
    effectiveIntensity: confusion.effectiveIntensity,
    phaseRadians,
    phaseSeed: confusion.phaseSeed,
  });
}
