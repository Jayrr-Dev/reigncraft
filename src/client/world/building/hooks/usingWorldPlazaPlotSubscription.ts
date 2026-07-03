"use client";

import {
  DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT,
} from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/** Params for {@link usingWorldPlazaPlotSubscription}. */
export interface UsingWorldPlazaPlotSubscriptionParams {
  isEnabled: boolean;
  refetchingPlots: () => Promise<unknown>;
}

/**
 * Subscribes to Supabase Realtime changes on placed blocks and invalidates plot queries.
 *
 * @param params - Enable flag and plot refetch callback.
 */
export function usingWorldPlazaPlotSubscription({
  isEnabled,
  refetchingPlots,
}: UsingWorldPlazaPlotSubscriptionParams): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const supabase = createClient();

    const channel = supabase
      .channel("world-building-placed-blocks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "world_placed_blocks",
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: [DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT],
          });
          void refetchingPlots();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isEnabled, queryClient, refetchingPlots]);
}
