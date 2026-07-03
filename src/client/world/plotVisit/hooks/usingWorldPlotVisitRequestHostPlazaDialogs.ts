"use client";

/**
 * Shows incoming plot visit request dialogs while the viewer is in the plaza.
 *
 * @module components/world/plotVisit/hooks/usingWorldPlotVisitRequestHostPlazaDialogs
 */

import {
  WORLD_PLOT_VISIT_REQUESTS_INCOMING_QUERY_KEY,
  WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
  type WorldPlotVisitRequestIncomingListMember,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { fetchingWorldPlotVisitRequestsIncoming } from "@/components/world/plotVisit/utils/fetchingWorldPlotVisitRequestsIncoming";
import { respondingWorldPlotVisitRequest } from "@/components/world/plotVisit/utils/respondingWorldPlotVisitRequest";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/** Realtime channel prefix for incoming plot visit requests. */
const WORLD_PLOT_VISIT_REQUEST_HOST_PLAZA_DIALOG_REALTIME_CHANNEL_PREFIX =
  "world-plot-visit-request-host-plaza-dialog" as const;

/** Stale time for incoming visit requests in plaza dialogs (ms). */
const WORLD_PLOT_VISIT_REQUESTS_INCOMING_STALE_TIME_MS = 10_000;

/** Polling interval for incoming visit requests in plaza (ms). */
const WORLD_PLOT_VISIT_REQUESTS_INCOMING_POLL_INTERVAL_MS = 15_000;

/** Props for {@link usingWorldPlotVisitRequestHostPlazaDialogs}. */
export interface UsingWorldPlotVisitRequestHostPlazaDialogsOptions {
  enabled?: boolean;
  currentUserId?: string | null;
}

/** Result from {@link usingWorldPlotVisitRequestHostPlazaDialogs}. */
export interface UsingWorldPlotVisitRequestHostPlazaDialogsResult {
  activeVisitRequestDialog: WorldPlotVisitRequestIncomingListMember | null;
  approvingVisitRequestDialog: () => void;
  decliningVisitRequestDialog: () => void;
  dismissingVisitRequestDialogLater: () => void;
  isRespondingToVisitRequestDialog: boolean;
}

/**
 * Shows one incoming plot visit request dialog at a time for plot hosts.
 */
export function usingWorldPlotVisitRequestHostPlazaDialogs({
  enabled = true,
  currentUserId = null,
}: UsingWorldPlotVisitRequestHostPlazaDialogsOptions = {}): UsingWorldPlotVisitRequestHostPlazaDialogsResult {
  const queryClient = useQueryClient();
  const seenRequestIdsRef = useRef<Set<string>>(new Set());
  const queuedRequestIdsRef = useRef<string[]>([]);
  const hasInitializedRef = useRef(false);
  const rowsByRequestIdRef = useRef<
    Map<string, WorldPlotVisitRequestIncomingListMember>
  >(new Map());
  const [activeVisitRequestDialog, setActiveVisitRequestDialog] =
    useState<WorldPlotVisitRequestIncomingListMember | null>(null);

  const isQueryEnabled = enabled && Boolean(currentUserId) && hasEnvVars;

  const { data } = useQuery({
    queryKey: WORLD_PLOT_VISIT_REQUESTS_INCOMING_QUERY_KEY,
    queryFn: fetchingWorldPlotVisitRequestsIncoming,
    enabled: isQueryEnabled,
    staleTime: WORLD_PLOT_VISIT_REQUESTS_INCOMING_STALE_TIME_MS,
    refetchInterval: isQueryEnabled
      ? WORLD_PLOT_VISIT_REQUESTS_INCOMING_POLL_INTERVAL_MS
      : false,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    const rows = data?.rows ?? [];
    const nextMap = new Map<string, WorldPlotVisitRequestIncomingListMember>();

    for (const row of rows) {
      nextMap.set(row.requestId, row);
    }

    rowsByRequestIdRef.current = nextMap;
  }, [data?.rows]);

  const advancingVisitRequestDialogQueue = useCallback((): void => {
    while (queuedRequestIdsRef.current.length > 0) {
      const nextRequestId = queuedRequestIdsRef.current.shift();

      if (!nextRequestId) {
        break;
      }

      const nextRequest = rowsByRequestIdRef.current.get(nextRequestId);

      if (nextRequest) {
        setActiveVisitRequestDialog(nextRequest);
        return;
      }
    }

    setActiveVisitRequestDialog(null);
  }, []);

  const enqueueingVisitRequestDialog = useCallback(
    (request: WorldPlotVisitRequestIncomingListMember): void => {
      if (seenRequestIdsRef.current.has(request.requestId)) {
        return;
      }

      seenRequestIdsRef.current.add(request.requestId);

      if (activeVisitRequestDialog) {
        queuedRequestIdsRef.current.push(request.requestId);
        return;
      }

      setActiveVisitRequestDialog(request);
    },
    [activeVisitRequestDialog],
  );

  useEffect(() => {
    if (!isQueryEnabled) {
      return;
    }

    const rows = data?.rows ?? [];

    if (!hasInitializedRef.current) {
      for (const row of rows) {
        seenRequestIdsRef.current.add(row.requestId);
      }

      hasInitializedRef.current = true;
      return;
    }

    for (const row of rows) {
      if (!seenRequestIdsRef.current.has(row.requestId)) {
        enqueueingVisitRequestDialog(row);
      }
    }
  }, [data?.rows, enqueueingVisitRequestDialog, isQueryEnabled]);

  useEffect(() => {
    if (!isQueryEnabled || !currentUserId) {
      return;
    }

    const supabase = createClient();

    const channel = supabase
      .channel(
        `${WORLD_PLOT_VISIT_REQUEST_HOST_PLAZA_DIALOG_REALTIME_CHANNEL_PREFIX}-${currentUserId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "world_plot_visit_request",
          filter: `host_user_id=eq.${currentUserId}`,
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: WORLD_PLOT_VISIT_REQUESTS_INCOMING_QUERY_KEY,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, isQueryEnabled, queryClient]);

  useEffect(() => {
    if (!isQueryEnabled) {
      setActiveVisitRequestDialog(null);
      queuedRequestIdsRef.current = [];
      hasInitializedRef.current = false;
      seenRequestIdsRef.current.clear();
    }
  }, [isQueryEnabled]);

  const respondMutation = useMutation({
    mutationFn: ({
      requestId,
      action,
    }: {
      requestId: string;
      action: "approve" | "decline";
      requesterDisplayName: string;
    }) => respondingWorldPlotVisitRequest(requestId, action),
    onSuccess: (result, variables) => {
      if (!result) {
        toast.error("Could not update that visit request. Try again.");
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: WORLD_PLOT_VISIT_REQUESTS_INCOMING_QUERY_KEY,
      });
      void queryClient.invalidateQueries({
        queryKey: WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
      });

      if (result.action === "approved") {
        toast.success(
          `Approved ${variables.requesterDisplayName.trim() || "your friend"}'s visit`,
        );
      } else {
        toast.success(
          `Declined ${variables.requesterDisplayName.trim() || "that"} visit request`,
        );
      }

      advancingVisitRequestDialogQueue();
    },
    onError: () => {
      toast.error("Could not update that visit request. Try again.");
    },
  });

  const approvingVisitRequestDialog = useCallback((): void => {
    if (!activeVisitRequestDialog || respondMutation.isPending) {
      return;
    }

    respondMutation.mutate({
      requestId: activeVisitRequestDialog.requestId,
      action: "approve",
      requesterDisplayName: activeVisitRequestDialog.displayName,
    });
  }, [activeVisitRequestDialog, respondMutation]);

  const decliningVisitRequestDialog = useCallback((): void => {
    if (!activeVisitRequestDialog || respondMutation.isPending) {
      return;
    }

    respondMutation.mutate({
      requestId: activeVisitRequestDialog.requestId,
      action: "decline",
      requesterDisplayName: activeVisitRequestDialog.displayName,
    });
  }, [activeVisitRequestDialog, respondMutation]);

  const dismissingVisitRequestDialogLater = useCallback((): void => {
    if (respondMutation.isPending) {
      return;
    }

    advancingVisitRequestDialogQueue();
  }, [advancingVisitRequestDialogQueue, respondMutation.isPending]);

  return {
    activeVisitRequestDialog,
    approvingVisitRequestDialog,
    decliningVisitRequestDialog,
    dismissingVisitRequestDialogLater,
    isRespondingToVisitRequestDialog: respondMutation.isPending,
  };
}
