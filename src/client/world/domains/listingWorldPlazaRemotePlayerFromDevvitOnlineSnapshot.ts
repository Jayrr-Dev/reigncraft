import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import { DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { parsingWorldPlazaAvatarSkinIdForNetworkSync } from '@/components/world/domains/parsingWorldPlazaAvatarSkinIdForNetworkSync';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { PlazaDevvitOnlinePlayerSnapshot } from '../../../shared/plazaDevvitOnline';

/**
 * Maps a Devvit polling player snapshot to the plaza remote player shape.
 */
export function listingWorldPlazaRemotePlayerFromDevvitOnlineSnapshot(
  player: PlazaDevvitOnlinePlayerSnapshot
): DefiningWorldPlazaRemotePlayer {
  return {
    userId: player.userId,
    displayName: player.displayName,
    profileStatusKind: player.profileStatusKind ?? '',
    avatarUrl: player.avatarUrl ?? '',
    avatarSkinId: parsingWorldPlazaAvatarSkinIdForNetworkSync(
      player.avatarSkinId
    ),
    x: player.x,
    y: player.y,
    updatedAt: player.updatedAt,
    motionKind:
      player.motionKind ||
      DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.motionKind,
    facingDirection:
      player.facingDirection ||
      DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.facingDirection,
    jumpStartedAtMs: player.jumpStartedAtMs || 0,
    jumpArcPeakScreenPx: player.jumpArcPeakScreenPx || 0,
    healthCurrent:
      typeof player.healthCurrent === 'number'
        ? player.healthCurrent
        : DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
    healthEffectiveMax:
      typeof player.healthEffectiveMax === 'number'
        ? player.healthEffectiveMax
        : DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
    shieldPoints:
      typeof player.shieldPoints === 'number' ? player.shieldPoints : 0,
    isInvincible: player.isInvincible === true,
    layer: player.layer || DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER,
    heldItemVisualId: player.heldItemVisualId ?? null,
    heldItemTier: player.heldItemTier ?? null,
  };
}
