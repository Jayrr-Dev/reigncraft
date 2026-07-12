import {
  CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE,
  checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer,
} from '@/components/world/building/domains/checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer';
import {
  checkingWorldBuildingOwnerHasReachedMaxTemporaryTileClaimCount,
  formattingWorldBuildingOwnerMaxTemporaryTileClaimRejectionMessage,
} from '@/components/world/building/domains/countingWorldBuildingOwnerTemporaryTileClaims';
import {
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED } from '@/components/world/building/domains/definingWorldTemporaryPlotFeatureFlag';

/**
 * Validates whether an unowned tile can receive a temporary build claim.
 *
 * @module components/world/building/domains/checkingWorldBuildingTemporaryTileClaimableForOwner
 */

/**
 * Returns true when the player can place a temporary tile claim in claim mode.
 *
 * @param activeViewportPlots - Plots visible in the current build session.
 * @param tilePosition - Candidate claim tile.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function checkingWorldBuildingTemporaryTileClaimableForOwner(
  activeViewportPlots: readonly DefiningWorldBuildingPlot[],
  tilePosition: DefiningWorldBuildingTilePosition,
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits
): boolean {
  if (!DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED) {
    return false;
  }

  const existingPlot = findingWorldBuildingPlotContainingTilePosition(
    activeViewportPlots,
    tilePosition
  );

  if (existingPlot) {
    return false;
  }

  if (
    checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer(
      activeViewportPlots,
      tilePosition,
      ownerUserId
    )
  ) {
    return false;
  }

  if (
    checkingWorldBuildingOwnerHasReachedMaxTemporaryTileClaimCount(
      activeViewportPlots,
      ownerUserId,
      plotOwnerLimits
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Returns a user-facing reason when a temporary tile cannot be claimed.
 *
 * @param activeViewportPlots - Plots visible in the current build session.
 * @param tilePosition - Candidate claim tile.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function resolvingWorldBuildingTemporaryTileClaimRejectionMessage(
  activeViewportPlots: readonly DefiningWorldBuildingPlot[],
  tilePosition: DefiningWorldBuildingTilePosition,
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits
): string {
  const existingPlot = findingWorldBuildingPlotContainingTilePosition(
    activeViewportPlots,
    tilePosition
  );

  if (existingPlot) {
    if (existingPlot.ownerId === ownerUserId) {
      return 'You already own this tile.';
    }

    return 'That tile is already claimed.';
  }

  if (
    checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer(
      activeViewportPlots,
      tilePosition,
      ownerUserId
    )
  ) {
    return CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE;
  }

  if (
    checkingWorldBuildingOwnerHasReachedMaxTemporaryTileClaimCount(
      activeViewportPlots,
      ownerUserId,
      plotOwnerLimits
    )
  ) {
    return formattingWorldBuildingOwnerMaxTemporaryTileClaimRejectionMessage(
      plotOwnerLimits.maxTemporaryTileCount
    );
  }

  return 'That tile cannot be claimed.';
}
