/**
 * Chooses claim-tile wash vs build-block ghost for placement preview.
 *
 * Ground-layer build placement uses the same numeric world layer as claim
 * markers, so claim mode must be checked explicitly.
 *
 * @module components/world/building/domains/checkingWorldBuildingPlacementPreviewUsesClaimTile
 */

export type CheckingWorldBuildingPlacementPreviewUsesClaimTileParams = {
  readonly isClaimModeActive: boolean;
  readonly previewWorldLayer: number;
};

/**
 * Returns true when the hover preview should draw a claimable plot tile wash.
 *
 * @param params - Claim mode flag and resolved preview world layer.
 */
export function checkingWorldBuildingPlacementPreviewUsesClaimTile(
  params: CheckingWorldBuildingPlacementPreviewUsesClaimTileParams
): boolean {
  void params.previewWorldLayer;
  return params.isClaimModeActive;
}
