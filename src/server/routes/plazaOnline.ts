import { context, reddit, redis } from '@devvit/web/server';
import { Hono } from 'hono';
import {
  checkingPlazaDevvitOnlineRoomIsPublicBrowseable,
  PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS,
  type PlazaDevvitOnlineCreateRoomRequest,
  type PlazaDevvitOnlineCreateRoomResponse,
  type PlazaDevvitOnlineDeleteRoomResponse,
  type PlazaDevvitOnlineHostedRoomResponse,
  type PlazaDevvitOnlineKickPlayerRequest,
  type PlazaDevvitOnlineKickPlayerResponse,
  type PlazaDevvitOnlineLookupRoomResponse,
  type PlazaDevvitOnlinePlayerSnapshot,
  type PlazaDevvitOnlinePlayersResponse,
  type PlazaDevvitOnlineProjectileSpawnEvent,
  type PlazaDevvitOnlineRoomListingEntry,
  type PlazaDevvitOnlineRoomsResponse,
  type PlazaDevvitOnlineSyncRequest,
  type PlazaDevvitOnlineSyncResponse,
  type PlazaDevvitOnlineOwnedPetSnapshot,
  type PlazaDevvitOnlineWildlifeDamageEvent,
  type PlazaDevvitOnlineWildlifeSnapshot,
} from '../../shared/plazaDevvitOnline';
import {
  PLAZA_DEVVIT_ONLINE_CHAT_REDIS_MAX_MESSAGES,
  PLAZA_DEVVIT_ONLINE_CHAT_REDIS_TTL_SECONDS,
  PLAZA_DEVVIT_ONLINE_TYPING_EXPIRY_MS,
  sanitizingPlazaDevvitOnlineChatMessage,
  type PlazaDevvitOnlineChatMessage,
  type PlazaDevvitOnlineChatPollResponse,
  type PlazaDevvitOnlineChatSendRequest,
  type PlazaDevvitOnlineChatSendResponse,
  type PlazaDevvitOnlineChatTypingRequest,
  type PlazaDevvitOnlineTypingUser,
} from '../../shared/plazaDevvitOnlineChat';
import {
  buildingPlazaDevvitOnlineChatRedisKey,
  buildingPlazaDevvitOnlinePlayerRedisKey,
  buildingPlazaDevvitOnlineRosterRedisKey,
  buildingPlazaDevvitOnlineTypingRedisKey,
} from '../domains/buildingPlazaDevvitOnlineRedisKeys';
import {
  checkingPlazaDevvitOnlineRoomUserIsKicked,
  creatingPlazaDevvitOnlineRoom,
  deletingPlazaDevvitOnlineRoom,
  kickingPlazaDevvitOnlineRoomPlayer,
  listingPlazaDevvitOnlineRoomIds,
  listingPlazaDevvitOnlineUserRoomIds,
  loadingPlazaDevvitOnlineHostedRoomMeta,
  loadingPlazaDevvitOnlineRoomMeta,
  lookingUpPlazaDevvitOnlineRoomByName,
  recordingPlazaDevvitOnlineRoomAlumni,
} from '../domains/managingPlazaDevvitOnlineRoomRegistry';
import {
  parsingPlazaDevvitOnlineRoomIdFromQuery,
  resolvingPlazaDevvitOnlineRoomScope,
} from '../domains/resolvingPlazaDevvitOnlineRoomScope';

type PlazaDevvitOnlineErrorResponse = {
  type: 'error';
  message: string;
  isRoomFull?: boolean;
};

async function buildingPlazaDevvitOnlineRoomListingEntry(
  roomId: string,
  participantCount: number
): Promise<PlazaDevvitOnlineRoomListingEntry | null> {
  const meta = await loadingPlazaDevvitOnlineRoomMeta(roomId);

  if (!meta) {
    return null;
  }

  return {
    roomId: meta.roomId,
    displayName: meta.displayName,
    participantCount,
    maxPlayers: meta.maxPlayers,
    isFull: participantCount >= meta.maxPlayers,
    isPrivate: meta.isPrivate,
  };
}

function parsingPlazaDevvitOnlineCreateRoomRequest(
  body: unknown
): PlazaDevvitOnlineCreateRoomRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<PlazaDevvitOnlineCreateRoomRequest>;

  if (typeof payload.name !== 'string') {
    return null;
  }

  return {
    name: payload.name,
    maxPlayers:
      typeof payload.maxPlayers === 'number' ? payload.maxPlayers : 3,
    isPrivate: Boolean(payload.isPrivate),
  };
}

