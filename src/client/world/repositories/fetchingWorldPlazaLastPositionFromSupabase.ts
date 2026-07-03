import {
  creatingWorldPlazaLastPosition,
  type DefiningWorldPlazaLastPosition,
} from "@/components/world/domains/definingWorldPlazaLastPosition";
import { DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { createClient } from "@/lib/supabase/client";

/**
 * Loads the authenticated user's last plaza position from Supabase.
 *
 * @module components/world/repositories/fetchingWorldPlazaLastPositionFromSupabase
 */

/** Raw row shape from `world_plaza_player_positions`. */
interface FetchingWorldPlazaLastPositionRow {
  grid_x: number;
  grid_y: number;
  world_layer: number;
  updated_at: string;
}

/**
 * Fetches the caller's last plaza position row.
 *
 * @param onlineUserId - Auth user id for the active session.
 */
export async function fetchingWorldPlazaLastPositionFromSupabase(
  onlineUserId: string,
): Promise<DefiningWorldPlazaLastPosition | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("world_plaza_player_positions")
    .select("grid_x, grid_y, world_layer, updated_at")
    .eq("user_id", onlineUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const row = data as FetchingWorldPlazaLastPositionRow;

  if (
    !Number.isFinite(row.grid_x) ||
    !Number.isFinite(row.grid_y) ||
    !Number.isFinite(row.world_layer)
  ) {
    return null;
  }

  const updatedAtMs = Date.parse(row.updated_at);

  return creatingWorldPlazaLastPosition(
    row.grid_x,
    row.grid_y,
    row.world_layer >= DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER
      ? Math.floor(row.world_layer)
      : DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER,
    Number.isFinite(updatedAtMs) ? updatedAtMs : Date.now(),
  );
}
