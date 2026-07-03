import {
  findingWorldBuildingPlotContainingTilePosition,
  findingWorldBuildingPlotRemovableBlockAtTileLayerPosition,
  removingWorldBuildingBlockFromPlot,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingBuildDraftState } from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import { mergingWorldBuildingViewportPlotsWithBuildDraft } from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Applies a local block removal to the in-memory build draft.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftBlockRemoval
 */

/** Successful local removal result. */
export interface ApplyingWorldBuildingBuildDraftBlockRemovalSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
}

/** Failed local removal result. */
export interface ApplyingWorldBuildingBuildDraftBlockRemovalFailure {
  readonly errorMessage: string;
}

/** Result from {@link applyingWorldBuildingBuildDraftBlockRemoval}. */
export type ApplyingWorldBuildingBuildDraftBlockRemovalResult =
  | ApplyingWorldBuildingBuildDraftBlockRemovalSuccess
  | ApplyingWorldBuildingBuildDraftBlockRemovalFailure;

/** Input for {@link applyingWorldBuildingBuildDraftBlockRemoval}. */
export interface ApplyingWorldBuildingBuildDraftBlockRemovalInput {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  readonly viewportPlots: DefiningWorldBuildingPlot[];
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly worldLayer: number;
  readonly actorUserId: string;
}

/**
 * Validates and records a block removal in the draft without touching Supabase.
 *
 * @param input - Removal request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftBlockRemoval(
  input: ApplyingWorldBuildingBuildDraftBlockRemovalInput,
): ApplyingWorldBuildingBuildDraftBlockRemovalResult {
  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.actorUserId,
  );
  const plot = findingWorldBuildingPlotContainingTilePosition(
    effectivePlots,
    input.tilePosition,
  );

  if (!plot) {
    return {
      errorMessage: "You can only remove blocks on your plot.",
    };
  }

  const existingBlock = findingWorldBuildingPlotRemovableBlockAtTileLayerPosition(
    plot,
    input.tilePosition,
    input.worldLayer,
  );

  if (!existingBlock || existingBlock.ownerId !== input.actorUserId) {
    return {
      errorMessage: "You can only remove blocks you placed.",
    };
  }

  const removalResult = removingWorldBuildingBlockFromPlot(
    plot,
    input.tilePosition,
    input.actorUserId,
    input.worldLayer,
  );

  if (!removalResult.ok) {
    return {
      errorMessage: removalResult.error.message,
    };
  }

  const nextWorkingPlots = input.draft.workingPlots.map((workingPlot) =>
    workingPlot.plotId === removalResult.value.plotId
      ? removalResult.value
      : workingPlot,
  );
  const nextAddedDraftBlockIds = new Set(input.draft.addedDraftBlockIds);
  const nextRemovedPersistedBlockIds = [...input.draft.removedPersistedBlockIds];

  if (nextAddedDraftBlockIds.has(existingBlock.blockId)) {
    nextAddedDraftBlockIds.delete(existingBlock.blockId);
  } else {
    nextRemovedPersistedBlockIds.push(existingBlock.blockId);
  }

  return {
    draft: {
      ...input.draft,
      workingPlots: nextWorkingPlots,
      addedDraftBlockIds: nextAddedDraftBlockIds,
      removedPersistedBlockIds: nextRemovedPersistedBlockIds,
    },
  };
}
