import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";

/** Iterable Colyseus player map exposed on synchronized room state. */
type DefiningWorldPlazaColyseusPlayerMap = {
  values(): IterableIterator<DefiningWorldPlazaColyseusPlayer>;
};

/**
 * Counts unique auth users in a plaza Colyseus room.
 *
 * Raw `players.size` can exceed this when a refresh leaves a stale session
 * until disconnect is detected. The HUD should use unique users, not sessions.
 *
 * @param players - Synchronized player map from Colyseus room state.
 */
export function countingWorldPlazaColyseusParticipantsFromPlayers(
  players: DefiningWorldPlazaColyseusPlayerMap | undefined,
): number {
  if (!players) {
    return 0;
  }

  const uniqueUserIds = new Set<string>();

  for (const player of players.values()) {
    const userId = player.userId?.trim();

    if (userId) {
      uniqueUserIds.add(userId);
    }
  }

  return uniqueUserIds.size;
}
