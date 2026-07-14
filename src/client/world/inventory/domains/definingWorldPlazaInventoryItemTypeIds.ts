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

/** Mineable ore resource item type ids (sprite sheet order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY =
  'world-plaza-ore-clay' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON =
  'world-plaza-ore-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER =
  'world-plaza-ore-silver' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD =
  'world-plaza-ore-gold' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER =
  'world-plaza-ore-copper' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL =
  'world-plaza-ore-coal' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER =
  'world-plaza-ore-niter' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET =
  'world-plaza-ore-scarlet' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD =
  'world-plaza-ore-lead' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR =
  'world-plaza-ore-sulfur' as const;

/** Refined metal ingot item type ids (sprite sheet order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON =
  'world-plaza-ingot-iron' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER =
  'world-plaza-ingot-copper' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_SILVER =
  'world-plaza-ingot-silver' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD =
  'world-plaza-ingot-gold' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_LEAD =
  'world-plaza-ingot-lead' as const;
/** Quicksilver refined from scarlet (cinnabar) ore. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MERCURY =
  'world-plaza-mercury' as const;

/** Build tool item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL =
  'world-plaza-tool' as const;

/** Wood axe item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE =
  'world-plaza-axe' as const;

/** Berries food item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES =
  'world-plaza-berries' as const;

/** Apple food item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE =
  'world-plaza-apple' as const;

/** Raw coconut from palm chops. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT =
  'world-plaza-coconut' as const;

/** Campfire-roasted coconut. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT =
  'world-plaza-cooked-coconut' as const;

/** Spritcore currency item type id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE =
  'world-plaza-spritcore' as const;

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

/** Foraged flower herbs (sprite sheet order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW =
  'world-plaza-flower-yarrow' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CALENDULA =
  'world-plaza-flower-calendula' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CHAMOMILE =
  'world-plaza-flower-chamomile' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_LAVENDER =
  'world-plaza-flower-lavender' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ECHINACEA =
  'world-plaza-flower-echinacea' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_PEPPERMINT =
  'world-plaza-flower-peppermint' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE =
  'world-plaza-flower-rose' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_MEADOWSWEET =
  'world-plaza-flower-meadowsweet' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ARNICA =
  'world-plaza-flower-arnica' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_VALERIAN =
  'world-plaza-flower-valerian' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_FOXGLOVE =
  'world-plaza-flower-foxglove' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_BELLADONNA =
  'world-plaza-flower-belladonna' as const;

/** Clover loot from searching long-grass clumps. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF =
  'world-plaza-clover-3-leaf' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF =
  'world-plaza-clover-4-leaf' as const;

/** Berry loot from picking berry shrubs. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED =
  'world-plaza-berry-red' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE =
  'world-plaza-berry-blue' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN =
  'world-plaza-berry-golden' as const;

/** Tea leaves loot from picking berry shrubs. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES =
  'world-plaza-tea-leaves' as const;

/** Coffee processing chain from coffee cherries. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS =
  'world-plaza-coffee-beans' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE =
  'world-plaza-brewed-coffee' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP =
  'world-plaza-empty-clay-cup' as const;

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

/** Placeable bear trap (drops as armed world trap). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP =
  'world-plaza-bear-trap' as const;

/** Placeable caltrops (one-shot walk-over slow + bleed). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS =
  'world-plaza-caltrops' as const;
