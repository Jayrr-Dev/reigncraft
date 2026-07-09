/**
 * Hidden disease risk for meat from deer killed while hostile to the player.
 *
 * @module components/world/wildlife/domains/definingWildlifeAggroDeerMeatConstants
 */

/** Inventory / ground-item metadata flag for aggro-deer kill meat. */
export const DEFINING_WILDLIFE_AGGRO_DEER_MEAT_METADATA_KEY =
  'aggroDeerKill' as const;

/**
 * Cooked chronic-wasting chance for tagged deer meat (normal cooked deer is 5%).
 * Cooking does not fully clear prions from a buck that died fighting.
 */
export const DEFINING_WILDLIFE_AGGRO_DEER_MEAT_COOKED_DISEASE_CHANCE = 0.22;
