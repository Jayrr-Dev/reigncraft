/**
 * Berry-shrub decorative flora constants for the plaza floor.
 *
 * @module components/world/domains/definingWorldPlazaShrubConstants
 */

import type { WorldShrubFacing } from '../../../shared/worldShrubPlacement';
import { formattingWorldShrubSpriteUrl } from '../../../shared/worldShrubPlacement';

/** Display scale relative to one isometric tile width. */
export const DEFINING_WORLD_PLAZA_SHRUB_DISPLAY_SCALE = 1.2;

/**
 * Chebyshev tile radius around molten lava where shrubs must not spawn.
 */
export const DEFINING_WORLD_PLAZA_SHRUB_LAVA_CLEARANCE_RADIUS_TILES = 2;

const DEFINING_WORLD_PLAZA_SHRUB_FACINGS: readonly WorldShrubFacing[] = [
  'n',
  'e',
  's',
  'w',
];

/** All shipped shrub sprite URLs (preload manifest): 4 facings × 2 pick states. */
export const DEFINING_WORLD_PLAZA_SHRUB_SPRITE_URLS: readonly string[] =
  DEFINING_WORLD_PLAZA_SHRUB_FACINGS.flatMap((facing) => [
    formattingWorldShrubSpriteUrl(facing, false),
    formattingWorldShrubSpriteUrl(facing, true),
  ]);