function parsingPlazaDevvitOnlineWildlifeSnapshot(
  value: unknown
): PlazaDevvitOnlineWildlifeSnapshot | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const snapshot = value as Partial<PlazaDevvitOnlineWildlifeSnapshot>;

  if (
    typeof snapshot.instanceId !== 'string' ||
    typeof snapshot.speciesId !== 'string' ||
    typeof snapshot.x !== 'number' ||
    typeof snapshot.y !== 'number' ||
    typeof snapshot.facingDirection !== 'string' ||
    typeof snapshot.motionClip !== 'string' ||
    typeof snapshot.healthCurrent !== 'number'
  ) {
    return null;
  }

  return {
    instanceId: snapshot.instanceId,
    speciesId: snapshot.speciesId,
    x: snapshot.x,
    y: snapshot.y,
    facingDirection: snapshot.facingDirection,
    motionClip: snapshot.motionClip,
    healthCurrent: snapshot.healthCurrent,
  };
}

function parsingPlazaDevvitOnlineWildlifeDamageEvent(
  value: unknown
): PlazaDevvitOnlineWildlifeDamageEvent | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const event = value as Partial<PlazaDevvitOnlineWildlifeDamageEvent>;

  if (
    typeof event.instanceId !== 'string' ||
    typeof event.damageAmount !== 'number' ||
    typeof event.attackerUserId !== 'string' ||
    typeof event.atMs !== 'number'
  ) {
    return null;
  }

  return {
    instanceId: event.instanceId,
    damageAmount: event.damageAmount,
    attackerUserId: event.attackerUserId,
    atMs: event.atMs,
    ...(typeof event.projectileArchetypeId === 'string'
      ? { projectileArchetypeId: event.projectileArchetypeId }
      : {}),
  };
}

function parsingPlazaDevvitOnlineOwnedPetSnapshot(
  value: unknown
): PlazaDevvitOnlineOwnedPetSnapshot | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const snapshot = value as Partial<PlazaDevvitOnlineOwnedPetSnapshot>;

  if (
    typeof snapshot.petId !== 'string' ||
    typeof snapshot.ownerUserId !== 'string' ||
    typeof snapshot.speciesId !== 'string' ||
    typeof snapshot.x !== 'number' ||
    typeof snapshot.y !== 'number' ||
    typeof snapshot.facingDirection !== 'string' ||
    typeof snapshot.motionClip !== 'string' ||
    typeof snapshot.healthCurrent !== 'number' ||
    typeof snapshot.loyalty !== 'number' ||
    typeof snapshot.command !== 'string'
  ) {
    return null;
  }

  return {
    petId: snapshot.petId,
    ownerUserId: snapshot.ownerUserId,
    speciesId: snapshot.speciesId,
    displayName:
      typeof snapshot.displayName === 'string' ? snapshot.displayName : null,
    x: snapshot.x,
    y: snapshot.y,
    facingDirection: snapshot.facingDirection,
    motionClip: snapshot.motionClip,
    healthCurrent: snapshot.healthCurrent,
    loyalty: snapshot.loyalty,
    command: snapshot.command,
  };
}

function parsingPlazaDevvitOnlineProjectileSpawnEvent(
  value: unknown
): PlazaDevvitOnlineProjectileSpawnEvent | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const event = value as Partial<PlazaDevvitOnlineProjectileSpawnEvent>;

  if (
    typeof event.projectileId !== 'string' ||
    typeof event.archetypeId !== 'string' ||
    typeof event.originX !== 'number' ||
    typeof event.originY !== 'number' ||
    typeof event.originLayer !== 'number' ||
    typeof event.spawnedAtMs !== 'number' ||
    typeof event.seed !== 'number' ||
    typeof event.spawnerUserId !== 'string'
  ) {
    return null;
  }

  return {
    projectileId: event.projectileId,
    archetypeId: event.archetypeId,
    originX: event.originX,
    originY: event.originY,
    originLayer: event.originLayer,
    targetX: typeof event.targetX === 'number' ? event.targetX : undefined,
    targetY: typeof event.targetY === 'number' ? event.targetY : undefined,
    targetLayer:
      typeof event.targetLayer === 'number' ? event.targetLayer : undefined,
    directionX:
      typeof event.directionX === 'number' ? event.directionX : undefined,
    directionY:
      typeof event.directionY === 'number' ? event.directionY : undefined,
    spawnedAtMs: event.spawnedAtMs,
    seed: event.seed,
    spawnerUserId: event.spawnerUserId,
  };
}

