/**
 * Lists selected caltrops that should show Pick up labels.
 *
 * @module components/world/trap/domains/listingWorldPlazaCaltropsInInteractionRange
 */

import {
  formattingWorldPlazaInteractableCaltropSelectionKey,
  parsingWorldPlazaInteractableCaltropSelectionKey,
} from '@/components/world/trap/domains/formattingWorldPlazaInteractableCaltropSelectionKey';
import type { DefiningWorldPlazaCaltropInstance } from '@/components/world/trap/domains/definingWorldPlazaCaltropTypes';
import {
  gettingWorldPlazaCaltropInstance,
  listingWorldPlazaCaltropInstances,
  type ManagingWorldPlazaCaltropInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';

export type ListingWorldPlazaCaltropsInInteractionRangeAction = 'pick-up';

export type ListingWorldPlazaCaltropsInInteractionRangeEntry = {
  readonly trapId: string;
  readonly worldX: number;
  readonly worldY: number;
  readonly actions: readonly ListingWorldPlazaCaltropsInInteractionRangeAction[];
  readonly selectionKey: string;
};

/** Armed caltrops expose Pick up (they stay armed until stepped on). */
export function resolvingWorldPlazaCaltropInteractionLabelEntry(
  instance: DefiningWorldPlazaCaltropInstance
): ListingWorldPlazaCaltropsInInteractionRangeEntry {
  return {
    trapId: instance.trapId,
    worldX: instance.position.x,
    worldY: instance.position.y,
    actions: ['pick-up'],
    selectionKey: formattingWorldPlazaInteractableCaltropSelectionKey(
      instance.trapId
    ),
  };
}

/** Lists caltrops whose interaction popover was opened (selected keys). */
export function listingWorldPlazaCaltropsInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  store?: ManagingWorldPlazaCaltropInstanceStore
): readonly ListingWorldPlazaCaltropsInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaCaltropsInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const trapId =
      parsingWorldPlazaInteractableCaltropSelectionKey(selectionKey);

    if (!trapId) {
      continue;
    }

    const instance = gettingWorldPlazaCaltropInstance(trapId, store);

    if (!instance) {
      continue;
    }

    entries.push(resolvingWorldPlazaCaltropInteractionLabelEntry(instance));
  }

  return entries;
}

/** Lists nearby caltrops for proximity selection keys. */
export function listingWorldPlazaCaltropsNearPlayerPosition(
  playerX: number,
  playerY: number,
  reachGrid: number,
  store?: ManagingWorldPlazaCaltropInstanceStore
): readonly DefiningWorldPlazaCaltropInstance[] {
  const reachSq = reachGrid * reachGrid;
  const nearby: DefiningWorldPlazaCaltropInstance[] = [];

  for (const instance of listingWorldPlazaCaltropInstances(store)) {
    const dx = instance.position.x - playerX;
    const dy = instance.position.y - playerY;

    if (dx * dx + dy * dy <= reachSq) {
      nearby.push(instance);
    }
  }

  return nearby;
}
