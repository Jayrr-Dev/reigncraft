import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { DEFINING_WORLD_BUILDING_SESSION_PLOT_ID } from '@/components/world/building/domains/definingWorldBuildingSessionBlockConstants';
import { parsingWorldBuildingPlacedBlockRow } from '@/components/world/building/repositories/parsingWorldBuildingPlacedBlockRow';
import {
  WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY,
  WORLD_BUILDING_DEVVIT_SESSION_PLOT_ID_SENTINEL,
  type WorldBuildingDevvitBlockRow,
} from '../../../../shared/worldBuildingDevvit';

/**
 * Hydrates session blocks from a Devvit plots payload into a synthetic plot.
 *
 * @module components/world/building/domains/hydratingWorldBuildingSessionBlocksPlot
 */

/**
 * Returns true when a Devvit block row is session-scoped.
 *
 * @param blockRow - Raw block row from the API.
 */
export function checkingWorldBuildingDevvitBlockRowIsSession(
  blockRow: WorldBuildingDevvitBlockRow,
): boolean {
  return (
    blockRow.plot_id === WORLD_BUILDING_DEVVIT_SESSION_PLOT_ID_SENTINEL ||
    blockRow.metadata?.[WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY] ===
      true
  );
}

/**
 * Builds a synthetic plot aggregate that holds session blocks for rendering.
 *
 * @param sessionBlockRows - Session block rows from the API payload.
 */
export function hydratingWorldBuildingSessionBlocksPlot(
  sessionBlockRows: readonly WorldBuildingDevvitBlockRow[],
) {
  if (sessionBlockRows.length === 0) {
    return null;
  }

  let minTileX = Number.POSITIVE_INFINITY;
  let minTileY = Number.POSITIVE_INFINITY;
  let maxTileX = Number.NEGATIVE_INFINITY;
  let maxTileY = Number.NEGATIVE_INFINITY;

  for (const blockRow of sessionBlockRows) {
    minTileX = Math.min(minTileX, blockRow.tile_x);
    minTileY = Math.min(minTileY, blockRow.tile_y);
    maxTileX = Math.max(maxTileX, blockRow.tile_x);
    maxTileY = Math.max(maxTileY, blockRow.tile_y);
  }

  return creatingWorldBuildingPlot({
    plotId: DEFINING_WORLD_BUILDING_SESSION_PLOT_ID,
    ownerId: 'session',
    bounds: {
      minTileX,
      minTileY,
      maxTileX,
      maxTileY,
    },
    createdAt: new Date(0).toISOString(),
    blocks: sessionBlockRows.map((blockRow) =>
      parsingWorldBuildingPlacedBlockRow({
        id: blockRow.id,
        plot_id: blockRow.plot_id,
        definition_id: blockRow.definition_id,
        tile_x: blockRow.tile_x,
        tile_y: blockRow.tile_y,
        world_layer: blockRow.world_layer,
        owner_id: blockRow.owner_id,
        metadata: blockRow.metadata,
        placed_at: blockRow.placed_at,
      }),
    ),
  });
}
