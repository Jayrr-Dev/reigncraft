/**
 * Declarative craft recipe types.
 *
 * Authoring shape (add rows in the recipe registry):
 * - `recipeType: 'entity'` → place a world block/entity (e.g. campfire)
 * - `recipeType: 'item'` → add stack(s) to inventory
 *
 * Recipes stay locked in cookbooks until the matching recipe page is attached.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes
 */

import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import type { DefiningWorldPlazaCraftModeCookbookId } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Stable ids for craft-mode recipes. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID = {
  CAMPFIRE: 'recipe-campfire',
  ANVIL: 'recipe-anvil',
  BLOOMERY: 'recipe-bloomery',
  BESSEMER_FORGE: 'recipe-bessemer-forge',
  CLAY_KILN: 'recipe-clay-kiln',
  CLAY_STOVE: 'recipe-clay-stove',
  WET_CLAY_CUP: 'recipe-wet-clay-cup',
  WET_CLAY_TEAPOT: 'recipe-wet-clay-teapot',
  WET_CLAY_BOTTLE: 'recipe-wet-clay-bottle',
  BEAR_TRAP: 'recipe-bear-trap',
  CALTROPS: 'recipe-caltrops',
  IRON_TUBE: 'recipe-iron-tube',
  HEALER_YARROW_PRESSURE_DRESSING: 'recipe-healer-yarrow-pressure-dressing',
  HEALER_CALENDULA_WOUND_SALVE: 'recipe-healer-calendula-wound-salve',
  HEALER_CHAMOMILE_COMPRESS: 'recipe-healer-chamomile-compress',
  HEALER_LAVENDER_ANTISEPTIC_WASH: 'recipe-healer-lavender-antiseptic-wash',
  HEALER_PEPPERMINT_DIGESTIVE_DROPS: 'recipe-healer-peppermint-digestive-drops',
  HEALER_MEADOWSWEET_FEVER_CLOTH: 'recipe-healer-meadowsweet-fever-cloth',
  HEALER_ROSE_LINIMENT: 'recipe-healer-rose-liniment',
  HEALER_FIELD_AGARIC_RESTORATIVE_TABLET:
    'recipe-healer-field-agaric-restorative-tablet',
  HEALER_KENNEL_PAW_SALVE: 'recipe-healer-kennel-paw-salve',
  HEALER_LITTERBOX_GUT_DROPS: 'recipe-healer-litterbox-gut-drops',
  HEALER_ARNICA_BRUISE_LINIMENT: 'recipe-healer-arnica-bruise-liniment',
  HEALER_ECHINACEA_TINCTURE: 'recipe-healer-echinacea-tincture',
  HEALER_VALERIAN_NIGHT_DRAUGHT: 'recipe-healer-valerian-night-draught',
  HEALER_REST_CURE_PILLOW: 'recipe-healer-rest-cure-pillow',
  HEALER_SHEEPSKIN_WOUND_PACK: 'recipe-healer-sheepskin-wound-pack',
  HEALER_WOLF_BITE_ANTISERUM: 'recipe-healer-wolf-bite-antiserum',
  HEALER_BOAR_LARD_DRAWING_POULTICE: 'recipe-healer-boar-lard-drawing-poultice',
  HEALER_PACKHOUND_PLAGUE_COLLAR: 'recipe-healer-packhound-plague-collar',
  HEALER_CAT_SCRATCH_STYPTIC: 'recipe-healer-cat-scratch-styptic',
  HEALER_BONE_SET_SPLINT_WRAP: 'recipe-healer-bone-set-splint-wrap',
  HEALER_DEEP_REST_SERUM: 'recipe-healer-deep-rest-serum',
  HEALER_FOXGLOVE_HEART_AMPOULE: 'recipe-healer-foxglove-heart-ampoule',
  HEALER_CYROBORN_FROSTBITE_PACK: 'recipe-healer-cyroborn-frostbite-pack',
  HEALER_GRADED_PLAGUE_PURGE: 'recipe-healer-graded-plague-purge',
  HEALER_BELLADONNA_LAST_RITES: 'recipe-healer-belladonna-last-rites',
  HEALER_FATE_UNRAVEL_SALTS: 'recipe-healer-fate-unravel-salts',
  HEALER_DOOM_POSTPONE_POULTICE: 'recipe-healer-doom-postpone-poultice',
  HEALER_FATEBREAK_WARD: 'recipe-healer-fatebreak-ward',
  SURVIVAL_STRAW_SUN_HAT: 'recipe-survival-straw-sun-hat',
  SURVIVAL_WOOL_NECK_WRAP: 'recipe-survival-wool-neck-wrap',
  SURVIVAL_FROST_GLARE_LENSES: 'recipe-survival-frost-glare-lenses',
  SURVIVAL_SWAMP_MESH_VEIL: 'recipe-survival-swamp-mesh-veil',
  SURVIVAL_HIDE_TRAIL_VEST: 'recipe-survival-hide-trail-vest',
  SURVIVAL_FUR_SHOULDER_CAPE: 'recipe-survival-fur-shoulder-cape',
  SURVIVAL_PALM_LEAF_PONCHO: 'recipe-survival-palm-leaf-poncho',
  SURVIVAL_BARK_BRACERS: 'recipe-survival-bark-bracers',
  SURVIVAL_FINGERLESS_WORK_MITTS: 'recipe-survival-fingerless-work-mitts',
  SURVIVAL_CLOTH_LEG_WRAPS: 'recipe-survival-cloth-leg-wraps',
  SURVIVAL_HIDE_TRAIL_BOOTS: 'recipe-survival-hide-trail-boots',
  SURVIVAL_SPLIT_PLANKS: 'recipe-survival-split-planks',
  SURVIVAL_WATTLE_PANEL: 'recipe-survival-wattle-panel',
  SURVIVAL_ADOBE_BRICK: 'recipe-survival-adobe-brick',
  SURVIVAL_ROPE_COIL: 'recipe-survival-rope-coil',
  SURVIVAL_PEG_STAKE_PACK: 'recipe-survival-peg-stake-pack',
  SURVIVAL_REED_MAT: 'recipe-survival-reed-mat',
  SURVIVAL_CLAY_DAUB_MIX: 'recipe-survival-clay-daub-mix',
  SURVIVAL_LASHING_TWINE_SPOOL: 'recipe-survival-lashing-twine-spool',
  SURVIVAL_SHADE_LEAN_TO: 'recipe-survival-shade-lean-to',
  SURVIVAL_BRUSH_WINDBREAK: 'recipe-survival-brush-windbreak',
  SURVIVAL_SCOUT_TENT: 'recipe-survival-scout-tent',
  SURVIVAL_CLAIM_BEDROLL: 'recipe-survival-claim-bedroll',
  SURVIVAL_SMOKE_RACK: 'recipe-survival-smoke-rack',
  ...DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID,
} as const;

