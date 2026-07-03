"use client";

import { appendingWorldPlazaRoomChatMessage } from "@/components/world/domains/appendingWorldPlazaRoomChatMessage";
import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BROADCAST_EVENT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_SEND_COOLDOWN_MS,
  type DefiningWorldPlazaOnlineRoomChatSnapshot,
} from "@/components/world/domains/definingWorldPlazaOnlineRoomChat";
import { trimmingWorldPlazaRoomChatMessage } from "@/components/world/domains/trimmingWorldPlazaRoomChatMessage";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

/** Shown when the client sends chat too quickly. */
const USING_WORLD_PLAZA_ONLINE_ROOM_CHAT_RATE_LIMIT_MESSAGE =
  "Wait a moment before sending another message." as const;

/** Shown when chat is sent before the room channel is ready. */
const USING_WORLD_PLAZA_ONLINE_ROOM_CHAT_NOT_CONNECTED_MESSAGE =
  "Chat is not ready yet." as const;

export interface UsingWorldPlazaOnlineRoomChatParams {
  /** Auth user id; chat stays idle when null. */
  userId: string | null;
  /** Label included in outgoing chat payloads. */
  displayName: string;
  /** Shared Realtime channel from {@link usingWorldPlazaOnlineRoom}. */
  roomChannelRef: React.RefObject<RealtimeChannel | null>;
  /** True when the local client has joined a room shard. */
  isRoomJoined: boolean;
  /** When false, clears chat state and skips listeners. */
  enabled: boolean;
}

export interface UsingWorldPlazaOnlineRoomChatResult {
  chatSnapshot: DefiningWorldPlazaOnlineRoomChatSnapshot;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setDraftMessage: (draftMessage: string) => void;
  sendChatMessage: () => Promise<void>;
}

/**
 * Ephemeral plaza room chat over the shared Realtime room channel.
 */
export function usingWorldPlazaOnlineRoomChat({
  userId,
  displayName,
  roomChannelRef,
  isRoomJoined,
  enabled,
}: UsingWorldPlazaOnlineRoomChatParams): UsingWorldPlazaOnlineRoomChatResult {
  const queryClient = useQueryClient();
  const lastSentAtMsRef = useRef(0);
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

  const openChat = useCallback((): void => {
    updatingChatSnapshot({ isChatOpen: true, lastSendError: null });
  }, [updatingChatSnapshot]);

  const closeChat = useCallback((): void => {
    updatingChatSnapshot({
      isChatOpen: false,
      draftMessage: "",
      lastSendError: null,
    });
  }, [updatingChatSnapshot]);

  const toggleChat = useCallback((): void => {
    queryClient.setQueryData<DefiningWorldPlazaOnlineRoomChatSnapshot>(
      DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY,
      (currentSnapshot) => {
        const snapshot =
          currentSnapshot ??
          DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT;

        if (snapshot.isChatOpen) {
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
  }, [queryClient]);

  const setDraftMessage = useCallback(
    (draftMessage: string): void => {
      updatingChatSnapshot({ draftMessage, lastSendError: null });
    },
    [updatingChatSnapshot],
  );

  const sendChatMessage = useCallback(async (): Promise<void> => {
    const channel = roomChannelRef.current;
    const localUserId = userId;
    const trimmedMessage = trimmingWorldPlazaRoomChatMessage(
      chatSnapshot.draftMessage,
    );

    if (!localUserId || !enabled || !isRoomJoined) {
      updatingChatSnapshot({
        lastSendError: USING_WORLD_PLAZA_ONLINE_ROOM_CHAT_NOT_CONNECTED_MESSAGE,
      });
      return;
    }

    if (!trimmedMessage) {
      updatingChatSnapshot({ draftMessage: "", lastSendError: null });
      return;
    }

    if (!channel) {
      updatingChatSnapshot({
        lastSendError: USING_WORLD_PLAZA_ONLINE_ROOM_CHAT_NOT_CONNECTED_MESSAGE,
      });
      return;
    }

    const nowMs = Date.now();

    if (
      nowMs - lastSentAtMsRef.current <
      DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_SEND_COOLDOWN_MS
    ) {
      updatingChatSnapshot({
        lastSendError: USING_WORLD_PLAZA_ONLINE_ROOM_CHAT_RATE_LIMIT_MESSAGE,
      });
      return;
    }

    const sentAt = new Date(nowMs).toISOString();
    const payload = {
      user_id: localUserId,
      display_name: displayNameRef.current,
      message: trimmedMessage,
      sent_at: sentAt,
      grid_x: 0,
      grid_y: 0,
    };

    try {
      await channel.send({
        type: "broadcast",
        event: DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BROADCAST_EVENT,
        payload,
      });

      lastSentAtMsRef.current = nowMs;
      updatingChatSnapshot({
        draftMessage: "",
        lastSendError: null,
        isChatOpen: false,
        bubbles: appendingWorldPlazaRoomChatMessage(
          chatSnapshot.bubbles,
          payload,
          nowMs,
        ),
      });
    } catch (error) {
      updatingChatSnapshot({
        lastSendError:
          error instanceof Error ? error.message : "Could not send message.",
      });
    }
  }, [
    chatSnapshot.bubbles,
    chatSnapshot.draftMessage,
    enabled,
    isRoomJoined,
    roomChannelRef,
    updatingChatSnapshot,
    userId,
  ]);

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

          if (activeBubbles.length === snapshot.bubbles.length) {
            return snapshot;
          }

          return {
            ...snapshot,
            bubbles: activeBubbles,
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
  };
}
