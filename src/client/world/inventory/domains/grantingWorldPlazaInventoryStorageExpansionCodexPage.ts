/**
 * Grants a packing-ledger inventory item for a Codex storage-expansion chest.
 * Marks the chest claimed only after the item lands in the bag.
 *
 * @module components/world/inventory/domains/grantingWorldPlazaInventoryStorageExpansionCodexPage
 */

import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { parsingInventoryState } from '@/components/inventory/domains/parsingInventoryState';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { resolvingWorldPlazaInventoryStorageKey } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TYPE_ID,
  type DefiningWorldPlazaInventoryStorageExpansionPageTier,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { grantingWorldPlazaInventoryLiveItem } from '@/components/world/inventory/domains/managingWorldPlazaInventoryLiveGrantStore';
import {
  checkingWorldPlazaInventoryStorageExpansionCodexClaimed,
  gettingWorldPlazaInventoryBonusStorageRows,
  gettingWorldPlazaInventoryStorageExpansionStorageOwnerId,
  markingWorldPlazaInventoryStorageExpansionCodexClaimed,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { resolvingWorldPlazaInventoryCapacity } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryCapacity';
import { resizingWorldPlazaInventoryStateToCapacity } from '@/components/world/inventory/domains/resizingWorldPlazaInventoryStateToCapacity';

export type GrantingWorldPlazaInventoryStorageExpansionCodexPageResult =
  | 'granted'
  | 'already-claimed'
  | 'inventory-full';

function grantingWorldPlazaInventoryStorageExpansionPageViaLocalStorage(
  itemTypeId: string,
  storageOwnerId: string
): 'granted' | 'inventory-full' {
  if (typeof window === 'undefined') {
    return 'inventory-full';
  }

  const storageKey = resolvingWorldPlazaInventoryStorageKey(storageOwnerId);
  const unlockedCapacity = resolvingWorldPlazaInventoryCapacity(
    gettingWorldPlazaInventoryBonusStorageRows()
  );

  let state = creatingEmptyInventoryState(unlockedCapacity);

  try {
    const rawJson = window.localStorage.getItem(storageKey);
    if (rawJson) {
      state = resizingWorldPlazaInventoryStateToCapacity(
        parsingInventoryState(
          JSON.parse(rawJson),
          DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_CAPACITY,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        ),
        unlockedCapacity
      );
    }
  } catch {
    state = creatingEmptyInventoryState(unlockedCapacity);
  }

  const addResult = addingWorldPlazaInventoryItemWithStacking(
    state,
    {
      id: crypto.randomUUID(),
      itemTypeId,
      quantity: 1,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < 1) {
    return 'inventory-full';
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(addResult.state));
  } catch {
    return 'inventory-full';
  }

  return 'granted';
}

/**
 * Puts the packing ledger in the player's bag, then marks the Codex chest claimed.
 */
export function grantingWorldPlazaInventoryStorageExpansionCodexPage(input: {
  readonly sectionId: string;
  readonly meterKind: string;
  readonly percent: number;
  readonly pageTier: DefiningWorldPlazaInventoryStorageExpansionPageTier;
}): GrantingWorldPlazaInventoryStorageExpansionCodexPageResult {
  if (
    checkingWorldPlazaInventoryStorageExpansionCodexClaimed({
      sectionId: input.sectionId,
      meterKind: input.meterKind,
      percent: input.percent,
    })
  ) {
    return 'already-claimed';
  }

  const itemTypeId =
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_PAGE_TYPE_ID[
      input.pageTier
    ];

  const liveResult = grantingWorldPlazaInventoryLiveItem(itemTypeId);
  let grantResult: 'granted' | 'inventory-full';

  if (liveResult !== null) {
    grantResult = liveResult;
  } else {
    const storageOwnerId =
      gettingWorldPlazaInventoryStorageExpansionStorageOwnerId();
    if (storageOwnerId === null) {
      return 'inventory-full';
    }
    grantResult = grantingWorldPlazaInventoryStorageExpansionPageViaLocalStorage(
      itemTypeId,
      storageOwnerId
    );
  }

  if (grantResult === 'inventory-full') {
    return 'inventory-full';
  }

  markingWorldPlazaInventoryStorageExpansionCodexClaimed({
    sectionId: input.sectionId,
    meterKind: input.meterKind,
    percent: input.percent,
  });

  return 'granted';
}
