/**
 * Per-species raw-meat disease intensity tuning (symptom strength and duration).
 *
 * @module components/world/wildlife/domains/definingWildlifeMeatDiseaseIntensityRegistry
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeMeatDiseaseIntensityEntry = {
  /** Multiplies symptomStrengthMultiplier at contract (1 = baseline). */
  readonly symptomIntensity: number;
  /** Multiplies durationMultiplier at contract (1 = baseline). */
  readonly durationIntensity: number;
};

/** Default intensity when a species has no explicit row. */
export const DEFINING_WILDLIFE_MEAT_DISEASE_INTENSITY_DEFAULT: DefiningWildlifeMeatDiseaseIntensityEntry =
  {
    symptomIntensity: 1,
    durationIntensity: 1,
  };

/** Per-species intensity; smaller prey milder, apex predators harsher. */
export const DEFINING_WILDLIFE_MEAT_DISEASE_INTENSITY_BY_SPECIES: Partial<
  Record<DefiningWildlifeSpeciesId, DefiningWildlifeMeatDiseaseIntensityEntry>
> = {
  chicken: { symptomIntensity: 0.8, durationIntensity: 0.9 },
  'shepherd-dog': { symptomIntensity: 0.85, durationIntensity: 0.95 },
  husky: { symptomIntensity: 0.85, durationIntensity: 0.95 },
  'golden-retriever': { symptomIntensity: 0.85, durationIntensity: 0.95 },
  'cat-black': { symptomIntensity: 0.85, durationIntensity: 0.95 },
  'cat-white': { symptomIntensity: 0.85, durationIntensity: 0.95 },
  'cat-large': { symptomIntensity: 0.88, durationIntensity: 0.95 },
  'cat-orange': { symptomIntensity: 0.85, durationIntensity: 0.95 },
  deer: { symptomIntensity: 1, durationIntensity: 1 },
  stag: { symptomIntensity: 1.05, durationIntensity: 1.05 },
  boar: { symptomIntensity: 1.1, durationIntensity: 1.05 },
  cow: { symptomIntensity: 1, durationIntensity: 1.1 },
  'cow-brown': { symptomIntensity: 1, durationIntensity: 1.1 },
  sheep: { symptomIntensity: 0.95, durationIntensity: 1 },
  zebra: { symptomIntensity: 1.1, durationIntensity: 1.15 },
  'grey-wolf': { symptomIntensity: 1.2, durationIntensity: 1.1 },
  'omega-wolf': { symptomIntensity: 1.35, durationIntensity: 1.2 },
  'brown-bear': { symptomIntensity: 1.25, durationIntensity: 1.15 },
  grizzly: { symptomIntensity: 1.3, durationIntensity: 1.18 },
  'polar-bear': { symptomIntensity: 1.3, durationIntensity: 1.2 },
  lion: { symptomIntensity: 1.15, durationIntensity: 1.1 },
  lioness: { symptomIntensity: 1.1, durationIntensity: 1.05 },
  crocodile: { symptomIntensity: 1.2, durationIntensity: 1 },
  hippo: { symptomIntensity: 1.3, durationIntensity: 1.15 },
  antilope: { symptomIntensity: 1, durationIntensity: 1.05 },
  oryx: { symptomIntensity: 0.95, durationIntensity: 1 },
  giraffe: { symptomIntensity: 1.05, durationIntensity: 1.1 },
  ostrich: { symptomIntensity: 0.85, durationIntensity: 0.9 },
  elephant: { symptomIntensity: 1.2, durationIntensity: 1.15 },
  'elephant-female': { symptomIntensity: 1.2, durationIntensity: 1.15 },
  rhino: { symptomIntensity: 1.25, durationIntensity: 1.2 },
  'rhino-female': { symptomIntensity: 1.25, durationIntensity: 1.2 },
  mammoth: { symptomIntensity: 1.3, durationIntensity: 1.25 },
  hyena: { symptomIntensity: 1.3, durationIntensity: 1.15 },
  bison: { symptomIntensity: 1.1, durationIntensity: 1.1 },
  pig: { symptomIntensity: 1.05, durationIntensity: 1 },
  bull: { symptomIntensity: 1.1, durationIntensity: 1.1 },
  'brown-horse': { symptomIntensity: 1.1, durationIntensity: 1.15 },
  'work-horse': { symptomIntensity: 1.15, durationIntensity: 1.2 },
  'arabian-horse': { symptomIntensity: 1.1, durationIntensity: 1.15 },
  donkey: { symptomIntensity: 1.05, durationIntensity: 1.1 },
  'water-buffalo': { symptomIntensity: 1.1, durationIntensity: 1.1 },
  turtle: { symptomIntensity: 0.75, durationIntensity: 0.85 },
  tortoise: { symptomIntensity: 0.75, durationIntensity: 0.85 },
  camel: { symptomIntensity: 0.95, durationIntensity: 1 },
  ram: { symptomIntensity: 0.95, durationIntensity: 1 },
  llama: { symptomIntensity: 0.9, durationIntensity: 0.95 },
  alpaca: { symptomIntensity: 0.88, durationIntensity: 0.95 },
  yak: { symptomIntensity: 1.1, durationIntensity: 1.1 },
  tiger: { symptomIntensity: 1.2, durationIntensity: 1.1 },
  jaguar: { symptomIntensity: 1.18, durationIntensity: 1.1 },
  monkey: { symptomIntensity: 1.15, durationIntensity: 1.1 },
  chimp: { symptomIntensity: 1.25, durationIntensity: 1.15 },
};

/** Cucco variant intensity (aggressive chicken). */
export const DEFINING_WILDLIFE_CUCCO_MEAT_DISEASE_INTENSITY: DefiningWildlifeMeatDiseaseIntensityEntry =
  {
    symptomIntensity: 1.5,
    durationIntensity: 1.25,
  };