function parsingPlazaDevvitOnlineSyncRequest(
  body: unknown
): PlazaDevvitOnlineSyncRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<PlazaDevvitOnlineSyncRequest>;

  if (
    typeof payload.displayName !== 'string' ||
    typeof payload.avatarSkinId !== 'string' ||
    typeof payload.x !== 'number' ||
    typeof payload.y !== 'number' ||
    typeof payload.layer !== 'number' ||
    typeof payload.motionKind !== 'string' ||
    typeof payload.facingDirection !== 'string' ||
    typeof payload.jumpStartedAtMs !== 'number' ||
    typeof payload.jumpArcPeakScreenPx !== 'number' ||
    typeof payload.healthCurrent !== 'number' ||
    typeof payload.healthEffectiveMax !== 'number' ||
    typeof payload.shieldPoints !== 'number' ||
    typeof payload.isInvincible !== 'boolean'
  ) {
    return null;
  }

  return {
    displayName: payload.displayName,
    avatarUrl: typeof payload.avatarUrl === 'string' ? payload.avatarUrl : null,
    profileStatusKind:
      typeof payload.profileStatusKind === 'string'
        ? payload.profileStatusKind
        : null,
    avatarSkinId: payload.avatarSkinId,
    x: payload.x,
    y: payload.y,
    layer: payload.layer,
    motionKind: payload.motionKind,
    facingDirection: payload.facingDirection,
    jumpStartedAtMs: payload.jumpStartedAtMs,
    jumpArcPeakScreenPx: payload.jumpArcPeakScreenPx,
    healthCurrent: payload.healthCurrent,
    healthEffectiveMax: payload.healthEffectiveMax,
    shieldPoints: payload.shieldPoints,
    isInvincible: payload.isInvincible,
    projectileSpawnEvents: Array.isArray(payload.projectileSpawnEvents)
      ? payload.projectileSpawnEvents
          .map(parsingPlazaDevvitOnlineProjectileSpawnEvent)
          .filter(
            (event): event is PlazaDevvitOnlineProjectileSpawnEvent =>
              event !== null
          )
      : undefined,
    wildlifeSnapshots: Array.isArray(payload.wildlifeSnapshots)
      ? payload.wildlifeSnapshots
          .map(parsingPlazaDevvitOnlineWildlifeSnapshot)
          .filter(
            (snapshot): snapshot is PlazaDevvitOnlineWildlifeSnapshot =>
              snapshot !== null
          )
      : undefined,
    wildlifeDamageEvents: Array.isArray(payload.wildlifeDamageEvents)
      ? payload.wildlifeDamageEvents
          .map(parsingPlazaDevvitOnlineWildlifeDamageEvent)
          .filter(
            (event): event is PlazaDevvitOnlineWildlifeDamageEvent =>
              event !== null
          )
      : undefined,
    ownedPetSnapshots: Array.isArray(payload.ownedPetSnapshots)
      ? payload.ownedPetSnapshots
          .map(parsingPlazaDevvitOnlineOwnedPetSnapshot)
          .filter(
            (snapshot): snapshot is PlazaDevvitOnlineOwnedPetSnapshot =>
              snapshot !== null
          )
      : undefined,
    heldItemVisualId:
      typeof payload.heldItemVisualId === 'string'
        ? payload.heldItemVisualId
        : payload.heldItemVisualId === null
          ? null
          : undefined,
    heldItemTier:
      typeof payload.heldItemTier === 'string'
        ? payload.heldItemTier
        : payload.heldItemTier === null
          ? null
          : undefined,
  };
}

async function resolvingPlazaDevvitOnlineUserId(): Promise<string | null> {
  const username = context.username ?? (await reddit.getCurrentUsername());

  if (username) {
    return `reddit:${username}`;
  }

  if (context.userId) {
    return context.userId;
  }

  return null;
}

async function listingPlazaDevvitOnlinePlayers(
  roomScope: string,
  localUserId: string | null
): Promise<PlazaDevvitOnlinePlayerSnapshot[]> {
  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const rosterUserIds = await redis.hKeys(rosterKey);
  const players: PlazaDevvitOnlinePlayerSnapshot[] = [];

  for (const userId of rosterUserIds) {
    const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(
      roomScope,
      userId
    );
    const rawPlayer = await redis.get(playerKey);

    if (!rawPlayer) {
      await redis.hDel(rosterKey, [userId]);
      continue;
    }

    try {
      const parsedPlayer = JSON.parse(
        rawPlayer
      ) as PlazaDevvitOnlinePlayerSnapshot;

      if (
        typeof parsedPlayer.userId !== 'string' ||
        typeof parsedPlayer.displayName !== 'string' ||
        typeof parsedPlayer.updatedAt !== 'string'
      ) {
        await redis.hDel(rosterKey, [userId]);
        continue;
      }

      if (localUserId !== null && parsedPlayer.userId === localUserId) {
        continue;
      }

      players.push(parsedPlayer);
    } catch {
      await redis.hDel(rosterKey, [userId]);
    }
  }

  return players;
}

