import type { DefiningWorldPlazaLastPosition } from "@/components/world/domains/definingWorldPlazaLastPosition";
import { createClient } from "@/lib/supabase/client";

/**
 * Upserts the authenticated user's last plaza position in Supabase.
 *
 * @module components/world/repositories/upsertingWorldPlazaLastPositionToSupabase
 */

/**
 * Persists one last-position snapshot for the active user.
 *
 * @param onlineUserId - Auth user id for the active session.
 * @param lastPosition - Grid position to store remotely.
 */
export async function upsertingWorldPlazaLastPositionToSupabase(
  onlineUserId: string,
  lastPosition: DefiningWorldPlazaLastPosition,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("world_plaza_player_positions").upsert(
    {
      user_id: onlineUserId,
      grid_x: lastPosition.x,
      grid_y: lastPosition.y,
      world_layer: lastPosition.layer,
      updated_at: new Date(lastPosition.updatedAtMs).toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
