/**
 * Sprite-sheet cells for plaza day/night orb sun and moon icons.
 *
 * @module components/world/domains/definingWorldPlazaDayNightCelestialSpriteSheetConstants
 */

/** Which celestial body is active in the day/night orb. */
export type DefiningWorldPlazaDayNightCelestialBody = 'sun' | 'moon';

/** 2×1 sheet: sun, moon (left → right). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_URL =
  '/environment/sprites/day-night-celestial-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_COLUMN_COUNT = 2;
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_ROW_COUNT = 1;

/** Column index per celestial body (matches sheet order). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_COLUMN_INDEX: Record<
  DefiningWorldPlazaDayNightCelestialBody,
  number
> = {
  sun: 0,
  moon: 1,
};
