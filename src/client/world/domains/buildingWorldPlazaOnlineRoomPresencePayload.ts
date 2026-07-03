import type { DefiningWorldPlazaOnlineRoomPresencePayload } from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Builds the presence payload broadcast for a plaza room participant.
 *
 * @param userId - Auth user id.
 * @param displayName - Label shown to other players.
 * @param gridPoint - Current avatar position in grid space.
 */
export function buildingWorldPlazaOnlineRoomPresencePayload(
  userId: string,
  displayName: string,
  gridPoint: DefiningWorldPlazaWorldPoint,
): DefiningWorldPlazaOnlineRoomPresencePayload {
  return {
    user_id: userId,
    display_name: displayName,
    x: gridPoint.x,
    y: gridPoint.y,
    updated_at: new Date().toISOString(),
  };
}
