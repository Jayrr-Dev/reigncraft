/**
 * Resolves out-of-bounds random-walk positions back into a declared area.
 *
 * @module lib/probability/resolvingRandomWalkPointWithinArea
 */

import type { DefiningRandomWalkPoint2d } from '@/lib/probability/definingRandomWalkConstants';
import type {
  DefiningRandomWalkArea,
  DefiningRandomWalkAxisBounds,
  DefiningRandomWalkBoundaryMode,
} from '@/lib/probability/definingRandomWalkArea';

function clampingRandomWalkScalar(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function reflectingRandomWalkScalar(value: number, min: number, max: number): number {
  if (min > max) {
    return value;
  }

  const span = max - min;

  if (span <= 0) {
    return min;
  }

  let reflected = value;

  while (reflected < min || reflected > max) {
    if (reflected > max) {
      reflected = max - (reflected - max);
      continue;
    }

    reflected = min + (min - reflected);
  }

  return clampingRandomWalkScalar(reflected, min, max);
}

/** Clamps or reflects one axis value against closed bounds. */
export function resolvingRandomWalkScalarWithinAxisBounds(
  value: number,
  bounds: DefiningRandomWalkAxisBounds,
  boundaryMode: DefiningRandomWalkBoundaryMode
): number {
  if (boundaryMode === 'reflect') {
    return reflectingRandomWalkScalar(value, bounds.min, bounds.max);
  }

  return clampingRandomWalkScalar(value, bounds.min, bounds.max);
}

/** Clamps or reflects a point to stay inside a rectangle or circle. */
export function resolvingRandomWalkPointWithinArea(
  point: DefiningRandomWalkPoint2d,
  area: DefiningRandomWalkArea,
  boundaryMode: DefiningRandomWalkBoundaryMode
): DefiningRandomWalkPoint2d {
  if (area.kind === 'rect') {
    if (boundaryMode === 'rejectStep') {
      return point;
    }

    return {
      x: resolvingRandomWalkScalarWithinAxisBounds(
        point.x,
        { min: area.minX, max: area.maxX },
        boundaryMode
      ),
      y: resolvingRandomWalkScalarWithinAxisBounds(
        point.y,
        { min: area.minY, max: area.maxY },
        boundaryMode
      ),
    };
  }

  const deltaX = point.x - area.centerX;
  const deltaY = point.y - area.centerY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= area.radiusGrid || distance <= 0) {
    return point;
  }

  if (boundaryMode === 'reflect') {
    const overshoot = distance - area.radiusGrid;
    const reflectedDistance = area.radiusGrid - overshoot;

    if (reflectedDistance >= 0) {
      const scale = reflectedDistance / distance;

      return {
        x: area.centerX + deltaX * scale,
        y: area.centerY + deltaY * scale,
      };
    }
  }

  const clampScale = area.radiusGrid / distance;

  return {
    x: area.centerX + deltaX * clampScale,
    y: area.centerY + deltaY * clampScale,
  };
}
