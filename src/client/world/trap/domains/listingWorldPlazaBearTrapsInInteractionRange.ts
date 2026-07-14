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
 * Actions follow trap state (Arm and Disarm are mutually exclusive):
 * - armed → Disarm / Pick up
 * - sprung / disarmed → Arm / Pick up
 */
export function resolvingWorldPlazaBearTrapInteractionLabelEntry(
  instance: DefiningWorldPlazaBearTrapInstance
): ListingWorldPlazaBearTrapsInInteractionRangeEntry {
  const actions: readonly ListingWorldPlazaBearTrapsInInteractionRangeAction[] =
    instance.state === 'armed'
      ? ['disarm', 'pick-up']
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

    entries.push(
      resolvingWorldPlazaBearTrapInteractionLabelEntry(instance)
    );
  }

  return entries;
}

/** Lists nearby traps for proximity selection keys (any state). */
export function listingWorldPlazaBearTrapsNearPlayerPosition(
  playerX: number,
  playerY: number,
  reachGrid: number,
  store?: ManagingWorldPlazaBearTrapInstanceStore
): readonly DefiningWorldPlazaBearTrapInstance[] {
  const reachSq = reachGrid * reachGrid;
  const nearby: DefiningWorldPlazaBearTrapInstance[] = [];

  for (const instance of listingWorldPlazaBearTrapInstances(store)) {
    const dx = instance.position.x - playerX;
    const dy = instance.position.y - playerY;

    if (dx * dx + dy * dy <= reachSq) {
      nearby.push(instance);
    }
  }

  return nearby;
}
