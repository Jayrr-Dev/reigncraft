import { DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY } from "@/components/world/domains/definingWorldPlazaTreeLayerGrowthConstants";
import { checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock } from "@/components/world/building/domains/checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock";
import { checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import {
  findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer,
  listingWorldBuildingPlacedBlocksAtTilePosition,
} from "@/components/world/building/domains/findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer";
import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import { checkingWorldBuildingPlacedBlockIsPassableTile } from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  checkingWorldBuildingCutFootprintIsEmpty,
  normalizingWorldBuildingCutFootprintMask,
  normalizingWorldBuildingCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import { checkingWorldBuildingBlockDefinitionIdIsNaturalTree } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering";
import {
  creatingWorldBuildingPlacedBlock,
  resolvingWorldBuildingPlacedBlockWorldLayer,
  type DefiningWorldBuildingPlacedBlock,
  type DefiningWorldBuildingPlacedBlockMetadata,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_BLOCK_HEIGHT_EXCEEDS_LAYER,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NOT_PLOT_OWNER,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_OUTSIDE_PLOT,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_PLOT_BLOCK_LIMIT,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
  DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_UNKNOWN_DEFINITION,
  failingWorldBuildingPlacement,
  succeedingWorldBuildingPlacement,
  type DefiningWorldBuildingPlacementResult,
} from "@/components/world/building/domains/definingWorldBuildingPlacementError";
import {
  checkingWorldBuildingTilePositionInsidePlotBounds,
  type DefiningWorldBuildingPlotBounds,
} from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import { DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT } from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import {
  checkingWorldBuildingTilePositionEquals,
  creatingWorldBuildingTilePosition,
  type DefiningWorldBuildingTilePosition,
} from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_METADATA_KEY } from "@/components/world/building/domains/definingWorldBuildingPassableTileSurfaceOverlayConstants";
import {
  formattingWorldBuildingTileLayerKey,
  formattingWorldBuildingTileSurfaceOverlayLayerKey,
  resolvingWorldBuildingPlacedBlockStorageTileLayerKey,
} from "@/components/world/building/domains/formattingWorldBuildingTileLayerKey";

/**
 * Plot aggregate root for player building.
 *
 * @module components/world/building/domains/definingWorldBuildingPlot
 */

/** Owned build plot aggregate. */
export interface DefiningWorldBuildingPlot {
  readonly plotId: string;
  readonly ownerId: string;
  readonly bounds: DefiningWorldBuildingPlotBounds;
  readonly createdAt: string;
  readonly isTemporary: boolean;
  readonly expiresAt: string | null;
  readonly blocksByTileKey: ReadonlyMap<
    string,
    DefiningWorldBuildingPlacedBlock
  >;
}

/** Input for hydrating a plot aggregate from persistence. */
export interface CreatingWorldBuildingPlotInput {
  readonly plotId: string;
  readonly ownerId: string;
  readonly bounds: DefiningWorldBuildingPlotBounds;
  readonly createdAt: string;
  readonly isTemporary?: boolean;
  readonly expiresAt?: string | null;
  readonly blocks?: DefiningWorldBuildingPlacedBlock[];
}

/**
 * Creates a plot aggregate from persistence rows.
 *
 * @param input - Plot fields and optional placed blocks.
 */
export function creatingWorldBuildingPlot(
  input: CreatingWorldBuildingPlotInput,
): DefiningWorldBuildingPlot {
  const blocksByTileKey = new Map<string, DefiningWorldBuildingPlacedBlock>();

  for (const block of input.blocks ?? []) {
    blocksByTileKey.set(
      resolvingWorldBuildingPlacedBlockStorageTileLayerKey(block),
      block,
    );
  }

  return {
    plotId: input.plotId,
    ownerId: input.ownerId,
    bounds: input.bounds,
    createdAt: input.createdAt,
    isTemporary: input.isTemporary === true,
    expiresAt: input.expiresAt ?? null,
    blocksByTileKey,
  };
}

/**
 * Lists placed blocks on the plot.
 *
 * @param plot - Plot aggregate.
 */
export function listingWorldBuildingPlotPlacedBlocks(
  plot: DefiningWorldBuildingPlot,
): DefiningWorldBuildingPlacedBlock[] {
  return Array.from(plot.blocksByTileKey.values());
}

/**
 * Returns the placed block occupying a tile at a layer, if any.
 *
 * @param plot - Plot aggregate.
 * @param position - Tile position to inspect.
 * @param worldLayer - Target world layer.
 */
