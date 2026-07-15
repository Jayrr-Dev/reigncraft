'use client';

import {
  listingWorldPlazaLocalPickedMushrooms,
  type DefiningWorldPlazaPickedMushroomTileState,
} from '@/components/world/mushrooms/domains/managingWorldPlazaLocalPickedMushrooms';
import { DEFINING_WORLD_PLAZA_PICKED_MUSHROOMS_QUERY_KEY_ROOT } from '@/components/world/mushrooms/hooks/usingWorldPlazaMushroomPickInteraction';
import { useQuery } from '@tanstack/react-query';

export type UsingWorldPlazaPickedMushroomsParams = {
  readonly enabled: boolean;
  readonly localPersistenceOwnerId?: string | null;
};

export type UsingWorldPlazaPickedMushroomsResult = {
  readonly pickedMushroomStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedMushroomTileState
  >;
  readonly isReady: boolean;
};

const EMPTY_PICKED_MUSHROOM_STATE_BY_TILE_KEY: ReadonlyMap<
  string,
  DefiningWorldPlazaPickedMushroomTileState
> = new Map();

/**
 * Loads locally persisted picked-mushroom state for rendering and interaction.
 */
export function usingWorldPlazaPickedMushrooms({
  enabled,
  localPersistenceOwnerId = null,
}: UsingWorldPlazaPickedMushroomsParams): UsingWorldPlazaPickedMushroomsResult {
  const localPickedMushroomsQuery = useQuery({
    queryKey: [
      DEFINING_WORLD_PLAZA_PICKED_MUSHROOMS_QUERY_KEY_ROOT,
      'local',
      localPersistenceOwnerId,
    ],
    queryFn: () =>
      listingWorldPlazaLocalPickedMushrooms(localPersistenceOwnerId ?? ''),
    enabled: enabled && Boolean(localPersistenceOwnerId),
    staleTime: 500,
    refetchInterval: 2_000,
  });

  return {
    pickedMushroomStateByTileKey:
      localPickedMushroomsQuery.data?.pickedMushroomStateByTileKey ??
      EMPTY_PICKED_MUSHROOM_STATE_BY_TILE_KEY,
    isReady:
      !enabled ||
      !localPersistenceOwnerId ||
      localPickedMushroomsQuery.isSuccess,
  };
}
