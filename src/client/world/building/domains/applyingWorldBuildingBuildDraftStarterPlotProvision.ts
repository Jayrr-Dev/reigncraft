import {
  checkingWorldBuildingTileClaimableForOwner,
  resolvingWorldBuildingTileClaimRejectionMessage,
} from "@/components/world/building/domains/checkingWorldBuildingTileClaimableForOwner";
import {
  creatingWorldBuildingBuildDraftTilePlot,
  mergingWorldBuildingViewportPlotsWithBuildDraft,
  type DefiningWorldBuildingBuildDraftState,
} from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";

/**
 * Adds a local one-tile plot claim to the build draft without touching Supabase.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftStarterPlotProvision
 */

/** Successful local tile plot claim result. */
export interface ApplyingWorldBuildingBuildDraftStarterPlotProvisionSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
}

/** Failed local tile plot claim result. */
export interface ApplyingWorldBuildingBuildDraftStarterPlotProvisionFailure {
  readonly errorMessage: string;
}

/** Result from {@link applyingWorldBuildingBuildDraftStarterPlotProvision}. */
export type ApplyingWorldBuildingBuildDraftStarterPlotProvisionResult =
  | ApplyingWorldBuildingBuildDraftStarterPlotProvisionSuccess
  | ApplyingWorldBuildingBuildDraftStarterPlotProvisionFailure;

/** Input for {@link applyingWorldBuildingBuildDraftStarterPlotProvision}. */
export interface ApplyingWorldBuildingBuildDraftStarterPlotProvisionInput {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  readonly viewportPlots: DefiningWorldBuildingPlot[];
  readonly ownerUserId: string;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
}

/**
 * Records a one-tile plot claim in the draft without touching Supabase.
 *
 * @param input - Claim request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftStarterPlotProvision(
  input: ApplyingWorldBuildingBuildDraftStarterPlotProvisionInput,
): ApplyingWorldBuildingBuildDraftStarterPlotProvisionResult {
  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.ownerUserId,
  );

  if (
    !checkingWorldBuildingTileClaimableForOwner(
      effectivePlots,
      input.tilePosition,
      input.ownerUserId,
      input.plotOwnerLimits,
    )
  ) {
    return {
      errorMessage: resolvingWorldBuildingTileClaimRejectionMessage(
        effectivePlots,
        input.tilePosition,
        input.ownerUserId,
        input.plotOwnerLimits,
      ),
    };
  }

  const draftPlot = creatingWorldBuildingBuildDraftTilePlot(
    input.ownerUserId,
    input.tilePosition,
  );

  return {
    draft: {
      ...input.draft,
      workingPlots: [...input.draft.workingPlots, draftPlot],
    },
  };
}
