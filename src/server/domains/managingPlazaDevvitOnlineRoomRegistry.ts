import { redis } from '@devvit/web/server';
import {
  buildingPlazaDevvitOnlineRoomIdFromDisplayName,
  checkingPlazaDevvitOnlineMaxPlayers,
  checkingPlazaDevvitOnlineRoomDisplayName,
  normalizingPlazaDevvitOnlineRoomName,
  PLAZA_DEVVIT_ONLINE_DEFAULT_MAX_PLAYERS,
  type PlazaDevvitOnlineRoomMeta,
} from '../../shared/plazaDevvitOnline';
import {
  buildingPlazaDevvitOnlineHostedRoomRedisKey,
  buildingPlazaDevvitOnlineRoomAlumniRedisKey,
  buildingPlazaDevvitOnlineRoomByNameRedisKey,
  buildingPlazaDevvitOnlineRoomIndexRedisKey,
  buildingPlazaDevvitOnlineRoomKickedRedisKey,
  buildingPlazaDevvitOnlineRoomMetaRedisKey,
  buildingPlazaDevvitOnlineUserRoomsRedisKey,
} from './buildingPlazaDevvitOnlineRoomRegistryRedisKeys';
import {
  buildingPlazaDevvitOnlineChatRedisKey,
  buildingPlazaDevvitOnlinePlayerRedisKey,
  buildingPlazaDevvitOnlineRosterRedisKey,
  buildingPlazaDevvitOnlineTypingRedisKey,
} from './buildingPlazaDevvitOnlineRedisKeys';
import {
  resolvingPlazaDevvitOnlineBaseScope,
  resolvingPlazaDevvitOnlineRoomScope,
} from './resolvingPlazaDevvitOnlineRoomScope';

function parsingPlazaDevvitOnlineRoomMeta(
  rawValue: string | undefined | null
): PlazaDevvitOnlineRoomMeta | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PlazaDevvitOnlineRoomMeta>;

    if (
      typeof parsed.roomId !== 'string' ||
      typeof parsed.displayName !== 'string' ||
      typeof parsed.maxPlayers !== 'number' ||
      typeof parsed.isPrivate !== 'boolean' ||
      typeof parsed.createdBy !== 'string' ||
      typeof parsed.createdAt !== 'string' ||
      !checkingPlazaDevvitOnlineMaxPlayers(parsed.maxPlayers)
    ) {
      return null;
    }

    return {
      roomId: parsed.roomId,
      displayName: parsed.displayName,
      maxPlayers: parsed.maxPlayers,
      isPrivate: parsed.isPrivate,
      createdBy: parsed.createdBy,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}

/**
 * Loads room meta for a room id under the current post scope.
 *
 * @param roomId - Named room id slug.
 */
export async function loadingPlazaDevvitOnlineRoomMeta(
  roomId: string
): Promise<PlazaDevvitOnlineRoomMeta | null> {
  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const rawMeta = await redis.get(
    buildingPlazaDevvitOnlineRoomMetaRedisKey(baseScope, roomId)
  );

  return parsingPlazaDevvitOnlineRoomMeta(rawMeta);
}

/**
 * Looks up a room by typed display name (normalized uniqueness key).
 *
 * @param rawName - Display name or slug typed by the player.
 */
export async function lookingUpPlazaDevvitOnlineRoomByName(
  rawName: string
): Promise<PlazaDevvitOnlineRoomMeta | null> {
  const normalizedName = normalizingPlazaDevvitOnlineRoomName(rawName);

  if (!normalizedName) {
    return null;
  }

  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const roomId = await redis.get(
    buildingPlazaDevvitOnlineRoomByNameRedisKey(baseScope, normalizedName)
  );

  if (!roomId) {
    return null;
  }

  return loadingPlazaDevvitOnlineRoomMeta(roomId);
}

export type CreatingPlazaDevvitOnlineRoomInput = {
  name: string;
  maxPlayers?: number;
  isPrivate?: boolean;
  createdBy: string;
};

export type CreatingPlazaDevvitOnlineRoomResult =
  | { ok: true; meta: PlazaDevvitOnlineRoomMeta }
  | { ok: false; message: string };

/**
 * Loads the one world this user created, if any.
 *
 * @param userId - Signed-in Reddit user id.
 */
export async function loadingPlazaDevvitOnlineHostedRoomMeta(
  userId: string
): Promise<PlazaDevvitOnlineRoomMeta | null> {
  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const roomId = await redis.get(
    buildingPlazaDevvitOnlineHostedRoomRedisKey(baseScope, userId)
  );

  if (!roomId) {
    return null;
  }

  return loadingPlazaDevvitOnlineRoomMeta(roomId);
}

