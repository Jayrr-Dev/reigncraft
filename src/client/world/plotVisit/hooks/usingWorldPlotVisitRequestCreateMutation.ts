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
import { DEFINING_REIGNCRAFT_TOASTER_ID } from "@/components/ui/domains/definingReigncraftToastConstants";
import {
  showingReigncraftToastError,
  showingReigncraftToastSuccess,
} from "@/components/ui/domains/showingReigncraftToast";

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

      showingReigncraftToastSuccess(
        `Visit request sent to ${variables.hostDisplayName.trim() || "your friend"}`,
        { toasterId: DEFINING_REIGNCRAFT_TOASTER_ID.plaza }
      );
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Could not send that visit request. Try again.";

      showingReigncraftToastError(message, {
        toasterId: DEFINING_REIGNCRAFT_TOASTER_ID.plaza,
      });
    },
  });
}
