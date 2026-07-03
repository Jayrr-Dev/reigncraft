/**
 * Acknowledges an approved plot visit after teleport or dismiss.
 *
 * @module components/world/plotVisit/utils/acknowledgingWorldPlotVisitRequest
 */

import { DEFINING_WORLD_PLOT_VISIT_REQUEST_ACK_RPC_NAME } from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { createClient } from "@/lib/supabase/client";

/**
 * Marks an approved visit request as acknowledged for the requester.
 *
 * @param requestId - Visit request id
 */
export async function acknowledgingWorldPlotVisitRequest(
  requestId: string,
): Promise<boolean> {
  if (!requestId.trim()) {
    return false;
  }

  const supabase = createClient();
  const { error } = await supabase.rpc(
    DEFINING_WORLD_PLOT_VISIT_REQUEST_ACK_RPC_NAME,
    {
      p_request_id: requestId,
    },
  );

  if (error) {
    console.error("Failed to acknowledge world plot visit request:", error);
    return false;
  }

  return true;
}
