/** Minimum players a created multiplayer world may allow. */
export const PLAZA_DEVVIT_ONLINE_MIN_PLAYERS = 2;

/** Maximum players a created multiplayer world may allow. */
export const PLAZA_DEVVIT_ONLINE_MAX_PLAYERS = 4;

/** Default max players when the creator does not pick a value. */
export const PLAZA_DEVVIT_ONLINE_DEFAULT_MAX_PLAYERS = 3;

/** Redis TTL for each active player record (seconds). */
export const PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS = 5;

/** Client interval for POST position sync (ms). */
export const PLAZA_DEVVIT_ONLINE_SYNC_INTERVAL_MS = 150;

/** Client interval for GET remote players (ms). */
export const PLAZA_DEVVIT_ONLINE_POLL_INTERVAL_MS = 400;

/** Display name min length (after trim). */
export const PLAZA_DEVVIT_ONLINE_ROOM_NAME_MIN_LENGTH = 3;

/** Display name max length (after trim). */
export const PLAZA_DEVVIT_ONLINE_ROOM_NAME_MAX_LENGTH = 24;

export const PLAZA_DEVVIT_ONLINE_SYNC_API_PATH = '/api/plaza/sync' as const;
export const PLAZA_DEVVIT_ONLINE_PLAYERS_API_PATH =
  '/api/plaza/players' as const;
export const PLAZA_DEVVIT_ONLINE_ROOMS_API_PATH = '/api/plaza/rooms' as const;
export const PLAZA_DEVVIT_ONLINE_ROOMS_MINE_API_PATH =
  '/api/plaza/rooms/mine' as const;
export const PLAZA_DEVVIT_ONLINE_ROOMS_LOOKUP_API_PATH =
  '/api/plaza/rooms/lookup' as const;
export const PLAZA_DEVVIT_ONLINE_ROOMS_HOSTED_API_PATH =
  '/api/plaza/rooms/hosted' as const;
export const PLAZA_DEVVIT_ONLINE_ROOMS_KICK_API_PATH =
  '/api/plaza/rooms/kick' as const;

export type PlazaDevvitOnlineWildlifeSnapshot = {
  instanceId: string;
  speciesId: string;
  x: number;
  y: number;
  facingDirection: string;
  motionClip: string;
  healthCurrent: number;
};

export type PlazaDevvitOnlineWildlifeDamageEvent = {
  instanceId: string;
  damageAmount: number;
  attackerUserId: string;
  atMs: number;
  projectileArchetypeId?: string;
};

export type PlazaDevvitOnlineProjectileSpawnEvent = {
  projectileId: string;
  archetypeId: string;
  originX: number;
  originY: number;
  originLayer: number;
  targetX?: number;
  targetY?: number;
  targetLayer?: number;
  directionX?: number;
  directionY?: number;
  spawnedAtMs: number;
  seed: number;
  spawnerUserId: string;
};

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
  projectileSpawnEvents?: readonly PlazaDevvitOnlineProjectileSpawnEvent[];
  wildlifeSnapshots?: readonly PlazaDevvitOnlineWildlifeSnapshot[];
  wildlifeDamageEvents?: readonly PlazaDevvitOnlineWildlifeDamageEvent[];
  /** Equipped hotbar held-item overlay; null when unarmed or non-visual tool. */
  heldItemVisualId?: string | null;
  heldItemTier?: string | null;
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
      roomId: string;
      displayName: string;
      createdBy: string;
    }
  | {
      type: 'error';
      message: string;
      isRoomFull?: boolean;
      isKicked?: boolean;
    };

export type PlazaDevvitOnlinePlayersResponse =
  | {
      type: 'players';
      players: PlazaDevvitOnlinePlayerSnapshot[];
      participantCount: number;
      maxPlayers: number;
      roomId: string;
      displayName: string;
      createdBy: string;
    }
  | {
      type: 'error';
      message: string;
      isKicked?: boolean;
    };

export type PlazaDevvitOnlineRoomListingEntry = {
  roomId: string;
  displayName: string;
  participantCount: number;
  maxPlayers: number;
  isFull: boolean;
  isPrivate: boolean;
};

