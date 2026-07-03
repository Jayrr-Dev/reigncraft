import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import { resolvingWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/resolvingWorldBuildingPlotOwnerLimits";
import { fetchingWorldBuildingDevvitOwnerLimits } from "@/components/world/building/repositories/callingWorldBuildingDevvitApi";
import { WORLD_BUILDING_DEVVIT_OWNER_LIMITS_API_PATH } from "../../../../shared/worldBuildingDevvit";

/**
 * Loads per-user plot and tile claim limits from the Devvit server.
 *
 * @module components/world/building/repositories/fetchingWorldBuildingPlotOwnerLimitsByUserId
 */

/**
 * Fetches plot limits for one auth user id.
 *
 * @param userId - Auth user id.
 */
export async function fetchingWorldBuildingPlotOwnerLimitsByUserId(
  userId: string,
): Promise<DefiningWorldBuildingPlotOwnerLimits> {
  if (userId.length === 0) {
    return resolvingWorldBuildingPlotOwnerLimits(null);
  }

  const limits = await fetchingWorldBuildingDevvitOwnerLimits(
    WORLD_BUILDING_DEVVIT_OWNER_LIMITS_API_PATH,
  );

  return resolvingWorldBuildingPlotOwnerLimits({
    maxOwnedPlotCount: limits.maxOwnedPlotCount,
    maxTileClaimCount: limits.maxTileClaimCount,
    maxTemporaryTileCount: limits.maxTemporaryTileCount,
  });
}
