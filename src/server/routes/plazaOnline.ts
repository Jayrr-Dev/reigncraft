import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import {
  PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
  PLAZA_DEVVIT_ONLINE_PLAYER_TTL_SECONDS,
  type PlazaDevvitOnlinePlayerSnapshot,
  type PlazaDevvitOnlinePlayersResponse,
  type PlazaDevvitOnlineSyncRequest,
  type PlazaDevvitOnlineSyncResponse,
} from '../../shared/plazaDevvitOnline';
import {
  buildingPlazaDevvitOnlinePlayerRedisKey,
  buildingPlazaDevvitOnlineRosterRedisKey,
} from '../domains/buildingPlazaDevvitOnlineRedisKeys';
import { resolvingPlazaDevvitOnlineRoomScope } from '../domains/resolvingPlazaDevvitOnlineRoomScope';

type PlazaDevvitOnlineErrorResponse = {
  type: 'error';
  message: string;
  isRoomFull?: boolean;
};

function parsingPlazaDevvitOnlineSyncRequest(
  body: unknown,
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
    typeof payload.jumpArcPeakScreenPx !== 'number'
  ) {
    return null;
  }

  return {
    displayName: payload.displayName,
    avatarUrl:
      typeof payload.avatarUrl === 'string' ? payload.avatarUrl : null,
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
  localUserId: string | null,
): Promise<PlazaDevvitOnlinePlayerSnapshot[]> {
  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const rosterUserIds = await redis.hKeys(rosterKey);
  const players: PlazaDevvitOnlinePlayerSnapshot[] = [];

  for (const userId of rosterUserIds) {
    const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, userId);
    const rawPlayer = await redis.get(playerKey);

    if (!rawPlayer) {
      await redis.hDel(rosterKey, [userId]);
      continue;
    }

    try {
      const parsedPlayer = JSON.parse(rawPlayer) as PlazaDevvitOnlinePlayerSnapshot;

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
  roomScope: string,
): Promise<number> {
  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const rosterUserIds = await redis.hKeys(rosterKey);
  let participantCount = 0;

  for (const userId of rosterUserIds) {
    const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, userId);
    const rawPlayer = await redis.get(playerKey);

    if (!rawPlayer) {
      await redis.hDel(rosterKey, [userId]);
      continue;
    }

    participantCount += 1;
  }

  return participantCount;
}

export const plazaOnline = new Hono();

plazaOnline.post('/sync', async (c) => {
  const userId = await resolvingPlazaDevvitOnlineUserId();

  if (!userId) {
    return c.json<PlazaDevvitOnlineErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to join the plaza.',
      },
      401,
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
      400,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const rosterKey = buildingPlazaDevvitOnlineRosterRedisKey(roomScope);
  const playerKey = buildingPlazaDevvitOnlinePlayerRedisKey(roomScope, userId);
  const isExistingPlayer = (await redis.get(playerKey)) !== null;

  if (!isExistingPlayer) {
    const participantCount = await countingPlazaDevvitOnlineParticipants(roomScope);

    if (participantCount >= PLAZA_DEVVIT_ONLINE_MAX_PLAYERS) {
      return c.json<PlazaDevvitOnlineSyncResponse>(
        {
          type: 'error',
          message: 'This plaza is full (3 players max). Try again in a moment.',
          isRoomFull: true,
        },
        409,
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

  const participantCount = await countingPlazaDevvitOnlineParticipants(roomScope);

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
      401,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const remotePlayers = await listingPlazaDevvitOnlinePlayers(roomScope, userId);
  const participantCount = await countingPlazaDevvitOnlineParticipants(roomScope);

  return c.json<PlazaDevvitOnlinePlayersResponse>({
    type: 'players',
    players: remotePlayers,
    participantCount,
    maxPlayers: PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
  });
});
