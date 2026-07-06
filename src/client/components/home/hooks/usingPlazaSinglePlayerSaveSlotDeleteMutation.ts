'use client';

import { deletingPlazaSinglePlayerSaveSlot } from '@/components/home/domains/deletingPlazaSinglePlayerSaveSlot';
import type { PlazaSinglePlayerSaveSlotSummary } from '@/components/home/domains/readingPlazaSinglePlayerSaveSlotSummary';
import { PLAZA_SINGLE_PLAYER_SAVE_SLOTS_QUERY_KEY_ROOT } from '@/components/home/hooks/usingPlazaSinglePlayerSaveSlotsQuery';
import { context } from '@devvit/web/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

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
    },
  });

  return {
    deleteSaveSlotAsync: deleteMutation.mutateAsync,
    isDeletingSaveSlot: deleteMutation.isPending,
  };
}
