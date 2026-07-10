/**
 * Eating sound lines shown above the player while the eat channel runs.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFoodEatFlavorTextConstants
 */

/** Words per eating sound line; each line is revealed on this beat count. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_BEAT_COUNT = 3;

/** Suffix shown on the rest beat after the third chomp (e.g. "CHOMP..."). */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_REST_BEAT_SUFFIX = '...';

/**
 * Eating sound lines. One is picked at channel start. Each line is three
 * beats with rising emphasis (Chomp ChomP CHOMP), then a rest beat with "...".
 */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_FLAVOR_LINES = [
  'Chomp ChomP CHOMP',
  'Crunch CrunCH CRUNCH',
  'Nom NOM nom',
  'Munch MunCH MUNCH',
  'Mmm MmM MMM',
  'Gnam GnAM GNAM',
] as const;

export type DefiningWorldPlazaFoodEatFlavorLine =
  (typeof DEFINING_WORLD_PLAZA_FOOD_EAT_FLAVOR_LINES)[number];

/** Delay between each eating sound beat (ms). Deliberately slow, waltz-like. */
export const DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_WORD_REVEAL_INTERVAL_MS = 720;

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
 * Reveals the sound line on a beat-of-three rhythm, then holds with "..."
 * before looping while the channel runs.
 */
export function computingWorldPlazaInventoryFoodEatSoundRevealText(
  line: string,
  elapsedMs: number,
  revealIntervalMs: number = DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_WORD_REVEAL_INTERVAL_MS
): string {
  const words = line.split(' ').filter((word) => word.length > 0);

  if (words.length === 0) {
    return line;
  }

  const beatCount = Math.min(
    DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_BEAT_COUNT,
    words.length
  );
  const cycleStepCount = beatCount + 1;
  const revealSteps = Math.max(0, Math.floor(elapsedMs / revealIntervalMs));
  const stepInCycle = revealSteps % cycleStepCount;

  if (stepInCycle < beatCount) {
    return words.slice(0, stepInCycle + 1).join(' ');
  }

  return `${words.slice(0, beatCount).join(' ')}${DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_REST_BEAT_SUFFIX}`;
}
