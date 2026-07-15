/**
 * Declarative disease transmission profiles for wildlife.
 *
 * Each profile maps a species to the disease it can transmit and the odds of
 * contracting it through bite damage or direct body contact. Foodborne
 * transmission is handled by the meat catalog; this registry only flags that
 * it exists for the species so callers can present a complete transmission
 * picture.
 *
 * @module components/world/wildlife/domains/definingWildlifeDiseaseTransmissionRegistry
 */

import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeDiseaseTransmissionKind =
  | 'foodborne'
  | 'bite'
  | 'contact';

export type DefiningWildlifeDiseaseTransmissionChanceConfig = {
  /** 0..1 chance for tame / docile animals. */
  friendlyChance: number;
  /** 0..1 chance for normal, non-aggressive animals. */
  normalChance: number;
  /** 0..1 chance for aggressive predators or aggressive-spawn animals. */
  aggressiveChance: number;
};

export type DefiningWildlifeDiseaseTransmissionProfile = {
  diseaseId: DefiningWorldPlazaEntityDiseaseId;
  /** Foodborne transmission is already covered by the raw meat catalog. */
  foodborne: boolean;
  /** Bite transmission odds when the animal lands a melee hit on the player. */
  bite?: DefiningWildlifeDiseaseTransmissionChanceConfig;
  /** Contact transmission odds when the player collides with the animal. */
  contact?: DefiningWildlifeDiseaseTransmissionChanceConfig;
};

/** Default bite/contact chances used when a profile omits explicit odds. */
export const DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES: DefiningWildlifeDiseaseTransmissionChanceConfig =
  {
    friendlyChance: 0,
    normalChance: 0.02,
    aggressiveChance: 0.1,
  };

/**
 * Min real-ms between contact disease rolls for the same wildlife instance.
 * Prevents per-frame re-rolls while the player stays overlapping a carrier.
 */
export const DEFINING_WORLD_PLAZA_WILDLIFE_CONTACT_DISEASE_COOLDOWN_MS = 2500;

export const DEFINING_WILDLIFE_DISEASE_TRANSMISSION_REGISTRY: Partial<
  Record<DefiningWildlifeSpeciesId, DefiningWildlifeDiseaseTransmissionProfile>
> = {
  'shepherd-dog': {
    diseaseId: 'feline-gut',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  husky: {
    diseaseId: 'feline-gut',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'golden-retriever': {
    diseaseId: 'feline-gut',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'cat-black': {
    diseaseId: 'feline-gut',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'cat-white': {
    diseaseId: 'feline-gut',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'cat-large': {
    diseaseId: 'feline-gut',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'cat-orange': {
    diseaseId: 'feline-gut',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'grey-wolf': {
    diseaseId: 'wolf-fever',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'omega-wolf': {
    diseaseId: 'wolf-fever',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  monkey: {
    diseaseId: 'primate-fever',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  chimp: {
    diseaseId: 'primate-fever',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  pig: {
    diseaseId: 'trichinellosis',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  boar: {
    diseaseId: 'trichinellosis',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  cow: {
    diseaseId: 'mad-cow',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'cow-brown': {
    diseaseId: 'mad-cow',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  bull: {
    diseaseId: 'mad-cow',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  'water-buffalo': {
    diseaseId: 'mad-cow',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  sheep: {
    diseaseId: 'liver-fluke',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  chicken: {
    diseaseId: 'salmonellosis',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  pinguin: {
    diseaseId: 'salmonellosis',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  turtle: {
    diseaseId: 'salmonellosis',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  tortoise: {
    diseaseId: 'salmonellosis',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
  crocodile: {
    diseaseId: 'vibrio-infection',
    foodborne: true,
    bite: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
    contact: { ...DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES },
  },
};

/** Lists every species that has a disease transmission profile. */
export function listingWildlifeDiseaseTransmissionSpeciesIds(): readonly DefiningWildlifeSpeciesId[] {
  return Object.keys(
    DEFINING_WILDLIFE_DISEASE_TRANSMISSION_REGISTRY
  ) as DefiningWildlifeSpeciesId[];
}

/** Returns the transmission profile for one species, or undefined if none. */
export function resolvingWildlifeDiseaseTransmissionProfile(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeDiseaseTransmissionProfile | undefined {
  return DEFINING_WILDLIFE_DISEASE_TRANSMISSION_REGISTRY[speciesId];
}

/** Returns the chance config for one species and transmission kind, if any. */
export function resolvingWildlifeDiseaseTransmissionChanceConfig(
  speciesId: DefiningWildlifeSpeciesId,
  kind: DefiningWildlifeDiseaseTransmissionKind
): DefiningWildlifeDiseaseTransmissionChanceConfig | undefined {
  const profile = resolvingWildlifeDiseaseTransmissionProfile(speciesId);

  if (!profile) {
    return undefined;
  }

  if (kind === 'foodborne') {
    return undefined;
  }

  return profile[kind] ?? undefined;
}
