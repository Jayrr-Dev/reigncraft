'use client';

import { DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT } from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import { updatingWorldPlazaLitCampfireHeatTilesFromFireCells } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
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
  readonly extinguishedCampfireTileKeys: readonly string[];
  readonly burntGrassTileKeys: readonly string[];
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
  const lastExtinguishedCampfireTileKeysRef = useRef<readonly string[]>([]);
  const lastBurntGrassTileKeysRef = useRef<readonly string[]>([]);
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
    const extinguishedCampfireTileKeys =
      fireCellsQuery.data?.extinguishedCampfireTileKeys ?? [];
    const burntGrassTileKeys = fireCellsQuery.data?.burntGrassTileKeys ?? [];

    if (
      burnedBlockIds.length === 0 &&
      extinguishedCampfireTileKeys.length === 0 &&
      burntGrassTileKeys.length === 0
    ) {
      return;
    }

    const previousBurnedBlockIds = lastBurnedBlockIdsRef.current;
    const hasNewBurns = burnedBlockIds.some(
      (blockId) => !previousBurnedBlockIds.includes(blockId)
    );
    const previousExtinguishedKeys =
      lastExtinguishedCampfireTileKeysRef.current;
    const hasNewExtinguishedCampfires = extinguishedCampfireTileKeys.some(
      (tileKey) => !previousExtinguishedKeys.includes(tileKey)
    );
    const previousBurntGrassTileKeys = lastBurntGrassTileKeysRef.current;
    const hasNewBurntGrassTiles = burntGrassTileKeys.some(
      (tileKey) => !previousBurntGrassTileKeys.includes(tileKey)
    );

    lastBurnedBlockIdsRef.current = burnedBlockIds;
    lastExtinguishedCampfireTileKeysRef.current = extinguishedCampfireTileKeys;
    lastBurntGrassTileKeysRef.current = burntGrassTileKeys;

    if (
      !hasNewBurns &&
      !hasNewExtinguishedCampfires &&
      !hasNewBurntGrassTiles
    ) {
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: [DEFINING_WORLD_BUILDING_PLOTS_QUERY_KEY_ROOT],
    });
    void queryClient.invalidateQueries({
      queryKey: ['world-building-owned-plots'],
    });
  }, [
    fireCellsQuery.data?.burnedBlockIds,
    fireCellsQuery.data?.extinguishedCampfireTileKeys,
    fireCellsQuery.data?.burntGrassTileKeys,
    queryClient,
  ]);

  if (isLocalSession) {
    const localFireState = localFireCellsQuery.data;
    const fireCells = localFireState?.cells ?? [];

    updatingWorldPlazaLitCampfireHeatTilesFromFireCells(fireCells);

    return {
      fireCells,
      extinguishedCampfireTileKeys:
        localFireState?.extinguishedCampfireTileKeys ?? [],
      burntGrassTileKeys: localFireState?.burntGrassTileKeys ?? [],
      isReady: !enabled || localFireCellsQuery.isSuccess,
    };
  }

  const fireCells = fireCellsQuery.data?.cells ?? [];

  updatingWorldPlazaLitCampfireHeatTilesFromFireCells(fireCells);

  return {
    fireCells,
    extinguishedCampfireTileKeys:
      fireCellsQuery.data?.extinguishedCampfireTileKeys ?? [],
    burntGrassTileKeys: fireCellsQuery.data?.burntGrassTileKeys ?? [],
    isReady: !enabled || !onlineUserId || fireCellsQuery.isSuccess,
  };
}
