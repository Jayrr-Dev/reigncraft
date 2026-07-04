"use client";

import { appendingWorldPlazaRoomChatMessage } from "@/components/world/domains/appendingWorldPlazaRoomChatMessage";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_SEND_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_TYPING_SEND_THROTTLE_MS,
  type DefiningWorldPlazaOnlineRoomChatSnapshot,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import type { UsingWorldPlazaOnlineRoomChatResult } from "@/components/world/domains/definingWorldPlazaOnlineRoomChatBindings";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { encodingWorldPlazaRoomChatGifMessage } from "@/components/world/domains/encodingWorldPlazaRoomChatGifMessage";
import { trimmingWorldPlazaRoomChatMessage } from "@/components/world/domains/trimmingWorldPlazaRoomChatMessage";
import {
  removingWorldPlazaRoomTypingUser,
  upsertingWorldPlazaRoomTypingUser,
} from "@/components/world/domains/upsertingWorldPlazaRoomTypingUser";
import { buildingPlazaDevvitOnlineRoomApiUrl } from "../../../shared/plazaDevvitOnline";
import {
  PLAZA_DEVVIT_ONLINE_CHAT_API_PATH,
  PLAZA_DEVVIT_ONLINE_CHAT_POLL_INTERVAL_MS,
  PLAZA_DEVVIT_ONLINE_TYPING_API_PATH,
  type PlazaDevvitOnlineChatMessage,
  type PlazaDevvitOnlineChatPollResponse,
  type PlazaDevvitOnlineChatSendResponse,
  type PlazaDevvitOnlineTypingUser,
} from "../../../shared/plazaDevvitOnlineChat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

/** Shown when the client sends chat too quickly. */
const USING_WORLD_PLAZA_DEVVIT_POLLING_CHAT_RATE_LIMIT_MESSAGE =
  "Wait a moment before sending another message." as const;

/** Shown when chat is sent before the plaza room is ready. */
const USING_WORLD_PLAZA_DEVVIT_POLLING_CHAT_NOT_CONNECTED_MESSAGE =
  "Chat is not ready yet." as const;

export interface UsingWorldPlazaDevvitPollingRoomChatParams {
  userId: string | null;
  displayName: string;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  isRoomJoined: boolean;
  enabled: boolean;
  roomIndex?: number;
}

/**
 * Ephemeral plaza room chat over Devvit HTTP polling (no WebSockets).
 */
