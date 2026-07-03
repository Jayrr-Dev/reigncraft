/**
 * Approves or declines one incoming plot visit request.
 *
 * @module components/world/plotVisit/utils/respondingWorldPlotVisitRequest
 */

import {
  DEFINING_WORLD_PLOT_VISIT_REQUEST_RESPOND_RPC_NAME,
  type WorldPlotVisitRequestRespondResult,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { createClient } from "@/lib/supabase/client";

/** Action passed to {@link respondingWorldPlotVisitRequest}. */
export type RespondingWorldPlotVisitRequestAction = "approve" | "decline";

/**
 * Parses the respond visit request RPC payload.
 *
 * @param data - Raw RPC jsonb payload
 */
function parsingWorldPlotVisitRequestRespondPayload(
  data: unknown,
): WorldPlotVisitRequestRespondResult | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const actionRaw = record.action;

  if (actionRaw !== "approved" && actionRaw !== "declined") {
    return null;
  }

  return { action: actionRaw };
}

/**
 * Approves or declines one pending plot visit request.
 *
 * @param requestId - Visit request id
 * @param action - Approve or decline
 */
export async function respondingWorldPlotVisitRequest(
  requestId: string,
  action: RespondingWorldPlotVisitRequestAction,
): Promise<WorldPlotVisitRequestRespondResult | null> {
  if (!requestId.trim()) {
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    DEFINING_WORLD_PLOT_VISIT_REQUEST_RESPOND_RPC_NAME,
    {
      p_request_id: requestId,
      p_action: action,
    },
  );

  if (error) {
    console.error("Failed to respond to world plot visit request:", error);
    return null;
  }

  return parsingWorldPlotVisitRequestRespondPayload(data);
}