/** One craft-mode recipe id. */
export type DefiningWorldPlazaCraftModeRecipeId =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID];

/** Craft output family: world entity vs inventory item. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_TYPE = {
  ENTITY: 'entity',
  ITEM: 'item',
} as const;

export type DefiningWorldPlazaCraftModeRecipeType =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_TYPE)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_TYPE];

/** One ingredient row in a recipe. */
export type DefiningWorldPlazaCraftModeRecipeIngredient = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

/** Placeable world outcome (block / entity on claimed ground). */
export type DefiningWorldPlazaCraftModeRecipeEntityOutcome = {
  readonly kind: 'entity';
  readonly blockDefinitionId: DefiningWorldBuildingBlockDefinitionId;
  readonly blockHeight: number;
};

/** Inventory stack outcome. */
export type DefiningWorldPlazaCraftModeRecipeItemOutcome = {
  readonly kind: 'item';
  readonly itemTypeId: string;
  readonly quantity: number;
};

/** Discriminated craft outcome (`kind` matches `recipeType`). */
export type DefiningWorldPlazaCraftModeRecipeOutcome =
  | DefiningWorldPlazaCraftModeRecipeEntityOutcome
  | DefiningWorldPlazaCraftModeRecipeItemOutcome;

/** Left-page art for one recipe spread. */
export type DefiningWorldPlazaCraftModeRecipeVisual =
  | {
      readonly visualKind: 'iconify';
      readonly recipeEmblemIconifyIcon: string;
    }
  | {
      readonly visualKind: 'world-plaza-campfire';
    }
  | {
      readonly visualKind: 'sprite-sheet';
      readonly spriteSheetIcon: DefiningWorldPlazaInventorySpriteSheetIcon;
    };

/** Shared display fields for every recipe. */
type DefiningWorldPlazaCraftModeRecipeDefinitionBase = {
  readonly id: DefiningWorldPlazaCraftModeRecipeId;
  readonly cookbookId: DefiningWorldPlazaCraftModeCookbookId;
  readonly title: string;
  readonly description: string;
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual;
  readonly ingredients: readonly DefiningWorldPlazaCraftModeRecipeIngredient[];
  /**
   * Craft difficulty 1 (fast / ~5s) through 10 (slow / ~3min).
   * Drives the timed craft duration before the outcome applies.
   */
  readonly complexity: number;
  /**
   * When set, craft only succeeds while the player stands near a placed block
   * of this definition (e.g. anvil for smithing items).
   */
  readonly requiredNearbyBlockDefinitionId?: DefiningWorldBuildingBlockDefinitionId;
  /** Chebyshev tile reach for {@link requiredNearbyBlockDefinitionId}. */
  readonly requiredNearbyBlockRangeTiles?: number;
};

/** Entity-output recipe (arms build placement). */
export type DefiningWorldPlazaCraftModeEntityRecipeDefinition =
  DefiningWorldPlazaCraftModeRecipeDefinitionBase & {
    readonly recipeType: 'entity';
    readonly outcome: DefiningWorldPlazaCraftModeRecipeEntityOutcome;
  };

/** Item-output recipe (adds to inventory immediately). */
export type DefiningWorldPlazaCraftModeItemRecipeDefinition =
  DefiningWorldPlazaCraftModeRecipeDefinitionBase & {
    readonly recipeType: 'item';
    readonly outcome: DefiningWorldPlazaCraftModeRecipeItemOutcome;
  };

/** Display + rules metadata for one recipe. */
export type DefiningWorldPlazaCraftModeRecipeDefinition =
  | DefiningWorldPlazaCraftModeEntityRecipeDefinition
  | DefiningWorldPlazaCraftModeItemRecipeDefinition;

/** One ingredient row with live owned/required counts for the cookbook UI. */
export type DefiningWorldPlazaCraftModeRecipeIngredientRow = {
  readonly itemTypeId: string;
  readonly displayName: string;
  readonly ownedQuantity: number;
  readonly requiredQuantity: number;
  readonly isShort: boolean;
};

/**
 * Inventory item type id for the loose recipe page that attaches this recipe.
 *
 * @param recipeId - Craft recipe id
 */
export function resolvingWorldPlazaCraftRecipePageItemTypeId(
  recipeId: DefiningWorldPlazaCraftModeRecipeId
): string {
  return `world-plaza-recipe-page:${recipeId}`;
}