/**
 * Creates a named multiplayer room registry entry.
 * Each user may host only one world under the current post scope.
 *
 * @param input - Create payload from the signed-in host.
 */
export async function creatingPlazaDevvitOnlineRoom(
  input: CreatingPlazaDevvitOnlineRoomInput
): Promise<CreatingPlazaDevvitOnlineRoomResult> {
  if (!checkingPlazaDevvitOnlineRoomDisplayName(input.name)) {
    return {
      ok: false,
      message:
        'World name must be 3-24 letters, numbers, spaces, or hyphens.',
    };
  }

  const maxPlayers =
    typeof input.maxPlayers === 'number'
      ? input.maxPlayers
      : PLAZA_DEVVIT_ONLINE_DEFAULT_MAX_PLAYERS;

  if (!checkingPlazaDevvitOnlineMaxPlayers(maxPlayers)) {
    return {
      ok: false,
      message: 'Max travelers must be between 2 and 4.',
    };
  }

  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const hostKey = buildingPlazaDevvitOnlineHostedRoomRedisKey(
    baseScope,
    input.createdBy
  );
  const existingHostedRoomId = await redis.get(hostKey);

  if (existingHostedRoomId) {
    const existingHostedMeta =
      await loadingPlazaDevvitOnlineRoomMeta(existingHostedRoomId);

    return {
      ok: false,
      message: existingHostedMeta
        ? `You already have a world (${existingHostedMeta.displayName}). Use Continue or Join by name.`
        : 'You already have a world. Use Continue or Join by name.',
    };
  }

  const displayName = input.name.trim();
  const roomId = buildingPlazaDevvitOnlineRoomIdFromDisplayName(displayName);
  const normalizedName = normalizingPlazaDevvitOnlineRoomName(displayName);
  const byNameKey = buildingPlazaDevvitOnlineRoomByNameRedisKey(
    baseScope,
    normalizedName
  );
  const existingRoomId = await redis.get(byNameKey);

  if (existingRoomId) {
    return {
      ok: false,
      message: 'That world name is already taken. Pick another.',
    };
  }

  const meta: PlazaDevvitOnlineRoomMeta = {
    roomId,
    displayName,
    maxPlayers,
    isPrivate: Boolean(input.isPrivate),
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
  };

  await redis.set(
    buildingPlazaDevvitOnlineRoomMetaRedisKey(baseScope, roomId),
    JSON.stringify(meta)
  );
  await redis.set(byNameKey, roomId);
  await redis.set(hostKey, roomId);
  await redis.hSet(buildingPlazaDevvitOnlineRoomIndexRedisKey(baseScope), {
    [roomId]: '1',
  });
  await redis.hSet(
    buildingPlazaDevvitOnlineRoomAlumniRedisKey(baseScope, roomId),
    { [input.createdBy]: '1' }
  );
  await redis.hSet(
    buildingPlazaDevvitOnlineUserRoomsRedisKey(baseScope, input.createdBy),
    { [roomId]: '1' }
  );

  return { ok: true, meta };
}

/**
 * Records that a user has synced into a room (Continue list).
 *
 * @param roomId - Named room id slug.
 * @param userId - Signed-in Reddit user id.
 */
export async function recordingPlazaDevvitOnlineRoomAlumni(
  roomId: string,
  userId: string
): Promise<void> {
  const baseScope = resolvingPlazaDevvitOnlineBaseScope();

  await redis.hSet(
    buildingPlazaDevvitOnlineRoomAlumniRedisKey(baseScope, roomId),
    { [userId]: '1' }
  );
  await redis.hSet(buildingPlazaDevvitOnlineUserRoomsRedisKey(baseScope, userId), {
    [roomId]: '1',
  });
}

/**
 * Lists all registered room ids under the current post scope.
 */
export async function listingPlazaDevvitOnlineRoomIds(): Promise<string[]> {
  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const rawIndex =
    (await redis.hGetAll(
      buildingPlazaDevvitOnlineRoomIndexRedisKey(baseScope)
    )) ?? {};

  return Object.keys(rawIndex);
}

/**
 * Lists Continue room ids for a user.
 *
 * @param userId - Signed-in Reddit user id.
 */
export async function listingPlazaDevvitOnlineUserRoomIds(
  userId: string
): Promise<string[]> {
  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const rawMine =
    (await redis.hGetAll(
      buildingPlazaDevvitOnlineUserRoomsRedisKey(baseScope, userId)
    )) ?? {};

  return Object.keys(rawMine);
}

