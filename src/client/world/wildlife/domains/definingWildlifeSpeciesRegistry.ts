/**
 * Declarative species catalog for the starter wildlife roster.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesRegistry
 */

import type { DefiningWorldPlazaEntityHealthDamageRollModifierKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WILDLIFE_DIFFICULTY_LEVERS } from '@/components/world/wildlife/domains/definingWildlifeDifficultyLevers';
import { resolvingWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import type { DefiningWildlifeSpeciesNameTagConfig } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import {
  DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID,
  DEFINING_WILDLIFE_TURTLE_SHELL_INCOMING_BLOCK_BIAS,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
import {
  DEFINING_WILDLIFE_BOAR_TERRITORY_CONFIG,
  DEFINING_WILDLIFE_BROWN_BEAR_TERRITORY_CONFIG,
  DEFINING_WILDLIFE_GREY_WOLF_TERRITORY_CONFIG,
  DEFINING_WILDLIFE_HEAVY_GRAZER_TERRITORY_CONFIG,
  DEFINING_WILDLIFE_LION_TERRITORY_CONFIG,
  DEFINING_WILDLIFE_MEGAFAUNA_TERRITORY_CONFIG,
} from '@/components/world/wildlife/domains/definingWildlifeTerritoryConstants';
import type {
  DefiningWildlifeActivityPattern,
  DefiningWildlifeDietKind,
  DefiningWildlifeSpeciesId,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Permanent defender damage-roll skew applied at wildlife spawn. */
export type DefiningWildlifeSpeciesPassiveDamageRollModifier = {
  id: string;
  kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  value: number;
};

/** Per-species bell-curve shift for spawn aggression rolls. */
export type DefiningWildlifeSpeciesAggressionSpawnConfig = {
  /**
   * Added to the standard-normal sample before tier mapping.
   * Negative skews tame, positive skews aggressive.
   */
  bellCurveMeanShift: number;
  /**
   * When rolled aggressive, passive/skittish herbivores may attack on sight.
   * Default false: they retaliate only after taking damage.
   */
  aggressiveAttacksOnSight?: boolean;
};

/** Per-species bell-curve shift for spawn sleep schedule rolls. */
export type DefiningWildlifeSpeciesSleepScheduleConfig = {
  /**
   * Added to the standard-normal sleep sample before window offsets.
   * Negative skews short sleepers, positive skews long sleepers.
   */
  bellCurveMeanShift: number;
};

/** Per-species bell-curve shift for spawn size rolls. */
export type DefiningWildlifeSpeciesSizeSpawnConfig = {
  /**
   * Added to the standard-normal size sample before multiplier mapping.
   * Negative skews smaller individuals, positive skews larger ones.
   */
  bellCurveMeanShift: number;
};

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

/** Optional home-territory warning before combat for retaliators. */
export type DefiningWildlifeSpeciesTerritoryConfig = {
  /** Radius around spawn anchor where intruders may be warned. */
  anchorRadiusGrid: number;
  /** Player within this distance of the animal triggers a stand-and-face warning. */
  warnRadiusGrid: number;
  /** Player within this distance escalates to combat quickly. */
  escalateRadiusGrid: number;
  /** Seconds the player may linger in the warn band before threat forces combat. */
  lingerSeconds: number;
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
  /**
   * Stamina ratio required to run again after exhaustion.
   * When omitted, the global default applies.
   */
  exhaustedRecoveryRatio?: number;
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

  // Prey — deer burst hard; zebras gallop long but recover slowly.
  deer: { drainMultiplier: 0.72, regenMultiplier: 1.2 },
  zebra: {
    drainMultiplier: 0.48,
    regenMultiplier: 0.55,
    exhaustedRecoveryRatio: 0.5,
  },

  // Omnivores — boars wind up then charge; bears sprint fast but overheat quickly.
  boar: { drainMultiplier: 1.25, regenMultiplier: 0.95 },
  'brown-bear': { drainMultiplier: 1.55, regenMultiplier: 0.88 },

  // Carnivores — wolves are pack endurance runners; cats and crocs are ambush sprinters.
  'grey-wolf': {
    drainMultiplier: 0.28,
    regenMultiplier: 2.4,
    exhaustedRecoveryRatio: 0.22,
  },
  lion: { drainMultiplier: 1.45, regenMultiplier: 0.85 },
  lioness: { drainMultiplier: 1.12, regenMultiplier: 0.98 },
  crocodile: { drainMultiplier: 1.75, regenMultiplier: 0.75 },

  // Savanna grazers — antelope burst like deer; heavy megafauna gas out fast.
  antilope: { drainMultiplier: 0.7, regenMultiplier: 1.2 },
  oryx: { drainMultiplier: 0.85, regenMultiplier: 1.05 },
  giraffe: { drainMultiplier: 1.3, regenMultiplier: 0.9 },
  ostrich: {
    drainMultiplier: 0.45,
    regenMultiplier: 0.9,
    exhaustedRecoveryRatio: 0.5,
  },
  elephant: { drainMultiplier: 1.5, regenMultiplier: 0.8 },
  'elephant-female': { drainMultiplier: 1.45, regenMultiplier: 0.85 },
  rhino: { drainMultiplier: 1.6, regenMultiplier: 0.8 },
  'rhino-female': { drainMultiplier: 1.55, regenMultiplier: 0.85 },
  hyena: {
    drainMultiplier: 0.75,
    regenMultiplier: 1.1,
    exhaustedRecoveryRatio: 0.45,
  },

  // Plains herds and feral horses — horses are the endurance champions.
  bison: { drainMultiplier: 1.35, regenMultiplier: 0.9 },
  pig: { drainMultiplier: 1.25, regenMultiplier: 0.95 },
  bull: { drainMultiplier: 1.3, regenMultiplier: 0.9 },
  stag: { drainMultiplier: 0.72, regenMultiplier: 1.2 },
  'brown-horse': {
    drainMultiplier: 0.5,
    regenMultiplier: 0.7,
    exhaustedRecoveryRatio: 0.5,
  },
  'work-horse': { drainMultiplier: 0.6, regenMultiplier: 0.75 },
  'arabian-horse': {
    drainMultiplier: 0.45,
    regenMultiplier: 0.7,
    exhaustedRecoveryRatio: 0.5,
  },
  donkey: { drainMultiplier: 0.75, regenMultiplier: 0.95 },

  // Wetland and shore heavyweights plus shelled slowpokes.
  hippo: { drainMultiplier: 1.7, regenMultiplier: 0.75 },
  'water-buffalo': { drainMultiplier: 1.35, regenMultiplier: 0.9 },
  turtle: { drainMultiplier: 1.1, regenMultiplier: 1.1 },
  tortoise: { drainMultiplier: 1.1, regenMultiplier: 1.1 },

  // Cold-country giants — polar bears sprint hard then overheat like browns.
  'polar-bear': { drainMultiplier: 1.5, regenMultiplier: 0.88 },
  mammoth: { drainMultiplier: 1.55, regenMultiplier: 0.8 },

  // Desert and highland stock.
  camel: { drainMultiplier: 0.8, regenMultiplier: 1 },
  ram: { drainMultiplier: 1, regenMultiplier: 1.05 },
  llama: { drainMultiplier: 1, regenMultiplier: 1 },
  alpaca: { drainMultiplier: 1.05, regenMultiplier: 1 },
  yak: { drainMultiplier: 1.35, regenMultiplier: 0.9 },

  // Jungle cats and primates — cats are ambush sprinters, primates recover fast.
  tiger: { drainMultiplier: 1.5, regenMultiplier: 0.85 },
  jaguar: { drainMultiplier: 1.6, regenMultiplier: 0.8 },
  monkey: { drainMultiplier: 0.9, regenMultiplier: 1.3 },
  chimp: { drainMultiplier: 1, regenMultiplier: 1.2 },
};

/**
 * Walk/run speeds and jump tuning from real locomotion profiles.
 * Grid speeds are scaled so lion sprint (~50 mph) tops the roster and
 * crocodile land movement stays at the bottom.
 */
const DEFINING_WILDLIFE_SPECIES_MOVEMENT: Record<
  DefiningWildlifeSpeciesId,
  {
    walkSpeedGridPerSecond: number;
    runSpeedGridPerSecond: number;
    jump: DefiningWildlifeSpeciesJumpConfig;
  }
> = {
  // Livestock — plodding grazers; chickens flutter in short hops.
  cow: {
    walkSpeedGridPerSecond: 1,
    runSpeedGridPerSecond: 2.4,
    jump: {
      canJump: false,
      canPounce: false,
      maxJumpDistanceGrid: 0,
      jumpSpeedGridPerSecond: 0,
      jumpArcPeakPx: 0,
      jumpCooldownMs: 0,
    },
  },
  sheep: {
    walkSpeedGridPerSecond: 1.5,
    runSpeedGridPerSecond: 2.9,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 2,
      jumpSpeedGridPerSecond: 3.5,
      jumpArcPeakPx: 14,
      jumpCooldownMs: 4000,
    },
  },
  chicken: {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 1.7,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 1.5,
      jumpSpeedGridPerSecond: 4.5,
      jumpArcPeakPx: 28,
      jumpCooldownMs: 2500,
    },
  },

  // Prey — deer are explosive fence-clearers; zebras trot slowly between gallops.
  deer: {
    walkSpeedGridPerSecond: 1.6,
    runSpeedGridPerSecond: 4,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 4,
      jumpSpeedGridPerSecond: 7,
      jumpArcPeakPx: 24,
      jumpCooldownMs: 2200,
    },
  },
  zebra: {
    walkSpeedGridPerSecond: 1.7,
    runSpeedGridPerSecond: 4.2,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 3.5,
      jumpSpeedGridPerSecond: 6,
      jumpArcPeakPx: 16,
      jumpCooldownMs: 2800,
    },
  },

  // Omnivores — boars wind up then charge; bears sprint hard but cannot keep it up.
  boar: {
    walkSpeedGridPerSecond: 1.6,
    runSpeedGridPerSecond: 3.2,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 1.8,
      jumpSpeedGridPerSecond: 4,
      jumpArcPeakPx: 10,
      jumpCooldownMs: 3500,
    },
  },
  'brown-bear': {
    walkSpeedGridPerSecond: 1.3,
    runSpeedGridPerSecond: 3.6,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 2,
      jumpSpeedGridPerSecond: 3.5,
      jumpArcPeakPx: 10,
      jumpCooldownMs: 4500,
    },
  },

  // Carnivores — wolves stalk at a steady trot then burst; cats pounce far; crocs lunge once on land.
  'grey-wolf': {
    walkSpeedGridPerSecond: 1.5,
    runSpeedGridPerSecond: 3.5,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 3.5,
      jumpSpeedGridPerSecond: 6.5,
      jumpArcPeakPx: 14,
      jumpCooldownMs: 2000,
    },
  },
  lion: {
    walkSpeedGridPerSecond: 1.4,
    runSpeedGridPerSecond: 4.5,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 5.5,
      jumpSpeedGridPerSecond: 8,
      jumpArcPeakPx: 22,
      jumpCooldownMs: 2000,
    },
  },
  lioness: {
    walkSpeedGridPerSecond: 1.7,
    runSpeedGridPerSecond: 4.4,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 5.5,
      jumpSpeedGridPerSecond: 8.5,
      jumpArcPeakPx: 22,
      jumpCooldownMs: 1800,
    },
  },
  crocodile: {
    walkSpeedGridPerSecond: 0.7,
    runSpeedGridPerSecond: 2.2,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 1.8,
      jumpSpeedGridPerSecond: 7,
      jumpArcPeakPx: 6,
      jumpCooldownMs: 5000,
    },
  },

  // Savanna — antelope and ostrich are the sprinters; megafauna do not jump.
  antilope: {
    walkSpeedGridPerSecond: 1.7,
    runSpeedGridPerSecond: 4.3,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 4.5,
      jumpSpeedGridPerSecond: 7.5,
      jumpArcPeakPx: 26,
      jumpCooldownMs: 2000,
    },
  },
  oryx: {
    walkSpeedGridPerSecond: 1.6,
    runSpeedGridPerSecond: 4,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 3,
      jumpSpeedGridPerSecond: 6,
      jumpArcPeakPx: 18,
      jumpCooldownMs: 2600,
    },
  },
  giraffe: {
    walkSpeedGridPerSecond: 1.5,
    runSpeedGridPerSecond: 3.8,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  ostrich: {
    walkSpeedGridPerSecond: 1.8,
    runSpeedGridPerSecond: 4.6,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  elephant: {
    walkSpeedGridPerSecond: 1.2,
    runSpeedGridPerSecond: 3.4,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  'elephant-female': {
    walkSpeedGridPerSecond: 1.2,
    runSpeedGridPerSecond: 3.4,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  rhino: {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 3.8,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  'rhino-female': {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 3.7,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  hyena: {
    walkSpeedGridPerSecond: 1.5,
    runSpeedGridPerSecond: 3.9,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 3,
      jumpSpeedGridPerSecond: 6,
      jumpArcPeakPx: 13,
      jumpCooldownMs: 2200,
    },
  },

  // Plains — heavy herds plod; stags clear fences; horses outrun everything.
  bison: {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 3.6,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  pig: {
    walkSpeedGridPerSecond: 1.2,
    runSpeedGridPerSecond: 2.6,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  bull: {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 3.5,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  stag: {
    walkSpeedGridPerSecond: 1.6,
    runSpeedGridPerSecond: 4.1,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 4,
      jumpSpeedGridPerSecond: 7,
      jumpArcPeakPx: 24,
      jumpCooldownMs: 2200,
    },
  },
  'brown-horse': {
    walkSpeedGridPerSecond: 1.8,
    runSpeedGridPerSecond: 4.5,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 3.5,
      jumpSpeedGridPerSecond: 6.5,
      jumpArcPeakPx: 18,
      jumpCooldownMs: 2400,
    },
  },
  'work-horse': {
    walkSpeedGridPerSecond: 1.7,
    runSpeedGridPerSecond: 4,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 3,
      jumpSpeedGridPerSecond: 6,
      jumpArcPeakPx: 16,
      jumpCooldownMs: 2800,
    },
  },
  'arabian-horse': {
    walkSpeedGridPerSecond: 1.9,
    runSpeedGridPerSecond: 4.8,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 3.8,
      jumpSpeedGridPerSecond: 7,
      jumpArcPeakPx: 18,
      jumpCooldownMs: 2200,
    },
  },
  donkey: {
    walkSpeedGridPerSecond: 1.4,
    runSpeedGridPerSecond: 3.4,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 2,
      jumpSpeedGridPerSecond: 4.5,
      jumpArcPeakPx: 12,
      jumpCooldownMs: 3200,
    },
  },

  // Wetland and shore — hippos surge on land; shelled species barely move.
  hippo: {
    walkSpeedGridPerSecond: 0.9,
    runSpeedGridPerSecond: 3.4,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  'water-buffalo': {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 3.4,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  turtle: {
    walkSpeedGridPerSecond: 0.4,
    runSpeedGridPerSecond: 0.9,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  tortoise: {
    walkSpeedGridPerSecond: 0.35,
    runSpeedGridPerSecond: 0.8,
    jump: definingWildlifeGroundedJumpConfig(),
  },

  // Cold country — polar bears pounce like browns; mammoths flatten instead.
  'polar-bear': {
    walkSpeedGridPerSecond: 1.3,
    runSpeedGridPerSecond: 3.7,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 2,
      jumpSpeedGridPerSecond: 3.5,
      jumpArcPeakPx: 10,
      jumpCooldownMs: 4500,
    },
  },
  mammoth: {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 3.2,
    jump: definingWildlifeGroundedJumpConfig(),
  },

  // Desert and highland stock — rams hop ledges; camels never hurry.
  camel: {
    walkSpeedGridPerSecond: 1.4,
    runSpeedGridPerSecond: 3.6,
    jump: definingWildlifeGroundedJumpConfig(),
  },
  ram: {
    walkSpeedGridPerSecond: 1.4,
    runSpeedGridPerSecond: 3.2,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 3.5,
      jumpSpeedGridPerSecond: 6,
      jumpArcPeakPx: 20,
      jumpCooldownMs: 2400,
    },
  },
  llama: {
    walkSpeedGridPerSecond: 1.3,
    runSpeedGridPerSecond: 3,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 2,
      jumpSpeedGridPerSecond: 4.5,
      jumpArcPeakPx: 14,
      jumpCooldownMs: 3200,
    },
  },
  alpaca: {
    walkSpeedGridPerSecond: 1.3,
    runSpeedGridPerSecond: 2.9,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 2,
      jumpSpeedGridPerSecond: 4.5,
      jumpArcPeakPx: 14,
      jumpCooldownMs: 3200,
    },
  },
  yak: {
    walkSpeedGridPerSecond: 1.1,
    runSpeedGridPerSecond: 3.2,
    jump: definingWildlifeGroundedJumpConfig(),
  },

  // Jungle — big cats out-pounce lions; primates bounce through the brush.
  tiger: {
    walkSpeedGridPerSecond: 1.5,
    runSpeedGridPerSecond: 4.4,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 5.5,
      jumpSpeedGridPerSecond: 8.5,
      jumpArcPeakPx: 22,
      jumpCooldownMs: 1800,
    },
  },
  jaguar: {
    walkSpeedGridPerSecond: 1.6,
    runSpeedGridPerSecond: 4.3,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 6,
      jumpSpeedGridPerSecond: 8.5,
      jumpArcPeakPx: 24,
      jumpCooldownMs: 1800,
    },
  },
  monkey: {
    walkSpeedGridPerSecond: 1.4,
    runSpeedGridPerSecond: 3.2,
    jump: {
      canJump: true,
      canPounce: false,
      maxJumpDistanceGrid: 3,
      jumpSpeedGridPerSecond: 6.5,
      jumpArcPeakPx: 26,
      jumpCooldownMs: 1600,
    },
  },
  chimp: {
    walkSpeedGridPerSecond: 1.3,
    runSpeedGridPerSecond: 3,
    jump: {
      canJump: true,
      canPounce: true,
      maxJumpDistanceGrid: 2.5,
      jumpSpeedGridPerSecond: 5.5,
      jumpArcPeakPx: 20,
      jumpCooldownMs: 2200,
    },
  },
};

