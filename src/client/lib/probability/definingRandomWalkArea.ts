/**
 * Declarative bounds for area-limited random walks.
 *
 * @module lib/probability/definingRandomWalkArea
 */

import type { DefiningRandomWalkPoint2d } from '@/lib/probability/definingRandomWalkConstants';

/** How a walk reacts when a step would leave the allowed region. */
export type DefiningRandomWalkBoundaryMode =
  | 'rejectStep'
  | 'reflect'
  | 'clamp';

export type DefiningRandomWalkAxisBounds = {
  readonly min: number;
  readonly max: number;
};

export type DefiningRandomWalkRectArea = {
  readonly kind: 'rect';
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
};

export type DefiningRandomWalkCircleArea = {
  readonly kind: 'circle';
  readonly centerX: number;
  readonly centerY: number;
  readonly radiusGrid: number;
};

export type DefiningRandomWalkArea =
  | DefiningRandomWalkRectArea
  | DefiningRandomWalkCircleArea;

/** Builds an axis-aligned rectangle from a center point and half extents. */
export function definingRandomWalkRectAreaFromCenter(
  center: DefiningRandomWalkPoint2d,
  halfWidthGrid: number,
  halfHeightGrid: number
): DefiningRandomWalkRectArea {
  return {
    kind: 'rect',
    minX: center.x - halfWidthGrid,
    maxX: center.x + halfWidthGrid,
    minY: center.y - halfHeightGrid,
    maxY: center.y + halfHeightGrid,
  };
}

/** Builds a circular roam disc from a center point and radius. */
export function definingRandomWalkCircleAreaFromCenter(
  center: DefiningRandomWalkPoint2d,
  radiusGrid: number
): DefiningRandomWalkCircleArea {
  return {
    kind: 'circle',
    centerX: center.x,
    centerY: center.y,
    radiusGrid,
  };
}