async function countingPlazaDevvitOnlineParticipants(
  roomScope: string
): Promise<number> {
  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const rosterUserIds = await redis.hKeys(rosterKey);
  let participantCount = 0;

  for (const userId of rosterUserIds) {
    const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(
      roomScope,
      userId
    );
    const rawPlayer = await redis.get(playerKey);

    if (!rawPlayer) {
      await redis.hDel(rosterKey, [userId]);
      continue;
    }

    participantCount += 1;
  }

  return participantCount;
}

function parsingPlazaDevvitOnlineChatSendRequest(
  body: unknown
): PlazaDevvitOnlineChatSendRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<PlazaDevvitOnlineChatSendRequest>;

  if (
    typeof payload.message !== 'string' ||
    typeof payload.displayName !== 'string' ||
    typeof payload.gridX !== 'number' ||
    typeof payload.gridY !== 'number'
  ) {
    return null;
  }

  return {
    message: payload.message,
    displayName: payload.displayName,
    gridX: payload.gridX,
    gridY: payload.gridY,
  };
}

function parsingPlazaDevvitOnlineChatMessage(
  rawMessage: string
): PlazaDevvitOnlineChatMessage | null {
  try {
    const parsedMessage = JSON.parse(
      rawMessage
    ) as Partial<PlazaDevvitOnlineChatMessage>;

    if (
      typeof parsedMessage.userId !== 'string' ||
      typeof parsedMessage.displayName !== 'string' ||
      typeof parsedMessage.message !== 'string' ||
      typeof parsedMessage.sentAt !== 'string' ||
      typeof parsedMessage.gridX !== 'number' ||
      typeof parsedMessage.gridY !== 'number'
    ) {
      return null;
    }

    return {
      userId: parsedMessage.userId,
      displayName: parsedMessage.displayName,
      message: parsedMessage.message,
      sentAt: parsedMessage.sentAt,
      gridX: parsedMessage.gridX,
      gridY: parsedMessage.gridY,
    };
  } catch {
    return null;
  }
}

async function listingPlazaDevvitOnlineChatMessages(
  roomScope: string
): Promise<PlazaDevvitOnlineChatMessage[]> {
  const chatKey = buildingPlazaDevvitOnlineChatRedisKey(roomScope);
  const rawMessagesById = await redis.hGetAll(chatKey);
  const messages: PlazaDevvitOnlineChatMessage[] = [];

  for (const rawMessage of Object.values(rawMessagesById)) {
    const parsedMessage = parsingPlazaDevvitOnlineChatMessage(rawMessage);

    if (parsedMessage) {
      messages.push(parsedMessage);
    }
  }

  return messages.sort(
    (leftMessage, rightMessage) =>
      Date.parse(leftMessage.sentAt) - Date.parse(rightMessage.sentAt)
  );
}

async function appendingPlazaDevvitOnlineChatMessage(
  roomScope: string,
  message: PlazaDevvitOnlineChatMessage
): Promise<void> {
  const chatKey = buildingPlazaDevvitOnlineChatRedisKey(roomScope);
  const messageId = `${message.userId}:${message.sentAt}`;

  await redis.hSet(chatKey, {
    [messageId]: JSON.stringify(message),
  });
  await redis.expire(chatKey, PLAZA_DEVVIT_ONLINE_CHAT_REDIS_TTL_SECONDS);

  const rawMessagesById = await redis.hGetAll(chatKey);
  const messageIds = Object.keys(rawMessagesById);

  if (messageIds.length <= PLAZA_DEVVIT_ONLINE_CHAT_REDIS_MAX_MESSAGES) {
    return;
  }

  const sortedMessageIds = messageIds.sort((leftId, rightId) => {
    const leftSentAt = rawMessagesById[leftId]
      ? Date.parse(
          parsingPlazaDevvitOnlineChatMessage(rawMessagesById[leftId])
            ?.sentAt ?? leftId
        )
      : 0;
    const rightSentAt = rawMessagesById[rightId]
      ? Date.parse(
          parsingPlazaDevvitOnlineChatMessage(rawMessagesById[rightId])
            ?.sentAt ?? rightId
        )
      : 0;

    return leftSentAt - rightSentAt;
  });

  const staleMessageIds = sortedMessageIds.slice(
    0,
    sortedMessageIds.length - PLAZA_DEVVIT_ONLINE_CHAT_REDIS_MAX_MESSAGES
  );

  if (staleMessageIds.length > 0) {
    await redis.hDel(chatKey, staleMessageIds);
  }
}

