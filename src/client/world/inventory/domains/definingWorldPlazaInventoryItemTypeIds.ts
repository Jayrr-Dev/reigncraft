/**
 * Server-safe world plaza inventory item type ids.
 *
 * Kept free of React/icon imports so the Colyseus game server can reference
 * item ids (e.g. for authoritative ground-item seeding) without pulling in
 * client-only modules like `lucide-react`.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds
 */

/** Wood resource item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD =
  'world-plaza-wood' as const;

/** Stone resource item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE =
  'world-plaza-stone' as const;

/** Flint igniter item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT =
  'world-plaza-flint' as const;

/** Build tool item type id (equip to open build mode). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL =
  'world-plaza-tool' as const;

/** Craft tool item type id (equip to open craft mode). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL =
  'world-plaza-craft-tool' as const;

/** Claim tool item type id (equip to open claim mode). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL =
  'world-plaza-claim-tool' as const;

/** Wood axe item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE =
  'world-plaza-axe' as const;

/** Berries food item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES =
  'world-plaza-berries' as const;

/** Apple food item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE =
  'world-plaza-apple' as const;

/** Soulcore currency item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE =
  'world-plaza-soulcore' as const;

/** Tiny starter bag (2x2). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH =
  'world-plaza-pouch' as const;

/** Small adventurer bag (3x3). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL =
  'world-plaza-satchel' as const;

/** Standard travel bag (3x4). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK =
  'world-plaza-pack' as const;

/** Larger utility bag (3x5). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK =
  'world-plaza-rucksack' as const;

/** Big serious bag (3x6). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG =
  'world-plaza-expedition-bag' as const;

/** Wheat seeds for farming. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED =
  'world-plaza-wheat-seed' as const;

/** Harvested wheat crop. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT =
  'world-plaza-wheat' as const;

/** Raw fish from fishing. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISH =
  'world-plaza-fish' as const;

/** Wood-tier swords through gold-tier swords. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD =
  'world-plaza-sword-wood' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_IRON =
  'world-plaza-sword-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL =
  'world-plaza-sword-steel' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD =
  'world-plaza-sword-gold' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON =
  'world-plaza-axe-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_STEEL =
  'world-plaza-axe-steel' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD =
  'world-plaza-axe-gold' as const;

/** Wood pickaxe item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE =
  'world-plaza-pickaxe' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_IRON =
  'world-plaza-pickaxe-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_STEEL =
  'world-plaza-pickaxe-steel' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PICKAXE_GOLD =
  'world-plaza-pickaxe-gold' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_WOOD =
  'world-plaza-hoe-wood' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_IRON =
  'world-plaza-hoe-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_STEEL =
  'world-plaza-hoe-steel' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_HOE_GOLD =
  'world-plaza-hoe-gold' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_WOOD =
  'world-plaza-scythe-wood' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_IRON =
  'world-plaza-scythe-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_STEEL =
  'world-plaza-scythe-steel' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SCYTHE_GOLD =
  'world-plaza-scythe-gold' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_WOOD =
  'world-plaza-fishrod-wood' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_IRON =
  'world-plaza-fishrod-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_STEEL =
  'world-plaza-fishrod-steel' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FISHROD_GOLD =
  'world-plaza-fishrod-gold' as const;