export type PlazaDevvitOnlineRoomsResponse =
  | {
      type: 'rooms';
      rooms: PlazaDevvitOnlineRoomListingEntry[];
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineCreateRoomRequest = {
  name: string;
  maxPlayers: number;
  isPrivate: boolean;
};

export type PlazaDevvitOnlineCreateRoomResponse =
  | {
      type: 'created';
      roomId: string;
      displayName: string;
      maxPlayers: number;
      isPrivate: boolean;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineLookupRoomResponse =
  | {
      type: 'room';
      roomId: string;
      displayName: string;
      maxPlayers: number;
      isPrivate: boolean;
      participantCount: number;
      isFull: boolean;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineHostedRoomResponse =
  | {
      type: 'hosted';
      room: PlazaDevvitOnlineRoomListingEntry | null;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineDeleteRoomResponse =
  | {
      type: 'deleted';
      roomId: string;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineKickPlayerRequest = {
  targetUserId: string;
};

export type PlazaDevvitOnlineKickPlayerResponse =
  | {
      type: 'kicked';
      targetUserId: string;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineRoomMeta = {
  roomId: string;
  displayName: string;
  maxPlayers: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
};

/**
 * Returns true when a max-players value is in the allowed create range.
 *
 * @param value - Candidate max players.
 */
export function checkingPlazaDevvitOnlineMaxPlayers(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= PLAZA_DEVVIT_ONLINE_MIN_PLAYERS &&
    value <= PLAZA_DEVVIT_ONLINE_MAX_PLAYERS
  );
}

/**
 * Normalizes a typed world name for uniqueness and roomId.
 * Lowercases, trims, collapses whitespace to single hyphens.
 *
 * @param rawName - Display name from the player.
 */
export function normalizingPlazaDevvitOnlineRoomName(rawName: string): string {
  return rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Returns true when a display name is allowed for create / lookup.
 *
 * @param rawName - Display name from the player.
 */
export function checkingPlazaDevvitOnlineRoomDisplayName(
  rawName: string
): boolean {
  const trimmed = rawName.trim();

  if (
    trimmed.length < PLAZA_DEVVIT_ONLINE_ROOM_NAME_MIN_LENGTH ||
    trimmed.length > PLAZA_DEVVIT_ONLINE_ROOM_NAME_MAX_LENGTH
  ) {
    return false;
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9\s-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]{3,24}$/.test(trimmed)) {
    return false;
  }

  const normalized = normalizingPlazaDevvitOnlineRoomName(trimmed);

  return (
    normalized.length >= PLAZA_DEVVIT_ONLINE_ROOM_NAME_MIN_LENGTH &&
    normalized.length <= PLAZA_DEVVIT_ONLINE_ROOM_NAME_MAX_LENGTH
  );
}

/**
 * Builds a roomId slug from a validated display name.
 *
 * @param rawName - Display name from the player.
 */
export function buildingPlazaDevvitOnlineRoomIdFromDisplayName(
  rawName: string
): string {
  return normalizingPlazaDevvitOnlineRoomName(rawName);
}

/**
 * Returns true when a public listing entry should appear in the open-worlds browser.
 *
 * @param entry - Candidate listing row.
 */
export function checkingPlazaDevvitOnlineRoomIsPublicBrowseable(
  entry: Pick<
    PlazaDevvitOnlineRoomListingEntry,
    'isPrivate' | 'participantCount'
  >
): boolean {
  return !entry.isPrivate && entry.participantCount > 0;
}

/**
 * Appends the room id query param to a plaza / world API path.
 *
 * @param apiPath - Relative API path (may already include query params).
 * @param roomId - Named room id slug.
 */
export function buildingPlazaDevvitOnlineRoomApiUrl(
  apiPath: string,
  roomId: string
): string {
  const trimmedRoomId = roomId.trim();

  if (!trimmedRoomId) {
    return apiPath;
  }

  const separator = apiPath.includes('?') ? '&' : '?';

  return `${apiPath}${separator}room=${encodeURIComponent(trimmedRoomId)}`;
}
