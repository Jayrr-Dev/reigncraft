import { checkingWorldBuildingPlotIsTemporary } from '@/components/world/building/domains/checkingWorldBuildingPlotIsTemporary';
import {
  listingWorldBuildingBuildDraftPendingLocalPlots,
  type DefiningWorldBuildingBuildDraftState,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { listingWorldBuildingPlotPlacedBlocks } from '@/components/world/building/domains/definingWorldBuildingPlot';
import {
  persistingWorldBuildingPlacedBlock,
  provisioningWorldBuildingTemporaryTilePlot,
  provisioningWorldBuildingTilePlot,
  removingWorldBuildingPlacedBlockPersistence,
  removingWorldBuildingPlotPersistence,
} from '@/components/world/building/repositories/persistingWorldBuildingPlacedBlock';

/**
 * Persists a local build draft to Supabase.
 *
 * @module components/world/building/repositories/persistingWorldBuildingBuildDraft
 */

/**
 * Writes pending plot claims, block inserts, and block deletes from a build draft.
 *
 * Newly added blocks are written as one batch: if any insert fails, already-written
 * inserts from this flush are deleted so a 2x2 kiln cannot leave orphan satellites.
 *
 * @param draft - Local build draft to persist.
 * @param ownerUserId - Authenticated user id.
 */
export async function persistingWorldBuildingBuildDraft(
  draft: DefiningWorldBuildingBuildDraftState,
  ownerUserId: string
): Promise<void> {
  const plotIdReplacements = new Map<string, string>();

  for (const localPlot of listingWorldBuildingBuildDraftPendingLocalPlots(
    draft,
    ownerUserId
  )) {
    const persistedPlotId = checkingWorldBuildingPlotIsTemporary(localPlot)
      ? await provisioningWorldBuildingTemporaryTilePlot(
          ownerUserId,
          localPlot.bounds.minTileX,
          localPlot.bounds.minTileY
        )
      : await provisioningWorldBuildingTilePlot(
          ownerUserId,
          localPlot.bounds.minTileX,
          localPlot.bounds.minTileY
        );
    plotIdReplacements.set(localPlot.plotId, persistedPlotId);
  }

  for (const plotId of draft.removedPersistedPlotIds) {
    await removingWorldBuildingPlotPersistence(plotId);
  }

  for (const blockId of draft.removedPersistedBlockIds) {
    await removingWorldBuildingPlacedBlockPersistence(blockId);
  }

  const persistedBlockIdsThisFlush: string[] = [];

  try {
    for (const plot of draft.workingPlots) {
      if (plot.ownerId !== ownerUserId) {
        continue;
      }

      if (draft.removedPersistedPlotIds.includes(plot.plotId)) {
        continue;
      }

      const persistedPlotId = plotIdReplacements.get(plot.plotId) ?? plot.plotId;

      for (const block of listingWorldBuildingPlotPlacedBlocks(plot)) {
        if (!draft.addedDraftBlockIds.has(block.blockId)) {
          continue;
        }

        await persistingWorldBuildingPlacedBlock({
          blockId: block.blockId,
          plotId: persistedPlotId,
          definitionId: block.definitionId,
          tilePosition: block.tilePosition,
          worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
          blockHeight: resolvingWorldBuildingPlacedBlockBlockHeight(block),
          ownerUserId,
          placedAt: block.placedAt,
          metadata: block.metadata,
        });
        persistedBlockIdsThisFlush.push(block.blockId);
      }
    }
  } catch (error) {
    for (const blockId of persistedBlockIdsThisFlush.reverse()) {
      try {
        await removingWorldBuildingPlacedBlockPersistence(blockId);
      } catch {
        // Best-effort rollback; surface the original insert failure.
      }
    }

    throw error;
  }
}
