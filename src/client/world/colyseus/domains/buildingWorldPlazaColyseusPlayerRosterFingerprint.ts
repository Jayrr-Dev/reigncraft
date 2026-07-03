import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";

/** Iterable Colyseus player map exposed on synchronized room state. */
type BuildingWorldPlazaColyseusPlayerRosterFingerprintParams = {
  entries(): IterableIterator<[string, DefiningWorldPlazaColyseusPlayer]>;
};

/**
 * Builds a stable fingerprint for the synchronized player map.
 *
 * Used to detect join/leave/profile changes and resync the client roster.
 *
 * @param players - Synchronized player map from the joined room.
 */
export function buildingWorldPlazaColyseusPlayerRosterFingerprint(
  players: BuildingWorldPlazaColyseusPlayerRosterFingerprintParams | undefined,
): string {
  const fingerprintParts: string[] = [];

  for (const [sessionId, player] of players?.entries() ?? []) {
    fingerprintParts.push(
      [
        sessionId,
        player.userId,
        player.displayName,
        player.profileStatusKind,
        player.avatarUrl,
        player.avatarSkinId,
      ].join(":"),
    );
  }

  return fingerprintParts.sort().join("|");
}