function parsingPlazaDevvitOnlineChatTypingRequest(
  body: unknown
): PlazaDevvitOnlineChatTypingRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<PlazaDevvitOnlineChatTypingRequest>;

  if (
    typeof payload.isTyping !== 'boolean' ||
    typeof payload.displayName !== 'string' ||
    typeof payload.gridX !== 'number' ||
    typeof payload.gridY !== 'number'
  ) {
    return null;
  }

  return {
    isTyping: payload.isTyping,
    displayName: payload.displayName,
    gridX: payload.gridX,
    gridY: payload.gridY,
  };
}

function parsingPlazaDevvitOnlineTypingUser(
  rawTypingUser: string
): PlazaDevvitOnlineTypingUser | null {
  try {
    const parsedTypingUser = JSON.parse(
      rawTypingUser
    ) as Partial<PlazaDevvitOnlineTypingUser>;

    if (
      typeof parsedTypingUser.userId !== 'string' ||
      typeof parsedTypingUser.displayName !== 'string' ||
      typeof parsedTypingUser.gridX !== 'number' ||
      typeof parsedTypingUser.gridY !== 'number' ||
      typeof parsedTypingUser.updatedAt !== 'string'
    ) {
      return null;
    }

    return {
      userId: parsedTypingUser.userId,
      displayName: parsedTypingUser.displayName,
      gridX: parsedTypingUser.gridX,
      gridY: parsedTypingUser.gridY,
      updatedAt: parsedTypingUser.updatedAt,
    };
  } catch {
    return null;
  }
}

async function listingPlazaDevvitOnlineTypingUsers(
  roomScope: string,
  localUserId: string | null
): Promise<PlazaDevvitOnlineTypingUser[]> {
  const typingKey = buildingPlazaDevvitOnlineTypingRedisKey(roomScope);
  const rawTypingUsersById = await redis.hGetAll(typingKey);
  const nowMs = Date.now();
  const typingUsers: PlazaDevvitOnlineTypingUser[] = [];
  const staleUserIds: string[] = [];

  for (const [typingUserId, rawTypingUser] of Object.entries(
    rawTypingUsersById
  )) {
    const parsedTypingUser = parsingPlazaDevvitOnlineTypingUser(rawTypingUser);

    if (!parsedTypingUser) {
      staleUserIds.push(typingUserId);
      continue;
    }

    if (
      nowMs - Date.parse(parsedTypingUser.updatedAt) >
      PLAZA_DEVVIT_ONLINE_TYPING_EXPIRY_MS
    ) {
      staleUserIds.push(typingUserId);
      continue;
    }

    if (localUserId !== null && parsedTypingUser.userId === localUserId) {
      continue;
    }

    typingUsers.push(parsedTypingUser);
  }

  if (staleUserIds.length > 0) {
    await redis.hDel(typingKey, staleUserIds);
  }

  return typingUsers;
}

async function updatingPlazaDevvitOnlineTypingUser(
  roomScope: string,
  userId: string,
  typingPayload: PlazaDevvitOnlineChatTypingRequest
): Promise<void> {
  const typingKey = buildingPlazaDevvitOnlineTypingRedisKey(roomScope);

  if (!typingPayload.isTyping) {
    await redis.hDel(typingKey, [userId]);
    return;
  }

  const typingUser: PlazaDevvitOnlineTypingUser = {
    userId,
    displayName: typingPayload.displayName.trim().slice(0, 32) || 'Player',
    gridX: typingPayload.gridX,
    gridY: typingPayload.gridY,
    updatedAt: new Date().toISOString(),
  };

  await redis.hSet(typingKey, {
    [userId]: JSON.stringify(typingUser),
  });
  await redis.expire(typingKey, PLAZA_DEVVIT_ONLINE_CHAT_REDIS_TTL_SECONDS);
}

export const plazaOnline = new Hono();

