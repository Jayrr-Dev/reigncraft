import {
  checkingWorldBuildingTileClaimableForOwner,
} from "@/components/world/building/domains/checkingWorldBuildingTileClaimableForOwner";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import type { DefiningWorldBuildingEditMode } from "@/components/world/building/domains/definingWorldBuildingEditMode";
import {
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Resolves which actions a build tile popover should expose.
 *
 * @module components/world/building/domains/resolvingWorldBuildingBuildModeTilePopoverMode
 */

/** Build tile popover action layout. */
export type DefiningWorldBuildingBuildModeTilePopoverMode =
  | "claim"
  | "unclaim"
  | "build"
  | "unavailable";

/**
 * Returns the popover mode for a selected tile given the active edit mode.
 *
 * Build mode only ever exposes block actions on owned plots. Claim mode only
 * ever exposes claim (claimable tiles) or unclaim (owned tiles).
 *
 * @param activeViewportPlots - Plots visible in the current edit session.
 * @param tilePosition - Selected tile.
 * @param ownerUserId - Authenticated user id.
 * @param editMode - Active edit mode (build or claim).
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function resolvingWorldBuildingBuildModeTilePopoverMode(
  activeViewportPlots: DefiningWorldBuildingPlot[],
  tilePosition: DefiningWorldBuildingTilePosition | null,
  ownerUserId: string | null,
  editMode: DefiningWorldBuildingEditMode,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits,
): DefiningWorldBuildingBuildModeTilePopoverMode {
  if (!tilePosition || !ownerUserId) {
    return "unavailable";
  }

  const plot = findingWorldBuildingPlotContainingTilePosition(
    activeViewportPlots,
    tilePosition,
  );

  const isOwnedByActor = Boolean(plot) && plot?.ownerId === ownerUserId;

  if (editMode === "claim") {
    if (isOwnedByActor) {
      return "unclaim";
    }

    if (
      checkingWorldBuildingTileClaimableForOwner(
        activeViewportPlots,
        tilePosition,
        ownerUserId,
        plotOwnerLimits,
      )
    ) {
      return "claim";
    }

    return "unavailable";
  }

  if (isOwnedByActor) {
    return "build";
  }

  return "unavailable";
}
