/**
 * Resolves claim list visit button state from outgoing visit requests.
 *
 * @module components/world/plotVisit/domains/resolvingWorldPlotVisitClaimListActionState
 */

import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import {
  resolvingWorldPlotVisitRequestBoundsKey,
  type WorldPlotVisitRequestOutgoingListMember,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";

/** Visit action shown on one friend plot row in claim mode. */
export type ResolvingWorldPlotVisitClaimListActionKind =
  | "visit"
  | "pending"
  | "go";

/** Resolved visit action for one friend plot row. */
export interface ResolvingWorldPlotVisitClaimListActionState {
  kind: ResolvingWorldPlotVisitClaimListActionKind;
  requestId: string | null;
}

/**
 * Builds a lookup from plot bounds keys to outgoing visit request state.
 *
 * @param outgoingRequests - Pending and approved visit requests for the viewer
 */
export function groupingWorldPlotVisitOutgoingRequestsByBoundsKey(
  outgoingRequests: readonly WorldPlotVisitRequestOutgoingListMember[],
): ReadonlyMap<string, WorldPlotVisitRequestOutgoingListMember> {
  const requestsByBoundsKey = new Map<
    string,
    WorldPlotVisitRequestOutgoingListMember
  >();

  for (const request of outgoingRequests) {
    requestsByBoundsKey.set(
      resolvingWorldPlotVisitRequestBoundsKey(request.hostUserId, request.bounds),
      request,
    );
  }

  return requestsByBoundsKey;
}

/**
 * Resolves the visit button state for one friend plot row.
 *
 * @param hostUserId - Plot owner auth user id
 * @param bounds - Plot tile bounds for the row
 * @param outgoingRequestsByBoundsKey - Outgoing requests keyed by bounds
 * @param pendingHostUserIds - Host ids with any pending outgoing request
 */
export function resolvingWorldPlotVisitClaimListActionState(
  hostUserId: string,
  bounds: DefiningWorldBuildingPlotBounds,
  outgoingRequestsByBoundsKey: ReadonlyMap<
    string,
    WorldPlotVisitRequestOutgoingListMember
  >,
  pendingHostUserIds: ReadonlySet<string>,
): ResolvingWorldPlotVisitClaimListActionState {
  const boundsRequest = outgoingRequestsByBoundsKey.get(
    resolvingWorldPlotVisitRequestBoundsKey(hostUserId, bounds),
  );

  if (boundsRequest?.status === "approved") {
    return {
      kind: "go",
      requestId: boundsRequest.requestId,
    };
  }

  if (pendingHostUserIds.has(hostUserId)) {
    return {
      kind: "pending",
      requestId: boundsRequest?.requestId ?? null,
    };
  }

  return {
    kind: "visit",
    requestId: null,
  };
}

/**
 * Collects host user ids with a pending outgoing visit request.
 *
 * @param outgoingRequests - Pending and approved visit requests for the viewer
 */
export function groupingWorldPlotVisitPendingHostUserIds(
  outgoingRequests: readonly WorldPlotVisitRequestOutgoingListMember[],
): ReadonlySet<string> {
  const pendingHostUserIds = new Set<string>();

  for (const request of outgoingRequests) {
    if (request.status === "pending") {
      pendingHostUserIds.add(request.hostUserId);
    }
  }

  return pendingHostUserIds;
}
