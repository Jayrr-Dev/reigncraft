import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Collision shape primitives in grid space.
 *
 * @module components/world/collision/domains/definingWorldCollisionShape
 */

/** Circular collider centered in grid space. */
export type DefiningWorldCollisionCircleShape = {
  readonly kind: 'circle';
  readonly centerGridX: number;
  readonly centerGridY: number;
  readonly radiusGrid: number;
};

/** Axis-aligned square collider (one isometric tile in grid space). */
export type DefiningWorldCollisionTileSquareShape = {
  readonly kind: 'tileSquare';
  readonly centerGridX: number;
  readonly centerGridY: number;
  readonly halfExtentGrid: number;
};

/** Column-rock base diamond in grid diagonal axes. */
export type DefiningWorldCollisionBaseDiamondShape = {
  readonly kind: 'baseDiamond';
  readonly centerGridX: number;
  readonly centerGridY: number;
  readonly scaleWidth: number;
  readonly scaleHeight: number;
};

/** Multiple axis-aligned sub-squares (cut footprint). */
export type DefiningWorldCollisionCutSubSquaresShape = {
  readonly kind: 'cutSubSquares';
  readonly squares: readonly DefiningWorldCollisionTileSquareShape[];
};

/** Serializable collision shape union. */
export type DefiningWorldCollisionShape =
  | DefiningWorldCollisionCircleShape
  | DefiningWorldCollisionTileSquareShape
  | DefiningWorldCollisionBaseDiamondShape
  | DefiningWorldCollisionCutSubSquaresShape;

/** Player cylinder footprint: circle on the ground plus standing layer band. */
export type DefiningWorldCollisionPlayerFootprint = {
  readonly center: DefiningWorldPlazaWorldPoint;
  readonly radiusGrid: number;
  readonly feetWorldLayer: number;
};
