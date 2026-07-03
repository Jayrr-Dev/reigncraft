import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import type { DefiningWorldBuildingCollisionShape } from "@/components/world/building/domains/definingWorldBuildingCollisionShape";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import {
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_METADATA_KEY,
  clampingWorldBuildingWorldLayer,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_METADATA_KEY,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_METADATA_KEY,
  normalizingWorldBuildingCutFootprintMask,
  normalizingWorldBuildingCutGridAxisCellCount,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";

/**
 * Placed block entity for the building domain.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacedBlock
 */

/** JSON metadata persisted with a placed block. */
export type DefiningWorldBuildingPlacedBlockMetadata = Record<
  string,
  string | number | boolean | null
>;

/** Player-placed block instance with identity. */
export interface DefiningWorldBuildingPlacedBlock {
  readonly blockId: string;
  readonly plotId: string;
  readonly definitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly worldLayer: number;
  readonly blockHeight: number;
  readonly ownerId: string;
  readonly placedAt: string;
  readonly metadata: DefiningWorldBuildingPlacedBlockMetadata;
}

/** Input required to create a new placed block entity. */
export interface CreatingWorldBuildingPlacedBlockInput {
  readonly blockId: string;
  readonly plotId: string;
  readonly definitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly worldLayer?: number;
  readonly blockHeight?: number;
  readonly cutFootprintMask?: number;
  readonly cutGridAxisCellCount?: DefiningWorldBuildingCutGridAxisCellCount;
  readonly ownerId: string;
  readonly placedAt: string;
  readonly metadata?: DefiningWorldBuildingPlacedBlockMetadata;
}

/**
 * Creates a placed block entity.
 *
 * @param input - Entity fields.
 */
export function creatingWorldBuildingPlacedBlock(
  input: CreatingWorldBuildingPlacedBlockInput,
): DefiningWorldBuildingPlacedBlock {
  const worldLayer = clampingWorldBuildingWorldLayer(
    input.worldLayer ??
      (typeof input.metadata?.[DEFINING_WORLD_BUILDING_WORLD_LAYER_METADATA_KEY] ===
      "number"
        ? input.metadata[DEFINING_WORLD_BUILDING_WORLD_LAYER_METADATA_KEY]
        : DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND),
  );
  const blockHeight = clampingWorldBuildingBlockHeight(
    input.blockHeight ??
      (typeof input.metadata?.[DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY] ===
      "number"
        ? input.metadata[DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY]
        : DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT),
    worldLayer,
  );
  const cutGridAxisCellCount = normalizingWorldBuildingCutGridAxisCellCount(
    input.cutGridAxisCellCount ??
      (typeof input.metadata?.[
        DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_METADATA_KEY
      ] === "number"
        ? input.metadata[DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_METADATA_KEY]
        : DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT),
  );
  const cutFootprintMask = normalizingWorldBuildingCutFootprintMask(
    input.cutFootprintMask ??
      (typeof input.metadata?.[DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_METADATA_KEY] ===
      "number"
        ? input.metadata[DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_METADATA_KEY]
        : DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK),
    cutGridAxisCellCount,
  );

  return {
    blockId: input.blockId,
    plotId: input.plotId,
    definitionId: input.definitionId,
    tilePosition: input.tilePosition,
    worldLayer,
    blockHeight,
    ownerId: input.ownerId,
    placedAt: input.placedAt,
    metadata: {
      ...(input.metadata ?? {}),
      [DEFINING_WORLD_BUILDING_WORLD_LAYER_METADATA_KEY]: worldLayer,
      [DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY]: blockHeight,
      [DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_METADATA_KEY]: cutFootprintMask,
      [DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_METADATA_KEY]:
        cutGridAxisCellCount,
    },
  };
}

/**
 * Resolves the cut footprint mask for a placed block (defaults to full tile).
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockCutFootprintMask(
  block: DefiningWorldBuildingPlacedBlock,
): number {
  const metadataMask = block.metadata[DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_METADATA_KEY];

  return normalizingWorldBuildingCutFootprintMask(
    typeof metadataMask === "number" ? metadataMask : undefined,
    resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block),
  );
}

/**
 * Resolves the cut grid axis cell count for a placed block (defaults to 4x4).
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(
  block: DefiningWorldBuildingPlacedBlock,
): DefiningWorldBuildingCutGridAxisCellCount {
  const metadataAxisCellCount =
    block.metadata[DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_METADATA_KEY];

  return normalizingWorldBuildingCutGridAxisCellCount(
    typeof metadataAxisCellCount === "number" ? metadataAxisCellCount : undefined,
  );
}

/**
 * Resolves the persisted world layer for a placed block.
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockWorldLayer(
  block: DefiningWorldBuildingPlacedBlock,
): number {
  return clampingWorldBuildingWorldLayer(block.worldLayer);
}

/**
 * Resolves the downward extrusion height for a placed block.
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockBlockHeight(
  block: DefiningWorldBuildingPlacedBlock,
): number {
  return clampingWorldBuildingBlockHeight(
    block.blockHeight,
    resolvingWorldBuildingPlacedBlockWorldLayer(block),
  );
}

/**
 * Returns true when the actor may interact with the placed block.
 *
 * @param block - Placed block entity.
 * @param actorUserId - Authenticated user id.
 */
export function checkingWorldBuildingPlacedBlockCanInteract(
  block: DefiningWorldBuildingPlacedBlock,
  actorUserId: string,
): boolean {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

  if (!definition?.isInteractive) {
    return false;
  }

  return block.ownerId === actorUserId;
}

/**
 * Resolves the collision shape for a placed block.
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockCollisionShape(
  block: DefiningWorldBuildingPlacedBlock,
): DefiningWorldBuildingCollisionShape | null {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

  return definition?.collisionShape ?? null;
}
