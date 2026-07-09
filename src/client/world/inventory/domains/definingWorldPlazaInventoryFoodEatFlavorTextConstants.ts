/**
 * Eating sound lines shown above the player while the eat channel runs.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFoodEatFlavorTextConstants
 */

/**
 * Eating sound lines. One is picked at channel start and its words are
 * revealed one at a time while the channel runs.
 */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_FLAVOR_LINES = [
  'nom nom nom',
  'crunch crunch crunch',
  'chomp chomp chomp',
  'munch munch munch',
  'mmm mmm mmm',
  'gnam gnam gnam',
] as const;

export type DefiningWorldPlazaFoodEatFlavorLine =
  (typeof DEFINING_WORLD_PLAZA_FOOD_EAT_FLAVOR_LINES)[number];

/** Delay between each revealed sound word (ms). */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_WORD_REVEAL_INTERVAL_MS = 450;

/**
 * Picks an eating sound line for one eat channel.
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

/**
 * Reveals the sound line one word at a time, looping while the channel runs.
 */
export function computingWorldPlazaInventoryFoodEatSoundRevealText(
  line: string,
  elapsedMs: number,
  revealIntervalMs: number = DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_WORD_REVEAL_INTERVAL_MS
): string {
  const words = line.split(' ');

  if (words.length === 0) {
    return line;
  }

  const revealSteps = Math.max(0, Math.floor(elapsedMs / revealIntervalMs));
  const visibleWordCount = (revealSteps % words.length) + 1;

  return words.slice(0, visibleWordCount).join(' ');
}
