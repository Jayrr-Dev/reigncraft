"use client";

import type { DefiningWorldPlazaLastPosition } from "@/components/world/domains/definingWorldPlazaLastPosition";
import {
  DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_KEY_ROOT,
  DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_STALE_TIME_MS,
} from "@/components/world/domains/definingWorldPlazaLastPositionConstants";
import { fetchingWorldPlazaLastPositionFromSupabase } from "@/components/world/repositories/fetchingWorldPlazaLastPositionFromSupabase";
import { upsertingWorldPlazaLastPositionToSupabase } from "@/components/world/repositories/upsertingWorldPlazaLastPositionToSupabase";
import { useMutation, useQuery } from "@tanstack/react-query";

/** Result from {@link usingWorldPlazaLastPositionQuery}. */
export interface UsingWorldPlazaLastPositionQueryResult {
  /** Remote last position for the active user, if any. */
  remoteLastPosition: DefiningWorldPlazaLastPosition | null;
  /** True while the initial remote load is in flight. */
  isLoadingRemoteLastPosition: boolean;
  /** Upserts the active user's remote last position. */
  upsertingRemoteLastPosition: (
    lastPosition: DefiningWorldPlazaLastPosition,
  ) => void;
}

/**
 * Loads and mutates the authenticated user's remote last plaza position.
 *
 * @param onlineUserId - Auth user id; when null the query stays disabled.
 */
export function usingWorldPlazaLastPositionQuery(
  onlineUserId: string | null,
): UsingWorldPlazaLastPositionQueryResult {
  const remoteLastPositionQuery = useQuery({
    queryKey: [DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_KEY_ROOT, onlineUserId],
    queryFn: () => fetchingWorldPlazaLastPositionFromSupabase(onlineUserId!),
    enabled: onlineUserId !== null,
    staleTime: DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_STALE_TIME_MS,
  });

  const upsertRemoteLastPositionMutation = useMutation({
    mutationFn: (lastPosition: DefiningWorldPlazaLastPosition) =>
      upsertingWorldPlazaLastPositionToSupabase(onlineUserId!, lastPosition),
  });

  return {
    remoteLastPosition: remoteLastPositionQuery.data ?? null,
    isLoadingRemoteLastPosition: remoteLastPositionQuery.isLoading,
    upsertingRemoteLastPosition: upsertRemoteLastPositionMutation.mutate,
  };
}
