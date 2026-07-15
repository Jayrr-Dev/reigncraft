/**
 * Declarative craft recipe registry.
 *
 * To add a recipe, append one object to
 * {@link DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY}:
 *
 * ```ts
 * {
 *   id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.MY_RECIPE,
 *   cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
 *   title: 'My Recipe',
 *   description: 'What the player reads on the left page.',
 *   recipeVisual: { visualKind: 'iconify', recipeEmblemIconifyIcon: 'mdi:hammer' },
 *   ingredients: [
 *     { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE, quantity: 3 },
 *   ],
 *   recipeType: 'entity', // or 'item'
 *   outcome: {
 *     kind: 'entity',
 *     blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_...,
 *     blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
 *   },
 *   // item example:
 *   // recipeType: 'item',
 *   // outcome: { kind: 'item', itemTypeId: '...', quantity: 1 },
 * }
 * ```
 *
 * Also add the id to {@link DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID}.
 * A recipe-page inventory item is registered automatically from this list.
 * The recipe only appears in its cookbook after that page is attached.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry
 */

import {
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND,
  resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon,
} from '@/components/world/building/domains/definingWorldPlazaBlacksmithUtilitySpriteConstants';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeDefinition,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES } from '@/components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants';
import { registeringWorldPlazaSurvivalCraftModeRecipes } from '@/components/world/crafting/domains/registeringWorldPlazaSurvivalCraftModeRecipes';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCeramicsSpriteSheetConstants';
import { resolvingWorldPlazaInventoryHealerSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryHealerSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_ICON } from '@/components/world/inventory/domains/definingWorldPlazaInventoryIronTubeSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_URL,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import {
  DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_URL,
} from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';

