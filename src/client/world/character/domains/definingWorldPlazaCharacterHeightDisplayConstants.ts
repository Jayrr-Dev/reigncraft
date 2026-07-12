/**
 * Declarative translation constants for character profile height display.
 *
 * @module components/world/character/domains/definingWorldPlazaCharacterHeightDisplayConstants
 */

/**
 * Real-world inches represented by one world layer at the profile baseline.
 * 4 layers × 16 in = 5'4" for sizeScale 1.
 */
export const DEFINING_WORLD_PLAZA_CHARACTER_INCHES_PER_WORLD_LAYER =
  16 as const;

/** Profile attribute label for height. */
export const LABELING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE =
  'Height' as const;

/** Iconify id for the height attribute chip. */
export const DEFINING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE_ICON =
  'mdi:human-male-height' as const;
