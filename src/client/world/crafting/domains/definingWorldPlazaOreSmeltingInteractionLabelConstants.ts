/**
 * Ore-smelting station world interaction label copy and layout.
 *
 * @module components/world/crafting/domains/definingWorldPlazaOreSmeltingInteractionLabelConstants
 */

/** Outlined action text on bloomery / kiln / stove (opens smelt UI). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_REFINE =
  'Refine' as const;

/**
 * Lift above the station foot center for the Refine popover (world-local px).
 * Tall kiln/bloomery sprites need more clearance than campfire.
 */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_INTERACTION_LABEL_OFFSET_ABOVE_FOOT_PX =
  48 as const;

/**
 * Chebyshev tiles the player may walk from an open bloomery / kiln / stove UI
 * before it auto-closes. Wider than interact reach so small repositioning is fine.
 */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_STATION_UI_KEEP_OPEN_RANGE_TILES = 5;
