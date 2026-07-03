import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_GRAVITY_PROGRESS_EXPONENT } from "@/components/world/domains/definingWorldPlazaGirlSampleFallConstants";

/**
 * Returns the sprite lift that holds the avatar at its takeoff height while it
 * falls to the landing surface with accelerating drop speed.
 *
 * The result is negative (screen up) and approaches zero as the fall lands,
 * matching the layer screen offset convention where higher layers sit higher
 * (more negative) on screen. Displacement uses progress raised to
 * {@link DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_GRAVITY_PROGRESS_EXPONENT} so
 * velocity ramps up quickly before impact.
 *
 * @param progress - Normalized fall progress from 0 (start) to 1 (landed).
 * @param totalDropScreenPx - Full vertical drop for this fall (pixels).
 */
export function computingWorldPlazaGirlSampleFallVerticalOffsetPx(
  progress: number,
  totalDropScreenPx: number,
): number {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const gravityProgress = Math.pow(
    clampedProgress,
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_GRAVITY_PROGRESS_EXPONENT,
  );

  return -(1 - gravityProgress) * totalDropScreenPx;
}
