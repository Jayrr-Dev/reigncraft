import { redis } from '@devvit/web/server';
import { Hono } from 'hono';
import { parsingPlazaSinglePlayerSavePetRoster } from '../../shared/parsingPlazaSinglePlayerSavePetRoster';
import type {
  PlazaPetsRosterResponse,
  PlazaPetsRosterUpdateRequest,
  PlazaPetsSaveResponse,
} from '../../shared/plazaPetsDevvit';
import type { PlazaSinglePlayerSavePetRoster } from '../../shared/plazaSinglePlayerSavesDevvit';
import { buildingPlazaPetsMultiplayerRosterRedisKey } from '../domains/buildingPlazaPetsRedisKeys';
import { resolvingDevvitRedditUserId } from '../domains/resolvingDevvitRedditUserId';

function parsingPersistedPetsRoster(
  rawValue: string
): PlazaSinglePlayerSavePetRoster | null {
  try {
    const parsed = JSON.parse(rawValue);
    const { roster } = parsingPlazaSinglePlayerSavePetRoster(parsed);

    return roster.pets.length > 0 ? roster : null;
  } catch {
    return null;
  }
}

function parsingPetsRosterUpdateBody(
  body: unknown
): PlazaPetsRosterUpdateRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<PlazaPetsRosterUpdateRequest>;

  if (
    !payload.roster ||
    typeof payload.roster !== 'object' ||
    Array.isArray(payload.roster)
  ) {
    return null;
  }

  const { roster } = parsingPlazaSinglePlayerSavePetRoster(payload.roster);

  return { roster };
}

export const plazaPets = new Hono();

plazaPets.get('/', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<PlazaPetsRosterResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to load your companion roster.',
      },
      401
    );
  }

  const rosterKey = buildingPlazaPetsMultiplayerRosterRedisKey(userId);
  const rawValue = await redis.get(rosterKey);
  const roster = rawValue ? parsingPersistedPetsRoster(rawValue) : null;

  return c.json<PlazaPetsRosterResponse>({
    type: 'pet-roster',
    roster,
  });
});

plazaPets.put('/', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<PlazaPetsSaveResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to save your companion roster.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const update = parsingPetsRosterUpdateBody(body);

  if (!update) {
    return c.json<PlazaPetsSaveResponse>(
      {
        type: 'error',
        message: 'Invalid companion roster payload.',
      },
      400
    );
  }

  const rosterKey = buildingPlazaPetsMultiplayerRosterRedisKey(userId);

  if (update.roster.pets.length === 0) {
    await redis.del(rosterKey);
  } else {
    await redis.set(rosterKey, JSON.stringify(update.roster));
  }

  return c.json<PlazaPetsSaveResponse>({
    type: 'saved',
    updatedAtMs: Date.now(),
  });
});
