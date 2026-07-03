import {
  DEFINING_WORLD_PLAZA_GIPHY_API_BASE_URL,
} from "@/components/world/domains/definingWorldPlazaRoomChatGifConstants";
export interface FetchingWorldPlazaGiphySearchResult {
  /** GIPHY media id. */
  id: string;
  /** Human-readable title for accessibility. */
  title: string;
  /** Fixed-height preview URL for the picker grid. */
  previewUrl: string;
  /** Original aspect ratio (width / height). */
  aspectRatio: number;
}

/** GIPHY API gif object subset used by search parsing. */
interface FetchingWorldPlazaGiphyApiGif {
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
}

/** GIPHY API list response subset. */
interface FetchingWorldPlazaGiphyApiListResponse {
  data?: FetchingWorldPlazaGiphyApiGif[];
}

/**
 * Maps one GIPHY API gif object to a plaza search result.
 *
 * @param gif - Raw GIPHY API gif entry.
 */
function mappingWorldPlazaGiphyApiGifToSearchResult(
  gif: FetchingWorldPlazaGiphyApiGif,
): FetchingWorldPlazaGiphySearchResult | null {
  const id = gif.id?.trim();
  const previewImage =
    gif.images?.fixed_height_small ?? gif.images?.downsized;
  const previewUrl = previewImage?.url?.trim();

  if (!id || !previewUrl) {
    return null;
  }

  const width = Number(previewImage?.width ?? 0);
  const height = Number(previewImage?.height ?? 0);
  const aspectRatio =
    width > 0 && height > 0 ? width / height : 1;

  return {
    id,
    title: gif.title?.trim() || "GIF",
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
): Promise<FetchingWorldPlazaGiphySearchResult[]> {
  const trimmedQuery = query.trim();
  const endpoint = trimmedQuery
    ? `${DEFINING_WORLD_PLAZA_GIPHY_API_BASE_URL}/search?${new URLSearchParams({
        api_key: apiKey,
        q: trimmedQuery,
        limit: String(limit),
        rating,
      }).toString()}`
    : `${DEFINING_WORLD_PLAZA_GIPHY_API_BASE_URL}/trending?${new URLSearchParams({
        api_key: apiKey,
        limit: String(limit),
        rating,
      }).toString()}`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`GIPHY request failed (${response.status}).`);
  }

  const payload = (await response.json()) as FetchingWorldPlazaGiphyApiListResponse;

  return (payload.data ?? [])
    .map(mappingWorldPlazaGiphyApiGifToSearchResult)
    .filter(
      (result): result is FetchingWorldPlazaGiphySearchResult =>
        result !== null,
    );
}
