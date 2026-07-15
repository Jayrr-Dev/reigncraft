/**
 * Canonical mushroom species ids (sheet order 0–15, look-alike pairs adjacent).
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds
 */

export const DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS = [
  'golden-chanter',
  'false-lantern',
  'honeycomb-morel',
  'brain-cap',
  'king-bolete',
  'devils-bolete',
  'cloud-puff',
  'angel-button',
  'cluster-honey',
  'funeral-bell',
  'white-parasol',
  'green-vomiter',
  'field-agaric',
  'yellow-stain',
  'shelf-oyster',
  'ghost-wing',
] as const;

export type DefiningWorldPlazaMushroomSpeciesId =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS)[number];

export const DEFINING_WORLD_PLAZA_MUSHROOM_LOOK_ALIKE_PAIR_IDS = [
  'chanter-lantern',
  'morel-brain',
  'bolete-devil',
  'puff-angel',
  'honey-bell',
  'parasol-vomiter',
  'agaric-stain',
  'oyster-ghost',
] as const;

export type DefiningWorldPlazaMushroomLookAlikePairId =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_LOOK_ALIKE_PAIR_IDS)[number];
