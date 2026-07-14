/**
 * Lists selected bear traps that should show Arm / Disarm / Pick up labels.
 *
 * @module components/world/trap/domains/listingWorldPlazaBearTrapsInInteractionRange
 */

import {
  formattingWorldPlazaInteractableBearTrapSelectionKey,
  parsingWorldPlazaInteractableBearTrapSelectionKey,
} from '@/components/world/trap/domains/formattingWorldPlazaInteractableBearTrapSelectionKey';
import type { DefiningWorldPlazaBearTrapInstance } from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';
import {
  gettingWorldPlazaBearTrapInstance,
  listingWorldPlazaBearTrapInstances,
  type ManagingWorldPlazaBearTrapInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';

export type ListingWorldPlazaBearTrapsInInteractionRangeAction =
  | 'arm'
  | 'disarm'
  | 'pick-up';

export type ListingWorldPlazaBearTrapsInInteractionRangeEntry = {
  readonly trapId: string;
  readonly worldX: number;
  readonly worldY: number;
  readonly actions: readonly ListingWorldPlazaBearTrapsInInteractionRangeAction[];
  readonly selectionKey: string;
};

/**
 * Closed traps (sprung / disarmed) expose Arm / Disarm / Pick up.
 * Armed traps stay silent so the open jaws are not labeled.
 */
export function resolvingWorldPlazaBearTrapInteractionLabelEntry(
  instance: DefiningWorldPlazaBearTrapInstance
): ListingWorldPlazaBearTrapsInInteractionRangeEntry | null {
  if (instance.state === 'armed') {
    return null;
  }

  const actions: ListingWorldPlazaBearTrapsInInteractionRangeAction[] =
    instance.state === 'sprung'
      ? ['arm', 'disarm', 'pick-up']
      : ['arm', 'pick-up'];

  return {
    trapId: instance.trapId,
    worldX: instance.position.x,
    worldY: instance.position.y,
    actions,
    selectionKey: formattingWorldPlazaInteractableBearTrapSelectionKey(
      instance.trapId
    ),
  };
}

/** Lists traps whose interaction popover was opened (selected keys). */
export function listingWorldPlazaBearTrapsInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  store?: ManagingWorldPlazaBearTrapInstanceStore
): readonly ListingWorldPlazaBearTrapsInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaBearTrapsInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const trapId =
      parsingWorldPlazaInteractableBearTrapSelectionKey(selectionKey);

    if (!trapId) {
      continue;
    }

    const instance = gettingWorldPlazaBearTrapInstance(trapId, store);

    if (!instance) {
      continue;
    }

    const entry = resolvingWorldPlazaBearTrapInteractionLabelEntry(instance);

    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

/** Lists nearby closed traps for proximity selection keys. */
export function listingWorldPlazaBearTrapsNearPlayerPosition(
  playerX: number,
  playerY: number,
  reachGrid: number,
  store?: ManagingWorldPlazaBearTrapInstanceStore
): readonly DefiningWorldPlazaBearTrapInstance[] {
  const reachSq = reachGrid * reachGrid;
  const nearby: DefiningWorldPlazaBearTrapInstance[] = [];

  for (const instance of listingWorldPlazaBearTrapInstances(store)) {
    if (instance.state === 'armed') {
      continue;
    }

    const dx = instance.position.x - playerX;
    const dy = instance.position.y - playerY;

    if (dx * dx + dy * dy <= reachSq) {
      nearby.push(instance);
    }
  }

  return nearby;
}
