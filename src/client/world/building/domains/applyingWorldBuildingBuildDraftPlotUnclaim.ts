import {
  checkingWorldBuildingBuildDraftPlotIdIsLocal,
  type DefiningWorldBuildingBuildDraftState,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import {
  findingWorldBuildingPlotContainingTilePosition,
  listingWorldBuildingPlotPlacedBlocks,
  removingWorldBuildingBlockFromPlot,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import { mergingWorldBuildingViewportPlotsWithBuildDraft } from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  listingWorldBuildingPlacedBlocksInFootprintGroup,
  resolvingWorldBuildingPlacedBlockFootprintGroupId,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { listingWorldBuildingPlacedBlocksFromPlots } from '@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots';

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

function upsertingWorldBuildingWorkingPlot(
  workingPlots: readonly DefiningWorldBuildingPlot[],
  nextPlot: DefiningWorldBuildingPlot
): DefiningWorldBuildingPlot[] {
  const hasWorkingPlot = workingPlots.some(
    (workingPlotEntry) => workingPlotEntry.plotId === nextPlot.plotId
  );

  if (hasWorkingPlot) {
    return workingPlots.map((workingPlotEntry) =>
      workingPlotEntry.plotId === nextPlot.plotId ? nextPlot : workingPlotEntry
    );
  }

  return [...workingPlots, nextPlot];
}

/**
 * Records a plot unclaim in the draft without touching Supabase.
 *
 * Multi-tile utilities (kiln / bloomery) span adjacent 1x1 claims. Unclaiming
 * one tile also strips sibling footprint tiles from neighboring owned plots so
 * the station does not leave invisible orphans.
 *
 * @param input - Unclaim request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftPlotUnclaim(
  input: ApplyingWorldBuildingBuildDraftPlotUnclaimInput
): ApplyingWorldBuildingBuildDraftPlotUnclaimResult {
  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.actorUserId
  );
  const plot = findingWorldBuildingPlotContainingTilePosition(
    effectivePlots,
    input.tilePosition
  );

  if (!plot || plot.ownerId !== input.actorUserId) {
    return {
      errorMessage: 'You can only unclaim plots you own.',
    };
  }

  const allPlacedBlocks = listingWorldBuildingPlacedBlocksFromPlots(effectivePlots);
  const footprintSiblingBlocks = listingWorldBuildingPlotPlacedBlocks(plot).flatMap(
    (blockOnPlot) => {
      if (resolvingWorldBuildingPlacedBlockFootprintGroupId(blockOnPlot) === null) {
        return [];
      }

      return listingWorldBuildingPlacedBlocksInFootprintGroup(
        allPlacedBlocks,
        blockOnPlot
      ).filter((groupBlock) => groupBlock.plotId !== plot.plotId);
    }
  );

  const uniqueFootprintSiblingBlocks = [
    ...new Map(
      footprintSiblingBlocks.map((block) => [block.blockId, block] as const)
    ).values(),
  ];

  const workingPlotsById = new Map(
    effectivePlots.map((plotEntry) => [plotEntry.plotId, plotEntry] as const)
  );
  const nextAddedDraftBlockIds = new Set(input.draft.addedDraftBlockIds);
  const nextRemovedPersistedBlockIds = [...input.draft.removedPersistedBlockIds];

  for (const siblingBlock of uniqueFootprintSiblingBlocks) {
    const plotForSibling = workingPlotsById.get(siblingBlock.plotId);

    if (!plotForSibling) {
      continue;
    }

    const removalResult = removingWorldBuildingBlockFromPlot(
      plotForSibling,
      siblingBlock.tilePosition,
      input.actorUserId,
      resolvingWorldBuildingPlacedBlockWorldLayer(siblingBlock)
    );

    if (!removalResult.ok) {
      return {
        errorMessage: removalResult.error.message,
      };
    }

    workingPlotsById.set(plotForSibling.plotId, removalResult.value);

    if (nextAddedDraftBlockIds.has(siblingBlock.blockId)) {
      nextAddedDraftBlockIds.delete(siblingBlock.blockId);
    } else {
      nextRemovedPersistedBlockIds.push(siblingBlock.blockId);
    }
  }

  for (const block of listingWorldBuildingPlotPlacedBlocks(plot)) {
    nextAddedDraftBlockIds.delete(block.blockId);
  }

  const nextRemovedPersistedPlotIds = [...input.draft.removedPersistedPlotIds];
  const isLocalPlot = checkingWorldBuildingBuildDraftPlotIdIsLocal(plot.plotId);

  if (!isLocalPlot) {
    nextRemovedPersistedPlotIds.push(plot.plotId);
  }

  const blocksOnUnclaimedPlot = listingWorldBuildingPlotPlacedBlocks(plot);
  const filteredRemovedPersistedBlockIds = nextRemovedPersistedBlockIds.filter(
    (blockId) =>
      !blocksOnUnclaimedPlot.some((block) => block.blockId === blockId)
  );

  workingPlotsById.delete(plot.plotId);

  let nextWorkingPlots = input.draft.workingPlots.filter(
    (workingPlot) => workingPlot.plotId !== plot.plotId
  );

  for (const nextPlot of workingPlotsById.values()) {
    if (nextPlot.plotId === plot.plotId) {
      continue;
    }

    nextWorkingPlots = upsertingWorldBuildingWorkingPlot(
      nextWorkingPlots,
      nextPlot
    );
  }

  return {
    draft: {
      ...input.draft,
      workingPlots: nextWorkingPlots,
      addedDraftBlockIds: nextAddedDraftBlockIds,
      removedPersistedBlockIds: filteredRemovedPersistedBlockIds,
      removedPersistedPlotIds: nextRemovedPersistedPlotIds,
    },
  };
}
