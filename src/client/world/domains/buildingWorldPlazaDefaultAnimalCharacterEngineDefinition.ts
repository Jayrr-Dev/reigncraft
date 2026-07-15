/**
 * Character engine template for playable animal skins.
 * Inherits wildlife vitals 1:1 (runtime HP/atk/def, speed, mass, immunities).
 *
 * @module components/world/domains/buildingWorldPlazaDefaultAnimalCharacterEngineDefinition
 */

import type {
  DefiningWorldPlazaCharacterEngineDefinition,
  DefiningWorldPlazaCharacterEngineImmunity,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG } from '@/components/world/character/domains/definingWorldPlazaCharacterWeightDisplayConstants';
import type { DefiningWorldPlazaAnimalPlayableAvatarSkinRow } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import { DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_SPRITE_FOLDER_TO_WILDLIFE_SPECIES_ID } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesIdAliases';
import { DEFINING_WORLD_PLAZA_STRENGTH_PLAYER_BASELINE_ATTACK_INTERVAL_MS } from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';
import {
  DEFINING_WILDLIFE_CYROBORN_EXTRA_CHARACTER_IMMUNITIES,
  DEFINING_WILDLIFE_CYROBORN_JUMP_SPEED_SCALE,
  DEFINING_WILDLIFE_CYROBORN_SPECIES_ID,
} from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
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

  if (species.speciesId === DEFINING_WILDLIFE_CYROBORN_SPECIES_ID) {
    for (const immunity of DEFINING_WILDLIFE_CYROBORN_EXTRA_CHARACTER_IMMUNITIES) {
      if (!immunities.includes(immunity)) {
        immunities.push(immunity);
      }
    }
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

/** Per-level bump from species mature stats (20 levels ≈ +100% of base). */
function computingWorldPlazaAnimalCharacterEnginePerLevel(
  matureStat: number
): number {
  return Math.max(0, matureStat / 20);
}

/**
 * Builds a character engine definition for one animal playable skin row.
 * Combat vitals match the wildlife species counterpart at level 1.
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
        healthPerLevel: 50,
        attackPerLevel: 2,
        defensePerLevel: 1,
      },
      immunities: [],
      startingStatusEffectIds: [],
      skillIds: ['minor-heal', 'swift-stride'],
    };
  }

  const { vitals, jump } = species;
  const allowedMotionKinds = jump.canJump
    ? (['idle', 'walk', 'run', 'jump'] as const)
    : (['idle', 'walk', 'run'] as const);

  return {
    characterId: skinRow.skinId,
    displayName: skinRow.displayName,
    presentation: { skinId: skinRow.skinId },
    size: {
      sizeScale: species.sizeScale,
      collisionRadiusGrid: species.collisionRadiusGrid,
    },
    locomotion: {
      allowedMotionKinds,
      walkSpeedGridPerSecond: vitals.walkSpeedGridPerSecond,
      runSpeedGridPerSecond: vitals.runSpeedGridPerSecond,
      maxJumpLayerReach: jump.maxJumpLayerReach,
      ...(species.speciesId === DEFINING_WILDLIFE_CYROBORN_SPECIES_ID
        ? { jumpSpeedScale: DEFINING_WILDLIFE_CYROBORN_JUMP_SPEED_SCALE }
        : {}),
    },
    vitals: { baseMaxHealth: vitals.baseMaxHealth },
    massKg: species.massKg,
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
      defensePerLevel: computingWorldPlazaAnimalCharacterEnginePerLevel(
        vitals.defense
      ),
    },
    immunities: resolvingWorldPlazaAnimalCharacterEngineImmunities(species),
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'swift-stride'],
  };
}
