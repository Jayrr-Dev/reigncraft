'use client';

import {
  PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH,
  type PlazaDevvitOnlineRoomsResponse,
} from '../../../../shared/plazaDevvitOnline';
import { useQuery } from '@tanstack/react-query';

const USING_PLAZA_MULTIPLAYER_ROOMS_QUERY_KEY = [
  'plaza-multiplayer-rooms',
] as const;

const USING_PLAZA_MULTIPLAYER_ROOMS_POLL_INTERVAL_MS = 3_000;

/**
 * Polls plaza room occupancy for the multiplayer browser.
 *
 * @param isEnabled - When false, the query stays disabled.
 */
export function usingPlazaMultiplayerRoomsQuery(isEnabled: boolean) {
  return useQuery({
    queryKey: USING_PLAZA_MULTIPLAYER_ROOMS_QUERY_KEY,
    queryFn: async (): Promise<PlazaDevvitOnlineRoomsResponse> => {
      const response = await fetch(PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH);

      return (await response.json()) as PlazaDevvitOnlineRoomsResponse;
    },
    enabled: isEnabled,
    refetchInterval: USING_PLAZA_MULTIPLAYER_ROOMS_POLL_INTERVAL_MS,
    staleTime: USING_PLAZA_MULTIPLAYER_ROOMS_POLL_INTERVAL_MS,
  });
}
