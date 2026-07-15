/**
 * Applies a local block placement to the in-memory build draft.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement
 */

import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  mergingWorldBuildingViewportPlotsWithBuildDraft,
  type DefiningWorldBuildingBuildDraftState,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import type { DefiningWorldBuildingCutGridAxisCellCount } from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import {
  checkingWorldBuildingPlotOwnedByUser,
  findingWorldBuildingPlotContainingTilePosition,
  placingWorldBuildingBlockOnPlot,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor } from '@/components/world/building/domains/checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlacementFootprintIsMultiTile,
  DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE,
  listingWorldBuildingPlacementFootprintTilePositions,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { listingWorldBuildingPlacedBlocksFromPlots } from '@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots';
import { placingWorldBuildingBlock } from '@/components/world/building/domains/placingWorldBuildingBlock';
import { placingWorldBuildingSessionBlock } from '@/components/world/building/domains/placingWorldBuildingSessionBlock';
import { resolvingWorldBuildingBlockPlacementBlockedMessage } from '@/components/world/building/domains/resolvingWorldBuildingBlockPlacementBlockedMessage';

/** Successful local placement result. */
export interface ApplyingWorldBuildingBuildDraftBlockPlacementSuccess {
  readonly draft: DefiningWorldBuildingBuildDraftState;
  readonly isSessionPlacement: boolean;
  /** Every tile placed for this click (1 for normal blocks, 4 for 2x2 kiln). */
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
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
 * Stable satellite id. Underscores avoid `:` path-param truncation if a delete
 * URL is ever built without encodeURIComponent.
 */
function formattingWorldBuildingFootprintSatelliteBlockId(
  anchorBlockId: string,
  tilePosition: DefiningWorldBuildingTilePosition
): string {
  return `${anchorBlockId}_fp_${tilePosition.tileX}_${tilePosition.tileY}`;
}

function upsertingWorldBuildingWorkingPlot(
  workingPlots: readonly DefiningWorldBuildingPlot[],
  nextPlot: DefiningWorldBuildingPlot
): DefiningWorldBuildingPlot[] {
  const hasWorkingPlot = workingPlots.some(
    (workingPlotEntry) => workingPlotEntry.plotId === nextPlot.plotId
  );

  if (hasWorkingPlot) {
    return workingPlots.map((workingPlotEntry) =>
      workingPlotEntry.plotId === nextPlot.plotId ? nextPlot : workingPlotEntry
    );
  }

  return [...workingPlots, nextPlot];
}

/**
 * Validates and records a block placement in the draft without touching Supabase.
 *
 * @param input - Placement request and current draft snapshot.
 */
export function applyingWorldBuildingBuildDraftBlockPlacement(
  input: ApplyingWorldBuildingBuildDraftBlockPlacementInput
): ApplyingWorldBuildingBuildDraftBlockPlacementResult {
  const definition = resolvingWorldBuildingBlockDefinition(input.definitionId);

  if (!definition) {
    return { errorMessage: 'Unknown block type.' };
  }

  const footprint = resolvingWorldBuildingBlockPlacementFootprint(definition);
  const footprintTiles = listingWorldBuildingPlacementFootprintTilePositions(
    input.tilePosition,
    footprint
  );
  const isMultiTile =
    checkingWorldBuildingPlacementFootprintIsMultiTile(footprint);

  const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
    input.viewportPlots,
    input.draft,
    input.actorUserId
  );
  const anchorPlot = findingWorldBuildingPlotContainingTilePosition(
    effectivePlots,
    input.tilePosition
  );

