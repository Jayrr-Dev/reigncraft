/**
 * Maps total Spiritcore invested into a player-facing level label.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreDisplayLevel
 */

import { computingWorldPlazaSpritcoreStatFromEquivalentValue } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreEquivalentValue';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';

/** Legacy per-level HP gain used only for display mapping. */
const COMPUTING_WORLD_PLAZA_SPRITCORE_DISPLAY_LEVEL_HP_PER_LEVEL = 50;

/**
 * Derives a display level from total Spiritcore invested through the health curve.
 */
export function computingWorldPlazaSpritcoreDisplayLevel(
  totalSpritcoreInvested: number
): number {
  if (totalSpritcoreInvested <= 0) {
    return 1;
  }

  const equivalentHealth = computingWorldPlazaSpritcoreStatFromEquivalentValue(
    totalSpritcoreInvested,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP
  );

  return Math.max(
    1,
    1 +
      Math.floor(
        (equivalentHealth - DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP) /
          COMPUTING_WORLD_PLAZA_SPRITCORE_DISPLAY_LEVEL_HP_PER_LEVEL
      )
  );
}
