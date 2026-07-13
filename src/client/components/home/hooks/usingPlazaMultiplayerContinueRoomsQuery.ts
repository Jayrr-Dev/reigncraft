'use client';

import {
  PLAZA_DEVVIT_ONLINE_ROOMS_MINE_API_PATH,
  type PlazaDevvitOnlineRoomsResponse,
} from '../../../../shared/plazaDevvitOnline';
import { useQuery } from '@tanstack/react-query';

const USING_PLAZA_MULTIPLAYER_CONTINUE_ROOMS_QUERY_KEY = [
  'plaza-multiplayer-rooms-mine',
] as const;

const USING_PLAZA_MULTIPLAYER_CONTINUE_ROOMS_POLL_INTERVAL_MS = 3_000;

/**
 * Polls Continue worlds for the signed-in multiplayer player.
 *
 * @param isEnabled - When false, the query stays disabled.
 */
export function usingPlazaMultiplayerContinueRoomsQuery(isEnabled: boolean) {
  return useQuery({
    queryKey: USING_PLAZA_MULTIPLAYER_CONTINUE_ROOMS_QUERY_KEY,
    queryFn: async (): Promise<PlazaDevvitOnlineRoomsResponse> => {
      const response = await fetch(PLAZA_DEVVIT_ONLINE_ROOMS_MINE_API_PATH);

      return (await response.json()) as PlazaDevvitOnlineRoomsResponse;
    },
    enabled: isEnabled,
    refetchInterval: USING_PLAZA_MULTIPLAYER_CONTINUE_ROOMS_POLL_INTERVAL_MS,
    staleTime: USING_PLAZA_MULTIPLAYER_CONTINUE_ROOMS_POLL_INTERVAL_MS,
  });
}
