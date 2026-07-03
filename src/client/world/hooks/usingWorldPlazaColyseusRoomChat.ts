"use client";

import { appendingWorldPlazaRoomChatMessage } from "@/components/world/domains/appendingWorldPlazaRoomChatMessage";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_SEND_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_TYPING_SEND_THROTTLE_MS,
  type DefiningWorldPlazaOnlineRoomChatSnapshot,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import {
  removingWorldPlazaRoomTypingUser,
  upsertingWorldPlazaRoomTypingUser,
} from "@/components/world/domains/upsertingWorldPlazaRoomTypingUser";
import { trimmingWorldPlazaRoomChatMessage } from "@/components/world/domains/trimmingWorldPlazaRoomChatMessage";
import { encodingWorldPlazaRoomChatGifMessage } from "@/components/world/domains/encodingWorldPlazaRoomChatGifMessage";
import {
  DEFINING_WORLD_PLAZA_COLYSEUS_CHAT_BROADCAST,
  DEFINING_WORLD_PLAZA_COLYSEUS_CHAT_MESSAGE,
  DEFINING_WORLD_PLAZA_COLYSEUS_TYPING_BROADCAST,
  DEFINING_WORLD_PLAZA_COLYSEUS_TYPING_MESSAGE,
  type DefiningWorldPlazaColyseusChatBroadcastPayload,
  type DefiningWorldPlazaColyseusTypingBroadcastPayload,
} from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";
import { usingWorldPlazaColyseusRoomMessageContext } from "@/components/world/colyseus/domains/creatingWorldPlazaColyseusRoomContext";
import type { DefiningWorldPlazaColyseusRoomState } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import type { Room } from "@colyseus/sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

/** Shown when the client sends chat too quickly. */
const USING_WORLD_PLAZA_COLYSEUS_CHAT_RATE_LIMIT_MESSAGE =
  "Wait a moment before sending another message." as const;

/** Shown when chat is sent before the Colyseus room is ready. */
const USING_WORLD_PLAZA_COLYSEUS_CHAT_NOT_CONNECTED_MESSAGE =
  "Chat is not ready yet." as const;

export interface UsingWorldPlazaColyseusRoomChatParams {
  /** Auth user id; chat stays idle when null. */
  userId: string | null;
  /** Label included in outgoing chat payloads. */
  displayName: string;
  /** Live local avatar position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Shared Colyseus room from {@link usingWorldPlazaColyseusRoom}. */
  colyseusRoom: Room<DefiningWorldPlazaColyseusRoomState> | undefined;
  /** True when the local client has joined a room shard. */
  isRoomJoined: boolean;
  /** When false, clears chat state and skips listeners. */
  enabled: boolean;
}

export interface UsingWorldPlazaColyseusRoomChatResult {
  chatSnapshot: DefiningWorldPlazaOnlineRoomChatSnapshot;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setDraftMessage: (draftMessage: string) => void;
  sendChatMessage: () => Promise<void>;
  sendChatGifMessage: (gifId: string) => Promise<void>;
}

/**
 * Ephemeral plaza room chat over the shared Colyseus room connection.
 *
 * Must render inside {@link ProvidingWorldPlazaColyseusRoom}.
 */
