'use client';

import {
  formattingPlazaSinglePlayerSaveSlotLastPlayedLabel,
  readingPlazaSinglePlayerSaveSlotSummary,
  type PlazaSinglePlayerSaveSlotSummary,
} from '@/components/home/domains/readingPlazaSinglePlayerSaveSlotSummary';
import { fetchingPlazaSinglePlayerSaveSlotSummaries } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import { context } from '@devvit/web/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  checkingPlazaSaveSlotIndex,
  PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT,
  type PlazaSaveSlotIndex,
} from '../../../../shared/plazaGameSession';

export const PLAZA_SINGLE_PLAYER_SAVE_SLOTS_QUERY_KEY_ROOT =
  'plaza-single-player-save-slots' as const;

/**
 * Loads save slot summaries from Devvit Redis when signed in, otherwise localStorage.
 */
export function usingPlazaSinglePlayerSaveSlotsQuery(): {
  saveSlotSummaries: PlazaSinglePlayerSaveSlotSummary[];
  isLoading: boolean;
} {
  const redditUserId = context.username ? `reddit:${context.username}` : null;

  const remoteQuery = useQuery({
    queryKey: [PLAZA_SINGLE_PLAYER_SAVE_SLOTS_QUERY_KEY_ROOT, redditUserId],
    queryFn: fetchingPlazaSinglePlayerSaveSlotSummaries,
    enabled: redditUserId !== null,
    staleTime: 30_000,
    retry: 1,
  });

  const localSummaries = useMemo(
    () =>
      Array.from({ length: PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT }, (_, index) =>
        readingPlazaSinglePlayerSaveSlotSummary(
          (index + 1) as PlazaSaveSlotIndex
        )
      ),
    []
  );

  if (redditUserId === null) {
    return {
      saveSlotSummaries: localSummaries,
      isLoading: false,
    };
  }

  if (remoteQuery.isLoading) {
    return {
      saveSlotSummaries: localSummaries,
      isLoading: true,
    };
  }

  if (remoteQuery.isError) {
    return {
      saveSlotSummaries: localSummaries,
      isLoading: false,
    };
  }

  const remoteSummaries = remoteQuery.data ?? [];

  const saveSlotSummaries = Array.from(
    { length: PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT },
    (_, index) => {
      const saveSlotIndex = (index + 1) as PlazaSaveSlotIndex;

      if (!checkingPlazaSaveSlotIndex(saveSlotIndex)) {
        return localSummaries[index]!;
      }

      const remoteSummary = remoteSummaries.find(
        (summary) => summary.saveSlotIndex === saveSlotIndex
      );

      return remoteSummary ?? localSummaries[index]!;
    }
  );

  return {
    saveSlotSummaries,
    isLoading: false,
  };
}

export { formattingPlazaSinglePlayerSaveSlotLastPlayedLabel };
