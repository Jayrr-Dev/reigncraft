/** Maximum players sharing one Devvit post (or playtest subreddit) room. */
export const PLAZA_DEVVIT_ONLINE_MAX_PLAYERS = 3;

/** Redis TTL for each active player record (seconds). */
export const PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS = 5;

/** Client interval for POST position sync (ms). */
export const PLAZA_DEVVIT_ONLINE_SYNC_INTERVAL_MS = 150;

/** Client interval for GET remote players (ms). */
export const PLAZA_DEVVIT_ONLINE_POLL_INTERVAL_MS = 400;

export const PLAZA_DEVVIT_ONLINE_SYNC_API_PATH = '/api/plaza/sync' as const;
export const PLAZA_DEVVIT_ONLINE_PLAYERS_API_PATH =
  '/api/plaza/players' as const;
export const PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH = '/api/plaza/rooms' as const;

/** Motion + profile payload sent on each sync. */
export type PlazaDevvitOnlineSyncRequest = {
  healthCurrent: number;
  healthEffectiveMax: number;
  shieldPoints: number;
  isInvincible: boolean;
  displayName: string;
  avatarUrl: string | null;
  profileStatusKind: string | null;
  avatarSkinId: string;
  x: number;
  y: number;
  layer: number;
  motionKind: string;
  facingDirection: string;
  jumpStartedAtMs: number;
  jumpArcPeakScreenPx: number;
};

export type PlazaDevvitOnlinePlayerSnapshot = PlazaDevvitOnlineSyncRequest & {
  userId: string;
  updatedAt: string;
};

export type PlazaDevvitOnlineSyncResponse =
  | {
      type: 'sync';
      participantCount: number;
      maxPlayers: number;
    }
  | {
      type: 'error';
      message: string;
      isRoomFull?: boolean;
    };

export type PlazaDevvitOnlinePlayersResponse =
  | {
      type: 'players';
      players: PlazaDevvitOnlinePlayerSnapshot[];
      participantCount: number;
      maxPlayers: number;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineRoomListingEntry = {
  roomIndex: number;
  participantCount: number;
  maxPlayers: number;
  isFull: boolean;
};

export type PlazaDevvitOnlineRoomsResponse =
  | {
      type: 'rooms';
      rooms: PlazaDevvitOnlineRoomListingEntry[];
      maxPlayers: number;
    }
  | {
      type: 'error';
      message: string;
    };

/**
 * Appends the room shard query param to a plaza online API path.
 *
 * @param apiPath - Relative API path.
 * @param roomIndex - One-based room shard index.
 */
export function buildingPlazaDevvitOnlineRoomApiUrl(
  apiPath: string,
  roomIndex: number
): string {
  const normalizedRoomIndex =
    Number.isInteger(roomIndex) && roomIndex >= 1 ? roomIndex : 1;

  return `${apiPath}?room=${normalizedRoomIndex}`;
}
