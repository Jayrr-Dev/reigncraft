import {
  DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT,
} from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  parsingWorldBuildingPlotRow,
} from "@/components/world/building/repositories/parsingWorldBuildingPlotRow";
import {
  checkingWorldBuildingDevvitBlockRowIsSession,
  hydratingWorldBuildingSessionBlocksPlot,
} from "@/components/world/building/domains/hydratingWorldBuildingSessionBlocksPlot";
import {
  parsingWorldBuildingPlacedBlockRow,
  type ParsingWorldBuildingPlacedBlockRow,
} from "@/components/world/building/repositories/parsingWorldBuildingPlacedBlockRow";
import { fetchingWorldBuildingDevvitPlotsPayload } from "@/components/world/building/repositories/callingWorldBuildingDevvitApi";
import {
  WORLD_BUILDING_DEVVIT_PLOTS_BOUNDS_API_PATH,
  WORLD_BUILDING_DEVVIT_PLOTS_OWNED_API_PATH,
} from "../../../../shared/worldBuildingDevvit";

/**
 * Loads plots and placed blocks overlapping a tile bounds window.
 *
 * @module components/world/building/repositories/fetchingWorldBuildingPlotsByBounds
 */

/** Tile bounds query window. */
export interface FetchingWorldBuildingPlotsByBoundsInput {
  minTileX: number;
  minTileY: number;
  maxTileX: number;
  maxTileY: number;
}

/**
 * TanStack Query key for plots in a bounds window.
 *
 * @param bounds - Tile bounds query window.
 */
export function resolvingWorldBuildingPlotsByBoundsQueryKey(
  bounds: FetchingWorldBuildingPlotsByBoundsInput,
): readonly [string, FetchingWorldBuildingPlotsByBoundsInput] {
  return [DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT, bounds];
}

function hydratingWorldBuildingPlotsFromDevvitPayload(
  payload: Awaited<ReturnType<typeof fetchingWorldBuildingDevvitPlotsPayload>>,
): DefiningWorldBuildingPlot[] {
  const blocksByPlotId = new Map<string, ParsingWorldBuildingPlacedBlockRow[]>();
  const sessionBlockRows: typeof payload.blocks = [];

  for (const blockRow of payload.blocks) {
    if (checkingWorldBuildingDevvitBlockRowIsSession(blockRow)) {
      sessionBlockRows.push(blockRow);
      continue;
    }

    const existingRows = blocksByPlotId.get(blockRow.plot_id) ?? [];
    existingRows.push(blockRow);
    blocksByPlotId.set(blockRow.plot_id, existingRows);
  }

  const plots = payload.plots.map((plotRow) =>
    parsingWorldBuildingPlotRow(plotRow, blocksByPlotId.get(plotRow.id) ?? []),
  );
  const sessionPlot = hydratingWorldBuildingSessionBlocksPlot(sessionBlockRows);

  return sessionPlot ? [...plots, sessionPlot] : plots;
}

/**
 * Fetches plots intersecting the bounds window with their placed blocks.
 *
 * @param bounds - Tile bounds query window.
 */
export async function fetchingWorldBuildingPlotsByBounds(
  bounds: FetchingWorldBuildingPlotsByBoundsInput,
): Promise<DefiningWorldBuildingPlot[]> {
  const searchParams = new URLSearchParams({
    minTileX: String(bounds.minTileX),
    minTileY: String(bounds.minTileY),
    maxTileX: String(bounds.maxTileX),
    maxTileY: String(bounds.maxTileY),
  });
  const payload = await fetchingWorldBuildingDevvitPlotsPayload(
    `${WORLD_BUILDING_DEVVIT_PLOTS_BOUNDS_API_PATH}?${searchParams.toString()}`,
  );

  return hydratingWorldBuildingPlotsFromDevvitPayload(payload);
}

/**
 * Fetches plots owned by the signed-in user.
 *
 * @param ownerUserId - Authenticated user id.
 */
export async function fetchingWorldBuildingPlotsByOwnerUserId(
  ownerUserId: string,
): Promise<DefiningWorldBuildingPlot[]> {
  if (ownerUserId.length === 0) {
    return [];
  }

  const payload = await fetchingWorldBuildingDevvitPlotsPayload(
    WORLD_BUILDING_DEVVIT_PLOTS_OWNED_API_PATH,
  );

  return hydratingWorldBuildingPlotsFromDevvitPayload(payload);
}
