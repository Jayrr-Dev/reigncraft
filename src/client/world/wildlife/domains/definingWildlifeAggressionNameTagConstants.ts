/**
 * Seeded prefix pools for tame and aggressive wildlife name tags.
 *
 * @module components/world/wildlife/domains/definingWildlifeAggressionNameTagConstants
 */

/** Prefix pool rolled when {@link DefiningWildlifeAggressionLevel} is aggressive. */
export const DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_AGGRESSIVE_PREFIXES = [
  'Killer',
  'Angry',
  'Pissed',
  'Crazy',
  'Deadly',
  'Suicidal',
  'Rash',
  'Manic',
  'Crazed',
  'Wild',
  'Insane',
  'Feral',
  'Vicious',
  'Savage',
  'Ferocious',
  'Unhinged',
  'Bloodthirsty',
] as const;

/** Prefix pool rolled when aggression level is tame. */
export const DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_TAME_PREFIXES = [
  'Shy',
  'Tame',
  'Kind',
  'Gentle',
  'Friendly',
  'Nice',
  'Timid',
  'Good',
  'Peaceful',
  'Harmless',
  'Calm',
  'Docile',
  'Sweet',
] as const;

/** Salt for picking a stable aggression prefix from spawn anchor coordinates. */
export const DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_PREFIX_PICK_SALT = 6631;
