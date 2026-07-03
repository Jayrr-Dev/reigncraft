/**
 * Per-user plot and tile claim limits for world building.
 *
 * @module components/world/building/domains/definingWorldBuildingPlotOwnerLimits
 */

/** Plot and tile caps assigned to one player. */
export interface DefiningWorldBuildingPlotOwnerLimits {
  maxOwnedPlotCount: number;
  maxTileClaimCount: number;
  maxTemporaryTileCount: number;
}
