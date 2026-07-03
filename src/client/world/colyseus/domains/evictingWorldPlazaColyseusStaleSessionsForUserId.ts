import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type { Client } from "colyseus";
import type { MapSchema } from "@colyseus/schema";

/** Colyseus close code for replacing a duplicate auth session. */
const EVICTING_WORLD_PLAZA_COLYSEUS_DUPLICATE_SESSION_CLOSE_CODE = 4000;

export interface EvictingWorldPlazaColyseusStaleSessionsForUserIdParams {
  /** Connected clients in the plaza room. */
  clients: Client[];
  /** Synchronized player map on room state. */
  players: MapSchema<DefiningWorldPlazaColyseusPlayer>;
  /** Per-session chat cooldown map on the room instance. */
  lastChatSentAtBySessionId: Map<string, number>;
  /** Session id of the client that is joining now. */
  joiningSessionId: string;
  /** Auth user id for the joining client. */
  userId: string;
}

/**
 * Removes prior plaza sessions for the same auth user.
 *
 * A page refresh or dev HMR reconnect can leave the old WebSocket counted in
 * `players.size` even though remotes are filtered by `userId` on the client.
 *
 * @param params - Room clients, synchronized state, and joining identity.
 */
export function evictingWorldPlazaColyseusStaleSessionsForUserId({
  clients,
  players,
  lastChatSentAtBySessionId,
  joiningSessionId,
  userId,
}: EvictingWorldPlazaColyseusStaleSessionsForUserIdParams): void {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    return;
  }

  for (const connectedClient of clients) {
    if (connectedClient.sessionId === joiningSessionId) {
      continue;
    }

    const existingPlayer = players.get(connectedClient.sessionId);

    if (existingPlayer?.userId !== normalizedUserId) {
      continue;
    }

    players.delete(connectedClient.sessionId);
    lastChatSentAtBySessionId.delete(connectedClient.sessionId);
    connectedClient.leave(EVICTING_WORLD_PLAZA_COLYSEUS_DUPLICATE_SESSION_CLOSE_CODE);
  }

  for (const [sessionId, player] of players.entries()) {
    if (sessionId === joiningSessionId || player.userId !== normalizedUserId) {
      continue;
    }

    players.delete(sessionId);
    lastChatSentAtBySessionId.delete(sessionId);
  }
}