  if (
    anchorPlot &&
    checkingWorldBuildingPlotOwnedByUser(anchorPlot, input.actorUserId)
  ) {
    if (
      !checkingWorldBuildingPlotCanPlaceBlockFootprintAtAnchor(
        effectivePlots,
        input.tilePosition,
        input.actorUserId,
        input.worldLayer,
        input.blockHeight,
        definition,
        input.cutFootprintMask
      )
    ) {
      return {
        errorMessage: resolvingWorldBuildingBlockPlacementBlockedMessage({
          plots: effectivePlots,
          anchorTilePosition: input.tilePosition,
          actorUserId: input.actorUserId,
          worldLayer: input.worldLayer,
          definition,
        }),
      };
    }

    // Claims are 1x1 plots; a multi-tile footprint may span adjacent owned tiles.
    // Keep a live plot map so each satellite lands on its own claim plot.
    const workingPlotsById = new Map(
      effectivePlots
        .filter((plot) =>
          checkingWorldBuildingPlotOwnedByUser(plot, input.actorUserId)
        )
        .map((plot) => [plot.plotId, plot] as const)
    );
    const placedBlocks: DefiningWorldBuildingPlacedBlock[] = [];
    const footprintGroupId = input.blockId;

    for (const tilePosition of footprintTiles) {
      const livePlots = Array.from(workingPlotsById.values());
      const plotForTile = findingWorldBuildingPlotContainingTilePosition(
        livePlots,
        tilePosition
      );

      if (
        !plotForTile ||
        !checkingWorldBuildingPlotOwnedByUser(plotForTile, input.actorUserId)
      ) {
        return {
          errorMessage: resolvingWorldBuildingBlockPlacementBlockedMessage({
            plots: Array.from(workingPlotsById.values()),
            anchorTilePosition: input.tilePosition,
            actorUserId: input.actorUserId,
            worldLayer: input.worldLayer,
            definition,
          }),
        };
      }

      const isAnchor =
        tilePosition.tileX === input.tilePosition.tileX &&
        tilePosition.tileY === input.tilePosition.tileY;
      const tileBlockId = isAnchor
        ? input.blockId
        : formattingWorldBuildingFootprintSatelliteBlockId(
            input.blockId,
            tilePosition
          );

      const placementResult = placingWorldBuildingBlockOnPlot({
        plot: plotForTile,
        definitionId: input.definitionId,
        tilePosition,
        worldLayer: input.worldLayer,
        blockHeight: input.blockHeight,
        cutFootprintMask: input.cutFootprintMask,
        cutGridAxisCellCount: input.cutGridAxisCellCount,
        actorUserId: input.actorUserId,
        blockId: tileBlockId,
        placedAt: input.placedAt,
        extraMetadata: isMultiTile
          ? {
              [DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY]:
                footprintGroupId,
              [DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY]: isAnchor
                ? DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR
                : DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE,
            }
          : undefined,
      });

      if (!placementResult.ok) {
        return {
          errorMessage: placementResult.error.message,
        };
      }

      workingPlotsById.set(
        placementResult.value.plot.plotId,
        placementResult.value.plot
      );
      placedBlocks.push(placementResult.value.block);
    }

    let nextWorkingPlots = input.draft.workingPlots;

    for (const nextPlot of workingPlotsById.values()) {
      nextWorkingPlots = upsertingWorldBuildingWorkingPlot(
        nextWorkingPlots,
        nextPlot
      );
    }

    const nextAddedDraftBlockIds = new Set(input.draft.addedDraftBlockIds);

    for (const placedBlock of placedBlocks) {
      nextAddedDraftBlockIds.add(placedBlock.blockId);
    }

    return {
      draft: {
        ...input.draft,
        workingPlots: nextWorkingPlots,
        addedDraftBlockIds: nextAddedDraftBlockIds,
      },
      isSessionPlacement: false,
      placedBlocks,
    };
  }

  if (
    !anchorPlot &&
    checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim(
      input.definitionId
    )
  ) {
    // Session placement stays 1x1 (campfire). Multi-tile utilities need a claim.
    if (isMultiTile) {
      return {
        errorMessage: 'Claim land before placing that multi-tile build.',
      };
    }

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
      placedBlocks: [sessionPlacementResult.value.block],
    };
  }

  if (
    !anchorPlot &&
    isMultiTile &&
    !checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim(
      input.definitionId
    )
  ) {
    return {
      errorMessage: 'Claim land before placing that multi-tile build.',
    };
  }

  // Keep single-tile failure messaging via the legacy path.
  if (!isMultiTile) {
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

  return {
    errorMessage: 'That tile is not available for building.',
  };
}
