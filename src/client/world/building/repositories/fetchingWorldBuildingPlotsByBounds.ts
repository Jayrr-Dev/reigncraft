import {
  DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT,
} from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  parsingWorldBuildingPlotRow,
  type ParsingWorldBuildingPlotRow,
} from "@/components/world/building/repositories/parsingWorldBuildingPlotRow";
import {
  parsingWorldBuildingPlacedBlockRow,
  type ParsingWorldBuildingPlacedBlockRow,
} from "@/components/world/building/repositories/parsingWorldBuildingPlacedBlockRow";
import { createClient } from "@/lib/supabase/client";

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

/**
 * Fetches plots intersecting the bounds window with their placed blocks.
 *
 * @param bounds - Tile bounds query window.
 */
export async function fetchingWorldBuildingPlotsByBounds(
  bounds: FetchingWorldBuildingPlotsByBoundsInput,
): Promise<DefiningWorldBuildingPlot[]> {
  const supabase = createClient();

  const { data: plotRows, error: plotError } = await supabase
    .from("world_plots")
    .select(
      "id, owner_id, min_tile_x, min_tile_y, max_tile_x, max_tile_y, created_at, is_temporary, expires_at",
    )
    .lte("min_tile_x", bounds.maxTileX)
    .gte("max_tile_x", bounds.minTileX)
    .lte("min_tile_y", bounds.maxTileY)
    .gte("max_tile_y", bounds.minTileY);

  if (plotError) {
    throw new Error(plotError.message);
  }

  const typedPlotRows = (plotRows ?? []) as ParsingWorldBuildingPlotRow[];

  if (typedPlotRows.length === 0) {
    return [];
  }

  const plotIds = typedPlotRows.map((plotRow) => plotRow.id);

  const { data: blockRows, error: blockError } = await supabase
    .from("world_placed_blocks")
    .select(
      "id, plot_id, definition_id, tile_x, tile_y, world_layer, owner_id, metadata, placed_at",
    )
    .in("plot_id", plotIds)
    .gte("tile_x", bounds.minTileX)
    .lte("tile_x", bounds.maxTileX)
    .gte("tile_y", bounds.minTileY)
    .lte("tile_y", bounds.maxTileY);

  if (blockError) {
    throw new Error(blockError.message);
  }

  const typedBlockRows = (blockRows ?? []) as ParsingWorldBuildingPlacedBlockRow[];
  const blocksByPlotId = new Map<string, ParsingWorldBuildingPlacedBlockRow[]>();

  for (const blockRow of typedBlockRows) {
    const existingRows = blocksByPlotId.get(blockRow.plot_id) ?? [];
    existingRows.push(blockRow);
    blocksByPlotId.set(blockRow.plot_id, existingRows);
  }

  return typedPlotRows.map((plotRow) =>
    parsingWorldBuildingPlotRow(plotRow, blocksByPlotId.get(plotRow.id) ?? []),
  );
}

/**
 * Fetches plots owned by the signed-in user.
 *
 * @param ownerUserId - Authenticated user id.
 */
export async function fetchingWorldBuildingPlotsByOwnerUserId(
  ownerUserId: string,
): Promise<DefiningWorldBuildingPlot[]> {
  const supabase = createClient();

  const { data: plotRows, error: plotError } = await supabase
    .from("world_plots")
    .select(
      "id, owner_id, min_tile_x, min_tile_y, max_tile_x, max_tile_y, created_at, is_temporary, expires_at",
    )
    .eq("owner_id", ownerUserId);

  if (plotError) {
    throw new Error(plotError.message);
  }

  const typedPlotRows = (plotRows ?? []) as ParsingWorldBuildingPlotRow[];

  if (typedPlotRows.length === 0) {
    return [];
  }

  const plotIds = typedPlotRows.map((plotRow) => plotRow.id);

  const { data: blockRows, error: blockError } = await supabase
    .from("world_placed_blocks")
    .select(
      "id, plot_id, definition_id, tile_x, tile_y, world_layer, owner_id, metadata, placed_at",
    )
    .in("plot_id", plotIds);

  if (blockError) {
    throw new Error(blockError.message);
  }

  const typedBlockRows = (blockRows ?? []) as ParsingWorldBuildingPlacedBlockRow[];
  const blocksByPlotId = new Map<string, ParsingWorldBuildingPlacedBlockRow[]>();

  for (const blockRow of typedBlockRows) {
    const existingRows = blocksByPlotId.get(blockRow.plot_id) ?? [];
    existingRows.push(blockRow);
    blocksByPlotId.set(blockRow.plot_id, existingRows);
  }

  return typedPlotRows.map((plotRow) =>
    parsingWorldBuildingPlotRow(plotRow, blocksByPlotId.get(plotRow.id) ?? []),
  );
}
