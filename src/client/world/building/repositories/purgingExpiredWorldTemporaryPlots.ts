import { createClient } from "@/lib/supabase/client";

/**
 * Purges expired temporary plots for the signed-in user.
 *
 * @module components/world/building/repositories/purgingExpiredWorldTemporaryPlots
 */

/**
 * Deletes temporary plots whose expiry timestamp has passed.
 */
export async function purgingExpiredWorldTemporaryPlots(): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "purging_expired_world_temporary_plots_for_user",
  );

  if (error) {
    throw new Error(error.message);
  }

  return typeof data === "number" ? data : 0;
}
