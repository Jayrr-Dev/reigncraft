/**
 * Core domain types for the generic inventory engine.
 *
 * @module components/inventory/domains/definingInventoryItem
 */

/** One stackable item instance occupying a single inventory slot. */
export interface DefiningInventoryItem {
  /** Unique instance id (UUID). */
  readonly id: string;
  /** Registered item type id. */
  readonly itemTypeId: string;
  /** Stack count (minimum 1). */
  readonly quantity: number;
  /** Zero-based slot index within the inventory. */
  readonly slotIndex: number;
  /** Optional per-instance metadata for future mechanics. */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/** One inventory slot: either an item or empty. */
export type DefiningInventorySlot = DefiningInventoryItem | null;

/** Full inventory state: fixed capacity with indexed slots. */
export interface DefiningInventoryState {
  /** Total slot count. */
  readonly capacity: number;
  /** Indexed slots (length === capacity). */
  readonly slots: readonly DefiningInventorySlot[];
}

/** Input shape for creating a new inventory item (slot assigned later). */
export interface DefiningInventoryItemInput {
  readonly id: string;
  readonly itemTypeId: string;
  readonly quantity?: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
