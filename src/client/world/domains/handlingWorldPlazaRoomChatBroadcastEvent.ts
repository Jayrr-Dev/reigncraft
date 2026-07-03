import { appendingWorldPlazaRoomChatMessage } from "@/components/world/domains/appendingWorldPlazaRoomChatMessage";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
  type DefiningWorldPlazaOnlineRoomChatSnapshot,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import { parsingWorldPlazaRoomChatBroadcastPayload } from "@/components/world/domains/parsingWorldPlazaRoomChatBroadcastPayload";
import type { QueryClient } from "@tanstack/react-query";

/**
 * Applies an incoming plaza room chat broadcast to the TanStack Query snapshot.
 *
 * @param queryClient - TanStack Query client for the chat snapshot cache.
 * @param payload - Raw broadcast payload from Supabase Realtime.
 */
export function handlingWorldPlazaRoomChatBroadcastEvent(
  queryClient: QueryClient,
  payload: unknown,
): void {
  const parsedPayload = parsingWorldPlazaRoomChatBroadcastPayload(payload);

  if (!parsedPayload) {
    return;
  }

  queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
    DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
    (currentSnapshot) => {
      const snapshot =
        currentSnapshot ?? DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT;

      return {
        ...snapshot,
        bubbles: appendingWorldPlazaRoomChatMessage(
          snapshot.bubbles,
          parsedPayload,
        ),
      };
    },
  );
}
