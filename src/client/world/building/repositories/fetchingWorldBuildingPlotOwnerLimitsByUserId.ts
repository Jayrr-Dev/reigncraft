import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import { resolvingWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/resolvingWorldBuildingPlotOwnerLimits";
import { createClient } from "@/lib/supabase/client";

/**
 * Loads per-user plot and tile claim limits from `user_profile`.
 *
 * @module components/world/building/repositories/fetchingWorldBuildingPlotOwnerLimitsByUserId
 */

/** Selected limit columns from `user_profile`. */
interface FetchingWorldBuildingPlotOwnerLimitsRow {
  world_plot_max_count: number | null;
  world_tile_claim_max_count: number | null;
  world_temp_tile_max_count: number | null;
}

/**
 * Fetches plot limits for one auth user id.
 *
 * @param userId - Auth user id.
 */
export async function fetchingWorldBuildingPlotOwnerLimitsByUserId(
  userId: string,
): Promise<DefiningWorldBuildingPlotOwnerLimits> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_profile")
    .select(
      "world_plot_max_count, world_tile_claim_max_count, world_temp_tile_max_count",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const limitsRow = data as FetchingWorldBuildingPlotOwnerLimitsRow | null;

  return resolvingWorldBuildingPlotOwnerLimits({
    maxOwnedPlotCount: limitsRow?.world_plot_max_count,
    maxTileClaimCount: limitsRow?.world_tile_claim_max_count,
    maxTemporaryTileCount: limitsRow?.world_temp_tile_max_count,
  });
}
