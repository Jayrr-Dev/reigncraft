import {
  checkingWorldBuildingTemporaryTileClaimableForOwner,
  resolvingWorldBuildingTemporaryTileClaimRejectionMessage,
} from "@/components/world/building/domains/checkingWorldBuildingTemporaryTileClaimableForOwner";
import {
  creatingWorldBuildingBuildDraftTilePlot,
  mergingWorldBuildingViewportPlotsWithBuildDraft,
  type DefiningWorldBuildingBuildDraftState,
} from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Adds a local temporary tile claim to the build draft without touching Supabase.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftTemporaryPlotProvision
 */

/** Successful local temporary tile claim result. */
export interface ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
}

/** Failed local temporary tile claim result. */
export interface ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionFailure {
  readonly errorMessage: string;
}

/** Result from {@link applyingWorldBuildingBuildDraftTemporaryPlotProvision}. */
export type ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionResult =
  | ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionSuccess
  | ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionFailure;

/** Input for {@link applyingWorldBuildingBuildDraftTemporaryPlotProvision}. */
export interface ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionInput {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  readonly viewportPlots: DefiningWorldBuildingPlot[];
  readonly ownerUserId: string;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
}

/**
 * Records a temporary one-tile claim in the draft without touching Supabase.
 *
 * @param input - Claim request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftTemporaryPlotProvision(
  input: ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionInput,
): ApplyingWorldBuildingBuildDraftTemporaryPlotProvisionResult {
  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.ownerUserId,
  );

  if (
    !checkingWorldBuildingTemporaryTileClaimableForOwner(
      effectivePlots,
      input.tilePosition,
      input.ownerUserId,
      input.plotOwnerLimits,
    )
  ) {
    return {
      errorMessage: resolvingWorldBuildingTemporaryTileClaimRejectionMessage(
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
    { isTemporary: true },
  );

  return {
    draft: {
      ...input.draft,
      workingPlots: [...input.draft.workingPlots, draftPlot],
    },
  };
}
