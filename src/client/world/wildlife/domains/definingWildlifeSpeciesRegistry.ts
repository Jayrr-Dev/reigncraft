/**
 * Declarative species catalog for the starter wildlife roster.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesRegistry
 */

import { resolvingWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import type {
  DefiningWildlifeDietKind,
  DefiningWildlifeSpeciesId,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Per-species aggro tuning. */
export type DefiningWildlifeSpeciesAggroConfig = {
  aggroRadiusGrid: number;
  threatPerDamage: number;
  threatDecayPerSecond: number;
  leashDistanceGrid: number;
  packShareRadiusGrid: number;
  targetSwitchMargin: number;
  proximityThreatAtStarving: number;
};

/** Per-species hunger tuning. */
export type DefiningWildlifeSpeciesHungerConfig = {
  drainPerSecond: number;
  grazeRefillPerSecond: number;
  killRefillRatio: number;
  peckishThreshold: number;
  hungryThreshold: number;
  starvingThreshold: number;
};

/** Per-species jump tuning. */
export type DefiningWildlifeSpeciesJumpConfig = {
  /** Whether the species can jump at all. */
  canJump: boolean;
  /** Whether predators may pounce at chase targets. */
  canPounce: boolean;
  /** Longest jump the species can clear (grid units). */
  maxJumpDistanceGrid: number;
  /** Horizontal travel speed while airborne (grid units per second). */
  jumpSpeedGridPerSecond: number;
  /** Peak vertical arc height at mid-jump (screen pixels). */
  jumpArcPeakPx: number;
  /** Minimum milliseconds between jumps. */
  jumpCooldownMs: number;
};

/** Per-species run stamina tuning (multipliers on global drain/regen rates). */
export type DefiningWildlifeSpeciesStaminaConfig = {
  /** Multiplier on drain while running; lower values mean longer chases. */
  drainMultiplier: number;
  /** Multiplier on regen while walking or idle; higher values mean faster recovery. */
  regenMultiplier: number;
};

/**
 * Species stamina keyed by biology: cursorial endurance, burst sprinters, and
 * heavy livestock each get distinct drain/regen multipliers.
 */
const DEFINING_WILDLIFE_SPECIES_STAMINA: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesStaminaConfig
> = {
  // Livestock — heavy or flock animals with short panic gallops only.
  cow: { drainMultiplier: 1.2, regenMultiplier: 0.88 },
  sheep: { drainMultiplier: 1.05, regenMultiplier: 0.95 },
  chicken: { drainMultiplier: 1.5, regenMultiplier: 1.4 },

  // Prey — deer burst hard; zebras hold speed on open ground.
  deer: { drainMultiplier: 0.72, regenMultiplier: 1.2 },
  zebra: { drainMultiplier: 0.48, regenMultiplier: 1.35 },

  // Omnivores — boars charge; bears sprint fast but overheat quickly.
  boar: { drainMultiplier: 1.25, regenMultiplier: 0.95 },
  'brown-bear': { drainMultiplier: 1.55, regenMultiplier: 0.88 },

  // Carnivores — wolves are endurance hunters; cats and crocs are ambush sprinters.
  'grey-wolf': { drainMultiplier: 0.38, regenMultiplier: 1.45 },
  lion: { drainMultiplier: 1.45, regenMultiplier: 0.85 },
  lioness: { drainMultiplier: 1.12, regenMultiplier: 0.98 },
  crocodile: { drainMultiplier: 1.75, regenMultiplier: 0.75 },
};

function resolvingWildlifeSpeciesStaminaConfig(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpeciesStaminaConfig {
  return (
    DEFINING_WILDLIFE_SPECIES_STAMINA[speciesId] ?? {
      drainMultiplier: 1,
      regenMultiplier: 1,
    }
  );
}

/** Per-species hazard movement overrides. */
export type DefiningWildlifeSpeciesHazardConfig = {
  treatsSwampWaterAsSafe: boolean;
  treatsLavaAsLethal: boolean;
  /** Ignores environmental heat tiles (desert, firelands, campfires, etc.). */
  isHeatImmune: boolean;
  /** Ignores environmental cold tiles (snowy plains, frozen water, etc.). */
  isColdImmune: boolean;
};

/** Loot dropped when the animal dies. */
export type DefiningWildlifeSpeciesLootConfig = {
  rawMeatItemTypeId: string;
  quantity: number;
};

/** Full declarative species definition. */
export type DefiningWildlifeSpeciesDefinition = {
  speciesId: DefiningWildlifeSpeciesId;
  displayName: string;
  spriteFolder: string;
  /** Render scale multiplier; sheets are already relatively sized per species. */
  sizeScale: number;
  collisionRadiusGrid: number;
  diet: DefiningWildlifeDietKind;
  trophicTier: 1 | 2 | 3;
  massKg: number;
  temperamentId: DefiningWildlifeTemperamentId;
  aggro: DefiningWildlifeSpeciesAggroConfig;
  hunger: DefiningWildlifeSpeciesHungerConfig;
  stamina: DefiningWildlifeSpeciesStaminaConfig;
  hazards: DefiningWildlifeSpeciesHazardConfig;
  jump: DefiningWildlifeSpeciesJumpConfig;
  vitals: {
    baseMaxHealth: number;
    attackPower: number;
    defense: number;
    walkSpeedGridPerSecond: number;
    runSpeedGridPerSecond: number;
    /** Minimum milliseconds between melee swings. */
    attackIntervalMs: number;
  };
  preyDenySpeciesIds?: readonly DefiningWildlifeSpeciesId[];
  preyAllowSpeciesIds?: readonly DefiningWildlifeSpeciesId[];
  loot: DefiningWildlifeSpeciesLootConfig;
};

const DEFINING_WILDLIFE_DEFAULT_AGGRO: DefiningWildlifeSpeciesAggroConfig = {
  aggroRadiusGrid: 4,
  threatPerDamage: 2.5,
  threatDecayPerSecond: 0.4,
  leashDistanceGrid: 18,
  packShareRadiusGrid: 8,
  targetSwitchMargin: 1.25,
  proximityThreatAtStarving: 0.5,
};

const DEFINING_WILDLIFE_NO_JUMP: DefiningWildlifeSpeciesJumpConfig = {
  canJump: false,
  canPounce: false,
  maxJumpDistanceGrid: 0,
  jumpSpeedGridPerSecond: 0,
  jumpArcPeakPx: 0,
  jumpCooldownMs: 0,
};

const DEFINING_WILDLIFE_SMALL_HOP_JUMP: DefiningWildlifeSpeciesJumpConfig = {
  canJump: true,
  canPounce: false,
  maxJumpDistanceGrid: 2,
  jumpSpeedGridPerSecond: 4,
  jumpArcPeakPx: 14,
  jumpCooldownMs: 4000,
};

const DEFINING_WILDLIFE_DEFAULT_HUNGER: DefiningWildlifeSpeciesHungerConfig = {
  drainPerSecond: 0.002,
  grazeRefillPerSecond: 0.08,
  killRefillRatio: 0.65,
  peckishThreshold: 0.7,
  hungryThreshold: 0.4,
  starvingThreshold: 0.15,
};

const DEFINING_WILDLIFE_DEFAULT_STAMINA: DefiningWildlifeSpeciesStaminaConfig =
  {
    drainMultiplier: 1,
    regenMultiplier: 1,
  };

/** Predators and ambushers get more chase endurance than prey or livestock. */
const DEFINING_WILDLIFE_HUNTER_STAMINA: DefiningWildlifeSpeciesStaminaConfig = {
  drainMultiplier: 0.58,
  regenMultiplier: 1.4,
};

/** Global combat tuning applied to every species at registry build time. */
export const DEFINING_WILDLIFE_HEALTH_AND_ATTACK_POWER_SCALE = 10;

function scalingWildlifeSpeciesCombatVitals(
  species: Omit<DefiningWildlifeSpeciesDefinition, 'loot'>
): Omit<DefiningWildlifeSpeciesDefinition, 'loot'> {
  return {
    ...species,
    vitals: {
      ...species.vitals,
      baseMaxHealth:
        species.vitals.baseMaxHealth *
        DEFINING_WILDLIFE_HEALTH_AND_ATTACK_POWER_SCALE,
      attackPower:
        species.vitals.attackPower *
        DEFINING_WILDLIFE_HEALTH_AND_ATTACK_POWER_SCALE,
    },
  };
}

function definingWildlifePassiveFarmSpecies(
  speciesId: DefiningWildlifeSpeciesId,
  displayName: string,
  spriteFolder: string,
  massKg: number
): Omit<DefiningWildlifeSpeciesDefinition, 'loot'> {
  return {
    speciesId,
    displayName,
    spriteFolder,
    sizeScale: 1,
    collisionRadiusGrid: 0.35,
    diet: 'herbivore',
    trophicTier: 1,
    massKg,
    temperamentId: 'passive',
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 2 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: DEFINING_WILDLIFE_DEFAULT_STAMINA,
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: false,
    },
    jump: DEFINING_WILDLIFE_SMALL_HOP_JUMP,
    vitals: {
      baseMaxHealth: 40,
      attackPower: 2,
      defense: 1,
      walkSpeedGridPerSecond: 1,
      runSpeedGridPerSecond: 2.6,
      attackIntervalMs: 1200,
    },
  };
}

function attachingWildlifeSpeciesLoot(
  species: Omit<DefiningWildlifeSpeciesDefinition, 'loot'>
): DefiningWildlifeSpeciesDefinition {
  const meatEntry = resolvingWildlifeMeatCatalogEntry(species.speciesId);

  if (!meatEntry) {
    throw new Error(
      `Missing wildlife meat catalog entry for species ${species.speciesId}.`
    );
  }

  return {
    ...species,
    loot: {
      rawMeatItemTypeId: meatEntry.rawItemTypeId,
      quantity: meatEntry.lootQuantity,
    },
  };
}

const DEFINING_WILDLIFE_SPECIES_REGISTRY_BASE: Record<
  DefiningWildlifeSpeciesId,
  Omit<DefiningWildlifeSpeciesDefinition, 'loot'>
> = {
  cow: {
    ...definingWildlifePassiveFarmSpecies('cow', 'Cow', 'Cow', 450),
    jump: DEFINING_WILDLIFE_NO_JUMP,
  },
  sheep: definingWildlifePassiveFarmSpecies('sheep', 'Sheep', 'Sheep', 60),
  chicken: {
    ...definingWildlifePassiveFarmSpecies('chicken', 'Chicken', 'Chicken', 3),
    sizeScale: 0.9,
    collisionRadiusGrid: 0.25,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 2,
      jumpSpeedGridPerSecond: 3.5,
      jumpArcPeakPx: 26,
      jumpCooldownMs: 3000,
    },
    vitals: {
      baseMaxHealth: 15,
      attackPower: 1,
      defense: 0,
      walkSpeedGridPerSecond: 1.2,
      runSpeedGridPerSecond: 2.8,
      attackIntervalMs: 1000,
    },
  },
  deer: {
    speciesId: 'deer',
    displayName: 'Deer',
    spriteFolder: 'Deer',
    sizeScale: 0.95,
    collisionRadiusGrid: 0.35,
    diet: 'herbivore',
    trophicTier: 1,
    massKg: 90,
    temperamentId: 'skittish',
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 6 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('deer'),
    hazards: {
      jumpSpeedGridPerSecond: 6,
      jumpArcPeakPx: 22,
      jumpCooldownMs: 2500,
    },
    vitals: {
      baseMaxHealth: 35,
      attackPower: 3,
      defense: 1,
      walkSpeedGridPerSecond: 1.3,
      runSpeedGridPerSecond: 3.4,
      attackIntervalMs: 1100,
    },
  },
  zebra: {
    speciesId: 'zebra',
    displayName: 'Zebra',
    spriteFolder: 'Zebra',
    sizeScale: 1,
    collisionRadiusGrid: 0.38,
    diet: 'herbivore',
    trophicTier: 1,
    massKg: 350,
    temperamentId: 'skittish',
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 7 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('zebra'),
    hazards: {
      jumpSpeedGridPerSecond: 5.5,
      jumpArcPeakPx: 18,
      jumpCooldownMs: 3000,
    },
    vitals: {
      baseMaxHealth: 50,
      attackPower: 5,
      defense: 2,
      walkSpeedGridPerSecond: 1.4,
      runSpeedGridPerSecond: 3.5,
      attackIntervalMs: 1100,
    },
  },
  boar: {
    speciesId: 'boar',
    displayName: 'Boar',
    spriteFolder: 'Boar',
    sizeScale: 0.9,
    collisionRadiusGrid: 0.36,
    diet: 'omnivore',
    trophicTier: 2,
    massKg: 80,
    temperamentId: 'retaliator',
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 5 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('boar'),
    hazards: {
      jumpArcPeakPx: 12,
      jumpCooldownMs: 3500,
    },
    vitals: {
      baseMaxHealth: 55,
      attackPower: 12,
      defense: 4,
      walkSpeedGridPerSecond: 1.2,
      runSpeedGridPerSecond: 3.1,
      attackIntervalMs: 1300,
    },
  },
  'grey-wolf': {
    speciesId: 'grey-wolf',
    displayName: 'Grey Wolf',
    spriteFolder: 'Grey Wolf',
    sizeScale: 0.95,
    collisionRadiusGrid: 0.34,
    diet: 'carnivore',
    trophicTier: 2,
    massKg: 45,
    temperamentId: 'predator',
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 8,
      packShareRadiusGrid: 10,
    },
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.003 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('grey-wolf'),
    hazards: {
      jumpSpeedGridPerSecond: 6.5,
      jumpArcPeakPx: 16,
      jumpCooldownMs: 2000,
    },
    vitals: {
      baseMaxHealth: 45,
      attackPower: 14,
      defense: 3,
      walkSpeedGridPerSecond: 1.5,
      runSpeedGridPerSecond: 3.6,
      attackIntervalMs: 900,
    },
  },
  'brown-bear': {
    speciesId: 'brown-bear',
    displayName: 'Brown Bear',
    spriteFolder: 'Brown Bear',
    sizeScale: 1.35,
    collisionRadiusGrid: 0.5,
    diet: 'omnivore',
    trophicTier: 3,
    massKg: 300,
    temperamentId: 'retaliator',
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 6 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: DEFINING_WILDLIFE_DEFAULT_STAMINA,
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: true,
    },
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 2.5,
      jumpSpeedGridPerSecond: 4,
      jumpArcPeakPx: 12,
      jumpCooldownMs: 4000,
    },
    vitals: {
      baseMaxHealth: 120,
      attackPower: 22,
      defense: 8,
      walkSpeedGridPerSecond: 1.1,
      runSpeedGridPerSecond: 3.2,
      attackIntervalMs: 1600,
    },
  },
  lion: {
    speciesId: 'lion',
    displayName: 'Lion',
    spriteFolder: 'Lion',
    sizeScale: 1.05,
    collisionRadiusGrid: 0.45,
    diet: 'carnivore',
    trophicTier: 3,
    massKg: 190,
    temperamentId: 'predator',
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 9,
      packShareRadiusGrid: 12,
    },
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.0035 },
    stamina: DEFINING_WILDLIFE_HUNTER_STAMINA,
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 4.5,
      jumpSpeedGridPerSecond: 7,
      jumpArcPeakPx: 20,
      jumpCooldownMs: 2200,
    },
    vitals: {
      baseMaxHealth: 100,
      attackPower: 26,
      defense: 6,
      walkSpeedGridPerSecond: 1.4,
      runSpeedGridPerSecond: 3.7,
      attackIntervalMs: 1200,
    },
  },
  lioness: {
    speciesId: 'lioness',
    displayName: 'Lioness',
    spriteFolder: 'Lioness',
    sizeScale: 1,
    collisionRadiusGrid: 0.42,
    diet: 'carnivore',
    trophicTier: 3,
    massKg: 130,
    temperamentId: 'predator',
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 9,
      packShareRadiusGrid: 12,
    },
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.0035 },
    stamina: DEFINING_WILDLIFE_HUNTER_STAMINA,
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 4.5,
      jumpSpeedGridPerSecond: 7.5,
      jumpArcPeakPx: 20,
      jumpCooldownMs: 2000,
    },
    vitals: {
      baseMaxHealth: 85,
      attackPower: 24,
      defense: 5,
      walkSpeedGridPerSecond: 1.5,
      runSpeedGridPerSecond: 3.8,
      attackIntervalMs: 1000,
    },
  },
  crocodile: {
    speciesId: 'crocodile',
    displayName: 'Crocodile',
    spriteFolder: 'Crocodile',
    sizeScale: 1.2,
    collisionRadiusGrid: 0.48,
    diet: 'carnivore',
    trophicTier: 3,
    massKg: 400,
    temperamentId: 'ambusher',
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 3.5,
      leashDistanceGrid: 10,
    },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: DEFINING_WILDLIFE_HUNTER_STAMINA,
    hazards: {
      treatsSwampWaterAsSafe: true,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 2.2,
      jumpSpeedGridPerSecond: 6,
      jumpArcPeakPx: 8,
      jumpCooldownMs: 4500,
    },
    vitals: {
      baseMaxHealth: 90,
      attackPower: 28,
      defense: 10,
      walkSpeedGridPerSecond: 0.8,
      runSpeedGridPerSecond: 2.9,
      attackIntervalMs: 1800,
    },
    preyAllowSpeciesIds: ['deer', 'zebra', 'cow', 'sheep', 'chicken', 'boar'],
  },
};

/** Starter roster covering every AI archetype. */
export const DEFINING_WILDLIFE_SPECIES_REGISTRY: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesDefinition
> = Object.fromEntries(
  Object.entries(DEFINING_WILDLIFE_SPECIES_REGISTRY_BASE).map(
    ([speciesId, species]) => [
      speciesId,
      attachingWildlifeSpeciesLoot(scalingWildlifeSpeciesCombatVitals(species)),
    ]
  )
) as Record<DefiningWildlifeSpeciesId, DefiningWildlifeSpeciesDefinition>;

/** Lists every registered species id. */
export function listingWildlifeSpeciesIds(): readonly DefiningWildlifeSpeciesId[] {
  return Object.keys(DEFINING_WILDLIFE_SPECIES_REGISTRY);
}

/** Resolves one species definition or null when unknown. */
export function resolvingWildlifeSpeciesDefinition(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpeciesDefinition | null {
  return DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;
}
