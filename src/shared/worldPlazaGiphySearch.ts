/** Client-facing search proxy path for GIPHY results. */
export const WORLD_PLAZA_GIPHY_SEARCH_API_PATH = '/api/world/giphy/search' as const;

/** Default search result count per request. */
export const WORLD_PLAZA_GIPHY_SEARCH_DEFAULT_LIMIT = 20;

/** GIPHY content rating for plaza chat (family friendly). */
export const WORLD_PLAZA_GIPHY_CONTENT_RATING = 'g';

/** GIPHY REST API base URL. */
export const WORLD_PLAZA_GIPHY_API_BASE_URL = 'https://api.giphy.com/v1/gifs';

/** Devvit secret / local env key for the GIPHY API key. */
export const WORLD_PLAZA_GIPHY_API_KEY_SETTING = 'giphyApiKey' as const;

export const WORLD_PLAZA_GIPHY_API_KEY_ENV = 'GIPHY_API_KEY' as const;

export type WorldPlazaGiphySearchResult = {
  /** GIPHY media id. */
  id: string;
  /** Human-readable title for accessibility. */
  title: string;
  /** Fixed-height preview URL for the picker grid. */
  previewUrl: string;
  /** Original aspect ratio (width / height). */
  aspectRatio: number;
};

type WorldPlazaGiphyApiGif = {
  id?: string;
  title?: string;
  images?: {
    fixed_height_small?: {
      url?: string;
      width?: string;
      height?: string;
    };
    downsized?: {
      url?: string;
      width?: string;
      height?: string;
    };
  };
};

type WorldPlazaGiphyApiListResponse = {
  data?: WorldPlazaGiphyApiGif[];
};

function mappingWorldPlazaGiphyApiGifToSearchResult(
  gif: WorldPlazaGiphyApiGif,
): WorldPlazaGiphySearchResult | null {
  const id = gif.id?.trim();
  const previewImage =
    gif.images?.fixed_height_small ?? gif.images?.downsized;
  const previewUrl = previewImage?.url?.trim();

  if (!id || !previewUrl) {
    return null;
  }

  const width = Number(previewImage?.width ?? 0);
  const height = Number(previewImage?.height ?? 0);
  const aspectRatio = width > 0 && height > 0 ? width / height : 1;

  return {
    id,
    title: gif.title?.trim() || 'GIF',
    previewUrl,
    aspectRatio,
  };
}

/**
 * Fetches GIF search results from the GIPHY REST API.
 *
 * @param apiKey - GIPHY API key.
 * @param query - Search text; empty uses trending.
 * @param limit - Maximum results.
 * @param rating - GIPHY content rating.
 */
export async function fetchingWorldPlazaGiphySearchResults(
  apiKey: string,
  query: string,
  limit: number,
  rating: string,
): Promise<WorldPlazaGiphySearchResult[]> {
  const trimmedQuery = query.trim();
  const endpoint = trimmedQuery
    ? `${WORLD_PLAZA_GIPHY_API_BASE_URL}/search?${new URLSearchParams({
        api_key: apiKey,
        q: trimmedQuery,
        limit: String(limit),
        rating,
      }).toString()}`
    : `${WORLD_PLAZA_GIPHY_API_BASE_URL}/trending?${new URLSearchParams({
        api_key: apiKey,
        limit: String(limit),
        rating,
      }).toString()}`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`GIPHY request failed (${response.status}).`);
  }

  const payload = (await response.json()) as WorldPlazaGiphyApiListResponse;

  return (payload.data ?? [])
    .map(mappingWorldPlazaGiphyApiGifToSearchResult)
    .filter(
      (result): result is WorldPlazaGiphySearchResult => result !== null,
    );
}
