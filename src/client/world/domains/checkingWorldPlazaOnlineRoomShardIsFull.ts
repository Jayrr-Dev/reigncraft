/**
 * Returns true when a shard has no open slots for a new participant.
 *
 * @param participantCount - Unique presence keys on the shard channel.
 * @param maxPlayersPerRoom - Maximum players allowed per shard.
 * @param isLocalUserAlreadyPresent - Whether the local user is already tracked.
 */
export function checkingWorldPlazaOnlineRoomShardIsFull(
  participantCount: number,
  maxPlayersPerRoom: number,
  isLocalUserAlreadyPresent: boolean,
): boolean {
  return participantCount >= maxPlayersPerRoom && !isLocalUserAlreadyPresent;
}
