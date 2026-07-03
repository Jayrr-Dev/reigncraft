import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import {
  findingWorldBuildingPlotContainingTilePosition,
  placingWorldBuildingBlockOnPlot,
  type DefiningWorldBuildingPlot,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NO_PLOT,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_UNKNOWN_DEFINITION,
  failingWorldBuildingPlacement,
  type DefiningWorldBuildingPlacementResult,
} from "@/components/world/building/domains/definingWorldBuildingPlacementError";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";

/**
 * Domain service for validating and placing blocks on owned plots.
 *
 * @module components/world/building/domains/placingWorldBuildingBlock
 */

/** Placement request across one or more candidate plots. */
export interface PlacingWorldBuildingBlockInput {
  readonly plots: DefiningWorldBuildingPlot[];
  readonly definitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly worldLayer: number;
  readonly blockHeight: number;
  readonly cutFootprintMask?: number;
  readonly cutGridAxisCellCount?: number;
  readonly actorUserId: string;
  readonly blockId: string;
  readonly placedAt: string;
}

/**
 * Validates placement rules and returns the updated plot aggregate.
 *
 * @param input - Placement request.
 */
export function placingWorldBuildingBlock(
  input: PlacingWorldBuildingBlockInput,
): DefiningWorldBuildingPlacementResult<{
  plot: DefiningWorldBuildingPlot;
  block: DefiningWorldBuildingPlacedBlock;
}> {
  if (!resolvingWorldBuildingBlockDefinition(input.definitionId)) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_UNKNOWN_DEFINITION,
      message: "Unknown block type.",
    });
  }

  const plot = findingWorldBuildingPlotContainingTilePosition(
    input.plots,
    input.tilePosition,
  );

  if (!plot) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NO_PLOT,
      message: "You need an owned plot here before building.",
    });
  }

  return placingWorldBuildingBlockOnPlot({
    plot,
    definitionId: input.definitionId,
    tilePosition: input.tilePosition,
    worldLayer: input.worldLayer,
    blockHeight: input.blockHeight,
    cutFootprintMask: input.cutFootprintMask,
    cutGridAxisCellCount: input.cutGridAxisCellCount,
    actorUserId: input.actorUserId,
    blockId: input.blockId,
    placedAt: input.placedAt,
  });
}
