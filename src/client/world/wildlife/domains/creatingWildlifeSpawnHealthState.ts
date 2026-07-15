/**
 * Spawn-time wildlife health state (size-frame + species passives).
 *
 * @module components/world/wildlife/domains/creatingWildlifeSpawnHealthState
 */

import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityDamageToHealConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_BLEED_IMMUNITY_DAMAGE_KINDS } from '@/components/world/health/domains/definingWorldPlazaEntityBuffImmunityDamageKinds';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { settingWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeLargeSizeFrameHealthState } from '@/components/world/wildlife/domains/creatingWildlifeLargeSizeFrameHealthState';
import type { DefiningWildlifeLargeSizeFrame } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
import { checkingWildlifeOmegaWolfSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpeciesTemperatureComfortBand } from '@/components/world/wildlife/domains/definingWildlifeSpeciesTemperatureComfortRegistry';

function resolvingWildlifeSpawnDamageKindImmunities(
  species: DefiningWildlifeSpeciesDefinition
): readonly DefiningWorldPlazaEntityDamageKind[] {
  if (species.speciesId === DEFINING_WILDLIFE_CYROBORN_SPECIES_ID) {
    return DEFINING_WORLD_PLAZA_ENTITY_BLEED_IMMUNITY_DAMAGE_KINDS;
  }

  return [];
}

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
 * Also seeds per-species temperature comfort and hazard immunities.
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
  const comfortBand = resolvingWildlifeSpeciesTemperatureComfortBand(
    species.speciesId
  );
  const temperatureSeededState = settingWorldPlazaEntityTemperatureResistance(
    frameHealthState,
    {
      baseComfortLowCelsius: comfortBand.comfortLowCelsius,
      baseComfortHighCelsius: comfortBand.comfortHighCelsius,
      coldWeakness: comfortBand.coldWeakness ?? 0,
      heatWeakness: comfortBand.heatWeakness ?? 0,
      isHeatImmune: species.hazards.isHeatImmune,
      isColdImmune: species.hazards.isColdImmune,
    }
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

  const damageKindImmunities =
    resolvingWildlifeSpawnDamageKindImmunities(species);
  const hasMods = speciesModifiers.length > 0 || lifestealModifiers.length > 0;

  if (!hasMods && damageKindImmunities.length === 0) {
    return temperatureSeededState;
  }

  return {
    ...temperatureSeededState,
    ...(damageKindImmunities.length > 0 ? { damageKindImmunities } : {}),
    damageRollModifiers: [
      ...temperatureSeededState.damageRollModifiers,
      ...speciesModifiers,
    ],
    physicalDamageLifestealModifiers: [
      ...temperatureSeededState.physicalDamageLifestealModifiers,
      ...lifestealModifiers,
    ],
  };
}
