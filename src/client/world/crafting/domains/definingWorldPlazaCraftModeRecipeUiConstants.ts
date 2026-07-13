/**
 * Player-facing copy for craft-mode recipes and toasts.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants
 */

/** Right-page heading above ingredient rows. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REQUIRED_ITEMS =
  'Required Items' as const;

/** Craft action label on recipe spreads. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CRAFT_ACTION =
  'Craft' as const;

/** Toast when materials are missing at craft press. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_MISSING_MATERIALS_TOAST =
  'You do not have the materials for that recipe.' as const;

/** Toast when placement is armed but materials were spent elsewhere. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_MATERIALS_LOST_TOAST =
  'Materials ran out before placement finished. Craft again when you have enough.' as const;

/** Toast after a successful inventory-output craft. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INVENTORY_SUCCESS_TOAST =
  'Crafted successfully.' as const;

/** Toast when inventory has no room for the crafted output. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INVENTORY_FULL_TOAST =
  'Inventory is full.' as const;

/** Toast when crafted placement is canceled or selection changes. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_CANCELED_TOAST =
  'Placement canceled. Materials returned.' as const;

/** Toast after a crafted campfire is removed in build mode. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_REFUNDED_TOAST =
  'Campfire removed. Craft materials returned.' as const;

/** Toast when refund cannot fit in inventory. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REFUND_INVENTORY_FULL_TOAST =
  'Inventory is full. Could not return all craft materials.' as const;

/** Pixi canvas size for the map campfire recipe preview. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_WIDTH_PX = 120;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_HEIGHT_PX = 72;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_X_PX =
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_WIDTH_PX / 2;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_Y_PX =
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_HEIGHT_PX * 0.58;

/** Toast after a crafted placeable is committed. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_SUCCESS_TOAST =
  'Campfire placed.' as const;

/** Blank spread copy when a cookbook has no registered recipes yet. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_NO_RECIPES_PAGE =
  'This page is still blank. Recipes will be written here soon.' as const;