export function usingWorldPlazaColyseusRoomChat({
  userId,
  displayName,
  playerPositionRef,
  colyseusRoom,
  isRoomJoined,
  enabled,
}: UsingWorldPlazaColyseusRoomChatParams): UsingWorldPlazaColyseusRoomChatResult {
  const queryClient = useQueryClient();
  const lastSentAtMsRef = useRef(0);
  const lastTypingSentAtMsRef = useRef(0);
  const lastTypingStateRef = useRef(false);
  const displayNameRef = useRef(displayName);

  displayNameRef.current = displayName;

  const {
    data: chatSnapshot = DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
  } = useQuery({
    queryKey: DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
    queryFn: async (): Promise<DefiningWorldPlazaOnlineRoomChatSnapshot> => {
      return (
        queryClient.getQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
          DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        ) ?? DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT
      );
    },
    initialData: DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const updatingChatSnapshot = useCallback(
    (patch: Partial<DefiningWorldPlazaOnlineRoomChatSnapshot>): void => {
      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        (currentSnapshot) => ({
          ...(currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT),
          ...patch,
        }),
      );
    },
    [queryClient],
  );

  const sendTypingState = useCallback(
    (isTyping: boolean): void => {
      if (!colyseusRoom || !userId || !isRoomJoined) {
        return;
      }

      const nowMs = Date.now();

      if (isTyping) {
        const isThrottled =
          lastTypingStateRef.current &&
          nowMs - lastTypingSentAtMsRef.current <
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_TYPING_SEND_THROTTLE_MS;

        if (isThrottled) {
          return;
        }
      } else if (!lastTypingStateRef.current) {
        return;
      }

      lastTypingStateRef.current = isTyping;
      lastTypingSentAtMsRef.current = nowMs;
      colyseusRoom.send(DEFINING_WORLD_PLAZA_COLYSEUS_TYPING_MESSAGE, {
        isTyping,
      });
    },
    [colyseusRoom, isRoomJoined, userId],
  );

  const openChat = useCallback((): void => {
    updatingChatSnapshot({ isChatOpen: true, lastSendError: null });
  }, [updatingChatSnapshot]);

  const closeChat = useCallback((): void => {
    sendTypingState(false);
    updatingChatSnapshot({
      isChatOpen: false,
      draftMessage: "",
      lastSendError: null,
    });
  }, [sendTypingState, updatingChatSnapshot]);

  const toggleChat = useCallback((): void => {
    queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
      DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
      (currentSnapshot) => {
        const snapshot =
          currentSnapshot ??
          DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT;

        if (snapshot.isChatOpen) {
          sendTypingState(false);

          return {
            ...snapshot,
            isChatOpen: false,
            draftMessage: "",
            lastSendError: null,
          };
        }

        return {
          ...snapshot,
          isChatOpen: true,
          lastSendError: null,
        };
      },
    );
  }, [queryClient, sendTypingState]);

  const setDraftMessage = useCallback(
    (draftMessage: string): void => {
      sendTypingState(draftMessage.trim().length > 0);
      updatingChatSnapshot({ draftMessage, lastSendError: null });
    },
    [sendTypingState, updatingChatSnapshot],
  );

  const broadcastingChatMessage = useCallback(
    (message: string): void => {
      const localUserId = userId;

      if (!localUserId || !enabled || !isRoomJoined || !colyseusRoom) {
        updatingChatSnapshot({
          lastSendError: USING_WORLD_PLAZA_COLYSEUS_CHAT_NOT_CONNECTED_MESSAGE,
        });
        return;
      }

      const trimmedMessage = trimmingWorldPlazaRoomChatMessage(message);

      if (!trimmedMessage) {
        updatingChatSnapshot({ draftMessage: "", lastSendError: null });
        return;
      }

      const nowMs = Date.now();

      if (
        nowMs - lastSentAtMsRef.current <
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_SEND_COOLDOWN_MS
      ) {
        updatingChatSnapshot({
          lastSendError: USING_WORLD_PLAZA_COLYSEUS_CHAT_RATE_LIMIT_MESSAGE,
        });
        return;
      }

      const sentAt = new Date(nowMs).toISOString();

      colyseusRoom.send(DEFINING_WORLD_PLAZA_COLYSEUS_CHAT_MESSAGE, {
        message: trimmedMessage,
      });
      sendTypingState(false);

      lastSentAtMsRef.current = nowMs;
      const senderPosition = playerPositionRef.current ?? { x: 0, y: 0 };
      updatingChatSnapshot({
        draftMessage: "",
        lastSendError: null,
        isChatOpen: false,
        bubbles: appendingWorldPlazaRoomChatMessage(
          chatSnapshot.bubbles,
          {
            user_id: localUserId,
            display_name: displayNameRef.current,
            message: trimmedMessage,
            sent_at: sentAt,
            grid_x: senderPosition.x,
            grid_y: senderPosition.y,
          },
          nowMs,
        ),
      });
    },
    [
      chatSnapshot.bubbles,
      colyseusRoom,
      enabled,
      isRoomJoined,
      playerPositionRef,
      sendTypingState,
      updatingChatSnapshot,
      userId,
    ],
  );

  const sendChatMessage = useCallback(async (): Promise<void> => {
    broadcastingChatMessage(chatSnapshot.draftMessage);
  }, [broadcastingChatMessage, chatSnapshot.draftMessage]);

  const sendChatGifMessage = useCallback(
    async (gifId: string): Promise<void> => {
      broadcastingChatMessage(encodingWorldPlazaRoomChatGifMessage(gifId));
    },
    [broadcastingChatMessage],
  );

  const handlingTypingBroadcast = useCallback(
    (payload: DefiningWorldPlazaColyseusTypingBroadcastPayload): void => {
      if (!payload?.userId) {
        return;
      }

      if (userId && payload.userId === userId) {
        return;
      }

      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        (currentSnapshot) => {
          const snapshot =
            currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT;

          if (!payload.isTyping) {
            return {
              ...snapshot,
              typingUsers: removingWorldPlazaRoomTypingUser(
                snapshot.typingUsers,
                payload.userId,
              ),
            };
          }

          return {
            ...snapshot,
            typingUsers: upsertingWorldPlazaRoomTypingUser({
              typingUsers: snapshot.typingUsers,
              userId: payload.userId,
              displayName: payload.displayName,
              anchorGridX: typeof payload.x === "number" ? payload.x : 0,
              anchorGridY: typeof payload.y === "number" ? payload.y : 0,
              nowMs: Date.now(),
            }),
          };
        },
      );
    },
    [queryClient, userId],
  );

  const handlingChatBroadcast = useCallback(
    (payload: DefiningWorldPlazaColyseusChatBroadcastPayload): void => {
      if (!payload?.userId || !payload.message) {
        return;
      }

      if (userId && payload.userId === userId) {
        return;
      }

      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        (currentSnapshot) => {
          const snapshot =
            currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT;

          return {
            ...snapshot,
            bubbles: appendingWorldPlazaRoomChatMessage(
              snapshot.bubbles,
              {
                user_id: payload.userId,
                display_name: payload.displayName,
                message: payload.message,
                sent_at: payload.sentAt,
                grid_x: typeof payload.x === "number" ? payload.x : 0,
                grid_y: typeof payload.y === "number" ? payload.y : 0,
              },
              Date.now(),
            ),
          };
        },
      );
    },
    [queryClient, userId],
  );

  usingWorldPlazaColyseusRoomMessageContext(
    DEFINING_WORLD_PLAZA_COLYSEUS_CHAT_BROADCAST,
    (payload: DefiningWorldPlazaColyseusChatBroadcastPayload) => {
      if (!enabled || !isRoomJoined) {
        return;
      }

      handlingChatBroadcast(payload);
    },
  );

  usingWorldPlazaColyseusRoomMessageContext(
    DEFINING_WORLD_PLAZA_COLYSEUS_TYPING_BROADCAST,
    (payload: DefiningWorldPlazaColyseusTypingBroadcastPayload) => {
      if (!enabled || !isRoomJoined) {
        return;
      }

      handlingTypingBroadcast(payload);
    },
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nowMs = Date.now();

      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        (currentSnapshot) => {
          const snapshot =
            currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT;
          const activeBubbles = snapshot.bubbles.filter(
            (bubble) => bubble.expiresAt > nowMs,
          );
          const activeTypingUsers = snapshot.typingUsers.filter(
            (typingUser) => typingUser.expiresAt > nowMs,
          );

          if (
            activeBubbles.length === snapshot.bubbles.length &&
            activeTypingUsers.length === snapshot.typingUsers.length
          ) {
            return snapshot;
          }

          return {
            ...snapshot,
            bubbles: activeBubbles,
            typingUsers: activeTypingUsers,
          };
        },
      );
    }, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, queryClient]);

  return {
    chatSnapshot,
    openChat,
    closeChat,
    toggleChat,
    setDraftMessage,
    sendChatMessage,
    sendChatGifMessage,
  };
}
