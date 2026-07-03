import type { DefiningWorldPlazaColyseusPlayer } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";

/** Iterable Colyseus player map exposed on synchronized room state. */
type BuildingWorldPlazaColyseusPlayerMotionFingerprintParams = {
  entries(): IterableIterator<[string, DefiningWorldPlazaColyseusPlayer]>;
};

/**
 * Builds a fingerprint for live avatar motion synced over Colyseus.
 *
 * @param players - Synchronized player map from the joined room.
 */
export function buildingWorldPlazaColyseusPlayerMotionFingerprint(
  players: BuildingWorldPlazaColyseusPlayerMotionFingerprintParams | undefined,
): string {
  const fingerprintParts: string[] = [];

  for (const [sessionId, player] of players?.entries() ?? []) {
    fingerprintParts.push(
      [
        sessionId,
        player.x.toFixed(3),
        player.y.toFixed(3),
        player.motionKind,
        player.facingDirection,
        player.jumpStartedAtMs,
        player.jumpArcPeakScreenPx,
        player.layer,
      ].join(":"),
    );
  }

  return fingerprintParts.sort().join("|");
}
