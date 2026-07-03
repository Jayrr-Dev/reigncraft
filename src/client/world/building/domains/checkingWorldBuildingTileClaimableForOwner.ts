import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import {
  formattingWorldBuildingOwnerMaxOwnedPlotRejectionMessage,
  formattingWorldBuildingOwnerMaxTileClaimRejectionMessage,
  checkingWorldBuildingOwnerHasReachedMaxOwnedPlotCount,
  checkingWorldBuildingOwnerHasReachedMaxTileClaimCount,
} from "@/components/world/building/domains/countingWorldBuildingOwnerPlotClaims";
import {
  CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE,
  checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer,
} from "@/components/world/building/domains/checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer";
import { checkingWorldBuildingPlotIsPermanent } from "@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary";
import {
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Validates whether an unowned tile can be claimed by a player.
 *
 * @module components/world/building/domains/checkingWorldBuildingTileClaimableForOwner
 */

/**
 * Returns true when a tile is orthogonally adjacent to a plot bounds edge tile.
 *
 * @param bounds - Owned plot rectangle.
 * @param position - Candidate claim tile.
 */
export function checkingWorldBuildingTilePositionAdjacentToPlotBounds(
  bounds: DefiningWorldBuildingPlotBounds,
  position: DefiningWorldBuildingTilePosition,
): boolean {
  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const deltaX = Math.abs(position.tileX - tileX);
      const deltaY = Math.abs(position.tileY - tileY);

      if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns true when the player can claim the tile in claim mode.
 *
 * @param activeViewportPlots - Plots visible in the current build session.
 * @param tilePosition - Candidate claim tile.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function checkingWorldBuildingTileClaimableForOwner(
  activeViewportPlots: readonly DefiningWorldBuildingPlot[],
  tilePosition: DefiningWorldBuildingTilePosition,
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits,
): boolean {
  const existingPlot = findingWorldBuildingPlotContainingTilePosition(
    activeViewportPlots,
    tilePosition,
  );

  if (existingPlot) {
    return false;
  }

  if (
    checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer(
      activeViewportPlots,
      tilePosition,
      ownerUserId,
    )
  ) {
    return false;
  }

  if (
    checkingWorldBuildingOwnerHasReachedMaxTileClaimCount(
      activeViewportPlots,
      ownerUserId,
      plotOwnerLimits,
    )
  ) {
    return false;
  }

  const ownedPlots = activeViewportPlots.filter(
    (plot) =>
      plot.ownerId === ownerUserId && checkingWorldBuildingPlotIsPermanent(plot),
  );

  if (ownedPlots.length === 0) {
    return true;
  }

  const isAdjacentToOwnedPlot = ownedPlots.some((plot) =>
    checkingWorldBuildingTilePositionAdjacentToPlotBounds(
      plot.bounds,
      tilePosition,
    ),
  );

  if (isAdjacentToOwnedPlot) {
    return true;
  }

  return !checkingWorldBuildingOwnerHasReachedMaxOwnedPlotCount(
    activeViewportPlots,
    ownerUserId,
    plotOwnerLimits,
  );
}

/**
 * Returns a user-facing reason when a tile cannot be claimed.
 *
 * @param activeViewportPlots - Plots visible in the current build session.
 * @param tilePosition - Candidate claim tile.
 * @param ownerUserId - Authenticated user id.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function resolvingWorldBuildingTileClaimRejectionMessage(
  activeViewportPlots: readonly DefiningWorldBuildingPlot[],
  tilePosition: DefiningWorldBuildingTilePosition,
  ownerUserId: string,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits,
): string {
  const existingPlot = findingWorldBuildingPlotContainingTilePosition(
    activeViewportPlots,
    tilePosition,
  );

  if (existingPlot) {
    if (existingPlot.ownerId === ownerUserId) {
      return "You already own this tile.";
    }

    return "That tile is already claimed.";
  }

  if (
    checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer(
      activeViewportPlots,
      tilePosition,
      ownerUserId,
    )
  ) {
    return CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE;
  }

  if (
    checkingWorldBuildingOwnerHasReachedMaxTileClaimCount(
      activeViewportPlots,
      ownerUserId,
      plotOwnerLimits,
    )
  ) {
    return formattingWorldBuildingOwnerMaxTileClaimRejectionMessage(
      plotOwnerLimits.maxTileClaimCount,
    );
  }

  const ownedPlots = activeViewportPlots.filter(
    (plot) =>
      plot.ownerId === ownerUserId && checkingWorldBuildingPlotIsPermanent(plot),
  );

  if (ownedPlots.length === 0) {
    return "That tile cannot be claimed.";
  }

  const isAdjacentToOwnedPlot = ownedPlots.some((plot) =>
    checkingWorldBuildingTilePositionAdjacentToPlotBounds(
      plot.bounds,
      tilePosition,
    ),
  );

  if (!isAdjacentToOwnedPlot) {
    if (
      checkingWorldBuildingOwnerHasReachedMaxOwnedPlotCount(
        activeViewportPlots,
        ownerUserId,
        plotOwnerLimits,
      )
    ) {
      return formattingWorldBuildingOwnerMaxOwnedPlotRejectionMessage(
        plotOwnerLimits.maxOwnedPlotCount,
      );
    }

    return "Claim tiles next to land you already own.";
  }

  return "That tile cannot be claimed.";
}
