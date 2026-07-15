/**
 * Per-species ambient comfort bands (°C) for wildlife temperature damage.
 *
 * Soft blue→peach orb colors and heat/cold DoT use these edges. Tolerance
 * buffs still widen the band at runtime.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesTemperatureComfortRegistry
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Declarative comfort low/high for one species, plus optional innate weakness. */
export type DefiningWildlifeSpeciesTemperatureComfortBand =
  DefiningWorldPlazaEntityTemperatureComfortBand & {
    /** Extra cold damage taken (0 = none, 1 = +100%). Seeded at wildlife spawn. */
    readonly coldWeakness?: number;
    /** Extra heat damage taken (0 = none, 1 = +100%). Seeded at wildlife spawn. */
    readonly heatWeakness?: number;
  };

const TEMPERATE: DefiningWildlifeSpeciesTemperatureComfortBand = {
  comfortLowCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
  comfortHighCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
};

const COLD_ADAPTED: DefiningWildlifeSpeciesTemperatureComfortBand = {
  comfortLowCelsius: -20,
  comfortHighCelsius: 18,
};

const ARCTIC: DefiningWildlifeSpeciesTemperatureComfortBand = {
  comfortLowCelsius: -25,
  comfortHighCelsius: 12,
};

const HOT_ADAPTED: DefiningWildlifeSpeciesTemperatureComfortBand = {
  comfortLowCelsius: 8,
  comfortHighCelsius: 52,
};

const DESERT: DefiningWildlifeSpeciesTemperatureComfortBand = {
  comfortLowCelsius: 12,
  comfortHighCelsius: 55,
};

/** Firelands apex: thrives in extreme heat, starts freezing early, takes extra cold. */
const FIRELANDS_APEX: DefiningWildlifeSpeciesTemperatureComfortBand = {
  comfortLowCelsius: 22,
  comfortHighCelsius: 60,
  coldWeakness: 0.5,
};

const WIDE_RANGE: DefiningWildlifeSpeciesTemperatureComfortBand = {
  comfortLowCelsius: -22,
  comfortHighCelsius: 48,
};

/**
 * Comfort band for every registered wildlife species.
 * Missing ids fall back to the temperate human default via the resolver.
 */
export const DEFINING_WILDLIFE_SPECIES_TEMPERATURE_COMFORT_REGISTRY: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesTemperatureComfortBand
> = {
  // Temperate / farm
  cow: TEMPERATE,
  'cow-brown': TEMPERATE,
  sheep: { comfortLowCelsius: -5, comfortHighCelsius: 35 },
  chicken: { comfortLowCelsius: 5, comfortHighCelsius: 38 },
  pig: TEMPERATE,
  bull: TEMPERATE,
  'brown-horse': TEMPERATE,
  'work-horse': TEMPERATE,
  'arabian-horse': HOT_ADAPTED,
  donkey: { comfortLowCelsius: 2, comfortHighCelsius: 42 },
  turtle: { comfortLowCelsius: 10, comfortHighCelsius: 38 },
  tortoise: DESERT,
  'shepherd-dog': TEMPERATE,
  'golden-retriever': TEMPERATE,
  'cat-black': { comfortLowCelsius: 5, comfortHighCelsius: 42 },
  'cat-white': { comfortLowCelsius: 5, comfortHighCelsius: 42 },
  'cat-orange': { comfortLowCelsius: 5, comfortHighCelsius: 42 },
  'cat-large': { comfortLowCelsius: 5, comfortHighCelsius: 42 },

  // Cold / mountain / boreal
  // Slightly higher heat ceiling than shared COLD_ADAPTED (18) so mild warm
  // days do not cook deer; still cold-biased vs temperate (40).
  deer: { comfortLowCelsius: -20, comfortHighCelsius: 24 },
  boar: { comfortLowCelsius: -8, comfortHighCelsius: 32 },
  'brown-bear': COLD_ADAPTED,
  grizzly: COLD_ADAPTED,
  bison: COLD_ADAPTED,
  stag: COLD_ADAPTED,
  pinguin: ARCTIC,
  'polar-bear': ARCTIC,
  mammoth: ARCTIC,
  ram: COLD_ADAPTED,
  yak: COLD_ADAPTED,
  llama: { comfortLowCelsius: -10, comfortHighCelsius: 28 },
  alpaca: { comfortLowCelsius: -8, comfortHighCelsius: 30 },
  husky: COLD_ADAPTED,

  // Hot / savanna / jungle
  zebra: HOT_ADAPTED,
  lion: HOT_ADAPTED,
  lioness: HOT_ADAPTED,
  crocodile: { comfortLowCelsius: 15, comfortHighCelsius: 45 },
  antilope: HOT_ADAPTED,
  oryx: DESERT,
  giraffe: HOT_ADAPTED,
  ostrich: HOT_ADAPTED,
  elephant: HOT_ADAPTED,
  'elephant-female': HOT_ADAPTED,
  rhino: HOT_ADAPTED,
  'rhino-female': HOT_ADAPTED,
  hyena: HOT_ADAPTED,
  camel: DESERT,
  hippo: { comfortLowCelsius: 12, comfortHighCelsius: 42 },
  'water-buffalo': { comfortLowCelsius: 10, comfortHighCelsius: 40 },
  tiger: HOT_ADAPTED,
  jaguar: HOT_ADAPTED,
  sunhead: FIRELANDS_APEX,
  monkey: HOT_ADAPTED,
  chimp: HOT_ADAPTED,

  // Wide / special
  'grey-wolf': WIDE_RANGE,
  'omega-wolf': WIDE_RANGE,
  fairy: { comfortLowCelsius: -25, comfortHighCelsius: 55 },
};

/**
 * Resolves the innate comfort band for a wildlife species id.
 */
export function resolvingWildlifeSpeciesTemperatureComfortBand(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpeciesTemperatureComfortBand {
  return (
    DEFINING_WILDLIFE_SPECIES_TEMPERATURE_COMFORT_REGISTRY[speciesId] ??
    TEMPERATE
  );
}
