/**
 * Fetches outgoing plot visit requests for the signed-in requester.
 *
 * @module components/world/plotVisit/utils/fetchingWorldPlotVisitRequestsOutgoing
 */

import {
  DEFINING_WORLD_PLOT_VISIT_REQUESTS_OUTGOING_RPC_NAME,
  type WorldPlotVisitRequestsOutgoingPage,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { mappingWorldPlotVisitRequestsOutgoingRpcPayload } from "@/components/world/plotVisit/utils/mappingWorldPlotVisitRequestsRpcPayload";
import { createClient } from "@/lib/supabase/client";

/**
 * Loads pending and approved-unacknowledged visit requests for the viewer.
 */
export async function fetchingWorldPlotVisitRequestsOutgoing(): Promise<WorldPlotVisitRequestsOutgoingPage> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(
    DEFINING_WORLD_PLOT_VISIT_REQUESTS_OUTGOING_RPC_NAME,
  );

  if (error) {
    console.error("Failed to fetch outgoing world plot visit requests:", error);
    return { rows: [] };
  }

  return mappingWorldPlotVisitRequestsOutgoingRpcPayload(data);
}
