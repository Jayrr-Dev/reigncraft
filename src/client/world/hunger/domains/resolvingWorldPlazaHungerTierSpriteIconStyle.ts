/**
 * Resolves CSS background-crop styles for one hunger-tier sprite cell.
 *
 * @module components/world/hunger/domains/resolvingWorldPlazaHungerTierSpriteIconStyle
 */

import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import {
  DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_COLUMN_INDEX,
  DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_COLUMN_COUNT,
  DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_ROW_COUNT,
  DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_URL,
} from '@/components/world/hunger/domains/definingWorldPlazaHungerTierSpriteSheetConstants';
import type { CSSProperties } from 'react';

/**
 * Pixel-art drumstick crop for the given hunger tier and HUD icon size.
 */
export function resolvingWorldPlazaHungerTierSpriteIconStyle(
  tier: DefiningWorldPlazaHungerTier,
  iconSizePx: number
): CSSProperties {
  const columnIndex =
    DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_COLUMN_INDEX[tier];
  const columnCount =
    DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_COLUMN_COUNT;
  const rowCount = DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_ROW_COUNT;
  const backgroundPositionX =
    columnCount <= 1 ? 0 : (columnIndex / (columnCount - 1)) * 100;

  return {
    width: iconSizePx,
    height: iconSizePx,
    backgroundImage: `url("${DEFINING_WORLD_PLAZA_HUNGER_TIER_SPRITE_SHEET_URL}")`,
    backgroundPosition: `${backgroundPositionX}% 0%`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${columnCount * 100}% ${rowCount * 100}%`,
    imageRendering: 'pixelated',
    filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.55))',
  };
}
