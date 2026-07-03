import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  parsingWorldBuildingPlotRow,
} from "@/components/world/building/repositories/parsingWorldBuildingPlotRow";
import { fetchingWorldBuildingDevvitPlotsPayload } from "@/components/world/building/repositories/callingWorldBuildingDevvitApi";
import { WORLD_BUILDING_DEVVIT_PLOTS_REGISTRY_API_PATH } from "../../../../shared/worldBuildingDevvit";

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
  const payload = await fetchingWorldBuildingDevvitPlotsPayload(
    WORLD_BUILDING_DEVVIT_PLOTS_REGISTRY_API_PATH,
  );

  return payload.plots.map((plotRow) =>
    parsingWorldBuildingPlotRow(plotRow, []),
  );
}
