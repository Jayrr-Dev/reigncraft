/**
 * Character engine template for playable animal skins.
 * Inherits wildlife identity (ratios, speed, mass, immunities) scaled into
 * player transform combat space.
 *
 * @module components/world/domains/buildingWorldPlazaDefaultAnimalCharacterEngineDefinition
 */

import {
  computingWorldPlazaCharacterEngineGrowthLanePerLevel,
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineGrowthLaneConstants';
import type {
  DefiningWorldPlazaCharacterEngineDefinition,
  DefiningWorldPlazaCharacterEngineImmunity,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG } from '@/components/world/character/domains/definingWorldPlazaCharacterWeightDisplayConstants';
import type { DefiningWorldPlazaAnimalPlayableAvatarSkinRow } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import { DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesIdAliases';
import {
  computingWorldPlazaAnimalTransformMatureCombatStat,
  DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_ATTACK_FROM_AUTHOR_MULTIPLIER,
  DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_HEALTH_FROM_AUTHOR_MULTIPLIER,
} from '@/components/world/domains/definingWorldPlazaAnimalTransformVitalsScaleConstants';
import { DEFINING_WORLD_PLAZA_STRENGTH_PLAYER_BASELINE_ATTACK_INTERVAL_MS } from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';
import {
  resolvingWildlifeSpeciesDefinition,
  type DefiningWildlifeSpeciesDefinition,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

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

/**
 * Builds a character engine definition for one animal playable skin row.
 * Mature combat vitals are wildlife-authored values scaled into player space;
 * unlocks keep the −20 growth lane (25% floor → full at parity).
 */
export function buildingWorldPlazaDefaultAnimalCharacterEngineDefinition(
  skinRow: DefiningWorldPlazaAnimalPlayableAvatarSkinRow
): DefiningWorldPlazaCharacterEngineDefinition {
  const species =
    resolvingWorldPlazaAnimalCharacterEngineWildlifeSpecies(skinRow);

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
      massKg: DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG,
      stats: {
        attackPower: 300,
        attackSpeed: 1,
        defense: 5,
        hungerDrainMultiplier: skinRow.hungerDrainMultiplier,
      },
      scaling: {
        level: 1,
        healthPerLevel:
          computingWorldPlazaCharacterEngineGrowthLanePerLevel(1000),
        attackPerLevel:
          computingWorldPlazaCharacterEngineGrowthLanePerLevel(300),
        defensePerLevel:
          computingWorldPlazaCharacterEngineGrowthLanePerLevel(5),
        growthLaneLevelOffset:
          DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET,
      },
      immunities: [],
      startingStatusEffectIds: [],
      skillIds: ['minor-heal', 'swift-stride'],
    };
  }

  const { vitals } = species;
  const matureMaxHealth = computingWorldPlazaAnimalTransformMatureCombatStat({
    wildlifeRuntimeStat: vitals.baseMaxHealth,
    fromAuthorMultiplier:
      DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_HEALTH_FROM_AUTHOR_MULTIPLIER,
  });
  const matureAttackPower = computingWorldPlazaAnimalTransformMatureCombatStat({
    wildlifeRuntimeStat: vitals.attackPower,
    fromAuthorMultiplier:
      DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_ATTACK_FROM_AUTHOR_MULTIPLIER,
  });
  const matureDefense = vitals.defense;

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
    vitals: { baseMaxHealth: matureMaxHealth },
    massKg: species.massKg,
    stats: {
      attackPower: matureAttackPower,
      attackSpeed: computingWorldPlazaAnimalCharacterEngineAttackSpeed(
        vitals.attackIntervalMs
      ),
      defense: matureDefense,
      hungerDrainMultiplier: skinRow.hungerDrainMultiplier,
    },
    scaling: {
      level: 1,
      healthPerLevel:
        computingWorldPlazaCharacterEngineGrowthLanePerLevel(matureMaxHealth),
      attackPerLevel:
        computingWorldPlazaCharacterEngineGrowthLanePerLevel(matureAttackPower),
      defensePerLevel:
        computingWorldPlazaCharacterEngineGrowthLanePerLevel(matureDefense),
      growthLaneLevelOffset:
        DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET,
    },
    immunities: resolvingWorldPlazaAnimalCharacterEngineImmunities(species),
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'swift-stride'],
  };
}
