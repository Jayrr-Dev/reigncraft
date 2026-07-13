import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  creatingWorldBuildingPlacedBlock,
  type DefiningWorldBuildingPlacedBlock,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NO_PLOT,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_UNKNOWN_DEFINITION,
  failingWorldBuildingPlacement,
  succeedingWorldBuildingPlacement,
  type DefiningWorldBuildingPlacementResult,
} from '@/components/world/building/domains/definingWorldBuildingPlacementError';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldBuildingCutGridAxisCellCount } from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import {
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import { checkingWorldBuildingSessionBlockCanPlaceAtTilePosition } from '@/components/world/building/domains/checkingWorldBuildingSessionBlockCanPlaceAtTilePosition';
import {
  normalizingWorldBuildingCutFootprintMask,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_BUILDING_SESSION_PLOT_ID,
  WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY,
} from '@/components/world/building/domains/definingWorldBuildingSessionBlockConstants';

/**
 * Domain service for session-only block placement on unclaimed land.
 *
 * @module components/world/building/domains/placingWorldBuildingSessionBlock
 */

/** Placement request for a session block outside any claim. */
export interface PlacingWorldBuildingSessionBlockInput {
  readonly plots: readonly DefiningWorldBuildingPlot[];
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly definitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly worldLayer: number;
  readonly blockHeight: number;
  readonly cutFootprintMask?: number;
  readonly cutGridAxisCellCount?: DefiningWorldBuildingCutGridAxisCellCount;
  readonly actorUserId: string;
  readonly blockId: string;
  readonly placedAt: string;
}

/**
 * Validates and creates a session block entity for unclaimed land.
 *
 * @param input - Session placement request.
 */
export function placingWorldBuildingSessionBlock(
  input: PlacingWorldBuildingSessionBlockInput,
): DefiningWorldBuildingPlacementResult<{
  block: DefiningWorldBuildingPlacedBlock;
}> {
  if (!resolvingWorldBuildingBlockDefinition(input.definitionId)) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_UNKNOWN_DEFINITION,
      message: 'Unknown block type.',
    });
  }

  const plot = findingWorldBuildingPlotContainingTilePosition(
    input.plots,
    input.tilePosition,
  );

  if (plot) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NO_PLOT,
      message: 'Use your claim to place that here.',
    });
  }

  if (
    !checkingWorldBuildingSessionBlockCanPlaceAtTilePosition(
      input.plots,
      input.placedBlocks,
      input.tilePosition,
      input.definitionId,
      input.worldLayer,
      input.blockHeight,
      normalizingWorldBuildingCutFootprintMask(
        input.cutFootprintMask,
        input.cutGridAxisCellCount,
      ),
    )
  ) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
      message: 'That tile is not available for a temporary build.',
    });
  }

  const block = creatingWorldBuildingPlacedBlock({
    blockId: input.blockId,
    plotId: DEFINING_WORLD_BUILDING_SESSION_PLOT_ID,
    definitionId: input.definitionId,
    tilePosition: input.tilePosition,
    worldLayer: input.worldLayer,
    blockHeight: input.blockHeight,
    cutFootprintMask: input.cutFootprintMask,
    cutGridAxisCellCount: input.cutGridAxisCellCount,
    ownerId: input.actorUserId,
    placedAt: input.placedAt,
    metadata: {
      [WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY]: true,
    },
  });

  return succeedingWorldBuildingPlacement({ block });
}
