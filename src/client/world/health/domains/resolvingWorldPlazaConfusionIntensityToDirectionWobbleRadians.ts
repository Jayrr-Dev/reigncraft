import {
  DEFINING_WORLD_PLAZA_CONFUSION_BARELY_PERCEPTIBLE_INTENSITY,
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX,
  DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
  DEFINING_WORLD_PLAZA_CONFUSION_MAX_DIRECTION_WOBBLE_RAD,
  DEFINING_WORLD_PLAZA_CONFUSION_MIN_DIRECTION_WOBBLE_RAD,
} from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';

/**
 * Maps a confusion intensity (1–100) to a max heading wobble in radians.
 */
export function resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(
  intensity: number
): number {
  const clampedIntensity = Math.max(
    DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN,
    Math.min(DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX, intensity)
  );
  const normalizedIntensity =
    (clampedIntensity - DEFINING_WORLD_PLAZA_CONFUSION_BARELY_PERCEPTIBLE_INTENSITY) /
    (DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX -
      DEFINING_WORLD_PLAZA_CONFUSION_BARELY_PERCEPTIBLE_INTENSITY);
  const clampedNormalizedIntensity = Math.max(0, Math.min(1, normalizedIntensity));

  return (
    DEFINING_WORLD_PLAZA_CONFUSION_MIN_DIRECTION_WOBBLE_RAD +
    clampedNormalizedIntensity *
      (DEFINING_WORLD_PLAZA_CONFUSION_MAX_DIRECTION_WOBBLE_RAD -
        DEFINING_WORLD_PLAZA_CONFUSION_MIN_DIRECTION_WOBBLE_RAD)
  );
}
