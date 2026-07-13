/**
 * Resolves the actual disease contraction chance for a wildlife instance
 * based on its species transmission profile, the transmission kind (bite or
 * contact), and the animal's current disposition.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDiseaseTransmissionChance
 */

import {
  DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES,
  type DefiningWildlifeDiseaseTransmissionChanceConfig,
  type DefiningWildlifeDiseaseTransmissionKind,
  resolvingWildlifeDiseaseTransmissionProfile,
} from '@/components/world/wildlife/domains/definingWildlifeDiseaseTransmissionRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpeciesId,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeDiseaseDisposition =
  | 'friendly'
  | 'normal'
  | 'aggressive';

const DEFINING_WILDLIFE_AGGRESSIVE_TEMPERAMENT_IDS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['predator', 'ambusher', 'pack_hunter', 'stalker']);

const DEFINING_WILDLIFE_FRIENDLY_TEMPERAMENT_IDS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['docile']);

/**
 * Maps a temperament and spawn aggression level to a disease disposition.
 *
 * - Tame animals and docile species are friendly (0% chance).
 * - Aggressive-spawn animals or naturally aggressive temperaments are
 *   aggressive (5-15% chance).
 * - Everything else is normal (1-3% chance).
 */
export function resolvingWildlifeDiseaseDisposition(
  temperamentId: DefiningWildlifeTemperamentId,
  aggressionLevel: DefiningWildlifeAggressionLevel
): ResolvingWildlifeDiseaseDisposition {
  if (aggressionLevel === 'tame' || DEFINING_WILDLIFE_FRIENDLY_TEMPERAMENT_IDS.has(temperamentId)) {
    return 'friendly';
  }

  if (
    aggressionLevel === 'aggressive' ||
    DEFINING_WILDLIFE_AGGRESSIVE_TEMPERAMENT_IDS.has(temperamentId)
  ) {
    return 'aggressive';
  }

  return 'normal';
}

function resolvingChanceFromConfig(
  config: DefiningWildlifeDiseaseTransmissionChanceConfig,
  disposition: ResolvingWildlifeDiseaseDisposition
): number {
  if (disposition === 'friendly') {
    return config.friendlyChance;
  }

  if (disposition === 'aggressive') {
    return config.aggressiveChance;
  }

  return config.normalChance;
}

export type ResolvingWildlifeDiseaseTransmissionChanceParams = {
  speciesId: DefiningWildlifeSpeciesId;
  temperamentId: DefiningWildlifeTemperamentId;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  kind: DefiningWildlifeDiseaseTransmissionKind;
};

/**
 * Returns the 0..1 disease contraction chance for one transmission event.
 *
 * Foodborne transmission is not resolved here; the meat catalog already
 * applies raw/cooked disease chances when meat is eaten.
 */
export function resolvingWildlifeDiseaseTransmissionChance(
  params: ResolvingWildlifeDiseaseTransmissionChanceParams
): number {
  const { speciesId, temperamentId, aggressionLevel, kind } = params;

  if (kind === 'foodborne') {
    return 0;
  }

  const profile = resolvingWildlifeDiseaseTransmissionProfile(speciesId);

  if (!profile) {
    return 0;
  }

  const config = profile[kind];

  if (!config) {
    return 0;
  }

  const disposition = resolvingWildlifeDiseaseDisposition(
    temperamentId,
    aggressionLevel
  );

  return resolvingChanceFromConfig(
    config,
    disposition
  );
}

/**
 * Convenience helper that returns the default bite/contact chance config.
 * Useful when building per-species overrides.
 */
export function resolvingWildlifeDiseaseTransmissionDefaultChances(): DefiningWildlifeDiseaseTransmissionChanceConfig {
  return { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES };
}