/**
 * Returns true when a user is kicked from a named room.
 *
 * @param roomId - Named room id slug.
 * @param userId - Candidate traveler id.
 */
export async function checkingPlazaDevvitOnlineRoomUserIsKicked(
  roomId: string,
  userId: string
): Promise<boolean> {
  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const kickedFlag = await redis.hGet(
    buildingPlazaDevvitOnlineRoomKickedRedisKey(baseScope, roomId),
    userId
  );

  return typeof kickedFlag === 'string' && kickedFlag.length > 0;
}

export type MutatingPlazaDevvitOnlineRoomHostResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Host kicks a traveler: remove presence, alumni Continue, and block rejoin.
 *
 * @param roomId - Named room id slug.
 * @param hostUserId - Signed-in host.
 * @param targetUserId - Traveler to remove.
 */
export async function kickingPlazaDevvitOnlineRoomPlayer(
  roomId: string,
  hostUserId: string,
  targetUserId: string
): Promise<MutatingPlazaDevvitOnlineRoomHostResult> {
  if (hostUserId === targetUserId) {
    return { ok: false, message: 'You cannot kick yourself.' };
  }

  const meta = await loadingPlazaDevvitOnlineRoomMeta(roomId);

  if (!meta) {
    return { ok: false, message: 'That plaza world no longer exists.' };
  }

  if (meta.createdBy !== hostUserId) {
    return { ok: false, message: 'Only the world host can kick travelers.' };
  }

  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);

  await redis.hSet(buildingPlazaDevvitOnlineRoomKickedRedisKey(baseScope, roomId), {
    [targetUserId]: '1',
  });
  await redis.del(
    buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, targetUserId)
  );
  await redis.hDel(buildingPlazaDevvitOnlineRosterRedisKey(roomScope), [
    targetUserId,
  ]);
  await redis.hDel(
    buildingPlazaDevvitOnlineRoomAlumniRedisKey(baseScope, roomId),
    [targetUserId]
  );
  await redis.hDel(
    buildingPlazaDevvitOnlineUserRoomsRedisKey(baseScope, targetUserId),
    [roomId]
  );

  return { ok: true };
}

/**
 * Host deletes their world: frees the name/host slot and drops online presence.
 * Alumni Continue entries are cleared. World Redis progress for the room scope
 * is left orphaned (no auto-prune).
 *
 * @param roomId - Named room id slug.
 * @param hostUserId - Signed-in host.
 */
export async function deletingPlazaDevvitOnlineRoom(
  roomId: string,
  hostUserId: string
): Promise<MutatingPlazaDevvitOnlineRoomHostResult> {
  const meta = await loadingPlazaDevvitOnlineRoomMeta(roomId);

  if (!meta) {
    return { ok: false, message: 'That plaza world no longer exists.' };
  }

  if (meta.createdBy !== hostUserId) {
    return { ok: false, message: 'Only the world host can delete this world.' };
  }

  const baseScope = resolvingPlazaDevvitOnlineBaseScope();
  const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
  const alumniKey = buildingPlazaDevvitOnlineRoomAlumniRedisKey(
    baseScope,
    roomId
  );
  const alumni =
    (await redis.hGetAll(alumniKey)) ?? {};

  for (const alumniUserId of Object.keys(alumni)) {
    await redis.hDel(
      buildingPlazaDevvitOnlineUserRoomsRedisKey(baseScope, alumniUserId),
      [roomId]
    );
  }

  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const roster = (await redis.hGetAll(rosterKey)) ?? {};

  for (const playerUserId of Object.keys(roster)) {
    await redis.del(
      buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, playerUserId)
    );
  }

  await redis.del(rosterKey);
  await redis.del(buildingPlazaDevvitOnlineChatRedisKey(roomScope));
  await redis.del(buildingPlazaDevvitOnlineTypingRedisKey(roomScope));
  await redis.del(buildingPlazaDevvitOnlineRoomMetaRedisKey(baseScope, roomId));
  await redis.del(
    buildingPlazaDevvitOnlineRoomByNameRedisKey(
      baseScope,
      normalizingPlazaDevvitOnlineRoomName(meta.displayName)
    )
  );
  await redis.del(
    buildingPlazaDevvitOnlineHostedRoomRedisKey(baseScope, hostUserId)
  );
  await redis.del(alumniKey);
  await redis.del(buildingPlazaDevvitOnlineRoomKickedRedisKey(baseScope, roomId));
  await redis.hDel(buildingPlazaDevvitOnlineRoomIndexRedisKey(baseScope), [
    roomId,
  ]);

  return { ok: true };
}
