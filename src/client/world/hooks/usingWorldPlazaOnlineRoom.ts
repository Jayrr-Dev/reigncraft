"use client";

import {
  applyingWorldPlazaRemotePlayerLiveUpdate,
  countingWorldPlazaOnlineRoomPresenceParticipantsFromChannel,
} from "@/components/world/domains/applyingWorldPlazaRemotePlayerLiveUpdate";
import { buildingWorldPlazaOnlineRoomChannelName } from "@/components/world/domains/buildingWorldPlazaOnlineRoomChannelName";
import { buildingWorldPlazaOnlineRoomPresencePayload } from "@/components/world/domains/buildingWorldPlazaOnlineRoomPresencePayload";
import { checkingWorldPlazaOnlineRoomShardIsFull } from "@/components/world/domains/checkingWorldPlazaOnlineRoomShardIsFull";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BROADCAST_EVENT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_FIRST_SHARD_INDEX,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_PLAYERS,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_SHARD_COUNT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_HEARTBEAT_MS,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_ROSTER_POLL_MS,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_SHARD_CAPACITY_SETTLE_MS,
  type DefiningWorldPlazaOnlineRoomSnapshot,
  type DefiningWorldPlazaRemotePlayer,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_BROADCAST_EVENT,
  type DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomPresenceBroadcast";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_EVENT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_INTERVAL_MS,
  type DefiningWorldPlazaOnlineRoomPositionBroadcastPayload,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomPositionBroadcast";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { handlingWorldPlazaOnlineRoomPositionBroadcastEvent } from "@/components/world/domains/handlingWorldPlazaOnlineRoomPositionBroadcastEvent";
import { handlingWorldPlazaOnlineRoomPresenceBroadcastEvent } from "@/components/world/domains/handlingWorldPlazaOnlineRoomPresenceBroadcastEvent";
import { handlingWorldPlazaRoomChatBroadcastEvent } from "@/components/world/domains/handlingWorldPlazaRoomChatBroadcastEvent";
import { countingWorldPlazaPresenceParticipants } from "@/components/world/domains/listingWorldPlazaRemotePlayersFromPresenceState";
import { listingWorldPlazaRemotePlayersFromPresenceEntries } from "@/components/world/domains/listingWorldPlazaRemotePlayersFromPresenceEntries";
import { seedingWorldPlazaRemotePlayersFromPresenceChannel } from "@/components/world/domains/seedingWorldPlazaRemotePlayersFromPresenceChannel";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";
import type { RealtimeChannel } from "@/lib/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

/** Supabase prefixes Realtime channel topics with `realtime:`. */
const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHANNEL_TOPIC_PREFIX =
  "realtime:" as const;

/** Shown when every shard is at the player cap. */
const DEFINING_WORLD_PLAZA_ONLINE_ROOM_ALL_SHARDS_FULL_MESSAGE =
  "All plaza rooms are full. Try again soon." as const;

/** Shown when a preferred room shard from `?room=` is at capacity. */
const DEFINING_WORLD_PLAZA_ONLINE_ROOM_PREFERRED_SHARD_FULL_MESSAGE =
  "This room is full. Try another room number in the URL." as const;

export interface UsingWorldPlazaOnlineRoomParams {
  /** Auth user id; when null the hook stays idle. */
  userId: string | null;
  /** Display name broadcast to other players. */
  displayName: string;
  /** Live local avatar position in world space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** When false, disconnects from the room channel. */
  enabled: boolean;
  /** When set, joins this shard first (`?room=1`). Skips auto-scan when full. */
  preferredRoomIndex?: number | null;
}

export interface UsingWorldPlazaOnlineRoomResult {
  roomSnapshot: DefiningWorldPlazaOnlineRoomSnapshot;
  /** Active Realtime channel after join; used by room chat broadcast. */
  roomChannelRef: React.RefObject<RealtimeChannel | null>;
  /** Live remote positions from Realtime broadcast (read every Pixi frame). */
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
}

/**
 * Auto-assigns an open plaza Realtime shard (max 20 players each) and syncs avatar position.
 */