/** Shared no-jump profile for heavy grounded species. */
function definingWildlifeGroundedJumpConfig(): DefiningWildlifeSpeciesJumpConfig {
  return {
    canJump: false,
    canPounce: false,
    maxJumpDistanceGrid: 0,
    jumpSpeedGridPerSecond: 0,
    jumpArcPeakPx: 0,
    jumpCooldownMs: 0,
  };
}

function resolvingWildlifeSpeciesMovementConfig(
  speciesId: DefiningWildlifeSpeciesId
): (typeof DEFINING_WILDLIFE_SPECIES_MOVEMENT)[DefiningWildlifeSpeciesId] {
  return (
    DEFINING_WILDLIFE_SPECIES_MOVEMENT[speciesId] ?? {
      walkSpeedGridPerSecond: 1,
      runSpeedGridPerSecond: 2.6,
      jump: {
        canJump: false,
        canPounce: false,
        maxJumpDistanceGrid: 0,
        jumpSpeedGridPerSecond: 0,
        jumpArcPeakPx: 0,
        jumpCooldownMs: 0,
      },
    }
  );
}

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

/** Species-specific stamina recovery threshold after exhaustion, if configured. */
export function resolvingWildlifeSpeciesStaminaExhaustedRecoveryRatio(
  speciesId: DefiningWildlifeSpeciesId
): number | undefined {
  return DEFINING_WILDLIFE_SPECIES_STAMINA[speciesId]?.exhaustedRecoveryRatio;
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
  /** Optional name-tag parts: `[namePrefix] name [nameSuffix]` per size tier. */
  nameTag?: DefiningWildlifeSpeciesNameTagConfig;
  spriteFolder: string;
  /** Render scale multiplier; sheets are already relatively sized per species. */
  sizeScale: number;
  /** Optional per-species shift on the size bell curve. */
  sizeSpawn?: DefiningWildlifeSpeciesSizeSpawnConfig;
  collisionRadiusGrid: number;
  diet: DefiningWildlifeDietKind;
  trophicTier: 1 | 2 | 3;
  massKg: number;
  temperamentId: DefiningWildlifeTemperamentId;
  /** When this species rests versus stays active across the day/night cycle. */
  activityPattern: DefiningWildlifeActivityPattern;
  aggressionSpawn: DefiningWildlifeSpeciesAggressionSpawnConfig;
  sleepSchedule?: DefiningWildlifeSpeciesSleepScheduleConfig;
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
  /** Prey species this predator abandons other targets to hunt on sight. */
  favoritePreySpeciesIds?: readonly DefiningWildlifeSpeciesId[];
  /** When set, the animal warns intruders near its spawn anchor before fighting. */
  territory?: DefiningWildlifeSpeciesTerritoryConfig;
  /**
   * Optional social reactions beyond temperament trees.
   * `defendsYoung` defaults to true: adults (σ tier ≥ 0) attack whoever hurts a
   * baby (σ tier −2). Set false to opt a species out.
   * `separationAnxiety` defaults to true: young (σ ≤ −1) run to larger allies
   * when they drift too far. Set false to opt a species out.
   */
  socialBehavior?: {
    defendsYoung?: boolean;
    separationAnxiety?: boolean;
  };
  /**
   * Permanent defender damage-roll modifiers applied at spawn (e.g. turtle shell
   * block bias). Stacks with obese frame modifiers when both apply.
   */
  passiveDamageRollModifiers?: readonly DefiningWildlifeSpeciesPassiveDamageRollModifier[];
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

const DEFINING_WILDLIFE_DEFAULT_HUNGER: DefiningWildlifeSpeciesHungerConfig = {
  drainPerSecond: 0.002,
  grazeRefillPerSecond: 0.08,
  killRefillRatio: 0.65,
  peckishThreshold: 0.7,
  hungryThreshold: 0.4,
  starvingThreshold: 0.15,
};

/** Global combat tuning applied to every species at registry build time. */
export const DEFINING_WILDLIFE_HEALTH_AND_ATTACK_POWER_SCALE =
  DEFINING_WILDLIFE_DIFFICULTY_LEVERS.healthAndAttackPowerScale;

type DefiningWildlifeSpeciesRegistryEntry = Omit<
  DefiningWildlifeSpeciesDefinition,
  'loot' | 'jump' | 'vitals'
> & {
  vitals: Omit<
    DefiningWildlifeSpeciesDefinition['vitals'],
    'walkSpeedGridPerSecond' | 'runSpeedGridPerSecond'
  >;
};

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

function attachingWildlifeSpeciesMovement(
  species: DefiningWildlifeSpeciesRegistryEntry
): Omit<DefiningWildlifeSpeciesDefinition, 'loot'> {
  const movement = resolvingWildlifeSpeciesMovementConfig(species.speciesId);

  return {
    ...species,
    jump: movement.jump,
    vitals: {
      ...species.vitals,
      walkSpeedGridPerSecond: movement.walkSpeedGridPerSecond,
      runSpeedGridPerSecond: movement.runSpeedGridPerSecond,
    },
  };
}

function definingWildlifePassiveFarmSpecies(
  speciesId: DefiningWildlifeSpeciesId,
  displayName: string,
  spriteFolder: string,
  massKg: number,
  activityPattern: DefiningWildlifeActivityPattern = 'diurnal'
): DefiningWildlifeSpeciesRegistryEntry {
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
    activityPattern,
    aggressionSpawn: { bellCurveMeanShift: -0.45 },
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 2 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig(speciesId),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 40,
      attackPower: 2,
      defense: 1,
      attackIntervalMs: 1200,
    },
  };
}

