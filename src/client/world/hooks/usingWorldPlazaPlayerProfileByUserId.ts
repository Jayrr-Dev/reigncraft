"use client";

import { fetchingCommunityMemberProfileByUserIdFromApi } from "@/components/community/domains/fetchingCommunityMemberProfileByUserIdFromApi";
import { resolvingCommunityMemberProfileByUserIdQueryKey } from "@/components/community/domains/fetchingCommunityMemberProfileByUserIdFromApi";
import type { CommunityMemberProfile } from "@/components/community/domains/definingCommunityMemberProfile";
import { DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_STALE_TIME_MS } from "@/components/world/domains/definingWorldPlazaPlayerProfilePopoverConstants";
import { hasEnvVars } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

/**
 * Loads a plaza remote player's public profile when their popover opens.
 *
 * @param userId - Auth user id for the selected remote player.
 * @param isEnabled - True while the profile popover is open.
 */
export function usingWorldPlazaPlayerProfileByUserId(
  userId: string | null,
  isEnabled: boolean,
) {
  const trimmedUserId = userId?.trim() ?? "";

  return useQuery<CommunityMemberProfile | null>({
    queryKey: resolvingCommunityMemberProfileByUserIdQueryKey(trimmedUserId),
    queryFn: () => fetchingCommunityMemberProfileByUserIdFromApi(trimmedUserId),
    enabled: hasEnvVars() && isEnabled && trimmedUserId.length > 0,
    staleTime: DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_STALE_TIME_MS,
  });
}
