'use client';

import type { CommunityMemberProfileStatusKind } from '@/components/community/domains/definingCommunityMemberProfileStatus';
import {
  applyingWorldPlazaRemotePlayerLiveUpdate,
  removingWorldPlazaRemotePlayerLiveUpdate,
} from '@/components/world/domains/applyingWorldPlazaRemotePlayerLiveUpdate';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
  type DefiningWorldPlazaAvatarMotionState,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
  type DefiningWorldPlazaOnlineRoomSnapshot,
  type DefiningWorldPlazaRemotePlayer,
} from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { listingWorldPlazaRemotePlayerFromDevvitOnlineSnapshot } from '@/components/world/domains/listingWorldPlazaRemotePlayerFromDevvitOnlineSnapshot';
import { serializingWorldPlazaAvatarSkinIdForNetworkSync } from '@/components/world/domains/parsingWorldPlazaAvatarSkinIdForNetworkSync';
import { serializingWorldPlazaUserProfileAvatarUrlForNetworkSync } from '@/components/world/domains/parsingWorldPlazaUserProfileAvatarUrlForNetworkSync';
import { serializingWorldPlazaUserProfileStatusKindForNetworkSync } from '@/components/world/domains/parsingWorldPlazaUserProfileStatusKindForNetworkSync';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import { electingWildlifeSimulationLeaderUserId } from '@/components/world/wildlife/domains/electingWildlifeSimulationLeaderUserId';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import {
  buildingPlazaDevvitOnlineRoomApiUrl,
  PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
  PLAZA_DEVVIT_ONLINE_PLAYERS_API_PATH,
  PLAZA_DEVVIT_ONLINE_POLL_INTERVAL_MS,
  PLAZA_DEVVIT_ONLINE_SYNC_API_PATH,
  PLAZA_DEVVIT_ONLINE_SYNC_INTERVAL_MS,
  type PlazaDevvitOnlinePlayersResponse,
  type PlazaDevvitOnlineProjectileSpawnEvent,
  type PlazaDevvitOnlineSyncRequest,
  type PlazaDevvitOnlineSyncResponse,
  type PlazaDevvitOnlineWildlifeDamageEvent,
  type PlazaDevvitOnlineWildlifeSnapshot,
} from '../../../shared/plazaDevvitOnline';

const USING_WORLD_PLAZA_DEVVIT_POLLING_ROOM_FULL_MESSAGE =
  'This plaza is full (3 players max). Try again in a moment.' as const;

const USING_WORLD_PLAZA_DEVVIT_POLLING_CONNECTION_FAILED_MESSAGE =
  'Could not connect to the plaza. Check your connection and try again.' as const;

export interface UsingWorldPlazaDevvitPollingRoomParams {
  userId: string | null;
  displayName: string;
  profileStatusKind?: CommunityMemberProfileStatusKind | null;
  avatarUrl?: string | null;
  enabled: boolean;
  roomIndex?: number;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>;
  healthSyncSnapshotRef?: React.RefObject<{
    healthCurrent: number;
    healthEffectiveMax: number;
    shieldPoints: number;
    isInvincible: boolean;
  }>;
  pendingProjectileSpawnEventsRef?: React.RefObject<
    PlazaDevvitOnlineProjectileSpawnEvent[]
  >;
  onRemoteProjectileSpawnEvents?: (
    events: readonly PlazaDevvitOnlineProjectileSpawnEvent[]
  ) => void;
  wildlifeSnapshotsOutRef?: React.RefObject<
    PlazaDevvitOnlineWildlifeSnapshot[]
  >;
  pendingWildlifeDamageEventsRef?: React.RefObject<
    PlazaDevvitOnlineWildlifeDamageEvent[]
  >;
  remoteWildlifeSnapshotsRef?: React.RefObject<
    PlazaDevvitOnlineWildlifeSnapshot[]
  >;
}

export interface UsingWorldPlazaDevvitPollingRoomResult {
  roomSnapshot: DefiningWorldPlazaOnlineRoomSnapshot;
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  syncingMovePositionRef: React.RefObject<(() => void) | null>;
}

/**
 * HTTP polling multiplayer for Reddit Devvit webviews (no WebSockets).
 * Caps each post/playtest room at {@link PLAZA_DEVVIT_ONLINE_MAX_PLAYERS}.
 */
