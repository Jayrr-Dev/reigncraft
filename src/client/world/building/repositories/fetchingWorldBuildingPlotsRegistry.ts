import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  parsingWorldBuildingPlotRow,
  type ParsingWorldBuildingPlotRow,
} from "@/components/world/building/repositories/parsingWorldBuildingPlotRow";
import { createClient } from "@/lib/supabase/client";

/**
 * Loads all claimed plots for the plaza plot registry.
 *
 * @module components/world/building/repositories/fetchingWorldBuildingPlotsRegistry
 */

/** Maximum plots returned by the registry query. */
export const FETCHING_WORLD_BUILDING_PLOTS_REGISTRY_MAX_PLOT_COUNT = 512;

/**
 * Fetches all claimed plots ordered by newest first.
 */
export async function fetchingWorldBuildingPlotsRegistry(): Promise<
  DefiningWorldBuildingPlot[]
> {
  const supabase = createClient();

  const { data: plotRows, error: plotError } = await supabase
    .from("world_plots")
    .select(
      "id, owner_id, min_tile_x, min_tile_y, max_tile_x, max_tile_y, created_at, is_temporary, expires_at",
    )
    .order("created_at", { ascending: false })
    .limit(FETCHING_WORLD_BUILDING_PLOTS_REGISTRY_MAX_PLOT_COUNT);

  if (plotError) {
    throw new Error(plotError.message);
  }

  const typedPlotRows = (plotRows ?? []) as ParsingWorldBuildingPlotRow[];

  return typedPlotRows.map((plotRow) =>
    parsingWorldBuildingPlotRow(plotRow, []),
  );
}
