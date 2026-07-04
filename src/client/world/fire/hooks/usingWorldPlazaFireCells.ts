'use client';

import { DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT } from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import { listingWorldPlazaLocalFireCells } from '@/components/world/fire/domains/managingWorldPlazaLocalFireCells';
import { fetchingWorldFireDevvitCells } from '@/components/world/fire/repositories/callingWorldFireDevvitApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import {
  WORLD_FIRE_DEVVIT_CELLS_API_PATH,
  WORLD_FIRE_DEVVIT_CELLS_POLL_INTERVAL_MS,
  type WorldFireDevvitCell,
} from '../../../../shared/worldFireDevvit';

export const DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT =
  'world-fire-cells' as const;

/** Params for {@link usingWorldPlazaFireCells}. */
export type UsingWorldPlazaFireCellsParams = {
  readonly enabled: boolean;
  readonly onlineUserId: string | null;
  /** Single-player slot owner id; enables local fire simulation offline. */
  readonly localPersistenceOwnerId?: string | null;
};

/** Return shape for {@link usingWorldPlazaFireCells}. */
export type UsingWorldPlazaFireCellsResult = {
  readonly fireCells: readonly WorldFireDevvitCell[];
  readonly isReady: boolean;
};

/**
 * Polls fire cells and invalidates placed blocks when burns occur.
 *
 * Online rooms poll the server-authoritative simulation; single-player
 * sessions run the identical simulation locally against localStorage.
 */
export function usingWorldPlazaFireCells({
  enabled,
  onlineUserId,
  localPersistenceOwnerId = null,
}: UsingWorldPlazaFireCellsParams): UsingWorldPlazaFireCellsResult {
  const queryClient = useQueryClient();
  const lastBurnedBlockIdsRef = useRef<readonly string[]>([]);
  const isLocalSession =
    onlineUserId === null &&
    typeof localPersistenceOwnerId === 'string' &&
    localPersistenceOwnerId.length > 0;

  const localFireCellsQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT,
      'local',
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalFireCells(localPersistenceOwnerId ?? ''),
    enabled: enabled && isLocalSession,
    staleTime: 1_000,
    refetchInterval: WORLD_FIRE_DEVVIT_CELLS_POLL_INTERVAL_MS,
  });

  const fireCellsQuery = useQuery({
    queryKey: [DEFINING_WORLD_PLAZA_FIRE_CELLS_QUERY_KEY_ROOT, onlineUserId],
    queryFn: () =>
      fetchingWorldFireDevvitCells(WORLD_FIRE_DEVVIT_CELLS_API_PATH),
    enabled: enabled && Boolean(onlineUserId),
    staleTime: 1_000,
    refetchInterval: WORLD_FIRE_DEVVIT_CELLS_POLL_INTERVAL_MS,
  });

  useEffect(() => {
    const burnedBlockIds = fireCellsQuery.data?.burnedBlockIds ?? [];

    if (burnedBlockIds.length === 0) {
      return;
    }

    const previousBurnedBlockIds = lastBurnedBlockIdsRef.current;
    const hasNewBurns = burnedBlockIds.some(
      (blockId) => !previousBurnedBlockIds.includes(blockId)
    );

    lastBurnedBlockIdsRef.current = burnedBlockIds;

    if (!hasNewBurns) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: [DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT],
    });
    void queryClient.invalidateQueries({
      queryKey: ['world-building-owned-plots'],
    });
  }, [fireCellsQuery.data?.burnedBlockIds, queryClient]);

  if (isLocalSession) {
    return {
      fireCells: localFireCellsQuery.data ?? [],
      isReady: !enabled || localFireCellsQuery.isSuccess,
    };
  }

  return {
    fireCells: fireCellsQuery.data?.cells ?? [],
    isReady: !enabled || !onlineUserId || fireCellsQuery.isSuccess,
  };
}
