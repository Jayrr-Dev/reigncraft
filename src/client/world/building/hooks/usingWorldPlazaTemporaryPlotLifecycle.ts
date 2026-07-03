"use client";

import { purgingExpiredWorldTemporaryPlots } from "@/components/world/building/repositories/purgingExpiredWorldTemporaryPlots";
import { useQuery } from "@tanstack/react-query";

/** TanStack Query key for temporary plot purge on plaza load. */
const USING_WORLD_PLAZA_TEMPORARY_PLOT_LIFECYCLE_QUERY_KEY_ROOT =
  "world-temporary-plot-lifecycle" as const;

/** Params for {@link usingWorldPlazaTemporaryPlotLifecycle}. */
export interface UsingWorldPlazaTemporaryPlotLifecycleParams {
  isEnabled: boolean;
  onlineUserId: string | null;
}

/**
 * Purges expired temporary plots when the plaza loads for a signed-in user.
 *
 * @param params - Enable flag and authenticated user id.
 */
export function usingWorldPlazaTemporaryPlotLifecycle({
  isEnabled,
  onlineUserId,
}: UsingWorldPlazaTemporaryPlotLifecycleParams): void {
  useQuery({
    queryKey: [
      USING_WORLD_PLAZA_TEMPORARY_PLOT_LIFECYCLE_QUERY_KEY_ROOT,
      onlineUserId,
    ],
    queryFn: async () => {
      const deletedCount = await purgingExpiredWorldTemporaryPlots();
      return { deletedCount };
    },
    enabled: isEnabled && Boolean(onlineUserId),
    staleTime: 60_000,
    retry: 1,
  });
}
