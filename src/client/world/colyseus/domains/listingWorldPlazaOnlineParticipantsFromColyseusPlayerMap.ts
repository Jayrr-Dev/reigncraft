import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type { DefiningWorldPlazaOnlineParticipant } from "@/components/world/domains/definingWorldPlazaOnlineRoom";

/** Iterable Colyseus player map exposed on synchronized room state. */
type ListingWorldPlazaOnlineParticipantsFromColyseusPlayerMapParams = {
  entries(): IterableIterator<[string, DefiningWorldPlazaColyseusPlayer]>;
};

/**
 * Lists every unique auth user currently in the Colyseus room.
 *
 * @param players - Synchronized player map from the joined room.
 */
export function listingWorldPlazaOnlineParticipantsFromColyseusPlayerMap(
  players:
    | ListingWorldPlazaOnlineParticipantsFromColyseusPlayerMapParams
    | undefined,
): DefiningWorldPlazaOnlineParticipant[] {
  const participantsByUserId = new Map<string, DefiningWorldPlazaOnlineParticipant>();

  for (const [, player] of players?.entries() ?? []) {
    const userId = player.userId?.trim();

    if (!userId) {
      continue;
    }

    participantsByUserId.set(userId, {
      userId,
      displayName: player.displayName?.trim() || "Member",
    });
  }

  return Array.from(participantsByUserId.values()).sort((left, right) =>
    left.displayName.localeCompare(right.displayName),
  );
}