plazaOnline.get('/rooms', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineRoomsResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to browse plaza rooms.',
      },
      401
    );
  }

  const roomIds = await listingPlazaDevvitOnlineRoomIds();
  const rooms: PlazaDevvitOnlineRoomListingEntry[] = [];

  for (const roomId of roomIds) {
    const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
    const participantCount =
      await countingPlazaDevvitOnlineParticipants(roomScope);
    const entry = await buildingPlazaDevvitOnlineRoomListingEntry(
      roomId,
      participantCount
    );

    if (!entry || !checkingPlazaDevvitOnlineRoomIsPublicBrowseable(entry)) {
      continue;
    }

    rooms.push(entry);
  }

  rooms.sort((left, right) =>
    left.displayName.localeCompare(right.displayName)
  );

  return c.json<PlazaDevvitOnlineRoomsResponse>({
    type: 'rooms',
    rooms,
  });
});

plazaOnline.get('/rooms/mine', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineRoomsResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to continue plaza worlds.',
      },
      401
    );
  }

  const roomIds = await listingPlazaDevvitOnlineUserRoomIds(userId);
  const rooms: PlazaDevvitOnlineRoomListingEntry[] = [];

  for (const roomId of roomIds) {
    const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
    const participantCount =
      await countingPlazaDevvitOnlineParticipants(roomScope);
    const entry = await buildingPlazaDevvitOnlineRoomListingEntry(
      roomId,
      participantCount
    );

    if (!entry) {
      continue;
    }

    rooms.push(entry);
  }

  rooms.sort((left, right) =>
    left.displayName.localeCompare(right.displayName)
  );

  return c.json<PlazaDevvitOnlineRoomsResponse>({
    type: 'rooms',
    rooms,
  });
});

plazaOnline.get('/rooms/hosted', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineHostedRoomResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view your hosted world.',
      },
      401
    );
  }

  const hostedMeta = await loadingPlazaDevvitOnlineHostedRoomMeta(userId);

  if (!hostedMeta) {
    return c.json<PlazaDevvitOnlineHostedRoomResponse>({
      type: 'hosted',
      room: null,
    });
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(hostedMeta.roomId);
  const participantCount =
    await countingPlazaDevvitOnlineParticipants(roomScope);
  const entry = await buildingPlazaDevvitOnlineRoomListingEntry(
    hostedMeta.roomId,
    participantCount
  );

  return c.json<PlazaDevvitOnlineHostedRoomResponse>({
    type: 'hosted',
    room: entry,
  });
});

plazaOnline.delete('/rooms', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineDeleteRoomResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to delete a plaza world.',
      },
      401
    );
  }

  const roomId = parsingPlazaDevvitOnlineRoomIdFromQuery(c.req.query('room'));

  if (!roomId) {
    return c.json<PlazaDevvitOnlineDeleteRoomResponse>(
      {
        type: 'error',
        message: 'Missing or invalid plaza room id.',
      },
      400
    );
  }

  const deleteResult = await deletingPlazaDevvitOnlineRoom(roomId, userId);

  if (!deleteResult.ok) {
    return c.json<PlazaDevvitOnlineDeleteRoomResponse>(
      {
        type: 'error',
        message: deleteResult.message,
      },
      403
    );
  }

  return c.json<PlazaDevvitOnlineDeleteRoomResponse>({
    type: 'deleted',
    roomId,
  });
});

plazaOnline.post('/rooms/kick', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineKickPlayerResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to kick travelers.',
      },
      401
    );
  }

  const roomId = parsingPlazaDevvitOnlineRoomIdFromQuery(c.req.query('room'));

  if (!roomId) {
    return c.json<PlazaDevvitOnlineKickPlayerResponse>(
      {
        type: 'error',
        message: 'Missing or invalid plaza room id.',
      },
      400
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const targetUserId =
    body &&
    typeof body === 'object' &&
    'targetUserId' in body &&
    typeof (body as PlazaDevvitOnlineKickPlayerRequest).targetUserId ===
      'string'
      ? (body as PlazaDevvitOnlineKickPlayerRequest).targetUserId.trim()
      : '';

  if (!targetUserId) {
    return c.json<PlazaDevvitOnlineKickPlayerResponse>(
      {
        type: 'error',
        message: 'Missing traveler to kick.',
      },
      400
    );
  }

  const kickResult = await kickingPlazaDevvitOnlineRoomPlayer(
    roomId,
    userId,
    targetUserId
  );

  if (!kickResult.ok) {
    return c.json<PlazaDevvitOnlineKickPlayerResponse>(
      {
        type: 'error',
        message: kickResult.message,
      },
      403
    );
  }

  return c.json<PlazaDevvitOnlineKickPlayerResponse>({
    type: 'kicked',
    targetUserId,
  });
});

