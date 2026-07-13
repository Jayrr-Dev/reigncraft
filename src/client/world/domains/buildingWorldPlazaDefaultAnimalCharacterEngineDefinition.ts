/**
 * Character engine template for playable animal skins.
 * Inherits mature combat/movement vitals from the matching wildlife species.
 *
 * @module components/world/domains/buildingWorldPlazaDefaultAnimalCharacterEngineDefinition
 */

import { DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineGrowthLaneConstants';
import type {
  DefiningWorldPlazaCharacterEngineDefinition,
  DefiningWorldPlazaCharacterEngineImmunity,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import type { DefiningWorldPlazaAnimalPlayableAvatarSkinRow } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import { DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesIdAliases';
import { DEFINING_WORLD_PLAZA_STRENGTH_PLAYER_BASELINE_ATTACK_INTERVAL_MS } from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';
import {
  resolvingWildlifeSpeciesDefinition,
  type DefiningWildlifeSpeciesDefinition,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Growth steps from unlock (−20 lane) back to mature wildlife vitals.
 * Matches `|UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET|`.
 */
const DEFINING_WORLD_PLAZA_ANIMAL_CHARACTER_ENGINE_GROWTH_LANE_STEPS = Math.abs(
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET
);

/**
 * Maps measured frame height to avatar size scale when wildlife size is missing.
 */
function computingWorldPlazaDefaultAnimalCharacterEngineSizeScale(
  frameHeightPx: number
): number {
  if (frameHeightPx <= 64) {
    return 0.95;
  }

  if (frameHeightPx <= 74) {
    return 1.0;
  }

  if (frameHeightPx <= 84) {
    return 1.05;
  }

  if (frameHeightPx <= 96) {
    return 1.15;
  }

  return 1.25;
}

function resolvingWorldPlazaAnimalCharacterEngineWildlifeSpecies(
  skinRow: DefiningWorldPlazaAnimalPlayableAvatarSkinRow
): DefiningWildlifeSpeciesDefinition | null {
  const mappedSpeciesId =
    DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID[
      skinRow.spriteFolder
    ] ?? (skinRow.spriteFolder as DefiningWildlifeSpeciesId);

  return resolvingWildlifeSpeciesDefinition(mappedSpeciesId);
}

function resolvingWorldPlazaAnimalCharacterEngineImmunities(
  species: DefiningWildlifeSpeciesDefinition
): readonly DefiningWorldPlazaCharacterEngineImmunity[] {
  const immunities: DefiningWorldPlazaCharacterEngineImmunity[] = [];

  if (species.hazards.isColdImmune) {
    immunities.push('cold');
  }

  if (species.hazards.isHeatImmune) {
    immunities.push('heat');
  }

  if (!species.hazards.treatsLavaAsLethal) {
    immunities.push('lava');
  }

  return immunities;
}

function computingWorldPlazaAnimalCharacterEngineAttackSpeed(
  attackIntervalMs: number
): number {
  return (
    DEFINING_WORLD_PLAZA_STRENGTH_PLAYER_BASELINE_ATTACK_INTERVAL_MS /
    Math.max(1, attackIntervalMs)
  );
}

function computingWorldPlazaAnimalCharacterEnginePerLevel(
  matureStat: number
): number {
  return Math.max(
    1,
    matureStat / DEFINING_WORLD_PLAZA_ANIMAL_CHARACTER_ENGINE_GROWTH_LANE_STEPS
  );
}

/**
 * Builds a character engine definition for one animal playable skin row.
 * Mature vitals/locomotion come from wildlife; unlocks keep the −20 growth lane.
 */
export function buildingWorldPlazaDefaultAnimalCharacterEngineDefinition(
  skinRow: DefiningWorldPlazaAnimalPlayableAvatarSkinRow
): DefiningWorldPlazaCharacterEngineDefinition {
  const species = resolvingWorldPlazaAnimalCharacterEngineWildlifeSpecies(skinRow);

  if (!species) {
    return {
      characterId: skinRow.skinId,
      displayName: skinRow.displayName,
      presentation: { skinId: skinRow.skinId },
      size: {
        sizeScale: computingWorldPlazaDefaultAnimalCharacterEngineSizeScale(
          skinRow.frameHeightPx
        ),
      },
      locomotion: {
        allowedMotionKinds: ['idle', 'walk', 'run', 'jump'],
      },
      vitals: { baseMaxHealth: 1000 },
      stats: {
        attackPower: 300,
        attackSpeed: 1,
        defense: 5,
        hungerDrainMultiplier: skinRow.hungerDrainMultiplier,
      },
      scaling: {
        level: 1,
        healthPerLevel: 50,
        attackPerLevel: 2,
        defensePerLevel: 1,
        growthLaneLevelOffset:
          DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET,
      },
      immunities: [],
      startingStatusEffectIds: [],
      skillIds: ['minor-heal', 'swift-stride'],
    };
  }

  const { vitals } = species;

  return {
    characterId: skinRow.skinId,
    displayName: skinRow.displayName,
    presentation: { skinId: skinRow.skinId },
    size: {
      sizeScale: species.sizeScale,
      collisionRadiusGrid: species.collisionRadiusGrid,
    },
    locomotion: {
      allowedMotionKinds: ['idle', 'walk', 'run', 'jump'],
      walkSpeedGridPerSecond: vitals.walkSpeedGridPerSecond,
      runSpeedGridPerSecond: vitals.runSpeedGridPerSecond,
    },
    vitals: { baseMaxHealth: vitals.baseMaxHealth },
    stats: {
      attackPower: vitals.attackPower,
      attackSpeed: computingWorldPlazaAnimalCharacterEngineAttackSpeed(
        vitals.attackIntervalMs
      ),
      defense: vitals.defense,
      hungerDrainMultiplier: skinRow.hungerDrainMultiplier,
    },
    scaling: {
      level: 1,
      healthPerLevel: computingWorldPlazaAnimalCharacterEnginePerLevel(
        vitals.baseMaxHealth
      ),
      attackPerLevel: computingWorldPlazaAnimalCharacterEnginePerLevel(
        vitals.attackPower
      ),
      defensePerLevel: Math.max(
        0,
        vitals.defense /
          DEFINING_WORLD_PLAZA_ANIMAL_CHARACTER_ENGINE_GROWTH_LANE_STEPS
      ),
      growthLaneLevelOffset:
        DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET,
    },
    immunities: resolvingWorldPlazaAnimalCharacterEngineImmunities(species),
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'swift-stride'],
  };
}
