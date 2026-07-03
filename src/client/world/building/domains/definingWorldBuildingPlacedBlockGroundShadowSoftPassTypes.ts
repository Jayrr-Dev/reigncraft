/**
 * Shared soft-pass shape for placed block ground shadows.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowSoftPassTypes
 */

/** Footprint-only soft pass under the block (no cast tongues). */
export type DefiningWorldBuildingPlacedBlockGroundShadowContactSoftPass = {
  readonly offsetXPx: number;
  readonly offsetYPx: number;
  readonly alphaScale: number;
  readonly drawFootprint: true;
  readonly drawTongues: false;
};

/** Cast-only soft pass projected away from the block. */
export type DefiningWorldBuildingPlacedBlockGroundShadowCastSoftPass = {
  readonly offsetXPx: number;
  readonly offsetYPx: number;
  readonly alphaScale: number;
  readonly drawFootprint: false;
  readonly drawTongues: true;
};