/** Optional knobs for the shared herbivore entry builder. */
type DefiningWildlifeHerbivoreSpeciesOptions = {
  temperamentId?: DefiningWildlifeTemperamentId;
  activityPattern?: DefiningWildlifeActivityPattern;
  trophicTier?: 1 | 2 | 3;
  diet?: DefiningWildlifeDietKind;
  sizeScale?: number;
  collisionRadiusGrid?: number;
  aggressionSpawn?: DefiningWildlifeSpeciesAggressionSpawnConfig;
  aggroRadiusGrid?: number;
  packShareRadiusGrid?: number;
  territory?: DefiningWildlifeSpeciesTerritoryConfig;
  hazards?: Partial<DefiningWildlifeSpeciesHazardConfig>;
  vitals: {
    baseMaxHealth: number;
    attackPower: number;
    defense: number;
    attackIntervalMs: number;
  };
};

/**
 * Shared builder for grazing and browsing species (skittish prey, heavy
 * retaliators, and placid stock) so each entry only states what differs.
 */
function definingWildlifeHerbivoreSpecies(
  speciesId: DefiningWildlifeSpeciesId,
  displayName: string,
  spriteFolder: string,
  massKg: number,
  options: DefiningWildlifeHerbivoreSpeciesOptions
): DefiningWildlifeSpeciesRegistryEntry {
  const temperamentId = options.temperamentId ?? 'skittish';
  const defaultBellCurveMeanShift =
    temperamentId === 'retaliator' ? 0.15 : -0.35;

  return {
    speciesId,
    displayName,
    spriteFolder,
    sizeScale: options.sizeScale ?? 1,
    collisionRadiusGrid: options.collisionRadiusGrid ?? 0.38,
    diet: options.diet ?? 'herbivore',
    trophicTier: options.trophicTier ?? 1,
    massKg,
    temperamentId,
    activityPattern: options.activityPattern ?? 'diurnal',
    aggressionSpawn: options.aggressionSpawn ?? {
      bellCurveMeanShift: defaultBellCurveMeanShift,
    },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: options.aggroRadiusGrid ?? 6,
      ...(options.packShareRadiusGrid !== undefined
        ? { packShareRadiusGrid: options.packShareRadiusGrid }
        : {}),
    },
    ...(options.territory ? { territory: options.territory } : {}),
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig(speciesId),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: false,
      ...options.hazards,
    },
    vitals: options.vitals,
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
  DefiningWildlifeSpeciesRegistryEntry
