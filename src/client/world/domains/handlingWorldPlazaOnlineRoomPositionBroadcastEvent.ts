import { applyingWorldPlazaRemotePlayerLiveUpdate } from '@/components/world/domains/applyingWorldPlazaRemotePlayerLiveUpdate';
import { buildingWorldPlazaRemotePlayerPresenceHealthDefaults } from '@/components/world/domains/buildingWorldPlazaRemotePlayerPresenceDefaults';
import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
  type DefiningWorldPlazaOnlineRoomSnapshot,
  type DefiningWorldPlazaRemotePlayer,
} from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import { parsingWorldPlazaOnlineRoomPositionBroadcastPayload } from '@/components/world/domains/parsingWorldPlazaOnlineRoomPositionBroadcastPayload';
import type { QueryClient } from '@tanstack/react-query';
import type { RefObject } from 'react';

/**
 * Applies an incoming plaza position broadcast to the live registry and snapshot.
 *
 * @param queryClient - TanStack Query client for the room snapshot cache.
 * @param remotePlayerRegistryRef - Synchronous map read every Pixi frame.
 * @param payload - Raw broadcast payload from Supabase Realtime.
 * @param localUserId - Auth user id to ignore.
 */
export function handlingWorldPlazaOnlineRoomPositionBroadcastEvent(
  queryClient: QueryClient,
  remotePlayerRegistryRef: RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >,
  payload: unknown,
  localUserId: string
): void {
  const parsedPayload =
    parsingWorldPlazaOnlineRoomPositionBroadcastPayload(payload);

  if (!parsedPayload || parsedPayload.user_id === localUserId) {
    return;
  }

  applyingWorldPlazaRemotePlayerLiveUpdate(
    remotePlayerRegistryRef,
    (
      updater: (
        snapshot: DefiningWorldPlazaOnlineRoomSnapshot
      ) => DefiningWorldPlazaOnlineRoomSnapshot
    ) => {
      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
        (currentSnapshot) =>
          updater(
            currentSnapshot ?? DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT
          )
      );
    },
    {
      userId: parsedPayload.user_id,
      displayName: parsedPayload.display_name,
      profileStatusKind: '',
      avatarUrl: '',
      avatarSkinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
      x: parsedPayload.x,
      y: parsedPayload.y,
      updatedAt: parsedPayload.updated_at,
      motionKind: DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.motionKind,
      facingDirection:
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.facingDirection,
      jumpStartedAtMs: 0,
      jumpArcPeakScreenPx: 0,
      layer: DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE.layer,
      heldItemVisualId: null,
      heldItemTier: null,
      ...buildingWorldPlazaRemotePlayerPresenceHealthDefaults(),
    },
    localUserId
  );
}
