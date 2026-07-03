"use client";

/**
 * TanStack mutation hook for creating plot visit requests from claim mode.
 *
 * @module components/world/plotVisit/hooks/usingWorldPlotVisitRequestCreateMutation
 */

import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import { WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY } from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { creatingWorldPlotVisitRequest } from "@/components/world/plotVisit/utils/creatingWorldPlotVisitRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Variables for the create visit request mutation. */
export interface UsingWorldPlotVisitRequestCreateMutationVariables {
  hostUserId: string;
  hostDisplayName: string;
  bounds: DefiningWorldBuildingPlotBounds;
}

/**
 * Sends visit requests to friends and refreshes outgoing request state.
 */
export function usingWorldPlotVisitRequestCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UsingWorldPlotVisitRequestCreateMutationVariables) =>
      creatingWorldPlotVisitRequest({
        hostUserId: variables.hostUserId,
        bounds: variables.bounds,
      }),
    onSuccess: (_result, variables) => {
      void queryClient.invalidateQueries({
        queryKey: WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
      });

      toast.success(
        `Visit request sent to ${variables.hostDisplayName.trim() || "your friend"}`,
      );
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Could not send that visit request. Try again.";

      toast.error(message);
    },
  });
}