plazaOnline.get('/rooms/lookup', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineLookupRoomResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to look up plaza worlds.',
      },
      401
    );
  }

  const rawName = c.req.query('name') ?? '';

  if (!rawName.trim()) {
    return c.json<PlazaDevvitOnlineLookupRoomResponse>(
      {
        type: 'error',
        message: 'Enter a world name to join.',
      },
      400
    );
  }

  const meta = await lookingUpPlazaDevvitOnlineRoomByName(rawName);

  if (!meta) {
    return c.json<PlazaDevvitOnlineLookupRoomResponse>(
      {
        type: 'error',
        message: 'No world found with that name.',
      },
      404
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(meta.roomId);
  const participantCount =
    await countingPlazaDevvitOnlineParticipants(roomScope);

  return c.json<PlazaDevvitOnlineLookupRoomResponse>({
    type: 'room',
    roomId: meta.roomId,
    displayName: meta.displayName,
    maxPlayers: meta.maxPlayers,
    isPrivate: meta.isPrivate,
    participantCount,
    isFull: participantCount >= meta.maxPlayers,
  });
});

plazaOnline.post('/rooms', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineCreateRoomResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to create a plaza world.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const createRequest = parsingPlazaDevvitOnlineCreateRoomRequest(body);

  if (!createRequest) {
    return c.json<PlazaDevvitOnlineCreateRoomResponse>(
      {
        type: 'error',
        message: 'Invalid create-world payload.',
      },
      400
    );
  }

  const createResult = await creatingPlazaDevvitOnlineRoom({
    name: createRequest.name,
    maxPlayers: createRequest.maxPlayers,
    isPrivate: createRequest.isPrivate,
    createdBy: userId,
  });

  if (!createResult.ok) {
    return c.json<PlazaDevvitOnlineCreateRoomResponse>(
      {
        type: 'error',
        message: createResult.message,
      },
      409
    );
  }

  return c.json<PlazaDevvitOnlineCreateRoomResponse>({
    type: 'created',
    roomId: createResult.meta.roomId,
    displayName: createResult.meta.displayName,
    maxPlayers: createResult.meta.maxPlayers,
    isPrivate: createResult.meta.isPrivate,
  });
});

plazaOnline.post('/sync', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to join the plaza.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const syncPayload = parsingPlazaDevvitOnlineSyncRequest(body);

  if (!syncPayload) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Invalid plaza sync payload.',
      },
      400
    );
  }

  const roomId = parsingPlazaDevvitOnlineRoomIdFromQuery(c.req.query('room'));

  if (!roomId) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Missing or invalid plaza room id.',
      },
      400
    );
  }

  const roomMeta = await loadingPlazaDevvitOnlineRoomMeta(roomId);

  if (!roomMeta) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'That plaza world no longer exists.',
      },
      404
    );
  }

  if (await checkingPlazaDevvitOnlineRoomUserIsKicked(roomId, userId)) {
    return c.json<PlazaDevvitOnlineSyncResponse>(
      {
        type: 'error',
        message: 'You were kicked from this world.',
        isKicked: true,
      },
      403
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, userId);
  const isExistingPlayer = (await redis.get(playerKey)) !== null;

  if (!isExistingPlayer) {
    const participantCount =
      await countingPlazaDevvitOnlineParticipants(roomScope);

    if (participantCount >= roomMeta.maxPlayers) {
      return c.json<PlazaDevvitOnlineSyncResponse>(
        {
          type: 'error',
          message: `This plaza is full (${roomMeta.maxPlayers} travelers max). Try again in a moment.`,
          isRoomFull: true,
        },
        409
      );
    }
  }

  const playerSnapshot: PlazaDevvitOnlinePlayerSnapshot = {
    userId,
    ...syncPayload,
    updatedAt: new Date().toISOString(),
  };

  await redis.set(playerKey, JSON.stringify(playerSnapshot));
  await redis.expire(playerKey, PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS);
  await redis.hSet(rosterKey, { [userId]: playerSnapshot.updatedAt });
  await redis.expire(rosterKey, PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS * 2);
  await recordingPlazaDevvitOnlineRoomAlumni(roomId, userId);

  const participantCount =
    await countingPlazaDevvitOnlineParticipants(roomScope);

  return c.json<PlazaDevvitOnlineSyncResponse>({
    type: 'sync',
    participantCount,
    maxPlayers: roomMeta.maxPlayers,
    roomId: roomMeta.roomId,
    displayName: roomMeta.displayName,
    createdBy: roomMeta.createdBy,
  });
});

