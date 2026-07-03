"use client";

import {
  DEFINING_WORLD_PLAZA_COLYSEUS_MOVE_MESSAGE,
  DEFINING_WORLD_PLAZA_COLYSEUS_MOVE_SEND_INTERVAL_MS,
  type DefiningWorldPlazaColyseusMovePayload,
} from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";
import {
  usingWorldPlazaColyseusRoomContext,
  usingWorldPlazaColyseusRoomStateContext,
} from "@/components/world/colyseus/domains/creatingWorldPlazaColyseusRoomContext";
import { JOINING_WORLD_PLAZA_COLYSEUS_MISCONFIGURED_URL_ERROR } from "@/components/world/colyseus/domains/joiningWorldPlazaColyseusRoom";
import { buildingWorldPlazaColyseusPlayerMotionFingerprint } from "@/components/world/colyseus/domains/buildingWorldPlazaColyseusPlayerMotionFingerprint";
import { buildingWorldPlazaColyseusPlayerRosterFingerprint } from "@/components/world/colyseus/domains/buildingWorldPlazaColyseusPlayerRosterFingerprint";
import { countingWorldPlazaColyseusParticipantsFromPlayers } from "@/components/world/colyseus/domains/countingWorldPlazaColyseusParticipantsFromPlayers";
import { listingWorldPlazaRemotePlayerFromColyseusPlayer } from "@/components/world/colyseus/domains/listingWorldPlazaRemotePlayerFromColyseusPlayer";
import { mountingWorldPlazaRemotePlayersFromColyseusPlayerMap } from "@/components/world/colyseus/domains/mountingWorldPlazaRemotePlayersFromColyseusPlayerMap";
import { syncingWorldPlazaOnlineRoomRosterFromColyseusRoom } from "@/components/world/colyseus/domains/listingWorldPlazaRemotePlayersFromColyseusPlayerMap";
import { syncingWorldPlazaRemotePlayerLiveMotionFromColyseusPlayerMap } from "@/components/world/colyseus/domains/syncingWorldPlazaRemotePlayerLiveMotionFromColyseusPlayerMap";
import type { DefiningWorldPlazaColyseusRoomState } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
  type DefiningWorldPlazaAvatarMotionState,
} from "@/components/world/domains/definingWorldPlazaAvatarMotionConstants";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY,
  type DefiningWorldPlazaOnlineRoomSnapshot,
  type DefiningWorldPlazaRemotePlayer,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  applyingWorldPlazaRemotePlayerLiveUpdate,
  removingWorldPlazaRemotePlayerLiveUpdate,
} from "@/components/world/domains/applyingWorldPlazaRemotePlayerLiveUpdate";
import { Callbacks, type Room } from "@colyseus/sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

/** Shown when a preferred room shard from `?room=` is at capacity. */
const USING_WORLD_PLAZA_COLYSEUS_PREFERRED_SHARD_FULL_MESSAGE =
  "This room is full. Try another room number in the URL." as const;

/** Shown when the Colyseus server cannot be reached or rejects the join. */
const USING_WORLD_PLAZA_COLYSEUS_CONNECTION_FAILED_MESSAGE =
  "Could not connect to the plaza server. Check your connection and try again." as const;

export interface UsingWorldPlazaColyseusRoomParams {
  /** Auth user id; when null the hook stays idle. */
  userId: string | null;
  /** When false, disconnects from the Colyseus room. */
  enabled: boolean;
  /** Live local avatar position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Live local avatar motion written each Pixi frame for network sync. */
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>;
  /** When set, joins this shard first (`?room=1`). */
  preferredRoomIndex?: number | null;
}

export interface UsingWorldPlazaColyseusRoomResult {
  roomSnapshot: DefiningWorldPlazaOnlineRoomSnapshot;
  /** Active Colyseus room after join; used by room chat. */
  colyseusRoom: Room<DefiningWorldPlazaColyseusRoomState> | undefined;
  /** Live remote positions read every Pixi frame. */
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  /** Sends the current avatar position immediately (e.g. on walk arrival). */
  syncingMovePositionRef: React.RefObject<(() => void) | null>;
}

