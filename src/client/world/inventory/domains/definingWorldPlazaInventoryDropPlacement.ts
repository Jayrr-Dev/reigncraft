/**
 * Domain types for inventory drag-to-ground drop placement.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryDropPlacement
 */

/** Tile under the pointer while dragging an item out of the hotbar. */
export interface DefiningWorldPlazaInventoryDropPreviewTile {
  readonly tileX: number;
  readonly tileY: number;
  readonly isValid: boolean;
}

/** Drop queued after drag release; resolved when the avatar arrives in range. */
export interface DefiningWorldPlazaInventoryPendingDrop {
  readonly slotIndex: number;
  readonly itemId: string;
  readonly itemTypeId: string;
  readonly quantity: number;
  readonly gridX: number;
  readonly gridY: number;
  readonly layer: number;
}
