/**
 * Territory intrusion checks for stand-and-face warnings.
 *
 * @module components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifePointIsInsideTerritoryAnchor } from '@/components/world/wildlife/domains/checkingWildlifePointIsInsideTerritoryAnchor';
import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type {
  DefiningWildlifeSpeciesDefinition,
  DefiningWildlifeSpeciesTerritoryConfig,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_TERRITORY_WARN_EXIT_RADIUS_MULTIPLIER } from '@/components/world/wildlife/domains/definingWildlifeTerritoryConstants';

function resolvingDistanceGrid(
  a: DefiningWorldPlazaWorldPoint,
  b: DefiningWorldPlazaWorldPoint
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Returns the species territory config when the animal defends a home patch. */
export function resolvingWildlifeSpeciesTerritoryConfig(
  species: DefiningWildlifeSpeciesDefinition
): DefiningWildlifeSpeciesTerritoryConfig | null {
  return species.territory ?? null;
}

/** True when the player is inside the spawn-anchor territory bubble. */
export function checkingWildlifePlayerIsInsideTerritoryAnchor(
  playerPosition: DefiningWorldPlazaWorldPoint,
  spawnAnchor: DefiningWorldPlazaWorldPoint,
  territory: DefiningWildlifeSpeciesTerritoryConfig
): boolean {
  return checkingWildlifePointIsInsideTerritoryAnchor(
    playerPosition,
    spawnAnchor,
    territory
  );
}

/** Threat per second while the player lingers in the warn band. */
export function resolvingWildlifeTerritoryLingerThreatPerSecond(
  territory: DefiningWildlifeSpeciesTerritoryConfig
): number {
  return DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD / territory.lingerSeconds;
}

/** Whether this animal should stop, face the player, and warn them off. */
export function checkingWildlifeShouldTerritoryWarn(
  blackboard: DefiningWildlifeBehaviorBlackboard
): boolean {
  const territory = resolvingWildlifeSpeciesTerritoryConfig(blackboard.species);

  if (!territory) {
    return false;
  }

  if (blackboard.instance.aggressionLevel === 'tame') {
    return false;
  }

  if (blackboard.instance.aggroState.activeTargetId !== null) {
    return false;
  }

  if (!blackboard.playerPosition || !blackboard.playerUserId) {
    return false;
  }

  const distanceToPlayer = resolvingDistanceGrid(
    blackboard.instance.position,
    blackboard.playerPosition
  );

  if (blackboard.instance.aiState.intent.mode === 'territoryWarn') {
    return (
      distanceToPlayer <=
      territory.warnRadiusGrid *
        DEFINING_WILDLIFE_TERRITORY_WARN_EXIT_RADIUS_MULTIPLIER
    );
  }

  if (
    !checkingWildlifePlayerIsInsideTerritoryAnchor(
      blackboard.playerPosition,
      blackboard.instance.spawnAnchor,
      territory
    )
  ) {
    return false;
  }

  return distanceToPlayer <= territory.warnRadiusGrid;
}
