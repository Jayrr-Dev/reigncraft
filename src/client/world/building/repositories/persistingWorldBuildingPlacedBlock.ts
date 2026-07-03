import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import type {
  DefiningWorldBuildingPlacedBlock,
  DefiningWorldBuildingPlacedBlockMetadata,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import {
  claimingWorldBuildingDevvitPlot,
  deletingWorldBuildingDevvitBlock,
  deletingWorldBuildingDevvitPlot,
  placingWorldBuildingDevvitBlock,
} from "@/components/world/building/repositories/callingWorldBuildingDevvitApi";
import { parsingWorldBuildingPlacedBlockRow } from "@/components/world/building/repositories/parsingWorldBuildingPlacedBlockRow";
import {
  WORLD_BUILDING_DEVVIT_BLOCKS_API_PATH,
  WORLD_BUILDING_DEVVIT_PLOTS_CLAIM_API_PATH,
  WORLD_BUILDING_DEVVIT_PLOTS_DELETE_API_PATH,
} from "../../../../shared/worldBuildingDevvit";

/**
 * Persists a placed block through the Devvit world-building API.
 *
 * @module components/world/building/repositories/persistingWorldBuildingPlacedBlock
 */

/** Insert payload for a placed block. */
export interface PersistingWorldBuildingPlacedBlockInput {
  blockId: string;
  plotId: string;
  definitionId: DefiningWorldBuildingBlockDefinitionId;
  tilePosition: DefiningWorldBuildingTilePosition;
  worldLayer: number;
  blockHeight: number;
  ownerUserId: string;
  placedAt: string;
  metadata?: DefiningWorldBuildingPlacedBlockMetadata;
}

/**
 * Inserts one placed block row.
 *
 * @param input - Persisted block fields.
 */
export async function persistingWorldBuildingPlacedBlock(
  input: PersistingWorldBuildingPlacedBlockInput,
): Promise<DefiningWorldBuildingPlacedBlock> {
  const blockRow = await placingWorldBuildingDevvitBlock(
    WORLD_BUILDING_DEVVIT_BLOCKS_API_PATH,
    {
      blockId: input.blockId,
      plotId: input.plotId,
      definitionId: input.definitionId,
      tileX: input.tilePosition.tileX,
      tileY: input.tilePosition.tileY,
      worldLayer: input.worldLayer,
      blockHeight: input.blockHeight,
      placedAt: input.placedAt,
      metadata: {
        ...(input.metadata ?? {}),
        worldLayer: input.worldLayer,
        blockHeight: input.blockHeight,
      },
    },
  );

  return parsingWorldBuildingPlacedBlockRow(blockRow);
}

/**
 * Deletes one placed block row by id.
 *
 * @param blockId - Placed block uuid.
 */
export async function removingWorldBuildingPlacedBlockPersistence(
  blockId: string,
): Promise<void> {
  await deletingWorldBuildingDevvitBlock(
    `${WORLD_BUILDING_DEVVIT_BLOCKS_API_PATH}/${encodeURIComponent(blockId)}`,
  );
}

/**
 * Deletes one plot row by id and its placed blocks.
 *
 * @param plotId - Plot uuid.
 */
export async function removingWorldBuildingPlotPersistence(
  plotId: string,
): Promise<void> {
  await deletingWorldBuildingDevvitPlot(
    `${WORLD_BUILDING_DEVVIT_PLOTS_DELETE_API_PATH}/${encodeURIComponent(plotId)}`,
  );
}

/**
 * Creates a one-tile plot at the given grid position.
 *
 * @param ownerUserId - Authenticated user id.
 * @param tileX - Claimed tile X.
 * @param tileY - Claimed tile Y.
 */
export async function provisioningWorldBuildingTilePlot(
  ownerUserId: string,
  tileX: number,
  tileY: number,
): Promise<string> {
  void ownerUserId;

  return claimingWorldBuildingDevvitPlot(
    WORLD_BUILDING_DEVVIT_PLOTS_CLAIM_API_PATH,
    {
      tileX,
      tileY,
      isTemporary: false,
    },
  );
}

/**
 * Creates a one-tile temporary build pad at the given grid position.
 *
 * @param ownerUserId - Authenticated user id.
 * @param tileX - Claimed tile X.
 * @param tileY - Claimed tile Y.
 */
export async function provisioningWorldBuildingTemporaryTilePlot(
  ownerUserId: string,
  tileX: number,
  tileY: number,
): Promise<string> {
  void ownerUserId;

  return claimingWorldBuildingDevvitPlot(
    WORLD_BUILDING_DEVVIT_PLOTS_CLAIM_API_PATH,
    {
      tileX,
      tileY,
      isTemporary: true,
    },
  );
}
