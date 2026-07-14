/**
 * Visibility rules for session-scoped builds (campfires on unclaimed land).
 *
 * @module server/domains/checkingWorldBuildingDevvitSessionBlockVisibleToRequester
 */

/**
 * Returns true when a session block should appear in a plots/bounds response.
 *
 * The authenticated requester always sees their own session builds, even when
 * they have no multiplayer presence key (single-player uses
 * `single-player-default` and never writes `plaza:online:player:*`).
 * Other players' session builds only show while that owner is live in the room.
 *
 * Listing must never delete Redis rows based on presence; leave GC to explicit
 * session-block DELETE / leave cleanup.
 *
 * @param ownerId - Session block owner id.
 * @param requestingUserId - Authenticated Reddit user loading plots.
 * @param ownerIsLive - Whether the owner has an active online player key.
 */
export function checkingWorldBuildingDevvitSessionBlockVisibleToRequester(
  ownerId: string,
  requestingUserId: string,
  ownerIsLive: boolean
): boolean {
  if (ownerId === requestingUserId) {
    return true;
  }

  return ownerIsLive;
}
