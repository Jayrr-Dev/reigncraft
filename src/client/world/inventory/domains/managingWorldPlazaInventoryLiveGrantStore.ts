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

/**
 * Registers the live inventory grant handler (one active world inventory session).
 */
export function registeringWorldPlazaInventoryLiveGrantHandler(
  handler: WorldPlazaInventoryLiveGrantHandler | null
): void {
  managingWorldPlazaInventoryLiveGrantHandler = handler;
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