export function usingWorldPlazaDevvitPollingRoomChat({
  userId,
  displayName,
  playerPositionRef,
  isRoomJoined,
  enabled,
  roomIndex = 1,
}: UsingWorldPlazaDevvitPollingRoomChatParams): UsingWorldPlazaOnlineRoomChatResult {
  const queryClient = useQueryClient();
  const lastSentAtMsRef = useRef(0);
  const lastTypingSentAtMsRef = useRef(0);
  const lastTypingStateRef = useRef(false);
  const displayNameRef = useRef(displayName);
  const seenChatMessageIdsRef = useRef<Set<string>>(new Set());

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
      if (!userId || !enabled || !isRoomJoined) {
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

      const senderPosition = playerPositionRef.current ?? { x: 0, y: 0 };

      void fetch(
        buildingPlazaDevvitOnlineRoomApiUrl(
          PLAZA_DEVVIT_ONLINE_TYPING_API_PATH,
          roomIndex,
        ),
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isTyping,
          displayName: displayNameRef.current,
          gridX: senderPosition.x,
          gridY: senderPosition.y,
        }),
      }).catch(() => {
        // Typing failures are non-fatal.
      });
    },
    [enabled, isRoomJoined, playerPositionRef, userId],
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

  const applyingPolledChatState = useCallback(
    (
      messages: readonly PlazaDevvitOnlineChatMessage[],
      typingUsers: readonly PlazaDevvitOnlineTypingUser[],
    ): void => {
      queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
        DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
        (currentSnapshot) => {
          const snapshot =
            currentSnapshot ??
            DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT;
          let nextBubbles = snapshot.bubbles;
          let didChange = false;
          const nowMs = Date.now();

          for (const message of messages) {
            const messageId = `${message.userId}:${message.sentAt}`;

            if (seenChatMessageIdsRef.current.has(messageId)) {
              continue;
            }

            if (userId && message.userId === userId) {
              seenChatMessageIdsRef.current.add(messageId);
              continue;
            }

            seenChatMessageIdsRef.current.add(messageId);
            nextBubbles = appendingWorldPlazaRoomChatMessage(
              nextBubbles,
              {
                user_id: message.userId,
                display_name: message.displayName,
                message: message.message,
                sent_at: message.sentAt,
                grid_x: message.gridX,
                grid_y: message.gridY,
              },
              nowMs,
            );
            didChange = true;
          }

          let nextTypingUsers = snapshot.typingUsers;

          for (const typingUser of typingUsers) {
            nextTypingUsers = upsertingWorldPlazaRoomTypingUser({
              typingUsers: nextTypingUsers,
              userId: typingUser.userId,
              displayName: typingUser.displayName,
              anchorGridX: typingUser.gridX,
              anchorGridY: typingUser.gridY,
              nowMs,
            });
          }

          const remoteTypingUserIds = new Set(
            typingUsers.map((typingUser) => typingUser.userId),
          );

          for (const existingTypingUser of snapshot.typingUsers) {
            if (remoteTypingUserIds.has(existingTypingUser.userId)) {
              continue;
            }

            nextTypingUsers = removingWorldPlazaRoomTypingUser(
              nextTypingUsers,
              existingTypingUser.userId,
            );
          }

          if (
            !didChange &&
            nextTypingUsers.length === snapshot.typingUsers.length &&
            nextTypingUsers.every(
              (typingUser, index) =>
                typingUser.userId === snapshot.typingUsers[index]?.userId &&
                typingUser.expiresAt === snapshot.typingUsers[index]?.expiresAt,
            )
          ) {
            return snapshot;
          }

          return {
            ...snapshot,
            bubbles: didChange ? nextBubbles : snapshot.bubbles,
            typingUsers: nextTypingUsers,
          };
        },
      );
    },
    [queryClient, userId],
  );

  const broadcastingChatMessage = useCallback(
    async (message: string): Promise<void> => {
      const localUserId = userId;

      if (!localUserId || !enabled || !isRoomJoined) {
        updatingChatSnapshot({
          lastSendError:
            USING_WORLD_PLAZA_DEVVIT_POLLING_CHAT_NOT_CONNECTED_MESSAGE,
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
          lastSendError: USING_WORLD_PLAZA_DEVVIT_POLLING_CHAT_RATE_LIMIT_MESSAGE,
        });
        return;
      }

      const senderPosition = playerPositionRef.current ?? { x: 0, y: 0 };

      try {
        sendTypingState(false);

        const response = await fetch(
          buildingPlazaDevvitOnlineRoomApiUrl(
            PLAZA_DEVVIT_ONLINE_CHAT_API_PATH,
            roomIndex,
          ),
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmedMessage,
            gridX: senderPosition.x,
            gridY: senderPosition.y,
            displayName: displayNameRef.current,
          }),
        });

        const data = (await response.json()) as PlazaDevvitOnlineChatSendResponse;

        if (data.type === "error") {
          updatingChatSnapshot({ lastSendError: data.message });
          return;
        }

        lastSentAtMsRef.current = nowMs;
        const messageId = `${data.message.userId}:${data.message.sentAt}`;
        seenChatMessageIdsRef.current.add(messageId);

        updatingChatSnapshot({
          draftMessage: "",
          lastSendError: null,
          isChatOpen: false,
          bubbles: appendingWorldPlazaRoomChatMessage(
            chatSnapshot.bubbles,
            {
              user_id: data.message.userId,
              display_name: data.message.displayName,
              message: data.message.message,
              sent_at: data.message.sentAt,
              grid_x: data.message.gridX,
              grid_y: data.message.gridY,
            },
            nowMs,
          ),
        });
      } catch (error) {
        updatingChatSnapshot({
          lastSendError:
            error instanceof Error ? error.message : "Could not send message.",
        });
      }
    },
    [
      chatSnapshot.bubbles,
      enabled,
      isRoomJoined,
      playerPositionRef,
      sendTypingState,
      updatingChatSnapshot,
      userId,
    ],
  );

  const sendChatMessage = useCallback(async (): Promise<void> => {
    await broadcastingChatMessage(chatSnapshot.draftMessage);
  }, [broadcastingChatMessage, chatSnapshot.draftMessage]);

  const sendChatGifMessage = useCallback(
    async (gifId: string): Promise<void> => {
      await broadcastingChatMessage(encodingWorldPlazaRoomChatGifMessage(gifId));
    },
    [broadcastingChatMessage],
  );

  useEffect(() => {
    if (!enabled || !isRoomJoined || !userId) {
      seenChatMessageIdsRef.current.clear();
      return;
    }

    let cancelled = false;

    const pollingChatState = async (): Promise<void> => {
      try {
        const response = await fetch(
          buildingPlazaDevvitOnlineRoomApiUrl(
            PLAZA_DEVVIT_ONLINE_CHAT_API_PATH,
            roomIndex,
          ),
        );

        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as PlazaDevvitOnlineChatPollResponse;

        if (cancelled || data.type !== "messages") {
          return;
        }

        applyingPolledChatState(data.messages, data.typingUsers);
      } catch {
        // Poll failures are non-fatal; the next poll will retry.
      }
    };

    void pollingChatState();

    const pollIntervalId = window.setInterval(() => {
      void pollingChatState();
    }, PLAZA_DEVVIT_ONLINE_CHAT_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(pollIntervalId);
    };
  }, [applyingPolledChatState, enabled, isRoomJoined, userId]);

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