/** Campfire recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST = 8;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST = 5;

/** Anvil recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_STONE_COST = 16;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_IRON_INGOT_COST = 32;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_WOOD_COST = 8;

/** Bloomery recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_CLAY_COST = 16;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_WET_CLAY_COST = 32;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_STONE_COST = 16;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_WOOD_COST = 32;

/** Clay kiln recipe ingredient counts (2x2 footprint). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_CLAY_COST = 48;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_STONE_COST = 24;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_WOOD_COST = 12;

/** Clay stove recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_CLAY_COST = 24;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_STONE_COST = 12;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_COAL_COST = 6;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_IRON_INGOT_COST = 6;

/** Wet clay ware shaping costs (Ceramics cookbook). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_CUP_WET_CLAY_COST = 3;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_TEAPOT_WET_CLAY_COST = 9;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_BOTTLE_WET_CLAY_COST = 1;

/** Bear trap smith recipe ingredient counts (requires nearby anvil). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_IRON_INGOT_COST = 3;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_WOOD_COST = 2;

/** Caltrops smith recipe ingredient counts (requires nearby anvil). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_IRON_INGOT_COST = 1;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY = 3;

/** Iron tube smith recipe ingredient counts (requires nearby anvil). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_IRON_TUBE_IRON_INGOT_COST = 4;

/** Bessemer forge recipe ingredient counts. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_TUBE_COST = 8;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_COPPER_INGOT_COST = 20;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_INGOT_COST = 50;

type DefiningWorldPlazaHealerRecipeEntry = {
  readonly id: DefiningWorldPlazaCraftModeRecipeId;
  readonly itemTypeId: string;
  readonly title: string;
  readonly description: string;
  readonly complexity: number;
  readonly ingredients: readonly {
    readonly itemTypeId: string;
    readonly quantity: number;
  }[];
};

function creatingWorldPlazaHealerRecipe(
  entry: DefiningWorldPlazaHealerRecipeEntry
): DefiningWorldPlazaCraftModeRecipeDefinition {
  const spriteSheetIcon = resolvingWorldPlazaInventoryHealerSpriteSheetIcon(
    entry.itemTypeId
  );

  if (!spriteSheetIcon) {
    throw new Error(`Missing healer sprite: ${entry.itemTypeId}`);
  }

  return {
    ...entry,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.HEALER,
    recipeVisual: { visualKind: 'sprite-sheet', spriteSheetIcon },
    recipeType: 'item',
    outcome: { kind: 'item', itemTypeId: entry.itemTypeId, quantity: 1 },
  };
}

const DEFINING_WORLD_PLAZA_HEALER_RECIPE_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_YARROW_PRESSURE_DRESSING,
    itemTypeId: 'world-plaza-healer-yarrow-pressure-dressing',
    title: 'Yarrow Pressure Dressing',
    description: 'A field dressing for bleeding wounds.',
    complexity: 2,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-yarrow', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-wool', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CALENDULA_WOUND_SALVE,
    itemTypeId: 'world-plaza-healer-calendula-wound-salve',
    title: 'Calendula Wound Salve',
    description: 'A rich salve for torn skin.',
    complexity: 2,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-calendula', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-pig-fat', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CHAMOMILE_COMPRESS,
    itemTypeId: 'world-plaza-healer-chamomile-compress',
    title: 'Chamomile Compress',
    description: 'A calm cloth for a confused mind.',
    complexity: 2,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-chamomile', quantity: 1 },
      { itemTypeId: 'world-plaza-tea-leaves', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_LAVENDER_ANTISEPTIC_WASH,
    itemTypeId: 'world-plaza-healer-lavender-antiseptic-wash',
    title: 'Lavender Antiseptic Wash',
    description: 'A clean wash for lingering sickness.',
    complexity: 2,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-lavender', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-milk', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_PEPPERMINT_DIGESTIVE_DROPS,
    itemTypeId: 'world-plaza-healer-peppermint-digestive-drops',
    title: 'Peppermint Digestive Drops',
    description: 'Cooling drops for cold marches.',
    complexity: 2,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-peppermint', quantity: 1 },
      { itemTypeId: 'world-plaza-berry-blue', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_MEADOWSWEET_FEVER_CLOTH,
    itemTypeId: 'world-plaza-healer-meadowsweet-fever-cloth',
    title: 'Meadowsweet Fever Cloth',
    description: 'A damp cloth to draw out heat.',
    complexity: 2,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-meadowsweet', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-feather', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_ROSE_LINIMENT,
    itemTypeId: 'world-plaza-healer-rose-liniment',
    title: 'Rose Liniment',
    description: 'Rose oil against biting cold.',
    complexity: 2,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-rose', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-pig-fat', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FIELD_AGARIC_RESTORATIVE_TABLET,
    itemTypeId: 'world-plaza-healer-field-agaric-restorative-tablet',
    title: 'Field Agaric Restorative Tablet',
    description: 'A bitter tablet for renewed vigor.',
    complexity: 3,
    ingredients: [
      { itemTypeId: 'world-plaza-cooked-field-agaric-mushroom', quantity: 1 },
      { itemTypeId: 'world-plaza-clover-3-leaf', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_KENNEL_PAW_SALVE,
    itemTypeId: 'world-plaza-healer-kennel-paw-salve',
    title: 'Kennel Paw Salve',
    description: 'Companion salve for battered paws.',
    complexity: 3,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-dog-fur', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-calendula', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-pig-fat', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_LITTERBOX_GUT_DROPS,
    itemTypeId: 'world-plaza-healer-litterbox-gut-drops',
    title: 'Litterbox Gut Drops',
    description: 'Companion drops for a sour gut.',
    complexity: 3,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-night-whisker', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-chamomile', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-lavender', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_ARNICA_BRUISE_LINIMENT,
    itemTypeId: 'world-plaza-healer-arnica-bruise-liniment',
    title: 'Arnica Bruise Liniment',
    description: 'Liniment that braces a bruised limb.',
    complexity: 4,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-arnica', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-tendon', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_ECHINACEA_TINCTURE,
    itemTypeId: 'world-plaza-healer-echinacea-tincture',
    title: 'Echinacea Tincture',
    description: 'Sharp tonic for shortening illness.',
    complexity: 4,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-echinacea', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-horn', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_VALERIAN_NIGHT_DRAUGHT,
    itemTypeId: 'world-plaza-healer-valerian-night-draught',
    title: 'Valerian Night Draught',
    description: 'A heavy draught for healing sleep.',
    complexity: 4,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-valerian', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-chamomile', quantity: 1 },
      { itemTypeId: 'world-plaza-tea-leaves', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_REST_CURE_PILLOW,
    itemTypeId: 'world-plaza-healer-rest-cure-pillow',
    title: 'Rest-Cure Pillow',
    description: 'A pillow stuffed to sleep off sickness.',
    complexity: 4,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-valerian', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-lavender', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-soft-hide', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_SHEEPSKIN_WOUND_PACK,
    itemTypeId: 'world-plaza-healer-sheepskin-wound-pack',
    title: 'Sheepskin Wound Pack',
    description: 'A padded pack that binds and braces.',
    complexity: 5,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-sheep-skin', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-yarrow', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-arnica', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_WOLF_BITE_ANTISERUM,
    itemTypeId: 'world-plaza-healer-wolf-bite-antiserum',
    title: 'Wolf-Bite Antiserum',
    description: 'A serum tuned against wolf fever.',
    complexity: 5,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-fang', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-echinacea', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-lavender', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_BOAR_LARD_DRAWING_POULTICE,
    itemTypeId: 'world-plaza-healer-boar-lard-drawing-poultice',
    title: 'Boar-Lard Drawing Poultice',
    description: 'A lard poultice that draws out rot.',
    complexity: 5,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-pig-fat', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-bristle', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-meadowsweet', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_PACKHOUND_PLAGUE_COLLAR,
    itemTypeId: 'world-plaza-healer-packhound-plague-collar',
    title: 'Packhound Plague Collar',
    description: 'A protective collar for a sick companion.',
    complexity: 5,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-dog-tooth', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-dog-fur', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-echinacea', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CAT_SCRATCH_STYPTIC,
    itemTypeId: 'world-plaza-healer-cat-scratch-styptic',
    title: 'Cat-Scratch Styptic',
    description: 'Fine powder for quick bleeding control.',
    complexity: 4,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-cat-claw', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-yarrow', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_BONE_SET_SPLINT_WRAP,
    itemTypeId: 'world-plaza-healer-bone-set-splint-wrap',
    title: 'Bone-Set Splint Wrap',
    description: 'An antler splint for a broken limb.',
    complexity: 6,
    ingredients: [
      { itemTypeId: 'world-plaza-wildlife-antler', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-tendon', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-wool', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_DEEP_REST_SERUM,
    itemTypeId: 'world-plaza-healer-deep-rest-serum',
    title: 'Deep Rest Serum',
    description: 'An intense serum that accelerates recovery.',
    complexity: 7,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-valerian', quantity: 1 },
      { itemTypeId: 'world-plaza-cooked-fairy-dust', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-lavender', quantity: 1 },
      { itemTypeId: 'world-plaza-cooked-field-agaric-mushroom', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FOXGLOVE_HEART_AMPOULE,
    itemTypeId: 'world-plaza-healer-foxglove-heart-ampoule',
    title: 'Foxglove Heart Ampoule',
    description: 'A high-stakes tonic for a failing heart.',
    complexity: 7,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-foxglove', quantity: 1 },
      { itemTypeId: 'world-plaza-cooked-fairy-dust', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-milk', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CYROBORN_FROSTBITE_PACK,
    itemTypeId: 'world-plaza-healer-cyroborn-frostbite-pack',
    title: 'Cyroborn Frostbite Pack',
    description: 'A pack to reset frostbitten limbs.',
    complexity: 8,
    ingredients: [
      { itemTypeId: 'world-plaza-cooked-cyroborn-shard', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-fang', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-arnica', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_GRADED_PLAGUE_PURGE,
    itemTypeId: 'world-plaza-healer-graded-plague-purge',
    title: 'Graded Plague Purge',
    description: 'A measured purge for entrenched disease.',
    complexity: 8,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-echinacea', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-omega-fang', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-wing-mote', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_BELLADONNA_LAST_RITES,
    itemTypeId: 'world-plaza-healer-belladonna-last-rites',
    title: 'Belladonna Last Rites',
    description: 'A final gamble against terminal infection.',
    complexity: 9,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-belladonna', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-ice-tusk', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-crown-plate', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FATE_UNRAVEL_SALTS,
    itemTypeId: 'world-plaza-healer-fate-unravel-salts',
    title: 'Fate Unravel Salts',
    description: 'Lucky salts that snap a fated mark before it resolves.',
    complexity: 3,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-lavender', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-chamomile', quantity: 1 },
      { itemTypeId: 'world-plaza-clover-4-leaf', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_DOOM_POSTPONE_POULTICE,
    itemTypeId: 'world-plaza-healer-doom-postpone-poultice',
    title: 'Doom Postpone Poultice',
    description: 'A timed wrap that delays and softens a doom already marked.',
    complexity: 5,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-valerian', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-soft-hide', quantity: 1 },
      { itemTypeId: 'world-plaza-flower-meadowsweet', quantity: 1 },
    ],
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FATEBREAK_WARD,
    itemTypeId: 'world-plaza-healer-fatebreak-ward',
    title: 'Fatebreak Ward',
    description: 'A rare ward that clears fated marks and stops new ones.',
    complexity: 8,
    ingredients: [
      { itemTypeId: 'world-plaza-flower-echinacea', quantity: 1 },
      { itemTypeId: 'world-plaza-wildlife-wing-mote', quantity: 1 },
      { itemTypeId: 'world-plaza-clover-4-leaf', quantity: 1 },
    ],
  },
] as const satisfies readonly DefiningWorldPlazaHealerRecipeEntry[];

/**
 * Hand-authored craft recipes (stations, ceramics, traps).
 * Tiered tool recipes are appended from {@link registeringWorldPlazaCraftModeToolRecipes}.
 */
