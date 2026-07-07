import { resolvingWorldPlazaOnlineRoomDisplayName } from "@/components/world/domains/resolvingWorldPlazaOnlineRoomDisplayName";
import { createClient } from "@/lib/supabase/client";

/**
 * Resolves display labels for plot owners by auth user id.
 *
 * @module components/world/building/repositories/fetchingWorldBuildingPlotOwnerDisplayLabelsByUserIds
 */

/** Owner display label keyed by auth user id. */
export type FetchingWorldBuildingPlotOwnerDisplayLabelByUserId = Readonly<
  Record<string, string>
>;

/**
 * Loads username or alias labels for the given owner user ids.
 *
 * @param ownerUserIds - Unique auth user ids from plot rows.
 */
export async function fetchingWorldBuildingPlotOwnerDisplayLabelsByUserIds(
  ownerUserIds: readonly string[],
): Promise<FetchingWorldBuildingPlotOwnerDisplayLabelByUserId> {
  const uniqueOwnerUserIds = [
    ...new Set(ownerUserIds.map((ownerUserId) => ownerUserId.trim())),
  ].filter((ownerUserId) => ownerUserId.length > 0);

  if (uniqueOwnerUserIds.length === 0) {
    return {};
  }

  const supabase = createClient();

  const { data: userRows, error: userError } = await supabase
    .from("auth_user")
    .select("user_id, username, alias, email")
    .in("user_id", uniqueOwnerUserIds);

  if (userError) {
    throw new Error(userError.message);
  }

  const labelsByUserId: Record<string, string> = {};

  for (const userRow of Array.isArray(userRows) ? userRows : []) {
    if (
      typeof userRow !== 'object' ||
      userRow === null ||
      typeof userRow.user_id !== 'string'
    ) {
      continue;
    }

    labelsByUserId[userRow.user_id] = resolvingWorldPlazaOnlineRoomDisplayName(
      typeof userRow.username === 'string' ? userRow.username : null,
      typeof userRow.alias === 'string' ? userRow.alias : null,
      typeof userRow.email === 'string' ? userRow.email : null,
    );
  }

  for (const ownerUserId of uniqueOwnerUserIds) {
    if (!labelsByUserId[ownerUserId]) {
      labelsByUserId[ownerUserId] = "Member";
    }
  }

  return labelsByUserId;
}