export function findingWorldBuildingPlotBlockAtTileLayerPosition(
  plot: DefiningWorldBuildingPlot,
  position: DefiningWorldBuildingTilePosition,
  worldLayer: number,
): DefiningWorldBuildingPlacedBlock | null {
  return (
    plot.blocksByTileKey.get(
      formattingWorldBuildingTileLayerKey(position, worldLayer),
    ) ?? null
  );
}

/**
 * Returns a passable tile surface overlay on an extruded block top face, if any.
 *
 * @param plot - Plot aggregate.
 * @param position - Tile position to inspect.
 * @param worldLayer - Shared top face layer.
 */
export function findingWorldBuildingPlotPassableTileSurfaceOverlayAtTileLayerPosition(
  plot: DefiningWorldBuildingPlot,
  position: DefiningWorldBuildingTilePosition,
  worldLayer: number,
): DefiningWorldBuildingPlacedBlock | null {
  return (
    plot.blocksByTileKey.get(
      formattingWorldBuildingTileSurfaceOverlayLayerKey(position, worldLayer),
    ) ?? null
  );
}

/**
 * Returns the block a player would remove first at a tile layer: overlay tile,
 * then the base block at that layer key.
 *
 * @param plot - Plot aggregate.
 * @param position - Tile position to inspect.
 * @param worldLayer - Target world layer.
 */
export function findingWorldBuildingPlotRemovableBlockAtTileLayerPosition(
  plot: DefiningWorldBuildingPlot,
  position: DefiningWorldBuildingTilePosition,
  worldLayer: number,
): DefiningWorldBuildingPlacedBlock | null {
  return (
    findingWorldBuildingPlotPassableTileSurfaceOverlayAtTileLayerPosition(
      plot,
      position,
      worldLayer,
    ) ??
    findingWorldBuildingPlotBlockAtTileLayerPosition(plot, position, worldLayer)
  );
}

/**
 * Returns true when a passable tile can be placed on the plot at the layer.
 *
 * @param plot - Plot aggregate.
 * @param position - Target tile position.
 * @param worldLayer - Target world layer.
 */
function checkingWorldBuildingPlotCanPlacePassableTileAtTileLayerPosition(
  plot: DefiningWorldBuildingPlot,
  position: DefiningWorldBuildingTilePosition,
  worldLayer: number,
): boolean {
  const existingOverlay =
    findingWorldBuildingPlotPassableTileSurfaceOverlayAtTileLayerPosition(
      plot,
      position,
      worldLayer,
    );

  if (existingOverlay) {
    return false;
  }

  const blocksOnTile = listingWorldBuildingPlacedBlocksAtTilePosition(
    listingWorldBuildingPlotPlacedBlocks(plot),
    position,
  );
  const existingBlock = findingWorldBuildingPlotBlockAtTileLayerPosition(
    plot,
    position,
    worldLayer,
  );

  if (
    existingBlock &&
    checkingWorldBuildingPlacedBlockIsPassableTile(
      existingBlock.blockHeight,
    )
  ) {
    return false;
  }

  if (
    existingBlock &&
    !checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock(
      existingBlock,
      worldLayer,
    )
  ) {
    return false;
  }

  if (
    existingBlock &&
    checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock(
      existingBlock,
      worldLayer,
    )
  ) {
    return true;
  }

  return (
    findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer(
      blocksOnTile,
      worldLayer,
    ) !== null || existingBlock === null
  );
}

/**
 * Returns the placed block occupying a tile, if any.
 *
 * @param plot - Plot aggregate.
 * @param position - Tile position to inspect.
 */
export function findingWorldBuildingPlotBlockAtTilePosition(
  plot: DefiningWorldBuildingPlot,
  position: DefiningWorldBuildingTilePosition,
): DefiningWorldBuildingPlacedBlock | null {
  const matchingBlocks = listingWorldBuildingPlotPlacedBlocks(plot).filter(
    (block) =>
      block.tilePosition.tileX === position.tileX &&
      block.tilePosition.tileY === position.tileY,
  );

  if (matchingBlocks.length === 0) {
    return null;
  }

  return matchingBlocks.reduce((topBlock, block) =>
    resolvingWorldBuildingPlacedBlockWorldLayer(block) >
    resolvingWorldBuildingPlacedBlockWorldLayer(topBlock)
      ? block
      : topBlock,
  );
}

/**
 * Returns true when the actor owns the plot.
 *
 * @param plot - Plot aggregate.
 * @param actorUserId - Authenticated user id.
 */
export function checkingWorldBuildingPlotOwnedByUser(
  plot: DefiningWorldBuildingPlot,
  actorUserId: string,
): boolean {
  return plot.ownerId === actorUserId;
}