const DEFINING_WORLD_PLAZA_CRAFT_MODE_MANUAL_RECIPE_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CAMPFIRE,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
    title: 'Campfire',
    description:
      'A stone ring and dry wood for warmth, cooking, and light on claimed ground.',
    recipeVisual: { visualKind: 'world-plaza-campfire' },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_WOOD_COST,
      },
    ],
    recipeType: 'entity',
    complexity: 3,
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.ANVIL,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Anvil',
    description:
      'A heavy iron face on a stone base. The first honest workbench of any forge.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_IRON_INGOT_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ANVIL_WOOD_COST,
      },
    ],
    recipeType: 'entity',
    complexity: 10,
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Bloomery',
    description:
      'A clay shaft furnace that turns mined metal ore into workable ingots.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_CLAY_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_WET_CLAY_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BLOOMERY_WOOD_COST,
      },
    ],
    recipeType: 'entity',
    complexity: 8,
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BESSEMER_FORGE,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Bessemer Forge',
    description:
      'A pear-shaped steel converter that blows iron into harder steel. Needs tubes, copper, and a mountain of ingots.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BESSEMER_FORGE
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_TUBE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_COPPER_INGOT_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BESSEMER_FORGE_IRON_INGOT_COST,
      },
    ],
    recipeType: 'entity',
    complexity: 12,
    outcome: {
      kind: 'entity',
      blockDefinitionId:
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Bear Trap',
    description:
      'A sprung iron jaw for ground snares. Hammer it at an anvil; it will not take shape in the open field.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_URL,
        columnCount: DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_COLUMN_COUNT,
        rowCount: DEFINING_WORLD_PLAZA_BEAR_TRAP_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_IRON_INGOT_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_BEAR_TRAP_WOOD_COST,
      },
    ],
    recipeType: 'item',
    complexity: 5,
    requiredNearbyBlockDefinitionId:
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
    requiredNearbyBlockRangeTiles:
      DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BEAR_TRAP,
      quantity: 1,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Caltrops',
    description:
      'Scattered iron spikes. Hammer a handful at an anvil; walking onto them slows and bleeds, then the cluster is spent.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl: DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_URL,
        columnCount: DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_COLUMN_COUNT,
        rowCount: DEFINING_WORLD_PLAZA_CALTROP_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_IRON_INGOT_COST,
      },
    ],
    recipeType: 'item',
    complexity: 3,
    requiredNearbyBlockDefinitionId:
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
    requiredNearbyBlockRangeTiles:
      DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CALTROPS,
      quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CALTROPS_OUTPUT_QUANTITY,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_TUBE,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: 'Iron Tube',
    description:
      'Draw four iron ingots into a hollow tube on the anvil. Intermediate stock for later forge recipes.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon:
        DEFINING_WORLD_PLAZA_INVENTORY_IRON_TUBE_SPRITE_SHEET_ICON,
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_IRON_TUBE_IRON_INGOT_COST,
      },
    ],
    recipeType: 'item',
    complexity: 4,
    requiredNearbyBlockDefinitionId:
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
    requiredNearbyBlockRangeTiles:
      DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_IRON_TUBE,
      quantity: 1,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Clay Kiln',
    description:
      'A beehive of packed clay for firing ore, brick, and wet clay ware. Needs a full 2 by 2 pad of clear ground.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_CLAY_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_KILN_WOOD_COST,
      },
    ],
    recipeType: 'entity',
    complexity: 7,
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_STOVE,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Clay Stove',
    description:
      'A short clay hearth with a dark cook plate. Smaller than a kiln, still hungry for coal.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
        DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE
      ),
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_CLAY_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_STONE_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
        quantity: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_COAL_COST,
      },
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CLAY_STOVE_IRON_INGOT_COST,
      },
    ],
    recipeType: 'entity',
    complexity: 6,
    outcome: {
      kind: 'entity',
      blockDefinitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_CUP,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Wet Clay Cup',
    description:
      'Press wet clay into a small cup. Soft until you fire it in a kiln with coal.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
        columnCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
        rowCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_CUP_WET_CLAY_COST,
      },
    ],
    recipeType: 'item',
    complexity: 2,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
      quantity: 1,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_TEAPOT,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Wet Clay Tea Pot',
    description:
      'Shape wet clay into a teapot. Fire the greenware in a kiln with coal before it can brew.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
        columnCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
        rowCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 1,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_TEAPOT_WET_CLAY_COST,
      },
    ],
    recipeType: 'item',
    complexity: 4,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
      quantity: 1,
    },
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_BOTTLE,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Wet Clay Bottle',
    description:
      'Pull wet clay into a bottle. Fire the greenware in a kiln with coal before it can hold liquid.',
    recipeVisual: {
      visualKind: 'sprite-sheet',
      spriteSheetIcon: {
        spriteSheetUrl:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_URL,
        columnCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_COLUMN_COUNT,
        rowCount:
          DEFINING_WORLD_PLAZA_INVENTORY_CERAMICS_SPRITE_SHEET_ROW_COUNT,
        columnIndex: 3,
        rowIndex: 0,
      },
    },
    ingredients: [
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
        quantity:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_WET_CLAY_BOTTLE_WET_CLAY_COST,
      },
    ],
    recipeType: 'item',
    complexity: 1,
    outcome: {
      kind: 'item',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
      quantity: 1,
    },
  },
  ...DEFINING_WORLD_PLAZA_HEALER_RECIPE_REGISTRY.map(
    creatingWorldPlazaHealerRecipe
  ),
  ...registeringWorldPlazaSurvivalCraftModeRecipes(),
] as const satisfies readonly DefiningWorldPlazaCraftModeRecipeDefinition[];

/**
 * All registered craft recipes in cookbook pager order.
 * Guides, page items, and attach gating follow automatically.
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY: readonly DefiningWorldPlazaCraftModeRecipeDefinition[] =
  [
    ...DEFINING_WORLD_PLAZA_CRAFT_MODE_MANUAL_RECIPE_REGISTRY,
    ...registeringWorldPlazaCraftModeToolRecipes(),
  ];

/**
 * Resolves one recipe definition by id, or null when unknown.
 *
 * @param recipeId - Craft recipe id
 */
export function resolvingWorldPlazaCraftModeRecipeDefinition(
  recipeId: string
): DefiningWorldPlazaCraftModeRecipeDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REGISTRY.find(
      (recipeDefinition) => recipeDefinition.id === recipeId
    ) ?? null
  );
}

/**
 * Type guard for a known craft recipe id.
 *
 * @param recipeId - Candidate recipe id
 */
export function checkingWorldPlazaCraftModeRecipeId(
  recipeId: string
): recipeId is DefiningWorldPlazaCraftModeRecipeId {
  return resolvingWorldPlazaCraftModeRecipeDefinition(recipeId) !== null;
}
