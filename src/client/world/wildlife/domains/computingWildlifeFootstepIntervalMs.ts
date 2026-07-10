import {
  DEFINING_WILDLIFE_FOOTSTEP_BASE_RUN_INTERVAL_MS,
  DEFINING_WILDLIFE_FOOTSTEP_BASE_WALK_INTERVAL_MS,
  DEFINING_WILDLIFE_FOOTSTEP_INTERVAL_VISUAL_SIZE_EXPONENT,
  DEFINING_WILDLIFE_FOOTSTEP_MIN_INSTANCE_INTERVAL_MS,
  DEFINING_WILDLIFE_FOOTSTEP_REFERENCE_WALK_SPEED_GRID_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';

/**
 * Resolves the interval between wildlife footstep one-shots.
 */
export function computingWildlifeFootstepIntervalMs(
  motionClip: DefiningWildlifeMotionClipKind,
  visualSizeMultiplier: number,
  movementSpeedGridPerSecond: number
): number | null {
  if (motionClip !== 'walk' && motionClip !== 'run') {
    return null;
  }

  if (movementSpeedGridPerSecond <= 0) {
    return null;
  }

  const baseIntervalMs =
    motionClip === 'run'
      ? DEFINING_WILDLIFE_FOOTSTEP_BASE_RUN_INTERVAL_MS
      : DEFINING_WILDLIFE_FOOTSTEP_BASE_WALK_INTERVAL_MS;

  const sizeScaledIntervalMs =
    baseIntervalMs *
    visualSizeMultiplier ** DEFINING_WILDLIFE_FOOTSTEP_INTERVAL_VISUAL_SIZE_EXPONENT;

  const speedScaledIntervalMs =
    sizeScaledIntervalMs *
    (DEFINING_WILDLIFE_FOOTSTEP_REFERENCE_WALK_SPEED_GRID_PER_SECOND /
      movementSpeedGridPerSecond);

  return Math.max(
    DEFINING_WILDLIFE_FOOTSTEP_MIN_INSTANCE_INTERVAL_MS,
    speedScaledIntervalMs
  );
}
