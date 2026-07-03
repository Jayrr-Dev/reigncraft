import {
  creatingWorldBuildingPlot,
  type DefiningWorldBuildingPlot,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import { parsingWorldBuildingPlacedBlockRow } from "@/components/world/building/repositories/parsingWorldBuildingPlacedBlockRow";

/**
 * Parses Supabase rows into plot aggregates.
 *
 * @module components/world/building/repositories/parsingWorldBuildingPlotRow
 */

/** Raw Supabase row for `world_plots`. */
export interface ParsingWorldBuildingPlotRow {
  id: string;
  owner_id: string;
  min_tile_x: number;
  min_tile_y: number;
  max_tile_x: number;
  max_tile_y: number;
  created_at: string;
  is_temporary?: boolean | null;
  expires_at?: string | null;
}

/**
 * Hydrates a plot aggregate from a database row and optional block rows.
 *
 * @param plotRow - Plot row payload.
 * @param blockRows - Related placed block rows.
 */
export function parsingWorldBuildingPlotRow(
  plotRow: ParsingWorldBuildingPlotRow,
  blockRows: Parameters<typeof parsingWorldBuildingPlacedBlockRow>[0][] = [],
): DefiningWorldBuildingPlot {
  const bounds: DefiningWorldBuildingPlotBounds = {
    minTileX: plotRow.min_tile_x,
    minTileY: plotRow.min_tile_y,
    maxTileX: plotRow.max_tile_x,
    maxTileY: plotRow.max_tile_y,
  };

  return creatingWorldBuildingPlot({
    plotId: plotRow.id,
    ownerId: plotRow.owner_id,
    bounds,
    createdAt: plotRow.created_at,
    isTemporary: plotRow.is_temporary === true,
    expiresAt: plotRow.expires_at ?? null,
    blocks: blockRows.map(parsingWorldBuildingPlacedBlockRow),
  });
}
