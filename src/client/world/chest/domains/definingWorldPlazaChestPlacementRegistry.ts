/**
 * Fixed world placements for plaza chest props.
 *
 * Registry defaults to empty — hand placements only. Procedural locked chests
 * spawn from tile seeds when the player enters view (see procedural chest sync).
 *
 * @module components/world/chest/domains/definingWorldPlazaChestPlacementRegistry
 */

import type { DefiningWorldPlazaChestPlacement } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';

/**
 * Hand-authored chest placements. Start empty; uncomment examples to test.
 *
 * Example (do not leave enabled unless testing):
 * ```
 * import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED } from '...';
 * {
 *   chestId: 'chest-demo-1',
 *   worldX: 8,
 *   worldY: 3,
 *   facing: 's',
 *   variant: 'a',
 *   initialState: 'closed',
 *   loot: { kind: 'item', itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED, quantity: 3 },
 * },
 * {
 *   chestId: 'chest-demo-locked',
 *   worldX: 9,
 *   worldY: 3,
 *   facing: 's',
 *   variant: 'b',
 *   initialState: 'locked',
 *   loot: { kind: 'pool', poolId: 'starter-forage' },
 * },
 * ```
 */
export const DEFINING_WORLD_PLAZA_CHEST_PLACEMENT_REGISTRY: readonly DefiningWorldPlazaChestPlacement[] =
  [];
