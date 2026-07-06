/**
 * Territory warning and escalation tuning for territorial wildlife.
 *
 * @module components/world/wildlife/domains/definingWildlifeTerritoryConstants
 */

import type { DefiningWildlifeSpeciesTerritoryConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** Warn band hysteresis: player must back out this far before the warning ends. */
export const DEFINING_WILDLIFE_TERRITORY_WARN_EXIT_RADIUS_MULTIPLIER = 1.12;

/** Threat per second while the player is inside the immediate escalation radius. */
export const DEFINING_WILDLIFE_TERRITORY_ESCALATE_THREAT_PER_SECOND = 4;

/** Default territory profile for boar-sized retaliators. */
export const DEFINING_WILDLIFE_BOAR_TERRITORY_CONFIG: DefiningWildlifeSpeciesTerritoryConfig =
  {
    anchorRadiusGrid: 9,
    warnRadiusGrid: 5,
    escalateRadiusGrid: 2.8,
    lingerSeconds: 2.5,
  };

/** Larger territory profile for brown bears. */
export const DEFINING_WILDLIFE_BROWN_BEAR_TERRITORY_CONFIG: DefiningWildlifeSpeciesTerritoryConfig =
  {
    anchorRadiusGrid: 12,
    warnRadiusGrid: 7,
    escalateRadiusGrid: 3.5,
    lingerSeconds: 3,
  };

/** Pride territory profile for lions and lionesses. */
export const DEFINING_WILDLIFE_LION_TERRITORY_CONFIG: DefiningWildlifeSpeciesTerritoryConfig =
  {
    anchorRadiusGrid: 11,
    warnRadiusGrid: 8,
    escalateRadiusGrid: 3.2,
    lingerSeconds: 2.5,
  };
