/**
 * Survival Cookbook craft recipes (wear, mats, shelters).
 *
 * @module components/world/crafting/domains/registeringWorldPlazaSurvivalCraftModeRecipes
 */

import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_BRUSH_WINDBREAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_CLAIM_BEDROLL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_SCOUT_TENT,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_SHADE_LEAN_TO,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_SMOKE_RACK,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { resolvingWorldPlazaSurvivalShelterSpriteSheetIcon } from '@/components/world/building/domains/definingWorldPlazaSurvivalShelterSpriteConstants';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  type DefiningWorldPlazaCraftModeRecipeDefinition,
  type DefiningWorldPlazaCraftModeRecipeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { resolvingWorldPlazaInventorySurvivalSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventorySurvivalSpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

type DefiningWorldPlazaSurvivalItemRecipeSeed = {
  readonly id: DefiningWorldPlazaCraftModeRecipeId;
  readonly itemTypeId: string;
  readonly title: string;
  readonly description: string;
  readonly complexity: number;
  readonly ingredients: readonly {
    readonly itemTypeId: string;
    readonly quantity: number;
  }[];
  readonly outputQuantity?: number;
};

function creatingWorldPlazaSurvivalItemRecipe(
  entry: DefiningWorldPlazaSurvivalItemRecipeSeed
): DefiningWorldPlazaCraftModeRecipeDefinition {
  const spriteSheetIcon = resolvingWorldPlazaInventorySurvivalSpriteSheetIcon(
    entry.itemTypeId
  );

  if (!spriteSheetIcon) {
    throw new Error(`Missing survival sprite for recipe: ${entry.itemTypeId}`);
  }

  return {
    id: entry.id,
    cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
    title: entry.title,
    description: entry.description,
    recipeVisual: { visualKind: 'sprite-sheet', spriteSheetIcon },
    ingredients: entry.ingredients,
    recipeType: 'item',
    complexity: entry.complexity,
    outcome: {
      kind: 'item',
      itemTypeId: entry.itemTypeId,
      quantity: entry.outputQuantity ?? 1,
    },
  };
}

const DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_RECIPE_SEEDS: readonly DefiningWorldPlazaSurvivalItemRecipeSeed[] =
  [
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_STRAW_SUN_HAT,
      itemTypeId: 'world-plaza-survival-straw-sun-hat',
      title: 'Straw Sun Hat',
      description: 'Wide straw brim for hot marches.',
      complexity: 2,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE, quantity: 3 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_WOOL_NECK_WRAP,
      itemTypeId: 'world-plaza-survival-wool-neck-wrap',
      title: 'Wool Neck Wrap',
      description: 'Soft wool at the throat for cold trails.',
      complexity: 2,
      ingredients: [
        { itemTypeId: 'world-plaza-wildlife-wool', quantity: 2 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 1 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_FROST_GLARE_LENSES,
      itemTypeId: 'world-plaza-survival-frost-glare-lenses',
      title: 'Frost Glare Lenses',
      description: 'Slit lenses for snow glare.',
      complexity: 2,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE, quantity: 1 },
        { itemTypeId: 'world-plaza-wildlife-leather', quantity: 1 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SWAMP_MESH_VEIL,
      itemTypeId: 'world-plaza-survival-swamp-mesh-veil',
      title: 'Swamp Mesh Veil',
      description: 'Fine face mesh for wet dusk marches.',
      complexity: 2,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 4 },
        { itemTypeId: 'world-plaza-lost-stitch-scrap', quantity: 1 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_HIDE_TRAIL_VEST,
      itemTypeId: 'world-plaza-survival-hide-trail-vest',
      title: 'Hide Trail Vest',
      description: 'Cured hide vest for cold comfort.',
      complexity: 3,
      ingredients: [
        { itemTypeId: 'world-plaza-wildlife-leather', quantity: 2 },
        { itemTypeId: 'world-plaza-lost-stitch-scrap', quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_FUR_SHOULDER_CAPE,
      itemTypeId: 'world-plaza-survival-fur-shoulder-cape',
      title: 'Fur Shoulder Cape',
      description: 'Heavy fur cape for bitter cold.',
      complexity: 4,
      ingredients: [
        { itemTypeId: 'world-plaza-wildlife-wool', quantity: 4 },
        { itemTypeId: 'world-plaza-wildlife-leather', quantity: 2 },
        { itemTypeId: 'world-plaza-burrow-fluff', quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_PALM_LEAF_PONCHO,
      itemTypeId: 'world-plaza-survival-palm-leaf-poncho',
      title: 'Palm Leaf Poncho',
      description: 'Loose palm shade for hot biomes.',
      complexity: 3,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE, quantity: 4 },
        { itemTypeId: 'world-plaza-lost-stitch-scrap', quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_BARK_BRACERS,
      itemTypeId: 'world-plaza-survival-bark-bracers',
      title: 'Bark Bracers',
      description: 'Bark strips for the forearms.',
      complexity: 2,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD, quantity: 2 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_FINGERLESS_WORK_MITTS,
      itemTypeId: 'world-plaza-survival-fingerless-work-mitts',
      title: 'Fingerless Work Mitts',
      description: 'Mitts that leave fingers free for camp work.',
      complexity: 2,
      ingredients: [
        { itemTypeId: 'world-plaza-wildlife-wool', quantity: 2 },
        { itemTypeId: 'world-plaza-lost-stitch-scrap', quantity: 1 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_CLOTH_LEG_WRAPS,
      itemTypeId: 'world-plaza-survival-cloth-leg-wraps',
      title: 'Cloth Leg Wraps',
      description: 'Cloth bound around the calves.',
      complexity: 2,
      ingredients: [
        { itemTypeId: 'world-plaza-wildlife-wool', quantity: 2 },
        { itemTypeId: 'world-plaza-lost-stitch-scrap', quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_HIDE_TRAIL_BOOTS,
      itemTypeId: 'world-plaza-survival-hide-trail-boots',
      title: 'Hide Trail Boots',
      description: 'Soft hide boots for long walks.',
      complexity: 3,
      ingredients: [
        { itemTypeId: 'world-plaza-wildlife-leather', quantity: 3 },
        { itemTypeId: 'world-plaza-lost-stitch-scrap', quantity: 2 },
      ],
    },
  ];

const DEFINING_WORLD_PLAZA_SURVIVAL_MAT_RECIPE_SEEDS: readonly DefiningWorldPlazaSurvivalItemRecipeSeed[] =
  [
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SPLIT_PLANKS,
      itemTypeId: 'world-plaza-survival-split-planks',
      title: 'Split Planks',
      description: 'Wood split for frames and shelter walls.',
      complexity: 1,
      outputQuantity: 4,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD, quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_WATTLE_PANEL,
      itemTypeId: 'world-plaza-survival-wattle-panel',
      title: 'Wattle Panel',
      description: 'Sticks woven with cord into a soft wall panel.',
      complexity: 2,
      outputQuantity: 2,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD, quantity: 3 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 4 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_ADOBE_BRICK,
      itemTypeId: 'world-plaza-survival-adobe-brick',
      title: 'Adobe Brick',
      description: 'Clay and straw pressed into field bricks.',
      complexity: 2,
      outputQuantity: 4,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY, quantity: 2 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE, quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_ROPE_COIL,
      itemTypeId: 'world-plaza-survival-rope-coil',
      title: 'Rope Coil',
      description: 'Bark cordage wound for frames and tents.',
      complexity: 2,
      outputQuantity: 2,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 6 },
        { itemTypeId: 'world-plaza-knotweed-stem', quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_PEG_STAKE_PACK,
      itemTypeId: 'world-plaza-survival-peg-stake-pack',
      title: 'Peg and Stake Pack',
      description: 'Wood pegs for pinning field shelters.',
      complexity: 1,
      outputQuantity: 6,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD, quantity: 3 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_REED_MAT,
      itemTypeId: 'world-plaza-survival-reed-mat',
      title: 'Reed Mat',
      description: 'Woven reed pad for tent floors.',
      complexity: 2,
      outputQuantity: 2,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE, quantity: 4 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 2 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_CLAY_DAUB_MIX,
      itemTypeId: 'world-plaza-survival-clay-daub-mix',
      title: 'Clay Daub Mix',
      description: 'Wet clay and straw grit for wattle faces.',
      complexity: 2,
      outputQuantity: 3,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY, quantity: 2 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE, quantity: 1 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE, quantity: 1 },
      ],
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_LASHING_TWINE_SPOOL,
      itemTypeId: 'world-plaza-survival-lashing-twine-spool',
      title: 'Lashing Twine Spool',
      description: 'Thin cord for binding panels and racks.',
      complexity: 1,
      outputQuantity: 3,
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_GRASS_FIBER, quantity: 4 },
      ],
    },
  ];

const DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_RECIPE_DEFINITIONS: readonly DefiningWorldPlazaCraftModeRecipeDefinition[] =
  [
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SHADE_LEAN_TO,
      cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
      title: 'Shade Lean-To',
      description:
        'A stick frame with thatch shade. Cools the tile on claimed ground.',
      recipeVisual: {
        visualKind: 'sprite-sheet',
        spriteSheetIcon: resolvingWorldPlazaSurvivalShelterSpriteSheetIcon(
          'shade-lean-to'
        ),
      },
      ingredients: [
        { itemTypeId: 'world-plaza-survival-split-planks', quantity: 4 },
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE, quantity: 4 },
        { itemTypeId: 'world-plaza-survival-peg-stake-pack', quantity: 2 },
        { itemTypeId: 'world-plaza-survival-rope-coil', quantity: 1 },
      ],
      recipeType: 'entity',
      complexity: 4,
      outcome: {
        kind: 'entity',
        blockDefinitionId:
          DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_SHADE_LEAN_TO,
        blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_BRUSH_WINDBREAK,
      cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
      title: 'Brush Windbreak',
      description:
        'A woven brush wall that traps a little warmth near camp.',
      recipeVisual: {
        visualKind: 'sprite-sheet',
        spriteSheetIcon: resolvingWorldPlazaSurvivalShelterSpriteSheetIcon(
          'brush-windbreak'
        ),
      },
      ingredients: [
        { itemTypeId: 'world-plaza-survival-wattle-panel', quantity: 3 },
        { itemTypeId: 'world-plaza-survival-peg-stake-pack', quantity: 2 },
      ],
      recipeType: 'entity',
      complexity: 3,
      outcome: {
        kind: 'entity',
        blockDefinitionId:
          DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_BRUSH_WINDBREAK,
        blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SCOUT_TENT,
      cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
      title: 'Scout Tent',
      description:
        'A thatched tent with insulated air. Needs a 2 by 2 pad on claim.',
      recipeVisual: {
        visualKind: 'sprite-sheet',
        spriteSheetIcon: resolvingWorldPlazaSurvivalShelterSpriteSheetIcon(
          'scout-tent'
        ),
      },
      ingredients: [
        { itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_THATCH_BUNDLE, quantity: 8 },
        { itemTypeId: 'world-plaza-survival-rope-coil', quantity: 2 },
        { itemTypeId: 'world-plaza-survival-peg-stake-pack', quantity: 4 },
        { itemTypeId: 'world-plaza-survival-reed-mat', quantity: 2 },
      ],
      recipeType: 'entity',
      complexity: 6,
      outcome: {
        kind: 'entity',
        blockDefinitionId:
          DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_SCOUT_TENT,
        blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_CLAIM_BEDROLL,
      cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
      title: 'Claim Bedroll',
      description:
        'A rolled bed for rest nodes. Can be placed outside claim like a campfire.',
      recipeVisual: {
        visualKind: 'sprite-sheet',
        spriteSheetIcon: resolvingWorldPlazaSurvivalShelterSpriteSheetIcon(
          'claim-bedroll'
        ),
      },
      ingredients: [
        { itemTypeId: 'world-plaza-wildlife-wool', quantity: 3 },
        { itemTypeId: 'world-plaza-lost-stitch-scrap', quantity: 2 },
        { itemTypeId: 'world-plaza-survival-reed-mat', quantity: 1 },
      ],
      recipeType: 'entity',
      complexity: 3,
      outcome: {
        kind: 'entity',
        blockDefinitionId:
          DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_CLAIM_BEDROLL,
        blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SMOKE_RACK,
      cookbookId: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
      title: 'Smoke Rack',
      description: 'A plank rack beside fire for drying meat later.',
      recipeVisual: {
        visualKind: 'sprite-sheet',
        spriteSheetIcon: resolvingWorldPlazaSurvivalShelterSpriteSheetIcon(
          'smoke-rack'
        ),
      },
      ingredients: [
        { itemTypeId: 'world-plaza-survival-split-planks', quantity: 3 },
        { itemTypeId: 'world-plaza-survival-rope-coil', quantity: 1 },
      ],
      recipeType: 'entity',
      complexity: 2,
      outcome: {
        kind: 'entity',
        blockDefinitionId:
          DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_SURVIVAL_SMOKE_RACK,
        blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      },
    },
  ];

export function registeringWorldPlazaSurvivalCraftModeRecipes(): readonly DefiningWorldPlazaCraftModeRecipeDefinition[] {
  return [
    ...DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_RECIPE_SEEDS.map(
      creatingWorldPlazaSurvivalItemRecipe
    ),
    ...DEFINING_WORLD_PLAZA_SURVIVAL_MAT_RECIPE_SEEDS.map(
      creatingWorldPlazaSurvivalItemRecipe
    ),
    ...DEFINING_WORLD_PLAZA_SURVIVAL_SHELTER_RECIPE_DEFINITIONS,
  ];
}
