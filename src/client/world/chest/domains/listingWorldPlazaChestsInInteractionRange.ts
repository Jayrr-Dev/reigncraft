/**
 * Lists selected chests that should show Open / Locked interaction labels.
 *
 * @module components/world/chest/domains/listingWorldPlazaChestsInInteractionRange
 */

import type { DefiningWorldPlazaChestInstance } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import {
  formattingWorldPlazaInteractableChestSelectionKey,
  parsingWorldPlazaInteractableChestSelectionKey,
} from '@/components/world/chest/domains/formattingWorldPlazaInteractableChestSelectionKey';
import {
  gettingWorldPlazaChestInstance,
  listingWorldPlazaChestInstances,
  type ManagingWorldPlazaChestInstanceStore,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';

export type ListingWorldPlazaChestsInInteractionRangeAction =
  | 'open'
  | 'unlock'
  | 'locked';

export type ListingWorldPlazaChestsInInteractionRangeEntry = {
  readonly chestId: string;
  readonly worldX: number;
  readonly worldY: number;
  readonly action: ListingWorldPlazaChestsInInteractionRangeAction;
  readonly isDisabled: boolean;
  readonly selectionKey: string;
};

/**
 * Lists chests whose interaction popover was opened (selected keys).
 * Closed → Open (enabled). Locked → Locked (disabled). Open → omitted.
 */
export function listingWorldPlazaChestsInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  playerHasChestKey: boolean = false,
  store?: ManagingWorldPlazaChestInstanceStore
): readonly ListingWorldPlazaChestsInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaChestsInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const chestId =
      parsingWorldPlazaInteractableChestSelectionKey(selectionKey);

    if (!chestId) {
      continue;
    }

    const instance = gettingWorldPlazaChestInstance(chestId, store);

    if (!instance) {
      continue;
    }

    const entry = resolvingWorldPlazaChestInteractionLabelEntry(
      instance,
      playerHasChestKey
    );

    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

/** Builds a label entry for one chest instance, or null when already open. */
export function resolvingWorldPlazaChestInteractionLabelEntry(
  instance: DefiningWorldPlazaChestInstance,
  playerHasChestKey: boolean = false
): ListingWorldPlazaChestsInInteractionRangeEntry | null {
  if (instance.state === 'open') {
    return null;
  }

  const action: ListingWorldPlazaChestsInInteractionRangeAction =
    instance.state === 'locked'
      ? playerHasChestKey
        ? 'unlock'
        : 'locked'
      : 'open';

  return {
    chestId: instance.chestId,
    worldX: instance.position.x,
    worldY: instance.position.y,
    action,
    isDisabled: action === 'locked',
    selectionKey: formattingWorldPlazaInteractableChestSelectionKey(
      instance.chestId
    ),
  };
}

/** Lists nearby chests for proximity selection keys. */
export function listingWorldPlazaChestsNearPlayerPosition(
  playerX: number,
  playerY: number,
  reachGrid: number,
  store?: ManagingWorldPlazaChestInstanceStore
): readonly DefiningWorldPlazaChestInstance[] {
  const reachSq = reachGrid * reachGrid;
  const nearby: DefiningWorldPlazaChestInstance[] = [];

  for (const instance of listingWorldPlazaChestInstances(store)) {
    const dx = instance.position.x - playerX;
    const dy = instance.position.y - playerY;

    if (dx * dx + dy * dy <= reachSq) {
      nearby.push(instance);
    }
  }

  return nearby;
}
