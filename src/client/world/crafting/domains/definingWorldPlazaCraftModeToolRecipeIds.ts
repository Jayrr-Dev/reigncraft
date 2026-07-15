/**
 * Craft recipe ids for tiered tools (sword / axe / pickaxe / hoe / scythe / fishrod).
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds
 */

/** Stable recipe ids for every tiered tool craft. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID = {
  SWORD_WOOD: 'recipe-sword-wood',
  SWORD_IRON: 'recipe-sword-iron',
  SWORD_STEEL: 'recipe-sword-steel',
  SWORD_GOLD: 'recipe-sword-gold',
  AXE_WOOD: 'recipe-axe-wood',
  AXE_IRON: 'recipe-axe-iron',
  AXE_STEEL: 'recipe-axe-steel',
  AXE_GOLD: 'recipe-axe-gold',
  PICKAXE_WOOD: 'recipe-pickaxe-wood',
  PICKAXE_IRON: 'recipe-pickaxe-iron',
  PICKAXE_STEEL: 'recipe-pickaxe-steel',
  PICKAXE_GOLD: 'recipe-pickaxe-gold',
  HOE_WOOD: 'recipe-hoe-wood',
  HOE_IRON: 'recipe-hoe-iron',
  HOE_STEEL: 'recipe-hoe-steel',
  HOE_GOLD: 'recipe-hoe-gold',
  SCYTHE_WOOD: 'recipe-scythe-wood',
  SCYTHE_IRON: 'recipe-scythe-iron',
  SCYTHE_STEEL: 'recipe-scythe-steel',
  SCYTHE_GOLD: 'recipe-scythe-gold',
  FISHROD_WOOD: 'recipe-fishrod-wood',
  FISHROD_IRON: 'recipe-fishrod-iron',
  FISHROD_STEEL: 'recipe-fishrod-steel',
  FISHROD_GOLD: 'recipe-fishrod-gold',
} as const;

export type DefiningWorldPlazaCraftModeToolRecipeId =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID];
