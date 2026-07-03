"use client";

import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import {
  creatingWorldPlazaSavedCoords,
  type DefiningWorldPlazaSavedCoords,
} from "@/components/world/domains/definingWorldPlazaSavedCoords";
import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_MAX_COUNT,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_KEY_ROOT,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_STALE_TIME_MS,
} from "@/components/world/domains/definingWorldPlazaSavedCoordsConstants";
import {
  appendingWorldPlazaSavedCoordsToList,
  removingWorldPlazaSavedCoordsFromList,
} from "@/components/world/domains/resolvingWorldPlazaSavedCoordsListFromStorage";
import { readingWorldPlazaSavedCoordsFromStorage } from "@/components/world/domains/readingWorldPlazaSavedCoordsFromStorage";
import { writingWorldPlazaSavedCoordsToStorage } from "@/components/world/domains/writingWorldPlazaSavedCoordsToStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

/** Result from {@link usingWorldPlazaSavedCoordsQuery}. */
export interface UsingWorldPlazaSavedCoordsQueryResult {
  /** Persisted saved coordinates. */
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[];
  /** True while the initial saved coordinate load is in flight. */
  isLoadingSavedCoords: boolean;
  /** Whether another coordinate can be saved. */
  canSaveMoreCoords: boolean;
  /** Persists tile coordinates and updates the query cache. */
  savingCoordsAtTilePosition: (
    tilePosition: DefiningWorldBuildingTilePosition,
  ) => void;
  /** Removes one saved coordinate row. */
  deletingSavedCoords: (savedCoordsId: string) => void;
  /** True while a save mutation is running. */
  isSavingCoords: boolean;
  /** True while a delete mutation is running. */
  isDeletingSavedCoords: boolean;
}

/**
 * Loads and mutates the player's locally persisted saved plaza coordinates.
 *
 * @param isEnabled - When false, the query stays disabled.
 */
export function usingWorldPlazaSavedCoordsQuery(
  isEnabled: boolean,
): UsingWorldPlazaSavedCoordsQueryResult {
  const queryClient = useQueryClient();

  const savedCoordsQuery = useQuery({
    queryKey: [DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_KEY_ROOT],
    queryFn: readingWorldPlazaSavedCoordsFromStorage,
    enabled: isEnabled,
    staleTime: DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_STALE_TIME_MS,
  });

  const savedCoordsList = savedCoordsQuery.data ?? [];

  const canSaveMoreCoords = useMemo(
    () => savedCoordsList.length < DEFINING_WORLD_PLAZA_SAVED_COORDS_MAX_COUNT,
    [savedCoordsList.length],
  );

  const saveCoordsMutation = useMutation({
    mutationFn: async ({
      tilePosition,
      currentSavedCoordsList,
    }: {
      tilePosition: DefiningWorldBuildingTilePosition;
      currentSavedCoordsList: readonly DefiningWorldPlazaSavedCoords[];
    }): Promise<DefiningWorldPlazaSavedCoords[]> => {
      const nextSavedCoords = creatingWorldPlazaSavedCoords(
        tilePosition.tileX,
        tilePosition.tileY,
        Date.now(),
      );
      const nextSavedCoordsList = appendingWorldPlazaSavedCoordsToList(
        currentSavedCoordsList,
        nextSavedCoords,
      );

      writingWorldPlazaSavedCoordsToStorage(nextSavedCoordsList);
      return nextSavedCoordsList;
    },
    onSuccess: (nextSavedCoordsList) => {
      queryClient.setQueryData(
        [DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_KEY_ROOT],
        nextSavedCoordsList,
      );
    },
  });

  const deleteCoordsMutation = useMutation({
    mutationFn: async ({
      savedCoordsId,
      currentSavedCoordsList,
    }: {
      savedCoordsId: string;
      currentSavedCoordsList: readonly DefiningWorldPlazaSavedCoords[];
    }): Promise<DefiningWorldPlazaSavedCoords[]> => {
      const nextSavedCoordsList = removingWorldPlazaSavedCoordsFromList(
        currentSavedCoordsList,
        savedCoordsId,
      );

      writingWorldPlazaSavedCoordsToStorage(nextSavedCoordsList);
      return nextSavedCoordsList;
    },
    onSuccess: (nextSavedCoordsList) => {
      queryClient.setQueryData(
        [DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_KEY_ROOT],
        nextSavedCoordsList,
      );
    },
  });

  const savingCoordsAtTilePosition = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      if (!canSaveMoreCoords || saveCoordsMutation.isPending) {
        return;
      }

      saveCoordsMutation.mutate({
        tilePosition,
        currentSavedCoordsList: savedCoordsList,
      });
    },
    [canSaveMoreCoords, saveCoordsMutation, savedCoordsList],
  );

  const deletingSavedCoords = useCallback(
    (savedCoordsId: string): void => {
      if (deleteCoordsMutation.isPending) {
        return;
      }

      deleteCoordsMutation.mutate({
        savedCoordsId,
        currentSavedCoordsList: savedCoordsList,
      });
    },
    [deleteCoordsMutation, savedCoordsList],
  );

  return {
    savedCoordsList,
    isLoadingSavedCoords: savedCoordsQuery.isLoading,
    canSaveMoreCoords,
    savingCoordsAtTilePosition,
    deletingSavedCoords,
    isSavingCoords: saveCoordsMutation.isPending,
    isDeletingSavedCoords: deleteCoordsMutation.isPending,
  };
}
