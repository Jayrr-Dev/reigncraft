import {
  checkingWorldBuildingBuildDraftPlotIdIsLocal,
  type DefiningWorldBuildingBuildDraftState,
} from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import {
  findingWorldBuildingPlotContainingTilePosition,
  listingWorldBuildingPlotPlacedBlocks,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import { mergingWorldBuildingViewportPlotsWithBuildDraft } from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Removes an owned plot from the in-memory build draft.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftPlotUnclaim
 */

/** Successful local plot unclaim result. */
export interface ApplyingWorldBuildingBuildDraftPlotUnclaimSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
}

/** Failed local plot unclaim result. */
export interface ApplyingWorldBuildingBuildDraftPlotUnclaimFailure {
  readonly errorMessage: string;
}

/** Result from {@link applyingWorldBuildingBuildDraftPlotUnclaim}. */
export type ApplyingWorldBuildingBuildDraftPlotUnclaimResult =
  | ApplyingWorldBuildingBuildDraftPlotUnclaimSuccess
  | ApplyingWorldBuildingBuildDraftPlotUnclaimFailure;

/** Input for {@link applyingWorldBuildingBuildDraftPlotUnclaim}. */
export interface ApplyingWorldBuildingBuildDraftPlotUnclaimInput {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  readonly viewportPlots: DefiningWorldBuildingPlot[];
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly actorUserId: string;
}

/**
 * Records a plot unclaim in the draft without touching Supabase.
 *
 * @param input - Unclaim request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftPlotUnclaim(
  input: ApplyingWorldBuildingBuildDraftPlotUnclaimInput,
): ApplyingWorldBuildingBuildDraftPlotUnclaimResult {
  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.actorUserId,
  );
  const plot = findingWorldBuildingPlotContainingTilePosition(
    effectivePlots,
    input.tilePosition,
  );

  if (!plot || plot.ownerId !== input.actorUserId) {
    return {
      errorMessage: "You can only unclaim plots you own.",
    };
  }

  const nextAddedDraftBlockIds = new Set(input.draft.addedDraftBlockIds);

  for (const block of listingWorldBuildingPlotPlacedBlocks(plot)) {
    nextAddedDraftBlockIds.delete(block.blockId);
  }

  const nextRemovedPersistedPlotIds = [...input.draft.removedPersistedPlotIds];
  const isLocalPlot = checkingWorldBuildingBuildDraftPlotIdIsLocal(plot.plotId);

  if (!isLocalPlot) {
    nextRemovedPersistedPlotIds.push(plot.plotId);
  }

  const nextRemovedPersistedBlockIds = input.draft.removedPersistedBlockIds.filter(
    (blockId) =>
      !listingWorldBuildingPlotPlacedBlocks(plot).some(
        (block) => block.blockId === blockId,
      ),
  );

  return {
    draft: {
      ...input.draft,
      workingPlots: input.draft.workingPlots.filter(
        (workingPlot) => workingPlot.plotId !== plot.plotId,
      ),
      addedDraftBlockIds: nextAddedDraftBlockIds,
      removedPersistedBlockIds: nextRemovedPersistedBlockIds,
      removedPersistedPlotIds: nextRemovedPersistedPlotIds,
    },
  };
}
