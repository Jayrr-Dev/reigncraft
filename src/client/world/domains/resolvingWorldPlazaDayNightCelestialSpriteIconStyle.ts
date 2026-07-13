/**
 * Resolves CSS background-crop styles for the day/night sun or moon sprite.
 *
 * @module components/world/domains/resolvingWorldPlazaDayNightCelestialSpriteIconStyle
 */

import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_COLUMN_INDEX,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_URL,
  type DefiningWorldPlazaDayNightCelestialBody,
} from '@/components/world/domains/definingWorldPlazaDayNightCelestialSpriteSheetConstants';
import type { CSSProperties } from 'react';

/**
 * Pixel-art celestial crop for the given body and HUD icon size.
 */
export function resolvingWorldPlazaDayNightCelestialSpriteIconStyle(
  celestialBody: DefiningWorldPlazaDayNightCelestialBody,
  iconSizePx: number
): CSSProperties {
  const columnIndex =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_COLUMN_INDEX[celestialBody];
  const columnCount =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_COLUMN_COUNT;
  const rowCount =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_ROW_COUNT;
  const backgroundPositionX =
    columnCount <= 1 ? 0 : (columnIndex / (columnCount - 1)) * 100;

  return {
    width: iconSizePx,
    height: iconSizePx,
    backgroundImage: `url("${DEFINING_WORLD_PLAZA_DAY_NIGHT_CELESTIAL_SPRITE_SHEET_URL}")`,
    backgroundPosition: `${backgroundPositionX}% 0%`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${columnCount * 100}% ${rowCount * 100}%`,
    imageRendering: 'pixelated',
    filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.55))',
  };
}
