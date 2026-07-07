/**
 * Maps plot visit request RPC payloads into typed list rows.
 *
 * @module components/world/plotVisit/utils/mappingWorldPlotVisitRequestsRpcPayload
 */

import { resolvingCommunityMemberProfileDisplayName } from "@/components/community/domains/resolvingCommunityMemberProfileCardDisplay";
import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import type {
  WorldPlotVisitRequestIncomingListMember,
  WorldPlotVisitRequestOutgoingListMember,
  WorldPlotVisitRequestStatus,
  WorldPlotVisitRequestsIncomingPage,
  WorldPlotVisitRequestsOutgoingPage,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";

/** Default incoming visit requests payload when parsing fails. */
const DEFAULT_WORLD_PLOT_VISIT_REQUESTS_INCOMING_PAGE: WorldPlotVisitRequestsIncomingPage =
  {
    rows: [],
  };

/** Default outgoing visit requests payload when parsing fails. */
const DEFAULT_WORLD_PLOT_VISIT_REQUESTS_OUTGOING_PAGE: WorldPlotVisitRequestsOutgoingPage =
  {
    rows: [],
  };

/**
 * Parses integer bounds from an RPC row.
 *
 * @param row - Raw RPC row object
 */
function parsingWorldPlotVisitRequestBoundsFromRow(
  row: Record<string, unknown>,
): DefiningWorldBuildingPlotBounds | null {
  const minTileX = row.min_tile_x;
  const minTileY = row.min_tile_y;
  const maxTileX = row.max_tile_x;
  const maxTileY = row.max_tile_y;

  if (
    typeof minTileX !== "number" ||
    typeof minTileY !== "number" ||
    typeof maxTileX !== "number" ||
    typeof maxTileY !== "number"
  ) {
    return null;
  }

  return {
    minTileX,
    minTileY,
    maxTileX,
    maxTileY,
  };
}

/**
 * Maps one incoming visit request RPC row.
 *
 * @param row - Raw RPC row object
 */
function mappingWorldPlotVisitRequestIncomingListMember(
  row: Record<string, unknown>,
): WorldPlotVisitRequestIncomingListMember | null {
  const requestIdRaw = row.request_id;
  const userIdRaw = row.user_id;
  const requestedAtRaw = row.requested_at;
  const bounds = parsingWorldPlotVisitRequestBoundsFromRow(row);

  if (typeof requestIdRaw !== "string" || !requestIdRaw.trim()) {
    return null;
  }

  if (typeof userIdRaw !== "string" || !userIdRaw.trim()) {
    return null;
  }

  if (typeof requestedAtRaw !== "string" || !requestedAtRaw.trim()) {
    return null;
  }

  if (!bounds) {
    return null;
  }

  const username =
    typeof row.username === "string" && row.username.trim().length > 0
      ? row.username.trim()
      : "";
  const alias =
    typeof row.alias === "string" && row.alias.trim().length > 0
      ? row.alias.trim()
      : null;
  const useAliasForCard = row.use_alias_for_card === true;
  const oauthAvatarUrl =
    typeof row.oauth_avatar_url === "string" && row.oauth_avatar_url.trim()
      ? row.oauth_avatar_url.trim()
      : null;
  const avatarUrl =
    typeof row.avatar_img === "string" && row.avatar_img.trim()
      ? row.avatar_img.trim()
      : null;

  return {
    requestId: requestIdRaw,
    userId: userIdRaw,
    username,
    alias,
    useAliasForCard,
    oauthAvatarUrl,
    avatarUrl,
    requestedAt: requestedAtRaw,
    bounds,
    displayName: resolvingCommunityMemberProfileDisplayName({
      userId: userIdRaw,
      username,
      alias,
      useAliasForCard,
    }),
  };
}

/**
 * Maps one outgoing visit request RPC row.
 *
 * @param row - Raw RPC row object
 */
function mappingWorldPlotVisitRequestOutgoingListMember(
  row: Record<string, unknown>,
): WorldPlotVisitRequestOutgoingListMember | null {
  const requestIdRaw = row.request_id;
  const hostUserIdRaw = row.host_user_id;
  const requestedAtRaw = row.requested_at;
  const statusRaw = row.status;
  const bounds = parsingWorldPlotVisitRequestBoundsFromRow(row);

  if (typeof requestIdRaw !== "string" || !requestIdRaw.trim()) {
    return null;
  }

  if (typeof hostUserIdRaw !== "string" || !hostUserIdRaw.trim()) {
    return null;
  }

  if (typeof requestedAtRaw !== "string" || !requestedAtRaw.trim()) {
    return null;
  }

  if (statusRaw !== "pending" && statusRaw !== "approved") {
    return null;
  }

  if (!bounds) {
    return null;
  }

  const username =
    typeof row.username === "string" && row.username.trim().length > 0
      ? row.username.trim()
      : "";
  const alias =
    typeof row.alias === "string" && row.alias.trim().length > 0
      ? row.alias.trim()
      : null;
  const useAliasForCard = row.use_alias_for_card === true;
  const oauthAvatarUrl =
    typeof row.oauth_avatar_url === "string" && row.oauth_avatar_url.trim()
      ? row.oauth_avatar_url.trim()
      : null;
  const avatarUrl =
    typeof row.avatar_img === "string" && row.avatar_img.trim()
      ? row.avatar_img.trim()
      : null;

  return {
    requestId: requestIdRaw,
    hostUserId: hostUserIdRaw,
    username,
    alias,
    useAliasForCard,
    oauthAvatarUrl,
    avatarUrl,
    requestedAt: requestedAtRaw,
    status: statusRaw as WorldPlotVisitRequestStatus,
    bounds,
    displayName: resolvingCommunityMemberProfileDisplayName({
      userId: hostUserIdRaw,
      username,
      alias,
      useAliasForCard,
    }),
  };
}

/**
 * Parses the incoming plot visit requests RPC payload.
 *
 * @param data - Raw RPC jsonb payload
 */
export function mappingWorldPlotVisitRequestsIncomingRpcPayload(
  data: unknown,
): WorldPlotVisitRequestsIncomingPage {
  if (!data || typeof data !== "object") {
    return DEFAULT_WORLD_PLOT_VISIT_REQUESTS_INCOMING_PAGE;
  }

  const record = data as Record<string, unknown>;
  const rowsRaw = record.rows;

  if (!Array.isArray(rowsRaw)) {
    return DEFAULT_WORLD_PLOT_VISIT_REQUESTS_INCOMING_PAGE;
  }

  const rows = rowsRaw
    .map((row) =>
      row && typeof row === "object"
        ? mappingWorldPlotVisitRequestIncomingListMember(
            row as Record<string, unknown>,
          )
        : null,
    )
    .filter(
      (row): row is WorldPlotVisitRequestIncomingListMember => row !== null,
    );

  return { rows };
}

/**
 * Parses the outgoing plot visit requests RPC payload.
 *
 * @param data - Raw RPC jsonb payload
 */
export function mappingWorldPlotVisitRequestsOutgoingRpcPayload(
  data: unknown,
): WorldPlotVisitRequestsOutgoingPage {
  if (!data || typeof data !== "object") {
    return DEFAULT_WORLD_PLOT_VISIT_REQUESTS_OUTGOING_PAGE;
  }

  const record = data as Record<string, unknown>;
  const rowsRaw = record.rows;

  if (!Array.isArray(rowsRaw)) {
    return DEFAULT_WORLD_PLOT_VISIT_REQUESTS_OUTGOING_PAGE;
  }

  const rows = rowsRaw
    .map((row) =>
      row && typeof row === "object"
        ? mappingWorldPlotVisitRequestOutgoingListMember(
            row as Record<string, unknown>,
          )
        : null,
    )
    .filter(
      (row): row is WorldPlotVisitRequestOutgoingListMember => row !== null,
    );

  return { rows };
}
