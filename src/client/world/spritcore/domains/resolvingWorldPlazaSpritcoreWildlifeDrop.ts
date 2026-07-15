/**
 * Resolves runtime wildlife Spiritcore drops from species vitals.
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeDrop
 */

import { computingWorldPlazaSpritcoreMonsterDrop } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreMonsterDrop';
import { resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** Computes the Spiritcore drop for one wildlife species at runtime vitals. */
export function resolvingWorldPlazaSpritcoreWildlifeDrop(
  species: DefiningWildlifeSpeciesDefinition
): number {
  const attacksPerSecond = resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond(
    species.vitals.attackIntervalMs
  );

  return computingWorldPlazaSpritcoreMonsterDrop(
    species.vitals.baseMaxHealth,
    species.vitals.attackPower,
    attacksPerSecond
  );
}
