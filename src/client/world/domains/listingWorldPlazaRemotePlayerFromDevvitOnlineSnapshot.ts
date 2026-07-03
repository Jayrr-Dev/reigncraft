import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { PlazaDevvitOnlinePlayerSnapshot } from '../../../shared/plazaDevvitOnline';
import { parsingWorldPlazaAvatarSkinIdForNetworkSync } from '@/components/world/domains/parsingWorldPlazaAvatarSkinIdForNetworkSync';

/**
 * Maps a Devvit polling player snapshot to the plaza remote player shape.
 */
export function listingWorldPlazaRemotePlayerFromDevvitOnlineSnapshot(
  player: PlazaDevvitOnlinePlayerSnapshot,
): DefiningWorldPlazaRemotePlayer {
  return {
    userId: player.userId,
    displayName: player.displayName,
    profileStatusKind: player.profileStatusKind ?? '',
    avatarUrl: player.avatarUrl ?? '',
    avatarSkinId: parsingWorldPlazaAvatarSkinIdForNetworkSync(player.avatarSkinId),
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
    layer: player.layer || DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER,
  };
}
