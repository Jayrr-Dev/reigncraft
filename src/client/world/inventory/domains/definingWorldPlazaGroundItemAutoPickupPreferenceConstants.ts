/**
 * Walk-over auto-pickup preference for plaza ground items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaGroundItemAutoPickupPreferenceConstants
 */

/** localStorage key for the ground-item auto-pickup preference. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_STORAGE_KEY =
  'world-plaza-ground-item-auto-pickup-enabled' as const;

/** Default: off; players pick up by click unless they enable walk-over. */
export const DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_DEFAULT_ENABLED = false;

/** Settings row label in the action-bar mixer panel. */
export const LABELING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_TOGGLE =
  'Auto pick up' as const;