/**
 * Returns true when a block can be placed on the plot.
 *
 * @param plot - Plot aggregate.
 * @param position - Target tile position.
 * @param actorUserId - Authenticated user id.
 */
export function checkingWorldBuildingPlotCanPlaceBlockAtTilePosition(
  plot: DefiningWorldBuildingPlot,
  position: DefiningWorldBuildingTilePosition,
  actorUserId: string,
  worldLayer: number,
  blockHeight: number,
  cutFootprintMask: number = DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
): boolean {
  if (!checkingWorldBuildingPlotOwnedByUser(plot, actorUserId)) {
    return false;
  }

  if (checkingWorldBuildingCutFootprintIsEmpty(cutFootprintMask)) {
    return false;
  }

  if (
    !checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer(
      worldLayer,
      blockHeight,
    )
  ) {
    return false;
  }

  if (
    !checkingWorldBuildingTilePositionInsidePlotBounds(plot.bounds, position)
  ) {
    return false;
  }

  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeight)) {
    if (
      !checkingWorldBuildingPlotCanPlacePassableTileAtTileLayerPosition(
        plot,
        position,
        worldLayer,
      )
    ) {
      return false;
    }
  } else if (
    findingWorldBuildingPlotBlockAtTileLayerPosition(plot, position, worldLayer)
  ) {
    return false;
  }

  return (
    plot.blocksByTileKey.size < DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT
  );
}

/** Input for placing a block on a plot. */
export interface PlacingWorldBuildingBlockOnPlotInput {
  readonly plot: DefiningWorldBuildingPlot;
  readonly definitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly worldLayer: number;
  readonly blockHeight: number;
  readonly cutFootprintMask?: number;
  readonly cutGridAxisCellCount?: number;
  readonly actorUserId: string;
  readonly blockId: string;
  readonly placedAt: string;
  /** Extra metadata merged onto the placed block (footprint group, etc.). */
  readonly extraMetadata?: DefiningWorldBuildingPlacedBlockMetadata;
}

/**
 * Places a block on the plot aggregate when invariants pass.
 *
 * @param input - Placement request.
 */
export function placingWorldBuildingBlockOnPlot(
  input: PlacingWorldBuildingBlockOnPlotInput,
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

  if (!checkingWorldBuildingPlotOwnedByUser(input.plot, input.actorUserId)) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NOT_PLOT_OWNER,
      message: "You can only build on plots you own.",
    });
  }

  if (
    !checkingWorldBuildingTilePositionInsidePlotBounds(
      input.plot.bounds,
      input.tilePosition,
    )
  ) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_OUTSIDE_PLOT,
      message: "That tile is outside your plot.",
    });
  }

  const blocksOnTile = listingWorldBuildingPlacedBlocksAtTilePosition(
    listingWorldBuildingPlotPlacedBlocks(input.plot),
    input.tilePosition,
  );
  const existingBlock = findingWorldBuildingPlotBlockAtTileLayerPosition(
    input.plot,
    input.tilePosition,
    input.worldLayer,
  );
  const existingOverlay =
    findingWorldBuildingPlotPassableTileSurfaceOverlayAtTileLayerPosition(
      input.plot,
      input.tilePosition,
      input.worldLayer,
    );
  const extrudedTopFaceBlock =
    findingWorldBuildingPlacedBlockExtrudedTopFaceAtTileLayer(
      blocksOnTile,
      input.worldLayer,
    );
  const isPassableTile = checkingWorldBuildingPlacedBlockIsPassableTile(
    input.blockHeight,
  );
  const overlayTargetBlock =
    existingBlock &&
    checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock(
      existingBlock,
      input.worldLayer,
    )
      ? existingBlock
      : extrudedTopFaceBlock;
  const usesSurfaceOverlay = isPassableTile && overlayTargetBlock !== null;

  if (isPassableTile) {
    if (existingOverlay) {
      return failingWorldBuildingPlacement({
        code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
        message: "That tile already has a surface tile on this layer.",
      });
    }

    if (
      existingBlock &&
      checkingWorldBuildingPlacedBlockIsPassableTile(existingBlock.blockHeight)
    ) {
      return failingWorldBuildingPlacement({
        code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
        message: "That tile already has a block on this layer.",
      });
    }

    if (
      existingBlock &&
      !checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock(
        existingBlock,
        input.worldLayer,
      )
    ) {
      return failingWorldBuildingPlacement({
        code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
        message: "That tile already has a block on this layer.",
      });
    }
  } else if (existingBlock) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
      message: "That tile already has a block on this layer.",
    });
  }

  if (
    input.plot.blocksByTileKey.size >=
    DEFINING_WORLD_BUILDING_PLOT_MAX_BLOCK_COUNT
  ) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_PLOT_BLOCK_LIMIT,
      message: "This plot has reached its block limit.",
    });
  }

  if (
    !checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer(
      input.worldLayer,
      input.blockHeight,
    )
  ) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_BLOCK_HEIGHT_EXCEEDS_LAYER,
      message:
        "Block height is too tall for this layer. Lower H or raise L so the column does not extend below ground.",
    });
  }

  const cutGridAxisCellCount = normalizingWorldBuildingCutGridAxisCellCount(
    input.cutGridAxisCellCount,
  );
  const cutFootprintMask = normalizingWorldBuildingCutFootprintMask(
    input.cutFootprintMask,
    cutGridAxisCellCount,
  );

  if (checkingWorldBuildingCutFootprintIsEmpty(cutFootprintMask)) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
      message: "Select at least one cut cell before placing.",
    });
  }

  const block = creatingWorldBuildingPlacedBlock({
    blockId: input.blockId,
    plotId: input.plot.plotId,
    definitionId: input.definitionId,
    tilePosition: creatingWorldBuildingTilePosition(
      input.tilePosition.tileX,
      input.tilePosition.tileY,
    ),
    worldLayer: input.worldLayer,
    blockHeight: input.blockHeight,
    cutFootprintMask,
    cutGridAxisCellCount,
    ownerId: input.actorUserId,
    placedAt: input.placedAt,
    metadata: {
      ...(usesSurfaceOverlay
        ? {
            [DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_METADATA_KEY]:
              true,
          }
        : checkingWorldBuildingBlockDefinitionIdIsNaturalTree(input.definitionId)
          ? {
              [DEFINING_WORLD_PLAZA_TREE_GROWTH_STAGE_METADATA_KEY]: 0,
            }
          : {}),
      ...(input.extraMetadata ?? {}),
    },
  });

  const nextBlocksByTileKey = new Map(input.plot.blocksByTileKey);
  nextBlocksByTileKey.set(
    resolvingWorldBuildingPlacedBlockStorageTileLayerKey(block),
    block,
  );

  return succeedingWorldBuildingPlacement({
    plot: {
      ...input.plot,
      blocksByTileKey: nextBlocksByTileKey,
    },
    block,
  });
}

