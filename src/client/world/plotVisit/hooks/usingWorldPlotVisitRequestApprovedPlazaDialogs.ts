"use client";

/**
 * Shows approved plot visit dialogs for the requester while in the plaza.
 *
 * @module components/world/plotVisit/hooks/usingWorldPlotVisitRequestApprovedPlazaDialogs
 */

import {
  WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
  type WorldPlotVisitRequestOutgoingListMember,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { acknowledgingWorldPlotVisitRequest } from "@/components/world/plotVisit/utils/acknowledgingWorldPlotVisitRequest";
import { usingWorldPlotVisitRequestsOutgoing } from "@/components/world/plotVisit/hooks/usingWorldPlotVisitRequestsOutgoing";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

/** Realtime channel prefix for approved visit requests. */
const WORLD_PLOT_VISIT_REQUEST_APPROVED_PLAZA_DIALOG_REALTIME_CHANNEL_PREFIX =
  "world-plot-visit-request-approved-plaza-dialog" as const;

/** Props for {@link usingWorldPlotVisitRequestApprovedPlazaDialogs}. */
export interface UsingWorldPlotVisitRequestApprovedPlazaDialogsOptions {
  enabled?: boolean;
  currentUserId?: string | null;
}

/** Result from {@link usingWorldPlotVisitRequestApprovedPlazaDialogs}. */
export interface UsingWorldPlotVisitRequestApprovedPlazaDialogsResult {
  activeApprovedVisitDialog: WorldPlotVisitRequestOutgoingListMember | null;
  dismissingApprovedVisitDialogLater: () => void;
  acknowledgingApprovedVisitDialog: () => Promise<boolean>;
  isAcknowledgingApprovedVisitDialog: boolean;
}

/**
 * Surfaces newly approved visit requests so the requester can teleport.
 */
export function usingWorldPlotVisitRequestApprovedPlazaDialogs({
  enabled = true,
  currentUserId = null,
}: UsingWorldPlotVisitRequestApprovedPlazaDialogsOptions = {}): UsingWorldPlotVisitRequestApprovedPlazaDialogsResult {
  const queryClient = useQueryClient();
  const seenApprovedRequestIdsRef = useRef<Set<string>>(new Set());
  const queuedApprovedRequestIdsRef = useRef<string[]>([]);
  const hasInitializedRef = useRef(false);
  const rowsByRequestIdRef = useRef<
    Map<string, WorldPlotVisitRequestOutgoingListMember>
  >(new Map());
  const [activeApprovedVisitDialog, setActiveApprovedVisitDialog] =
    useState<WorldPlotVisitRequestOutgoingListMember | null>(null);

  const isQueryEnabled = enabled && Boolean(currentUserId) && hasEnvVars();

  const { data } = usingWorldPlotVisitRequestsOutgoing({
    enabled: isQueryEnabled,
    polling: isQueryEnabled,
  });

  useEffect(() => {
    const approvedRows = (data?.rows ?? []).filter(
      (row) => row.status === "approved",
    );
    const nextMap = new Map<string, WorldPlotVisitRequestOutgoingListMember>();

    for (const row of approvedRows) {
      nextMap.set(row.requestId, row);
    }

    rowsByRequestIdRef.current = nextMap;
  }, [data?.rows]);

  const advancingApprovedVisitDialogQueue = useCallback((): void => {
    while (queuedApprovedRequestIdsRef.current.length > 0) {
      const nextRequestId = queuedApprovedRequestIdsRef.current.shift();

      if (!nextRequestId) {
        break;
      }

      const nextRequest = rowsByRequestIdRef.current.get(nextRequestId);

      if (nextRequest) {
        setActiveApprovedVisitDialog(nextRequest);
        return;
      }
    }

    setActiveApprovedVisitDialog(null);
  }, []);

  const enqueueingApprovedVisitDialog = useCallback(
    (request: WorldPlotVisitRequestOutgoingListMember): void => {
      if (seenApprovedRequestIdsRef.current.has(request.requestId)) {
        return;
      }

      seenApprovedRequestIdsRef.current.add(request.requestId);

      if (activeApprovedVisitDialog) {
        queuedApprovedRequestIdsRef.current.push(request.requestId);
        return;
      }

      setActiveApprovedVisitDialog(request);
    },
    [activeApprovedVisitDialog],
  );

  useEffect(() => {
    if (!isQueryEnabled) {
      return;
    }

    const approvedRows = (data?.rows ?? []).filter(
      (row) => row.status === "approved",
    );

    if (!hasInitializedRef.current) {
      for (const row of approvedRows) {
        seenApprovedRequestIdsRef.current.add(row.requestId);
      }

      hasInitializedRef.current = true;
      return;
    }

    for (const row of approvedRows) {
      if (!seenApprovedRequestIdsRef.current.has(row.requestId)) {
        enqueueingApprovedVisitDialog(row);
      }
    }
  }, [data?.rows, enqueueingApprovedVisitDialog, isQueryEnabled]);

  useEffect(() => {
    if (!isQueryEnabled || !currentUserId) {
      return;
    }

    const supabase = createClient();

    const channel = supabase
      .channel(
        `${WORLD_PLOT_VISIT_REQUEST_APPROVED_PLAZA_DIALOG_REALTIME_CHANNEL_PREFIX}-${currentUserId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "world_plot_visit_request",
          filter: `requester_user_id=eq.${currentUserId}`,
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
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
      setActiveApprovedVisitDialog(null);
      queuedApprovedRequestIdsRef.current = [];
      hasInitializedRef.current = false;
      seenApprovedRequestIdsRef.current.clear();
    }
  }, [isQueryEnabled]);

  const acknowledgeMutation = useMutation({
    mutationFn: (requestId: string) =>
      acknowledgingWorldPlotVisitRequest(requestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
      });
    },
  });

  const acknowledgingApprovedVisitDialog = useCallback(async (): Promise<boolean> => {
    if (!activeApprovedVisitDialog || acknowledgeMutation.isPending) {
      return false;
    }

    const acknowledged = await acknowledgeMutation.mutateAsync(
      activeApprovedVisitDialog.requestId,
    );

    if (acknowledged) {
      advancingApprovedVisitDialogQueue();
    }

    return acknowledged;
  }, [
    acknowledgeMutation,
    activeApprovedVisitDialog,
    advancingApprovedVisitDialogQueue,
  ]);

  const dismissingApprovedVisitDialogLater = useCallback((): void => {
    if (acknowledgeMutation.isPending) {
      return;
    }

    advancingApprovedVisitDialogQueue();
  }, [acknowledgeMutation.isPending, advancingApprovedVisitDialogQueue]);

  return {
    activeApprovedVisitDialog,
    dismissingApprovedVisitDialogLater,
    acknowledgingApprovedVisitDialog,
    isAcknowledgingApprovedVisitDialog: acknowledgeMutation.isPending,
  };
}
