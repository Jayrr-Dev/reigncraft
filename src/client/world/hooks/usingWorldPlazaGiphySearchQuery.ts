"use client";

import {
  WORLD_PLAZA_GIPHY_SEARCH_DEFAULT_LIMIT,
  WORLD_PLAZA_GIPHY_SEARCH_API_PATH,
  type WorldPlazaGiphySearchResult,
} from '../../../shared/worldPlazaGiphySearch';
import { DEFINING_WORLD_PLAZA_GIPHY_SEARCH_QUERY_KEY } from "@/components/world/domains/definingWorldPlazaRoomChatGifConstants";
import { useQuery } from "@tanstack/react-query";

/** API response shape for `/api/world/giphy/search`. */
interface UsingWorldPlazaGiphySearchApiResponse {
  results: WorldPlazaGiphySearchResult[];
  error?: string;
}

/**
 * Fetches GIPHY search results through the server proxy route.
 *
 * @param query - Search text; empty loads trending GIFs.
 */
async function fetchingWorldPlazaGiphySearchFromApi(
  query: string,
): Promise<WorldPlazaGiphySearchResult[]> {
  const searchParams = new URLSearchParams({
    limit: String(WORLD_PLAZA_GIPHY_SEARCH_DEFAULT_LIMIT),
  });

  if (query.trim()) {
    searchParams.set("q", query.trim());
  }

  const response = await fetch(
    `${WORLD_PLAZA_GIPHY_SEARCH_API_PATH}?${searchParams.toString()}`,
  );
  const payload =
    (await response.json()) as UsingWorldPlazaGiphySearchApiResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? "Could not load GIFs.");
  }

  return payload.results ?? [];
}

export interface UsingWorldPlazaGiphySearchQueryParams {
  /** Debounced search text from the picker input. */
  searchQuery: string;
  /** When false, the query stays idle. */
  enabled: boolean;
}

/**
 * TanStack Query hook for plaza chat GIPHY search.
 */
export function usingWorldPlazaGiphySearchQuery({
  searchQuery,
  enabled,
}: UsingWorldPlazaGiphySearchQueryParams) {
  return useQuery({
    queryKey: [...DEFINING_WORLD_PLAZA_GIPHY_SEARCH_QUERY_KEY, searchQuery],
    queryFn: () => fetchingWorldPlazaGiphySearchFromApi(searchQuery),
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