export function usingWorldPlazaOnlineRoom({
  userId,
  displayName,
  playerPositionRef,
  enabled,
  preferredRoomIndex = null,
}: UsingWorldPlazaOnlineRoomParams): UsingWorldPlazaOnlineRoomResult {
  const queryClient = useQueryClient();
  const remotePlayerRegistryRef = useRef<Map<string, DefiningWorldPlazaRemotePlayer>>(
    new Map(),
  );

  const {
    data: roomSnapshot = DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
  } = useQuery({
    queryKey: DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
    queryFn: async (): Promise<DefiningWorldPlazaOnlineRoomSnapshot> => {
      return (
        queryClient.getQueryData<DefiningWorldPlazaOnlineRoomSnapshot>(
          DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
        ) ?? DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT
      );
    },
    initialData: DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const isTrackingPresenceRef = useRef(false);
  const displayNameRef = useRef(displayName);
  const userIdRef = useRef(userId);
  const preferredRoomIndexRef = useRef(preferredRoomIndex);
  const lastSyncedPositionRef = useRef({ x: Number.NaN, y: Number.NaN });
  const lastPresenceHeartbeatAtMsRef = useRef(0);
  const lastPositionBroadcastAtMsRef = useRef(0);
  const currentRoomIndexRef = useRef(
    DEFINING_WORLD_PLAZA_ONLINE_ROOM_FIRST_SHARD_INDEX,
  );
  const shardConnectionIdRef = useRef(0);

  displayNameRef.current = displayName;
  userIdRef.current = userId;
  preferredRoomIndexRef.current = preferredRoomIndex;

  const applyRoomSnapshotUpdate = useCallback(
    (
      updater: (
        snapshot: DefiningWorldPlazaOnlineRoomSnapshot,
      ) => DefiningWorldPlazaOnlineRoomSnapshot,
    ): void => {
      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
        (currentSnapshot) =>
          updater(currentSnapshot ?? DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT),
      );
    },
    [queryClient],
  );

  const updatingRoomSnapshot = useCallback(
    (patch: Partial<DefiningWorldPlazaOnlineRoomSnapshot>): void => {
      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
        (currentSnapshot) => ({
          ...(currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT),
          ...patch,
        }),
      );
    },
    [queryClient],
  );

  const updatingParticipantCountFromChannel = useCallback(
    (channel: RealtimeChannel): void => {
      updatingRoomSnapshot({
        participantCount:
          countingWorldPlazaOnlineRoomPresenceParticipantsFromChannel(channel),
      });
    },
    [updatingRoomSnapshot],
  );

  const clearingRemotePlayerRegistry = useCallback((): void => {
    remotePlayerRegistryRef.current.clear();
  }, []);

  const handlingPositionBroadcastRef = useRef((payload: unknown): void => {
    const localUserId = userIdRef.current;

    if (!localUserId) {
      return;
    }

    handlingWorldPlazaOnlineRoomPositionBroadcastEvent(
      queryClient,
      remotePlayerRegistryRef,
      payload,
      localUserId,
    );
  });
  handlingPositionBroadcastRef.current = (payload: unknown): void => {
    const localUserId = userIdRef.current;

    if (!localUserId) {
      return;
    }

    handlingWorldPlazaOnlineRoomPositionBroadcastEvent(
      queryClient,
      remotePlayerRegistryRef,
      payload,
      localUserId,
    );
  };

  const handlingPresenceBroadcastRef = useRef((payload: unknown): void => {
    const localUserId = userIdRef.current;

    if (!localUserId) {
      return;
    }

    handlingWorldPlazaOnlineRoomPresenceBroadcastEvent(
      queryClient,
      remotePlayerRegistryRef,
      payload,
      localUserId,
    );
  });
  handlingPresenceBroadcastRef.current = (payload: unknown): void => {
    const localUserId = userIdRef.current;

    if (!localUserId) {
      return;
    }

    handlingWorldPlazaOnlineRoomPresenceBroadcastEvent(
      queryClient,
      remotePlayerRegistryRef,
      payload,
      localUserId,
    );
  };

  const handlingChatBroadcastRef = useRef((payload: unknown): void => {
    handlingWorldPlazaRoomChatBroadcastEvent(queryClient, payload);
  });
  handlingChatBroadcastRef.current = (payload: unknown): void => {
    handlingWorldPlazaRoomChatBroadcastEvent(queryClient, payload);
  };

  const handlingPresenceJoinRef = useRef(
    (channel: RealtimeChannel, newPresences: unknown[]): void => {
      const localUserId = userIdRef.current;

      if (!localUserId) {
        return;
      }

      for (const remotePlayer of listingWorldPlazaRemotePlayersFromPresenceEntries(
        newPresences,
      )) {
        applyingWorldPlazaRemotePlayerLiveUpdate(
          remotePlayerRegistryRef,
          applyRoomSnapshotUpdate,
          remotePlayer,
          localUserId,
        );
      }

      updatingParticipantCountFromChannel(channel);
    },
  );
  handlingPresenceJoinRef.current = (
    channel: RealtimeChannel,
    newPresences: unknown[],
  ): void => {
    const localUserId = userIdRef.current;

    if (!localUserId) {
      return;
    }

    for (const remotePlayer of listingWorldPlazaRemotePlayersFromPresenceEntries(
      newPresences,
    )) {
      applyingWorldPlazaRemotePlayerLiveUpdate(
        remotePlayerRegistryRef,
        applyRoomSnapshotUpdate,
        remotePlayer,
        localUserId,
      );
    }

    updatingParticipantCountFromChannel(channel);
  };

  const handlingPresenceLeaveRef = useRef((channel: RealtimeChannel): void => {
    updatingParticipantCountFromChannel(channel);
  });
  handlingPresenceLeaveRef.current = (channel: RealtimeChannel): void => {
    updatingParticipantCountFromChannel(channel);
  };

  const handlingPresenceSyncRef = useRef((channel: RealtimeChannel): void => {
    const localUserId = userIdRef.current;

    if (!localUserId) {
      return;
    }

    seedingWorldPlazaRemotePlayersFromPresenceChannel(
      channel,
      remotePlayerRegistryRef,
      applyRoomSnapshotUpdate,
      localUserId,
    );
    updatingParticipantCountFromChannel(channel);
  });
  handlingPresenceSyncRef.current = (channel: RealtimeChannel): void => {
    const localUserId = userIdRef.current;

    if (!localUserId) {
      return;
    }

    seedingWorldPlazaRemotePlayersFromPresenceChannel(
      channel,
      remotePlayerRegistryRef,
      applyRoomSnapshotUpdate,
      localUserId,
    );
    updatingParticipantCountFromChannel(channel);
  };

  const buildingLocalPresenceBroadcastPayload = useCallback(
    (
      kind: DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload["kind"],
      gridPoint: DefiningWorldPlazaWorldPoint,
    ): DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload => {
      const localUserId = userIdRef.current ?? "";

      return {
        kind,
        user_id: localUserId,
        display_name: displayNameRef.current,
        x: gridPoint.x,
        y: gridPoint.y,
        updated_at: new Date().toISOString(),
      };
    },
    [],
  );

  const broadcastingLocalPresenceEvent = useCallback(
    async (
      channel: RealtimeChannel,
      kind: DefiningWorldPlazaOnlineRoomPresenceBroadcastPayload["kind"],
      gridPoint: DefiningWorldPlazaWorldPoint,
    ): Promise<void> => {
      try {
        await channel.send({
          type: "broadcast",
          event: DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_BROADCAST_EVENT,
          payload: buildingLocalPresenceBroadcastPayload(kind, gridPoint),
        });
      } catch {
        // Presence track/untrack still runs when broadcast fails.
      }
    },
    [buildingLocalPresenceBroadcastPayload],
  );

  const broadcastingLocalPosition = useCallback(
    (channel: RealtimeChannel, gridPoint: DefiningWorldPlazaWorldPoint): void => {
      const localUserId = userIdRef.current;

      if (!localUserId) {
        return;
      }

      const payload: DefiningWorldPlazaOnlineRoomPositionBroadcastPayload = {
        user_id: localUserId,
        display_name: displayNameRef.current,
        x: gridPoint.x,
        y: gridPoint.y,
        updated_at: new Date().toISOString(),
      };

      void channel.send({
        type: "broadcast",
        event: DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_EVENT,
        payload,
      });
    },
    [],
  );

  const broadcastingLocalPositionTick = useCallback((): void => {
    const channel = channelRef.current;
    const playerPosition = playerPositionRef.current;

    if (!channel || !playerPosition || !isTrackingPresenceRef.current) {
      return;
    }

    const hasMoved =
      playerPosition.x !== lastSyncedPositionRef.current.x ||
      playerPosition.y !== lastSyncedPositionRef.current.y;

    if (!hasMoved) {
      return;
    }

    const nowMs = Date.now();

    if (
      nowMs - lastPositionBroadcastAtMsRef.current <
      DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_INTERVAL_MS
    ) {
      return;
    }

    lastPositionBroadcastAtMsRef.current = nowMs;
    lastSyncedPositionRef.current = {
      x: playerPosition.x,
      y: playerPosition.y,
    };
    broadcastingLocalPosition(channel, playerPosition);
  }, [broadcastingLocalPosition, playerPositionRef]);

  const broadcastingLocalPresenceHeartbeat = useCallback(async (): Promise<void> => {
    const channel = channelRef.current;
    const localUserId = userIdRef.current;
    const playerPosition = playerPositionRef.current;

    if (
      !channel ||
      !localUserId ||
      !playerPosition ||
      !isTrackingPresenceRef.current
    ) {
      return;
    }

    lastPresenceHeartbeatAtMsRef.current = Date.now();

    try {
      await channel.track(
        buildingWorldPlazaOnlineRoomPresencePayload(
          localUserId,
          displayNameRef.current,
          playerPosition,
        ),
      );
      updatingParticipantCountFromChannel(channel);
    } catch (error) {
      updatingRoomSnapshot({
        lastError:
          error instanceof Error ? error.message : "Presence sync failed.",
      });
    }
  }, [playerPositionRef, updatingParticipantCountFromChannel, updatingRoomSnapshot]);

  const broadcastingLocalPresenceEventRef = useRef(broadcastingLocalPresenceEvent);
  broadcastingLocalPresenceEventRef.current = broadcastingLocalPresenceEvent;

  const broadcastingLocalPositionRef = useRef(broadcastingLocalPosition);
  broadcastingLocalPositionRef.current = broadcastingLocalPosition;

  useEffect(() => {
    if (!enabled || !hasEnvVars || !userId) {
      clearingRemotePlayerRegistry();
      updatingRoomSnapshot(DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT);
      queryClient.setQueryData(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
      );
      return;
    }

    let cancelled = false;
    const supabase = createClient();
    const startingRoomIndex =
      preferredRoomIndexRef.current ??
      DEFINING_WORLD_PLAZA_ONLINE_ROOM_FIRST_SHARD_INDEX;
    const isPreferredRoomLocked = preferredRoomIndexRef.current !== null;

    currentRoomIndexRef.current = startingRoomIndex;

    const markingAllShardsFull = (): void => {
      isTrackingPresenceRef.current = false;
      updatingRoomSnapshot({
        isJoined: false,
        isRoomFull: true,
        lastError: DEFINING_WORLD_PLAZA_ONLINE_ROOM_ALL_SHARDS_FULL_MESSAGE,
      });
    };

    const markingPreferredShardFull = (roomIndex: number): void => {
      isTrackingPresenceRef.current = false;
      updatingRoomSnapshot({
        roomId: String(roomIndex),
        roomDisplayName: `Room ${roomIndex}`,
        isJoined: false,
        isRoomFull: true,
        lastError: DEFINING_WORLD_PLAZA_ONLINE_ROOM_PREFERRED_SHARD_FULL_MESSAGE,
      });
    };

    const removingActiveChannel = async (
      shouldBroadcastLeave: boolean,
    ): Promise<void> => {
      const channel = channelRef.current;
      const localUserId = userIdRef.current;
      const playerPosition = playerPositionRef.current;
      channelRef.current = null;
      isTrackingPresenceRef.current = false;

      if (!channel) {
        return;
      }

      if (shouldBroadcastLeave && localUserId && playerPosition) {
        await broadcastingLocalPresenceEventRef.current(
          channel,
          "leave",
          playerPosition,
        );
      }

      await channel.untrack();
      await supabase.removeChannel(channel);
    };

    const connectingToWorldPlazaOnlineRoomShard = async (
      roomIndex: number,
    ): Promise<void> => {
      if (cancelled) {
        return;
      }

      if (roomIndex > DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_SHARD_COUNT) {
        markingAllShardsFull();
        return;
      }

      const connectionId = shardConnectionIdRef.current + 1;
      shardConnectionIdRef.current = connectionId;

      await removingActiveChannel(false);

      if (cancelled || connectionId !== shardConnectionIdRef.current) {
        return;
      }

      clearingRemotePlayerRegistry();

      const roomChannelName =
        buildingWorldPlazaOnlineRoomChannelName(roomIndex);
      const channelTopic = `${DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHANNEL_TOPIC_PREFIX}${roomChannelName}`;

      for (const existingChannel of supabase.getChannels()) {
        if (existingChannel.topic === channelTopic) {
          await supabase.removeChannel(existingChannel);
        }
      }

      if (cancelled || connectionId !== shardConnectionIdRef.current) {
        return;
      }

      currentRoomIndexRef.current = roomIndex;
      updatingRoomSnapshot({
        roomId: String(roomIndex),
        roomDisplayName: `Room ${roomIndex}`,
        maxPlayers: DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_PLAYERS,
        createdBy: null,
        roomChannelName,
        remotePlayers: [],
        participantCount: 0,
        isJoined: false,
        isRoomFull: false,
        lastError: null,
      });
      queryClient.setQueryData(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        (currentSnapshot) => ({
          ...(currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT),
          bubbles: [],
          lastSendError: null,
        }),
      );

      const channel = supabase.channel(roomChannelName, {
        config: {
          broadcast: {
            ack: false,
            self: false,
          },
          presence: {
            key: userId,
          },
        },
      });

      channelRef.current = channel;

      channel
        .on(
          "broadcast",
          { event: DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BROADCAST_EVENT },
          (event: { payload: unknown }) => {
            handlingChatBroadcastRef.current(event.payload);
          },
        )
        .on(
          "broadcast",
          { event: DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_EVENT },
          (event: { payload: unknown }) => {
            handlingPositionBroadcastRef.current(event.payload);
          },
        )
        .on(
          "broadcast",
          { event: DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_BROADCAST_EVENT },
          (event: { payload: unknown }) => {
            handlingPresenceBroadcastRef.current(event.payload);
          },
        )
        .on("presence", { event: "sync" }, () => {
          handlingPresenceSyncRef.current(channel);
        })
        .on(
          "presence",
          { event: "join" },
          (payload: { newPresences: unknown[] }) => {
            handlingPresenceJoinRef.current(channel, payload.newPresences);
          },
        )
        .on("presence", { event: "leave" }, () => {
          handlingPresenceLeaveRef.current(channel);
        })
        .subscribe(async (status: string) => {
          if (cancelled || connectionId !== shardConnectionIdRef.current) {
            return;
          }

          const isConnected = status === "SUBSCRIBED";
          updatingRoomSnapshot({ isConnected });

          if (!isConnected) {
            return;
          }

          await new Promise<void>((resolve) => {
            window.setTimeout(
              resolve,
              DEFINING_WORLD_PLAZA_ONLINE_ROOM_SHARD_CAPACITY_SETTLE_MS,
            );
          });

          if (cancelled || connectionId !== shardConnectionIdRef.current) {
            return;
          }

          const playerPosition = playerPositionRef.current;

          if (!playerPosition) {
            return;
          }

          const presenceState = channel.presenceState() as Record<
            string,
            unknown[]
          >;
          const participantCount =
            countingWorldPlazaPresenceParticipants(presenceState);
          const isLocalUserAlreadyPresent =
            Object.prototype.hasOwnProperty.call(presenceState, userId);

          if (
            checkingWorldPlazaOnlineRoomShardIsFull(
              participantCount,
              DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_PLAYERS,
              isLocalUserAlreadyPresent,
            )
          ) {
            channelRef.current = null;
            await supabase.removeChannel(channel);

            if (isPreferredRoomLocked) {
              markingPreferredShardFull(roomIndex);
              return;
            }

            await connectingToWorldPlazaOnlineRoomShard(roomIndex + 1);
            return;
          }

          try {
            await channel.track(
              buildingWorldPlazaOnlineRoomPresencePayload(
                userId,
                displayNameRef.current,
                playerPosition,
              ),
            );

            if (cancelled || connectionId !== shardConnectionIdRef.current) {
              channelRef.current = null;
              await channel.untrack();
              await supabase.removeChannel(channel);
              return;
            }

            isTrackingPresenceRef.current = true;
            lastSyncedPositionRef.current = {
              x: playerPosition.x,
              y: playerPosition.y,
            };
            lastPresenceHeartbeatAtMsRef.current = Date.now();
            lastPositionBroadcastAtMsRef.current = Date.now();

            await broadcastingLocalPresenceEventRef.current(
              channel,
              "join",
              playerPosition,
            );
            broadcastingLocalPositionRef.current(channel, playerPosition);

            seedingWorldPlazaRemotePlayersFromPresenceChannel(
              channel,
              remotePlayerRegistryRef,
              applyRoomSnapshotUpdate,
              userId,
            );

            updatingRoomSnapshot({
              isJoined: true,
              isRoomFull: false,
              lastError: null,
              participantCount:
                countingWorldPlazaOnlineRoomPresenceParticipantsFromChannel(
                  channel,
                ),
            });
          } catch (error) {
            isTrackingPresenceRef.current = false;
            updatingRoomSnapshot({
              isJoined: false,
              lastError:
                error instanceof Error
                  ? error.message
                  : "Could not join the plaza.",
            });
          }
        });

      if (cancelled || connectionId !== shardConnectionIdRef.current) {
        channelRef.current = null;
        await supabase.removeChannel(channel);
      }
    };

    void connectingToWorldPlazaOnlineRoomShard(startingRoomIndex);

    return () => {
      cancelled = true;
      shardConnectionIdRef.current += 1;
      isTrackingPresenceRef.current = false;
      lastSyncedPositionRef.current = { x: Number.NaN, y: Number.NaN };
      lastPresenceHeartbeatAtMsRef.current = 0;
      lastPositionBroadcastAtMsRef.current = 0;
      currentRoomIndexRef.current =
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_FIRST_SHARD_INDEX;

      void (async () => {
        await removingActiveChannel(true);
        clearingRemotePlayerRegistry();
        updatingRoomSnapshot(DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT);
        queryClient.setQueryData(
          DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
          DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
        );
      })();
    };
  }, [
    applyRoomSnapshotUpdate,
    clearingRemotePlayerRegistry,
    enabled,
    playerPositionRef,
    preferredRoomIndex,
    queryClient,
    updatingRoomSnapshot,
    userId,
  ]);

  useEffect(() => {
    if (!enabled || !userId || !hasEnvVars) {
      return;
    }

    const positionIntervalId = window.setInterval(() => {
      broadcastingLocalPositionTick();
    }, DEFINING_WORLD_PLAZA_ONLINE_ROOM_POSITION_BROADCAST_INTERVAL_MS);

    const presenceIntervalId = window.setInterval(() => {
      void broadcastingLocalPresenceHeartbeat();
    }, DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_HEARTBEAT_MS);

    return () => {
      window.clearInterval(positionIntervalId);
      window.clearInterval(presenceIntervalId);
    };
  }, [broadcastingLocalPositionTick, broadcastingLocalPresenceHeartbeat, enabled, userId]);

  useEffect(() => {
    if (!enabled || !userId || !hasEnvVars) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const channel = channelRef.current;

      if (channel) {
        handlingPresenceSyncRef.current(channel);
      }
    }, DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_ROSTER_POLL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, userId]);

  return { roomSnapshot, roomChannelRef: channelRef, remotePlayerRegistryRef };
}
