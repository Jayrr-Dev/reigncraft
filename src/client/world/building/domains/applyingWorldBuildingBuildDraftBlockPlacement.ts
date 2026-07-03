import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import {
  mergingWorldBuildingViewportPlotsWithBuildDraft,
  type DefiningWorldBuildingBuildDraftState,
} from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { placingWorldBuildingBlock } from "@/components/world/building/domains/placingWorldBuildingBlock";

/**
 * Applies a local block placement to the in-memory build draft.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement
 */

/** Successful local placement result. */
export interface ApplyingWorldBuildingBuildDraftBlockPlacementSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
}

/** Failed local placement result. */
export interface ApplyingWorldBuildingBuildDraftBlockPlacementFailure {
  readonly errorMessage: string;
}

/** Result from {@link applyingWorldBuildingBuildDraftBlockPlacement}. */
export type ApplyingWorldBuildingBuildDraftBlockPlacementResult =
  | ApplyingWorldBuildingBuildDraftBlockPlacementSuccess
  | ApplyingWorldBuildingBuildDraftBlockPlacementFailure;

/** Input for {@link applyingWorldBuildingBuildDraftBlockPlacement}. */
export interface ApplyingWorldBuildingBuildDraftBlockPlacementInput {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  readonly viewportPlots: DefiningWorldBuildingPlot[];
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
 * Validates and records a block placement in the draft without touching Supabase.
 *
 * @param input - Placement request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftBlockPlacement(
  input: ApplyingWorldBuildingBuildDraftBlockPlacementInput,
): ApplyingWorldBuildingBuildDraftBlockPlacementResult {
  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.actorUserId,
  );

  const placementResult = placingWorldBuildingBlock({
    plots: effectivePlots,
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

  if (!placementResult.ok) {
    return {
      errorMessage: placementResult.error.message,
    };
  }

  const nextPlot = placementResult.value.plot;
  const hasWorkingPlot = input.draft.workingPlots.some(
    (plot) => plot.plotId === nextPlot.plotId,
  );
  const nextWorkingPlots = hasWorkingPlot
    ? input.draft.workingPlots.map((plot) =>
        plot.plotId === nextPlot.plotId ? nextPlot : plot,
      )
    : [...input.draft.workingPlots, nextPlot];
  const nextAddedDraftBlockIds = new Set(input.draft.addedDraftBlockIds);
  nextAddedDraftBlockIds.add(placementResult.value.block.blockId);

  return {
    draft: {
      ...input.draft,
      workingPlots: nextWorkingPlots,
      addedDraftBlockIds: nextAddedDraftBlockIds,
    },
  };
}