export function usingWorldPlazaDevvitPollingRoom({
  userId,
  displayName,
  profileStatusKind = null,
  avatarUrl = null,
  enabled,
  roomIndex = 1,
  playerPositionRef,
  localAvatarMotionStateRef,
  healthSyncSnapshotRef,
  pendingProjectileSpawnEventsRef,
  onRemoteProjectileSpawnEvents,
  wildlifeSnapshotsOutRef,
  pendingWildlifeDamageEventsRef,
  remoteWildlifeSnapshotsRef,
}: UsingWorldPlazaDevvitPollingRoomParams): UsingWorldPlazaDevvitPollingRoomResult {
  const queryClient = useQueryClient();
  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const displayNameRef = useRef(displayName);
  const profileStatusKindRef = useRef(profileStatusKind);
  const avatarUrlRef = useRef(avatarUrl);
  const avatarSkinIdRef = useRef(selectedAvatarSkinId);
  const syncingMovePositionRef = useRef<(() => void) | null>(null);
  const remotePlayerRegistryRef = useRef<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >(new Map());
  const lastSyncedRemoteUserIdsRef = useRef<Set<string>>(new Set());
  const isJoinedRef = useRef(false);

  displayNameRef.current = displayName;
  profileStatusKindRef.current = profileStatusKind;
  avatarUrlRef.current = avatarUrl;
  avatarSkinIdRef.current = selectedAvatarSkinId;

  const {
    data: roomSnapshot = DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
  } = useQuery({
    queryKey: [...DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY, roomIndex],
    queryFn: async (): Promise<DefiningWorldPlazaOnlineRoomSnapshot> => {
      return (
        queryClient.getQueryData<DefiningWorldPlazaOnlineRoomSnapshot>([
          ...DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
          roomIndex,
        ]) ?? DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT
      );
    },
    initialData: DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const applyRoomSnapshotUpdate = useCallback(
    (
      updater: (
        snapshot: DefiningWorldPlazaOnlineRoomSnapshot
      ) => DefiningWorldPlazaOnlineRoomSnapshot
    ): void => {
      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomSnapshot>(
        [...DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY, roomIndex],
        (currentSnapshot) =>
          updater(
            currentSnapshot ?? DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT
          )
      );
    },
    [queryClient, roomIndex]
  );

  const updatingRoomSnapshot = useCallback(
    (patch: Partial<DefiningWorldPlazaOnlineRoomSnapshot>): void => {
      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomSnapshot>(
        [...DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY, roomIndex],
        (currentSnapshot) => ({
          ...(currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT),
          ...patch,
        })
      );
    },
    [queryClient, roomIndex]
  );

  const resettingPlazaRoomConnectionState = useCallback((): void => {
    remotePlayerRegistryRef.current.clear();
    lastSyncedRemoteUserIdsRef.current.clear();
    isJoinedRef.current = false;
    updatingRoomSnapshot(DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT);
  }, [updatingRoomSnapshot]);

  const buildingSyncPayload =
    useCallback((): PlazaDevvitOnlineSyncRequest | null => {
      const playerPosition = playerPositionRef.current;
      const motionState =
        localAvatarMotionStateRef.current ??
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE;

      if (!playerPosition) {
        return null;
      }

      return {
        displayName: displayNameRef.current,
        avatarUrl: serializingWorldPlazaUserProfileAvatarUrlForNetworkSync(
          avatarUrlRef.current
        ),
        profileStatusKind:
          serializingWorldPlazaUserProfileStatusKindForNetworkSync(
            profileStatusKindRef.current
          ),
        avatarSkinId: serializingWorldPlazaAvatarSkinIdForNetworkSync(
          avatarSkinIdRef.current
        ),
        x: playerPosition.x,
        y: playerPosition.y,
        layer: playerPosition.layer,
        motionKind: motionState.motionKind,
        facingDirection: motionState.facingDirection,
        jumpStartedAtMs: motionState.jumpStartedAtMs,
        jumpArcPeakScreenPx: motionState.jumpArcPeakScreenPx,
        healthCurrent:
          healthSyncSnapshotRef?.current?.healthCurrent ??
          DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
        healthEffectiveMax:
          healthSyncSnapshotRef?.current?.healthEffectiveMax ??
          DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
        shieldPoints: healthSyncSnapshotRef?.current?.shieldPoints ?? 0,
        isInvincible: healthSyncSnapshotRef?.current?.isInvincible ?? false,
        projectileSpawnEvents: pendingProjectileSpawnEventsRef?.current?.length
          ? [...pendingProjectileSpawnEventsRef.current]
          : undefined,
        wildlifeSnapshots: wildlifeSnapshotsOutRef?.current?.length
          ? [...wildlifeSnapshotsOutRef.current]
          : undefined,
        wildlifeDamageEvents: pendingWildlifeDamageEventsRef?.current?.length
          ? [...pendingWildlifeDamageEventsRef.current]
          : undefined,
      };
    }, [
      healthSyncSnapshotRef,
      localAvatarMotionStateRef,
      pendingProjectileSpawnEventsRef,
      pendingWildlifeDamageEventsRef,
      playerPositionRef,
      wildlifeSnapshotsOutRef,
    ]);

  const syncingRemotePlayersFromPoll = useCallback(
    (remotePlayers: readonly DefiningWorldPlazaRemotePlayer[]): void => {
      if (!userId) {
        return;
      }

      const nextRemoteUserIds = new Set<string>();

      for (const remotePlayer of remotePlayers) {
        nextRemoteUserIds.add(remotePlayer.userId);
        applyingWorldPlazaRemotePlayerLiveUpdate(
          remotePlayerRegistryRef,
          applyRoomSnapshotUpdate,
          remotePlayer,
          userId
        );
      }

      for (const previousUserId of lastSyncedRemoteUserIdsRef.current) {
        if (!nextRemoteUserIds.has(previousUserId)) {
          removingWorldPlazaRemotePlayerLiveUpdate(
            remotePlayerRegistryRef,
            applyRoomSnapshotUpdate,
            previousUserId,
            userId
          );
        }
      }

      lastSyncedRemoteUserIdsRef.current = nextRemoteUserIds;
    },
    [applyRoomSnapshotUpdate, userId]
  );

  const postingPlazaSyncRef = useRef<(() => Promise<boolean>) | null>(null);

  useEffect(() => {
    if (!enabled || !userId) {
      resettingPlazaRoomConnectionState();
      postingPlazaSyncRef.current = null;
      return;
    }

    updatingRoomSnapshot({
      roomIndex,
      roomChannelName: `devvit-polling-room-${roomIndex}`,
      isConnected: false,
      isJoined: false,
      isReconnecting: false,
      isRoomFull: false,
      lastError: null,
    });

    let cancelled = false;

    const postingPlazaSync = async (): Promise<boolean> => {
      const payload = buildingSyncPayload();

      if (!payload) {
        return false;
      }

      try {
        const response = await fetch(
          buildingPlazaDevvitOnlineRoomApiUrl(
            PLAZA_DEVVIT_ONLINE_SYNC_API_PATH,
            roomIndex
          ),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        const data = (await response.json()) as PlazaDevvitOnlineSyncResponse;

        if (cancelled) {
          return false;
        }

        if (data.type === 'error') {
          updatingRoomSnapshot({
            isConnected: false,
            isJoined: false,
            isRoomFull: data.isRoomFull === true,
            lastError: data.message,
          });
          isJoinedRef.current = false;
          return false;
        }

        if (pendingProjectileSpawnEventsRef?.current) {
          pendingProjectileSpawnEventsRef.current.length = 0;
        }

        if (pendingWildlifeDamageEventsRef?.current) {
          pendingWildlifeDamageEventsRef.current.length = 0;
        }

        isJoinedRef.current = true;
        updatingRoomSnapshot({
          isConnected: true,
          isJoined: true,
          isReconnecting: false,
          isRoomFull: false,
          lastError: null,
          participantCount: data.participantCount,
          onlineParticipants: [
            {
              userId,
              displayName: displayNameRef.current,
            },
            ...Array.from(remotePlayerRegistryRef.current.values()).map(
              (remotePlayer) => ({
                userId: remotePlayer.userId,
                displayName: remotePlayer.displayName,
              })
            ),
          ],
        });

        return true;
      } catch {
        if (!cancelled) {
          updatingRoomSnapshot({
            isConnected: false,
            isJoined: false,
            lastError:
              USING_WORLD_PLAZA_DEVVIT_POLLING_CONNECTION_FAILED_MESSAGE,
          });
          isJoinedRef.current = false;
        }

        return false;
      }
    };

    const pollingRemotePlayers = async (): Promise<void> => {
      if (!isJoinedRef.current) {
        return;
      }

      try {
        const response = await fetch(
          buildingPlazaDevvitOnlineRoomApiUrl(
            PLAZA_DEVVIT_ONLINE_PLAYERS_API_PATH,
            roomIndex
          )
        );

        if (!response.ok) {
          return;
        }

        const data =
          (await response.json()) as PlazaDevvitOnlinePlayersResponse;

        if (cancelled || data.type !== 'players' || !userId) {
          return;
        }

        const remotePlayers = data.players.map(
          listingWorldPlazaRemotePlayerFromDevvitOnlineSnapshot
        );

        const remoteProjectileSpawnEvents = data.players.flatMap((player) =>
          Array.isArray(player.projectileSpawnEvents)
            ? player.projectileSpawnEvents
            : []
        );

        if (
          remoteProjectileSpawnEvents.length > 0 &&
          onRemoteProjectileSpawnEvents
        ) {
          onRemoteProjectileSpawnEvents(remoteProjectileSpawnEvents);
        }

        const leaderUserId = electingWildlifeSimulationLeaderUserId(
          userId,
          data.players.map((player) => player.userId)
        );
        const leaderPlayer = data.players.find(
          (player) => player.userId === leaderUserId
        );

        if (
          remoteWildlifeSnapshotsRef?.current &&
          leaderPlayer &&
          leaderPlayer.userId !== userId &&
          Array.isArray(leaderPlayer.wildlifeSnapshots)
        ) {
          remoteWildlifeSnapshotsRef.current.length = 0;
          remoteWildlifeSnapshotsRef.current.push(
            ...leaderPlayer.wildlifeSnapshots
          );
        }

        const remoteWildlifeDamageEvents = data.players.flatMap((player) =>
          Array.isArray(player.wildlifeDamageEvents)
            ? player.wildlifeDamageEvents
            : []
        );

        if (
          remoteWildlifeDamageEvents.length > 0 &&
          pendingWildlifeDamageEventsRef?.current &&
          leaderUserId === userId
        ) {
          pendingWildlifeDamageEventsRef.current.push(
            ...remoteWildlifeDamageEvents
          );
        }

        syncingRemotePlayersFromPoll(remotePlayers);

        updatingRoomSnapshot({
          participantCount: data.participantCount,
          onlineParticipants: [
            {
              userId,
              displayName: displayNameRef.current,
            },
            ...remotePlayers.map((remotePlayer) => ({
              userId: remotePlayer.userId,
              displayName: remotePlayer.displayName,
            })),
          ],
        });
      } catch {
        // Poll failures are non-fatal; the next sync/poll will retry.
      }
    };

    void postingPlazaSync().then((didJoin) => {
      if (didJoin) {
        void pollingRemotePlayers();
      }
    });

    postingPlazaSyncRef.current = postingPlazaSync;

    const syncIntervalId = window.setInterval(() => {
      void postingPlazaSync();
    }, PLAZA_DEVVIT_ONLINE_SYNC_INTERVAL_MS);

    const pollIntervalId = window.setInterval(() => {
      void pollingRemotePlayers();
    }, PLAZA_DEVVIT_ONLINE_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      postingPlazaSyncRef.current = null;
      window.clearInterval(syncIntervalId);
      window.clearInterval(pollIntervalId);
      resettingPlazaRoomConnectionState();
    };
  }, [
    buildingSyncPayload,
    enabled,
    roomIndex,
    onRemoteProjectileSpawnEvents,
    pendingProjectileSpawnEventsRef,
    resettingPlazaRoomConnectionState,
    syncingRemotePlayersFromPoll,
    updatingRoomSnapshot,
    userId,
  ]);

  useEffect(() => {
    if (!enabled || !userId) {
      syncingMovePositionRef.current = null;
      return;
    }

    const sendingCurrentMovePosition = (): void => {
      void postingPlazaSyncRef.current?.();
    };

    syncingMovePositionRef.current = sendingCurrentMovePosition;

    return () => {
      syncingMovePositionRef.current = null;
    };
  }, [enabled, userId]);

  return {
    roomSnapshot,
    remotePlayerRegistryRef,
    syncingMovePositionRef,
  };
}

export { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS };
