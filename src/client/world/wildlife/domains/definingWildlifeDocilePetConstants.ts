/**
 * Timed Pet interaction on living cats and dogs (study-friendly companions).
 *
 * @module components/world/wildlife/domains/definingWildlifeDocilePetConstants
 */

/** Outlined label while waiting to start a pet. */
export const LABELING_WILDLIFE_DOCILE_PET_CAT_TITLE = 'Pet the Cat' as const;

/** Outlined label while waiting to start a pet. */
export const LABELING_WILDLIFE_DOCILE_PET_DOG_TITLE = 'Pet the Dog' as const;

/** Outlined label while the pet channel runs. */
export const LABELING_WILDLIFE_DOCILE_PETTING_TITLE = 'Petting....' as const;

/** Bundled Iconify id for the pet progress ring center icon. */
export const DEFINING_WILDLIFE_DOCILE_PET_PROGRESS_ICON = 'mdi:paw' as const;

/** Delay after activating Pet before study points apply (ms). */
export const DEFINING_WILDLIFE_DOCILE_PET_WINDUP_MS = 2_000 as const;

/** Study points awarded for one completed pet. */
export const DEFINING_WILDLIFE_DOCILE_PET_STUDY_POINTS = 1 as const;

/**
 * Minimum in-game hours before the same living companion can be petted again.
 * Converted to wall-clock ms via `computingWorldPlazaInGameHoursToRealMs`.
 */
export const DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MIN_IN_GAME_HOURS =
  1 as const;

/**
 * Maximum in-game hours before the same living companion can be petted again.
 * Each pet rolls uniformly in `[min, max]`.
 */
export const DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MAX_IN_GAME_HOURS =
  3 as const;

/**
 * Extra screen lift above the wildlife name tag so Pet / Petting....
 * does not cover the animal label (world-local px, pre-zoom).
 */
export const DEFINING_WILDLIFE_DOCILE_PET_LABEL_OFFSET_ABOVE_NAME_TAG_PX =
  26 as const;

/** Species ids that use the cat pet label. */
export const DEFINING_WILDLIFE_DOCILE_PET_CAT_SPECIES_IDS = [
  'cat-black',
  'cat-white',
  'cat-orange',
  'cat-large',
] as const;

/** Species ids that use the dog pet label. */
export const DEFINING_WILDLIFE_DOCILE_PET_DOG_SPECIES_IDS = [
  'shepherd-dog',
  'husky',
  'golden-retriever',
] as const;

/** Species ids that use the pinguin pet label. */
export const DEFINING_WILDLIFE_DOCILE_PET_PINGUIN_SPECIES_IDS = [
  'pinguin',
] as const;

/** Species ids that use the monkey pet label. */
export const DEFINING_WILDLIFE_DOCILE_PET_MONKEY_SPECIES_IDS = [
  'monkey',
] as const;

export type DefiningWildlifeDocilePetKind =
  | 'cat'
  | 'dog'
  | 'pinguin'
  | 'monkey';

/** Outlined label while waiting to start a pet. */
export const LABELING_WILDLIFE_DOCILE_PET_PINGUIN_TITLE =
  'Pet the Pinguin' as const;

/** Outlined label while waiting to start a pet. */
export const LABELING_WILDLIFE_DOCILE_PET_MONKEY_TITLE =
  'Pet the Monkey' as const;
