/**
 * Friend plot visit request shapes, RPC names, and UI labels.
 *
 * @module components/world/plotVisit/domains/definingWorldPlotVisitRequest
 */

import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";

/** RPC name for creating a plot visit request. */
export const DEFINING_WORLD_PLOT_VISIT_REQUEST_CREATE_RPC_NAME =
  "creating_world_plot_visit_request" as const;

/** RPC name for incoming pending visit requests (plot host). */
export const DEFINING_WORLD_PLOT_VISIT_REQUESTS_INCOMING_RPC_NAME =
  "fetching_world_plot_visit_requests_incoming" as const;

/** RPC name for outgoing pending and approved visit requests (requester). */
export const DEFINING_WORLD_PLOT_VISIT_REQUESTS_OUTGOING_RPC_NAME =
  "fetching_world_plot_visit_requests_outgoing" as const;

/** RPC name for approving or declining a visit request. */
export const DEFINING_WORLD_PLOT_VISIT_REQUEST_RESPOND_RPC_NAME =
  "responding_world_plot_visit_request" as const;

/** RPC name for acknowledging an approved visit after teleport. */
export const DEFINING_WORLD_PLOT_VISIT_REQUEST_ACK_RPC_NAME =
  "acknowledging_world_plot_visit_request" as const;

/** TanStack Query key root for incoming plot visit requests. */
export const WORLD_PLOT_VISIT_REQUESTS_INCOMING_QUERY_KEY = [
  "world-plot-visit-requests-incoming",
] as const;

/** TanStack Query key root for outgoing plot visit requests. */
export const WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY = [
  "world-plot-visit-requests-outgoing",
] as const;

/** Title for the host visit request plaza modal. */
export const LABELING_WORLD_PLOT_VISIT_REQUEST_MODAL_TITLE =
  "Plot visit request" as const;

/** Approve button label for the host visit request modal. */
export const LABELING_WORLD_PLOT_VISIT_REQUEST_MODAL_APPROVE_BUTTON =
  "Allow visit" as const;

/** Decline button label for the host visit request modal. */
export const LABELING_WORLD_PLOT_VISIT_REQUEST_MODAL_DECLINE_BUTTON =
  "Decline" as const;

/** Later button label for the host visit request modal. */
export const LABELING_WORLD_PLOT_VISIT_REQUEST_MODAL_LATER_BUTTON =
  "Later" as const;

/** Accessible label for the host visit request plaza modal. */
export const LABELING_WORLD_PLOT_VISIT_REQUEST_MODAL_ARIA_LABEL =
  "Incoming plot visit request" as const;

/** Title for the approved visit plaza modal (requester). */
export const LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_TITLE =
  "Visit approved" as const;

/** Go now button on the approved visit modal. */
export const LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_GO_BUTTON =
  "Go now" as const;

/** Later button on the approved visit modal. */
export const LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_LATER_BUTTON =
  "Later" as const;

/** Accessible label for the approved visit plaza modal. */
export const LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_ARIA_LABEL =
  "Approved plot visit" as const;

/** Claim panel button to request a friend plot visit. */
export const LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_VISIT_BUTTON = "Visit" as const;

/** Claim panel button while a visit request is pending. */
export const LABELING_WORLD_PLOT_VISIT_CLAIM_LIST_PENDING_BUTTON =
  "Pending" as const;

/** Plot visit request status values stored in Postgres. */
export type WorldPlotVisitRequestStatus = "pending" | "approved" | "declined";

/** Result from the create visit request RPC. */
export interface WorldPlotVisitRequestCreateResult {
  requestId: string;
  action: "request_sent";
}

/** Result from the respond visit request RPC. */
export interface WorldPlotVisitRequestRespondResult {
  action: "approved" | "declined";
}

/** One incoming pending visit request for the plot host. */
export interface WorldPlotVisitRequestIncomingListMember {
  requestId: string;
  userId: string;
  username: string;
  alias: string | null;
  useAliasForCard: boolean;
  oauthAvatarUrl: string | null;
  avatarUrl: string | null;
  requestedAt: string;
  bounds: DefiningWorldBuildingPlotBounds;
  displayName: string;
}

/** Payload from {@link DEFINING_WORLD_PLOT_VISIT_REQUESTS_INCOMING_RPC_NAME}. */
export interface WorldPlotVisitRequestsIncomingPage {
  rows: WorldPlotVisitRequestIncomingListMember[];
}

/** One outgoing visit request for the requester. */
export interface WorldPlotVisitRequestOutgoingListMember {
  requestId: string;
  hostUserId: string;
  username: string;
  alias: string | null;
  useAliasForCard: boolean;
  oauthAvatarUrl: string | null;
  avatarUrl: string | null;
  requestedAt: string;
  status: WorldPlotVisitRequestStatus;
  bounds: DefiningWorldBuildingPlotBounds;
  displayName: string;
}

/** Payload from {@link DEFINING_WORLD_PLOT_VISIT_REQUESTS_OUTGOING_RPC_NAME}. */
export interface WorldPlotVisitRequestsOutgoingPage {
  rows: WorldPlotVisitRequestOutgoingListMember[];
}

/**
 * Resolves modal copy for an incoming plot visit request.
 *
 * @param requesterDisplayName - Friend who wants to visit
 * @param boundsLabel - Formatted plot coordinate label
 */
export function labelingWorldPlotVisitRequestModalMessage(
  requesterDisplayName: string,
  boundsLabel: string,
): string {
  const name = requesterDisplayName.trim() || "A friend";
  return `${name} wants to visit your plot at ${boundsLabel}.`;
}

/**
 * Resolves modal copy when a plot visit request was approved.
 *
 * @param hostDisplayName - Plot owner display name
 * @param boundsLabel - Formatted plot coordinate label
 */
export function labelingWorldPlotVisitApprovedModalMessage(
  hostDisplayName: string,
  boundsLabel: string,
): string {
  const name = hostDisplayName.trim() || "Your friend";
  return `${name} approved your visit to ${boundsLabel}.`;
}

/**
 * Builds a stable key for matching visit requests to plot bounds.
 *
 * @param hostUserId - Plot owner auth user id
 * @param bounds - Plot tile bounds
 */
export function resolvingWorldPlotVisitRequestBoundsKey(
  hostUserId: string,
  bounds: DefiningWorldBuildingPlotBounds,
): string {
  return `${hostUserId}:${bounds.minTileX},${bounds.minTileY},${bounds.maxTileX},${bounds.maxTileY}`;
}
