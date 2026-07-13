/**
 * Supabase Realtime online room for the world plaza.
 *
 * @module components/world/domains/definingWorldPlazaOnlineRoom
 */

/** Prefix for plaza Realtime room shards (`world-plaza-room-1`, `world-plaza-room-2`, ...). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_CHANNEL_PREFIX =
  'world-plaza-room-' as const;

/** First shard index when auto-assigning an open room. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_FIRST_SHARD_INDEX = 1;

/** Maximum number of plaza room shards (each holds up to {@link DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_PLAYERS}). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_SHARD_COUNT = 50;

/** Maximum players allowed in one plaza room shard. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_PLAYERS = 20;

/** Slow presence re-track keep-alive so the roster stays fresh (ms). Position rides on broadcast, not presence. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_HEARTBEAT_MS = 5000;

/** Polls remote presence as a backup when Realtime events are missed (ms). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_PRESENCE_ROSTER_POLL_MS = 1000;

/** Waits after subscribe before counting shard capacity so presence can settle (ms). */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_SHARD_CAPACITY_SETTLE_MS = 400;

/** TanStack Query key for the live plaza room snapshot. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_QUERY_KEY = [
  'world-plaza-online-room',
] as const;

/** Presence payload tracked on the plaza room channel. */
export interface DefiningWorldPlazaOnlineRoomPresencePayload {
  user_id: string;
  display_name: string;
  x: number;
  y: number;
  updated_at: string;
}

/** Remote player rendered from presence (excluding the local client). */
export interface DefiningWorldPlazaRemotePlayer {
  userId: string;
  displayName: string;
  profileStatusKind: string;
  avatarUrl: string;
  avatarSkinId: string;
  x: number;
  y: number;
  updatedAt: string;
  motionKind: string;
  facingDirection: string;
  jumpStartedAtMs: number;
  jumpArcPeakScreenPx: number;
  healthCurrent: number;
  healthEffectiveMax: number;
  shieldPoints: number;
  isInvincible: boolean;
  /** One-based world layer the avatar is standing on (1 = ground). */
  layer: number;
  heldItemVisualId: string | null;
  heldItemTier: string | null;
}

/** Unique participant listed in the room HUD. */
export interface DefiningWorldPlazaOnlineParticipant {
  userId: string;
  displayName: string;
}

/** Live room snapshot mirrored in TanStack Query. */
export interface DefiningWorldPlazaOnlineRoomSnapshot {
  remotePlayers: DefiningWorldPlazaRemotePlayer[];
  /** Every unique auth user in the room, including the local client. */
  onlineParticipants: DefiningWorldPlazaOnlineParticipant[];
  participantCount: number;
  /** Named room id when connected; null before assignment. */
  roomId: string | null;
  /** Player-facing world name when connected; null before assignment. */
  roomDisplayName: string | null;
  /** Cap from room meta when known; defaults applied by HUD when null. */
  maxPlayers: number | null;
  /** Host user id from room meta when known. */
  createdBy: string | null;
  /** Assigned Realtime channel name when connected; null before assignment. */
  roomChannelName: string | null;
  isConnected: boolean;
  isJoined: boolean;
  /** True while the plaza room is reconnecting after a drop. */
  isReconnecting: boolean;
  /** True only when every shard is at capacity. */
  isRoomFull: boolean;
  lastError: string | null;
}

/** Default snapshot before subscription or after teardown. */
export const DEFINING_WORLD_PLAZA_ONLINE_ROOM_INITIAL_SNAPSHOT: DefiningWorldPlazaOnlineRoomSnapshot =
  {
    remotePlayers: [],
    onlineParticipants: [],
    participantCount: 0,
    roomId: null,
    roomDisplayName: null,
    maxPlayers: null,
    createdBy: null,
    roomChannelName: null,
    isConnected: false,
    isJoined: false,
    isReconnecting: false,
    isRoomFull: false,
    lastError: null,
  };
