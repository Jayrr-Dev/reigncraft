import { Hono } from 'hono';
import { settings } from '@devvit/web/server';
import {
  WORLD_PLAZA_GIPHY_API_KEY_ENV,
  WORLD_PLAZA_GIPHY_API_KEY_SETTING,
  WORLD_PLAZA_GIPHY_CONTENT_RATING,
  WORLD_PLAZA_GIPHY_SEARCH_DEFAULT_LIMIT,
  fetchingWorldPlazaGiphySearchResults,
  type WorldPlazaGiphySearchResult,
} from '../../shared/worldPlazaGiphySearch';

type WorldGiphySearchResponse = {
  results: WorldPlazaGiphySearchResult[];
  error?: string;
};

async function resolvingWorldPlazaGiphyApiKey(): Promise<string | null> {
  const configured = await settings.get(WORLD_PLAZA_GIPHY_API_KEY_SETTING);

  if (typeof configured === 'string' && configured.length > 0) {
    return configured;
  }

  const fromEnv = process.env[WORLD_PLAZA_GIPHY_API_KEY_ENV];

  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return fromEnv;
  }

  return null;
}

function parsingWorldPlazaGiphySearchLimit(
  rawLimit: string | undefined,
): number {
  const parsedLimit = Number(rawLimit);

  if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
    return WORLD_PLAZA_GIPHY_SEARCH_DEFAULT_LIMIT;
  }

  return Math.min(
    Math.floor(parsedLimit),
    WORLD_PLAZA_GIPHY_SEARCH_DEFAULT_LIMIT,
  );
}

export const worldGiphy = new Hono();

worldGiphy.get('/search', async (c) => {
  const apiKey = await resolvingWorldPlazaGiphyApiKey();

  if (!apiKey) {
    return c.json<WorldGiphySearchResponse>(
      { results: [], error: 'GIPHY API key is not configured.' },
      503,
    );
  }

  const query = c.req.query('q') ?? '';
  const limit = parsingWorldPlazaGiphySearchLimit(c.req.query('limit'));

  try {
    const results = await fetchingWorldPlazaGiphySearchResults(
      apiKey,
      query,
      limit,
      WORLD_PLAZA_GIPHY_CONTENT_RATING,
    );

    return c.json<WorldGiphySearchResponse>({ results });
  } catch (error) {
    console.error('GIPHY search failed:', error);

    const message =
      error instanceof Error ? error.message : 'Could not load GIFs.';

    return c.json<WorldGiphySearchResponse>(
      { results: [], error: message },
      502,
    );
  }
});
