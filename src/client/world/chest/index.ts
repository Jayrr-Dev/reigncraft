/**
 * Public API for declarative world chest props.
 *
 * @module components/world/chest
 */

export { RenderingWorldPlazaChestInteractionLabels } from '@/components/world/chest/components/renderingWorldPlazaChestInteractionLabels';
export { RenderingWorldPlazaChestLayer } from '@/components/world/chest/components/renderingWorldPlazaChestLayer';
export {
  DEFINING_WORLD_PLAZA_CHEST_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_CHEST_INTERACT_REACH_GRID,
  DEFINING_WORLD_PLAZA_CHEST_SPRITE_URLS,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_ACTION,
  LABELING_WORLD_PLAZA_CHEST_OPEN_ACTION,
  LABELING_WORLD_PLAZA_CHEST_UNLOCK_ACTION,
} from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
export { DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY } from '@/components/world/chest/domains/definingWorldPlazaChestLootPoolRegistry';
export { DEFINING_WORLD_PLAZA_CHEST_PLACEMENT_REGISTRY } from '@/components/world/chest/domains/definingWorldPlazaChestPlacementRegistry';
export type {
  DefiningWorldPlazaChestFacing,
  DefiningWorldPlazaChestId,
  DefiningWorldPlazaChestInstance,
  DefiningWorldPlazaChestKeySource,
  DefiningWorldPlazaChestLoot,
  DefiningWorldPlazaChestPlacement,
  DefiningWorldPlazaChestState,
  DefiningWorldPlazaChestVariant,
} from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
export { usingWorldPlazaChestOpenInteraction } from '@/components/world/chest/hooks/usingWorldPlazaChestOpenInteraction';
