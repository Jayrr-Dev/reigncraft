/**
 * Land wildlife species stubs for fishing catch creatures (bestiary + meat loot).
 * Not biome-spawned; presentation is glow-orb in-world, emoji in bestiary.
 *
 * @module components/world/wildlife/domains/buildingWildlifeFishSpeciesDefinitions
 */

import { listingWorldPlazaFishingCatchCreatures } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Fish species stub before loot / movement attach. */
export type BuildingWildlifeFishSpeciesRegistryEntry = {
  speciesId: DefiningWildlifeSpeciesId;
  displayName: string;
  spriteFolder: string;
  presentationKind: 'glowOrb';
  portraitEmoji: string;
  neverSleeps: true;
  passiveTraitIds: readonly ['never-triggers-wildlife-aggro'];
  sizeScale: number;
  collisionRadiusGrid: number;
  diet: 'carnivore';
  trophicTier: 1;
  massKg: number;
  temperamentId: 'passive';
  activityPattern: 'cathemeral';
  aggressionSpawn: { bellCurveMeanShift: number };
  socialBehavior: {
    defendsYoung: false;
    separationAnxiety: false;
  };
  aggro: {
    aggroRadiusGrid: number;
    threatPerDamage: number;
    threatDecayPerSecond: number;
    leashDistanceGrid: number;
    packShareRadiusGrid: number;
    targetSwitchMargin: number;
    proximityThreatAtStarving: number;
  };
  hunger: {
    drainPerSecond: number;
    grazeRefillPerSecond: number;
    killRefillRatio: number;
    peckishThreshold: number;
    hungryThreshold: number;
    starvingThreshold: number;
  };
  stamina: { drainMultiplier: number; regenMultiplier: number };
  hazards: {
    treatsSwampWaterAsSafe: true;
    treatsLavaAsLethal: true;
    isHeatImmune: false;
    isColdImmune: false;
  };
  vitals: {
    baseMaxHealth: number;
    attackPower: number;
    defense: number;
    attackIntervalMs: number;
  };
};

const DEFINING_WILDLIFE_FISH_DEFAULT_AGGRO = {
  aggroRadiusGrid: 0,
  threatPerDamage: 1,
  threatDecayPerSecond: 0.5,
  leashDistanceGrid: 8,
  packShareRadiusGrid: 0,
  targetSwitchMargin: 1,
  proximityThreatAtStarving: 0,
} as const;

const DEFINING_WILDLIFE_FISH_DEFAULT_HUNGER = {
  drainPerSecond: 0,
  grazeRefillPerSecond: 0,
  killRefillRatio: 0,
  peckishThreshold: 0.7,
  hungryThreshold: 0.4,
  starvingThreshold: 0.15,
} as const;

function formattingFishDisplayName(rawDisplayName: string): string {
  return rawDisplayName.replace(/^Raw\s+/u, '');
}

/**
 * Builds one passive aquatic species stub per fishing catch creature.
 */
export function buildingWildlifeFishSpeciesDefinitions(): Record<
  DefiningWildlifeSpeciesId,
  BuildingWildlifeFishSpeciesRegistryEntry
> {
  const entries: Record<
    DefiningWildlifeSpeciesId,
    BuildingWildlifeFishSpeciesRegistryEntry
  > = {};

  for (const creature of listingWorldPlazaFishingCatchCreatures()) {
    const massKg = Math.max(
      0.15,
      Math.round(creature.cookedHungerRestoreRatio * 8 * 100) / 100
    );

    entries[creature.catchId] = {
      speciesId: creature.catchId,
      displayName: formattingFishDisplayName(creature.rawDisplayName),
      spriteFolder: `fish/${creature.catchId}`,
      presentationKind: 'glowOrb',
      portraitEmoji: creature.rawIconEmoji,
      neverSleeps: true,
      passiveTraitIds: ['never-triggers-wildlife-aggro'],
      sizeScale: 0.55 + creature.cookedHungerRestoreRatio,
      collisionRadiusGrid: 0.12,
      diet: 'carnivore',
      trophicTier: 1,
      massKg,
      temperamentId: 'passive',
      activityPattern: 'cathemeral',
      aggressionSpawn: { bellCurveMeanShift: -2 },
      socialBehavior: {
        defendsYoung: false,
        separationAnxiety: false,
      },
      aggro: { ...DEFINING_WILDLIFE_FISH_DEFAULT_AGGRO },
      hunger: { ...DEFINING_WILDLIFE_FISH_DEFAULT_HUNGER },
      stamina: { drainMultiplier: 1, regenMultiplier: 1 },
      hazards: {
        treatsSwampWaterAsSafe: true,
        treatsLavaAsLethal: true,
        isHeatImmune: false,
        isColdImmune: false,
      },
      vitals: {
        baseMaxHealth: Math.max(6, Math.round(massKg * 12)),
        attackPower: 1,
        defense: 0,
        attackIntervalMs: 1_500,
      },
    };
  }

  return entries;
}
