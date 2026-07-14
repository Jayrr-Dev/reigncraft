/**
 * Proximity rules for craft recipes that need a world station (e.g. anvil).
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftRecipeNearbyStationConstants
 */

/** Default Chebyshev reach to a required craft station. */
export const DEFINING_WORLD_PLAZA_CRAFT_RECIPE_NEARBY_STATION_RANGE_TILES = 2;

/** Toast when a smith recipe is pressed away from its station. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_NEARBY_STATION_REQUIRED_TOAST =
  'Stand near an Anvil to smith that.' as const;

/**
 * Builds the cookbook hint for a recipe that needs a nearby station.
 *
 * @param stationDisplayName - Block display name (e.g. Anvil)
 */
export function labelingWorldPlazaCraftRecipeNearbyStationRequirement(
  stationDisplayName: string
): string {
  return `Stand near a ${stationDisplayName} to craft.`;
}
