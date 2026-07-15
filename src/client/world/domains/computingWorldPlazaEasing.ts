/**
 * Pure easing curves for plaza presentation pulses (scale, fade, etc.).
 *
 * All take progress in [0, 1] and return eased progress in [0, 1].
 *
 * @module components/world/domains/computingWorldPlazaEasing
 */

function clampingUnitProgress(progress: number): number {
  if (progress <= 0) {
    return 0;
  }

  if (progress >= 1) {
    return 1;
  }

  return progress;
}

/** Quadratic ease-out: fast start, soft finish. */
export function computingWorldPlazaEaseOutQuad(progress: number): number {
  const t = clampingUnitProgress(progress);
  return 1 - (1 - t) * (1 - t);
}

/** Quadratic ease-in: soft start, fast finish. */
export function computingWorldPlazaEaseInQuad(progress: number): number {
  const t = clampingUnitProgress(progress);
  return t * t;
}

/** Cubic ease-in: soft start, accelerating finish (implode / collapse). */
export function computingWorldPlazaEaseInCubic(progress: number): number {
  const t = clampingUnitProgress(progress);
  return t * t * t;
}

/** Cubic ease-in-out: soft both ends. */
export function computingWorldPlazaEaseInOutCubic(progress: number): number {
  const t = clampingUnitProgress(progress);

  if (t < 0.5) {
    return 4 * t * t * t;
  }

  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smooth half-sine bump peaking at 0.5 (0 at ends, 1 at mid).
 * Optional ease is applied to the raw 0..1 progress before the sine.
 */
export function computingWorldPlazaEaseBumpProgress(
  progress: number,
  ease: (unit: number) => number = computingWorldPlazaEaseInOutCubic
): number {
  const eased = ease(clampingUnitProgress(progress));
  return Math.sin(eased * Math.PI);
}