> = {
  cow: definingWildlifePassiveFarmSpecies('cow', 'Cow', 'Cow', 450),
  sheep: definingWildlifePassiveFarmSpecies('sheep', 'Sheep', 'Sheep', 60),
  chicken: {
    ...definingWildlifePassiveFarmSpecies('chicken', 'Chicken', 'Chicken', 3),
    aggressionSpawn: {
      bellCurveMeanShift: -0.45,
      aggressiveAttacksOnSight: true,
    },
    sizeScale: 0.9,
    collisionRadiusGrid: 0.25,
    vitals: {
      baseMaxHealth: 15,
      attackPower: 1,
      defense: 0,
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
    activityPattern: 'crepuscular',
    aggressionSpawn: { bellCurveMeanShift: -0.35 },
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 6 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('deer'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 35,
      attackPower: 3,
      defense: 1,
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
    activityPattern: 'diurnal',
    aggressionSpawn: { bellCurveMeanShift: -0.3 },
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 7 },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('zebra'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 50,
      attackPower: 5,
      defense: 2,
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
    activityPattern: 'crepuscular',
    aggressionSpawn: { bellCurveMeanShift: 0.15 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 5,
      packShareRadiusGrid: 0,
    },
    territory: DEFINING_WILDLIFE_BOAR_TERRITORY_CONFIG,
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('boar'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 55,
      attackPower: 12,
      defense: 4,
      attackIntervalMs: 1300,
    },
  },
  'grey-wolf': {
    speciesId: 'grey-wolf',
    displayName: 'Grey Wolf',
    nameTag: {
      name: 'Wolf',
      tiers: {
        [-2]: { namePrefix: 'Pup' },
        [2]: {
          namePrefix: ['Giant', 'Lead', 'Prime'],
          nameSuffix: null,
        },
      },
    },
    spriteFolder: 'Grey Wolf',
    sizeScale: 0.95,
    collisionRadiusGrid: 0.34,
    diet: 'carnivore',
    trophicTier: 2,
    massKg: 45,
    temperamentId: 'stalker',
    activityPattern: 'nocturnal',
    aggressionSpawn: { bellCurveMeanShift: 0.3 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 8,
      packShareRadiusGrid: 10,
    },
    territory: DEFINING_WILDLIFE_GREY_WOLF_TERRITORY_CONFIG,
    preyAllowSpeciesIds: ['deer', 'zebra', 'cow', 'sheep', 'chicken', 'boar'],
    preyDenySpeciesIds: ['grey-wolf'],
    favoritePreySpeciesIds: ['sheep'],
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.003 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('grey-wolf'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: true,
    },
    vitals: {
      baseMaxHealth: 45,
      attackPower: 14,
      defense: 3,
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
    activityPattern: 'cathemeral',
    aggressionSpawn: { bellCurveMeanShift: 0.2 },
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 6 },
    territory: DEFINING_WILDLIFE_BROWN_BEAR_TERRITORY_CONFIG,
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('brown-bear'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: true,
    },
    vitals: {
      baseMaxHealth: 120,
      attackPower: 22,
      defense: 8,
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
    activityPattern: 'crepuscular',
    aggressionSpawn: { bellCurveMeanShift: 0.35 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 9,
      packShareRadiusGrid: 12,
    },
    territory: DEFINING_WILDLIFE_LION_TERRITORY_CONFIG,
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.0035 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('lion'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 100,
      attackPower: 26,
      defense: 6,
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
    activityPattern: 'crepuscular',
    aggressionSpawn: { bellCurveMeanShift: 0.3 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 9,
      packShareRadiusGrid: 12,
    },
    territory: DEFINING_WILDLIFE_LION_TERRITORY_CONFIG,
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.0035 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('lioness'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 85,
      attackPower: 24,
      defense: 5,
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
    activityPattern: 'cathemeral',
    aggressionSpawn: { bellCurveMeanShift: 0.4 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 3.5,
      leashDistanceGrid: 10,
    },
    hunger: DEFINING_WILDLIFE_DEFAULT_HUNGER,
    stamina: resolvingWildlifeSpeciesStaminaConfig('crocodile'),
    hazards: {
      treatsSwampWaterAsSafe: true,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 90,
      attackPower: 28,
      defense: 10,
      attackIntervalMs: 1800,
    },
    preyAllowSpeciesIds: ['deer', 'zebra', 'cow', 'sheep', 'chicken', 'boar'],
  },

  // --- Savanna roster ---
  antilope: definingWildlifeHerbivoreSpecies(
    'antilope',
    'Antilope',
    'antilope',
    55,
    {
      sizeScale: 0.9,
      collisionRadiusGrid: 0.32,
      aggroRadiusGrid: 7,
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 30,
        attackPower: 2,
        defense: 1,
        attackIntervalMs: 1100,
      },
    }
  ),
  oryx: definingWildlifeHerbivoreSpecies('oryx', 'Oryx', 'Oryx', 200, {
    hazards: { isHeatImmune: true },
    aggroRadiusGrid: 6,
    vitals: {
      baseMaxHealth: 48,
      attackPower: 7,
      defense: 2,
      attackIntervalMs: 1200,
    },
  }),
  giraffe: definingWildlifeHerbivoreSpecies(
    'giraffe',
    'Giraffe',
    'Giraffe',
    900,
    {
      temperamentId: 'retaliator',
      sizeScale: 1.5,
      collisionRadiusGrid: 0.5,
      aggroRadiusGrid: 5,
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 95,
        attackPower: 15,
        defense: 4,
        attackIntervalMs: 1500,
      },
    }
  ),
  ostrich: definingWildlifeHerbivoreSpecies(
    'ostrich',
    'Ostrich',
    'Ostrich',
    110,
    {
      aggressionSpawn: {
        bellCurveMeanShift: -0.2,
        aggressiveAttacksOnSight: true,
      },
      sizeScale: 1.05,
      collisionRadiusGrid: 0.32,
      aggroRadiusGrid: 7,
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 40,
        attackPower: 9,
        defense: 1,
        attackIntervalMs: 1000,
      },
    }
  ),
  elephant: definingWildlifeHerbivoreSpecies(
    'elephant',
    'Elephant',
    'Elephant',
    5000,
    {
      temperamentId: 'retaliator',
      activityPattern: 'cathemeral',
      sizeScale: 1.6,
      collisionRadiusGrid: 0.6,
      aggroRadiusGrid: 6,
      territory: DEFINING_WILDLIFE_MEGAFAUNA_TERRITORY_CONFIG,
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 200,
        attackPower: 30,
        defense: 12,
        attackIntervalMs: 1900,
      },
    }
  ),
  'elephant-female': definingWildlifeHerbivoreSpecies(
    'elephant-female',
    'Elephant Matriarch',
    'Elephant female',
    3500,
    {
      temperamentId: 'retaliator',
      activityPattern: 'cathemeral',
      sizeScale: 1.5,
      collisionRadiusGrid: 0.56,
      aggroRadiusGrid: 6,
      packShareRadiusGrid: 12,
      territory: DEFINING_WILDLIFE_MEGAFAUNA_TERRITORY_CONFIG,
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 170,
        attackPower: 26,
        defense: 10,
        attackIntervalMs: 1800,
      },
    }
  ),
  rhino: definingWildlifeHerbivoreSpecies('rhino', 'Rhino', 'Rhino', 2000, {
    temperamentId: 'retaliator',
    activityPattern: 'crepuscular',
    sizeScale: 1.35,
    collisionRadiusGrid: 0.55,
    aggroRadiusGrid: 5,
    territory: DEFINING_WILDLIFE_HEAVY_GRAZER_TERRITORY_CONFIG,
    hazards: { isHeatImmune: true },
    vitals: {
      baseMaxHealth: 150,
      attackPower: 28,
      defense: 12,
      attackIntervalMs: 1700,
    },
  }),
  'rhino-female': definingWildlifeHerbivoreSpecies(
    'rhino-female',
    'Rhino Cow',
    'Rhino Female',
    1600,
    {
      temperamentId: 'retaliator',
      activityPattern: 'crepuscular',
      sizeScale: 1.3,
      collisionRadiusGrid: 0.52,
      aggroRadiusGrid: 5,
      territory: DEFINING_WILDLIFE_HEAVY_GRAZER_TERRITORY_CONFIG,
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 130,
        attackPower: 24,
        defense: 10,
        attackIntervalMs: 1700,
      },
    }
  ),
  hyena: {
    speciesId: 'hyena',
    displayName: 'Hyena',
    spriteFolder: 'Hayena',
    sizeScale: 0.95,
    collisionRadiusGrid: 0.34,
    diet: 'carnivore',
    trophicTier: 2,
    massKg: 60,
    temperamentId: 'stalker',
    activityPattern: 'nocturnal',
    aggressionSpawn: { bellCurveMeanShift: 0.3 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 8,
      packShareRadiusGrid: 10,
    },
    territory: DEFINING_WILDLIFE_GREY_WOLF_TERRITORY_CONFIG,
    preyAllowSpeciesIds: [
      'antilope',
      'zebra',
      'oryx',
      'ostrich',
      'deer',
      'sheep',
      'chicken',
    ],
    preyDenySpeciesIds: ['hyena'],
    favoritePreySpeciesIds: ['antilope'],
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.003 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('hyena'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 42,
      attackPower: 13,
      defense: 3,
      attackIntervalMs: 950,
    },
  },

  // --- Plains herds and feral horses ---
  bison: definingWildlifeHerbivoreSpecies('bison', 'Bison', 'Bison', 900, {
    temperamentId: 'retaliator',
    activityPattern: 'cathemeral',
    sizeScale: 1.25,
    collisionRadiusGrid: 0.5,
    aggroRadiusGrid: 5,
    packShareRadiusGrid: 10,
    territory: DEFINING_WILDLIFE_HEAVY_GRAZER_TERRITORY_CONFIG,
    hazards: { isColdImmune: true },
    vitals: {
      baseMaxHealth: 110,
      attackPower: 16,
      defense: 8,
      attackIntervalMs: 1500,
    },
  }),
  pig: definingWildlifePassiveFarmSpecies('pig', 'Pig', 'Pig', 120),
  bull: definingWildlifeHerbivoreSpecies('bull', 'Bull', 'Bull', 800, {
    temperamentId: 'retaliator',
    sizeScale: 1.15,
    collisionRadiusGrid: 0.46,
    aggroRadiusGrid: 5,
    aggressionSpawn: { bellCurveMeanShift: 0.3 },
    territory: DEFINING_WILDLIFE_HEAVY_GRAZER_TERRITORY_CONFIG,
    vitals: {
      baseMaxHealth: 90,
      attackPower: 18,
      defense: 6,
      attackIntervalMs: 1400,
    },
  }),
  stag: definingWildlifeHerbivoreSpecies('stag', 'Stag', 'Stag', 140, {
    activityPattern: 'crepuscular',
    sizeScale: 1.05,
    aggroRadiusGrid: 6,
    vitals: {
      baseMaxHealth: 48,
      attackPower: 8,
      defense: 2,
      attackIntervalMs: 1200,
    },
  }),
  'brown-horse': definingWildlifeHerbivoreSpecies(
    'brown-horse',
    'Brown Horse',
    'Brown Horse',
    450,
    {
      sizeScale: 1.1,
      aggroRadiusGrid: 7,
      packShareRadiusGrid: 10,
      vitals: {
        baseMaxHealth: 55,
        attackPower: 6,
        defense: 2,
        attackIntervalMs: 1200,
      },
    }
  ),
  'work-horse': definingWildlifeHerbivoreSpecies(
    'work-horse',
    'Work Horse',
    'Work Horse',
    700,
    {
      sizeScale: 1.15,
      collisionRadiusGrid: 0.42,
      aggroRadiusGrid: 6,
      packShareRadiusGrid: 10,
      vitals: {
        baseMaxHealth: 65,
        attackPower: 8,
        defense: 3,
        attackIntervalMs: 1300,
      },
    }
  ),
  'arabian-horse': definingWildlifeHerbivoreSpecies(
    'arabian-horse',
    'Arabian Horse',
    'Arabian horse',
    400,
    {
      sizeScale: 1.08,
      aggroRadiusGrid: 8,
      packShareRadiusGrid: 10,
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 52,
        attackPower: 5,
        defense: 2,
        attackIntervalMs: 1200,
      },
    }
  ),
  donkey: definingWildlifeHerbivoreSpecies('donkey', 'Donkey', 'Donkey', 250, {
    sizeScale: 0.95,
    aggroRadiusGrid: 5,
    vitals: {
      baseMaxHealth: 45,
      attackPower: 7,
      defense: 2,
      attackIntervalMs: 1300,
    },
  }),

  // --- Wetland and shore ---
  hippo: definingWildlifeHerbivoreSpecies('hippo', 'Hippo', 'Hippo', 1500, {
    temperamentId: 'retaliator',
    activityPattern: 'nocturnal',
    sizeScale: 1.35,
    collisionRadiusGrid: 0.56,
    aggroRadiusGrid: 6,
    aggressionSpawn: { bellCurveMeanShift: 0.35 },
    territory: DEFINING_WILDLIFE_MEGAFAUNA_TERRITORY_CONFIG,
    hazards: { treatsSwampWaterAsSafe: true, isHeatImmune: true },
    vitals: {
      baseMaxHealth: 160,
      attackPower: 30,
      defense: 10,
      attackIntervalMs: 1700,
    },
  }),
  'water-buffalo': definingWildlifeHerbivoreSpecies(
    'water-buffalo',
    'Water Buffalo',
    'Water buffalo',
    700,
    {
      temperamentId: 'retaliator',
      sizeScale: 1.2,
      collisionRadiusGrid: 0.48,
      aggroRadiusGrid: 5,
      packShareRadiusGrid: 10,
      territory: DEFINING_WILDLIFE_HEAVY_GRAZER_TERRITORY_CONFIG,
      hazards: { treatsSwampWaterAsSafe: true },
      vitals: {
        baseMaxHealth: 100,
        attackPower: 16,
        defense: 7,
        attackIntervalMs: 1500,
      },
    }
  ),
  turtle: {
    ...definingWildlifeHerbivoreSpecies('turtle', 'Turtle', 'Turtle', 50, {
      temperamentId: 'passive',
      activityPattern: 'cathemeral',
      sizeScale: 0.8,
      collisionRadiusGrid: 0.28,
      aggroRadiusGrid: 2,
      aggressionSpawn: { bellCurveMeanShift: -0.5 },
      hazards: { treatsSwampWaterAsSafe: true },
      vitals: {
        baseMaxHealth: 30,
        attackPower: 1,
        defense: 8,
        attackIntervalMs: 1600,
      },
    }),
    passiveDamageRollModifiers: [
      {
        id: DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID,
        kind: 'block_bias',
        value: DEFINING_WILDLIFE_TURTLE_SHELL_INCOMING_BLOCK_BIAS,
      },
    ],
  },
  tortoise: definingWildlifeHerbivoreSpecies(
    'tortoise',
    'Tortoise',
    'Toirtois',
    100,
    {
      temperamentId: 'passive',
      sizeScale: 0.9,
      collisionRadiusGrid: 0.32,
      aggroRadiusGrid: 2,
      aggressionSpawn: { bellCurveMeanShift: -0.5 },
      hazards: { isHeatImmune: true },
      vitals: {
        baseMaxHealth: 40,
        attackPower: 1,
        defense: 10,
        attackIntervalMs: 1800,
      },
    }
  ),

  // --- Cold country ---
  'polar-bear': {
    speciesId: 'polar-bear',
    displayName: 'Polar Bear',
    spriteFolder: 'Polar Bear',
    sizeScale: 1.4,
    collisionRadiusGrid: 0.52,
    diet: 'carnivore',
    trophicTier: 3,
    massKg: 450,
    temperamentId: 'predator',
    activityPattern: 'cathemeral',
    aggressionSpawn: { bellCurveMeanShift: 0.3 },
    aggro: { ...DEFINING_WILDLIFE_DEFAULT_AGGRO, aggroRadiusGrid: 7 },
    territory: DEFINING_WILDLIFE_BROWN_BEAR_TERRITORY_CONFIG,
    preyAllowSpeciesIds: ['deer', 'stag', 'sheep', 'boar'],
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.0035 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('polar-bear'),
    hazards: {
      treatsSwampWaterAsSafe: false,
      treatsLavaAsLethal: true,
      isHeatImmune: false,
      isColdImmune: true,
    },
    vitals: {
      baseMaxHealth: 130,
      attackPower: 24,
      defense: 8,
      attackIntervalMs: 1500,
    },
  },
  mammoth: definingWildlifeHerbivoreSpecies(
    'mammoth',
    'Mammoth',
    'Mammoth',
    6000,
    {
      temperamentId: 'retaliator',
      activityPattern: 'cathemeral',
      sizeScale: 1.7,
      collisionRadiusGrid: 0.65,
      aggroRadiusGrid: 6,
      territory: DEFINING_WILDLIFE_MEGAFAUNA_TERRITORY_CONFIG,
      hazards: { isColdImmune: true },
      vitals: {
        baseMaxHealth: 220,
        attackPower: 32,
        defense: 14,
        attackIntervalMs: 2000,
      },
    }
  ),

  // --- Desert and highland stock ---
  camel: definingWildlifeHerbivoreSpecies('camel', 'Camel', 'Camel', 500, {
    temperamentId: 'passive',
    sizeScale: 1.2,
    collisionRadiusGrid: 0.42,
    aggroRadiusGrid: 3,
    aggressionSpawn: { bellCurveMeanShift: -0.4 },
    hazards: { isHeatImmune: true },
    vitals: {
      baseMaxHealth: 60,
      attackPower: 4,
      defense: 3,
      attackIntervalMs: 1400,
    },
  }),
  ram: definingWildlifeHerbivoreSpecies('ram', 'Ram', 'Ram', 100, {
    temperamentId: 'retaliator',
    activityPattern: 'crepuscular',
    aggroRadiusGrid: 5,
    territory: DEFINING_WILDLIFE_BOAR_TERRITORY_CONFIG,
    hazards: { isColdImmune: true },
    vitals: {
      baseMaxHealth: 50,
      attackPower: 10,
      defense: 4,
      attackIntervalMs: 1300,
    },
  }),
  llama: definingWildlifeHerbivoreSpecies('llama', 'Llama', 'Lama', 150, {
    temperamentId: 'passive',
    aggroRadiusGrid: 3,
    aggressionSpawn: { bellCurveMeanShift: -0.3 },
    hazards: { isColdImmune: true },
    vitals: {
      baseMaxHealth: 45,
      attackPower: 4,
      defense: 2,
      attackIntervalMs: 1300,
    },
  }),
  alpaca: definingWildlifeHerbivoreSpecies('alpaca', 'Alpaca', 'Alpacha', 70, {
    temperamentId: 'passive',
    sizeScale: 0.92,
    collisionRadiusGrid: 0.32,
    aggroRadiusGrid: 3,
    aggressionSpawn: { bellCurveMeanShift: -0.45 },
    hazards: { isColdImmune: true },
    vitals: {
      baseMaxHealth: 35,
      attackPower: 2,
      defense: 1,
      attackIntervalMs: 1300,
    },
  }),
  yak: definingWildlifeHerbivoreSpecies('yak', 'Yak', 'Jak', 600, {
    temperamentId: 'retaliator',
    activityPattern: 'cathemeral',
    sizeScale: 1.2,
    collisionRadiusGrid: 0.48,
    aggroRadiusGrid: 5,
    territory: DEFINING_WILDLIFE_HEAVY_GRAZER_TERRITORY_CONFIG,
    hazards: { isColdImmune: true },
    vitals: {
      baseMaxHealth: 95,
      attackPower: 14,
      defense: 8,
      attackIntervalMs: 1500,
    },
  }),

  // --- Jungle ---
  tiger: {
    speciesId: 'tiger',
    displayName: 'Tiger',
    spriteFolder: 'Tiger',
    sizeScale: 1.15,
    collisionRadiusGrid: 0.46,
    diet: 'carnivore',
    trophicTier: 3,
    massKg: 220,
    temperamentId: 'predator',
    activityPattern: 'crepuscular',
    aggressionSpawn: { bellCurveMeanShift: 0.35 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 9,
      packShareRadiusGrid: 0,
    },
    territory: DEFINING_WILDLIFE_LION_TERRITORY_CONFIG,
    preyAllowSpeciesIds: ['boar', 'pig', 'deer', 'monkey', 'chimp'],
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.0035 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('tiger'),
    hazards: {
      treatsSwampWaterAsSafe: true,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 110,
      attackPower: 28,
      defense: 6,
      attackIntervalMs: 1200,
    },
  },
  jaguar: {
    speciesId: 'jaguar',
    displayName: 'Jaguar',
    spriteFolder: 'Jaguar',
    sizeScale: 1,
    collisionRadiusGrid: 0.4,
    diet: 'carnivore',
    trophicTier: 3,
    massKg: 95,
    temperamentId: 'ambusher',
    activityPattern: 'nocturnal',
    aggressionSpawn: { bellCurveMeanShift: 0.35 },
    aggro: {
      ...DEFINING_WILDLIFE_DEFAULT_AGGRO,
      aggroRadiusGrid: 5,
      leashDistanceGrid: 14,
      packShareRadiusGrid: 0,
    },
    preyAllowSpeciesIds: ['boar', 'pig', 'deer', 'monkey', 'chimp'],
    hunger: { ...DEFINING_WILDLIFE_DEFAULT_HUNGER, drainPerSecond: 0.0035 },
    stamina: resolvingWildlifeSpeciesStaminaConfig('jaguar'),
    hazards: {
      treatsSwampWaterAsSafe: true,
      treatsLavaAsLethal: true,
      isHeatImmune: true,
      isColdImmune: false,
    },
    vitals: {
      baseMaxHealth: 80,
      attackPower: 24,
      defense: 4,
      attackIntervalMs: 1000,
    },
  },
  monkey: definingWildlifeHerbivoreSpecies('monkey', 'Monkey', 'Monkey', 12, {
    diet: 'omnivore',
    sizeScale: 0.8,
    collisionRadiusGrid: 0.25,
    aggroRadiusGrid: 6,
    packShareRadiusGrid: 8,
    hazards: { isHeatImmune: true },
    vitals: {
      baseMaxHealth: 20,
      attackPower: 3,
      defense: 0,
      attackIntervalMs: 900,
    },
  }),
  chimp: definingWildlifeHerbivoreSpecies('chimp', 'Chimp', 'Chimp', 50, {
    diet: 'omnivore',
    temperamentId: 'retaliator',
    trophicTier: 2,
    sizeScale: 0.95,
    collisionRadiusGrid: 0.32,
    aggroRadiusGrid: 5,
    packShareRadiusGrid: 8,
    territory: DEFINING_WILDLIFE_BOAR_TERRITORY_CONFIG,
    hazards: { isHeatImmune: true },
    vitals: {
      baseMaxHealth: 55,
      attackPower: 12,
      defense: 3,
      attackIntervalMs: 1000,
    },
  }),
};

/** Starter roster covering every AI archetype. */
export const DEFINING_WILDLIFE_SPECIES_REGISTRY: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesDefinition
> = Object.fromEntries(
  Object.entries(DEFINING_WILDLIFE_SPECIES_REGISTRY_BASE).map(
    ([speciesId, species]) => [
      speciesId,
      attachingWildlifeSpeciesLoot(
        scalingWildlifeSpeciesCombatVitals(
          attachingWildlifeSpeciesMovement(species)
        )
      ),
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
