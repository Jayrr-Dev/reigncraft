import {
  findingWorldBuildingPlotContainingTilePosition,
  findingWorldBuildingPlotRemovableBlockAtTileLayerPosition,
  listingWorldBuildingPlotPlacedBlocks,
  removingWorldBuildingBlockFromPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingBuildDraftState } from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import { mergingWorldBuildingViewportPlotsWithBuildDraft } from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  listingWorldBuildingPlacedBlocksInFootprintGroup,
  resolvingWorldBuildingPlacedBlockFootprintGroupId,
  resolvingWorldBuildingPlacedBlockFootprintRole,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';

/**
 * Applies a local block removal to the in-memory build draft.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftBlockRemoval
 */

/** Successful local removal result. */
export interface ApplyingWorldBuildingBuildDraftBlockRemovalSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  /** Anchor (or sole) block used for craft refund bookkeeping. */
  readonly removedPrimaryBlock: DefiningWorldBuildingPlacedBlock;
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
 * Multi-tile footprints remove every tile in the group in one step.
 *
 * @param input - Removal request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftBlockRemoval(
  input: ApplyingWorldBuildingBuildDraftBlockRemovalInput
): ApplyingWorldBuildingBuildDraftBlockRemovalResult {
  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.actorUserId
  );
  const plot = findingWorldBuildingPlotContainingTilePosition(
    effectivePlots,
    input.tilePosition
  );

  if (!plot) {
    return {
      errorMessage: 'You can only remove blocks on your plot.',
    };
  }

  const existingBlock = findingWorldBuildingPlotRemovableBlockAtTileLayerPosition(
    plot,
    input.tilePosition,
    input.worldLayer
  );

  if (!existingBlock || existingBlock.ownerId !== input.actorUserId) {
    return {
      errorMessage: 'You can only remove blocks you placed.',
    };
  }

  const groupBlocks = listingWorldBuildingPlacedBlocksInFootprintGroup(
    listingWorldBuildingPlotPlacedBlocks(plot),
    existingBlock
  );
  const primaryBlock =
    groupBlocks.find(
      (block) =>
        resolvingWorldBuildingPlacedBlockFootprintRole(block) ===
          DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR ||
        resolvingWorldBuildingPlacedBlockFootprintGroupId(block) === null
    ) ?? existingBlock;

  let workingPlot = plot;
  const nextAddedDraftBlockIds = new Set(input.draft.addedDraftBlockIds);
  const nextRemovedPersistedBlockIds = [...input.draft.removedPersistedBlockIds];

  for (const groupBlock of groupBlocks) {
    const removalResult = removingWorldBuildingBlockFromPlot(
      workingPlot,
      groupBlock.tilePosition,
      input.actorUserId,
      resolvingWorldBuildingPlacedBlockWorldLayer(groupBlock)
    );

    if (!removalResult.ok) {
      return {
        errorMessage: removalResult.error.message,
      };
    }

    workingPlot = removalResult.value;

    if (nextAddedDraftBlockIds.has(groupBlock.blockId)) {
      nextAddedDraftBlockIds.delete(groupBlock.blockId);
    } else {
      nextRemovedPersistedBlockIds.push(groupBlock.blockId);
    }
  }

  const nextWorkingPlots = input.draft.workingPlots.map((workingPlotEntry) =>
    workingPlotEntry.plotId === workingPlot.plotId
      ? workingPlot
      : workingPlotEntry
  );

  return {
    draft: {
      ...input.draft,
      workingPlots: nextWorkingPlots,
      addedDraftBlockIds: nextAddedDraftBlockIds,
      removedPersistedBlockIds: nextRemovedPersistedBlockIds,
    },
    removedPrimaryBlock: primaryBlock,
  };
}
