import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { droppingWildlifeMeatGroundItem } from '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { replacingWildlifeInstance } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { syncingWildlifePetDeathToRoster } from '@/components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster';
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
 * Marks loot as in-flight and spawns raw meat when an animal dies (leader-only).
 * Clears the mark if persist fails so a later tick can retry.
 *
 * Persistent companions stay on the roster (undeployed, HP 0) so a future
 * revive can restore them, while freeing a living-active slot immediately.
 */
export function attemptingWildlifeMeatGroundDropOnDeath(
  store: ManagingWildlifeInstanceStore,
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  meatDropContext: DefiningWildlifeMeatDropContext | null | undefined,
  killContext?: DefiningWildlifeMeatDropKillContext | null
): DefiningWildlifeInstance {
  if (instance.isDead && instance.petBond) {
    syncingWildlifePetDeathToRoster(instance, killContext?.nowMs ?? Date.now());
  }

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
  }).then((result) => {
    if (result.outcome === 'dropped') {
      return;
    }

    const current = store.instances.get(instance.instanceId);

    if (!current?.isDead || !current.hasDroppedLoot) {
      return;
    }

    replacingWildlifeInstance(store, {
      ...current,
      hasDroppedLoot: false,
    });
  });

  return markedInstance;
}
