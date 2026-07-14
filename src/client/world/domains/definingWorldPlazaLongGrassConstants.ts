/**
 * Long-grass decorative flora constants for the plaza floor.
 *
 * @module components/world/domains/definingWorldPlazaLongGrassConstants
 */

import type {
  WorldLongGrassFacing,
  WorldLongGrassSizeVariant,
} from '../../../shared/worldLongGrassPlacement';
import { formattingWorldLongGrassSpriteUrl } from '../../../shared/worldLongGrassPlacement';

/** Display scale relative to one isometric tile width. */
export const DEFINING_WORLD_PLAZA_LONG_GRASS_DISPLAY_SCALE = 1.15;

/** All shipped long-grass sprite URLs (preload manifest). */
export const DEFINING_WORLD_PLAZA_LONG_GRASS_SPRITE_URLS: readonly string[] =
  (['b1', 'b5'] as const).flatMap((sizeVariant: WorldLongGrassSizeVariant) =>
    (['n', 's', 'e', 'w'] as const).map((facing: WorldLongGrassFacing) =>
      formattingWorldLongGrassSpriteUrl(sizeVariant, facing)
    )
  );
