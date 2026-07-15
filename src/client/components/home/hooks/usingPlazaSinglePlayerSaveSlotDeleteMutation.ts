'use client';

import { deletingPlazaSinglePlayerSaveSlot } from '@/components/home/domains/deletingPlazaSinglePlayerSaveSlot';
import type { PlazaSinglePlayerSaveSlotSummary } from '@/components/home/domains/readingPlazaSinglePlayerSaveSlotSummary';
import { PLAZA_SINGLE_PLAYER_SAVE_SLOTS_QUERY_KEY_ROOT } from '@/components/home/hooks/usingPlazaSinglePlayerSaveSlotsQuery';
import { DEFINING_INVENTORY_QUERY_KEY_ROOT } from '@/components/inventory/domains/definingInventoryConstants';
import { DEFINING_WORLD_BUILDING_PLOTS_REGISTRY_QUERY_KEY_ROOT } from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import { DEFINING_WORLD_BUILDING_PLOT_OWNER_LIMITS_QUERY_KEY_ROOT } from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import { DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT } from '@/components/world/harvest/hooks/usingWorldPlazaChoppedTrees';
import { DEFINING_WORLD_PLAZA_MINED_ROCKS_QUERY_KEY_ROOT } from '@/components/world/harvest/hooks/usingWorldPlazaMinedRocks';
import { DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT } from '@/components/world/harvest/hooks/usingWorldPlazaPickedPebbles';
import { resolvingWorldPlazaInventoryQueryKeySuffix } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { context } from '@devvit/web/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  resolvingPlazaSinglePlayerSessionOwnerId,
  type PlazaSaveSlotIndex,
} from '../../../../shared/plazaGameSession';

/**
 * Deletes one single-player save slot and refreshes the slot list query.
 */
export function usingPlazaSinglePlayerSaveSlotDeleteMutation(): {
  deleteSaveSlotAsync: (saveSlotIndex: PlazaSaveSlotIndex) => Promise<void>;
  isDeletingSaveSlot: boolean;
} {
  const queryClient = useQueryClient();
  const redditUserId = context.username ? `reddit:${context.username}` : null;

  const deleteMutation = useMutation({
    mutationFn: async (saveSlotIndex: PlazaSaveSlotIndex): Promise<void> => {
      await deletingPlazaSinglePlayerSaveSlot(
        saveSlotIndex,
        redditUserId !== null
      );
    },
    onSuccess: (_result, saveSlotIndex) => {
      const clearingSaveSlotSummary = (
        currentSummaries: PlazaSinglePlayerSaveSlotSummary[] | undefined
      ): PlazaSinglePlayerSaveSlotSummary[] | undefined => {
        if (!currentSummaries) {
          return currentSummaries;
        }

        return currentSummaries.map((summary) =>
          summary.saveSlotIndex === saveSlotIndex
            ? {
                saveSlotIndex,
                hasSaveData: false,
                lastPlayedAtMs: null,
              }
            : summary
        );
      };

      queryClient.setQueryData<PlazaSinglePlayerSaveSlotSummary[]>(
        [PLAZA_SINGLE_PLAYER_SAVE_SLOTS_QUERY_KEY_ROOT, null],
        clearingSaveSlotSummary
      );

      if (redditUserId !== null) {
        queryClient.setQueryData<PlazaSinglePlayerSaveSlotSummary[]>(
          [PLAZA_SINGLE_PLAYER_SAVE_SLOTS_QUERY_KEY_ROOT, redditUserId],
          clearingSaveSlotSummary
        );
      }

      const persistenceOwnerId =
        resolvingPlazaSinglePlayerSessionOwnerId(saveSlotIndex);

      // Inventory uses staleTime: Infinity; wipe cache or same-slot re-enter
      // revives bags and can re-persist wiped localStorage / Redis.
      queryClient.removeQueries({
        queryKey: [
          DEFINING_INVENTORY_QUERY_KEY_ROOT,
          resolvingWorldPlazaInventoryQueryKeySuffix(persistenceOwnerId),
        ],
      });

      void queryClient.invalidateQueries({
        queryKey: [DEFINING_WORLD_BUILDING_PLOTS_REGISTRY_QUERY_KEY_ROOT],
      });
      void queryClient.invalidateQueries({
        queryKey: [DEFINING_WORLD_BUILDING_PLOT_OWNER_LIMITS_QUERY_KEY_ROOT],
      });
      void queryClient.invalidateQueries({
        queryKey: [DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT],
      });
      void queryClient.invalidateQueries({
        queryKey: [DEFINING_WORLD_PLAZA_MINED_ROCKS_QUERY_KEY_ROOT],
      });
      void queryClient.invalidateQueries({
        queryKey: [DEFINING_WORLD_PLAZA_PICKED_PEBBLES_QUERY_KEY_ROOT],
      });
    },
  });

  return {
    deleteSaveSlotAsync: deleteMutation.mutateAsync,
    isDeletingSaveSlot: deleteMutation.isPending,
  };
}
