import type { DefiningWorldBuildingPlacedBlockMetadata } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { creatingWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import {
  creatingWorldBuildingPlacedBlock,
  type DefiningWorldBuildingPlacedBlock,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";

/**
 * Parses Supabase rows into placed block entities.
 *
 * @module components/world/building/repositories/parsingWorldBuildingPlacedBlockRow
 */

/** Raw Supabase row for `world_placed_blocks`. */
export interface ParsingWorldBuildingPlacedBlockRow {
  id: string;
  plot_id: string;
  definition_id: string;
  tile_x: number;
  tile_y: number;
  world_layer?: number | null;
  owner_id: string;
  metadata: DefiningWorldBuildingPlacedBlockMetadata | null;
  placed_at: string;
}

/**
 * Hydrates a placed block entity from a database row.
 *
 * @param row - Supabase row payload.
 */
export function parsingWorldBuildingPlacedBlockRow(
  row: ParsingWorldBuildingPlacedBlockRow,
): DefiningWorldBuildingPlacedBlock {
  return creatingWorldBuildingPlacedBlock({
    blockId: row.id,
    plotId: row.plot_id,
    definitionId: row.definition_id as DefiningWorldBuildingBlockDefinitionId,
    tilePosition: creatingWorldBuildingTilePosition(row.tile_x, row.tile_y),
    worldLayer: row.world_layer ?? undefined,
    ownerId: row.owner_id,
    placedAt: row.placed_at,
    metadata: row.metadata ?? {},
  });
}
