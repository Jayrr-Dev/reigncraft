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
/** Shore-wetted clay (dry ore clay + water). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY =
  'world-plaza-wet-clay' as const;
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

/** Every mineable ore item type id (sprite sheet order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_ITEM_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
] as const;

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
/** Steel bar refined from iron in a Bessemer forge. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL =
  'world-plaza-ingot-steel' as const;
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

/** Raw / cooked forage mushrooms (sheet order matches mushroom catalog). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_GOLDEN_CHANTER_MUSHROOM =
  'world-plaza-raw-golden-chanter-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_GOLDEN_CHANTER_MUSHROOM =
  'world-plaza-cooked-golden-chanter-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_FALSE_LANTERN_MUSHROOM =
  'world-plaza-raw-false-lantern-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_FALSE_LANTERN_MUSHROOM =
  'world-plaza-cooked-false-lantern-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_HONEYCOMB_MOREL_MUSHROOM =
  'world-plaza-raw-honeycomb-morel-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_HONEYCOMB_MOREL_MUSHROOM =
  'world-plaza-cooked-honeycomb-morel-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_BRAIN_CAP_MUSHROOM =
  'world-plaza-raw-brain-cap-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_BRAIN_CAP_MUSHROOM =
  'world-plaza-cooked-brain-cap-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_KING_BOLETE_MUSHROOM =
  'world-plaza-raw-king-bolete-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_KING_BOLETE_MUSHROOM =
  'world-plaza-cooked-king-bolete-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_DEVILS_BOLETE_MUSHROOM =
  'world-plaza-raw-devils-bolete-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_DEVILS_BOLETE_MUSHROOM =
  'world-plaza-cooked-devils-bolete-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_CLOUD_PUFF_MUSHROOM =
  'world-plaza-raw-cloud-puff-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_CLOUD_PUFF_MUSHROOM =
  'world-plaza-cooked-cloud-puff-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_ANGEL_BUTTON_MUSHROOM =
  'world-plaza-raw-angel-button-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_ANGEL_BUTTON_MUSHROOM =
  'world-plaza-cooked-angel-button-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_CLUSTER_HONEY_MUSHROOM =
  'world-plaza-raw-cluster-honey-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_CLUSTER_HONEY_MUSHROOM =
  'world-plaza-cooked-cluster-honey-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_FUNERAL_BELL_MUSHROOM =
  'world-plaza-raw-funeral-bell-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_FUNERAL_BELL_MUSHROOM =
  'world-plaza-cooked-funeral-bell-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_WHITE_PARASOL_MUSHROOM =
  'world-plaza-raw-white-parasol-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_WHITE_PARASOL_MUSHROOM =
  'world-plaza-cooked-white-parasol-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_GREEN_VOMITER_MUSHROOM =
  'world-plaza-raw-green-vomiter-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_GREEN_VOMITER_MUSHROOM =
  'world-plaza-cooked-green-vomiter-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_FIELD_AGARIC_MUSHROOM =
  'world-plaza-raw-field-agaric-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_FIELD_AGARIC_MUSHROOM =
  'world-plaza-cooked-field-agaric-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_YELLOW_STAIN_MUSHROOM =
  'world-plaza-raw-yellow-stain-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_YELLOW_STAIN_MUSHROOM =
  'world-plaza-cooked-yellow-stain-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_SHELF_OYSTER_MUSHROOM =
  'world-plaza-raw-shelf-oyster-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_SHELF_OYSTER_MUSHROOM =
  'world-plaza-cooked-shelf-oyster-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RAW_GHOST_WING_MUSHROOM =
  'world-plaza-raw-ghost-wing-mushroom' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_GHOST_WING_MUSHROOM =
  'world-plaza-cooked-ghost-wing-mushroom' as const;

/** Spritcore currency item type id (legacy single-type stacks). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE =
  'world-plaza-spritcore' as const;

/** Weakest wildlife Spiritcore drop tier (violet cycle). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT =
  'world-plaza-spritcore-faint' as const;

/** Mid wildlife Spiritcore drop tier (violet cycle). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT =
  'world-plaza-spritcore-bright' as const;

/** High wildlife Spiritcore drop tier (violet cycle). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG =
  'world-plaza-spritcore-strong' as const;

/** Top wildlife Spiritcore drop tier (violet cycle). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT =
  'world-plaza-spritcore-radiant' as const;

/** Crimson-cycle Spiritcore orbs (red overlay on base sheet). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_CRIMSON =
  'world-plaza-spritcore-faint-crimson' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT_CRIMSON =
  'world-plaza-spritcore-bright-crimson' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG_CRIMSON =
  'world-plaza-spritcore-strong-crimson' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_CRIMSON =
  'world-plaza-spritcore-radiant-crimson' as const;

/** Gold-cycle Spiritcore orbs (gold overlay on base sheet). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_GOLD =
  'world-plaza-spritcore-faint-gold' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT_GOLD =
  'world-plaza-spritcore-bright-gold' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG_GOLD =
  'world-plaza-spritcore-strong-gold' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_GOLD =
  'world-plaza-spritcore-radiant-gold' as const;

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

/** Craft materials from searching long-grass clumps (sprite sheet order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE =
  'world-plaza-thatch-bundle' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER =
  'world-plaza-grass-fiber' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOFT_DOWN =
  'world-plaza-soft-down' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHIRPER_SHELL =
  'world-plaza-chirper-shell' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_MEADOW_MITE_HUSK =
  'world-plaza-meadow-mite-husk' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WILD_OAT_HEAD =
  'world-plaza-wild-oat-head' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_KNOTWEED_STEM =
  'world-plaza-knotweed-stem' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEW_CAUGHT_SEED =
  'world-plaza-dew-caught-seed' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LOST_STITCH_SCRAP =
  'world-plaza-lost-stitch-scrap' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FIELD_SNAIL_TRAIL =
  'world-plaza-field-snail-trail' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BURROW_FLUFF =
  'world-plaza-burrow-fluff' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUSTED_CLASP =
  'world-plaza-rusted-clasp' as const;

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

/** Universal key that unlocks procedural locked chests. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY =
  'world-plaza-chest-key' as const;

/** Coffee processing chain from coffee cherries. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS =
  'world-plaza-coffee-beans' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE =
  'world-plaza-brewed-coffee' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP =
  'world-plaza-empty-clay-cup' as const;
/** Unfired clay cup shaped from wet clay (fire in kiln). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP =
  'world-plaza-wet-clay-cup' as const;
/** Unfired clay teapot shaped from wet clay (fire in kiln). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT =
  'world-plaza-wet-clay-teapot' as const;
/** Fired empty clay teapot (kiln output from wet teapot). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT =
  'world-plaza-empty-clay-teapot' as const;
/** Watered clay teapot awaiting herb slots and a campfire brew. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT =
  'world-plaza-watered-clay-teapot' as const;
/** Brewed clay teapot with pourable servings. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT =
  'world-plaza-brewed-clay-teapot' as const;
/** Poured tea in a clay cup (name and effects live in metadata). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA =
  'world-plaza-cup-of-tea' as const;
/** Unfired clay bottle shaped from wet clay (fire in kiln). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE =
  'world-plaza-wet-clay-bottle' as const;
/** Fired empty clay bottle (kiln output from wet bottle). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE =
  'world-plaza-empty-clay-bottle' as const;
/** Clay bottle filled at shore (drinkable; returns empty bottle). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE =
  'world-plaza-watered-clay-bottle' as const;
/** Unfired clay bowl shaped from wet clay (fire in kiln). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL =
  'world-plaza-wet-clay-bowl' as const;
/** Fired empty clay bowl (kiln output; campfire porridge vessel). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL =
  'world-plaza-empty-clay-bowl' as const;
/** Berry porridge cooked in a clay bowl at a campfire. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BOWL_OF_PORRIDGE =
  'world-plaza-bowl-of-porridge' as const;
/** Unfired clay crock shaped from wet clay (fire in kiln). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK =
  'world-plaza-wet-clay-crock' as const;
/** Fired empty clay crock (kiln output; smoke-oil vessel). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK =
  'world-plaza-empty-clay-crock' as const;
/** Rendered fat + niter sealed in a clay crock (cold resistance). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SMOKE_OIL_CROCK =
  'world-plaza-smoke-oil-crock' as const;

/** Healer's Cookbook consumables (sprite sheet order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_HEALER_ITEM_TYPE_IDS = [
  'world-plaza-healer-yarrow-pressure-dressing',
  'world-plaza-healer-calendula-wound-salve',
  'world-plaza-healer-chamomile-compress',
  'world-plaza-healer-lavender-antiseptic-wash',
  'world-plaza-healer-peppermint-digestive-drops',
  'world-plaza-healer-meadowsweet-fever-cloth',
  'world-plaza-healer-rose-liniment',
  'world-plaza-healer-field-agaric-restorative-tablet',
  'world-plaza-healer-kennel-paw-salve',
  'world-plaza-healer-litterbox-gut-drops',
  'world-plaza-healer-arnica-bruise-liniment',
  'world-plaza-healer-echinacea-tincture',
  'world-plaza-healer-valerian-night-draught',
  'world-plaza-healer-rest-cure-pillow',
  'world-plaza-healer-sheepskin-wound-pack',
  'world-plaza-healer-wolf-bite-antiserum',
  'world-plaza-healer-boar-lard-drawing-poultice',
  'world-plaza-healer-packhound-plague-collar',
  'world-plaza-healer-cat-scratch-styptic',
  'world-plaza-healer-bone-set-splint-wrap',
  'world-plaza-healer-deep-rest-serum',
  'world-plaza-healer-foxglove-heart-ampoule',
  'world-plaza-healer-cyroborn-frostbite-pack',
  'world-plaza-healer-graded-plague-purge',
  'world-plaza-healer-belladonna-last-rites',
  'world-plaza-healer-fate-unravel-salts',
  'world-plaza-healer-doom-postpone-poultice',
  'world-plaza-healer-fatebreak-ward',
] as const;

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

/** Forged intermediate: hollow iron tube (smith ingredient). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE =
  'world-plaza-iron-tube' as const;

/** Placeable bear trap (drops as armed world trap). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP =
  'world-plaza-bear-trap' as const;

/** Placeable caltrops (one-shot walk-over slow + bleed). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS =
  'world-plaza-caltrops' as const;

/** Survival trail wear and build mats (sprite sheet order). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_ITEM_TYPE_IDS = [
  'world-plaza-survival-straw-sun-hat',
  'world-plaza-survival-wool-neck-wrap',
  'world-plaza-survival-frost-glare-lenses',
  'world-plaza-survival-swamp-mesh-veil',
  'world-plaza-survival-hide-trail-vest',
  'world-plaza-survival-fur-shoulder-cape',
  'world-plaza-survival-palm-leaf-poncho',
  'world-plaza-survival-bark-bracers',
  'world-plaza-survival-fingerless-work-mitts',
  'world-plaza-survival-cloth-leg-wraps',
  'world-plaza-survival-hide-trail-boots',
  'world-plaza-survival-split-planks',
  'world-plaza-survival-wattle-panel',
  'world-plaza-survival-adobe-brick',
  'world-plaza-survival-rope-coil',
  'world-plaza-survival-peg-stake-pack',
  'world-plaza-survival-reed-mat',
  'world-plaza-survival-clay-daub-mix',
  'world-plaza-survival-lashing-twine-spool',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_STRAW_SUN_HAT =
  'world-plaza-survival-straw-sun-hat' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_WOOL_NECK_WRAP =
  'world-plaza-survival-wool-neck-wrap' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_FROST_GLARE_LENSES =
  'world-plaza-survival-frost-glare-lenses' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_SWAMP_MESH_VEIL =
  'world-plaza-survival-swamp-mesh-veil' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_HIDE_TRAIL_VEST =
  'world-plaza-survival-hide-trail-vest' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_FUR_SHOULDER_CAPE =
  'world-plaza-survival-fur-shoulder-cape' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_PALM_LEAF_PONCHO =
  'world-plaza-survival-palm-leaf-poncho' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_BARK_BRACERS =
  'world-plaza-survival-bark-bracers' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_FINGERLESS_WORK_MITTS =
  'world-plaza-survival-fingerless-work-mitts' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_CLOTH_LEG_WRAPS =
  'world-plaza-survival-cloth-leg-wraps' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_HIDE_TRAIL_BOOTS =
  'world-plaza-survival-hide-trail-boots' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_SPLIT_PLANKS =
  'world-plaza-survival-split-planks' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_WATTLE_PANEL =
  'world-plaza-survival-wattle-panel' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_ADOBE_BRICK =
  'world-plaza-survival-adobe-brick' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_ROPE_COIL =
  'world-plaza-survival-rope-coil' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_PEG_STAKE_PACK =
  'world-plaza-survival-peg-stake-pack' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_REED_MAT =
  'world-plaza-survival-reed-mat' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_CLAY_DAUB_MIX =
  'world-plaza-survival-clay-daub-mix' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SURVIVAL_LASHING_TWINE_SPOOL =
  'world-plaza-survival-lashing-twine-spool' as const;

/** Chaos Armour set (sprite sheet order: helm, arm, body, leg, foot). */
export const DEFINING_WORLD_PLAZA_INVENTORY_CHAOS_ARMOR_ITEM_TYPE_IDS = [
  'world-plaza-chaos-visor',
  'world-plaza-chaos-fate-gauntlets',
  'world-plaza-chaos-entropy-cuirass',
  'world-plaza-chaos-wild-greaves',
  'world-plaza-chaos-coinflip-treads',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHAOS_VISOR =
  'world-plaza-chaos-visor' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHAOS_FATE_GAUNTLETS =
  'world-plaza-chaos-fate-gauntlets' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHAOS_ENTROPY_CUIRASS =
  'world-plaza-chaos-entropy-cuirass' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHAOS_WILD_GREAVES =
  'world-plaza-chaos-wild-greaves' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHAOS_COINFLIP_TREADS =
  'world-plaza-chaos-coinflip-treads' as const;

/** Bessemer Plate set (sprite sheet order: helm, arm, body, leg, foot). */
export const DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_ITEM_TYPE_IDS = [
  'world-plaza-bessemer-casque',
  'world-plaza-bessemer-gauntlets',
  'world-plaza-bessemer-breastplate',
  'world-plaza-bessemer-greaves',
  'world-plaza-bessemer-sabatons',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BESSEMER_CASQUE =
  'world-plaza-bessemer-casque' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BESSEMER_GAUNTLETS =
  'world-plaza-bessemer-gauntlets' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BESSEMER_BREASTPLATE =
  'world-plaza-bessemer-breastplate' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BESSEMER_GREAVES =
  'world-plaza-bessemer-greaves' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BESSEMER_SABATONS =
  'world-plaza-bessemer-sabatons' as const;

/** Glass Veil set (sprite sheet order: helm, arm, body, leg, foot). */
export const DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_ITEM_TYPE_IDS = [
  'world-plaza-glass-veil-diadem',
  'world-plaza-glass-veil-bracers',
  'world-plaza-glass-veil-mantle',
  'world-plaza-glass-veil-greaves',
  'world-plaza-glass-veil-slippers',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GLASS_VEIL_DIADEM =
  'world-plaza-glass-veil-diadem' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GLASS_VEIL_BRACERS =
  'world-plaza-glass-veil-bracers' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GLASS_VEIL_MANTLE =
  'world-plaza-glass-veil-mantle' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GLASS_VEIL_GREAVES =
  'world-plaza-glass-veil-greaves' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GLASS_VEIL_SLIPPERS =
  'world-plaza-glass-veil-slippers' as const;

/** Siphon set (sprite sheet order: helm, arm, body, leg, foot). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SIPHON_ARMOR_ITEM_TYPE_IDS = [
  'world-plaza-siphon-cowl',
  'world-plaza-siphon-claws',
  'world-plaza-siphon-carapace',
  'world-plaza-siphon-greaves',
  'world-plaza-siphon-treads',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SIPHON_COWL =
  'world-plaza-siphon-cowl' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SIPHON_CLAWS =
  'world-plaza-siphon-claws' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SIPHON_CARAPACE =
  'world-plaza-siphon-carapace' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SIPHON_GREAVES =
  'world-plaza-siphon-greaves' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SIPHON_TREADS =
  'world-plaza-siphon-treads' as const;

/** Iron Plate set (sprite sheet order: helm, arm, body, leg, foot). Craftable at anvil. */
export const DEFINING_WORLD_PLAZA_INVENTORY_IRON_PLATE_ARMOR_ITEM_TYPE_IDS = [
  'world-plaza-iron-plate-casque',
  'world-plaza-iron-plate-gauntlets',
  'world-plaza-iron-plate-breastplate',
  'world-plaza-iron-plate-greaves',
  'world-plaza-iron-plate-sabatons',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_PLATE_CASQUE =
  'world-plaza-iron-plate-casque' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_PLATE_GAUNTLETS =
  'world-plaza-iron-plate-gauntlets' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_PLATE_BREASTPLATE =
  'world-plaza-iron-plate-breastplate' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_PLATE_GREAVES =
  'world-plaza-iron-plate-greaves' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_PLATE_SABATONS =
  'world-plaza-iron-plate-sabatons' as const;

/** Apostle Clay set (sprite sheet order: helm, arm, body, leg, foot). */
export const DEFINING_WORLD_PLAZA_INVENTORY_APOSTLE_CLAY_ARMOR_ITEM_TYPE_IDS = [
  'world-plaza-apostle-clay-mask',
  'world-plaza-apostle-clay-gauntlets',
  'world-plaza-apostle-clay-harness',
  'world-plaza-apostle-clay-greaves',
  'world-plaza-apostle-clay-sabatons',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APOSTLE_CLAY_MASK =
  'world-plaza-apostle-clay-mask' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APOSTLE_CLAY_GAUNTLETS =
  'world-plaza-apostle-clay-gauntlets' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APOSTLE_CLAY_HARNESS =
  'world-plaza-apostle-clay-harness' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APOSTLE_CLAY_GREAVES =
  'world-plaza-apostle-clay-greaves' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APOSTLE_CLAY_SABATONS =
  'world-plaza-apostle-clay-sabatons' as const;

/** All unique armour set pieces (find-only; not craftable). */
export const DEFINING_WORLD_PLAZA_UNIQUE_ARMOR_SET_ITEM_TYPE_IDS = [
  ...DEFINING_WORLD_PLAZA_INVENTORY_CHAOS_ARMOR_ITEM_TYPE_IDS,
  ...DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_ITEM_TYPE_IDS,
  ...DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_ITEM_TYPE_IDS,
  ...DEFINING_WORLD_PLAZA_INVENTORY_SIPHON_ARMOR_ITEM_TYPE_IDS,
  ...DEFINING_WORLD_PLAZA_INVENTORY_APOSTLE_CLAY_ARMOR_ITEM_TYPE_IDS,
] as const;

/** Early unique weapons (find-only; inventory-early-weapon-sprites.webp order). */
export const DEFINING_WORLD_PLAZA_EARLY_UNIQUE_WEAPON_ITEM_TYPE_IDS = [
  'world-plaza-weapon-splinter-stick',
  'world-plaza-weapon-knot-mace',
  'world-plaza-weapon-reed-needle',
  'world-plaza-weapon-campfire-brand',
  'world-plaza-weapon-thaw-pick',
  'world-plaza-weapon-lucky-twig',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_SPLINTER_STICK =
  'world-plaza-weapon-splinter-stick' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_KNOT_MACE =
  'world-plaza-weapon-knot-mace' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_REED_NEEDLE =
  'world-plaza-weapon-reed-needle' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_CAMPFIRE_BRAND =
  'world-plaza-weapon-campfire-brand' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_THAW_PICK =
  'world-plaza-weapon-thaw-pick' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_LUCKY_TWIG =
  'world-plaza-weapon-lucky-twig' as const;

/** Mid unique weapons (find-only; inventory-mid-weapon-sprites.webp order). */
export const DEFINING_WORLD_PLAZA_MID_UNIQUE_WEAPON_ITEM_TYPE_IDS = [
  'world-plaza-weapon-bessemer-edge',
  'world-plaza-weapon-glass-shard',
  'world-plaza-weapon-leech-knife',
  'world-plaza-weapon-ledger-stub',
  'world-plaza-weapon-choir-blade',
  'world-plaza-weapon-venom-barb',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_BESSEMER_EDGE =
  'world-plaza-weapon-bessemer-edge' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_GLASS_SHARD =
  'world-plaza-weapon-glass-shard' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_LEECH_KNIFE =
  'world-plaza-weapon-leech-knife' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_LEDGER_STUB =
  'world-plaza-weapon-ledger-stub' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_CHOIR_BLADE =
  'world-plaza-weapon-choir-blade' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_VENOM_BARB =
  'world-plaza-weapon-venom-barb' as const;

/** Specialty unique weapons (early + mid find-only, late craftable). */
export const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ITEM_TYPE_IDS = [
  ...DEFINING_WORLD_PLAZA_EARLY_UNIQUE_WEAPON_ITEM_TYPE_IDS,
  ...DEFINING_WORLD_PLAZA_MID_UNIQUE_WEAPON_ITEM_TYPE_IDS,
  'world-plaza-weapon-chaos-die',
  'world-plaza-weapon-quiet-hand',
  'world-plaza-weapon-glass-needle',
  'world-plaza-weapon-siphon-fang',
  'world-plaza-weapon-fated-ledger',
  'world-plaza-weapon-soft-clay-cleaver',
] as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_CHAOS_DIE =
  'world-plaza-weapon-chaos-die' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_QUIET_HAND =
  'world-plaza-weapon-quiet-hand' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_GLASS_NEEDLE =
  'world-plaza-weapon-glass-needle' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_SIPHON_FANG =
  'world-plaza-weapon-siphon-fang' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_FATED_LEDGER =
  'world-plaza-weapon-fated-ledger' as const;
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WEAPON_SOFT_CLAY_CLEAVER =
  'world-plaza-weapon-soft-clay-cleaver' as const;
