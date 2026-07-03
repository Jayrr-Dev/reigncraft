import {
  DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_OWNER_PLOT_COUNT,
  DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TEMPORARY_TILE_COUNT,
  DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TILE_CLAIM_COUNT,
} from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";

/**
 * Resolves per-user plot limits with app-wide defaults as fallback.
 *
 * @module components/world/building/domains/resolvingWorldBuildingPlotOwnerLimits
 */

/** Partial plot limit row from `user_profile`. */
export interface ResolvingWorldBuildingPlotOwnerLimitsInput {
  maxOwnedPlotCount?: number | null;
  maxTileClaimCount?: number | null;
  maxTemporaryTileCount?: number | null;
}

/**
 * Normalizes nullable profile limits into a complete limit model.
 *
 * @param limits - Partial limits from storage, if any.
 */
export function resolvingWorldBuildingPlotOwnerLimits(
  limits: ResolvingWorldBuildingPlotOwnerLimitsInput | null | undefined,
): DefiningWorldBuildingPlotOwnerLimits {
  const maxOwnedPlotCount = limits?.maxOwnedPlotCount;
  const maxTileClaimCount = limits?.maxTileClaimCount;
  const maxTemporaryTileCount = limits?.maxTemporaryTileCount;

  return {
    maxOwnedPlotCount:
      typeof maxOwnedPlotCount === "number" && maxOwnedPlotCount > 0
        ? maxOwnedPlotCount
        : DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_OWNER_PLOT_COUNT,
    maxTileClaimCount:
      typeof maxTileClaimCount === "number" && maxTileClaimCount > 0
        ? maxTileClaimCount
        : DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TILE_CLAIM_COUNT,
    maxTemporaryTileCount:
      typeof maxTemporaryTileCount === "number" && maxTemporaryTileCount > 0
        ? maxTemporaryTileCount
        : DEFINING_WORLD_BUILDING_PLOT_DEFAULT_MAX_TEMPORARY_TILE_COUNT,
  };
}
