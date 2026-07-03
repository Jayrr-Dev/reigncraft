/**
 * Ephemeral plaza room chat over Supabase Realtime broadcast.
 *
 * @module components/world/domains/definingWorldPlazaOnlineRoomChat
 */

/** Broadcast event name on the plaza room channel. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BROADCAST_EVENT =
  "world-plaza-room-chat" as const;

/** Maximum chat message length (Club Penguin style). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_MAX_MESSAGE_LENGTH = 80;

/** Minimum time between sends from one client (ms). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_SEND_COOLDOWN_MS = 2000;

/** How long a chat bubble stays visible (ms). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_DURATION_MS = 6000;

/** Minimum interval between outgoing "typing" pings while typing (ms). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_TYPING_SEND_THROTTLE_MS = 1500;

/**
 * How long a remote typing indicator stays visible without a refresh (ms).
 * Must exceed the send throttle so continuous typing never flickers off.
 */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_TYPING_EXPIRY_MS = 4000;

import {
  computingWorldPlazaGirlSampleSpriteExtentAboveGridAnchorPx,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/** Extra padding above the GirlSample sprite head for chat bubbles (pixels). */
const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_HEAD_PADDING_PX = 8;

/** Vertical offset above the avatar head for chat bubbles (pixels). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_OFFSET_ABOVE_AVATAR_PX =
  Math.ceil(computingWorldPlazaGirlSampleSpriteExtentAboveGridAnchorPx()) +
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_BUBBLE_HEAD_PADDING_PX;

/** TanStack Query key for active plaza chat bubbles. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_QUERY_KEY = [
  "world-plaza-online-room-chat",
] as const;

/** Payload broadcast to other players in the same room shard. */
export interface DefiningWorldPlazaOnlineRoomChatBroadcastPayload {
  user_id: string;
  display_name: string;
  message: string;
  sent_at: string;
  grid_x: number;
  grid_y: number;
}

/** Active chat bubble shown above an avatar. */
export interface DefiningWorldPlazaOnlineRoomChatBubble {
  /** Stable id for React keys (`user_id:sent_at`). */
  id: string;
  userId: string;
  displayName: string;
  message: string;
  /** Unix ms when the bubble should disappear. */
  expiresAt: number;
  /** Grid X where the sender stood when the message was sent. */
  anchorGridX: number;
  /** Grid Y where the sender stood when the message was sent. */
  anchorGridY: number;
}

/** A remote player currently typing a chat message. */
export interface DefiningWorldPlazaOnlineRoomTypingUser {
  userId: string;
  displayName: string;
  /** Grid X where the typist stood when the state was reported. */
  anchorGridX: number;
  /** Grid Y where the typist stood when the state was reported. */
  anchorGridY: number;
  /** Unix ms when the indicator should disappear without a refresh. */
  expiresAt: number;
}

/** Live chat UI snapshot mirrored in TanStack Query. */
export interface DefiningWorldPlazaOnlineRoomChatSnapshot {
  bubbles: DefiningWorldPlazaOnlineRoomChatBubble[];
  typingUsers: DefiningWorldPlazaOnlineRoomTypingUser[];
  isChatOpen: boolean;
  draftMessage: string;
  lastSendError: string | null;
}

/** Default chat snapshot before join or after teardown. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHAT_INITIAL_SNAPSHOT: DefiningWorldPlazaOnlineRoomChatSnapshot =
  {
    bubbles: [],
    typingUsers: [],
    isChatOpen: false,
    draftMessage: "",
    lastSendError: null,
  };
