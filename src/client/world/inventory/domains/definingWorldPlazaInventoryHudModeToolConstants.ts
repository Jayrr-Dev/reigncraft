/**
 * Craft / Build / Claim hotbar tools that drive HUD toolbar mode when equipped.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryHudModeToolConstants
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** Ordered HUD mode tools granted to every inventory (Craft, Build, Claim). */
export const DEFINING_WORLD_PLAZA_INVENTORY_HUD_MODE_TOOL_TYPE_IDS = [
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
] as const;

/** One HUD mode tool item type id. */
export type DefiningWorldPlazaInventoryHudModeToolTypeId =
  (typeof DEFINING_WORLD_PLAZA_INVENTORY_HUD_MODE_TOOL_TYPE_IDS)[number];
