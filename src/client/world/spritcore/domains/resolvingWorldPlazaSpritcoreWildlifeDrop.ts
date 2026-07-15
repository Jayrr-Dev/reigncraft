/**
 * Resolves runtime wildlife Spiritcore drops from fought combat strength.
 *
 * Species-only calls use catalog vitals. When an instance is passed, drops scale
 * with that animal's effective max health and attack (size σ, distance danger,
 * obese/apex frames, feast power, companion upgrades).
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreWildlifeDrop
 */

import { computingWorldPlazaSpritcoreMonsterDrop } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreMonsterDrop';
import { resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceAttackPowerMultiplier,
  resolvingWildlifeInstanceBaseMaxHealth,
  resolvingWildlifeInstanceEffectiveAttackIntervalMs,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

/**
 * Computes the Spiritcore drop for one wildlife kill.
 *
 * @param species - Species definition (scaled catalog vitals).
 * @param instance - Optional live instance; when set, uses fought strength.
 * @param nowMs - Clock for feast power expiry (defaults to now).
 */
export function resolvingWorldPlazaSpritcoreWildlifeDrop(
  species: DefiningWildlifeSpeciesDefinition,
  instance?: DefiningWildlifeInstance,
  nowMs: number = Date.now()
): number {
  if (!instance) {
    const attacksPerSecond =
      resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond(
        species.vitals.attackIntervalMs
      );

    return computingWorldPlazaSpritcoreMonsterDrop(
      species.vitals.baseMaxHealth,
      species.vitals.attackPower,
      attacksPerSecond
    );
  }

  const effectiveMaxHealth = resolvingWildlifeInstanceBaseMaxHealth(
    species,
    instance
  );
  const effectiveAttackPower = Math.max(
    1,
    Math.round(
      species.vitals.attackPower *
        resolvingWildlifeInstanceAttackPowerMultiplier(species, instance, nowMs)
    )
  );
  const effectiveAttackIntervalMs =
    resolvingWildlifeInstanceEffectiveAttackIntervalMs(species, instance);
  const attacksPerSecond =
    effectiveAttackIntervalMs > 0 ? 1000 / effectiveAttackIntervalMs : 0;

  return computingWorldPlazaSpritcoreMonsterDrop(
    effectiveMaxHealth,
    effectiveAttackPower,
    attacksPerSecond
  );
}
