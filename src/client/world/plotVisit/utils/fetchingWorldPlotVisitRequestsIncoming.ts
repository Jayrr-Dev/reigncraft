/**
 * Fetches incoming pending plot visit requests for the signed-in plot host.
 *
 * @module components/world/plotVisit/utils/fetchingWorldPlotVisitRequestsIncoming
 */

import {
  DEFINING_WORLD_PLOT_VISIT_REQUESTS_INCOMING_RPC_NAME,
  type WorldPlotVisitRequestsIncomingPage,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { mappingWorldPlotVisitRequestsIncomingRpcPayload } from "@/components/world/plotVisit/utils/mappingWorldPlotVisitRequestsRpcPayload";
import { createClient } from "@/lib/supabase/client";

/**
 * Loads pending visit requests addressed to the current viewer as plot host.
 */
export async function fetchingWorldPlotVisitRequestsIncoming(): Promise<WorldPlotVisitRequestsIncomingPage> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    DEFINING_WORLD_PLOT_VISIT_REQUESTS_INCOMING_RPC_NAME,
  );

  if (error) {
    console.error("Failed to fetch incoming world plot visit requests:", error);
    return { rows: [] };
  }

  return mappingWorldPlotVisitRequestsIncomingRpcPayload(data);
}
