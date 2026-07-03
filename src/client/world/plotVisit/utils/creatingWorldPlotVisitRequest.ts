/**
 * Creates a plot visit request for a friend's plot region.
 *
 * @module components/world/plotVisit/utils/creatingWorldPlotVisitRequest
 */

import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import {
  DEFINING_WORLD_PLOT_VISIT_REQUEST_CREATE_RPC_NAME,
  type WorldPlotVisitRequestCreateResult,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { createClient } from "@/lib/supabase/client";

/** Input for {@link creatingWorldPlotVisitRequest}. */
export interface CreatingWorldPlotVisitRequestInput {
  hostUserId: string;
  bounds: DefiningWorldBuildingPlotBounds;
}

/**
 * Parses the create visit request RPC payload.
 *
 * @param data - Raw RPC jsonb payload
 */
function parsingWorldPlotVisitRequestCreatePayload(
  data: unknown,
): WorldPlotVisitRequestCreateResult | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const requestIdRaw = record.request_id;
  const actionRaw = record.action;

  if (typeof requestIdRaw !== "string" || !requestIdRaw.trim()) {
    return null;
  }

  if (actionRaw !== "request_sent") {
    return null;
  }

  return {
    requestId: requestIdRaw,
    action: "request_sent",
  };
}

/**
 * Sends a visit request to a friend who owns the given plot bounds.
 *
 * @param input - Host user id and target plot bounds
 */
export async function creatingWorldPlotVisitRequest(
  input: CreatingWorldPlotVisitRequestInput,
): Promise<WorldPlotVisitRequestCreateResult | null> {
  const hostUserId = input.hostUserId.trim();

  if (!hostUserId) {
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    DEFINING_WORLD_PLOT_VISIT_REQUEST_CREATE_RPC_NAME,
    {
      p_host_user_id: hostUserId,
      p_min_tile_x: input.bounds.minTileX,
      p_min_tile_y: input.bounds.minTileY,
      p_max_tile_x: input.bounds.maxTileX,
      p_max_tile_y: input.bounds.maxTileY,
    },
  );

  if (error) {
    console.error("Failed to create world plot visit request:", error);
    throw new Error(error.message);
  }

  return parsingWorldPlotVisitRequestCreatePayload(data);
}
