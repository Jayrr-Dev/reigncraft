/**
 * Debug overlay stroke descriptors for collision providers.
 *
 * @module components/world/collision/domains/definingWorldCollisionProviderDebugStroke
 */

/** How a provider's collider is drawn in the debug overlay. */
export type DefiningWorldCollisionProviderDebugStrokeKind =
  | 'isometricTileDiamond'
  | 'gridCircle'
  | 'columnRockBundle';

/** Stroke colors and shape kind for one provider's debug overlay. */
export type DefiningWorldCollisionProviderDebugStroke = {
  readonly kind: DefiningWorldCollisionProviderDebugStrokeKind;
  /** Primary dashed outline color. */
  readonly strokeColor: number;
  /** Secondary outline (column-rock player contact boundary). */
  readonly secondaryStrokeColor?: number;
  /** Footprint tile outlines (column-rock walkable tiles). */
  readonly footprintStrokeColor?: number;
};
