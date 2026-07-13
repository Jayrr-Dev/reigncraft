import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  mergingWorldBuildingViewportPlotsWithBuildDraft,
  type DefiningWorldBuildingBuildDraftState,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import type { DefiningWorldBuildingCutGridAxisCellCount } from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import {
  checkingWorldBuildingPlotOwnedByUser,
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { listingWorldBuildingPlacedBlocksFromPlots } from '@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots';
import { placingWorldBuildingBlock } from '@/components/world/building/domains/placingWorldBuildingBlock';
import { placingWorldBuildingSessionBlock } from '@/components/world/building/domains/placingWorldBuildingSessionBlock';

/**
 * Applies a local block placement to the in-memory build draft.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement
 */

/** Successful local placement result. */
export interface ApplyingWorldBuildingBuildDraftBlockPlacementSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  readonly isSessionPlacement: boolean;
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
  readonly cutGridAxisCellCount?: DefiningWorldBuildingCutGridAxisCellCount;
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
  const plot = findingWorldBuildingPlotContainingTilePosition(
    effectivePlots,
    input.tilePosition,
  );

  if (plot && checkingWorldBuildingPlotOwnedByUser(plot, input.actorUserId)) {
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
      (workingPlot) => workingPlot.plotId === nextPlot.plotId,
    );
    const nextWorkingPlots = hasWorkingPlot
      ? input.draft.workingPlots.map((workingPlot) =>
          workingPlot.plotId === nextPlot.plotId ? nextPlot : workingPlot,
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
      isSessionPlacement: false,
    };
  }

  if (
    !plot &&
    checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim(
      input.definitionId,
    )
  ) {
    const placedBlocks = [
      ...listingWorldBuildingPlacedBlocksFromPlots(effectivePlots),
      ...input.draft.sessionBlocks,
    ];
    const sessionPlacementResult = placingWorldBuildingSessionBlock({
      plots: effectivePlots,
      placedBlocks,
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

    if (!sessionPlacementResult.ok) {
      return {
        errorMessage: sessionPlacementResult.error.message,
      };
    }

    return {
      draft: {
        ...input.draft,
        sessionBlocks: [
          ...input.draft.sessionBlocks,
          sessionPlacementResult.value.block,
        ],
      },
      isSessionPlacement: true,
    };
  }

  const rejectedPlacementResult = placingWorldBuildingBlock({
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

  return {
    errorMessage: rejectedPlacementResult.ok
      ? 'That tile is not available for building.'
      : rejectedPlacementResult.error.message,
  };
}
