/**
 * Declarative types for fixed world chest props.
 *
 * @module components/world/chest/domains/definingWorldPlazaChestTypes
 */

export type DefiningWorldPlazaChestId = string;

export type DefiningWorldPlazaChestFacing = 'n' | 'e' | 's' | 'w';

export type DefiningWorldPlazaChestVariant = 'a' | 'b';

export type DefiningWorldPlazaChestState = 'open' | 'locked' | 'closed';

/** Visual sprite state (locked reuses the closed art). */
export type DefiningWorldPlazaChestSpriteVisualState = 'closed' | 'open';

export type DefiningWorldPlazaChestLootItem = {
  readonly kind: 'item';
  readonly itemTypeId: string;
  readonly quantity: number;
};

export type DefiningWorldPlazaChestLootPool = {
  readonly kind: 'pool';
  /** Must match a key in `DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY`. */
  readonly poolId: string;
};

export type DefiningWorldPlazaChestLoot =
  | DefiningWorldPlazaChestLootItem
  | DefiningWorldPlazaChestLootPool;

export type DefiningWorldPlazaChestPlacement = {
  readonly chestId: DefiningWorldPlazaChestId;
  readonly worldX: number;
  readonly worldY: number;
  readonly facing: DefiningWorldPlazaChestFacing;
  readonly variant: DefiningWorldPlazaChestVariant;
  readonly initialState: DefiningWorldPlazaChestState;
  readonly loot: DefiningWorldPlazaChestLoot;
  /** Circle collision radius in grid units. Default 0.35. */
  readonly collisionRadiusGrid?: number;
  /** Display scale relative to one isometric tile width. */
  readonly displayScale?: number;
};

export type DefiningWorldPlazaChestInstance = {
  readonly chestId: DefiningWorldPlazaChestId;
  readonly position: { readonly x: number; readonly y: number };
  readonly facing: DefiningWorldPlazaChestFacing;
  readonly variant: DefiningWorldPlazaChestVariant;
  readonly state: DefiningWorldPlazaChestState;
  readonly loot: DefiningWorldPlazaChestLoot;
  readonly collisionRadiusGrid: number;
  readonly displayScale: number;
};

export type DefiningWorldPlazaChestLootGrant = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

export type DefiningWorldPlazaChestLootPoolEntry = {
  readonly itemTypeId: string;
  readonly quantity: number;
  readonly weight: number;
};
