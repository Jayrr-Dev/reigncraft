'use client';

import {
  PLAZA_DEVVIT_ONLINE_ROOMS_HOSTED_API_PATH,
  type PlazaDevvitOnlineHostedRoomResponse,
} from '../../../../shared/plazaDevvitOnline';
import { useQuery } from '@tanstack/react-query';

const USING_PLAZA_MULTIPLAYER_HOSTED_ROOM_QUERY_KEY = [
  'plaza-multiplayer-rooms-hosted',
] as const;

/**
 * Loads the one world the signed-in user hosts (create cap).
 *
 * @param isEnabled - When false, the query stays disabled.
 */
export function usingPlazaMultiplayerHostedRoomQuery(isEnabled: boolean) {
  return useQuery({
    queryKey: USING_PLAZA_MULTIPLAYER_HOSTED_ROOM_QUERY_KEY,
    queryFn: async (): Promise<PlazaDevvitOnlineHostedRoomResponse> => {
      const response = await fetch(PLAZA_DEVVIT_ONLINE_ROOMS_HOSTED_API_PATH);

      return (await response.json()) as PlazaDevvitOnlineHostedRoomResponse;
    },
    enabled: isEnabled,
    staleTime: 5_000,
  });
}
