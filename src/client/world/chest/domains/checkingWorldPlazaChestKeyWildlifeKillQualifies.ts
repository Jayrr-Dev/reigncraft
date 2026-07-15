/**
 * Qualifies wildlife kills for chest-key drops and strongest-animal checks.
 *
 * @module components/world/chest/domains/checkingWorldPlazaChestKeyWildlifeKillQualifies
 */

import type { DefiningWorldPlazaChestInstance } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_WILDLIFE_STRONGEST_RADIUS_GRID } from '@/components/world/chest/domains/definingWorldPlazaProceduralChestConstants';
import { listingWorldPlazaLockedChestInstances } from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { listingWorldPlazaChestWildlifeInstancesForKeyChecks } from '@/components/world/chest/domains/registeringWorldPlazaChestWildlifeInstancesLookup';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function checkingWorldPlazaPointWithinChestRadius(
  chest: DefiningWorldPlazaChestInstance,
  pointX: number,
  pointY: number,
  radiusGrid: number
): boolean {
  const dx = pointX - chest.position.x;
  const dy = pointY - chest.position.y;
  const radiusSq = radiusGrid * radiusGrid;

  return dx * dx + dy * dy <= radiusSq;
}

function resolvingWildlifeInstanceStrengthScore(
  instance: DefiningWildlifeInstance
): number {
  return instance.healthState.baseMaxHealth;
}

/**
 * True when no other live animal within the chest radius beats the killed
 * animal's strength score.
 */
export function checkingWorldPlazaWildlifeKillWasStrongestNearChest(
  chest: DefiningWorldPlazaChestInstance,
  killedInstance: DefiningWildlifeInstance,
  radiusGrid: number = DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_WILDLIFE_STRONGEST_RADIUS_GRID
): boolean {
  if (
    !checkingWorldPlazaPointWithinChestRadius(
      chest,
      killedInstance.position.x,
      killedInstance.position.y,
      radiusGrid
    )
  ) {
    return false;
  }

  const killedStrength = resolvingWildlifeInstanceStrengthScore(killedInstance);

  for (const candidate of listingWorldPlazaChestWildlifeInstancesForKeyChecks()) {
    if (candidate.instanceId === killedInstance.instanceId) {
      continue;
    }

    if (candidate.healthState.currentHealth <= 0) {
      continue;
    }

    if (
      !checkingWorldPlazaPointWithinChestRadius(
        chest,
        candidate.position.x,
        candidate.position.y,
        radiusGrid
      )
    ) {
      continue;
    }

    const candidateStrength = resolvingWildlifeInstanceStrengthScore(candidate);

    if (candidateStrength > killedStrength) {
      return false;
    }
  }

  return true;
}

function checkingWorldPlazaChestKeyWildlifeKillMatchesChest(
  chest: DefiningWorldPlazaChestInstance,
  killedInstance: DefiningWildlifeInstance
): boolean {
  switch (chest.keySource) {
    case 'wildlife':
      return true;
    case 'wildlife-species':
      return (
        chest.keyWildlifeSpeciesId !== undefined &&
        chest.keyWildlifeSpeciesId === killedInstance.speciesId
      );
    case 'wildlife-strongest':
      return checkingWorldPlazaWildlifeKillWasStrongestNearChest(
        chest,
        killedInstance
      );
    default:
      return false;
  }
}

/**
 * True when a wildlife kill satisfies at least one active locked chest key rule.
 */
export function checkingWorldPlazaChestKeyWildlifeKillQualifies(
  killedInstance: DefiningWildlifeInstance
): boolean {
  return listingWorldPlazaLockedChestInstances().some((chest) =>
    checkingWorldPlazaChestKeyWildlifeKillMatchesChest(chest, killedInstance)
  );
}
