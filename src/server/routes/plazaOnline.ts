import { context, reddit, redis } from '@devvit/web/server';
import { Hono } from 'hono';
import {
  PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
  PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS,
  type PlazaDevvitOnlinePlayerSnapshot,
  type PlazaDevvitOnlinePlayersResponse,
  type PlazaDevvitOnlineProjectileSpawnEvent,
  type PlazaDevvitOnlineRoomListingEntry,
  type PlazaDevvitOnlineRoomsResponse,
  type PlazaDevvitOnlineSyncRequest,
  type PlazaDevvitOnlineSyncResponse,
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
import { PLAZA_MULTIPLAYER_BROWSEABLE_ROOM_COUNT } from '../../shared/plazaGameSession';
import {
  buildingPlazaDevvitOnlineChatRedisKey,
  buildingPlazaDevvitOnlinePlayerRedisKey,
  buildingPlazaDevvitOnlineRosterRedisKey,
  buildingPlazaDevvitOnlineTypingRedisKey,
} from '../domains/buildingPlazaDevvitOnlineRedisKeys';
import { resolvingPlazaDevvitOnlineRoomScope } from '../domains/resolvingPlazaDevvitOnlineRoomScope';

type PlazaDevvitOnlineErrorResponse = {
  type: 'error';
  message: string;
  isRoomFull?: boolean;
};

function parsingPlazaDevvitOnlineRoomIndexFromQuery(
  rawRoomIndex: string | undefined
): number {
  if (!rawRoomIndex) {
    return 1;
  }

  const parsedRoomIndex = Number.parseInt(rawRoomIndex, 10);

  if (
    !Number.isFinite(parsedRoomIndex) ||
    parsedRoomIndex < 1 ||
    parsedRoomIndex > PLAZA_MULTIPLAYER_BROWSEABLE_ROOM_COUNT
  ) {
    return 1;
  }

  return parsedRoomIndex;
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

  const rooms: PlazaDevvitOnlineRoomListingEntry[] = [];

  for (
    let roomIndex = 1;
    roomIndex <= PLAZA_MULTIPLAYER_BROWSEABLE_ROOM_COUNT;
    roomIndex += 1
  ) {
    const roomScope = resolvingPlazaDevvitOnlineRoomScope(roomIndex);
    const participantCount =
      await countingPlazaDevvitOnlineParticipants(roomScope);

    rooms.push({
      roomIndex,
      participantCount,
      maxPlayers: PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
      isFull: participantCount >= PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
    });
  }

  return c.json<PlazaDevvitOnlineRoomsResponse>({
    type: 'rooms',
    rooms,
    maxPlayers: PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
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

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(
    parsingPlazaDevvitOnlineRoomIndexFromQuery(c.req.query('room'))
  );
  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, userId);
  const isExistingPlayer = (await redis.get(playerKey)) !== null;

  if (!isExistingPlayer) {
    const participantCount =
      await countingPlazaDevvitOnlineParticipants(roomScope);

    if (participantCount >= PLAZA_DEVVIT_ONLINE_MAX_PLAYERS) {
      return c.json<PlazaDevvitOnlineSyncResponse>(
        {
          type: 'error',
          message: 'This plaza is full (3 players max). Try again in a moment.',
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

  const participantCount =
    await countingPlazaDevvitOnlineParticipants(roomScope);

  return c.json<PlazaDevvitOnlineSyncResponse>({
    type: 'sync',
    participantCount,
    maxPlayers: PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
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

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(
    parsingPlazaDevvitOnlineRoomIndexFromQuery(c.req.query('room'))
  );
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
    maxPlayers: PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
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

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(
    parsingPlazaDevvitOnlineRoomIndexFromQuery(c.req.query('room'))
  );
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

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(
    parsingPlazaDevvitOnlineRoomIndexFromQuery(c.req.query('room'))
  );
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

  const roomScope = resolvingPlazaDevvitOnlineRoomScope(
    parsingPlazaDevvitOnlineRoomIndexFromQuery(c.req.query('room'))
  );
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
