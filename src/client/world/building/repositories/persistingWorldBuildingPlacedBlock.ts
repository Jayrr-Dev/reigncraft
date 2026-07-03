import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import type {
  DefiningWorldBuildingPlacedBlock,
  DefiningWorldBuildingPlacedBlockMetadata,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE,
  checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer,
} from "@/components/world/building/domains/checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer";
import {
  formattingWorldBuildingOwnerMaxTileClaimRejectionMessage,
} from "@/components/world/building/domains/countingWorldBuildingOwnerPlotClaims";
import {
  formattingWorldBuildingOwnerMaxTemporaryTileClaimRejectionMessage,
} from "@/components/world/building/domains/countingWorldBuildingOwnerTemporaryTileClaims";
import { fetchingWorldBuildingPlotOwnerLimitsByUserId } from "@/components/world/building/repositories/fetchingWorldBuildingPlotOwnerLimitsByUserId";
import {
  DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES,
} from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import { creatingWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { fetchingWorldBuildingPlotsByBounds } from "@/components/world/building/repositories/fetchingWorldBuildingPlotsByBounds";
import { parsingWorldBuildingPlacedBlockRow } from "@/components/world/building/repositories/parsingWorldBuildingPlacedBlockRow";
import { createClient } from "@/lib/supabase/client";

/**
 * Persists a placed block row to Supabase.
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
  const supabase = createClient();

  const { data, error } = await supabase
    .from("world_placed_blocks")
    .insert({
      id: input.blockId,
      plot_id: input.plotId,
      definition_id: input.definitionId,
      tile_x: input.tilePosition.tileX,
      tile_y: input.tilePosition.tileY,
      world_layer: input.worldLayer,
      owner_id: input.ownerUserId,
      placed_at: input.placedAt,
      metadata: {
        ...(input.metadata ?? {}),
        worldLayer: input.worldLayer,
        blockHeight: input.blockHeight,
      },
    })
    .select(
      "id, plot_id, definition_id, tile_x, tile_y, world_layer, owner_id, metadata, placed_at",
    )
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not place block.");
  }

  return parsingWorldBuildingPlacedBlockRow(data);
}

/**
 * Deletes one placed block row by id.
 *
 * @param blockId - Placed block uuid.
 */
export async function removingWorldBuildingPlacedBlockPersistence(
  blockId: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("world_placed_blocks")
    .delete()
    .eq("id", blockId);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Deletes one plot row by id. Placed blocks cascade from the database.
 *
 * @param plotId - Plot uuid.
 */
export async function removingWorldBuildingPlotPersistence(
  plotId: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("world_plots")
    .delete()
    .eq("id", plotId);

  if (error) {
    throw new Error(error.message);
  }
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
  const claimBufferTiles =
    DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES;
  const tilePosition = creatingWorldBuildingTilePosition(tileX, tileY);
  const nearbyPlots = await fetchingWorldBuildingPlotsByBounds({
    minTileX: tileX - claimBufferTiles,
    minTileY: tileY - claimBufferTiles,
    maxTileX: tileX + claimBufferTiles,
    maxTileY: tileY + claimBufferTiles,
  });

  if (
    checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer(
      nearbyPlots,
      tilePosition,
      ownerUserId,
    )
  ) {
    throw new Error(
      CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE,
    );
  }

  const supabase = createClient();

  const plotOwnerLimits =
    await fetchingWorldBuildingPlotOwnerLimitsByUserId(ownerUserId);

  const { count: ownedPlotCount, error: ownedPlotCountError } = await supabase
    .from("world_plots")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", ownerUserId)
    .eq("is_temporary", false);

  if (ownedPlotCountError) {
    throw new Error(ownedPlotCountError.message);
  }

  if ((ownedPlotCount ?? 0) >= plotOwnerLimits.maxTileClaimCount) {
    throw new Error(
      formattingWorldBuildingOwnerMaxTileClaimRejectionMessage(
        plotOwnerLimits.maxTileClaimCount,
      ),
    );
  }

  const { data, error } = await supabase
    .from("world_plots")
    .insert({
      owner_id: ownerUserId,
      min_tile_x: tileX,
      min_tile_y: tileY,
      max_tile_x: tileX,
      max_tile_y: tileY,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not claim tile.");
  }

  return data.id as string;
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
  const claimBufferTiles =
    DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES;
  const tilePosition = creatingWorldBuildingTilePosition(tileX, tileY);
  const nearbyPlots = await fetchingWorldBuildingPlotsByBounds({
    minTileX: tileX - claimBufferTiles,
    minTileY: tileY - claimBufferTiles,
    maxTileX: tileX + claimBufferTiles,
    maxTileY: tileY + claimBufferTiles,
  });

  if (
    checkingWorldBuildingTilePositionWithinOtherOwnerClaimBuffer(
      nearbyPlots,
      tilePosition,
      ownerUserId,
    )
  ) {
    throw new Error(
      CHECKING_WORLD_BUILDING_TILE_OTHER_OWNER_CLAIM_BUFFER_REJECTION_MESSAGE,
    );
  }

  const supabase = createClient();
  const plotOwnerLimits =
    await fetchingWorldBuildingPlotOwnerLimitsByUserId(ownerUserId);

  const { count: ownedTemporaryPlotCount, error: ownedTemporaryPlotCountError } =
    await supabase
      .from("world_plots")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", ownerUserId)
      .eq("is_temporary", true);

  if (ownedTemporaryPlotCountError) {
    throw new Error(ownedTemporaryPlotCountError.message);
  }

  if (
    (ownedTemporaryPlotCount ?? 0) >= plotOwnerLimits.maxTemporaryTileCount
  ) {
    throw new Error(
      formattingWorldBuildingOwnerMaxTemporaryTileClaimRejectionMessage(
        plotOwnerLimits.maxTemporaryTileCount,
      ),
    );
  }

  const { data, error } = await supabase
    .from("world_plots")
    .insert({
      owner_id: ownerUserId,
      min_tile_x: tileX,
      min_tile_y: tileY,
      max_tile_x: tileX,
      max_tile_y: tileY,
      is_temporary: true,
      expires_at: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not claim temporary tile.");
  }

  return data.id as string;
}
