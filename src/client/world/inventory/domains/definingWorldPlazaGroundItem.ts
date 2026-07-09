/**
 * Ground item domain types for plaza world pickups.
 *
 * @module components/world/inventory/domains/definingWorldPlazaGroundItem
 */

/** One item stack lying on the plaza ground. */
export interface DefiningWorldPlazaGroundItem {
  /** Unique ground item instance id. */
  readonly id: string;
  /** Registered inventory item type id. */
  readonly itemTypeId: string;
  /** Stack count on the ground. */
  readonly quantity: number;
  /** Tile X coordinate. */
  readonly gridX: number;
  /** Tile Y coordinate. */
  readonly gridY: number;
  /** Optional world layer anchor. */
  readonly layer?: number;
  /** Epoch ms when the item was dropped on the server; drives auto-despawn. */
  readonly spawnedAt: number;
  /** Optional per-stack metadata (for example hidden meat provenance). */
  readonly metadata?: Readonly<Record<string, unknown>>;
}
