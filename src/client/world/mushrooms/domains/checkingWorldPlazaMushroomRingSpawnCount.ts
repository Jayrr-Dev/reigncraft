/**
 * Predicate for supported mushroom fairy-ring sizes.
 *
 * @module components/world/mushrooms/domains/checkingWorldPlazaMushroomRingSpawnCount
 */

import {
  DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS,
  type DefiningWorldPlazaMushroomRingSpawnCount,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRingSpawnConstants';

export function checkingWorldPlazaMushroomRingSpawnCount(
  count: number
): count is DefiningWorldPlazaMushroomRingSpawnCount {
  return (
    DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS as readonly number[]
  ).includes(count);
}