/**
 * Removes a placed block from the plot aggregate.
 *
 * @param plot - Plot aggregate.
 * @param position - Tile position to clear.
 * @param actorUserId - Authenticated user id.
 */
export function removingWorldBuildingBlockFromPlot(
  plot: DefiningWorldBuildingPlot,
  position: DefiningWorldBuildingTilePosition,
  actorUserId: string,
  worldLayer: number,
): DefiningWorldBuildingPlacementResult<DefiningWorldBuildingPlot> {
  if (!checkingWorldBuildingPlotOwnedByUser(plot, actorUserId)) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NOT_PLOT_OWNER,
      message: "You can only edit plots you own.",
    });
  }

  const existingBlock = findingWorldBuildingPlotRemovableBlockAtTileLayerPosition(
    plot,
    position,
    worldLayer,
  );

  if (!existingBlock) {
    return failingWorldBuildingPlacement({
      code: DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED,
      message: "There is no block on that tile at this layer.",
    });
  }

  const nextBlocksByTileKey = new Map(plot.blocksByTileKey);
  nextBlocksByTileKey.delete(
    resolvingWorldBuildingPlacedBlockStorageTileLayerKey(existingBlock),
  );

  return succeedingWorldBuildingPlacement({
    ...plot,
    blocksByTileKey: nextBlocksByTileKey,
  });
}

/**
 * Finds the plot that contains a tile position from a list of plots.
 *
 * @param plots - Candidate plots overlapping the viewport.
 * @param position - Tile position to locate.
 */
export function findingWorldBuildingPlotContainingTilePosition(
  plots: readonly DefiningWorldBuildingPlot[],
  position: DefiningWorldBuildingTilePosition,
): DefiningWorldBuildingPlot | null {
  for (const plot of plots) {
    if (
      checkingWorldBuildingTilePositionInsidePlotBounds(plot.bounds, position)
    ) {
      return plot;
    }
  }

  return null;
}

/**
 * Returns true when two tile positions match for plot indexing helpers.
 *
 * @param left - First tile position.
 * @param right - Second tile position.
 */
export function checkingWorldBuildingPlotTilePositionsEqual(
  left: DefiningWorldBuildingTilePosition,
  right: DefiningWorldBuildingTilePosition,
): boolean {
  return checkingWorldBuildingTilePositionEquals(left, right);
}
