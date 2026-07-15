import { DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT } from '@/components/world/harvest/domains/definingWorldPlazaFlowerPickConstants';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { formattingWorldPlazaPickedFlowerTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { QueryClient } from '@tanstack/react-query';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/**
 * Optimistic picked-flower React Query cache updates.
 *
 * @module components/world/harvest/domains/applyingWorldPlazaPickedFlowerOptimisticCache
 */

export type ApplyingWorldPlazaPickedFlowerOptimisticCacheParams = {
  readonly queryClient: QueryClient;
  readonly useLocalPersistence: boolean;
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly tileX: number;
  readonly tileY: number;
};

type PickedFlowersQueryData = {
  readonly pickedFlowerStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >;
};

function resolvingWorldPlazaPickedFlowersQueryKey(
  params: Pick<
    ApplyingWorldPlazaPickedFlowerOptimisticCacheParams,
    | 'useLocalPersistence'
    | 'localPersistenceOwnerId'
    | 'redditUserId'
    | 'saveSlotIndex'
  >
): readonly unknown[] {
  if (params.useLocalPersistence) {
    return [
      DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT,
      'local',
      params.localPersistenceOwnerId,
    ];
  }

  return [
    DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT,
    'devvit',
    params.redditUserId,
    params.saveSlotIndex,
  ];
}

function withPickedFlowerTile(
  current: PickedFlowersQueryData | undefined,
  tileKey: string,
  isPicked: boolean
): PickedFlowersQueryData {
  const nextMap = new Map(current?.pickedFlowerStateByTileKey ?? []);

  if (isPicked) {
    nextMap.set(tileKey, { isPicked: true });
  } else {
    nextMap.delete(tileKey);
  }

  return { pickedFlowerStateByTileKey: nextMap };
}

/**
 * Marks a flower tile picked in the React Query cache immediately.
 * Survives a failed / timed-out picked-flowers poll after a successful pick.
 */
export function applyingWorldPlazaPickedFlowerOptimisticCache(
  params: ApplyingWorldPlazaPickedFlowerOptimisticCacheParams
): void {
  const tileKey = formattingWorldPlazaPickedFlowerTileKey(
    params.tileX,
    params.tileY
  );
  const queryKey = resolvingWorldPlazaPickedFlowersQueryKey(params);

  params.queryClient.setQueryData<PickedFlowersQueryData>(
    queryKey,
    (current) => withPickedFlowerTile(current, tileKey, true)
  );
}

/**
 * Reverts an optimistic flower pick when the server rejects the mutation.
 */
export function revertingWorldPlazaPickedFlowerOptimisticCache(
  params: ApplyingWorldPlazaPickedFlowerOptimisticCacheParams
): void {
  const tileKey = formattingWorldPlazaPickedFlowerTileKey(
    params.tileX,
    params.tileY
  );
  const queryKey = resolvingWorldPlazaPickedFlowersQueryKey(params);

  params.queryClient.setQueryData<PickedFlowersQueryData>(
    queryKey,
    (current) => withPickedFlowerTile(current, tileKey, false)
  );
}
