import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_SIZE_PX,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';

export type ComputingWorldPlazaTimedInteractionProgressRingLayout = {
  readonly ringSizePx: number;
  readonly ringRadiusPx: number;
  readonly ringCenterPx: number;
  readonly ringCircumferencePx: number;
};

/**
 * Resolves fixed SVG geometry for the timed interaction progress ring.
 */
export function computingWorldPlazaTimedInteractionProgressRingLayout(
  ringSizePx: number = DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_SIZE_PX,
  ringStrokePx: number = DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX
): ComputingWorldPlazaTimedInteractionProgressRingLayout {
  const ringRadiusPx = (ringSizePx - ringStrokePx) / 2;

  return {
    ringSizePx,
    ringRadiusPx,
    ringCenterPx: ringSizePx / 2,
    ringCircumferencePx: 2 * Math.PI * ringRadiusPx,
  };
}

/**
 * Maps a depleting progress ratio to an SVG stroke dash offset.
 */
export function computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset(
  ringCircumferencePx: number,
  progressRatio: number
): number {
  const remainingRatio = 1 - progressRatio;

  return ringCircumferencePx * (1 - remainingRatio);
}