/**
 * Subscribes to the shared `@colyseus/react` room connection and mirrors
 * roster metadata into TanStack Query while keeping live positions in a ref.
 *
 * Must render inside {@link ProvidingWorldPlazaColyseusRoom}.
 */
export function usingWorldPlazaColyseusRoom({
  userId,
  enabled,
  playerPositionRef,
  localAvatarMotionStateRef,
  preferredRoomIndex = null,
}: UsingWorldPlazaColyseusRoomParams): UsingWorldPlazaColyseusRoomResult {
  const queryClient = useQueryClient();
  const syncingMovePositionRef = useRef<(() => void) | null>(null);
  const { room, error, isConnecting } = usingWorldPlazaColyseusRoomContext();
  /** Primitives only: object selectors break useSyncExternalStore (React #185). */
  const colyseusRoomIndex = usingWorldPlazaColyseusRoomStateContext(
    (state) => state?.roomIndex,
  );
  const colyseusParticipantCount = usingWorldPlazaColyseusRoomStateContext(
    (state) => countingWorldPlazaColyseusParticipantsFromPlayers(state?.players),
  );
  const colyseusPlayerRosterFingerprint = usingWorldPlazaColyseusRoomStateContext(
    (state) => buildingWorldPlazaColyseusPlayerRosterFingerprint(state?.players),
  );
  const colyseusPlayerMotionFingerprint = usingWorldPlazaColyseusRoomStateContext(
    (state) => buildingWorldPlazaColyseusPlayerMotionFingerprint(state?.players),
  );

  const remotePlayerRegistryRef = useRef<Map<string, DefiningWorldPlazaRemotePlayer>>(
    new Map(),
  );
  const lastMoveSentAtMsRef = useRef(0);
  const lastMoveSentPositionRef = useRef({ x: Number.NaN, y: Number.NaN });
  const lastMoveSentMotionRef = useRef<DefiningWorldPlazaAvatarMotionState>({
    ...DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
  });

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

  const connectionErrorMessage = useMemo((): string | null => {
    if (!error) {
      return null;
    }

    if (error.message === JOINING_WORLD_PLAZA_COLYSEUS_MISCONFIGURED_URL_ERROR) {
      return error.message;
    }

    const isRoomFullError = error.message.toLowerCase().includes("full");

    if (isRoomFullError && preferredRoomIndex !== null) {
      return USING_WORLD_PLAZA_COLYSEUS_PREFERRED_SHARD_FULL_MESSAGE;
    }

    return USING_WORLD_PLAZA_COLYSEUS_CONNECTION_FAILED_MESSAGE;
  }, [error, preferredRoomIndex]);

  const registeringRemotePlayer = useCallback(
    (player: Parameters<typeof listingWorldPlazaRemotePlayerFromColyseusPlayer>[0]) => {
      if (!userId) {
        return;
      }

      applyingWorldPlazaRemotePlayerLiveUpdate(
        remotePlayerRegistryRef,
        applyRoomSnapshotUpdate,
        listingWorldPlazaRemotePlayerFromColyseusPlayer(player),
        userId,
      );
    },
    [applyRoomSnapshotUpdate, userId],
  );

  const resettingPlazaRoomConnectionState = useCallback((): void => {
    remotePlayerRegistryRef.current.clear();
    lastMoveSentAtMsRef.current = 0;
    lastMoveSentPositionRef.current = { x: Number.NaN, y: Number.NaN };
    lastMoveSentMotionRef.current = {
      ...DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
    };
    updatingRoomSnapshot(DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT);
  }, [updatingRoomSnapshot]);

  useEffect(() => {
    if (!enabled || !userId) {
      resettingPlazaRoomConnectionState();
      return;
    }

    if (isConnecting) {
      updatingRoomSnapshot({
        roomIndex: null,
        isConnected: false,
        isJoined: false,
        isReconnecting: false,
        isRoomFull: false,
        lastError: null,
      });
      return;
    }

    if (connectionErrorMessage) {
      updatingRoomSnapshot({
        roomIndex: preferredRoomIndex,
        isConnected: false,
        isJoined: false,
        isReconnecting: false,
        isRoomFull: connectionErrorMessage.includes("full"),
        lastError: connectionErrorMessage,
      });
      return;
    }

    if (!room) {
      return;
    }

    const localSessionId = room.sessionId;
    const callbacks = Callbacks.get(room);

    const attachingRemotePlayerListeners = (
      player: Parameters<typeof listingWorldPlazaRemotePlayerFromColyseusPlayer>[0],
      sessionId: string,
    ): void => {
      if (sessionId === localSessionId) {
        return;
      }

      registeringRemotePlayer(player);
      callbacks.onChange(player, () => {
        if (player.userId === userId) {
          return;
        }

        applyingWorldPlazaRemotePlayerLiveUpdate(
          remotePlayerRegistryRef,
          applyRoomSnapshotUpdate,
          listingWorldPlazaRemotePlayerFromColyseusPlayer(player),
          userId,
        );
      });
    };

    callbacks.onAdd("players", attachingRemotePlayerListeners);

    callbacks.onRemove("players", (player, sessionId) => {
      if (sessionId === localSessionId) {
        return;
      }

      removingWorldPlazaRemotePlayerLiveUpdate(
        remotePlayerRegistryRef,
        applyRoomSnapshotUpdate,
        player.userId,
        userId,
      );
    });

    syncingWorldPlazaOnlineRoomRosterFromColyseusRoom(
      room.state.players,
      localSessionId,
      userId,
      remotePlayerRegistryRef,
      applyRoomSnapshotUpdate,
    );

    mountingWorldPlazaRemotePlayersFromColyseusPlayerMap(
      room.state.players,
      localSessionId,
      userId,
      remotePlayerRegistryRef,
      applyRoomSnapshotUpdate,
    );

    for (const [sessionId, player] of room.state.players?.entries() ?? []) {
      if (sessionId === localSessionId) {
        continue;
      }

      callbacks.onChange(player, () => {
        if (player.userId === userId) {
          return;
        }

        applyingWorldPlazaRemotePlayerLiveUpdate(
          remotePlayerRegistryRef,
          applyRoomSnapshotUpdate,
          listingWorldPlazaRemotePlayerFromColyseusPlayer(player),
          userId,
        );
      });
    }

    updatingRoomSnapshot({
      roomIndex: room.state.roomIndex,
      roomChannelName: room.roomId,
      isConnected: true,
      isJoined: true,
      isReconnecting: false,
      isRoomFull: false,
      lastError: null,
    });

    const handlingConnectionDrop = (): void => {
      updatingRoomSnapshot({
        isJoined: false,
        isReconnecting: true,
        lastError: null,
      });
    };

    const handlingReconnect = (): void => {
      syncingWorldPlazaOnlineRoomRosterFromColyseusRoom(
        room.state.players,
        localSessionId,
        userId,
        remotePlayerRegistryRef,
        applyRoomSnapshotUpdate,
      );

      mountingWorldPlazaRemotePlayersFromColyseusPlayerMap(
        room.state.players,
        localSessionId,
        userId,
        remotePlayerRegistryRef,
        applyRoomSnapshotUpdate,
      );

      updatingRoomSnapshot({
        isConnected: true,
        isJoined: true,
        isReconnecting: false,
        lastError: null,
      });
    };

    room.onDrop(handlingConnectionDrop);
    room.onReconnect(handlingReconnect);

    return () => {
      room.onDrop(() => {});
      room.onReconnect(() => {});
    };
  }, [
    applyRoomSnapshotUpdate,
    connectionErrorMessage,
    enabled,
    isConnecting,
    preferredRoomIndex,
    registeringRemotePlayer,
    resettingPlazaRoomConnectionState,
    room,
    updatingRoomSnapshot,
    userId,
  ]);

  useEffect(() => {
    if (colyseusRoomIndex === undefined) {
      return;
    }

    updatingRoomSnapshot({
      roomIndex: colyseusRoomIndex,
    });
  }, [colyseusRoomIndex, updatingRoomSnapshot]);

  useEffect(() => {
    if (!enabled || !userId || !room || isConnecting || connectionErrorMessage) {
      return;
    }

    syncingWorldPlazaOnlineRoomRosterFromColyseusRoom(
      room.state.players,
      room.sessionId,
      userId,
      remotePlayerRegistryRef,
      applyRoomSnapshotUpdate,
    );

    mountingWorldPlazaRemotePlayersFromColyseusPlayerMap(
      room.state.players,
      room.sessionId,
      userId,
      remotePlayerRegistryRef,
      applyRoomSnapshotUpdate,
    );
  }, [
    applyRoomSnapshotUpdate,
    colyseusParticipantCount,
    colyseusPlayerRosterFingerprint,
    connectionErrorMessage,
    enabled,
    isConnecting,
    room,
    userId,
  ]);

  useEffect(() => {
    if (!enabled || !userId || !room || isConnecting || connectionErrorMessage) {
      return;
    }

    syncingWorldPlazaRemotePlayerLiveMotionFromColyseusPlayerMap(
      room.state.players,
      room.sessionId,
      userId,
      remotePlayerRegistryRef.current,
    );

    mountingWorldPlazaRemotePlayersFromColyseusPlayerMap(
      room.state.players,
      room.sessionId,
      userId,
      remotePlayerRegistryRef,
      applyRoomSnapshotUpdate,
    );
  }, [
    applyRoomSnapshotUpdate,
    colyseusPlayerMotionFingerprint,
    connectionErrorMessage,
    enabled,
    isConnecting,
    room,
    userId,
  ]);

  useEffect(() => {
    if (!enabled || !userId || !room) {
      syncingMovePositionRef.current = null;
      return;
    }

    const sendingCurrentMovePosition = (): void => {
      const playerPosition = playerPositionRef.current;
      const motionState =
        localAvatarMotionStateRef.current ??
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE;

      if (!playerPosition) {
        return;
      }

      lastMoveSentAtMsRef.current = Date.now();
      lastMoveSentPositionRef.current = {
        x: playerPosition.x,
        y: playerPosition.y,
      };
      lastMoveSentMotionRef.current = { ...motionState };

      const payload: DefiningWorldPlazaColyseusMovePayload = {
        x: playerPosition.x,
        y: playerPosition.y,
        motionKind: motionState.motionKind,
        facingDirection: motionState.facingDirection,
        jumpStartedAtMs: motionState.jumpStartedAtMs,
        jumpArcPeakScreenPx: motionState.jumpArcPeakScreenPx,
        layer: motionState.layer,
      };

      room.send(DEFINING_WORLD_PLAZA_COLYSEUS_MOVE_MESSAGE, payload);
    };

    syncingMovePositionRef.current = sendingCurrentMovePosition;
    sendingCurrentMovePosition();

    const intervalId = window.setInterval(() => {
      const playerPosition = playerPositionRef.current;
      const motionState =
        localAvatarMotionStateRef.current ??
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE;

      if (!playerPosition) {
        return;
      }

      const hasMoved =
        playerPosition.x !== lastMoveSentPositionRef.current.x ||
        playerPosition.y !== lastMoveSentPositionRef.current.y;
      const hasMotionChanged =
        motionState.motionKind !== lastMoveSentMotionRef.current.motionKind ||
        motionState.facingDirection !==
          lastMoveSentMotionRef.current.facingDirection ||
        motionState.jumpStartedAtMs !==
          lastMoveSentMotionRef.current.jumpStartedAtMs ||
        motionState.jumpArcPeakScreenPx !==
          lastMoveSentMotionRef.current.jumpArcPeakScreenPx ||
        motionState.layer !== lastMoveSentMotionRef.current.layer;

      if (!hasMoved && !hasMotionChanged) {
        return;
      }

      const nowMs = Date.now();

      if (
        nowMs - lastMoveSentAtMsRef.current <
        DEFINING_WORLD_PLAZA_COLYSEUS_MOVE_SEND_INTERVAL_MS
      ) {
        return;
      }

      sendingCurrentMovePosition();
    }, DEFINING_WORLD_PLAZA_COLYSEUS_MOVE_SEND_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      syncingMovePositionRef.current = null;
    };
  }, [enabled, localAvatarMotionStateRef, playerPositionRef, room, userId]);

  return {
    roomSnapshot,
    colyseusRoom: room,
    remotePlayerRegistryRef,
    syncingMovePositionRef,
  };
}
