import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE } from "@/components/world/domains/definingWorldPlazaAvatarMotionConstants";
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT } from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";
import type {
  DefiningWorldPlazaOnlineRoomPresencePayload,
  DefiningWorldPlazaRemotePlayer,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";

/**
 * Parses plaza room presence into remote player records.
 *
 * @param presenceState - Raw Supabase presence state for the room channel.
 * @param localUserId - Current auth user id to exclude from remotes.
 */
export function listingWorldPlazaRemotePlayersFromPresenceState(
  presenceState: Record<string, unknown[]>,
  localUserId: string,
): DefiningWorldPlazaRemotePlayer[] {
  const playersById = new Map<string, DefiningWorldPlazaRemotePlayer>();

  for (const [presenceKey, entries] of Object.entries(presenceState)) {
    if (!Array.isArray(entries)) {
      continue;
    }

    for (const entry of entries) {
      const payload = (entry ?? {}) as Partial<
        DefiningWorldPlazaOnlineRoomPresencePayload
      >;
      const resolvedUserId = payload.user_id?.trim() || presenceKey.trim();

      if (resolvedUserId.length === 0 || resolvedUserId === localUserId) {
        continue;
      }

      playersById.set(resolvedUserId, {
        userId: resolvedUserId,
        displayName: payload.display_name?.trim() || "Member",
        profileStatusKind: "",
        avatarUrl: "",
        avatarSkinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
        x: typeof payload.x === "number" ? payload.x : 0,
        y: typeof payload.y === "number" ? payload.y : 0,
        updatedAt: payload.updated_at ?? new Date(0).toISOString(),
        motionKind: DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.motionKind,
        facingDirection: DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.facingDirection,
        jumpStartedAtMs: 0,
        jumpArcPeakScreenPx: 0,
        layer: DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.layer,
      });
    }
  }

  return Array.from(playersById.values());
}

/**
 * Counts unique presence keys in a Supabase presence snapshot.
 *
 * @param presenceState - Raw Supabase presence state.
 */
export function countingWorldPlazaPresenceParticipants(
  presenceState: Record<string, unknown[]>,
): number {
  return Object.keys(presenceState).length;
}
