import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { droppingWildlifeMeatGroundItem } from '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { replacingWildlifeInstance } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type DefiningWildlifeMeatDropContext = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
};

export type DefiningWildlifeMeatDropKillContext = {
  readonly killerTargetId: string;
  readonly nowMs: number;
};

/**
 * Marks loot as dropped and spawns raw meat when an animal dies (leader-only).
 */
export function attemptingWildlifeMeatGroundDropOnDeath(
  store: ManagingWildlifeInstanceStore,
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  meatDropContext: DefiningWildlifeMeatDropContext | null | undefined,
  killContext?: DefiningWildlifeMeatDropKillContext | null
): DefiningWildlifeInstance {
  if (
    !meatDropContext ||
    !instance.isDead ||
    instance.hasDroppedLoot ||
    species.loot.quantity <= 0
  ) {
    return instance;
  }

  const markedInstance: DefiningWildlifeInstance = {
    ...instance,
    hasDroppedLoot: true,
  };

  replacingWildlifeInstance(store, markedInstance);

  void droppingWildlifeMeatGroundItem({
    localPersistenceOwnerId: meatDropContext.localPersistenceOwnerId,
    redditUserId: meatDropContext.redditUserId,
    saveSlotIndex: meatDropContext.saveSlotIndex,
    instance: markedInstance,
    species,
    playerPosition: meatDropContext.playerPosition,
    killContext,
  });

  return markedInstance;
}