plazaOnline.get('/players', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to join the plaza.',
      },
      401
    );
  }

  const roomId = parsingPlazaDevvitOnlineRoomIdFromQuery(c.req.query('room'));

  if (!roomId) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Missing or invalid plaza room id.',
      },
      400
    );
  }

  const roomMeta = await loadingPlazaDevvitOnlineRoomMeta(roomId);

  if (!roomMeta) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'That plaza world no longer exists.',
      },
      404
    );
  }

  if (await checkingPlazaDevvitOnlineRoomUserIsKicked(roomId, userId)) {
    return c.json<PlazaDevvitOnlinePlayersResponse>(
      {
        type: 'error',
        message: 'You were kicked from this world.',
        isKicked: true,
      },
      403
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
  const remotePlayers = await listingPlazaDevvitOnlinePlayers(
    roomScope,
    userId
  );
  const participantCount =
    await countingPlazaDevvitOnlineParticipants(roomScope);

  return c.json<PlazaDevvitOnlinePlayersResponse>({
    type: 'players',
    players: remotePlayers,
    participantCount,
    maxPlayers: roomMeta.maxPlayers,
    roomId: roomMeta.roomId,
    displayName: roomMeta.displayName,
    createdBy: roomMeta.createdBy,
  });
});

plazaOnline.get('/chat', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineChatPollResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to use plaza chat.',
      },
      401
    );
  }

  const roomId = parsingPlazaDevvitOnlineRoomIdFromQuery(c.req.query('room'));

  if (!roomId) {
    return c.json<PlazaDevvitOnlineChatPollResponse>(
      {
        type: 'error',
        message: 'Missing or invalid plaza room id.',
      },
      400
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
  const messages = await listingPlazaDevvitOnlineChatMessages(roomScope);
  const typingUsers = await listingPlazaDevvitOnlineTypingUsers(
    roomScope,
    userId
  );

  return c.json<PlazaDevvitOnlineChatPollResponse>({
    type: 'messages',
    messages,
    typingUsers,
  });
});

plazaOnline.post('/chat', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineChatSendResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to use plaza chat.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const chatPayload = parsingPlazaDevvitOnlineChatSendRequest(body);

  if (!chatPayload) {
    return c.json<PlazaDevvitOnlineChatSendResponse>(
      {
        type: 'error',
        message: 'Invalid chat payload.',
      },
      400
    );
  }

  const sanitizedMessage = sanitizingPlazaDevvitOnlineChatMessage(
    chatPayload.message
  );

  if (!sanitizedMessage) {
    return c.json<PlazaDevvitOnlineChatSendResponse>(
      {
        type: 'error',
        message: 'Message cannot be empty.',
      },
      400
    );
  }

  const roomId = parsingPlazaDevvitOnlineRoomIdFromQuery(c.req.query('room'));

  if (!roomId) {
    return c.json<PlazaDevvitOnlineChatSendResponse>(
      {
        type: 'error',
        message: 'Missing or invalid plaza room id.',
      },
      400
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
  const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, userId);
  const isActivePlayer = (await redis.get(playerKey)) !== null;

  if (!isActivePlayer) {
    return c.json<PlazaDevvitOnlineChatSendResponse>(
      {
        type: 'error',
        message: 'Join the plaza before sending chat messages.',
      },
      409
    );
  }

  const chatMessage: PlazaDevvitOnlineChatMessage = {
    userId,
    displayName: chatPayload.displayName.trim().slice(0, 32) || 'Player',
    message: sanitizedMessage,
    sentAt: new Date().toISOString(),
    gridX: chatPayload.gridX,
    gridY: chatPayload.gridY,
  };

  await appendingPlazaDevvitOnlineChatMessage(roomScope, chatMessage);
  await redis.hDel(buildingPlazaDevvitOnlineTypingRedisKey(roomScope), [
    userId,
  ]);

  return c.json<PlazaDevvitOnlineChatSendResponse>({
    type: 'sent',
    message: chatMessage,
  });
});

plazaOnline.post('/chat/typing', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to use plaza chat.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const typingPayload = parsingPlazaDevvitOnlineChatTypingRequest(body);

  if (!typingPayload) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Invalid typing payload.',
      },
      400
    );
  }

  const roomId = parsingPlazaDevvitOnlineRoomIdFromQuery(c.req.query('room'));

  if (!roomId) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Missing or invalid plaza room id.',
      },
      400
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomId);
  const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, userId);
  const isActivePlayer = (await redis.get(playerKey)) !== null;

  if (!isActivePlayer) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Join the plaza before using chat.',
      },
      409
    );
  }

  await updatingPlazaDevvitOnlineTypingUser(roomScope, userId, typingPayload);

  return c.json({ type: 'typing' as const });
});
