/**
 * Optional live inventory grant bridge for Codex / out-of-band item rewards.
 * Registered by {@link usingWorldPlazaInventory} while the world inventory is mounted.
 *
 * @module components/world/inventory/domains/managingWorldPlazaInventoryLiveGrantStore
 */

export type GrantingWorldPlazaInventoryLiveItemResult =
  | 'granted'
  | 'inventory-full';

type WorldPlazaInventoryLiveGrantHandler = (
  itemTypeId: string
) => GrantingWorldPlazaInventoryLiveItemResult;

let managingWorldPlazaInventoryLiveGrantHandler: WorldPlazaInventoryLiveGrantHandler | null =
  null;
let managingWorldPlazaInventoryLiveGrantRegistrationCount = 0;

/**
 * Registers a live inventory grant handler for one mounted inventory session.
 * Returns a disposer that drops this registration.
 */
export function acquiringWorldPlazaInventoryLiveGrantHandler(
  handler: WorldPlazaInventoryLiveGrantHandler
): () => void {
  managingWorldPlazaInventoryLiveGrantRegistrationCount += 1;
  managingWorldPlazaInventoryLiveGrantHandler = handler;

  return () => {
    managingWorldPlazaInventoryLiveGrantRegistrationCount = Math.max(
      0,
      managingWorldPlazaInventoryLiveGrantRegistrationCount - 1
    );
    if (managingWorldPlazaInventoryLiveGrantRegistrationCount === 0) {
      managingWorldPlazaInventoryLiveGrantHandler = null;
    }
  };
}

/**
 * Grants one item through the live inventory engine when mounted.
 * Returns null when no world inventory session is registered.
 */
export function grantingWorldPlazaInventoryLiveItem(
  itemTypeId: string
): GrantingWorldPlazaInventoryLiveItemResult | null {
  if (managingWorldPlazaInventoryLiveGrantHandler === null) {
    return null;
  }

  return managingWorldPlazaInventoryLiveGrantHandler(itemTypeId);
}

/** Test helper. */
export function resettingWorldPlazaInventoryLiveGrantStoreForTests(): void {
  managingWorldPlazaInventoryLiveGrantHandler = null;
  managingWorldPlazaInventoryLiveGrantRegistrationCount = 0;
}
