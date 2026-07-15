import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_SEGMENT_HEALTH } from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';

/**
 * Returns normalized positions (0..1) for vertical League-style segment lines.
 *
 * Lines are placed every {@link DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_SEGMENT_HEALTH}
 * hit points, excluding the start and end of the bar.
 */
export function listingWorldPlazaEntityHealthBarSegmentLineRatios(
  effectiveMaxHealth: number,
  segmentHealth: number = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_SEGMENT_HEALTH
): number[] {
  if (effectiveMaxHealth <= segmentHealth) {
    return [];
  }

  const segmentLineRatios: number[] = [];

  for (
    let healthMarker = segmentHealth;
    healthMarker < effectiveMaxHealth;
    healthMarker += segmentHealth
  ) {
    segmentLineRatios.push(healthMarker / effectiveMaxHealth);
  }

  return segmentLineRatios;
}

/**
 * Number of equal-width visual segments on the health bar (one per 100 HP chunk).
 */
export function computingWorldPlazaEntityHealthBarSegmentCount(
  effectiveMaxHealth: number,
  segmentHealth: number = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_SEGMENT_HEALTH
): number {
  if (effectiveMaxHealth <= segmentHealth) {
    return 1;
  }

  return Math.ceil(effectiveMaxHealth / segmentHealth);
}

/**
 * Single-layer CSS background for segment tick marks (avoids N flex child nodes).
 *
 * @returns `null` when the bar is one segment and needs no dividers.
 */
export function computingWorldPlazaEntityHealthBarSegmentDividerBackgroundImage(
  segmentCount: number
): string | null {
  if (segmentCount <= 1) {
    return null;
  }

  const segmentPercent = 100 / segmentCount;

  return `repeating-linear-gradient(to right, transparent 0, transparent calc(${segmentPercent}% - 1px), rgba(0,0,0,0.45) calc(${segmentPercent}% - 1px), rgba(0,0,0,0.45) ${segmentPercent}%)`;
}
