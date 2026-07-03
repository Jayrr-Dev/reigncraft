"use client";

/**
 * TanStack Query hook for outgoing plot visit requests.
 *
 * @module components/world/plotVisit/hooks/usingWorldPlotVisitRequestsOutgoing
 */

import {
  WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
  type WorldPlotVisitRequestsOutgoingPage,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { fetchingWorldPlotVisitRequestsOutgoing } from "@/components/world/plotVisit/utils/fetchingWorldPlotVisitRequestsOutgoing";
import { useQuery } from "@tanstack/react-query";

/** Stale time for outgoing visit requests (ms). */
const WORLD_PLOT_VISIT_REQUESTS_OUTGOING_STALE_TIME_MS = 10_000;

/** Polling interval when claim mode or plaza is active (ms). */
const WORLD_PLOT_VISIT_REQUESTS_OUTGOING_POLL_INTERVAL_MS = 15_000;

/** Props for {@link usingWorldPlotVisitRequestsOutgoing}. */
export interface UsingWorldPlotVisitRequestsOutgoingOptions {
  enabled?: boolean;
  polling?: boolean;
}

/**
 * Loads pending and approved-unacknowledged visit requests for the viewer.
 *
 * @param options - Query toggles
 */
export function usingWorldPlotVisitRequestsOutgoing({
  enabled = true,
  polling = false,
}: UsingWorldPlotVisitRequestsOutgoingOptions = {}) {
  return useQuery<WorldPlotVisitRequestsOutgoingPage>({
    queryKey: WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
    queryFn: fetchingWorldPlotVisitRequestsOutgoing,
    enabled,
    staleTime: WORLD_PLOT_VISIT_REQUESTS_OUTGOING_STALE_TIME_MS,
    refetchInterval: polling
      ? WORLD_PLOT_VISIT_REQUESTS_OUTGOING_POLL_INTERVAL_MS
      : false,
    placeholderData: (previousData) => previousData,
  });
}
