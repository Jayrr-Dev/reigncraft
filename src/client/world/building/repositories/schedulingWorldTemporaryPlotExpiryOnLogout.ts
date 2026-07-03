import { createClient } from "@/lib/supabase/client";

/**
 * Schedules temporary plot expiry when the player logs out.
 *
 * @module components/world/building/repositories/schedulingWorldTemporaryPlotExpiryOnLogout
 */

/**
 * Marks active temporary plots to expire 12 hours after logout.
 */
export async function schedulingWorldTemporaryPlotExpiryOnLogout(): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc(
    "scheduling_world_temporary_plot_expiry_for_user",
  );

  if (error) {
    throw new Error(error.message);
  }
}
