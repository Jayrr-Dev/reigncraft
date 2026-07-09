/**
 * Spawn-time wildlife health state (size-frame + species passives).
 *
 * @module components/world/wildlife/domains/creatingWildlifeSpawnHealthState
 */

import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityDamageToHealConstants';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { creatingWildlifeLargeSizeFrameHealthState } from '@/components/world/wildlife/domains/creatingWildlifeLargeSizeFrameHealthState';
import { checkingWildlifeOmegaWolfSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import type { DefiningWildlifeLargeSizeFrame } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

function mappingWildlifeSpeciesPassiveDamageRollModifiers(
  species: DefiningWildlifeSpeciesDefinition
): readonly DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const passives = species.passiveDamageRollModifiers;

  if (!passives || passives.length === 0) {
    return [];
  }

  return passives.map((passive) => ({
    id: passive.id,
    kind: passive.kind,
    value: passive.value,
    expiresAtMs: null,
  }));
}

/**
 * Builds initial health for a wildlife spawn: obese frame skews plus any
 * permanent species passives (e.g. turtle shell block bias, omega lifesteal).
 */
export function creatingWildlifeSpawnHealthState(
  baseMaxHealth: number,
  largeSizeFrame: DefiningWildlifeLargeSizeFrame | null,
  species: DefiningWildlifeSpeciesDefinition
): DefiningWorldPlazaEntityHealthState {
  const frameHealthState = creatingWildlifeLargeSizeFrameHealthState(
    baseMaxHealth,
    largeSizeFrame
  );
  const speciesModifiers =
    mappingWildlifeSpeciesPassiveDamageRollModifiers(species);
  const isOmegaWolf = checkingWildlifeOmegaWolfSpecies(species.speciesId);
  const lifestealModifiers = isOmegaWolf
    ? [
        {
          id: 'wildlife-omega-wolf-siphoning',
          ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
          expiresAtMs: null as number | null,
        },
      ]
    : [];

  const hasMods = speciesModifiers.length > 0 || lifestealModifiers.length > 0;

  if (!hasMods) {
    return frameHealthState;
  }

  return {
    ...frameHealthState,
    damageRollModifiers: [
      ...frameHealthState.damageRollModifiers,
      ...speciesModifiers,
    ],
    physicalDamageLifestealModifiers: [
      ...frameHealthState.physicalDamageLifestealModifiers,
      ...lifestealModifiers,
    ],
  };
}
