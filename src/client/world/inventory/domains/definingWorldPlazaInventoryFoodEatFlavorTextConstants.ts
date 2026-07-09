/**
 * Flavor lines shown above the player while the eat channel runs.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFoodEatFlavorTextConstants
 */

/** Primary status line always shown while eating. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_STATUS_TEXT = 'Munching...' as const;

/**
 * Secondary flavor lines. One is picked at channel start.
 */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_FLAVOR_LINES = [
  'Chewing carefully.',
  'Taking big bites.',
  'Savoring the bite.',
  'Working through it.',
  'Not rushing this.',
  'Jaw on the job.',
  'One bite at a time.',
  'Still chewing.',
  'Almost done… wait.',
  'Taste first, walk later.',
] as const;

export type DefiningWorldPlazaFoodEatFlavorLine =
  (typeof DEFINING_WORLD_PLAZA_FOOD_EAT_FLAVOR_LINES)[number];

/**
 * Picks a flavor line for one eat channel.
 */
export function resolvingWorldPlazaInventoryFoodEatFlavorLine(
  roll: number = Math.random()
): DefiningWorldPlazaFoodEatFlavorLine {
  const lines = DEFINING_WORLD_PLAZA_FOOD_EAT_FLAVOR_LINES;
  const index = Math.min(
    lines.length - 1,
    Math.max(0, Math.floor(roll * lines.length))
  );

  return lines[index]!;
}
