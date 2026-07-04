import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type {
  DefiningWorldPlazaOnlineRoomPresencePayload,
  DefiningWorldPlazaRemotePlayer,
} from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';

/**
 * Parses raw Supabase presence entries into remote player records.
 *
 * @param entries - `newPresences` or `leftPresences` from a Realtime event.
 */
export function listingWorldPlazaRemotePlayersFromPresenceEntries(
  entries: unknown[]
): DefiningWorldPlazaRemotePlayer[] {
  const players: DefiningWorldPlazaRemotePlayer[] = [];

  for (const entry of entries) {
    const payload = (entry ??
      {}) as Partial<DefiningWorldPlazaOnlineRoomPresencePayload>;
    const userId = payload.user_id?.trim();

    if (!userId) {
      continue;
    }

    players.push({
      userId,
      displayName: payload.display_name?.trim() || 'Member',
      profileStatusKind: '',
      avatarUrl: '',
      avatarSkinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
      x: typeof payload.x === 'number' ? payload.x : 0,
      y: typeof payload.y === 'number' ? payload.y : 0,
      updatedAt: payload.updated_at ?? new Date().toISOString(),
      motionKind: DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.motionKind,
      facingDirection:
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.facingDirection,
      jumpStartedAtMs: 0,
      jumpArcPeakScreenPx: 0,
      healthCurrent: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      healthEffectiveMax: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      shieldPoints: 0,
      isInvincible: false,
      layer: DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.layer,
    });
  }

  return players;
}
