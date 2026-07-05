/** Minimum poison pool damage and per-tick damage while the pool is active. */
export const DEFINING_WORLD_PLAZA_ENTITY_POISON_MIN_DAMAGE_AMOUNT = 1;

/** One segment of the poison damage ramp over the effect duration. */
export type DefiningWorldPlazaEntityPoisonRampSegment = {
  /** Share of total duration (must sum to 1 across segments). */
  timeShare: number;
  /** Share of total pool damage dealt during this segment (must sum to 1). */
  damageShare: number;
};

/**
 * Poison ramp: 15% damage in the first 50% of time, 35% in the next 35%,
 * and 50% in the final 15%.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_POISON_RAMP_SEGMENTS: readonly DefiningWorldPlazaEntityPoisonRampSegment[] =
  [
    { timeShare: 0.5, damageShare: 0.15 },
    { timeShare: 0.35, damageShare: 0.35 },
    { timeShare: 0.15, damageShare: 0.5 },
  ];

/**
 * Returns the fraction of total poison pool damage expected to be dealt
 * by the given normalized progress through the effect (0..1).
 */
export function computingWorldPlazaEntityPoisonRampCumulativeDamageFraction(
  progress: number
): number {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  let timeCursor = 0;
  let damageCursor = 0;

  for (const segment of DEFINING_WORLD_PLAZA_ENTITY_POISON_RAMP_SEGMENTS) {
    const segmentEnd = timeCursor + segment.timeShare;

    if (clampedProgress <= segmentEnd) {
      const segmentProgress =
        segment.timeShare <= 0
          ? 1
          : (clampedProgress - timeCursor) / segment.timeShare;

      return damageCursor + segment.damageShare * segmentProgress;
    }

    timeCursor = segmentEnd;
    damageCursor += segment.damageShare;
  }

  return 1;
}
